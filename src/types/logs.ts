// ==========================
// 🔹 Task Submission Log Types
// ==========================

// Task types represent various task mechanisms.
// Can be extended as more task types are introduced.
export type TaskType =
  | "screenshot"
  | "url"
  | "follow_x"
  | "join_discord"
  | "button_click"
  | "other";

// Methods used to verify task submissions.
// Extendable to support automated verification (e.g., via APIs).
export type VerificationMethod = "manual" | "x_api" | "discord_api" | "other";

// Status of the task submission review process.
export type TaskSubmissionStatus = "pending" | "approved" | "rejected";

// Main structure for storing a task submission log entry.
export type TaskSubmissionLog = {
  ids: {
    userId: string; // ID of the user who submitted the task
    questId: string; // Associated quest
    taskId: string; // Specific task within the quest
  };

  taskType: TaskType;

  // Payload contains submission-specific data.
  // imageUrl is optional; other task types may include other fields dynamically.
  payload: {
    imageUrl?: string;
  } & Record<string, unknown>;

  verification: {
    method: VerificationMethod; // How the submission was verified
  };

  status: TaskSubmissionStatus;

  points: number; // Points awarded upon approval

  timestamps: {
    submittedAt: Date; // When the user submitted the task
    approvedAt?: Date; // When approved (if applicable)
    rejectedAt?: Date; // When rejected (if applicable)
  };
};
