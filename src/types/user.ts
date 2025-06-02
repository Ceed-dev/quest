export type User = {
  walletAddress?: string;
  email: string;
  socialIds: {
    x: string;
    discord: string;
  };
  totalPoints: number;
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
};
