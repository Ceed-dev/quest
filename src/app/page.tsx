"use client";

import type { Quest } from "@/types/quest";
import { QuestCard } from "@/components/QuestCard";
import { useQuestsContext } from "@/context/questsContext";

export default function HomePage() {
  const { quests, isLoading } = useQuestsContext();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto w-full">
        {isLoading ? (
          <p className="col-span-full text-center text-gray-500">
            Loading quests...
          </p>
        ) : quests.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No quests available.
          </p>
        ) : (
          quests.map((quest: Quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))
        )}
      </div>
    </div>
  );
}
