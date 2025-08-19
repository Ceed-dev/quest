"use client";

import * as React from "react";
import Image from "next/image";
import { Shield, User, Package, RefreshCcw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

import { useUser } from "@/providers/user-provider";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "@/lib/client";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import LanguageSwitch from "@/components/LanguageSwitch";
import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading, isNewUser, setIsNewUser } = useUser();

  const locale = useLocale() as "en" | "ja";
  const pathname = usePathname();
  const router = useRouter();
  const search = useSearchParams();
  const tSidebar = useTranslations("sidebar");

  const setAppLocale = (next: "en" | "ja") => {
    const qs = search?.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    router.replace(href, { locale: next });
  };

  const wallets = useMemo(
    () => [
      inAppWallet({
        auth: { options: ["email", "google"] },
      }),
    ],
    [],
  );

  const [currentStep, setCurrentStep] = useState(0);

  const isFinalStep = currentStep === 7;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
        <div className="flex items-center justify-start py-2">
          <LanguageSwitch locale={locale} onLocaleChange={setAppLocale} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={[
            {
              title: tSidebar("quests"),
              url: "/",
              icon: Shield,
            },
            ...(user
              ? [
                  {
                    title: tSidebar("profile"),
                    url: "/profile",
                    icon: User,
                  },
                  {
                    title: tSidebar("gacha"),
                    url: "/gacha",
                    icon: RefreshCcw,
                  },
                  {
                    title: tSidebar("inventory"),
                    url: "/inventory",
                    icon: Package,
                  },
                ]
              : []),
          ]}
        />
      </SidebarContent>
      <SidebarFooter>
        {loading || !user ? (
          <ConnectButton
            client={client}
            wallets={wallets}
            connectButton={{ label: tSidebar("connect") }}
          />
        ) : (
          <NavUser
            user={{
              name: user.walletAddress!,
              email: user.email,
              avatar: "/avatars/default.png",
            }}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
      <Dialog
        open={isNewUser}
        onOpenChange={(open) => {
          if (!open) {
            setIsNewUser(false);
            setCurrentStep(0);
          }
        }}
      >
        <DialogContent className="border-2 border-white">
          <DialogHeader>
            {currentStep === 0 && (
              <>
                <DialogTitle className="text-3xl">
                  Welcome to Qube Quest
                </DialogTitle>
                <div>Jump into a world of games, quests, and rewards.</div>
                <div>
                  Complete tasks, earn points, and unlock exclusive items
                  through Gacha spins.
                </div>
                <div>You&apos;re here to play—and win.</div>
              </>
            )}
            {currentStep === 1 && (
              <>
                <DialogTitle className="text-3xl">
                  Start with Quests
                </DialogTitle>
                <div>After login, you&apos;ll land on the Quest Page.</div>
                <div>
                  Browse games, pick one that interests you, and dive in.
                </div>
                <div>
                  Every game has its own set of quests—choose your battlefield.
                </div>
              </>
            )}
            {currentStep === 2 && (
              <>
                <DialogTitle className="text-3xl">
                  Clear Quests, Earn Points
                </DialogTitle>
                <div>Quests are your path to rewards.</div>
                <div>Tasks can include:</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>Following accounts</li>
                  <li>Sharing content</li>
                  <li>Watching trailers</li>
                  <li>Making in-game purchases</li>
                  <li>Submitting screenshots</li>
                </ul>
                <div>Complete tasks to earn points.</div>
                <div>Every point brings you closer to the Gacha.</div>
              </>
            )}
            {currentStep === 3 && (
              <>
                <DialogTitle className="text-3xl">
                  Use Points to Spin the Gacha
                </DialogTitle>
                <div>Spend your points in the Gacha.</div>
                <div>
                  Each spin gives you a chance at rare items, NFTs, tokens,
                  whitelist spots, and more.
                </div>
                <div>
                  There will always be a main Qube Gacha—and limited themed ones
                  too.
                </div>
                <div className="mt-4 flex justify-center">
                  <Image
                    src="/intro-gacha.png"
                    alt="Gacha illustration"
                    width={300}
                    height={300}
                    className="rounded animate-pulse shadow-xl shadow-yellow-100"
                  />
                </div>
              </>
            )}
            {currentStep === 4 && (
              <>
                <DialogTitle className="text-3xl">Rarity System</DialogTitle>
                <div>Not all rewards are created equal.</div>
                <div>Rewards fall into tiers:</div>
                <ul className="list-disc list-inside space-y-1">
                  <li className="text-cyan-500 font-bold">Common</li>
                  <li className="text-green-500 font-bold">Rare</li>
                  <li className="text-purple-500 font-bold">Super Rare</li>
                  <li className="text-yellow-500 font-bold">Legendary</li>
                </ul>
                <div>
                  Each item&apos;s rarity is determined by its current market
                  value.
                </div>
                <div>
                  Drop rates are updated regularly based on these valuations.
                </div>
              </>
            )}
            {currentStep === 5 && (
              <>
                <DialogTitle className="text-3xl">
                  Climb the Rankings
                </DialogTitle>
                <div>
                  Top players don&apos;t just earn rewards—they earn
                  recognition.
                </div>
                <div>
                  Weekly and monthly leaderboards reward the highest scorers
                  with bonus prizes.
                </div>
                <div>Ties? First to reach the score wins.</div>
              </>
            )}
            {currentStep === 6 && (
              <>
                <DialogTitle className="text-3xl">
                  Open Your Inventory
                </DialogTitle>
                <div>All Gacha rewards come in the form of Cubes.</div>
                <div>All your earned Cubes are stored in your Inventory.</div>
                <div>
                  Click on a Cube to open it. Once opened, the Cube will
                  disappear and the reward inside will be automatically sent to
                  your connected wallet.
                </div>
              </>
            )}
            {currentStep === 7 && (
              <>
                <DialogTitle className="text-3xl">
                  What&apos;s Coming Soon
                </DialogTitle>
                <div>Qube Quest is just getting started.</div>
                <div>Soon you&apos;ll unlock:</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>A full Game Discovery Page</li>
                  <li>Deeper Inventory mechanics</li>
                  <li>More themed Gacha campaigns</li>
                </ul>
                <div>New games! New prizes! New ways to play!</div>
              </>
            )}
          </DialogHeader>

          <div className="flex justify-between mt-4 w-full">
            {/* 左側：Back ボタン（ステップ0以外で表示） */}
            {currentStep > 0 ? (
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => prev - 1)}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {/* 右側：Next または OK ボタン */}
            {!isFinalStep ? (
              <Button onClick={() => setCurrentStep((prev) => prev + 1)}>
                {currentStep === 0 ? "Let's begin" : "Next"}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setIsNewUser(false);
                  setCurrentStep(0);
                }}
              >
                START
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
