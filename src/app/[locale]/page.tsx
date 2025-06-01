"use client";

import { ItemCard } from "@/components/shared/ItemCard";
import { useQuestsContext } from "@/context/questsContext";

export default function HomePage() {
  const { quests, isLoading, error } = useQuestsContext();

  if (isLoading) {
    return <p className="text-center text-gray-500 py-10">Loading quests...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500 py-10">
        Error loading quests: {error.message}
      </p>
    );
  }

  if (quests.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">No quests available.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 p-5 w-full max-w-screen-xl mx-auto">
      {quests.map((quest) => (
        <ItemCard
          key={quest.id}
          id={quest.id}
          type="quest"
          backgroundImageUrl={quest.backgroundImageUrl}
          iconUrl={quest.project.logoUrl}
          title={quest.title}
          description={quest.catchphrase}
          points={quest.tasks.reduce((sum, task) => sum + task.points, 0)} // Total points calculation
        />
      ))}
    </div>
  );
}
