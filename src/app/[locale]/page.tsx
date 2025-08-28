"use client";

import { ItemCard } from "@/components/shared/ItemCard";
import { useQuestsContext } from "@/context/questsContext";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const { quests, isLoading, error } = useQuestsContext();
  const t = useTranslations("home");

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
    <div className="grid grid-cols-1 md:grid-cors-2 xl:grid-cols-4 gap-5 xl:gap-10 w-full mx-auto">
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
          points={quest.tasks.reduce((sum, task) => sum + task.points, 0)} // Total points calculation
        />
      ))}
    </div>
  );
}
