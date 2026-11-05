import { defineConfig } from "@/lib/config";

/**
 * Kids-only application configuration.
 *
 * The retained surface of this app is the kids prompt-learning game, so the
 * config is limited to its branding, theme and i18n inventory. The retired
 * community-platform blocks (auth providers, feature flags, homepage sponsors,
 * announcement bar) and the runtime `PCHAT_*` environment overrides were
 * removed in Phase 01 with owner approval (01-01-SUMMARY.md).
 */
export default defineConfig({
  // Branding for the kids game.
  branding: {
    name: "Sekolah Prompt-Fu",
    logo: "/logo.svg",
    logoDark: "/logo-dark.svg",
    favicon: "/favicon/favicon.svg",
    description: "A playful way for kids to learn how to talk to AI.",
  },

  // Theme - design system configuration.
  theme: {
    // Border radius: "none" | "sm" | "md" | "lg"
    radius: "sm",
    // UI style: "flat" | "default" | "brutal"
    variant: "default",
    // Spacing density: "compact" | "default" | "comfortable"
    density: "default",
    // Colors (hex or oklch)
    colors: {
      primary: "#6366f1", // Indigo
    },
  },

  // Internationalization - keep in sync with src/lib/i18n/config.ts.
  i18n: {
    locales: ["en", "tr", "es", "zh", "ja", "ar", "pt", "fr", "it", "de", "nl", "ko", "ru", "he", "el", "fa", "az", "ms"],
    defaultLocale: "en",
  },
});