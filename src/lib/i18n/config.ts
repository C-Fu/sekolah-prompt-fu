// Cookie name for storing locale preference
export const LOCALE_COOKIE = "NEXT_LOCALE";

// Supported locales descriptor type
export interface LocaleOption {
  code: string;
  label: string;
  flag: string;
}

// Canonical supported locales list (single source of truth)
export const LOCALE_OPTIONS: LocaleOption[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "nl", label: "Dutch", flag: "🇳🇱" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "az", label: "Azərbaycan", flag: "🇦🇿" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "he", label: "עברית", flag: "🇮🇱" },
  { code: "fa", label: "فارسی", flag: "🇮🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "el", label: "Ελληνικά", flag: "🇬🇷" },
];

// Supported locale codes derived from the canonical list
export const supportedLocales = LOCALE_OPTIONS.map((l) => l.code);
export const defaultLocale = "ms";

// RTL locales
export const rtlLocales = ["ar", "he", "fa"];

// Check if a locale is RTL
export function isRtlLocale(locale: string): boolean {
  return rtlLocales.includes(locale);
}

// Get supported locales
export function getSupportedLocales() {
  return supportedLocales;
}

// Get default locale
export function getDefaultLocale() {
  return defaultLocale;
}
