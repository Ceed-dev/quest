/**
 * HomePage
 * ---------------------------------------------------------------------------
 * - Fetch quests from context and render:
 *   1. HeroCarousel (top, wide image)
 *   2. Quest grid (cards with square image)
 */

"use client";

import { ItemCard } from "@/components/shared/ItemCard";
import HeroCarousel, { HeroQuest } from "@/components/HeroCarousel";
import { useQuestsContext } from "@/context/questsContext";
import { useTranslations } from "next-intl";
import type { Quest } from "@/types/quest";

/** Pick a quest image URL by usage with safe fallbacks */
function pickQuestImageUrl(quest: Quest, usage: "square" | "wide"): string {
  const imgs = quest.backgroundImages ?? [];
  const exact = imgs.find((i) => i.usage === usage)?.url;
  if (exact) return exact;
  if (imgs[0]?.url) return imgs[0].url;
  return quest.project.logoUrl || "";
}

export default function HomePage() {
  const { quests, isLoading, error } = useQuestsContext();
  const t = useTranslations("home");

  const items: HeroQuest[] = quests
    .filter((q) => q.settings.heroCarouselOrder !== null)
    .sort(
      (a, b) => a.settings.heroCarouselOrder! - b.settings.heroCarouselOrder!,
    )
    .map((q) => ({
      id: q.id,
      wideImageUrl: pickQuestImageUrl(q, "wide"),
      squareImageUrl: pickQuestImageUrl(q, "square"),
      iconUrl: q.project.logoUrl,
      projectName: q.project.name,
      title: q.title,
      description: q.catchphrase,
      points: q.tasks.reduce((s, t) => s + t.points, 0),
    }));

  if (isLoading) {
    return <p className="text-center text-gray-500 py-10">{t("loading")}</p>;
  }
  if (error) {
    return (
      <p className="text-center text-red-500 py-10">
        {t("error")}: {error.message}
      </p>
    );
  }
  if (quests.length === 0) {
    return <p className="text-center text-gray-500 py-10">{t("empty")}</p>;
  }

  return (
    <>
      {/* Hero carousel (wide image) */}
      <HeroCarousel items={items} className="mb-10" />

      <div className="w-full">
        {/* Section heading */}
        <h1 className="mb-6 text-[32px] md:text-[40px] xl:text-[64px] font-extrabold leading-none tracking-wide uppercase text-[#7F0019]">
          QUEST EXPLORATION
        </h1>

        {/* Quest card grid (square image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-10 w-full mx-auto">
          {quests.map((q) => (
            <ItemCard
              key={q.id}
              id={q.id}
              type="quest"
              backgroundImageUrl={pickQuestImageUrl(q, "square")}
              iconUrl={q.project.logoUrl}
              projectName={q.project.name}
              title={q.title}
              description={q.catchphrase}
              points={q.tasks.reduce((sum, t) => sum + t.points, 0)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
