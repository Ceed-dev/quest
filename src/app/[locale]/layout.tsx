import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import "../globals.css";

import { ThirdwebProvider } from "thirdweb/react";
import { UserProvider } from "@/providers/user-provider";
import { QuestsProvider } from "@/context/questsContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
// import { GlobalHeader } from "@/components/GlobalHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ja" }];
}

export const metadata: Metadata = {
  title: "Quest App",
  description: "Explore and complete quests",
};

// TODO: Apply a global theme (black base + lime accent) using Tailwind's custom theme config.
// For now, apply colors individually with Tailwind classes on each page.
export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    // TODO: Replace hardcoded tailwind classes with theme tokens once theme setup is stable.
    // https://ui.shadcn.com/docs/dark-mode/next
    <html lang={locale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ThirdwebProvider>
            <UserProvider>
              <QuestsProvider>
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset>
                    {/* <GlobalHeader /> */}
                    {children}
                  </SidebarInset>
                </SidebarProvider>
              </QuestsProvider>
            </UserProvider>
          </ThirdwebProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
