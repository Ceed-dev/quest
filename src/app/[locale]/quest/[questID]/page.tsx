"use client";

import { useQuestsContext } from "@/context/questsContext";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { TaskItem } from "@/components/TaskItem";
import { useLocale, useTranslations } from "next-intl";
import { getLText } from "@/lib/i18n-data";
import { SquareArrowOutUpRight } from "lucide-react";
import React from "react";

export default function QuestDetailPage() {
  const { questID } = useParams() as { questID: string };
  const { quests, isLoading } = useQuestsContext();
  const t = useTranslations("questDetail");
  const locale = useLocale() as "en" | "ja";

  // ▼ ここに移動（早期 return より前）
  const [copied, setCopied] = React.useState(false);
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
  // ▲ ここまで

  if (isLoading) {
    return <p className="text-center text-gray-500 py-10">{t("loading")}</p>;
  }

  const quest = quests.find((q) => q.id === questID);
  if (!quest) return notFound();

  const totalPoints = quest.tasks.reduce((sum, task) => sum + task.points, 0);
  return (
    <div className="w-full mx-auto">
      {/* ====== TOP: Quest summary card (full width) ====== */}
      <section className="w-full rounded-2xl bg-[#1C1C1C] text-white shadow-[0_6px_28px_rgba(0,0,0,0.28)] p-6 sm:p-8 md:p-10">
        {/* row: project (icon + name) + share */}
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

        {/* title */}
        <h1
          className="
    mt-5 sm:mt-6
    font-extrabold tracking-tight leading-[1.08]
    text-transparent bg-clip-text
    bg-gradient-to-r from-[#D5B77A] to-white
    text-[28px] sm:text-[40px] md:text-[52px] xl:text-[64px]
  "
        >
          {getLText(quest.title, locale)}
        </h1>

        {/* catchphrase */}
        <p
          className="
            mt-3 sm:mt-4
            text-[#D5B77A]
            text-[18px] sm:text-[22px] lg:text-[32px]
          "
        >
          {getLText(quest.catchphrase, locale)}
        </p>

        {/* total points pill */}
        <div className="mt-5">
          <div className="relative inline-flex">
            {/* 背後のグラデ&光彩 */}
            <span
              aria-hidden="true"
              className="absolute -inset-1 rounded-lg bg-[#D5B77A] opacity-50 blur-[3px]"
            />
            {/* 本体の白ピル */}
            <span
              className="relative inline-flex items-center rounded-lg bg-gradient-to-r from-[#D5B77A] to-white text-[#1C1C1C]
                 px-4 py-1.5 text-[24px] font-bold
                 ring-1 ring-black/10 shadow-[0_6px_28px_rgba(0,0,0,0.28)]"
            >
              {t("totalPoints")}: {totalPoints}
            </span>
          </div>
        </div>
      </section>

      {/* ====== Tasks ====== */}
      <div className="space-y-5 my-10">
        {quest.tasks.map((task, i) => (
          <TaskItem key={i} questId={questID} task={task} />
        ))}
      </div>

      {/* ====== Description ====== */}
      <h2 className="text-[32px] text-[#7F0019] font-extrabold mb-2">
        {t("description")}
      </h2>
      <p className="text-[24px] text-[#1C1C1C] mb-10">
        {getLText(quest.description, locale)}
      </p>
    </div>
  );
}
