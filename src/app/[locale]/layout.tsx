/**
 * Locale Layout (per /[locale] segment)
 * ----------------------------------------------------
 * - Re-mounts when switching locales (e.g., /en <-> /ja).
 * - Holds ONLY locale-dependent UI & providers.
 *   (NextIntl, header/footer, page frame, etc.)
 * - Do NOT render <html>/<body> here — those live in src/app/layout.tsx.
 */

import type { ReactNode } from "react";

// --- Next.js routing / i18n helpers
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";

// --- Fonts (scoped to this segment for className usage)
import { Geist, Geist_Mono } from "next/font/google";

// --- App UI
import GlobalHeader from "@/components/GlobalHeader";
import Footer from "@/components/shared/Footer";
import { routing } from "@/i18n/routing";

// Configure variable fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate static params for localized routes
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ja" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // NOTE: Keep signature/behavior as-is (params is awaited).
  const { locale } = await params;

  // Validate incoming locale against app routing config
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    // Locale-aware provider (messages/locale can be wired here if needed)
    <NextIntlClientProvider>
      <div
        className={[
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen flex flex-col",
        ].join(" ")}
      >
        {/* Locale-specific chrome (safe to remount on switch) */}
        <GlobalHeader />

        <main className="flex-1 px-5 xl:px-16">{children}</main>

        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
