"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type InventoryCardProps = {
  rarity: "legendary" | "superRare" | "rare" | "common";
  quantity: number;
};

// 背景SVG（既存のまま）
const bgByRarity: Record<InventoryCardProps["rarity"], string> = {
  legendary: "/inventory/bg-legendary.svg",
  superRare: "/inventory/bg-superRare.svg",
  rare: "/inventory/bg-rare.svg",
  common: "/inventory/bg-common.svg",
};

// 追加：下ボーダー用カラー
const borderColorByRarity: Record<InventoryCardProps["rarity"], string> = {
  common: "#DDDDDD",
  rare: "#E2FFA4",
  superRare: "#BC99FF",
  legendary: "#F6D13A",
};

export function InventoryCard({ rarity, quantity }: InventoryCardProps) {
  const t = useTranslations("inventoryCard");
  const label = t(`rarity.${rarity}`);

  return (
    <div
      className={cn("relative w-full aspect-[273/476] overflow-hidden group")}
    >
      {/* 背景（枠・グロー込み） */}
      <Image
        src={bgByRarity[rarity]}
        alt=""
        aria-hidden
        fill
        className="object-cover"
        sizes="(min-width:1024px) 22vw, (min-width:768px) 30vw, 45vw"
        priority={false}
      />

      {/* 下ボーダー（レアリティカラー） */}
      <div
        className="pointer-events-none absolute left-0 right-0 bottom-0 h-1"
        style={{ backgroundColor: borderColorByRarity[rarity] }}
        aria-hidden
      />

      {/* オーバーレイ内容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-between p-5">
        {/* 数量 */}
        <div className="w-full flex justify-center">
          <p
            className="text-center text-[64px] font-semibold leading-none
               bg-clip-text text-transparent
               drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
            style={{
              backgroundImage: `linear-gradient(to bottom, ${borderColorByRarity[rarity]}, #FFFFFF)`,
            }}
          >
            {quantity}
          </p>
        </div>

        {/* キューブアイコン */}
        <Image
          src={`/cube/${rarity}.svg`}
          alt={t("cubeAlt", { rarity: label })}
          width={160}
          height={160}
          className="transition-transform duration-300 group-hover:-translate-y-1"
        />

        {/* ラベル */}
        <div className="text-center">
          <p
            className="font-semibold uppercase tracking-wide text-[24px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
            style={{ color: borderColorByRarity[rarity] }}
          >
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
