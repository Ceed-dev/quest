import "./globals.css";

/**
 * Root Layout (App Router)
 * ----------------------------------------------------
 * - This is the ONE place that renders <html> / <body>.
 * - Providers placed here live across locale switches
 *   (i.e., they don't remount when switching /en <-> /ja).
 * - Keep global, non-locale state here (wallet/user/quests).
 *
 * Locale-specific UI (headers, footers, NextIntl, etc.)
 * should be placed in: src/app/[locale]/layout.tsx
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";

// --- Global, non-locale providers (persist across routing) ---
import { ThirdwebProvider } from "thirdweb/react";
import { UserProvider } from "@/providers/user-provider";
import { QuestsProvider } from "@/context/questsContext";

// Page metadata (can be overridden per route if needed)
export const metadata: Metadata = {
  title: "Quest App",
  description: "Explore and complete quests",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // Keep <html>/<body> ONLY in this root layout.
    // lang is set to a default; per-locale concerns are handled in [locale]/layout.
    <html lang="en">
      <body>
        <ThirdwebProvider>
          <UserProvider>
            <QuestsProvider>{children}</QuestsProvider>
          </UserProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
