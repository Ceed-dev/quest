"use client";

import { useQuestsContext } from "@/context/questsContext";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { TaskItem } from "@/components/TaskItem";
import { CountdownTimer } from "@/components/CountdownTimer";

export default function QuestDetailPage() {
  const { questID } = useParams() as { questID: string };
  const { quests } = useQuestsContext();

  const quest = quests.find((q) => q.id === questID);
  if (!quest) return notFound();

  const claimed = quest.stats.rewardStats.count;
  const remaining = quest.reward.slots - claimed;

  return (
    <div className="max-w-7xl mx-auto px-6 pt-10 grid grid-cols-[2fr_1px_1fr] gap-10 min-h-screen">
      {/* Left column */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Image
              src={quest.client.logoUrl}
              alt={quest.client.name}
              width={40}
              height={40}
              className="rounded-md border-2 border-white"
            />
            <h2 className="text-xl font-bold">{quest.client.name}</h2>
          </div>

          {/* TODO: Implement share functionality (e.g., copy link, share to social platforms).
          <div className="relative w-fit h-fit">
            <div className="absolute top-0 left-0 w-full h-full bg-black rounded-md z-0" />
            <button className="relative z-10 flex items-center gap-2 px-4 py-2 font-bold text-black bg-white border-2 border-black rounded-md transition-transform duration-200 ease-in-out transform translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0">
              <Image
                src="https://app.questn.com/static/svgs/share.svg"
                alt="Share"
                width={16}
                height={16}
              />
              Share
            </button>
          </div> */}
        </div>

        <h1 className="text-3xl font-extrabold mb-3">{quest.title}</h1>

        <div className="flex items-center gap-3 mb-10 font-bold text-xs text-black">
          <span className="bg-lime-100 border-2 border-lime-300 rounded-full px-3 py-1">
            Ongoing
          </span>
          {/* // TODO: Replace hardcoded timezone (UTC+09:00) with dynamic display based on user's local timezone or stored preference. */}
          <span className="bg-lime-100 border-2 border-lime-300 rounded-full px-3 py-1">
            {format(quest.period.start, "yyyy/MM/dd HH:mm")} ~{" "}
            {format(quest.period.end, "yyyy/MM/dd HH:mm")}
          </span>
        </div>

        <div className="space-y-5 mb-10">
          {quest.tasks.map((task, i) => (
            <TaskItem key={i} task={task} />
          ))}
        </div>

        {/* Description */}
        <h2 className="text-xl font-extrabold mb-2">Description</h2>
        <p className="whitespace-pre-line text-sm font-bold">
          {quest.description}
        </p>
      </div>

      <div className="bg-white w-[2px]" />

      {/* Right column */}
      <div className="space-y-6">
        {/* Reward Box */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold">Reward</span>
            <span className="text-sm text-black font-bold px-2 py-0.5 bg-lime-100 border-2 border-lime-300 rounded-full">
              {remaining} slots remaining
            </span>
          </div>

          <CountdownTimer endTime={quest.period.end} />

          {/* Reward Type Info */}
          <div className="border-2 border-white rounded-md p-6 space-y-10">
            <div className="flex justify-between items-center">
              <div className="text-sm font-bold">Reward Type:</div>
              <div className="flex items-center gap-2 text-lg font-extrabold">
                <Image
                  src="/qube.png"
                  alt="Qube Points"
                  width={28}
                  height={28}
                  className="border-2 border-white rounded-full"
                />
                {quest.reward.amountPerUser} points
              </div>
            </div>

            {/* Placeholder Chain Info */}
            {/* TODO: Replace placeholder with actual token info (e.g., token icon and name) */}
            {/* Currently using points system only; update when supporting on-chain tokens. */}
            {/* <div className="flex justify-center">
              <div className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 text-xs font-bold rounded-full">
                <Image src="/qube.png" alt="Chain" width={16} height={16} />
                <span>Polygon</span>
              </div>
            </div> */}
          </div>

          {/* Claim Button */}
          <div className="relative w-full h-fit">
            <div className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-white z-0" />
            <button className="relative z-10 w-full bg-white text-black text-center font-bold py-3 rounded-md transition-transform duration-200 ease-in-out transform translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0">
              Claim Reward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
