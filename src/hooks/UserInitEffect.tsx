"use client";

import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { getUserEmail } from "thirdweb/wallets/in-app";
import { client } from "@/lib/client";
import { handleCreateUser } from "@/lib/handleCreateUser";

export function UserInitEffect() {
  const account = useActiveAccount();

  useEffect(() => {
    const createUser = async () => {
      if (!account) return;

      const email = await getUserEmail({ client });
      if (!email) return;

      await handleCreateUser({
        walletAddress: account.address,
        email,
      });
    };

    createUser();
  }, [account]);

  return null;
}
