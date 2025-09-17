"use client";

/**
 * ItemCard
 * ---------------------------------------------------------------------------
 * - Full-card link to /{type}/{id}.
 * - Shows project icon/name, title, description, points (for quest), and a
 *   visual CTA pill. The CTA is purely visual because the whole card is a link.
 *
 * Accessibility / Semantics:
 * - Avoid nested interactive elements: do NOT put <button> inside <Link>.
 *   Use a non-interactive element styled as a button (e.g. <span>).
 * - The entire card is the hit target; CTA is decorative text.
 * ---------------------------------------------------------------------------
 */

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getLText } from "@/lib/i18n-data";
import type { LocalizedText } from "@/types/i18n";

/* -----------------------------------------------------------------------------
 * Props
 * ---------------------------------------------------------------------------*/
type ItemCardProps = {
  id: string;
  type: "quest" | "game";
  backgroundImageUrl: string; // Square image (already picked upstream)
  iconUrl?: string; // Optional project icon
  projectName: LocalizedText | string; // Project display name
  title: LocalizedText; // Card title
  description: LocalizedText; // Short description / catchphrase
  points?: number; // Reward points (quest only)
};

/** Normalize LocalizedText | string to a display string */
function getText(value: LocalizedText | string, locale: "en" | "ja") {
  return typeof value === "string" ? value : getLText(value, locale);
}

/* -----------------------------------------------------------------------------
 * Component
 * ---------------------------------------------------------------------------*/
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
    <Link
      href={`/${type}/${id}`}
      className="group block"
      aria-label={
        type === "quest"
          ? t("aria.openQuest", { title: titleText })
          : t("aria.openGame", { title: titleText })
      }
    >
      <div
        className={[
          "relative w-full rounded-2xl overflow-hidden",
          "bg-[#1C1C1C] ring-1 ring-white/5 shadow-[0_2px_12px_rgba(0,0,0,0.35)]",
          "transition-transform duration-300 group-hover:-translate-y-1",
        ].join(" ")}
      >
        <div className="p-4 md:p-4 lg:p-4">
          {/* Top row: icon + project name */}
          <div className="flex items-center gap-3">
            {iconUrl && (
              <span className="inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/10 bg-black/30">
                <Image
                  src={iconUrl}
                  alt={t("iconAlt")}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </span>
            )}
            <span className="text-white text-[16px] md:text-[18px] font-semibold leading-none line-clamp-1">
              {projectNameText}
            </span>
          </div>

          {/* Middle block: text + image (responsive layout) */}
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-1">
            {/* Left (mobile) / below (desktop): text group */}
            <div className="order-1 md:order-2 flex flex-col gap-2">
              <h3
                className="
                  text-[#D5B77A]
                  text-[20px] md:text-[24px]
                  font-semibold leading-tight
                  line-clamp-2 md:min-h-[2.5em]
                "
                title={titleText}
              >
                {titleText}
              </h3>

              <p
                className="text-white text-[16px] md:text-[20px] leading-snug line-clamp-2 md:min-h-[2.75em]"
                title={descText}
              >
                {descText}
              </p>

              {/* Points pill (quests only) */}
              {type === "quest" && typeof points === "number" && (
                <span
                  className="
                    inline-flex h-[28px] md:h-[29px] px-3 md:px-0
                    items-center justify-center
                    md:w-[123px]
                    rounded-[5px] bg-[#D5B77A] text-[#1C1C1C]
                    text-[14px] md:text-[16px] font-bold
                  "
                >
                  {t("earn", { count: points })}
                </span>
              )}

              {/* Visual CTA (non-interactive; whole card is the link) */}
              <span
                aria-hidden="true"
                className={[
                  "mt-1 md:mt-2 inline-flex items-center justify-center",
                  "h-[46px] md:h-[50px] w-full md:w-[197px] rounded-[10px]",
                  "bg-white text-[#232323] font-bold text-[20px] md:text-[24px]",
                  "transition-transform duration-150",
                  "group-hover:-translate-y-0.5",
                ].join(" ")}
              >
                {type === "quest" ? t("joinQuest") : t("viewGame")}
              </span>
            </div>

            {/* Right (mobile) / above (desktop): square image */}
            <div className="order-2 md:order-1">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl ring-1 ring-white/10 bg-black/30 md:mt-1">
                <Image
                  src={backgroundImageUrl}
                  alt={titleText}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
