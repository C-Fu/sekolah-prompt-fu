import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup, fireEvent, within, act } from "@testing-library/react";

// `settings-modal` -> `@/lib/seo` chain is not involved, but `prompts.config` is pulled in
// by some transitive imports; stub it to the same shape as the other kids tests.
vi.mock("@/../prompts.config", () => ({
  default: { branding: { name: "prompts.chat" } },
}));

// The global setup mocks `next-intl` down to only `useTranslations`/`useLocale`. These
// tests render the *real* provider, so re-export the actual module (overriding the global
// mock) to get `NextIntlClientProvider` and the real `useLocale`/`useTranslations`.
vi.mock("next-intl", async (importOriginal) => importOriginal<typeof import("next-intl")>());

import { Providers } from "@/components/providers";
import { LevelProvider } from "@/components/kids/providers/level-context";
import { LevelContentWrapper } from "@/components/kids/layout/level-content-wrapper";
import { SettingsButton } from "@/components/kids/layout/settings-modal";
import { MusicProvider } from "@/components/kids/layout/background-music";
import {
  clearAllProgress,
  getCompletedLevelsCount,
  getTotalStars,
  isSectionCompleted,
  markSectionCompleted,
  saveComponentState,
} from "@/lib/kids/progress";
import { LOCALE_PREFERENCE_KEY } from "@/lib/i18n/client";
import enMessages from "@/../messages/en.json";

/**
 * 01-17 task 2 — SettingsButton language selection and reset semantics.
 *
 * These render the real `Providers` (no next-intl mock) so the SettingsButton language
 * click drives the shared provider locale/messages AND the compiled MDX together, and so
 * the storage-preservation / invalidation / reset contracts are asserted against real
 * localStorage behaviour rather than source text.
 */

const SLUG = "1-1-meet-promi";
const COMPONENT_STATE_KEY = "kids-component-state";
const SECTION_COMPLETION_KEY = "kids-section-completion";
const PROGRESS_KEY = "kids-progress";
const MUSIC_ENABLED_KEY = "kids-music-enabled";

// sonner's <Toaster /> (rendered by Providers) reads prefers-color-scheme; jsdom lacks
// matchMedia, so provide a minimal stub.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function App() {
  return (
    <Providers locale="en" messages={enMessages as never}>
      <MusicProvider>
        <LevelProvider levelSlug={SLUG}>
          <SettingsButton />
          <LevelContentWrapper levelSlug={SLUG} levelNumber="1-1" />
        </LevelProvider>
      </MusicProvider>
    </Providers>
  );
}

async function renderApp() {
  const utils = render(<App />);
  // Wait for the compiled en MDX (ten Sections) to mount.
  await waitFor(() => {
    expect(document.querySelectorAll("section[data-section-index]").length).toBe(10);
  });
  return utils;
}

async function openSettings() {
  fireEvent.click(screen.getByRole("button", { name: "Settings" }));
  await screen.findByRole("heading", { name: /Settings/ });
}

/** Seed a completed level, an unlocked next level, sound preference and interaction state. */
function seedProgress() {
  // 1-1-meet-promi completed with three stars (an unlocked world beyond the first).
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({
      levels: {
        [SLUG]: { completed: true, stars: 3, completedAt: "2026-01-01T00:00:00.000Z" },
        "1-2-first-words": { completed: true, stars: 2, completedAt: "2026-01-02T00:00:00.000Z" },
      },
      currentLevel: "1-3-being-clear",
      totalStars: 5,
    })
  );
  // A locale-incompatible component draft keyed by a React useId.
  saveComponentState(SLUG, ":r7:", { completed: true, draft: "typed in en" });
  // An en Section completion at index 8 — a Section index absent from the es content.
  markSectionCompleted(SLUG, 8);
  markSectionCompleted(SLUG, 1);
  // Sound preference.
  localStorage.setItem(MUSIC_ENABLED_KEY, "false");
}

