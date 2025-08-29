"use client";

import { useUser } from "@/providers/user-provider";
import { InventoryCard } from "@/components/shared/InventoryCard";
import { CubeRarity } from "@/types/cube";
import { useTranslations } from "next-intl";

const rarityList: CubeRarity[] = ["common", "rare", "superRare", "legendary"];

export default function InventoryPage() {
  const { user, loading } = useUser();
  const t = useTranslations("inventory");

  if (loading || !user) {
    return (
      <div className="w-full text-center py-20 text-gray-400">
        {t("loading")}
      </div>
    );
  }

  const totalCubes = rarityList.reduce(
    (sum, r) => sum + (user.inventory.cubes[r] ?? 0),
    0,
  );

  return (
    <div className="w-full">
      {/* 中央ダークパネル */}
      <section
        className="
          mx-auto w-full
          rounded-2xl bg-[#1C1C1C] text-white
          shadow-[0_6px_28px_rgba(0,0,0,0.28)]
          px-6 sm:px-10 py-10
        "
      >
        <div className="max-w-6xl mx-auto">
          {/* タイトル */}
          <h1
            className="
              text-center uppercase tracking-wide mb-8
              text-[40px] sm:text-[52px] font-extrabold
              bg-gradient-to-r from-[#D5B77A] to-white
              bg-clip-text text-transparent
            "
          >
            {t("title")}
          </h1>

          {/* サマリー（Total Points / Total Cubes） */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
            <StatsCard label={t("totalPoints")} value={user.inventory.points} />
            <StatsCard label={t("totalCubes")} value={totalCubes} />
          </div>

          {/* カード配置（レイアウトのみ調整） */}
          <div
            className="
              grid gap-6
              grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
              items-stretch
            "
          >
            {rarityList.map((rarity) => (
              <InventoryCard
                key={rarity}
                rarity={rarity}
                quantity={user.inventory.cubes[rarity] ?? 0}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* 内部用：小さな統計カード */
function StatsCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-1 border-[#D5B77A] rounded-xl p-5">
      <p className="text-[20px] tracking-widest uppercase text-[#D7C6A4] mb-2">
        {label}
      </p>
      <p
        className="
          text-4xl md:text-[64px] font-extrabold leading-none
          bg-gradient-to-b from-[#D5B77A] to-white
          bg-clip-text text-transparent
          drop-shadow-[0_6px_0_rgba(0,0,0,0.45)]
        "
      >
        {value}
      </p>
    </div>
  );
}
