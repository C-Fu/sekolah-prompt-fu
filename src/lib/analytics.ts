/**
 * Kids analytics event tracking utility.
 *
 * Retained interface for the kids game after non-kids analytics families were
 * pruned (01-12). Events are only sent when the Google Analytics `gtag` global
 * is present; there are no network, auth or database references here — the
 * helper only forwards to the page-injected `window.gtag`.
 */

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

type GTagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
};

function trackEvent({ action, category, label, value, ...rest }: GTagEvent) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
      ...rest,
    });
  }
}

// ============================================================================
// Kids Mode Events
// ============================================================================

export const analyticsKids = {
  startGame: () => {
    trackEvent({
      action: "kids_start_game",
      category: "kids",
    });
  },

  viewLevel: (levelSlug: string, world: number) => {
    trackEvent({
      action: "kids_view_level",
      category: "kids",
      label: levelSlug,
      world,
    });
  },

  completeLevel: (levelSlug: string, world: number, stars: number) => {
    trackEvent({
      action: "kids_complete_level",
      category: "kids",
      label: levelSlug,
      world,
      value: stars,
    });
  },

  completeWorld: (world: number) => {
    trackEvent({
      action: "kids_complete_world",
      category: "kids",
      value: world,
    });
  },

  interactiveComplete: (componentType: string, levelSlug: string) => {
    trackEvent({
      action: "kids_interactive_complete",
      category: "kids",
      label: `${componentType}:${levelSlug}`,
    });
  },

  openSettings: () => {
    trackEvent({
      action: "kids_open_settings",
      category: "kids",
    });
  },

  changeLanguage: (locale: string) => {
    trackEvent({
      action: "kids_change_language",
      category: "kids",
      label: locale,
    });
  },

  resetProgress: () => {
    trackEvent({
      action: "kids_reset_progress",
      category: "kids",
    });
  },

  viewMap: () => {
    trackEvent({
      action: "kids_view_map",
      category: "kids",
    });
  },

  exploreSolarSystem: () => {
    trackEvent({
      action: "kids_explore_solar_system",
      category: "kids",
    });
  },
};