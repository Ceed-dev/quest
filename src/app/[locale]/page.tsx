"use client";

// import type { Quest } from "@/types/quest";
import { ItemCard } from "@/components/shared/ItemCard";
// import { QuestCard } from "@/components/QuestCard";
import { useQuestsContext } from "@/context/questsContext";

export default function HomePage() {
  const { quests, isLoading } = useQuestsContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 p-5 w-full max-w-screen-xl mx-auto">
      {isLoading ? (
        <p className="col-span-full text-center text-gray-500">
          Loading quests...
        </p>
      ) : quests.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">
          No quests available.
        </p>
      ) : (
        Array.from({ length: 10 }).map((_, index) => (
          <ItemCard
            key={index}
            id="hello"
            type="quest"
            backgroundImageUrl="https://firebasestorage.googleapis.com/v0/b/quest-by-ceed.firebasestorage.app/o/quests%2FEdheg84T7dETmeNNsfHb%2Fclient-logo.png?alt=media&token=ff49bb38-8625-479c-a79f-02d6b24f5b71"
            iconUrl="https://firebasestorage.googleapis.com/v0/b/quest-by-ceed.firebasestorage.app/o/quests%2FEdheg84T7dETmeNNsfHb%2Fclient-logo.png?alt=media&token=ff49bb38-8625-479c-a79f-02d6b24f5b71"
            title="Epic Questaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            description="Hello World Hello World Hello World Hello World Hello World Hello World"
            points={10}
          />
        ))
      )}
    </div>
  );
}
