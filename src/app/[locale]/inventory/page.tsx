"use client";

import { useUser } from "@/providers/user-provider";
import { InventoryCard } from "@/components/shared/InventoryCard";
import { CubeRarity } from "@/types/cube";

const rarityList: CubeRarity[] = ["legendary", "superRare", "rare", "common"];

export default function InventoryPage() {
  const { user, loading } = useUser();

  if (loading || !user) {
    return (
      <div className="w-full text-center py-20 text-gray-400">
        Loading inventory...
      </div>
    );
  }

  const totalCubes = rarityList.reduce(
    (sum, rarity) => sum + (user.inventory.cubes[rarity] ?? 0),
    0,
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-white">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">
          My Inventory
        </h1>
        <div className="flex gap-6 text-sm md:text-base">
          <span>
            Total Points: <strong>{user.inventory.points}</strong>
          </span>
          <span>
            Total Cubes: <strong>{totalCubes}</strong>
          </span>
        </div>
      </div>

      {/* Grid View of Qube Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rarityList.map((rarity) => (
          <InventoryCard
            key={rarity}
            rarity={rarity}
            quantity={user.inventory.cubes[rarity] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
