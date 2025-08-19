import type { LocalizedText } from "./i18n";

// Type definition for an individual task within a quest
export type QuestTask = {
  id: string; // Unique task ID (e.g., "task1")
  label: LocalizedText; // Display label or instruction (e.g., "Follow @xxx on X")
  points: number; // Points awarded for completing this task (e.g., 10)

  // Optional button config for tasks that involve external actions (e.g., X follow, Discord join)
  actionButton?: {
    label: LocalizedText; // e.g., "Follow on X", "Join Discord"
    url: string; // e.g., "https://twitter.com/xxx", "https://discord.gg/xxx"
  };
};

// Main Quest type definition (MVP version)
export type Quest = {
  id: string; // Unique quest ID

  // Associated project (e.g., game or campaign)
  project: {
    name: LocalizedText; // Project name
    logoUrl: string; // Project logo image URL
  };

  // Main display content
  title: LocalizedText; // Quest title
  description: LocalizedText; // Quest description or details
  catchphrase: LocalizedText; // Highlighted tagline or slogan
  backgroundImageUrl: string; // Background image for ItemCard or display

  // List of tasks associated with this quest
  tasks: QuestTask[];

  // Record timestamps
  timestamps: {
    createdAt: Date; // Creation date
    updatedAt: Date; // Last updated date
  };
};
