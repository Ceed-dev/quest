"use client";

/**
 * AutoConnect
 * ----------------------------------------------------
 * - Calls thirdweb's useAutoConnect to restore the last-used wallet
 *   after a page reload. No UI; renders once under ThirdwebProvider.
 * - Does NOT change any app behavior other than enabling auto-reconnect.
 */

import { useAutoConnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "@/lib/client";

// Keep this in sync with the wallets you already support in the app.
const wallets = [inAppWallet({ auth: { options: ["email", "google"] } })];

export default function AutoConnect() {
  useAutoConnect({ client, wallets });
  return null;
}
