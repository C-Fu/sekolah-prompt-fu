import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RocketLaunchOverlay } from "@/components/kids/elements/rocket-launch-overlay";
import { LevelComplete } from "@/components/kids/elements/level-complete";

const mockPush = vi.fn();
let mockPrefersReducedMotion = false;

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => mockPrefersReducedMotion,
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    const table: Record<string, string> = {
      "rocketLaunch.heading": "Destination: Planetary Explorer!",
      "rocketLaunch.subheading": "Leaving Earth to explore subject missions...",
      "rocketLaunch.skip": "Skip Launch",
      "rocketLaunch.blastOff": "BLAST OFF!",
      "levelComplete.title": "Level Complete!",
      "levelComplete.nextLevel": "Next Lesson",
      "levelComplete.backToMap": "Back to Map",
      "levelComplete.graduationTitle": "Academy Graduate!",
      "levelComplete.graduationMessage": "Graduation details",
      "rocketLaunch.launchButton": "Launch Rocket",
    };
    if (key === "rocketLaunch.countdown") {
      return `${params?.count}...`;
    }
    return table[key] || key;
  },
}));

vi.mock("@/components/kids/providers/lesson-origin-context", () => ({
  useLessonOrigin: () => ({
    origin: "earth-map",
    returnRoute: "/map",
    hubLabelKey: "navigation.map",
  }),
}));

vi.mock("@/lib/kids/progress", () => ({
  getLevelProgress: () => ({ stars: 3 }),
  completeLevel: vi.fn(),
}));

vi.mock("@/lib/kids/levels", () => ({
  getAdjacentLevels: () => ({
    next: { slug: "1-2-first-words" },
    prev: null,
  }),
  getLevelBySlug: () => ({ world: 1 }),
}));

describe("Completion Overlays & Non-Blocking Game Feel (FEEL-02, FEEL-03)", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockPrefersReducedMotion = false;
  });

  it("RocketLaunchOverlay provides an immediate Skip button that triggers navigation", () => {
    render(<RocketLaunchOverlay isOpen={true} destination="/planets" />);
    
    const skipBtn = screen.getByTestId("rocket-skip-button");
    expect(skipBtn).toBeInTheDocument();
    
    fireEvent.click(skipBtn);
    expect(mockPush).toHaveBeenCalledWith("/planets");
  });

  it("RocketLaunchOverlay bypasses countdown under reduced-motion preference", () => {
    mockPrefersReducedMotion = true;
    render(<RocketLaunchOverlay isOpen={true} destination="/planets" />);

    // In reduced motion, countdown is bypassed and static continue card is rendered
    expect(screen.queryByTestId("rocket-countdown")).not.toBeInTheDocument();
    
    const continueBtn = screen.getByTestId("reduced-motion-continue-btn");
    expect(continueBtn).toBeInTheDocument();

    fireEvent.click(continueBtn);
    expect(mockPush).toHaveBeenCalledWith("/planets");
  });

  it("Escape key dismisses RocketLaunchOverlay and navigates", () => {
    render(<RocketLaunchOverlay isOpen={true} destination="/planets" />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockPush).toHaveBeenCalledWith("/planets");
  });

  it("LevelComplete action buttons are immediately clickable without waiting", () => {
    render(<LevelComplete levelSlug="1-1-meet-peromfu" stars={3} />);

    const nextLink = screen.getByRole("link", { name: /Next Lesson/i });
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute("href", expect.stringContaining("1-2-first-words"));
  });

  it("LevelComplete suppresses confetti under reduced-motion preference", () => {
    mockPrefersReducedMotion = true;
    render(<LevelComplete levelSlug="1-1-meet-peromfu" stars={3} />);

    expect(screen.queryByTestId("level-complete-confetti")).not.toBeInTheDocument();
  });
});
