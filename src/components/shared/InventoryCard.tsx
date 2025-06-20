"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type InventoryCardProps = {
  rarity: "legendary" | "superRare" | "rare" | "common";
  quantity: number;
};

const rarityStyles: Record<string, string> = {
  legendary: "bg-yellow-100 border-yellow-400 text-yellow-900",
  superRare: "bg-purple-100 border-purple-400 text-purple-900",
  rare: "bg-green-100 border-green-400 text-green-900",
  common: "bg-gray-100 border-gray-400 text-gray-900",
};

const rarityLabel: Record<string, string> = {
  legendary: "Legendary",
  superRare: "Super Rare",
  rare: "Rare",
  common: "Common",
};

export function InventoryCard({ rarity, quantity }: InventoryCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border-2 p-4 w-full h-full flex flex-col items-center justify-center text-center shadow-md",
        "transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl",
        rarityStyles[rarity],
      )}
    >
      <Image
        src={`/cube/${rarity}.svg`}
        alt={`${rarity} Qube`}
        width={200}
        height={200}
        className="mb-2"
      />
      <h3 className="text-lg font-bold">{rarityLabel[rarity]}</h3>
      <p className="text-sm font-medium">Quantity: {quantity}</p>
    </div>
  );
}
