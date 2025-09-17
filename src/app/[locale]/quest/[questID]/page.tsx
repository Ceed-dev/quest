// -----------------------------------------------------------------------------
// QuestDetailPage
// -----------------------------------------------------------------------------
// - Displays a quest detail page with summary, tasks, description, and a
//   "FOR YOU" section with related quests.
// - Uses pickQuestImageUrl(q, "square"|"wide") to select the correct image
//   variant with safe fallbacks.
// - NOTE: Pass LocalizedText values (not strings) to ItemCard so it can handle
//   localization internally.
// -----------------------------------------------------------------------------

"use client";

import React from "react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getLText } from "@/lib/i18n-data";
import { useQuestsContext } from "@/context/questsContext";
import { TaskItem } from "@/components/TaskItem";
import { ItemCard } from "@/components/shared/ItemCard";
import { Link } from "@/i18n/navigation";
import { SquareArrowOutUpRight, ArrowDownCircle } from "lucide-react";
import type { Quest } from "@/types/quest";

/** Pick a quest image URL by usage with safe fallbacks */
function pickQuestImageUrl(quest: Quest, usage: "square" | "wide"): string {
  const imgs = quest.backgroundImages ?? [];
  const exact = imgs.find((i) => i.usage === usage)?.url;
  if (exact) return exact;
  if (imgs[0]?.url) return imgs[0].url;
  return quest.project.logoUrl || "";
}

export default function QuestDetailPage() {
  const { questID } = useParams() as { questID: string };
  const { quests, isLoading } = useQuestsContext();
  const t = useTranslations("questDetail");
  const locale = useLocale() as "en" | "ja";

  const [copied, setCopied] = React.useState(false);

  // Copy current URL to clipboard (with a DOM fallback)
  const handleShare = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const dummy = document.createElement("input");
      dummy.value = window.location.href;
      document.body.appendChild(dummy);
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  if (isLoading) {
    return <p className="text-center text-gray-500 py-10">{t("loading")}</p>;
  }

  const quest = quests.find((q) => q.id === questID);
  if (!quest) return notFound();

  const totalPoints = quest.tasks.reduce((sum, task) => sum + task.points, 0);
  const forYou = quests.filter((q) => q.id !== questID).slice(0, 4);

  return (
    <div className="w-full mx-auto">
      {/* ===== Summary ===== */}
      <section className="w-full rounded-2xl bg-[#1C1C1C] text-white shadow-[0_6px_28px_rgba(0,0,0,0.28)] p-6 sm:p-8 md:p-10">
        {/* Project row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Image
              src={quest.project.logoUrl}
              alt={getLText(quest.project.name, locale)}
              width={48}
              height={48}
              className="rounded-lg bg-white/5 ring-1 ring-white/10"
            />
            <h2 className="text-[18px] lg:text-[25px] font-semibold tracking-wide">
              {getLText(quest.project.name, locale)}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-lg bg-[#D5B77A] px-3.5 py-2 text-[#1C1C1C] font-semibold hover:opacity-90 transition"
            aria-label="Copy this page link"
          >
            <SquareArrowOutUpRight size={20} />
            {copied ? "Copied!" : "Share"}
          </button>
        </div>

        {/* Title */}
        <h1 className="mt-5 sm:mt-6 font-extrabold tracking-tight leading-[1.08] text-transparent bg-clip-text bg-gradient-to-r from-[#D5B77A] to-white text-[28px] sm:text-[40px] md:text-[52px] xl:text-[64px]">
          {getLText(quest.title, locale)}
        </h1>

        {/* Catchphrase */}
        <p className="mt-3 sm:mt-4 text-[#D5B77A] text-[18px] sm:text-[22px] lg:text-[32px]">
          {getLText(quest.catchphrase, locale)}
        </p>

        {/* Total points pill */}
        <div className="mt-5">
          <div className="relative inline-flex">
            <span
              aria-hidden="true"
              className="absolute -inset-1 rounded-lg bg-[#D5B77A] opacity-50 blur-[3px]"
            />
            <span className="relative inline-flex items-center rounded-lg bg-gradient-to-r from-[#D5B77A] to-white text-[#1C1C1C] px-4 py-1.5 text-[24px] font-bold ring-1 ring-black/10 shadow-[0_6px_28px_rgba(0,0,0,0.28)]">
              {t("totalPoints")}: {totalPoints}
            </span>
          </div>
        </div>
      </section>

      {/* ===== Tasks ===== */}
      <div className="space-y-5 my-10">
        {quest.tasks.map((task) => (
          <TaskItem key={task.id} questId={questID} task={task} />
        ))}
      </div>

      {/* ===== Description ===== */}
      <h2 className="text-[32px] text-[#7F0019] font-extrabold mb-2">
        {t("description")}
      </h2>
      <p className="text-[24px] text-[#1C1C1C]">
        {getLText(quest.description, locale)}
      </p>

      {/* === Responsive promo image directly under Description === */}
      <div className="mt-4">
        {/* Mobile: square image (full width, no crop) */}
        <div className="md:hidden">
          <div className="overflow-hidden rounded-xl">
            <Image
              src={pickQuestImageUrl(quest, "square")}
              alt={getLText(quest.title, locale)}
              width={1000}
              height={1000}
              className="w-full h-auto"
              sizes="(max-width: 768px) 92vw, 0px"
            />
          </div>
        </div>

        {/* Desktop: wide image (full width, no crop) */}
        <div className="hidden md:block">
          <div className="overflow-hidden rounded-xl">
            <Image
              src={pickQuestImageUrl(quest, "wide")}
              alt={getLText(quest.title, locale)}
              width={1600}
              height={700}
              className="w-full h-auto"
              sizes="(min-width:1280px) 1120px, (min-width:768px) 80vw, 0px"
            />
          </div>
        </div>
      </div>

      {/* ===== For you ===== */}
      <section className="mt-12">
        <h3 className="mb-4 text-[32px] font-extrabold text-[#7F0019]">
          FOR YOU
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-10 w-full">
          {forYou.map((q) => (
            <ItemCard
              key={q.id}
              id={q.id}
              type="quest"
              backgroundImageUrl={pickQuestImageUrl(q, "square")}
              iconUrl={q.project.logoUrl}
              projectName={q.project.name}
              title={q.title} // Pass LocalizedText, not string
              description={q.catchphrase} // Pass LocalizedText, not string
              points={q.tasks.reduce((sum, task) => sum + task.points, 0)}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-md bg-[#7F0019] px-5 py-2 text-white font-semibold shadow-sm hover:opacity-90 transition"
          >
            <ArrowDownCircle
              className="h-6 w-6"
              strokeWidth={2.2}
              aria-hidden="true"
            />
            <span>Explore more quests</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
