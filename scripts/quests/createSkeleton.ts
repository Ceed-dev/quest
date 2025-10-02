/**
 * Create an empty Quest document from skeletons (auto-generated doc ID)
 * --------------------------------------------------------------------
 * - Writes `quests/<autoId>` with defaults from QUEST_SKELETON.
 * - Generates N empty tasks from TASK_SKELETON (default: 5).
 *
 * Run:
 *   # npm (recommended in this repo)
 *   npm run quest:skeleton                 // tasks = 5
 *   npm run quest:skeleton -- --tasks=8    // override task count
 *
 *   # If you use "pnpm"
 *   pnpm quest:skeleton
 *   pnpm quest:skeleton --tasks=8
 */

import { randomBytes } from "crypto"; // Node core (short ID gen)
import { db, FieldValue } from "../admin"; // Firebase Admin bootstrap
import { QUEST_SKELETON, TASK_SKELETON } from "./questSkeleton";

// ---------- CLI args ---------------------------------------------------------

/** Parse CLI arg like `--key=value` (returns undefined if missing). */
const arg = (name: string): string | undefined => {
  const p = `--${name}=`;
  const hit = process.argv.find((v) => v.startsWith(p));
  return hit ? hit.slice(p.length) : undefined;
};

// ---------- utils ------------------------------------------------------------

/** Make all properties (recursively) mutable to allow edits after cloning. */
type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> };

/** JSON deep clone that returns a mutable structure. */
const clone = <T>(obj: T): Mutable<T> => JSON.parse(JSON.stringify(obj));

/** ~22-char short ID (URL-safe base64) e.g., '7UKa8Am4kVJrXJupTXicY7' */
const shortId = () => randomBytes(16).toString("base64url");

/** Build an array of N empty tasks with unique IDs. */
function makeTasks(n: number) {
  return Array.from({ length: n }).map(() => {
    const t: Mutable<typeof TASK_SKELETON> = clone(TASK_SKELETON);
    t.id = shortId();
    return t;
  });
}

// ---------- main -------------------------------------------------------------

async function main() {
  // Resolve task count (default 5 when not provided or invalid)
  const tasksRaw = arg("tasks");
  const tasksCount = Number.isFinite(Number(tasksRaw))
    ? Math.max(0, parseInt(tasksRaw as string, 10))
    : 5;

  // Create a document reference with an auto-generated ID
  const ref = db.collection("quests").doc();
  const id = ref.id;

  // Build payload from skeletons
  const payload = {
    ...clone(QUEST_SKELETON),
    id, // keep ID in the document (optional)
    tasks: makeTasks(tasksCount), // generate N empty tasks
    timestamps: {
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
  };

  // Write the new document (full replace semantics)
  await ref.set(payload, { merge: false });

  console.log(
    `✅ Created quest skeleton at quests/${id} (tasks: ${tasksCount})`,
  );
}

// Execute
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
