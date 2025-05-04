"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Quest } from "@/types/quest";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
  quest: Quest;
};

const colors = [
  "bg-purple-400",
  "bg-blue-400",
  "bg-rose-400",
  "bg-pink-400",
  "bg-teal-400",
  "bg-yellow-400",
];

export function QuestCard({ quest }: Props) {
  const glowColor = useMemo(() => {
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
  }, []);

  return (
    <Link href={`/quest/${quest.id}`} className="block">
      <div className="relative w-full max-w-xs">
        <div
          className={`absolute inset-0 rounded-md ${glowColor} border-2 border-white`}
        />

        <Card
          className="relative z-10 w-full rounded-md border-2 border-white p-0 overflow-hidden
          transition-transform hover:-translate-x-1.5 hover:-translate-y-1.5 font-extrabold cursor-pointer"
        >
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b-2 border-white">
            <div className="text-3xl">
              {quest.reward.amountPerUser * quest.reward.slots}
              <span className="text-lg ml-1">points</span>
            </div>
            <div className="w-[40px] h-[40px] rounded-full border-2 border-white flex items-center justify-center bg-white">
              <Image src="/qube.png" alt="Qube Points" width={40} height={40} />
            </div>
          </CardHeader>

          <CardContent className="px-4 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-[30px] h-[30px] rounded-md border-2 border-white flex items-center justify-center bg-white">
                <Image
                  src={quest.client.logoUrl}
                  alt={quest.client.name}
                  width={30}
                  height={30}
                  className="rounded-md"
                />
              </div>
              <span className="text-sm truncate">{quest.client.name}</span>
            </div>

            <div className="text-md mb-5 truncate">{quest.title}</div>

            <div className="inline-flex items-center gap-1 rounded-full bg-lime-200 px-3 py-1 text-sm text-black">
              <span>
                {quest.tasks.length} task{quest.tasks.length > 1 ? "s" : ""} to
                complete
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
