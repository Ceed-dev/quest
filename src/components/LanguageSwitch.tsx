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
  // static class variants (avoid runtime-generated arbitrary values)
  const variants =
    size === "sm"
      ? { wrap: "h-8 text-[12px] p-1", thumb: "top-1 bottom-1 left-1" }
      : { wrap: "h-9 text-[13px] p-1.5", thumb: "top-1.5 bottom-1.5 left-1.5" };

  // slide thumb to the right on JA
  const translate = locale === "ja" ? "translate-x-[32px]" : "translate-x-0";

  return (
    <div
      className={`relative inline-grid grid-cols-2 items-center select-none rounded-full bg-[#0f0f10] text-[#BBA98D] w-20 ${variants.wrap} ${className}`}
      role="group"
      aria-label="Language switch"
    >
      {/* sliding white thumb */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute ${variants.thumb} w-[36px] rounded-full bg-white transition-transform duration-200 ease-out ${translate}`}
      />

      {/* EN */}
      <button
        type="button"
        className={`relative z-10 inline-flex w-full items-center justify-center rounded-full hover:opacity-90 focus:outline-none ${locale === "en" ? "text-black" : "text-[#BBA98D]"}`}
        aria-pressed={locale === "en"}
        aria-label="Switch to English"
        onClick={() => onLocaleChange("en")}
      >
        EN
      </button>

      {/* JA */}
      <button
        type="button"
        className={`relative z-10 inline-flex w-full items-center justify-center rounded-full hover:opacity-90 focus:outline-none ${locale === "ja" ? "text-black" : "text-[#BBA98D]"}`}
        aria-pressed={locale === "ja"}
        aria-label="日本語に切り替え"
        onClick={() => onLocaleChange("ja")}
      >
        JA
      </button>
    </div>
  );
}
