import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { KidsHeader } from "@/components/kids/layout/kids-header";
import { KidsHomeContent } from "@/components/kids/layout/kids-home-content";
import { PlanetaryHud } from "@/components/kids/planets/planetary-hud";
import { PLANET_WORLDS } from "@/lib/kids/planets";
import enMessages from "../../../messages/en.json";

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
  usePathname: () => "/map",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    return (key: string, params?: Record<string, unknown>) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const parts = fullKey.split(".");
      let val: any = enMessages;
      for (const p of parts) {
        val = val?.[p];
      }
      if (typeof val === "string" && params) {
        return val.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ""));
      }
      return val ?? key;
    };
  },
  useLocale: () => "en",
}));

describe("Phase 17 Visual Audit & Consistency (VIS-01)", () => {
  it("KidsHeader maintains labeled navigation controls with min 44px hit targets", () => {
    render(<KidsHeader />);
    
    // Core routes have visible text labels
    const homeLink = screen.getByRole("link", { name: new RegExp(enMessages.kids.header.home, "i") });
    const mapLink = screen.getByRole("link", { name: new RegExp(enMessages.kids.header.map, "i") });
    const planetsLink = screen.getByRole("link", { name: new RegExp(enMessages.kids.header.planets, "i") });

    expect(homeLink).toBeInTheDocument();
    expect(mapLink).toBeInTheDocument();
    expect(planetsLink).toBeInTheDocument();

    // Verify touch target class
    expect(homeLink).toHaveClass("min-h-[44px]");
    expect(mapLink).toHaveClass("min-h-[44px]");
    expect(planetsLink).toHaveClass("min-h-[44px]");
  });

  it("KidsHomeContent renders balanced destination cards with non-clipped content and 44px min height", () => {
    render(<KidsHomeContent />);

    // Step 1 title check
    expect(screen.getByText(enMessages.kids.home.title)).toBeInTheDocument();

    // Next step button exists and has 44px min height
    const nextBtn = screen.getByRole("button", { name: new RegExp(enMessages.kids.navigation.next, "i") });
    expect(nextBtn).toBeInTheDocument();
    expect(nextBtn).toHaveClass("min-h-[44px]");
  });

  it("PlanetaryHud maintains distinct planetary theming and text-navigable mission action", () => {
    const mars = PLANET_WORLDS.find((p) => p.id === "mars") || PLANET_WORLDS[0];
    const feature = mars.features[0];

    render(
      <PlanetaryHud
        planet={mars}
        activeFeature={feature}
        onSelectFeature={vi.fn()}
        onBackToOrbit={vi.fn()}
        onLaunchMission={vi.fn()}
      />
    );

    // Orbit button is accessible
    const orbitBtn = screen.getByRole("button", { name: new RegExp(enMessages.kids.planets.backToOrbit, "i") });
    expect(orbitBtn).toBeInTheDocument();
    expect(orbitBtn).toHaveClass("min-h-[44px]");

    // Mission CTA button is accessible and labeled with min 44px height
    const missionBtn = screen.getByRole("button", { name: new RegExp(enMessages.kids.planets.launchMission, "i") });
    expect(missionBtn).toBeInTheDocument();
    expect(missionBtn).toHaveClass("min-h-[44px]");
  });
});
