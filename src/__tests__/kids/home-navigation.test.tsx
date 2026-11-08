import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KidsHomeContent } from "@/components/kids/layout/kids-home-content";
import * as analyticsModule from "@/lib/analytics";

// Mock next/link to render anchor tag
vi.mock("next/link", () => ({
  default: ({ href, children, onClick, ...props }: any) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

// Mock next-intl translations
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      "home.badge": "Learning for Kids",
      "home.title": "Learn to Talk to AI!",
      "home.subtitle": "Join Peromfu the robot on a fun adventure!",
      "home.peromfuIntro.greeting": "Hi, I'm Peromfu! 🤖",
      "home.peromfuIntro.message": "Teach me how to understand prompts better!",
      "home.whatYouLearn": "What You'll Learn",
      "home.features.games.title": "Fun Games",
      "home.features.games.description": "Learn by playing",
      "home.features.stories.title": "Cool Stories",
      "home.features.stories.description": "Exciting adventures",
      "home.features.stars.title": "Earn Stars",
      "home.features.stars.description": "Collect stars",
      "home.readyTitle": "Ready to Start?",
      "home.readyMessage": "Choose where to begin your journey!",
      "home.startButton": "Start Playing!",
      "home.startEarthTitle": "Start on Earth (Prompting 101)",
      "home.startEarthDesc": "Learn foundational AI prompting skills across 5 worlds",
      "home.explorePlanetsTitle": "Explore Solar System (3D)",
      "home.explorePlanetsDesc": "Fly through space to discover BM, Math, English & Moral missions",
      "home.earthFoundationalBadge": "Foundational Academy",
      "home.cosmosBadge": "Cosmic Missions",
      "home.ageNote": "Best for kids ages 8-14",
      "navigation.back": "Back",
      "navigation.next": "Next",
      "navigation.stepIndicator": "Step {current} of {total}",
    };
    return messages[key] || key;
  },
}));

describe("KidsHomeContent Step 2 Navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("navigates to Step 2 and renders dual CTAs for Earth and Solar System", () => {
    render(<KidsHomeContent />);

    // Click Next twice to reach step 2
    const nextBtn = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn); // step 1
    fireEvent.click(nextBtn); // step 2

    // Check dual CTA buttons
    const earthLink = screen.getByRole("link", { name: /Start on Earth/i });
    const planetsLink = screen.getByRole("link", { name: /Explore Solar System/i });

    expect(earthLink).toBeInTheDocument();
    expect(earthLink).toHaveAttribute("href", "/map");

    expect(planetsLink).toBeInTheDocument();
    expect(planetsLink).toHaveAttribute("href", "/planets");
  });

  it("renders the educational badge highlighting Earth as foundational academy", () => {
    render(<KidsHomeContent />);

    const nextBtn = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);

    expect(screen.getByText("Foundational Academy")).toBeInTheDocument();
    expect(screen.getByText("Cosmic Missions")).toBeInTheDocument();
  });

  it("triggers analytics events when clicking the CTA buttons", () => {
    const startGameSpy = vi.spyOn(analyticsModule.analyticsKids, "startGame");
    const exploreSolarSystemSpy = vi.spyOn(analyticsModule.analyticsKids, "exploreSolarSystem");

    render(<KidsHomeContent />);

    const nextBtn = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);

    const earthLink = screen.getByRole("link", { name: /Start on Earth/i });
    fireEvent.click(earthLink);
    expect(startGameSpy).toHaveBeenCalled();

    const planetsLink = screen.getByRole("link", { name: /Explore Solar System/i });
    fireEvent.click(planetsLink);
    expect(exploreSolarSystemSpy).toHaveBeenCalled();
  });
});
