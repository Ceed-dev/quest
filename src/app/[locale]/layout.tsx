// ----------------------------------------------------
// App Root Layout (per-locale)
// ----------------------------------------------------
// • Applies global fonts and dark theme
// • Validates locale (Next-Intl)
// • Wraps the app with shared providers
// • Renders the fixed GlobalHeader + page content
// ----------------------------------------------------

import "../globals.css";

import type { ReactNode } from "react";
import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";

import { Geist, Geist_Mono } from "next/font/google";

import GlobalHeader from "@/components/GlobalHeader";
import { routing } from "@/i18n/routing";

import { ThirdwebProvider } from "thirdweb/react";
import { UserProvider } from "@/providers/user-provider";
import { QuestsProvider } from "@/context/questsContext";

import Footer from "@/components/shared/Footer";

// ----------------------------------------------------
// Fonts (variable)
// ----------------------------------------------------
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ----------------------------------------------------
// Static params for localized routes
// ----------------------------------------------------
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ja" }];
}

// ----------------------------------------------------
// Page metadata
// ----------------------------------------------------
export const metadata: Metadata = {
  title: "Quest App",
  description: "Explore and complete quests",
};

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

// ----------------------------------------------------
// Root layout
// ----------------------------------------------------
// TODO: Once the Tailwind theme tokens are stable, replace
//       hardcoded utility classes with semantic tokens.
//       Ref: https://ui.shadcn.com/docs/dark-mode/next
export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  // Validate the incoming locale
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ThirdwebProvider>
            <UserProvider>
              <QuestsProvider>
                <div className="min-h-screen flex flex-col">
                  <GlobalHeader />
                  <main className="flex-1 px-5 xl:px-16">{children}</main>
                  <Footer />
                </div>
              </QuestsProvider>
            </UserProvider>
          </ThirdwebProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
