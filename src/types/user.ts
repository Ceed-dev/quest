export type User = {
  walletAddress?: string;
  email: string;
  socialIds: {
    x: string;
    discord: string;
  };
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
};