function sectionEl(index: number): HTMLElement {
  return document.querySelector(`section[data-section-index="${index}"]`) as HTMLElement;
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

/** Footer "Next"/"Siguiente" button (label differs per locale). */
function nextButton(name = "Next"): HTMLButtonElement {
  return screen.getByRole("button", { name }) as HTMLButtonElement;
}

describe("SettingsButton language selection preserves progress and invalidates incompatible interactions (01-17 task 2)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("switches UI messages and compiled MDX together without navigation, retaining stars/levels/sound", async () => {
    seedProgress();
    const starsBefore = getTotalStars();
    const completedBefore = getCompletedLevelsCount();
    const progressBefore = localStorage.getItem(PROGRESS_KEY);
    const soundBefore = localStorage.getItem(MUSIC_ENABLED_KEY);
    expect(starsBefore).toBe(5);
    expect(completedBefore).toBe(2);

    await renderApp();
    await openSettings();

    // en settings title.
    expect(screen.getByRole("heading", { name: /Settings/ })).toBeInTheDocument();

    // Select Spanish.
    fireEvent.click(screen.getByRole("button", { name: /Español/ }));

    // Messages switched to the matching es bundle (title becomes "Configuración").
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Configuración/ })).toBeInTheDocument();
    });

    // Compiled MDX switched to the seven-Section es content on the same slug (no nav).
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(7);
    });
    expect(document.querySelectorAll("section[data-section-index]").length).not.toBe(10);

    // Persisted preference recorded.
    expect(localStorage.getItem(LOCALE_PREFERENCE_KEY)).toBe("es");

    // kids-progress and sound settings are byte-for-byte unchanged.
    expect(localStorage.getItem(PROGRESS_KEY)).toBe(progressBefore);
    expect(localStorage.getItem(MUSIC_ENABLED_KEY)).toBe(soundBefore);
    expect(getTotalStars()).toBe(starsBefore);
    expect(getCompletedLevelsCount()).toBe(completedBefore);
  });

  it("invalidates index-based Section completions and useId drafts before the es MDX mounts", async () => {
    seedProgress();
    await renderApp();

    // Seed a useId-keyed draft on the en level and an en Section completion at index 8.
    saveComponentState(SLUG, ":r0:", { completed: true });
    markSectionCompleted(SLUG, 8);
    expect(isSectionCompleted(SLUG, 8)).toBe(true);
    // The seeded en drafts are present before the switch.
    expect(JSON.parse(localStorage.getItem(COMPONENT_STATE_KEY) || "{}")[SLUG])?.toHaveProperty(
      ":r0:"
    );
    expect(JSON.parse(localStorage.getItem(COMPONENT_STATE_KEY) || "{}")[SLUG])?.toHaveProperty(
      ":r7:"
    );

    await openSettings();
    fireEvent.click(screen.getByRole("button", { name: /Español/ }));
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(7);
    });

    // The en index-based Section completion is cleared; the en index 8 cannot carry into es.
    expect(isSectionCompleted(SLUG, 8)).toBe(false);
    // The old useId-keyed drafts are gone (the fresh es mount may write its own new keys).
    const remaining = JSON.parse(localStorage.getItem(COMPONENT_STATE_KEY) || "{}")[SLUG] || {};
    expect(remaining).not.toHaveProperty(":r0:");
    expect(remaining).not.toHaveProperty(":r7:");
    // kids-progress survives the invalidation.
    expect(localStorage.getItem(PROGRESS_KEY)).not.toBeNull();
    expect(getTotalStars()).toBe(5);
  });

  it("keeps fresh es Sections locked until solved; the old en completion cannot unlock them", async () => {
    seedProgress();
    await renderApp();

    // Pre-seed the en Section at index 1 as complete (WordPredictor in en).
    markSectionCompleted(SLUG, 1);

    await openSettings();
    fireEvent.click(screen.getByRole("button", { name: /Español/ }));
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(7);
    });

    // es Section 0 is a plain Panel → Next ("Siguiente") enabled; advance into es Section 1.
    // The footer navigation stays queryable alongside the still-open settings modal.
    await waitFor(() => {
      expect(nextButton("Siguiente")).toBeEnabled();
    });
    fireEvent.click(nextButton("Siguiente"));
    await waitFor(() => {
      expect(document.querySelector('section[data-section-index]:not([hidden])')).toHaveAttribute(
        "data-section-index",
        "1"
      );
    });

    // The es WordPredictor Section requires completion and is locked — the en completion at
    // the old index 1 did not unlock it (its completion was invalidated).
    await waitFor(() => {
      expect(nextButton("Siguiente")).toBeDisabled();
    });
    expect(isSectionCompleted(SLUG, 1)).toBe(false);

    // Solve the es WordPredictor ("cama") → the Section unlocks on its own answer.
    const esSection = sectionEl(1);
    fireEvent.click(within(esSection).getByRole("button", { name: "cama", hidden: true }));
    await waitFor(() => {
      expect(
        within(esSection).getByRole("button", { name: "¡Comprobar mi respuesta!", hidden: true })
      ).toBeEnabled();
    });
    fireEvent.click(
      within(esSection).getByRole("button", { name: "¡Comprobar mi respuesta!", hidden: true })
    );

    await waitFor(() => {
      expect(isSectionCompleted(SLUG, 1)).toBe(true);
    });
    await waitFor(() => {
      expect(nextButton("Siguiente")).toBeEnabled();
    });
  });

  it("restores a saved es preference after default hydration without wiping newly earned es completions", async () => {
    // Persist es as the saved preference and a completion the child just earned in es.
    localStorage.setItem(LOCALE_PREFERENCE_KEY, "es");
    markSectionCompleted(SLUG, 1);
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ levels: { [SLUG]: { completed: true, stars: 3 } }, totalStars: 3 })
    );

    render(<App />);

    // The provider restores es after mount (default en hydrates first, then es).
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(7);
    });
    // Restoring the saved locale must NOT have invalidated its own completion.
    expect(isSectionCompleted(SLUG, 1)).toBe(true);
  });
});

