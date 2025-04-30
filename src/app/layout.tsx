import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThirdwebProvider } from "thirdweb/react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { UserInitEffect } from "@/hooks/UserInitEffect";
import { GlobalHeader } from "@/components/GlobalHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quest App",
  description: "Explore and complete quests",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThirdwebProvider>
          <UserInitEffect />
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <GlobalHeader />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
