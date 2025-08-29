"use client";

import React from "react";

type Locale = "en" | "ja";

export default function LanguageSwitch({
  locale,
  onLocaleChange,
  size = "md",
  className = "",
}: {
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  // ---- size presets (fixed numbers → デザイン再現用) ----
  const S =
    size === "sm"
      ? {
          wrapW: "w-[120px]",
          wrapH: "h-9",
          pad: "p-1.5",
          thumbInset: "top-1.5 bottom-1.5 left-1.5",
          thumbW: "w-[54px]",
          thumbShift: "translate-x-[54px]",
          text: "text-[13px]",
        }
      : {
          wrapW: "w-[156px]",
          wrapH: "h-11", // 約44px
          pad: "p-1.5",
          thumbInset: "top-1.5 bottom-1.5 left-1.5",
          thumbW: "w-[72px]",
          thumbShift: "translate-x-[72px]",
          text: "text-[16px]",
        };

  // JA のときだけサム（白っぽい半円）が右へスライド
  const translate = locale === "ja" ? S.thumbShift : "translate-x-0";

  return (
    <div
      role="group"
      aria-label="Language switch"
      className={[
        "relative inline-grid grid-cols-2 items-center select-none rounded-full",
        // 外枠（添付①のベージュ系）
        "bg-[#BBA98D] text-[#1C1C1C] ring-1 ring-black/10",
        S.wrapW,
        S.wrapH,
        S.pad,
        S.text,
        className,
      ].join(" ")}
    >
      {/* スライドするサム（添付①の淡いピンク系） */}
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute rounded-full",
          "bg-[#F4E0CB] shadow-sm",
          S.thumbInset,
          S.thumbW,
          "transition-transform duration-200 ease-out",
          translate,
        ].join(" ")}
      />

      {/* EN */}
      <button
        type="button"
        className={[
          "relative z-10 inline-flex w-full items-center justify-center rounded-full transition-colors",
          locale === "en"
            ? "font-semibold text-[#1C1C1C]"
            : "text-[#1C1C1C]/80",
        ].join(" ")}
        aria-pressed={locale === "en"}
        aria-label="Switch to English"
        onClick={() => onLocaleChange("en")}
      >
        EN
      </button>

      {/* JA */}
      <button
        type="button"
        className={[
          "relative z-10 inline-flex w-full items-center justify-center rounded-full transition-colors",
          locale === "ja"
            ? "font-semibold text-[#1C1C1C]"
            : "text-[#1C1C1C]/80",
        ].join(" ")}
        aria-pressed={locale === "ja"}
        aria-label="日本語に切り替え"
        onClick={() => onLocaleChange("ja")}
      >
        JA
      </button>
    </div>
  );
}
