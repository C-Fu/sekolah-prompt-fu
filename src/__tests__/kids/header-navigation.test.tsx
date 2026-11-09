import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KidsHeader } from "@/components/kids/layout/kids-header";
import { ProgressMap } from "@/components/kids/elements/progress-map";
import * as levelsModule from "@/lib/kids/levels";
import * as progressModule from "@/lib/kids/progress";
import enMessages from "../../../messages/en.json";
import msMessages from "../../../messages/ms.json";

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

let currentLocale = "en";

vi.mock("next-intl", () => ({
  useTranslations: () => {
    return (key: string, params?: Record<string, unknown>) => {
      const bundle: Record<string, any> = currentLocale === "ms" ? msMessages : enMessages;
      const parts = key.split(".");
      let val: any = bundle.kids;
      for (const p of parts) {
        val = val?.[p];
      }
      if (typeof val === "string" && params) {
        return val.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ""));
      }
      return val ?? key;
    };
  },
  useLocale: () => currentLocale,
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

describe("KidsHeader Visible Route Navigation (D-06)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentLocale = "en";
  });

  it("renders visible BM and EN text labels alongside icons on desktop with single Home destination per group", () => {
    render(<KidsHeader />);

    // In English
    const desktopHomeLink = screen.getByRole("link", { name: /^Home$/i });
    const desktopMapLink = screen.getByRole("link", { name: /^Earth map$/i });
    const desktopPlanetsLink = screen.getByRole("link", { name: /^Solar System$/i });

    expect(desktopHomeLink).toBeInTheDocument();
    expect(desktopHomeLink).toHaveAttribute("href", "/");
    expect(desktopMapLink).toBeInTheDocument();
    expect(desktopMapLink).toHaveAttribute("href", "/map");
    expect(desktopPlanetsLink).toBeInTheDocument();
    expect(desktopPlanetsLink).toHaveAttribute("href", "/planets");

    // Check no duplicate Home links in the nav group
    // In desktop nav, only one "/" link exists (excluding logo)
    const links = screen.getAllByRole("link");
    const slashLinks = links.filter((l) => l.getAttribute("href") === "/");
    // Logo + 1 desktop home nav item = 2 total
    expect(slashLinks).toHaveLength(2);
  });

  it("renders localized mobile navigation menu with open/close accessible names", () => {
    render(<KidsHeader />);

    const menuBtn = screen.getByRole("button", { name: "Open menu" });
    expect(menuBtn).toBeInTheDocument();

    fireEvent.click(menuBtn);
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();

    // Mobile menu items
    const mobileLinks = screen.getAllByRole("link");
    const mobileHome = mobileLinks.find((l) => l.textContent?.includes("Home") && l.getAttribute("href") === "/");
    const mobileMap = mobileLinks.find((l) => l.textContent?.includes("Earth map") && l.getAttribute("href") === "/map");
    const mobilePlanets = mobileLinks.find((l) => l.textContent?.includes("Solar System") && l.getAttribute("href") === "/planets");

    expect(mobileHome).toBeDefined();
    expect(mobileMap).toBeDefined();
    expect(mobilePlanets).toBeDefined();
  });

  it("switches to full Bahasa Melayu labels for desktop and mobile navigation", () => {
    currentLocale = "ms";
    render(<KidsHeader />);

    expect(screen.getByRole("link", { name: /^Utama$/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /^Peta Bumi$/i })).toHaveAttribute("href", "/map");
    expect(screen.getByRole("link", { name: /^Sistem Suria$/i })).toHaveAttribute("href", "/planets");

    const menuBtn = screen.getByRole("button", { name: "Buka menu" });
    fireEvent.click(menuBtn);
    expect(screen.getByRole("button", { name: "Tutup menu" })).toBeInTheDocument();
  });

  it("manages keyboard operability with aria-expanded and Escape key dismissal", () => {
    render(<KidsHeader />);

    const menuBtn = screen.getByRole("button", { name: "Open menu" });
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");
    expect(menuBtn).toHaveAttribute("aria-haspopup", "true");

    // Open menu via click (or keyboard activation)
    fireEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();

    // Escape closes the menu and returns focus
    fireEvent.keyDown(document, { key: "Escape" });
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("button", { name: "Close menu" })).not.toBeInTheDocument();
  });

  it("preserves named routes when progress reading throws an exception (E2 error/loading)", () => {
    const starsSpy = vi.spyOn(progressModule, "getTotalStars").mockImplementation(() => {
      throw new Error("Simulated storage read error");
    });

    render(<KidsHeader />);

    // Named routes must remain present and functional
    expect(screen.getByRole("link", { name: /^Home$/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /^Earth map$/i })).toHaveAttribute("href", "/map");
    expect(screen.getByRole("link", { name: /^Solar System$/i })).toHaveAttribute("href", "/planets");

    starsSpy.mockRestore();
  });

  it("ensures menu trigger and nav actions meet minimum 44px hitboxes (D-13)", () => {
    render(<KidsHeader />);

    const menuBtn = screen.getByRole("button", { name: "Open menu" });
    expect(menuBtn.className).toContain("min-h-[44px]");
    expect(menuBtn.className).toContain("min-w-[44px]");

    const desktopHome = screen.getByRole("link", { name: /^Home$/i });
    expect(desktopHome.className).toContain("min-h-[44px]");

    // Open mobile menu to verify mobile links
    fireEvent.click(menuBtn);
    const mobileLinks = screen.getAllByRole("link");
    const mobileHome = mobileLinks.find((l) => l.textContent?.includes("Home") && l.getAttribute("href") === "/");
    expect(mobileHome?.className).toContain("min-h-[44px]");
  });
});

