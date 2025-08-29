"use client";

import { ItemCard } from "@/components/shared/ItemCard";
import HeroCarousel, { HeroQuest } from "@/components/HeroCarousel";
import { useQuestsContext } from "@/context/questsContext";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const { quests, isLoading, error } = useQuestsContext();
  const t = useTranslations("home");

  const items: HeroQuest[] = quests.slice(0, 5).map((q) => ({
    id: q.id,
    backgroundImageUrl: q.backgroundImageUrl,
    iconUrl: q.project.logoUrl,
    projectName: q.project.name, // LocalizedText | string
    title: q.title, // LocalizedText
    description: q.catchphrase, // LocalizedText
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
      <HeroCarousel items={items} className="mb-10" />
      <div className="w-full">
        {/* 見出し（左上） */}
        <h1 className="mb-6 text-[40px] md:text-[48px] xl:text-[64px] font-extrabold leading-none tracking-wide uppercase text-[#7F0019]">
          QUEST EXPLORATION
        </h1>

        {/* カードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-10 w-full mx-auto">
          {quests.map((quest) => (
            <ItemCard
              key={quest.id}
              id={quest.id}
              type="quest"
              backgroundImageUrl={quest.backgroundImageUrl}
              iconUrl={quest.project.logoUrl}
              projectName={quest.project.name}
              title={quest.title}
              description={quest.catchphrase}
              points={quest.tasks.reduce((sum, task) => sum + task.points, 0)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
