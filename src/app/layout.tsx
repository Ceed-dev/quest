import "./globals.css";

/**
 * Root Layout (App Router)
 * ----------------------------------------------------
 * - This is the ONLY place that renders <html>/<body>. (Server Component)
 * - Providers here persist across locale switches (/en <-> /ja),
 *   so global state (wallet/user/quests) does not remount on language change.
 * - Locale-specific UI (NextIntl, header/footer) is in src/app/[locale]/layout.tsx
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";

// Global, non-locale providers (must persist)
import { ThirdwebProvider } from "thirdweb/react";
import { UserProvider } from "@/providers/user-provider";
import { QuestsProvider } from "@/context/questsContext";
import AutoConnect from "@/components/AutoConnect"; // client child to run useAutoConnect

// Page metadata (can be overridden per route if needed)
export const metadata: Metadata = {
  title: "Quest App",
  description: "Explore and complete quests",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // lang is a default; actual copy is controlled by NextIntl in [locale]/layout.
    <html lang="en">
      <body>
        <ThirdwebProvider>
          {/* Restore the previously connected wallet after reload */}
          <AutoConnect />
          <UserProvider>
            <QuestsProvider>{children}</QuestsProvider>
          </UserProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