describe("SettingsButton reset semantics (01-17 task 2)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("cancelling the reset confirmation retains all three kids stores", async () => {
    seedProgress();
    await renderApp();
    await openSettings();

    // Enter the confirm state, then cancel.
    fireEvent.click(screen.getByRole("button", { name: /reset all progress/i }));
    const cancel = await screen.findByRole("button", { name: /cancel/i });
    fireEvent.click(cancel);

    // All three stores retained, including the section completion and component drafts.
    expect(localStorage.getItem(PROGRESS_KEY)).not.toBeNull();
    expect(localStorage.getItem(COMPONENT_STATE_KEY)).not.toBeNull();
    expect(localStorage.getItem(SECTION_COMPLETION_KEY)).not.toBeNull();
    expect(isSectionCompleted(SLUG, 8)).toBe(true);
    expect(getTotalStars()).toBe(5);
    expect(getCompletedLevelsCount()).toBe(2);
  });

  it("confirming the reset removes kids-progress, kids-component-state and kids-section-completion", async () => {
    seedProgress();
    await renderApp();
    await openSettings();

    // Enter the confirm state and confirm.
    fireEvent.click(screen.getByRole("button", { name: /reset all progress/i }));
    const confirm = await screen.findByRole("button", { name: /yes, reset everything/i });
    await act(async () => {
      fireEvent.click(confirm);
    });

    // All three stores removed.
    expect(localStorage.getItem(PROGRESS_KEY)).toBeNull();
    expect(localStorage.getItem(COMPONENT_STATE_KEY)).toBeNull();
    expect(localStorage.getItem(SECTION_COMPLETION_KEY)).toBeNull();

    // Derived counters and section completion read zero/false after reload.
    expect(getTotalStars()).toBe(0);
    expect(getCompletedLevelsCount()).toBe(0);
    expect(isSectionCompleted(SLUG, 8)).toBe(false);

    // A conflicting legacy helper: clearAllProgress is the confirmed-reset owner.
    clearAllProgress();
    expect(localStorage.getItem(PROGRESS_KEY)).toBeNull();
  });
});