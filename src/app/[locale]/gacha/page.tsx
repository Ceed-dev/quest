"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Info, ArrowRight } from "lucide-react";
import { useUser } from "@/providers/user-provider";
import { CubeRarity } from "@/types/cube";
import { performGachaSpin } from "@/lib/gacha";
import { useTranslations } from "next-intl";
import Link from "next/link";

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
          p-4 sm:p-6 md:p-8
          h-auto lg:h-[calc(100vh-160px)]
          overflow-visible lg:overflow-hidden
          flex flex-col min-h-0
        "
      >
        {/* タイトル（モバイルは少し小さく） */}
        <h1
          className="
            text-center text-[40px] md:text-[64px] font-extrabold tracking-wide mb-4 md:mb-6
            bg-gradient-to-r from-[#D5B77A] to-white
            bg-clip-text text-transparent uppercase
          "
        >
          {t("title")}
        </h1>

        {/* 3等分グリッド：左/中央/右（モバイルは並び替え） */}
        <div
          className="
            grid gap-6 flex-1 min-h-0
            grid-cols-1 lg:grid-cols-3
            items-stretch
          "
        >
          {/* 中央：ガチャ本体（モバイル最上段） */}
          <div className="order-1 lg:order-2 flex flex-col items-center justify-center h-full">
            <div className={`${enoughPoints ? "animate-pulse" : ""}`}>
              <Image
                src="/gacha/gachapon.svg"
                alt={t("gachaponAlt")}
                width={300}
                height={300}
                className="rounded-lg shadow-lg max-w-[92vw] h-[40vh] md:h-auto w-auto object-contain mx-auto"
                priority
              />
            </div>

            {/* ガチャボタン（グラデ） */}
            <button
              onClick={handleGacha}
              disabled={!enoughPoints}
              className={`
                mt-4 md:mt-6 px-4 py-3 font-bold rounded-md
                text-[20px] md:text-[24px] text-[#1C1C1C]
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

          {/* 左：ポイント & 所持キューブ（モバイルでは ①ポイント+CTA を横並び → ②その下に所持キューブ） */}
          <div className="order-2 lg:order-1 flex flex-col justify-center h-full w-full max-w-none lg:max-w-[300px]">
            {/* ① モバイル：ポイントとCTAを横並び（lgでは縦レイアウトに戻す） */}
            <div className="grid grid-cols-2 gap-3 lg:block">
              {/* Points */}
              <div className="rounded-xl border border-[#D5B77A] bg-black/40 p-4 md:p-5 mb-0 lg:mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[14px] md:text-[20px] tracking-widest uppercase font-semibold text-[#BBA98D]">
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
                <p
                  className="
                    text-[40px] md:text-[64px] leading-none font-extrabold
                    bg-gradient-to-b from-[#D5B77A] to-white
                    bg-clip-text text-transparent
                    drop-shadow-[0_6px_0_rgba(0,0,0,0.6)]
                  "
                >
                  {user?.inventory.points ?? 0}
                </p>
              </div>

              {/* CTA（モバイルのみ表示、右セルいっぱい） */}
              <div className="lg:hidden">
                {!enoughPoints ? (
                  <div className="h-full p-3 flex flex-col items-center justify-center text-center">
                    <p className="text-[#D7C6A4]/80 tracking-wide mb-2 text-[14px] uppercase font-extrabold">
                      NOT ENOUGH POINTS ?
                    </p>
                    <Link
                      href="/"
                      aria-label="Go to quests to get more points"
                      className="
                        inline-flex w-full items-center justify-center gap-2
                        rounded-md bg-[#A51124] hover:bg-[#C2172D]
                        text-white font-semibold p-1
                        text-[14px]
                        transition
                      "
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-white">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                      <span>Get more quest</span>
                    </Link>
                  </div>
                ) : (
                  <div className="h-full rounded-xl border border-[#D5B77A]/50 bg-black/30 p-3 flex items-center justify-center text-center opacity-70">
                    <p className="text-sm">You have enough points.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ② 所持キューブ一覧（モバイル最下段、デスクトップは左カラム下段） */}
            <div className="rounded-xl border border-[#D5B77A] bg-black/40 p-4 md:p-5 mt-3 lg:mt-5">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <p className="text-[16px] md:text-[20px] tracking-widest uppercase font-semibold text-[#BBA98D]">
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

              <div className="space-y-3 font-semibold">
                <RarityRow
                  active={highlightedRarity === "common"}
                  colorClass="text-gray-400"
                  icon="/cube/common.svg"
                  label={tInv("rarity.common")}
                  value={user?.inventory.cubes.common ?? 0}
                />
                <RarityRow
                  active={highlightedRarity === "rare"}
                  colorClass="text-green-400"
                  icon="/cube/rare.svg"
                  label={tInv("rarity.rare")}
                  value={user?.inventory.cubes.rare ?? 0}
                />
                <RarityRow
                  active={highlightedRarity === "superRare"}
                  colorClass="text-purple-400"
                  icon="/cube/superRare.svg"
                  label={tInv("rarity.superRare")}
                  value={user?.inventory.cubes.superRare ?? 0}
                />
                <RarityRow
                  active={highlightedRarity === "legendary"}
                  colorClass="text-yellow-400"
                  icon="/cube/legendary.svg"
                  label={tInv("rarity.legendary")}
                  value={user?.inventory.cubes.legendary ?? 0}
                />
              </div>
            </div>
          </div>

          {/* 右：CTA（デスクトップのみ表示＝既存のまま） */}
          <div className="hidden lg:flex order-3 items-center justify-center h-full">
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
                      text-lg transition
                    "
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white">
                      <ArrowRight className="w-5 h-5" />
                    </span>
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

      {/* 取得演出のオーバーレイ（既存ロジックそのまま） */}
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
            className="w-[320px] sm:w-[520px] md:w-[720px] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

/* 小パーツ：レアリティ1行 */
function RarityRow({
  active,
  colorClass,
  icon,
  label,
  value,
}: {
  active: boolean;
  colorClass: string;
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <div
      className={`flex items-center justify-between ${active ? "scale-[1.03]" : ""}`}
    >
      <div className={`flex items-center gap-3 ${colorClass}`}>
        <Image src={icon} alt={label} width={50} height={50} />
        <span className="text-[16px]">{label}</span>
      </div>
      <span
        className="text-[20px] md:text-[24px]
          bg-gradient-to-b from-[#D5B77A] to-white
          bg-clip-text text-transparent
          drop-shadow-[0_6px_0_rgba(0,0,0,0.6)]"
      >
        {value}
      </span>
    </div>
  );
}
