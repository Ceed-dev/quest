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
import { CubeRarity } from "@/types/cube";
import { performGachaSpin } from "@/lib/gacha";

export default function GachaPage() {
  const { user } = useUser();
  const [rollingRarity, setRollingRarity] = useState<CubeRarity | null>(null);
  const [highlightedRarity, setHighlightedRarity] = useState<CubeRarity | null>(
    null,
  );

  const getVideoPath = (rarity: CubeRarity) => {
    switch (rarity) {
      case "legendary":
        return "/gacha/animations/legendary.mp4";
      case "superRare":
        return "/gacha/animations/superRare.mp4";
      case "rare":
        return "/gacha/animations/rare.mp4";
      case "common":
        return "/gacha/animations/common.mp4";
      default:
        return "";
    }
  };

  const handleGacha = async () => {
    if (!user || !user.walletAddress || user.inventory.points < 50) return;

    try {
      const result = await performGachaSpin(user.walletAddress);

      if (result) {
        setRollingRarity(result);
      } else {
        alert("Gacha failed. You may not have enough points.");
      }
    } catch (err) {
      console.error("Error during gacha spin:", err);
      alert("An error occurred during gacha.");
    }
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
          <p className="text-3xl font-bold">{user?.inventory.points ?? 0}</p>
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
                    <span className="text-yellow-500 font-semibold">
                      Legendary
                    </span>
                    : 0.5%
                  </li>
                  <li>
                    <span className="text-purple-500 font-semibold">
                      Super Rare
                    </span>
                    : 4.5%
                  </li>
                  <li>
                    <span className="text-green-500 font-semibold">Rare</span>:
                    20%
                  </li>
                  <li>
                    <span className="text-gray-500 font-semibold">Common</span>:
                    75%
                  </li>
                </ul>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-6 font-semibold">
            <div
              className={`flex justify-between items-center w-full max-w-[160px] text-yellow-400 
                          transition-transform duration-300 ease-in-out
                          ${highlightedRarity === "legendary" ? "scale-110 shadow-lg" : ""}`}
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/cube/legendary.svg"
                  alt="Legendary"
                  width={16}
                  height={16}
                />
                <span>Legendary</span>
              </div>
              <span className="text-white">
                {user?.inventory.cubes.legendary}
              </span>
            </div>
            <div
              className={`flex justify-between items-center w-full max-w-[160px] text-purple-400 
                          transition-transform duration-300 ease-in-out
                          ${highlightedRarity === "superRare" ? "scale-110 shadow-lg" : ""}`}
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/cube/superRare.svg"
                  alt="Super Rare"
                  width={16}
                  height={16}
                />
                <span>Super Rare</span>
              </div>
              <span className="text-white">
                {user?.inventory.cubes.superRare}
              </span>
            </div>
            <div
              className={`flex justify-between items-center w-full max-w-[160px] text-green-400 
                          transition-transform duration-300 ease-out
                          ${highlightedRarity === "rare" ? "scale-110 shadow-lg" : ""}`}
            >
              <div className="flex items-center gap-2">
                <Image src="/cube/rare.svg" alt="Rare" width={16} height={16} />
                <span>Rare</span>
              </div>
              <span className="text-white">{user?.inventory.cubes.rare}</span>
            </div>
            <div
              className={`flex justify-between items-center w-full max-w-[160px] text-gray-400 
                          transition-transform duration-300 ease-in-out
                          ${highlightedRarity === "common" ? "scale-110 shadow-lg" : ""}`}
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/cube/common.svg"
                  alt="Common"
                  width={16}
                  height={16}
                />
                <span>Common</span>
              </div>
              <span className="text-white">{user?.inventory.cubes.common}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gachapon Display */}
      <div className="flex justify-center">
        <div
          className={`translate-x-[-45px] ${user && user.inventory.points >= 50 ? "animate-pulse" : ""}`}
        >
          <Image
            src="/gacha/gachapon.svg"
            alt="gachapon"
            width={350}
            height={350}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Gacha Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGacha}
          disabled={!user || user.inventory.points < 50}
          className={`bg-lime-300 text-black font-bold py-3 px-10 rounded-full border-2 border-white
            hover:bg-lime-400 transition-transform transform hover:-translate-y-1
            ${!user || user.inventory.points < 50 ? "opacity-50 cursor-not-allowed hover:translate-y-0" : ""}
          `}
        >
          Spin Gacha (Cost: 50 pts)
        </button>
      </div>

      {/* Overlay with animation */}
      {rollingRarity && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <video
            src={getVideoPath(rollingRarity)}
            autoPlay
            onEnded={() => {
              const rarity = rollingRarity;
              setRollingRarity(null);
              setHighlightedRarity(rarity);

              setTimeout(() => setHighlightedRarity(null), 2000);
            }}
            className="w-[500px] md:w-[700px] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
