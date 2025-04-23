import { quests, Quest } from "@/data/quests";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { TaskItem } from "@/components/TaskItem";
import { QuestCard } from "@/components/QuestCard";
import { CountdownTimer } from "@/components/CountdownTimer";

type Props = {
  params: {
    questID: string;
  };
};

export default function QuestDetailPage({ params }: Props) {
  const questID = params.questID;
  const quest = quests.find((q: Quest) => q.id === questID);

  if (!quest) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 pt-10 grid grid-cols-[2fr_1px_1fr] gap-10 min-h-screen">
      {/* Left column */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Image
              src={quest.clientLogoUrl}
              alt={quest.clientName}
              width={40}
              height={40}
              className="rounded-md border-2 border-black"
            />
            <h2 className="text-xl font-bold flex items-center gap-2">
              {quest.clientName}
              <Image
                src="https://app.questn.com/static/svgs/community-v.svg"
                alt="Verified"
                width={20}
                height={20}
              />
            </h2>
          </div>

          <div className="relative w-fit h-fit">
            <div className="absolute top-0 left-0 w-full h-full bg-black rounded-md z-0" />

            <button
              className="relative z-10 flex items-center gap-2
                px-4 py-2 font-bold text-black bg-white border-2 border-black rounded-md
                transition-transform duration-200 ease-in-out transform
                translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
            >
              <Image
                src="https://app.questn.com/static/svgs/share.svg"
                alt="Share"
                width={16}
                height={16}
              />
              Share
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold mb-3">{quest.title}</h1>

        <div className="flex items-center gap-3 mb-10 font-bold text-xs">
          <span className="bg-lime-100 border-2 border-lime-300 rounded-full px-3 py-1">
            Ongoing
          </span>
          <span className="bg-lime-100 border-2 border-lime-300 rounded-full px-3 py-1">
            {format(new Date(quest.startAt), "yyyy/MM/dd HH:mm")} ~{" "}
            {format(new Date(quest.endAt), "yyyy/MM/dd HH:mm")} {"(UTC+09:00)"}
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

        <h2 className="text-xl font-extrabold mt-10 mb-4">For You</h2>
        <div className="grid grid-cols-2 gap-5 w-full mb-10">
          {quests
            .filter((q) => q.id !== quest.id)
            .map((q) => (
              <QuestCard key={q.id} quest={q} />
            ))}
        </div>
      </div>

      <div className="bg-black w-[2px]" />

      {/* Right column */}
      <div className="space-y-6">
        {/* Reward Box */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold">Reward</span>
            <span className="text-sm font-bold px-2 py-0.5 bg-lime-100 border-2 border-lime-300 rounded-full">
              {quest.isClaimed ? "Claimed" : "5"}
            </span>
          </div>

          {/* Lucky Draw Timer */}
          <CountdownTimer endTime={quest.endAt} />

          {/* Token Info */}
          <div className="border-2 border-black rounded-md p-6 space-y-10">
            <div className="flex justify-between items-center">
              <div className="text-sm font-bold">Token:</div>
              <div className="flex items-center gap-2">
                <div className="border-2 border-black rounded-full">
                  <Image
                    src={quest.rewardTokenIconUrl}
                    alt={quest.rewardTokenSymbol}
                    width={28}
                    height={28}
                  />
                </div>
                <span className="text-lg font-extrabold">
                  {quest.rewardAmount} {quest.rewardTokenSymbol}
                </span>
              </div>
            </div>

            {/* Chain Info */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 text-xs font-bold rounded-full">
                <Image
                  src={quest.chainIconUrl}
                  alt={quest.chainName}
                  width={16}
                  height={16}
                />
                <span>{quest.chainName}</span>
              </div>
            </div>
          </div>

          {/* Claim Button */}
          <div className="relative w-full h-fit">
            <div className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-black z-0" />

            <button
              className="relative z-10 w-full bg-black text-white text-center font-bold py-3 rounded-md
      transition-transform duration-200 ease-in-out transform
      translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
            >
              Claim Reward
            </button>
          </div>
        </div>

        {/* Questers */}
        <div>
          <div className="text-xl font-extrabold mb-2">
            Questers{" "}
            <span className="bg-lime-100 border-2 border-lime-300 px-2 py-0.5 text-xs rounded-full">
              999+
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            {quest.questersAvatars.map((avatar, i) => (
              <Image
                key={i}
                src={avatar}
                alt={`avatar-${i}`}
                width={50}
                height={50}
                className="rounded-full border-2 border-black"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
