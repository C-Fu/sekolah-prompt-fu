import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LevelComplete } from "@/components/kids/elements/level-complete";
import { LessonOriginProvider } from "@/components/kids/providers/lesson-origin-context";
import * as progressModule from "@/lib/kids/progress";
import enMessages from "../../../messages/en.json";
import msMessages from "../../../messages/ms.json";

// Mock next/navigation useRouter
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

let currentLocale = "en";

// Mock next-intl translations
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    const bundle: Record<string, any> = currentLocale === "ms" ? msMessages : enMessages;
    let target: any = bundle.kids;
    const parts = key.split(".");
    for (const p of parts) {
      target = target?.[p];
    }
    if (typeof target === "string" && params) {
      return target.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ""));
    }
    return target ?? key;
  },
  useLocale: () => currentLocale,
}));

// Mock progress and levels helpers
vi.mock("@/lib/kids/progress", () => ({
  completeLevel: vi.fn(),
  getLevelProgress: vi.fn(() => ({ stars: 2, completed: true })),
}));

vi.mock("@/lib/kids/levels", () => ({
  getAdjacentLevels: (slug: string) => {
    if (slug === "1-1-meet-peromfu") {
      return {
        prev: null,
        next: { slug: "1-2-first-words", title: "Peromfu's First Words" },
      };
    }
    if (slug === "5-4-graduation-day") {
      return {
        prev: { slug: "5-3-prompt-remix", title: "Prompt Remix" },
        next: null,
      };
    }
    return { prev: null, next: null };
  },
  getLevelBySlug: (slug: string) => ({
    slug,
    world: slug.startsWith("5-") ? 5 : 1,
    title: slug,
  }),
}));

vi.mock("@/lib/analytics", () => ({
  analyticsKids: {
    completeLevel: vi.fn(),
  },
}));

describe("LevelComplete Origin-Aware Routing & Progression (CLAR-03)", () => {
  beforeEach(() => {
    pushMock.mockClear();
    currentLocale = "en";
    localStorage.clear();
  });

  it("returns to /map when origin is map or direct/invalid", () => {
    // 1. With explicit map origin
    const { unmount } = render(
      <LessonOriginProvider initialOrigin="map">
        <LevelComplete levelSlug="1-1-meet-peromfu" stars={3} />
      </LessonOriginProvider>
    );

    const returnLinks = screen.getAllByRole("link").filter((l) => l.getAttribute("href") === "/map");
    expect(returnLinks.length).toBeGreaterThan(0);
    expect(screen.getByText("Return to Earth map")).toBeInTheDocument();
    unmount();

    // 2. With invalid origin (e.g. hostile URL) -> falls back to /map
    render(
      <LessonOriginProvider initialOrigin={"https://evil.com" as any}>
        <LevelComplete levelSlug="1-1-meet-peromfu" stars={3} />
      </LessonOriginProvider>
    );
    expect(screen.getByText("Return to Earth map")).toBeInTheDocument();
  });

  it("returns to /planets and carries planets origin to next level when origin is planets", () => {
    render(
      <LessonOriginProvider initialOrigin="planets">
        <LevelComplete levelSlug="1-1-meet-peromfu" stars={3} />
      </LessonOriginProvider>
    );

    // Return link goes to /planets
    const planetReturnLink = screen.getByRole("link", { name: /Return to Planets/i });
    expect(planetReturnLink).toHaveAttribute("href", "/planets");

    // Next Level link propagates ?origin=planets
    const nextLevelLink = screen.getByRole("link", { name: /Next Level/i });
    expect(nextLevelLink).toHaveAttribute("href", "/level/1-2-first-words?origin=planets");
  });

  it("renders localized return copy in Bahasa Melayu", () => {
    currentLocale = "ms";
    render(
      <LessonOriginProvider initialOrigin="planets">
        <LevelComplete levelSlug="1-1-meet-peromfu" stars={3} />
      </LessonOriginProvider>
    );

    expect(screen.getByRole("link", { name: /Kembali ke Planet/i })).toHaveAttribute("href", "/planets");
  });
});
