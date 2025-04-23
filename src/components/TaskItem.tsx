"use client";

import { useState } from "react";
import Image from "next/image";

type Task = {
  label: string;
  iconUrl: string;
};

export function TaskItem({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <div
        onClick={() => setOpen(!open)}
        className="relative w-full h-fit cursor-pointer"
      >
        <div className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-black z-0" />
        <div
          className={`relative z-10 flex items-center justify-between gap-3
                      px-4 py-3 font-bold bg-black text-white
                      ${
                        open
                          ? "rounded-t-md translate-x-0 translate-y-0"
                          : "rounded-md transition-transform duration-200 ease-in-out transform translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
                      }`}
        >
          <div className="flex items-center gap-3">
            <Image src={task.iconUrl} alt={task.label} width={20} height={20} />
            <span>{task.label}</span>
          </div>
          {open && (
            <Image
              src="https://app.questn.com/static/svgs/arrow-bottom-white.svg"
              alt="arrow"
              width={16}
              height={16}
            />
          )}
        </div>
      </div>
      {open && (
        <div className="border-2 border-black rounded-b-md overflow-hidden">
          <div className="flex gap-4 justify-start items-center p-4">
            <div className="relative w-fit h-fit">
              <div className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-black z-0" />
              <button
                className="relative z-10 bg-black text-white font-bold py-2 px-6 rounded-md border-2 border-black flex 
                            items-center gap-2 transition-transform duration-200 ease-in-out transform
                            translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
              >
                <Image
                  src="https://cdn.questn.com/template/twitter-black.svg"
                  alt="X"
                  width={16}
                  height={16}
                />
                Follow
              </button>
            </div>
            <div className="relative w-fit h-fit">
              <div className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-black z-0" />
              <button
                className="relative z-10 bg-lime-300 font-bold py-2 px-6 rounded-md border-2 border-black
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
