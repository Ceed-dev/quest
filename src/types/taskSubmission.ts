export type TaskSubmission = {
  userId: string;
  questId: string;
  taskId: string;
  imageUrl: string;
  points: number;
  status: "pending" | "approved" | "rejected";
  timestamps: {
    submittedAt: Date;
    approvedAt: Date | null;
    rejectedAt: Date | null;
  };
};
