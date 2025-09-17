/**
 * Locale Layout (per /[locale] segment)
 * ---------------------------------------------------------------------------
 * - Re-mounts when switching locales (e.g., /en <-> /ja).
 * - Holds ONLY locale-dependent UI & providers (NextIntl, header/footer, frame).
 * - Do NOT render <html>/<body> here — those live in src/app/layout.tsx.
 */

import type { ReactNode } from "react";

import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

import { Geist, Geist_Mono } from "next/font/google";

import GlobalHeader from "@/components/GlobalHeader";
import Footer from "@/components/shared/Footer";
import { routing } from "@/i18n/routing";

// Configure variable fonts for this segment
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate static params for localized routes (SSG)
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ja" }];
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string }; // Standard App Router params
}) {
  const { locale } = params;

  // Validate locale against routing config
  if (!routing.locales.includes(locale as any)) notFound();

  return (
    <NextIntlClientProvider locale={locale}>
      <div
        className={[
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen flex flex-col",
        ].join(" ")}
      >
        {/* Locale-specific chrome (header/footer are safe to re-mount) */}
        <GlobalHeader />

        {/* Main content area */}
        <main className="flex-1 px-5 xl:px-16">{children}</main>

        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
