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
        <div className="p-4 md:p-4 lg:p-4">
          {/* ── 上段：アイコン＋プロジェクト名（モバイル/PC 共通） ── */}
          <div className="flex items-center gap-3">
            {iconUrl ? (
              <span className="inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/10 bg-black/30">
                <Image
                  src={iconUrl}
                  alt={t("iconAlt")}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </span>
            ) : null}
            <span className="text-white text-[16px] md:text-[18px] font-semibold leading-none line-clamp-1">
              {projectNameText}
            </span>
          </div>

          {/* ── 中段：モバイルは左右2カラム / PCは従来どおり縦レイアウト ── */}
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-1">
            {/* 左：テキスト群（モバイル左 / PCでは画像の下） */}
            <div className="order-1 md:order-2 flex flex-col gap-2 md:gap-2">
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

              {/* Points pill */}
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

              {/* CTA（モバイルは列幅いっぱい / PCはFigmaサイズ） */}
              <button
                className={[
                  "mt-1 md:mt-2 inline-flex items-center justify-center",
                  "h-[46px] md:h-[50px] w-full md:w-[197px] rounded-[10px]",
                  "bg-white text-[#232323] font-bold text-[20px] md:text-[24px]",
                  "transition-transform duration-150",
                  "group-hover:-translate-y-0.5 active:translate-y-0",
                ].join(" ")}
              >
                {type === "quest" ? t("joinQuest") : t("viewGame")}
              </button>
            </div>

            {/* 右：正方形画像（モバイル右 / PCではタイトル群の上） */}
            <div className="order-2 md:order-1">
              {/* PCでは従来通り：先に画像、下にテキストへ切り替え */}
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
