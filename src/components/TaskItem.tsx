"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { QuestTask } from "@/types/quest";

type Props = {
  task: QuestTask;
};

export function TaskItem({ task }: Props) {
  const [open, setOpen] = useState(false);

  const platformIconMap: Record<string, string> = {
    x: "/x-black.png",
    discord: "/discord.png",
  };

  const platformPrefix = task.type.split("_")[0];
  const iconSrc = platformIconMap[platformPrefix];

  return (
    <div className="w-full">
      <div
        onClick={() => setOpen(!open)}
        className="relative w-full h-fit cursor-pointer"
      >
        <div className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-white z-0" />
        <div
          className={`relative z-10 flex items-center justify-between gap-3
                      px-4 py-3 font-bold bg-white text-black
                      ${
                        open
                          ? "rounded-t-md translate-x-0 translate-y-0"
                          : "rounded-md transition-transform duration-200 ease-in-out transform translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
                      }`}
        >
          <div className="flex items-center gap-3">
            <Image src={iconSrc} alt={task.label} width={20} height={20} />
            <span>{task.label}</span>
          </div>
          {open && <ChevronDown className="w-6 h-6" />}
        </div>
      </div>

      {open && (
        <div className="border-2 border-white rounded-b-md overflow-hidden">
          <div className="flex gap-4 justify-start items-center p-4">
            {/* Action Button */}
            <div className="relative w-fit h-fit">
              <div className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-white z-0" />
              <a
                href={task.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 bg-white text-black font-bold py-2 px-6 rounded-md border-2 border-white flex 
             items-center gap-2 transition-transform duration-200 ease-in-out transform
             translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
              >
                <Image src={iconSrc} alt="platform" width={16} height={16} />
                Go to task
              </a>
            </div>

            {/* Verify Button */}
            <div className="relative w-fit h-fit">
              <div className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-white z-0" />
              <button
                className="relative z-10 bg-lime-300 font-bold py-2 px-6 rounded-md text-black border-2 border-white
                            transition-transform duration-200 ease-in-out transform
                            translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
