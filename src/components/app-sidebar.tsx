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
import { useMemo } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, loading } = useUser();

  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("sidebar");

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

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={[
            {
              title: t("quests"),
              url: "/",
              icon: Shield,
            },
            {
              title: t("games"),
              url: "/games",
              icon: Gamepad,
            },
            ...(user
              ? [
                {
                  title: t("profile"),
                  url: "/profile",
                  icon: User,
                },
                {
                  title: t("inventory"),
                  url: "/inventory",
                  icon: Package,
                },
                {
                  title: t("gacha"),
                  url: "/gacha",
                  icon: RefreshCcw,
                },
                {
                  title: t("notifications"),
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
    </Sidebar>
  );
}
