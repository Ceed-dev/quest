"use client";

import * as React from "react";
import { Shield, User, Gamepad, Package, RefreshCcw, Bell } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
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
import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading, isNewUser, setIsNewUser } = useUser();
  console.log("isNewUser:", isNewUser);

  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const tSidebar = useTranslations("sidebar");
  const tTutorial = useTranslations("tutorial");

  const toggleLocale = locale === "en" ? "ja" : "en";

  const handleLocaleToggle = () => {
    router.push(pathname, { locale: toggleLocale });
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

  const tutorialSteps = [
    {
      title: tTutorial("step1Title"),
      desc: tTutorial("step1Desc"),
    },
    {
      title: tTutorial("step2Title"),
      desc: tTutorial("step2Desc"),
    },
    {
      title: tTutorial("step3Title"),
      desc: tTutorial("step3Desc"),
    },
    {
      title: tTutorial("finalStepTitle"),
      desc: tTutorial("finalStepDesc"),
    },
  ];

  const isFinalStep = currentStep === tutorialSteps.length - 1;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={[
            {
              title: tSidebar("quests"),
              url: "/",
              icon: Shield,
            },
            {
              title: tSidebar("games"),
              url: "/games",
              icon: Gamepad,
            },
            ...(user
              ? [
                  {
                    title: tSidebar("profile"),
                    url: "/profile",
                    icon: User,
                  },
                  {
                    title: tSidebar("inventory"),
                    url: "/inventory",
                    icon: Package,
                  },
                  {
                    title: tSidebar("gacha"),
                    url: "/gacha",
                    icon: RefreshCcw,
                  },
                  {
                    title: tSidebar("notifications"),
                    url: "/notifications",
                    icon: Bell,
                  },
                ]
              : []),
          ]}
        />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-start py-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={handleLocaleToggle}
          >
            🌐 {toggleLocale === "en" ? "English" : "日本語"}
          </Button>
        </div>

        {loading || !user ? (
          <ConnectButton client={client} wallets={wallets} />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tutorialSteps[currentStep].title}</DialogTitle>
            <DialogDescription>
              {tutorialSteps[currentStep].desc}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end mt-4">
            {!isFinalStep ? (
              <Button onClick={() => setCurrentStep((prev) => prev + 1)}>
                Next
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setIsNewUser(false);
                  setCurrentStep(0);
                }}
              >
                OK
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
