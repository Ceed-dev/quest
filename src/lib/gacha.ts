import type { CubeRarity } from "@/types/cube";

/**
 * Returns a cube rarity based on drop rates using cumulative probability.
 *
 * Drop Rates:
 * - Legendary:   0.5%
 * - Super Rare:  4.5%
 * - Rare:       20%
 * - Common:     75%
 *
 * The function rolls a random number between 0 and 100 and checks
 * which cumulative range it falls into:
 * [0 - 0.5)   → Legendary
 * [0.5 - 5.0) → Super Rare
 * [5.0 - 25.0)→ Rare
 * [25.0 - 100]→ Common
 */
export function getRandomCubeRarity(): CubeRarity {
  const random = Math.random() * 100;

  // Cumulative probability ranges
  if (random < 0.5) return "legendary"; // 0.5%
  if (random < 0.5 + 4.5) return "superRare"; // 4.5%
  if (random < 0.5 + 4.5 + 20) return "rare"; // 20%
  return "common"; // 75%
}
