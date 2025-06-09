import { db } from "./firebase";
import { doc, runTransaction } from "firebase/firestore";
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

/**
 * Performs a secure gacha spin using Firestore transaction.
 * Ensures user has enough points and updates the inventory atomically.
 * @param userId - Firestore user document ID
 * @returns the obtained cube rarity, or null if points are insufficient or error occurs
 */
export async function performGachaSpin(
  userId: string,
): Promise<CubeRarity | null> {
  const userRef = doc(db, "users", userId);

  try {
    const result = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists()) {
        throw new Error("User does not exist.");
      }

      const userData = userDoc.data();
      const currentPoints = userData?.inventory?.points ?? 0;

      if (currentPoints < 50) {
        throw new Error("Insufficient points.");
      }

      const rarity = getRandomCubeRarity();

      transaction.update(userRef, {
        "inventory.points": currentPoints - 50,
        [`inventory.cubes.${rarity}`]:
          (userData.inventory?.cubes?.[rarity] ?? 0) + 1,
      });

      return rarity;
    });

    return result;
  } catch (error) {
    console.error("Gacha spin failed:", error);
    return null;
  }
}
