import type { LocalizedText } from "./i18n";

/** ----------------------------------------------------------------
 * Image types for quests
 * ----------------------------------------------------------------*/
export type QuestImageUsage = "square" | "wide";

/** Represents an image for a specific UI usage */
export type QuestImage = {
  url: string; // Public/ CDN URL
  usage: QuestImageUsage; // "square" for grid tiles, "wide" for wider detail views
};

/** ----------------------------------------------------------------
 * Task types
 * ----------------------------------------------------------------*/
/** Type definition for an individual task within a quest */
export type QuestTask = {
  id: string; // Unique task ID (e.g., "task1")
  label: LocalizedText; // Display label or instruction (e.g., "Follow @xxx on X")
  points: number; // Points awarded for completing this task (e.g., 10)
  /** Optional button config for tasks that involve external actions (e.g., X follow, Discord join) */
  actionButton?: {
    label: LocalizedText; // e.g., "Follow on X", "Join Discord"
    url: string; // e.g., "https://twitter.com/xxx", "https://discord.gg/xxx"
  };
};

/** ----------------------------------------------------------------
 * Main Quest type
 * ----------------------------------------------------------------*/
export type Quest = {
  id: string; // Unique quest ID

  /** Associated project (e.g., game or campaign) */
  project: {
    name: LocalizedText; // Project name
    logoUrl: string; // Project logo image URL (single)
  };

  /** Main display content */
  title: LocalizedText; // Quest title
  description: LocalizedText; // Quest description or details
  catchphrase: LocalizedText; // Highlighted tagline or slogan
  backgroundImages: QuestImage[]; // Replaces backgroundImageUrl; holds multiple images by usage

  /** List of tasks associated with this quest */
  tasks: QuestTask[];

  /** Quest-specific settings (internal use, not user-facing) */
  settings: {
    /** Order in HeroCarousel (null = not shown, 1..N = display order) */
    heroCarouselOrder: number | null;
  };

  /** Record timestamps */
  timestamps: {
    createdAt: Date; // Creation date
    updatedAt: Date; // Last updated date
  };
};
