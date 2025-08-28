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
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function GachaPage() {
  const { user } = useUser();
  const [rollingRarity, setRollingRarity] = useState<CubeRarity | null>(null);
  const [highlightedRarity, setHighlightedRarity] = useState<CubeRarity | null>(
    null,
  );

  const t = useTranslations("gacha");
  const tInv = useTranslations("inventoryCard");

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
      if (result) setRollingRarity(result);
      else alert(t("alerts.failed"));
    } catch (err) {
      console.error("Error during gacha spin:", err);
      alert(t("alerts.error"));
    }
  };

  const COST = 50;
  const enoughPoints = !!user && user.inventory.points >= COST;

  return (
    <div className="w-full">
      {/* 中央ダークパネル */}
      <section
        className="
          mx-auto w-full rounded-2xl bg-[#1C1C1C] text-white
          shadow-[0_6px_28px_rgba(0,0,0,0.28)]
          p-6 sm:p-8
          h-[calc(100vh-160px)]
          overflow-hidden
          flex flex-col min-h-0
        "
      >
        {/* タイトル */}
        <h1
          className="
            text-center text-[64px] font-extrabold tracking-wide mb-6
            bg-gradient-to-r from-[#D5B77A] to-white
            bg-clip-text text-transparent uppercase
          "
        >
          {t("title")}
        </h1>

        {/* 3等分グリッド：左/中央/右 */}
        <div
          className="
            grid gap-6 flex-1 min-h-0
            grid-cols-1 lg:grid-cols-3
            items-stretch
          "
        >
          {/* 左：ポイント & 所持キューブ */}
          <div className="flex flex-col justify-center h-full max-w-[300px] w-full">
            {/* Points */}
            <div className="rounded-xl border border-[#D5B77A] bg-black/40 p-5 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-[20px] tracking-widest uppercase font-semibold text-[#BBA98D]">
                  {t("yourPoints")}
                </p>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Info className="w-4 h-4 text-[#D5B77A] hover:text-white cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64 text-sm text-gray-200 bg-black/90 border border-[#D5B77A]">
                    {t("yourPointsHelp")}
                  </HoverCardContent>
                </HoverCard>
              </div>

              {/* 数値（大きく・白・ドロップシャドウ） */}
              <p
                className="
    text-[64px] leading-none font-extrabold
    bg-gradient-to-b from-[#D5B77A] to-white
    bg-clip-text text-transparent
    drop-shadow-[0_6px_0_rgba(0,0,0,0.6)]
  "
              >
                {user?.inventory.points ?? 0}
              </p>
            </div>

            {/* Cubes owned */}
            <div className="rounded-xl border border-[#D5B77A] bg-black/40 p-5">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-[20px] tracking-widest uppercase font-semibold text-[#BBA98D]">
                  {t("cubesOwned")}
                </p>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Info className="w-4 h-4 text-[#D5B77A] hover:text-white cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64 text-sm text-gray-200 bg-black/90 border border-[#D5B77A]">
                    <span>{t("cubesOwnedHelp1")}</span>
                    <span className="font-bold underline block mb-2">
                      {t("comingSoon")}
                    </span>
                    <p className="font-semibold text-green-300 mb-1">
                      {t("rarityTitle")}
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        <span className="text-yellow-500 font-semibold">
                          {tInv("rarity.legendary")}
                        </span>
                        : 0.5%
                      </li>
                      <li>
                        <span className="text-purple-500 font-semibold">
                          {tInv("rarity.superRare")}
                        </span>
                        : 4.5%
                      </li>
                      <li>
                        <span className="text-green-500 font-semibold">
                          {tInv("rarity.rare")}
                        </span>
                        : 20%
                      </li>
                      <li>
                        <span className="text-gray-400 font-semibold">
                          {tInv("rarity.common")}
                        </span>
                        : 75%
                      </li>
                    </ul>
                  </HoverCardContent>
                </HoverCard>
              </div>

              {/* レア度行（カード幅いっぱい・右側に数値） */}
              <div className="space-y-3 font-semibold">
                <div
                  className={`flex items-center justify-between ${highlightedRarity === "common" ? "scale-[1.03]" : ""}`}
                >
                  <div className="flex items-center gap-3 text-gray-400">
                    <Image
                      src="/cube/common.svg"
                      alt={tInv("rarity.common")}
                      width={50}
                      height={50}
                    />
                    <span className="text-[16px]">{tInv("rarity.common")}</span>
                  </div>
                  <span
                    className="text-[24px]
                        bg-gradient-to-b from-[#D5B77A] to-white
    bg-clip-text text-transparent
    drop-shadow-[0_6px_0_rgba(0,0,0,0.6)]"
                  >
                    {user?.inventory.cubes.common ?? 0}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between ${highlightedRarity === "rare" ? "scale-[1.03]" : ""}`}
                >
                  <div className="flex items-center gap-3 text-green-400">
                    <Image
                      src="/cube/rare.svg"
                      alt={tInv("rarity.rare")}
                      width={50}
                      height={50}
                    />
                    <span className="text-[16px]">{tInv("rarity.rare")}</span>
                  </div>
                  <span
                    className="text-[24px]
                        bg-gradient-to-b from-[#D5B77A] to-white
    bg-clip-text text-transparent
    drop-shadow-[0_6px_0_rgba(0,0,0,0.6)]"
                  >
                    {user?.inventory.cubes.rare ?? 0}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between ${highlightedRarity === "superRare" ? "scale-[1.03]" : ""}`}
                >
                  <div className="flex items-center gap-3 text-purple-400">
                    <Image
                      src="/cube/superRare.svg"
                      alt={tInv("rarity.superRare")}
                      width={50}
                      height={50}
                    />
                    <span className="text-[16px]">
                      {tInv("rarity.superRare")}
                    </span>
                  </div>
                  <span
                    className="text-[24px]
                        bg-gradient-to-b from-[#D5B77A] to-white
    bg-clip-text text-transparent
    drop-shadow-[0_6px_0_rgba(0,0,0,0.6)]"
                  >
                    {user?.inventory.cubes.superRare ?? 0}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between ${highlightedRarity === "legendary" ? "scale-[1.03]" : ""}`}
                >
                  <div className="flex items-center gap-3 text-yellow-400">
                    <Image
                      src="/cube/legendary.svg"
                      alt={tInv("rarity.legendary")}
                      width={50}
                      height={50}
                    />
                    <span className="text-[16px]">
                      {tInv("rarity.legendary")}
                    </span>
                  </div>
                  <span
                    className="text-[24px]
                        bg-gradient-to-b from-[#D5B77A] to-white
    bg-clip-text text-transparent
    drop-shadow-[0_6px_0_rgba(0,0,0,0.6)]"
                  >
                    {user?.inventory.cubes.legendary ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 中央：ガチャ本体（完全中央） */}
          <div className="flex flex-col items-center justify-center h-full">
            <div className={`${enoughPoints ? "animate-pulse" : ""}`}>
              <Image
                src="/gacha/gachapon.svg"
                alt={t("gachaponAlt")}
                width={300}
                height={300}
                className="rounded-lg shadow-lg max-w-[75vw]"
                priority
              />
            </div>

            {/* ガチャボタン（グラデ） */}
            <button
              onClick={handleGacha}
              disabled={!enoughPoints}
              className={`
                mt-6 p-3 font-bold rounded-md
                text-[24px] text-[#1C1C1C]
                bg-gradient-to-r from-[#D5B77A] to-white
                shadow-md shadow-black/40
                transition-transform hover:-translate-y-1
                border border-[#D5B77A]/50
                ${!enoughPoints ? "opacity-50 cursor-not-allowed hover:translate-y-0" : ""}
              `}
            >
              {t("button", { cost: COST })}
            </button>
          </div>

          {/* 右：CTA（等幅セルの縦横中央） */}
          <div className="hidden lg:flex items-center justify-center h-full">
            <div className="p-4 text-center">
              {!enoughPoints ? (
                <>
                  <p className="text-[#D7C6A4]/80 tracking-wide mb-3 text-lg uppercase font-extrabold">
                    NOT ENOUGH POINTS ?
                  </p>
                  <Link
                    href="/"
                    aria-label="Go to quests to get more points"
                    className="
            inline-flex items-center gap-3
            rounded-md bg-[#A51124] hover:bg-[#C2172D]
            text-white font-semibold px-6 py-4
            text-lg
            transition
          "
                  >
                    {/* アイコン部分（白い円+矢印） */}
                    <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white">
                      <ArrowRight className="w-5 h-5" />
                    </span>
                    {/* テキスト */}
                    <span>Get more quest</span>
                  </Link>
                </>
              ) : (
                <div className="opacity-70">
                  <p className="text-sm">You have enough points.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 取得演出のオーバーレイ */}
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
            className="w-[520px] md:w-[720px] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
