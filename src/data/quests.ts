export type Quest = {
  id: string;
  clientName: string;
  clientLogoUrl: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  tasks: {
    label: string;
    iconUrl: string;
  }[];
  rewardAmount: number;
  rewardTokenSymbol: string;
  rewardTokenIconUrl: string;
  highlightText: string;
  chainName: string;
  chainIconUrl: string;
  questersCount: number;
  questersAvatars: string[];
  isClaimed: boolean;
};

export const quests: Quest[] = [
  {
    id: "quest_cleanapp",
    clientName: "CleanApp",
    clientLogoUrl: "https://cdn.questn.com/community/828883743300329826.jpg",
    title: "STXN x CleanApp",
    description: `CleanApp recently crossed 350K installs & growing fast!!!

Powered by Smart Transactions (STXN), CleanApp is on a mission to make waste/hazard/bug reporting as easy as clicking a button.

This quest is designed to maximize awareness about the CleanApp x STXN integration. With the next milestone being 500K installs, and beyond!`,
    startAt: "2025-04-02T22:00:00+09:00",
    endAt: "2025-04-30T22:00:00+09:00",
    tasks: [
      {
        label: "Follow @stxn_io on X",
        iconUrl: "https://cdn.questn.com/template/twitter-black.svg",
      },
      {
        label: "Visit @cleanapp on Instagram",
        iconUrl: "https://cdn.questn.com/template/instagram.svg",
      },
      {
        label: "Join STXN Discord server",
        iconUrl: "https://cdn.questn.com/template/discord-active.svg",
      },
    ],
    rewardAmount: 525,
    rewardTokenSymbol: "USDT",
    rewardTokenIconUrl: "https://app.questn.com/static/tokens/usdt.svg",
    highlightText: "525 USDT",
    chainName: "Polygon",
    chainIconUrl: "https://app.questn.com/static/networks/polygon.svg",
    questersCount: 999,
    questersAvatars: [
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
    ],
    isClaimed: false,
  },
  {
    id: "quest_dragonslots",
    clientName: "DragonSlots",
    clientLogoUrl: "https://cdn.questn.com/community/994116392642269619.png",
    title: "Welcome to DragonSlots!",
    description: `**DragonSlots – Your Gateway to Thrilling Online Gaming!** 🎰🔥

**DragonSlots** is a new and bright star in the world of online gaming, offering a legendary selection of **slots, table games, and live casino** experiences. Here, you'll find yourself at the heart of an unforgettable adventure filled with fantastic wins and exciting moments.

We offer:
✅ A vast range of slots, table, and live games  
✅ **Safe** and fast transactions  
✅ **24/7 professional support**  
✅ Generous **bonuses** and regular promotions  
✅ Transparency and responsible gaming practices

🔥 Use promo code **QUESTN3** when signing up and kickstart your adventure at DragonSlots with amazing rewards!

🏆 **Start your adventure now and enjoy every moment!**`,
    startAt: "2025-04-02T22:00:00+09:00",
    endAt: "2025-04-30T22:00:00+09:00",
    tasks: [
      {
        label: "Follow @stxn_io on X",
        iconUrl: "https://cdn.questn.com/template/twitter-black.svg",
      },
      {
        label: "Visit @cleanapp on Instagram",
        iconUrl: "https://cdn.questn.com/template/instagram.svg",
      },
      {
        label: "Join STXN Discord server",
        iconUrl: "https://cdn.questn.com/template/discord-active.svg",
      },
    ],
    rewardAmount: 350,
    rewardTokenSymbol: "USDT",
    rewardTokenIconUrl: "https://app.questn.com/static/tokens/usdt.svg",
    highlightText: "350 USDT",
    chainName: "Polygon",
    chainIconUrl: "https://app.questn.com/static/networks/polygon.svg",
    questersCount: 999,
    questersAvatars: [
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
    ],
    isClaimed: false,
  },
  {
    id: "quest_freebnk",
    clientName: "FreeBnk",
    clientLogoUrl: "https://cdn.questn.com/community/1025639953958179196.PNG",
    title: "Get to know Freebnk!",
    description: `**25 winners!**

**Complete the tasks and be part of the incredible Freebnk ecosystem.**

Additional task on the app`,
    startAt: "2025-04-02T22:00:00+09:00",
    endAt: "2025-04-30T22:00:00+09:00",
    tasks: [
      {
        label: "Follow @stxn_io on X",
        iconUrl: "https://cdn.questn.com/template/twitter-black.svg",
      },
      {
        label: "Visit @cleanapp on Instagram",
        iconUrl: "https://cdn.questn.com/template/instagram.svg",
      },
      {
        label: "Join STXN Discord server",
        iconUrl: "https://cdn.questn.com/template/discord-active.svg",
      },
    ],
    rewardAmount: 350,
    rewardTokenSymbol: "USDT",
    rewardTokenIconUrl: "https://app.questn.com/static/tokens/usdt.svg",
    highlightText: "350 USDT",
    chainName: "Polygon",
    chainIconUrl: "https://app.questn.com/static/networks/polygon.svg",
    questersCount: 999,
    questersAvatars: [
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
    ],
    isClaimed: false,
  },
  {
    id: "quest_eragon",
    clientName: "ERAGON Web3 Mobile Gaming",
    clientLogoUrl: "https://cdn.questn.com/community/894110079912780261.png",
    title: "🥚 Easter Fest 2025 - $50 in ERAGON Egg",
    description: `**Easter Fest 2025 is Here – Let the Battle Together 🐰🥚**

Easter Fest 2025 has officially kicked off on ERAGON and we’ve teamed up with some awesome partners: FishWar x Kana Labs x Gilder

We’re talking real action, real rewards, and a whole lot of surprises packed in just for y’all.

---

**🎉 Event Details**

**ROUND 1️⃣ SOCIAL GIVEAWAY ON QUESTN - PRIZE POOL $200**  
📍 Duration: April 18 – April 27  
Crack the Eggs to claim your luck 🌳

💰 ERAGON Egg: https://app.questn.com/quest/1027363189296128394  
💰 Gilder Egg: https://app.questn.com/quest/1027360521009946789  
💰 Kana Labs Egg: https://app.questn.com/quest/1027357787148325061  
💰 FishWar Egg: https://app.questn.com/quest/1027358562676826177  

---

**ROUND 2️⃣ EASTER AMA - PRIZE POOL $100**  
📍 Date & Time: 2pm UTC | April 23rd, 2025  
🌳 Venue: https://twitter.com/i/spaces/1YqGoowggWAGv  
♟ Host: ERAGON  
🧩 Speakers:  
- Raymond | CEO of Gilder  
- Kingsley - COO of FishWar.io  
- Karthik - CEO of Kana Labs  

---

**ROUND 3️⃣ REAL-TIME AIRDROP IN ERAVERSE - PRIZE POOL $500 + 5M EGON**  
🏆 Date: April 29, 2025  
📍 Venue: https://eragon.gg/eraverse/home  
- Round 1: 04:00 - 05:00 UTC  
- Round 2: 10:00 - 11:00 UTC  
- Round 3: 16:00 - 17:00 UTC

---

**🌈 HOW TO CLAIM AIRDROP AT ERAGON?**  
1. Complete all the tasks  
2. Login to Eragon.gg  
3. Click to "Eraverse"  
4. Airdrop time: April 29, 2025  
  - Round 1: 04:00 - 05:00 UTC  
  - Round 2: 10:00 - 11:00 UTC  
  - Round 3: 16:00 - 17:00 UTC  
5. Move your character to the airdrop boxes and press E to receive reward

Let’s make this Easter unforgettable!!!`,
    startAt: "2025-04-02T22:00:00+09:00",
    endAt: "2025-04-30T22:00:00+09:00",
    tasks: [
      {
        label: "Follow @stxn_io on X",
        iconUrl: "https://cdn.questn.com/template/twitter-black.svg",
      },
      {
        label: "Visit @cleanapp on Instagram",
        iconUrl: "https://cdn.questn.com/template/instagram.svg",
      },
      {
        label: "Join STXN Discord server",
        iconUrl: "https://cdn.questn.com/template/discord-active.svg",
      },
    ],
    rewardAmount: 34.9993,
    rewardTokenSymbol: "USDT",
    rewardTokenIconUrl: "https://app.questn.com/static/tokens/usdt.svg",
    highlightText: "34.9993 USDT",
    chainName: "Polygon",
    chainIconUrl: "https://app.questn.com/static/networks/polygon.svg",
    questersCount: 999,
    questersAvatars: [
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
      "https://app.questn.com/static/users/im_not_a_muggle_1.png",
    ],
    isClaimed: false,
  },
];
