export type Quest = {
  id: string;
  clientName: string;
  clientLogoUrl: string;
  description: string;
  rewardAmount: number;
  rewardTokenSymbol: string;
  rewardTokenIconUrl: string;
  highlightText: string;
};

export const quests: Quest[] = [
  {
    id: "quest_cleanapp",
    clientName: "CleanApp",
    clientLogoUrl: "https://cdn.questn.com/community/828883743300329826.jpg",
    description: "STXN x CleanApp",
    rewardAmount: 525,
    rewardTokenSymbol: "USDT",
    rewardTokenIconUrl: "https://app.questn.com/static/tokens/usdt.svg",
    highlightText: "525 USDT",
  },
  {
    id: "quest_dragonslots",
    clientName: "DragonSlots",
    clientLogoUrl: "https://cdn.questn.com/community/994116392642269619.png",
    description: "Welcome to DragonSlots!",
    rewardAmount: 350,
    rewardTokenSymbol: "USDT",
    rewardTokenIconUrl: "https://app.questn.com/static/tokens/usdt.svg",
    highlightText: "350 USDT",
  },
  {
    id: "quest_freebnk",
    clientName: "FreeBnk",
    clientLogoUrl: "https://cdn.questn.com/community/1025639953958179196.PNG",
    description: "Get to know Freebnk!",
    rewardAmount: 350,
    rewardTokenSymbol: "USDT",
    rewardTokenIconUrl: "https://app.questn.com/static/tokens/usdt.svg",
    highlightText: "350 USDT",
  },
  {
    id: "quest_eragon",
    clientName: "ERAGON Web3 Mobile Gaming",
    clientLogoUrl: "https://cdn.questn.com/community/894110079912780261.png",
    description: "🥚 Easter Fest 2025 - $50 in ERAGON Egg",
    rewardAmount: 34.9993,
    rewardTokenSymbol: "USDT",
    rewardTokenIconUrl: "https://app.questn.com/static/tokens/usdt.svg",
    highlightText: "34.9993 USDT",
  },
];
