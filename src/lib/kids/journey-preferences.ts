/**
 * Screen tip preferences for Sekolah Prompt-Fu
 *
 * Rules:
 * - Independent dismissal for "map" and "planets".
 * - Stored in a separate localStorage namespace (`kids-journey-preferences`) completely decoupled from `kids-progress`.
 * - Safe against SSR hydration, storage disabled/throwing, and malformed JSON.
 * - Storage failure gracefully degrades to showing the tip without crashing.
 */

export type TipScreenId = "map" | "planets";

const PREFERENCES_KEY = "kids-journey-preferences";

interface JourneyPreferencesState {
  dismissedTips?: Partial<Record<TipScreenId, boolean>>;
}

function getSafeStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readPreferences(): JourneyPreferencesState {
  const storage = getSafeStorage();
  if (!storage) return {};
  try {
    const raw = storage.getItem(PREFERENCES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed;
    }
  } catch {
    // Malformed JSON or storage error - degrade to empty state
  }
  return {};
}

function writePreferences(state: JourneyPreferencesState): void {
  const storage = getSafeStorage();
  if (!storage) return;
  try {
    storage.setItem(PREFERENCES_KEY, JSON.stringify(state));
  } catch {
    // Storage quota or permissions error - ignore safely
  }
}

/**
 * Checks whether the tip for the given screen has been dismissed.
 * Returns false on SSR or if preferences cannot be loaded.
 */
export function isTipDismissed(screen: TipScreenId): boolean {
  if (screen !== "map" && screen !== "planets") return false;
  const prefs = readPreferences();
  return Boolean(prefs.dismissedTips?.[screen]);
}

/**
 * Marks the tip for the specified screen as dismissed without touching learning progress.
 */
export function dismissTip(screen: TipScreenId): void {
  if (screen !== "map" && screen !== "planets") return;
  const prefs = readPreferences();
  const next: JourneyPreferencesState = {
    ...prefs,
    dismissedTips: {
      ...prefs.dismissedTips,
      [screen]: true,
    },
  };
  writePreferences(next);
}

/**
 * Testing helper: resets journey preferences.
 */
export function resetJourneyPreferences(): void {
  const storage = getSafeStorage();
  if (storage) {
    try {
      storage.removeItem(PREFERENCES_KEY);
    } catch {
      // Ignore
    }
  }
}
