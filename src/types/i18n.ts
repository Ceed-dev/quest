/** Supported locales. Extend when adding languages. */
export type Locale = "en" | "ja";

/** Object form for localized text. Values are optional to allow partial translations. */
export interface LocalizedObject {
  en?: string;
  ja?: string;
  /** Canonical language for this value; useful as a fallback hint. */
  defaultLocale?: Locale;
}

/**
 * Localized text value.
 * - Legacy data may be a plain string (e.g., English-only).
 * - New data should prefer the object form.
 */
export type LocalizedText = string | LocalizedObject;
