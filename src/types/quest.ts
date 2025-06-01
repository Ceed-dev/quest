// Type definition for an individual task within a quest
export type QuestTask = {
  id: string; // Unique task ID (e.g., "task1")
  label: string; // Display label or instruction (e.g., "Follow @xxx on X")
  points: number; // Points awarded for completing this task (e.g., 10)
};

// Main Quest type definition (MVP version)
export type Quest = {
  id: string; // Unique quest ID

  // Associated project (e.g., game or campaign)
  project: {
    name: string; // Project name
    logoUrl: string; // Project logo image URL
  };

  // Main display content
  title: string; // Quest title
  description: string; // Quest description or details
  catchphrase: string; // Highlighted tagline or slogan
  backgroundImageUrl: string; // Background image for ItemCard or display

  // List of tasks associated with this quest
  tasks: QuestTask[];

  // Record timestamps
  timestamps: {
    createdAt: Date; // Creation date
    updatedAt: Date; // Last updated date
  };
};
