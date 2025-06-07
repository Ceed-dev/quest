// Cube rarity types
export type CubeRarity = "legendary" | "superRare" | "rare" | "common";

// For example, a user's owned cube inventory
export type CubeInventory = {
  [key in CubeRarity]: number;
};
