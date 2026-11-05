"use client";

import type { AbstractIntlMessages } from "next-intl";
import { defaultLocale, supportedLocales } from "./config";
import { invalidateLocaleIncompatibleInteractions } from "@/lib/kids/progress";

/**
 * Client locale preference (01-17).
 *
 * Replaces the retired cookie + hard-reload switcher with a validated, persisted client
 * preference signal. The preference is stored in `localStorage` and never resolved at
 * request time; the shared `Providers` component owns the matching locale/messages pair
 * and switches them atomically.
 *
 * All untrusted input (persisted preference, a SettingsButton target) is validated
 * against `supportedLocales` before any bounded message import is indexed (threat
 * T-01-16).
 */

/** localStorage key for the persisted locale preference. */
export const LOCALE_PREFERENCE_KEY = "kids-locale-preference";

/**
 * Bounded, statically analyzable message loaders — one per supported locale. The runtime
 * only ever indexes this map with a validated locale, so an unsupported locale can never
 * build an import path.
 */
const messageLoaders: Record<string, () => Promise<{ default: unknown }>> = {
  en: () => import("@/../messages/en.json"),
  tr: () => import("@/../messages/tr.json"),
  es: () => import("@/../messages/es.json"),
  zh: () => import("@/../messages/zh.json"),
  ja: () => import("@/../messages/ja.json"),
  ar: () => import("@/../messages/ar.json"),
  pt: () => import("@/../messages/pt.json"),
  fr: () => import("@/../messages/fr.json"),
  it: () => import("@/../messages/it.json"),
  de: () => import("@/../messages/de.json"),
  nl: () => import("@/../messages/nl.json"),
  ko: () => import("@/../messages/ko.json"),
  ru: () => import("@/../messages/ru.json"),
  he: () => import("@/../messages/he.json"),
  el: () => import("@/../messages/el.json"),
  fa: () => import("@/../messages/fa.json"),
  az: () => import("@/../messages/az.json"),
  ms: () => import("@/../messages/ms.json"),
};

/** True when `locale` is a supported locale. */
export function isSupportedLocale(locale: string | null | undefined): boolean {
  return typeof locale === "string" && supportedLocales.includes(locale);
}

/** Resolve an untrusted candidate to a supported locale, falling back to the default. */
export function resolveSupportedLocale(candidate: string | null | undefined): string {
  return isSupportedLocale(candidate) ? (candidate as string) : defaultLocale;
}

/** Read the persisted, validated locale preference (or `null` when absent/unsupported). */
export function readPersistedLocale(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(LOCALE_PREFERENCE_KEY);
    return isSupportedLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** Persist a validated locale preference. Returns success. */
export function writePersistedLocale(locale: string): boolean {
  if (typeof window === "undefined") return false;
  if (!isSupportedLocale(locale)) return false;
  try {
    window.localStorage.setItem(LOCALE_PREFERENCE_KEY, locale);
    return true;
  } catch {
    return false;
  }
}

/** Load the bounded messages bundle for a validated locale (default on failure). */
export async function loadMessages(locale: string): Promise<AbstractIntlMessages> {
  const resolved = resolveSupportedLocale(locale);
  try {
    return (await messageLoaders[resolved]()).default as AbstractIntlMessages;
  } catch {
    // Only a missing/unreadable supported module falls back; never index an unknown key.
    return (await messageLoaders[defaultLocale]()).default as AbstractIntlMessages;
  }
}

/**
 * @deprecated Retired cookie + hard-reload switcher. Kids UI switches locale through the
 * `Providers` context (`useLocalePreference`/`setUserLocale`) which updates messages, MDX
 * and direction without navigation. Kept as a thin shim so remaining non-kids callers
 * still type-check and a stale caller at least persists a validated preference.
 */
export function setLocale(locale: string): void {
  writePersistedLocale(resolveSupportedLocale(locale));
}

/**
 * @deprecated Cookie-based locale read. Prefer `readPersistedLocale`.
 */
export function getLocaleClient(): string | null {
  return readPersistedLocale();
}

export interface LocaleTransitionResult {
  /** Whether the caller may commit the new locale/messages. */
  ok: boolean;
  /** The effective locale to commit (the target on success, the current one on failure). */
  locale: string;
  /** True when invalidation was attempted but failed (storage denied). */
  invalidationFailed: boolean;
  /**
   * True when this was a genuine user-initiated change to a *different* locale (as
   * opposed to a repeated selection of the already-effective locale).
   */
  changed: boolean;
}

/**
 * Orchestrate a user-initiated locale selection.
 *
 * Semantics (01-17):
 * - A repeated selection of the already-effective locale is a no-op: nothing is
 *   invalidated and nothing is persisted again.
 * - A genuine change to a different locale first invalidates locale-incompatible
 *   component drafts and index-based Section completions, then persists the preference.
 *   `kids-progress` and the sound setting are never touched.
 * - If invalidation fails (storage denied), the caller must NOT activate translated MDX
 *   with stale completion keys: we report `ok: false` and retain the current locale.
 *
 * Initial restoration of a saved preference is NOT routed through here — that path
 * restores the persisted locale without invalidating its own completions.
 */
export function transitionLocale(
  target: string,
  currentEffective: string
): LocaleTransitionResult {
  const resolved = resolveSupportedLocale(target);

  if (resolved === currentEffective) {
    return { ok: true, locale: currentEffective, invalidationFailed: false, changed: false };
  }

  const invalidated = invalidateLocaleIncompatibleInteractions();
  if (!invalidated) {
    return {
      ok: false,
      locale: currentEffective,
      invalidationFailed: true,
      changed: true,
    };
  }

  writePersistedLocale(resolved);
  return { ok: true, locale: resolved, invalidationFailed: false, changed: true };
}