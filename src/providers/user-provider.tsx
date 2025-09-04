"use client";

/**
 * UserProvider
 * -----------------------------------------------
 * - Observes the active Thirdweb account (wallet).
 * - Ensures a corresponding user document exists in Firestore.
 * - Subscribes to that document in real time and exposes it via React Context.
 * - Public API: { user, loading, isNewUser, setIsNewUser }
 *
 * NOTE:
 * - This provider must live under <ThirdwebProvider>.
 * - Keep the effect dependency to `account?.address` so we only resubscribe
 *   when the connected wallet changes.
 */

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

// --- External data / SDKs
import { doc, onSnapshot } from "firebase/firestore";
import { useActiveAccount } from "thirdweb/react";
import { getUserEmail } from "thirdweb/wallets/in-app";

// --- App libs / types
import { client } from "@/lib/client";
import { db } from "@/lib/firebase";
import { handleCreateUser } from "@/lib/handleCreateUser";
import type { User } from "@/types/user";

// -----------------------------------------------
// Context shape
// -----------------------------------------------
type UserContextValue = {
  user: User | null;
  loading: boolean;
  isNewUser: boolean;
  setIsNewUser: (value: boolean) => void;
};

// Default value (used only before the provider mounts)
const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  isNewUser: false,
  setIsNewUser: () => { },
});

// -----------------------------------------------
// Provider
// -----------------------------------------------
export function UserProvider({ children }: { children: ReactNode }) {
  const account = useActiveAccount();

  // Centralized user state
  const [state, setState] = useState<UserContextValue>({
    user: null,
    loading: true,
    isNewUser: false,
    setIsNewUser: (value: boolean) =>
      setState((prev) => ({ ...prev, isNewUser: value })),
  });

  useEffect(() => {
    // If no wallet is connected, expose "not logged in" immediately
    if (!account?.address) {
      setState((prev) => ({
        ...prev,
        user: null,
        loading: false,
        isNewUser: false,
      }));
      return;
    }

    // Firestore document for this wallet
    const ref = doc(db, "users", account.address);
    let unsub: (() => void) | undefined;

    // Create user if missing, then subscribe to the document
    (async () => {
      const email = await getUserEmail({ client });
      const isNew = await handleCreateUser({
        walletAddress: account.address,
        email: email ?? "",
      });

      // Start a real-time subscription to the user's doc
      unsub = onSnapshot(ref, (snap) => {
        if (!snap.exists()) return;
        const data = snap.data() as User;

        setState((prev) => ({
          ...prev,
          user: { ...data, walletAddress: account.address },
          loading: false,
          isNewUser: isNew,
        }));
      });
    })();

    // Cleanup subscription when wallet changes/unmounts
    return () => unsub?.();
  }, [account?.address]);

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
}

// -----------------------------------------------
// Hook
// -----------------------------------------------
export function useUser() {
  return useContext(UserContext);
}
