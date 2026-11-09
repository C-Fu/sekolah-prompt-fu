import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KidsHeader } from "@/components/kids/layout/kids-header";
import { ProgressMap } from "@/components/kids/elements/progress-map";
import * as levelsModule from "@/lib/kids/levels";
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
});
