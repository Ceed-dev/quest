import { CubeInventory } from "./cube";

export type User = {
  walletAddress?: string;
  email: string;
  socialIds: {
    x: string;
    discord: string;
  };
  inventory: {
    points: number;
    cubes: CubeInventory;
  };
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
};
