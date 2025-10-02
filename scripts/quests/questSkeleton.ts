/**
 * Quest / Task skeletons (defaults only)
 * --------------------------------------
 * - These constants provide empty/default shapes for Firestore documents.
 * - No runtime logic here; creation logic lives in createSkeleton.ts.
 * - Do NOT modify behavior here unless the schema itself changes.
 *
 * Notes:
 * - LocalizedText is assumed to be `{ defaultLocale: "en", en: string, ja: string }`.
 * - Timestamps are placeholders; serverTimestamp() is injected in createSkeleton.ts.
 */

/** LocalizedText factory (empty) */
const lt = () => ({ defaultLocale: "en", en: "", ja: "" });

/**
 * Shape for a single empty QuestTask used at initialization time.
 * Notes:
 * - `id` stays a plain `string` so the creator script can inject a generated ID.
 * - `label` and `actionButton.label` follow the LocalizedText placeholder from `lt()`.
 */
export type TaskSkeletonShape = {
  /** Unique task identifier (assigned later, e.g., nanoid/shortId) */
  id: string;

  /** Instruction shown to the user (localized) */
  label: ReturnType<typeof lt>;

  /** Default points awarded for completing this task */
  points: number;

  /** Optional external action; included by default for easier manual editing */
  actionButton: {
    /** Button label (localized) */
    label: ReturnType<typeof lt>;
    /** Destination URL (e.g., X profile, Discord invite) */
    url: string;
  };
};

/**
 * Default, JSON-serializable skeleton for a QuestTask.
 * IMPORTANT: Do NOT use `as const` here; `id` must remain writable (`string`)
 * so later assignment of generated IDs does not fail.
 */
export const TASK_SKELETON: TaskSkeletonShape = {
  id: "", // will be replaced (e.g., "7UKa8Am4kVJrXJupTXicy7")
  label: lt(), // LocalizedText
  points: 0, // default points

  actionButton: {
    label: lt(), // LocalizedText
    url: "", // empty URL; remove the field if unused
  },
} as const;

/**
 * Skeleton for a Quest document (without `id` field).
 * - This is the base shape written to `quests/<id>`.
 * - Fields are intentionally empty so they can be filled via Console.
 */
export const QUEST_SKELETON = {
  // NOTE: `id` will be injected in createSkeleton.ts (not stored here).

  project: {
    // If your schema expects LocalizedText here, adjust manually.
    name: "", // LocalizedText (placeholder kept as empty string per current spec)
    logoUrl: "", // single logo image URL
  },

  // Main display content
  title: lt(), // LocalizedText
  description: lt(), // LocalizedText
  catchphrase: lt(), // LocalizedText

  // Background images by usage
  backgroundImages: [
    { url: "", usage: "square" as const },
    { url: "", usage: "wide" as const },
  ],

  // Tasks are added later (optionally generated from TASK_SKELETON)
  tasks: [],

  // Internal settings (non user-facing)
  settings: {
    heroCarouselOrder: null, // null = not shown in HeroCarousel
    isVisible: false, // start hidden; toggle when ready
  },

  // Placeholder timestamps; replaced with serverTimestamp() at creation
  timestamps: {
    createdAt: null,
    updatedAt: null,
  },
} as const;
