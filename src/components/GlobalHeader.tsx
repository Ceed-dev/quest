"use client";

import { useMemo } from "react";
import { inAppWallet } from "thirdweb/wallets";
import { ConnectButton } from "thirdweb/react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { client } from "@/lib/client";
import Link from "next/link";
import Image from "next/image";

export function GlobalHeader() {
  const wallets = useMemo(
    () => [
      inAppWallet({
        auth: { options: ["email", "google"] },
      }),
    ],
    [],
  );

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Explore Quests</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-4 pr-4">
        <ConnectButton client={client} wallets={wallets} />
        <Link href="/profile">
          <Image
            src="https://app.questn.com/static/users/cute_squad_3.png"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full border-2 border-black cursor-pointer"
          />
        </Link>
      </div>
    </header>
  );
}
