import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  isTipDismissed,
  dismissTip,
  resetJourneyPreferences,
} from "@/lib/kids/journey-preferences";
import { JourneyTip } from "@/components/kids/elements/journey-tip";
import { ProgressMap } from "@/components/kids/elements/progress-map";
import { PlanetaryExplorer } from "@/components/kids/planets/planetary-explorer";
import * as progressModule from "@/lib/kids/progress";
import enMessages from "../../../messages/en.json";
import msMessages from "../../../messages/ms.json";

// Mock next/link and next/navigation
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

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

let currentLocale = "en";

vi.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    return (key: string, params?: Record<string, unknown>) => {
      const bundle: Record<string, any> = currentLocale === "ms" ? msMessages : enMessages;
      let target: any = bundle;
      const fullPath = namespace ? `${namespace}.${key}` : key;
      const parts = fullPath.split(".");
      for (const p of parts) {
        target = target?.[p];
      }
      if (typeof target === "string" && params) {
        return target.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ""));
      }
      return target ?? key;
    };
  },
  useLocale: () => currentLocale,
}));

// Mock Three.js canvas in planetary explorer
vi.mock("@/components/kids/planets/planetary-canvas", () => ({
  PlanetaryCanvas: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="mock-planetary-canvas">{children}</div>
  ),
}));

describe("Journey Preferences (Unit & Storage Resilience)", () => {
  beforeEach(() => {
    localStorage.clear();
    resetJourneyPreferences();
    currentLocale = "en";
  });

  it("handles map and planets tips independently across reloads", () => {
    expect(isTipDismissed("map")).toBe(false);
    expect(isTipDismissed("planets")).toBe(false);

    dismissTip("map");
    expect(isTipDismissed("map")).toBe(true);
    expect(isTipDismissed("planets")).toBe(false);

    dismissTip("planets");
    expect(isTipDismissed("planets")).toBe(true);
  });

  it("gracefully recovers from malformed localStorage JSON and shows tip without throwing", () => {
    localStorage.setItem("kids-journey-preferences", "{ invalid json / corrupt syntax");
    expect(isTipDismissed("map")).toBe(false);

    // Can dismiss safely and rewrite valid JSON
    dismissTip("map");
    expect(isTipDismissed("map")).toBe(true);
  });

  it("does not mutate kids-progress when dismissing tips", () => {
    localStorage.setItem("kids-progress", JSON.stringify({ totalStars: 10, levels: {} }));

    dismissTip("map");
    dismissTip("planets");

    const progressRaw = localStorage.getItem("kids-progress");
    expect(JSON.parse(progressRaw!)).toEqual({ totalStars: 10, levels: {} });
  });
});

describe("JourneyTip Component", () => {
  beforeEach(() => {
    localStorage.clear();
    resetJourneyPreferences();
  });

  it("renders message and button when not dismissed, and hides upon clicking Got it", () => {
    render(
      <JourneyTip
        screenId="map"
        message="Choose a level on the map to start learning."
        dismissLabel="Got it"
      />
    );

    expect(screen.getByText("Choose a level on the map to start learning.")).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Got it" });
    fireEvent.click(btn);

    expect(screen.queryByText("Choose a level on the map to start learning.")).not.toBeInTheDocument();
    expect(isTipDismissed("map")).toBe(true);
  });
});

describe("Hub Surface Integrations (ProgressMap and PlanetaryExplorer)", () => {
  beforeEach(() => {
    localStorage.clear();
    resetJourneyPreferences();
    currentLocale = "en";
  });

  it("renders localized map tip in EN, and dismisses without hiding planets tip", () => {
    const { unmount } = render(<ProgressMap />);

    expect(screen.getByText("Choose a level on the map to start learning.")).toBeInTheDocument();
    const dismissBtn = screen.getByRole("button", { name: "Got it" });
    fireEvent.click(dismissBtn);

    expect(screen.queryByText("Choose a level on the map to start learning.")).not.toBeInTheDocument();
    expect(isTipDismissed("map")).toBe(true);
    expect(isTipDismissed("planets")).toBe(false);
    unmount();

    // Now render PlanetaryExplorer and verify planets tip is STILL visible
    render(<PlanetaryExplorer />);
    expect(screen.getByText("Choose a planet to explore its subject missions.")).toBeInTheDocument();
  });

  it("renders localized tip in Bahasa Melayu on both surfaces", () => {
    currentLocale = "ms";
    const { unmount } = render(<ProgressMap />);

    expect(screen.getByText("Pilih satu tahap pada peta untuk mula belajar.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Faham" })).toBeInTheDocument();
    unmount();

    render(<PlanetaryExplorer />);
    expect(screen.getByText("Pilih planet untuk menerokai misi subjeknya.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Faham" })).toBeInTheDocument();
  });
});
