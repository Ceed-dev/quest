"use client";

import * as React from "react";
import { Shield, User, Gamepad, Package, RefreshCcw, Bell } from "lucide-react";

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
              title: "Quests",
              url: "/",
              icon: Shield,
            },
            {
              title: "Games",
              url: "/games",
              icon: Gamepad,
            },
            ...(user
              ? [
                  {
                    title: "Profile",
                    url: "/profile",
                    icon: User,
                  },
                  {
                    title: "Inventory",
                    url: "/inventory",
                    icon: Package,
                  },
                  {
                    title: "Gacha",
                    url: "/gacha",
                    icon: RefreshCcw,
                  },
                  {
                    title: "Notifications",
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
          >
            🌐 English
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
