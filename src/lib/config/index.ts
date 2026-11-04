/**
 * Kids-only application configuration.
 *
 * After the non-kids platform retirement (Phase 01), the only configuration the
 * retained kids game consumes is its branding, theme and i18n inventory. The
 * previous runtime environment-variable override layer and the auth/features/
 * homepage/announcement blocks belonged to the retired community platform and
 * have been removed (owner-approved in 01-01-SUMMARY.md).
 *
 * `defineConfig` stays a typed identity helper so `prompts.config.ts` remains a
 * strongly-typed, statically-analyzable module with no server-only imports.
 */

export interface BrandingConfig {
  name: string;
  logo: string;
  logoDark?: string;
  favicon: string;
  description: string;
}

export interface ThemeConfig {
  // Appearance
  radius: "none" | "sm" | "md" | "lg"; // Border radius
  variant: "flat" | "default" | "brutal"; // UI style variant
  density: "compact" | "default" | "comfortable"; // Spacing density
  // Colors (CSS oklch values or hex)
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
}

export interface I18nConfig {
  locales: string[];
  defaultLocale: string;
}

export interface KidsConfig {
  branding: BrandingConfig;
  theme: ThemeConfig;
  i18n: I18nConfig;
}

export function defineConfig(config: KidsConfig): KidsConfig {
  return config;
}