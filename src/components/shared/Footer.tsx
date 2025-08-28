"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 flex justify-center px-5">
      <div
        className="
          w-full text-[#1C1C1C] py-3
          grid gap-6 md:gap-8
          md:grid-cols-2
          items-stretch
        "
      >
        <Link href="/" aria-label="Qube Quest (Home)" className="block md:pr-6">
          <Image
            src="/qube-wordmark-dark.svg"
            alt="Qube"
            width={800}
            height={180}
            priority
            className="h-auto w-full"
          />
        </Link>

        <div className="flex h-full flex-col items-end justify-between">
          <nav
            aria-label="Qube socials"
            className="flex flex-col items-start gap-4 text-[16px]"
          >
            <a
              href="https://x.com/0xQube"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              X
              <ArrowUpRight
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="translate-y-[1px]"
              />
            </a>

            <a
              href="https://discord.com/invite/znnZh4ZDdK"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              Discord
              <ArrowUpRight
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="translate-y-[1px]"
              />
            </a>
          </nav>

          <span className="text-[24px] pb-10">
            © {year} Qube. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
