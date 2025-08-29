"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useLocale } from "next-intl";
import { getLText } from "@/lib/i18n-data";
import type { LocalizedText } from "@/types/i18n";

/* =========================
   データ仕様（ItemCard と整合）
   ========================= */
export type HeroQuest = {
  id: string;
  backgroundImageUrl: string; // 右側の大きなイメージ
  iconUrl?: string; // 左上の小アイコン（任意）
  projectName: LocalizedText | string;
  title: LocalizedText;
  description: LocalizedText;
  points?: number;
};

// LocalizedText | string を表示用に取り出す
function getText(value: LocalizedText | string, locale: "en" | "ja") {
  return typeof value === "string" ? value : getLText(value, locale);
}

/* =========================
   コンポーネント
   ========================= */
export default function HeroCarousel({
  items,
  className,
}: {
  items: HeroQuest[];
  className?: string;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const locale = (useLocale() as "en" | "ja") ?? "en";

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const total = items.length;

  return (
    <div className={cn("w-full", className)}>
      <Carousel opts={{ loop: true, align: "start" }} setApi={setApi}>
        <CarouselContent>
          {items.map((q, i) => {
            const projectName = getText(q.projectName, locale);
            const titleText = getLText(q.title, locale);
            const descText = getLText(q.description, locale);
            const pointsLabel =
              typeof q.points === "number"
                ? `Earn ${q.points} points`
                : undefined;

            return (
              <CarouselItem key={q.id ?? i}>
                {/* パネル本体 */}
                <div className="relative overflow-hidden rounded-2xl bg-[#1C1C1C] text-white shadow-[0_6px_28px_rgba(0,0,0,0.28)]">
                  {/* 内側パディング（モバイル小さめ） */}
                  <div className="p-4 sm:p-6 md:p-8">
                    {/* 
                      モバイル: 画像を先頭（order-1）、正方形
                      デスクトップ: 左=テキスト 右=横長画像（既存踏襲）
                    */}
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_560px] gap-4 md:gap-6 md:items-stretch">
                      {/* 画像（モバイル先頭 / デスクトップ右） */}
                      <div className="relative order-1 md:order-2 w-full aspect-square md:aspect-[1340/525] md:max-w-[700px] md:self-stretch">
                        <Image
                          src={q.backgroundImageUrl}
                          alt=""
                          fill
                          priority={i === 0}
                          className="object-cover md:object-contain"
                          sizes="(min-width:1280px) 560px, (min-width:768px) 50vw, 92vw"
                        />
                      </div>

                      {/* テキスト群（モバイルでは画像の下） */}
                      <div className="order-2 md:order-1 flex flex-col gap-3 md:gap-4 md:h-full md:justify-between">
                        {/* 上段：アイコン＋プロジェクト名 */}
                        <div className="flex items-center gap-3">
                          {q.iconUrl && (
                            <span className="inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/10 bg-black/30">
                              <Image
                                src={q.iconUrl}
                                alt=""
                                width={36}
                                height={36}
                                className="h-full w-full object-cover"
                              />
                            </span>
                          )}
                          <span className="text-white text-[16px] md:text-[18px] font-semibold leading-none line-clamp-1">
                            {projectName}
                          </span>
                        </div>

                        {/* タイトル（モバイルは抑えめ） */}
                        <h2
                          className="
                            text-[40px] md:text-[64px]
                            leading-[1.1] md:leading-[1.05]
                            font-extrabold tracking-tight
                            bg-gradient-to-r from-[#D5B77A] to-white bg-clip-text text-transparent
                            line-clamp-2 md:min-h-[136px]
                          "
                          title={titleText}
                        >
                          {titleText}
                        </h2>

                        {/* サブテキスト */}
                        <p className="text-[20px] md:text-[32px] text-[#D5B77A]">
                          {descText}
                        </p>

                        {/* ポイント & CTA（くっついた2ボタン） */}
                        <div className="relative inline-flex items-stretch">
                          {pointsLabel && (
                            <span
                              className="
                                relative flex h-[44px] md:h-[50px] items-center px-4 md:px-5
                                rounded-l-md text-[#1C1C1C] font-bold text-[18px] md:text-[24px] leading-none
                              "
                              style={{
                                background:
                                  "linear-gradient(90deg, #D5B77A 0%, #FFFFFF 100%)",
                              }}
                            >
                              <span
                                aria-hidden
                                className="pointer-events-none absolute -inset-y-2 -left-2 -z-10"
                                style={{
                                  background:
                                    "radial-gradient(80% 60% at 0% 50%, rgba(213,183,122,0.35) 0%, transparent 60%)," +
                                    "radial-gradient(80% 60% at 50% 0%, rgba(213,183,122,0.22) 0%, transparent 60%)," +
                                    "radial-gradient(80% 60% at 50% 100%, rgba(213,183,122,0.22) 0%, transparent 60%)",
                                  filter: "blur(6px)",
                                }}
                              />
                              {pointsLabel}
                            </span>
                          )}

                          <Link
                            href={`/quest/${q.id}`}
                            className="
                              flex h-[44px] md:h-[50px] items-center px-4 md:px-5
                              rounded-r-md bg-[#7F0019] text-white
                              font-bold text-[18px] md:text-[24px] leading-none hover:brightness-110
                            "
                          >
                            Join the Quest
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* ▼ 下中央ナビ（Prev・ドット×5・Next） */}
        <div className="mt-3 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => api?.scrollPrev()}
            className="w-12 h-12 rounded-md bg-[#BBA98D] text-black shadow-sm hover:brightness-110"
          >
            <ChevronLeft className="mx-auto h-6 w-6" strokeWidth={3} />
          </button>

          <div className="flex items-center gap-3">
            {Array.from({ length: Math.min(5, total) }).map((_, idx) => {
              const isActive = current % Math.min(5, total) === idx;
              return (
                <span
                  key={idx}
                  className={cn(
                    "inline-block w-3 h-3 rounded",
                    isActive ? "bg-[#7F0019]" : "bg-[#BBA98D]",
                  )}
                />
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Next"
            onClick={() => api?.scrollNext()}
            className="w-12 h-12 rounded-md bg-[#7F0019] text-[#F7E1D0] shadow-sm hover:brightness-110"
          >
            <ChevronRight className="mx-auto h-6 w-6" strokeWidth={3} />
          </button>
        </div>
      </Carousel>
    </div>
  );
}
