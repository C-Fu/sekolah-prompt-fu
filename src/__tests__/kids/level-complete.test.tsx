import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LevelComplete } from "@/components/kids/elements/level-complete";

// Mock next/navigation useRouter
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock next-intl translations
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      "levelComplete.title": "Level Complete!",
      "levelComplete.nextLevel": "Next Level",
      "levelComplete.backToMap": "Back to Map",
      "levelComplete.allDone": "Back to Map",
      "levelComplete.graduationTitle": "Academy Graduate!",
      "levelComplete.graduationMessage": "You mastered all prompting basics on Earth! The Solar System awaits you!",
      "rocketLaunch.launchButton": "Launch Rocket to Space!",
      "rocketLaunch.blastOff": "BLAST OFF!",
      "rocketLaunch.heading": "Destination: Planetary Explorer!",
      "rocketLaunch.subheading": "Leaving Earth to explore subject missions...",
      "rocketLaunch.skip": "Skip Launch",
    };
    return messages[key] || key;
  },
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

describe("LevelComplete component", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("renders standard completion view when levelSlug is NOT 5-4-graduation-day", () => {
    render(<LevelComplete levelSlug="1-1-meet-peromfu" stars={3} />);

    expect(screen.getByText("Level Complete!")).toBeInTheDocument();
    expect(screen.getByText("Next Level")).toBeInTheDocument();
    expect(screen.getByText("Back to Map")).toBeInTheDocument();
    expect(screen.queryByText("Launch Rocket to Space!")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders Earth graduation capstone view when levelSlug IS 5-4-graduation-day", () => {
    render(<LevelComplete levelSlug="5-4-graduation-day" stars={3} />);

    // Shows special graduation header
    expect(screen.getByText("Academy Graduate!")).toBeInTheDocument();
    expect(
      screen.getByText("You mastered all prompting basics on Earth! The Solar System awaits you!")
    ).toBeInTheDocument();

    // Renders primary Rocket Launch button
    const launchBtn = screen.getByRole("button", { name: /Launch Rocket to Space!/i });
    expect(launchBtn).toBeInTheDocument();

    // Also renders Back to Map option
    expect(screen.getByText("Back to Map")).toBeInTheDocument();

    // Rocket launch modal initially closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens RocketLaunchOverlay when Launch Rocket button is clicked on 5-4-graduation-day", () => {
    render(<LevelComplete levelSlug="5-4-graduation-day" stars={3} />);

    const launchBtn = screen.getByRole("button", { name: /Launch Rocket to Space!/i });
    fireEvent.click(launchBtn);

    // Rocket modal should now be open
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Destination: Planetary Explorer!")).toBeInTheDocument();
  });
});