describe("ProgressMap Hub Navigation and Empty State", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentLocale = "en";
  });

  it("renders the floating portal banner to /planets with localized text", () => {
    render(<ProgressMap />);

    const portalLink = screen.getByRole("link", { name: /Fly to Solar System/i });
    expect(portalLink).toBeInTheDocument();
    expect(portalLink).toHaveAttribute("href", "/planets");
  });

  it("renders empty state with Planets alternative when no levels are present", () => {
    const spy = vi.spyOn(levelsModule, "getEarthLevels").mockReturnValue([]);

    render(<ProgressMap />);

    expect(screen.getByText("No levels here yet")).toBeInTheDocument();
    expect(screen.getByText("No levels are available yet. Explore the planets instead.")).toBeInTheDocument();

    const planetsLink = screen.getByRole("link", { name: /Explore planets/i });
    expect(planetsLink).toHaveAttribute("href", "/planets");

    spy.mockRestore();
  });

  it("provides a keyboard-scrollable local region and accessible scroll controls with minimum hitboxes (E2 overflow/touch targets)", () => {
    render(<ProgressMap />);

    // Local scroll region must advertise role and label, and be keyboard scrollable
    const scrollRegion = screen.getByRole("region", { name: "Earth map scroll area" });
    expect(scrollRegion).toBeInTheDocument();
    expect(scrollRegion).toHaveAttribute("tabindex", "0");

    // Keyboard scrolling via Arrow keys
    fireEvent.keyDown(scrollRegion, { key: "ArrowRight" });
    fireEvent.keyDown(scrollRegion, { key: "ArrowLeft" });

    // Left and Right controls with min 44px hitboxes
    const leftBtn = screen.getByRole("button", { name: "Scroll left" });
    const rightBtn = screen.getByRole("button", { name: "Scroll right" });
    expect(leftBtn.className).toContain("min-h-[44px]");
    expect(leftBtn.className).toContain("min-w-[44px]");
    expect(rightBtn.className).toContain("min-h-[44px]");
    expect(rightBtn.className).toContain("min-w-[44px]");

    // Portal link has min 44px hitbox
    const portalLink = screen.getByRole("link", { name: /Fly to Solar System/i });
    expect(portalLink.className).toContain("min-h-[44px]");
  });

  it("exposes named level links for unlocked nodes and keeps locked nodes non-activating with buildLessonUrl (E2 zero/one/many)", () => {
    // Test 1: Single unlocked level (zero completed, one unlocked)
    const unlockSpy = vi.spyOn(progressModule, "isLevelUnlocked").mockImplementation((slug) => slug === "1-1-meet-peromfu");

    render(<ProgressMap />);

    // Level 1-1 is unlocked and reachable via buildLessonUrl with map origin
    const unlockedLink = screen.getByRole("link", { name: /Meet Peromfu/i });
    expect(unlockedLink).toBeInTheDocument();
    expect(unlockedLink).toHaveAttribute("href", "/level/1-1-meet-peromfu?origin=map");
    expect(unlockedLink.className).toContain("min-h-[44px]");

    // Level 1-2 is locked, so no link exists for it
    expect(screen.queryByRole("link", { name: /Peromfu's First Words/i })).not.toBeInTheDocument();
    // But its title text remains visible
    expect(screen.getByText("Peromfu's First Words")).toBeInTheDocument();

    // Test 2: Multiple unlocked levels
    unlockSpy.mockImplementation((slug) => slug === "1-1-meet-peromfu" || slug === "1-2-first-words");
    const { unmount } = render(<ProgressMap />);
    const link1 = screen.getAllByRole("link", { name: /Meet Peromfu/i })[0];
    const link2 = screen.getByRole("link", { name: /Peromfu's First Words/i });
    expect(link1).toHaveAttribute("href", "/level/1-1-meet-peromfu?origin=map");
    expect(link2).toHaveAttribute("href", "/level/1-2-first-words?origin=map");

    unmount();
    unlockSpy.mockRestore();
  });

  it("renders full Bahasa Melayu labels across map controls, portal banner, and level titles (E2 long-text/BM)", () => {
    currentLocale = "ms";
    render(<ProgressMap />);

    // BM portal banner
    expect(screen.getByRole("link", { name: /Terbang ke Sistem Suria/i })).toHaveAttribute("href", "/planets");

    // BM local scroll region
    expect(screen.getByRole("region", { name: "Kawasan tatal peta Bumi" })).toBeInTheDocument();

    // BM scroll controls
    expect(screen.getByRole("button", { name: "Tatal kiri" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tatal kanan" })).toBeInTheDocument();

    // BM unlocked level title
    expect(screen.getByRole("link", { name: /Berjumpa Peromfu/i })).toHaveAttribute("href", "/level/1-1-meet-peromfu?origin=map");
  });
});
