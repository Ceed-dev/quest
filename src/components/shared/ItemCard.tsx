"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getLText } from "@/lib/i18n-data";
import type { LocalizedText } from "@/types/i18n";

// Props
type ItemCardProps = {
  id: string;
  type: "quest" | "game";
  backgroundImageUrl: string;
  iconUrl?: string;
  projectName: LocalizedText | string;
  title: LocalizedText;
  description: LocalizedText;
  points?: number;
};

// LocalizedText | string を安全に取り出す
function getText(value: LocalizedText | string, locale: "en" | "ja") {
  return typeof value === "string" ? value : getLText(value, locale);
}

export function ItemCard({
  id,
  type,
  backgroundImageUrl,
  iconUrl,
  projectName,
  title,
  description,
  points,
}: ItemCardProps) {
  const t = useTranslations("itemCard");
  const locale = useLocale() as "en" | "ja";

  const projectNameText = getText(projectName, locale);
  const titleText = getLText(title, locale);
  const descText = getLText(description, locale);

  return (
    <Link href={`/${type}/${id}`} className="group block">
      <div
        className={[
          "relative w-full rounded-2xl overflow-hidden",
          "bg-[#1C1C1C] ring-1 ring-white/5 shadow-[0_2px_12px_rgba(0,0,0,0.35)]",
          "transition-transform duration-300 group-hover:-translate-y-1",
        ].join(" ")}
      >
        <div className="flex flex-col p-4 gap-3">
          {/* Top: icon + project name */}
          <div className="flex items-center gap-3">
            {iconUrl ? (
              <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/10 bg-black/30">
                <Image
                  src={iconUrl}
                  alt={t("iconAlt")}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </span>
            ) : null}
            <span className="text-white text-[18px] font-semibold leading-none line-clamp-1">
              {projectNameText}
            </span>
          </div>

          {/* Square thumbnail */}
          <div className="relative mt-1 aspect-square w-full overflow-hidden rounded-xl ring-1 ring-white/10 bg-black/30">
            <Image
              src={backgroundImageUrl}
              alt={titleText}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>

          {/* Texts */}
          <div className="mt-1 space-y-2">
            <h3
              className="text-[#D5B77A] text-[24px] font-semibold leading-tight line-clamp-2 min-h-[2.5em]"
              title={titleText}
            >
              {titleText}
            </h3>

            <p
              className="text-white text-[20px] leading-snug line-clamp-2 min-h-[2.75em]"
              title={descText}
            >
              {descText}
            </p>

            {/* Points pill */}
            {type === "quest" && typeof points === "number" && (
              <span
                className="
      inline-flex h-[29px] w-[123px] items-center justify-center
      rounded-[5px] bg-[#D5B77A] text-[#1C1C1C]
      text-[16px] font-bold
    "
              >
                {t("earn", { count: points })}
              </span>
            )}
          </div>

          {/* CTA button (Figma: 197x50, radius 10, white fill, #232323 text/border) */}
          <button
            className={[
              "inline-flex items-center justify-center",
              "h-[50px] w-[197px] rounded-[10px]",
              "bg-white text-[#232323] font-bold text-[24px]",
              "transition-transform duration-150",
              "group-hover:-translate-y-0.5 active:translate-y-0",
            ].join(" ")}
          >
            {type === "quest" ? t("joinQuest") : t("viewGame")}
          </button>
        </div>
      </div>
    </Link>
  );
}
