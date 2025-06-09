/**
 * 📦 Migration Script: Add inventory / Remove totalPoints from users
 *
 * Date: 2025-06-09
 * Author: shungo kimura
 *
 * Overview:
 *   This script migrates all user documents in the `users` collection in Firestore.
 *   It performs the following actions for each user:
 *     - Adds an `inventory` field (if not already present), with initial values:
 *         {
 *           points: 0,
 *           cubes: {
 *             legendary: 0,
 *             superRare: 0,
 *             rare: 0,
 *             common: 0
 *           }
 *         }
 *     - Removes the `totalPoints` field (if it exists).
 *
 * Features:
 *   - Supports dry-run mode for safe testing (set `dryRun = true`)
 *   - Uses Firebase Admin SDK with service account key
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/migrations/20250609_add-inventory-and-remove-totalPoints.ts
 *
 * Notes:
 *   - Make sure `scripts/serviceAccountKey.json` is ignored in .gitignore
 *   - This script is intended for one-time execution
 */

import admin, { ServiceAccount } from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";

// --- 🔐 Load service account key with type annotation ---
const serviceAccountPath = path.resolve(__dirname, "../serviceAccountKey.json");
const serviceAccount = JSON.parse(
  readFileSync(serviceAccountPath, "utf-8"),
) as ServiceAccount;

// --- 🚀 Initialize Firebase Admin ---
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// --- ⚙️ Dry-run mode: set to true to simulate without updating Firestore ---
const dryRun = false;

// --- 📦 Define initial CubeInventory values ---
const emptyCubeInventory: CubeInventory = {
  legendary: 0,
  superRare: 0,
  rare: 0,
  common: 0,
};

// --- 🧾 Type definitions ---
type CubeRarity = "legendary" | "superRare" | "rare" | "common";

type CubeInventory = {
  [key in CubeRarity]: number;
};

interface Inventory {
  points: number;
  cubes: CubeInventory;
}

interface UserData {
  inventory?: Inventory;
  totalPoints?: number;
  [key: string]: unknown;
}

// --- 🛠 Update all user documents in Firestore ---
async function updateAllUsers() {
  const usersSnap = await db.collection("users").get();
  console.log(`🔍 Found ${usersSnap.size} users`);

  for (const doc of usersSnap.docs) {
    const data = doc.data() as UserData;
    const updates: Partial<UserData> = {};
    const updatePayload: FirebaseFirestore.UpdateData<FirebaseFirestore.DocumentData> =
      {};

    let needsUpdate = false;

    // Add inventory if missing
    if (!data.inventory) {
      updates.inventory = {
        points: 0,
        cubes: emptyCubeInventory,
      };
      console.log(`🛠 Will add inventory to ${doc.id}`);
      needsUpdate = true;
    }

    // Delete totalPoints if present
    if ("totalPoints" in data) {
      updatePayload["totalPoints"] = admin.firestore.FieldValue.delete();
      console.log(`🗑 Will delete totalPoints from ${doc.id}`);
      needsUpdate = true;
    }

    // Apply updates if needed
    if (needsUpdate) {
      if (!dryRun) {
        await doc.ref.update({
          ...updates,
          ...updatePayload,
        });
        console.log(`✅ Updated ${doc.id}`);
      } else {
        console.log(`⚠️ (dry-run) Skipped actual update for ${doc.id}`);
      }
    } else {
      console.log(`➡️ Skipped ${doc.id} (no changes needed)`);
    }
  }

  console.log("🎉 All user updates completed.");
}

// --- 🏁 Execute ---
updateAllUsers().catch((error) => {
  console.error("❌ Error during user update:", error);
  process.exit(1);
});
