"use client";

import { useQuestsContext } from "@/context/questsContext";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { TaskItem } from "@/components/TaskItem";
import { useLocale, useTranslations } from "next-intl";
import { getLText } from "@/lib/i18n-data";

export default function QuestDetailPage() {
  const { questID } = useParams() as { questID: string };
  const { quests, isLoading } = useQuestsContext();
  const t = useTranslations("questDetail");
  const locale = useLocale() as "en" | "ja";

  if (isLoading) {
    return <p className="text-center text-gray-500 py-10">{t("loading")}</p>;
  }

  const quest = quests.find((q) => q.id === questID);
  if (!quest) return notFound();

  const totalPoints = quest.tasks.reduce((sum, task) => sum + task.points, 0);

  return (
    <div className="w-full max-w-7xl mx-auto p-5">
      {/* Header section */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Image
            src={quest.project.logoUrl}
            alt={getLText(quest.project.name, locale)}
            width={50}
            height={50}
            className="rounded-md border-2 border-white"
          />
          <h2 className="text-xl font-bold">
            {getLText(quest.project.name, locale)}
          </h2>
        </div>
        <h1 className="text-3xl font-extrabold mb-3">
          {getLText(quest.title, locale)}
        </h1>
        <p className="text-center text-lg font-semibold mb-2">
          {getLText(quest.catchphrase, locale)}
        </p>
        <p className="text-gray-600">
          {t("totalPoints")}: {totalPoints}
        </p>
      </div>

      {/* Tasks section */}
      <div className="space-y-5 mb-10">
        {quest.tasks.map((task, i) => (
          <TaskItem key={i} questId={questID} task={task} />
        ))}
      </div>

      {/* Description section */}
      <h2 className="text-xl font-extrabold mb-2">{t("description")}</h2>
      <p className="whitespace-pre-line text-sm font-bold mb-10">
        {getLText(quest.description, locale)}
      </p>
    </div>
  );
}
