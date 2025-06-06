"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { useUser } from "@/providers/user-provider";

export default function GachaPage() {
  const { user } = useUser();
  const [isRolling, setIsRolling] = useState(false);

  const handleGacha = () => {
    setIsRolling(true);
    // Simulate animation duration
    setTimeout(() => {
      setIsRolling(false);
      // In future: update cube inventory here
    }, 4000); // e.g., 4s animation
  };

  return (
    <div className="relative w-full min-h-screen px-4 py-8 text-white">
      {/* Page Header */}
      <h1 className="text-5xl font-extrabold text-center text-white mb-8 tracking-wide">
        Gacha
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
        <div className="bg-black/40 border-2 border-orange-300 p-4 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <p className="text-sm text-gray-300">Your Points</p>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Info className="w-4 h-4 text-orange-300 hover:text-white cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent className="w-64 text-sm text-gray-200 bg-black/90 border border-orange-400">
                Earned by completing tasks in quests.
              </HoverCardContent>
            </HoverCard>
          </div>
          <p className="text-3xl font-bold">{user?.totalPoints ?? 0}</p>
        </div>
        <div className="bg-black/40 border-2 border-green-300 p-4 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <p className="text-sm text-gray-300">Cubes Owned</p>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Info className="w-4 h-4 text-green-300 hover:text-white cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent className="w-64 text-sm text-gray-200 bg-black/90 border border-green-400">
                <span>
                  Collected by spinning the Gacha. Each Cube may contain
                  rewards!{" "}
                </span>
                <span className="font-bold underline block mb-2">
                  Coming Soon!
                </span>

                <p className="font-semibold text-green-300 mb-1">
                  Gacha Rarity
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <span className="text-cyan-500 font-semibold">
                      Legendary
                    </span>
                    : 0.5%
                  </li>
                  <li>
                    <span className="text-green-500 font-semibold">
                      Super Rare
                    </span>
                    : 4.5%
                  </li>
                  <li>
                    <span className="text-purple-500 font-semibold">Rare</span>:
                    20%
                  </li>
                  <li>
                    <span className="text-yellow-500 font-semibold">
                      Common
                    </span>
                    : 75%
                  </li>
                </ul>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-6 font-semibold">
            <div className="flex justify-between w-full max-w-[160px] text-cyan-400">
              <span>Legendary</span>
              <span className="text-white">0</span>
            </div>
            <div className="flex justify-between w-full max-w-[160px] text-green-400">
              <span>Super Rare</span>
              <span className="text-white">0</span>
            </div>
            <div className="flex justify-between w-full max-w-[160px] text-purple-400">
              <span>Rare</span>
              <span className="text-white">0</span>
            </div>
            <div className="flex justify-between w-full max-w-[160px] text-yellow-400">
              <span>Common</span>
              <span className="text-white">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cube Display */}
      <div className="flex justify-center mb-10">
        <Image
          src="/dummy-cube.png"
          alt="Cube"
          width={350}
          height={350}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Gacha Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGacha}
          className="bg-lime-300 text-black font-bold py-3 px-10 rounded-full border-2 border-white
                     hover:bg-lime-400 transition-transform transform hover:-translate-y-1"
        >
          Spin Gacha (Cost: 50 pts)
        </button>
      </div>

      {/* Overlay with animation */}
      {isRolling && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <video
            src="/dummy-gacha-animation.mp4"
            autoPlay
            onEnded={() => setIsRolling(false)}
            className="w-[500px] md:w-[700px] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
