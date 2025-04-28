export type User = {
  walletAddress?: string;
  email: string;
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
};
