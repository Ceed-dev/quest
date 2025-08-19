import type { LocalizedText, Locale, LocalizedObject } from "@/types/i18n";

/** Type guard: checks if a LocalizedText is the object form. */
const isLocalizedObject = (v: LocalizedText): v is LocalizedObject =>
  typeof v === "object" && v !== null;

/**
 * Normalize any LocalizedText to the object form.
 * - Plain strings become { en: str } for backward compatibility.
 */
export const coerceLText = (v: LocalizedText): LocalizedObject =>
  isLocalizedObject(v) ? v : { en: v };

/**
 * Resolve a localized string with a robust fallback order.
 * Order:
 * 1) requested `locale`
 * 2) `defaultLocale` (if provided)
 * 3) explicit `fallback` (defaults to "en")
 * 4) "en"
 * 5) "ja"
 * 6) empty string
 */
export function getLText(
  v: LocalizedText | undefined,
  locale: Locale,
  fallback: Locale = "en",
): string {
  if (v == null) return "";

  // Legacy path: plain string (e.g., existing EN-only data)
  if (!isLocalizedObject(v)) return v;

  return (
    v[locale] ??
    (v.defaultLocale ? v[v.defaultLocale] : undefined) ??
    v[fallback] ??
    v.en ??
    v.ja ??
    ""
  );
}
