"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { QuestCard } from "@/components/QuestCard";
import { quests } from "@/data/quests";
import { client } from "@/lib/client";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { getUserEmail } from "thirdweb/wallets/in-app";
import { handleCreateUser } from "@/lib/handleCreateUser";

export default function HomePage() {
  const wallets = useMemo(
    () => [
      inAppWallet({
        auth: { options: ["email", "google"] },
      }),
    ],
    [],
  );

  const account = useActiveAccount();

  useEffect(() => {
    const createUser = async () => {
      if (account) {
        const email = await getUserEmail({ client });

        if (email) {
          await handleCreateUser({
            walletAddress: account.address,
            email: email,
          });
        }
      }
    };

    createUser();
  }, [account]);

  return (
    <div className="p-6 md:p-10 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Token Reward</h1>

        <div className="flex items-center gap-4">
          {/* ConnectButton */}
          <ConnectButton client={client} wallets={wallets} />

          {/* Profile Icon */}
          <Link href="/profile">
            <Image
              src="https://app.questn.com/static/users/cute_squad_3.png"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-black cursor-pointer"
            />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto w-full">
        {quests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
}
