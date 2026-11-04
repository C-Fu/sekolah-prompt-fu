import { getRequestConfig } from "next-intl/server";
import { supportedLocales, defaultLocale } from "@/lib/i18n/config";
import { IntlErrorCode } from "next-intl";

/**
 * Resolve a candidate locale to a known supported locale.
 * Untrusted input (persisted preference, etc.) is never interpolated into an
 * import path before validation; anything unsupported falls back to the default.
 */
function resolveSupportedLocale(candidate: string | null | undefined): string {
  return candidate && supportedLocales.includes(candidate)
    ? candidate
    : defaultLocale;
}

export default getRequestConfig(async () => {
  // Deterministic, request-independent default locale. Client-side preference
  // switching (persisted locale) is wired separately in a later plan, with the
  // chosen locale always validated against supportedLocales before use.
  const locale = resolveSupportedLocale(defaultLocale);

  // Load bundled messages for the locale
  let messages;
  try {
    messages = (await import(`@/../messages/${locale}.json`)).default;
  } catch {
    // Fall back to default locale messages
    messages = (await import(`@/../messages/${defaultLocale}.json`)).default;
  }

  return {
    locale,
    messages,
    timeZone: "UTC",
    // Handle missing messages gracefully in production
    onError(error) {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        // Log missing messages but don't throw
        console.warn(`Missing translation: ${error.originalMessage}`);
      } else if (error.code === "ENVIRONMENT_FALLBACK" as IntlErrorCode) {
        // Silently ignore environment fallback warnings
      } else {
        console.error(error);
      }
    },
    getMessageFallback({ namespace, key }) {
      return `${namespace}.${key}`;
    },
  };
});
