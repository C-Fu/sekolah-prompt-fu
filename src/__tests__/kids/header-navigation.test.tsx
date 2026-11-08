import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KidsHeader } from "@/components/kids/layout/kids-header";
import { ProgressMap } from "@/components/kids/elements/progress-map";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children?: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock next-intl translations
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    const messages: Record<string, string> = {
      "header.title": "Peromfu's Prompt School",
      "header.home": "Home",
      "header.planets": "Solar System",
      "header.mainSite": "Main Site",
      "level.levelLabel": `Level ${params?.number ?? ""}`,
      "level.map": "Map",
      "map.toPlanetsBanner": "Fly to Solar System",
      "map.toPlanetsSub": "Explore 3D planets & subject adventures!",
    };
    return messages[key] || key;
  },
}));

// Mock analytics
vi.mock("@/lib/analytics", () => ({
  analyticsKids: {
    viewMap: vi.fn(),
  },
}));

// Mock progress
vi.mock("@/lib/kids/progress", () => ({
  getTotalStars: () => 12,
  getCompletedLevelsCount: () => 4,
  getProgress: () => ({
    totalStars: 12,
    levels: { "1-1-meet-peromfu": { completed: true, stars: 3 } },
  }),
  isLevelUnlocked: () => true,
}));

describe("KidsHeader Rocket Navigation", () => {
  it("renders a desktop Rocket button linking to /planets with title/aria-label", () => {
    render(<KidsHeader />);

    // Find links to /planets
    const planetLinks = screen.getAllByRole("link").filter(
      (link) => link.getAttribute("href") === "/planets"
    );
    expect(planetLinks.length).toBeGreaterThan(0);

    const desktopRocketLink = planetLinks.find(
      (link) => link.getAttribute("title") === "Solar System"
    );
    expect(desktopRocketLink).toBeDefined();
    expect(desktopRocketLink).toHaveAttribute("href", "/planets");
  });

  it("renders a mobile dropdown menu item linking to /planets", () => {
    render(<KidsHeader />);

    // Open mobile menu
    const menuBtn = screen.getByRole("button", { name: "Menu" });
    fireEvent.click(menuBtn);

    const planetLinks = screen.getAllByRole("link").filter(
      (link) => link.getAttribute("href") === "/planets"
    );
    // There should now be at least 2 links to /planets (desktop and mobile)
    expect(planetLinks.length).toBeGreaterThanOrEqual(2);

    const mobileLink = planetLinks.find(
      (link) => link.textContent?.includes("Solar System")
    );
    expect(mobileLink).toBeDefined();
    expect(mobileLink).toHaveAttribute("href", "/planets");
  });
});

describe("ProgressMap Space Portal Banner", () => {
  it("renders a prominent floating portal banner linking to /planets", () => {
    render(<ProgressMap />);

    const portalLink = screen.getByRole("link", { name: /Fly to Solar System/i });
    expect(portalLink).toBeInTheDocument();
    expect(portalLink).toHaveAttribute("href", "/planets");
  });
});
