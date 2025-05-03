// Supported task types (expandable in the future)
export type TaskType = "x_follow" | "x_like" | "x_repost"; // X only for now

// Base structure for one task within a quest
export type QuestTask = {
  id: string; // Unique task ID (e.g., "task1")
  type: TaskType; // Action type (e.g., "x_follow")
  label: string; // Display label (e.g., "Follow @xxx on X")
  targetUrl: string; // Link to visit (e.g., tweet or profile)
};

// Shared stat structure for reward/task progress tracking
export type AggregatedStat = {
  count: number;
  timestamps: {
    first: {
      userId: string;
      at: Date;
    };
    last: {
      userId: string;
      at: Date;
    };
  };
  byDay: {
    [date: `${number}-${number}-${number}`]: number; // e.g., "2025-05-03"
  };
};

// Reward-specific stat type
export type RewardStats = AggregatedStat;

// Task-specific stat type mapped by taskId
export type TaskStats = {
  [taskId: string]: AggregatedStat;
};

// Main Quest type definition
export type Quest = {
  id: string;

  // Client (organization or team) that owns the quest
  client: {
    name: string;
    logoUrl: string;
    createdBy: string; // walletAddress or user ID of the quest creator
  };

  // Visibility and lifecycle status
  visibility: "public" | "private";
  status: "draft" | "active" | "archived" | "ended";

  // Optional metadata for organization and search
  category: string;
  tags: string[];

  // Main content
  title: string;
  description: string;

  // Quest availability period
  period: {
    start: Date;
    end: Date;
  };

  // Task definitions required to complete the quest
  tasks: QuestTask[];

  // Reward structure for the quest
  reward: {
    type: "point"; // Currently only supporting "point"
    amountPerUser: number; // Reward per user (e.g., 2.1)
    slots: number; // Max number of claimable slots
  };

  // Aggregated performance statistics
  stats: {
    rewardStats: RewardStats;
    taskStats: TaskStats;
  };

  // Audit timestamps
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
};
