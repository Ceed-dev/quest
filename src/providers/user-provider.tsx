"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useActiveAccount } from "thirdweb/react";
import { getUserEmail } from "thirdweb/wallets/in-app";
import { client } from "@/lib/client";
import { db } from "@/lib/firebase";
import { handleCreateUser } from "@/lib/handleCreateUser";
import type { User } from "@/types/user";

type UserContextValue =
  | { user: null; loading: true; isNewUser: false }
  | { user: User; loading: false; isNewUser: boolean };

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  isNewUser: false,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const account = useActiveAccount();
  const [state, setState] = useState<UserContextValue>({
    user: null,
    loading: true,
    isNewUser: false,
  });

  useEffect(() => {
    if (!account) {
      setState({ user: null, loading: true, isNewUser: false });
      return;
    }

    const ref = doc(db, "users", account.address);

    (async () => {
      const email = await getUserEmail({ client });
      const isNew = await handleCreateUser({
        walletAddress: account.address,
        email: email ?? "",
      });

      const unsub = onSnapshot(ref, (snap) => {
        if (!snap.exists()) return;

        const data = snap.data() as User;

        setState({
          user: {
            ...data,
            walletAddress: account.address,
          },
          loading: false,
          isNewUser: isNew,
        });
      });

      return () => unsub();
    })();
  }, [account]);

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
