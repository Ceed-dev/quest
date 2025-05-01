"use client";

import * as React from "react";
import {
  /*
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  */
  Shield,
  Briefcase,
} from "lucide-react";

import { useUser } from "@/providers/user-provider";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "@/lib/client";

import Image from "next/image";
import Link from "next/link";

// import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
// import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMemo } from "react";

/*
// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};
*/

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
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 hover:opacity-80 transition"
        >
          <Image
            src="/qube.png"
            alt="Qube Logo"
            width={24}
            height={24}
            className="rounded-sm"
          />
          <span className="text-lg font-semibold">Qube Quest</span>
        </Link>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <ul className="list-none px-2 py-2">
          <SidebarMenuItem>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted transition"
            >
              <Shield className="h-4 w-4" />
              <span>Quests</span>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link
              href="/inventory"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted transition"
            >
              <Briefcase className="h-4 w-4" />
              <span>Inventory</span>
            </Link>
          </SidebarMenuItem>
        </ul>
        {/* <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
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
