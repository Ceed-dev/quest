"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

// Props type definition for the ItemCard component
type ItemCardProps = {
  id: string; // Unique identifier used for building the detail page link (e.g., /quest/[id])
  type: "quest" | "game"; // Determines the display type (quest or game)
  backgroundImageUrl: string; // Background image URL for the card
  iconUrl?: string; // Optional icon image URL (used only for quests)
  title: string; // Title text displayed on the card
  description: string; // Description text displayed on the card
  points?: number; // Optional points value (used only for quests)
};

export function ItemCard({
  id,
  type,
  backgroundImageUrl,
  iconUrl,
  title,
  description,
  points,
}: ItemCardProps) {
  const t = useTranslations("itemCard");

  return (
    <Link href={`/${type}/${id}`}>
      <div
        className="relative w-full aspect-[2/3] rounded-lg shadow-md overflow-hidden bg-cover bg-center
                 transition-transform duration-300 hover:-translate-y-2"
        // Set the background image using inline style
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
        }}
      >
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Main content layer */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top section: icon (only shown for quests) */}
          <div className="flex justify-between items-start">
            {type === "quest" && iconUrl && (
              <div className="w-10 h-10 bg-black/50 rounded overflow-hidden mx-4 mt-4">
                <Image
                  src={iconUrl}
                  alt={t("iconAlt")}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Middle section: title, points (if quest), and description */}
          <div className="text-white bg-black/50 h-[50%] p-4">
            <h3
              className={
                type === "quest"
                  ? "font-semibold truncate"
                  : "text-3xl font-bold truncate"
              }
            >
              {title}
            </h3>
            {type === "quest" && typeof points === "number" && (
              <p className="text-3xl font-bold">
                {t("earn", { count: points })}
              </p>
            )}
            <p className={type === "quest" ? "text-2xl font-bold" : ""}>
              {description}
            </p>
          </div>

          {/* Bottom section: action button */}
          <div className="px-4 pb-4">
            <button className="w-full bg-white text-black font-semibold rounded-full py-2">
              {type === "quest" ? t("joinQuest") : t("viewGame")}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
