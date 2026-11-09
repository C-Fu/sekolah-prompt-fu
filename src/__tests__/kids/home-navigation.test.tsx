import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KidsHomeContent } from "@/components/kids/layout/kids-home-content";
import * as analyticsModule from "@/lib/analytics";
import enMessages from "../../../messages/en.json";
import msMessages from "../../../messages/ms.json";

// Mock next/link to render anchor tag
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    onClick,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children?: React.ReactNode }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

// Configurable mock for next-intl translations supporting EN and MS bundles
let currentLocale = "en";

vi.mock("next-intl", () => ({
  useTranslations: () => {
    return (key: string) => {
      const bundle: Record<string, any> = currentLocale === "ms" ? msMessages : enMessages;
      const parts = key.split(".");
      let val: any = bundle.kids;
      for (const p of parts) {
        val = val?.[p];
      }
      return val ?? key;
    };
  },
}));

describe("KidsHomeContent Two-Step Title Navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentLocale = "en";
  });

  it("renders Step 1 with learning promise and step indicator, without Back control", () => {
    render(<KidsHomeContent />);

    // Step 1 title & promise
    expect(screen.getByText("Learn to Talk to AI!")).toBeInTheDocument();
    expect(screen.getByText("Learn to write clear prompts through games, stories, and missions.")).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 2")).toBeInTheDocument();

    // Next is visible, Back is absent
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Back/i })).not.toBeInTheDocument();
  });

  it("navigates to Step 2 upon clicking Next and presents exactly two equal destinations", () => {
    render(<KidsHomeContent />);

    const nextBtn = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn);

    // Step indicator updates
    expect(screen.getByText("Step 2 of 2")).toBeInTheDocument();

    // Check two destination links and exact routes
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);

    const earthLink = screen.getByRole("link", { name: /Start learning/i });
    const planetsLink = screen.getByRole("link", { name: /Explore planets/i });

    expect(earthLink).toBeInTheDocument();
    expect(earthLink).toHaveAttribute("href", "/map");
    expect(screen.getByText("Learn the basics of writing prompts on Earth.")).toBeInTheDocument();

    expect(planetsLink).toBeInTheDocument();
    expect(planetsLink).toHaveAttribute("href", "/planets");
    expect(screen.getByText("Visit planets and choose a subject mission.")).toBeInTheDocument();

    // Back control is available on step 2
    const backBtn = screen.getByRole("button", { name: /Back/i });
    expect(backBtn).toBeInTheDocument();

    // No competing third Start CTA
    expect(screen.queryByRole("button", { name: /Next/i })).not.toBeInTheDocument();
  });

  it("can navigate Back from Step 2 to Step 1 without introducing unexpected states", () => {
    render(<KidsHomeContent />);

    const nextBtn = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText("Step 2 of 2")).toBeInTheDocument();

    const backBtn = screen.getByRole("button", { name: /Back/i });
    fireEvent.click(backBtn);

    expect(screen.getByText("Step 1 of 2")).toBeInTheDocument();
    expect(screen.getByText("Learn to write clear prompts through games, stories, and missions.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Back/i })).not.toBeInTheDocument();
  });

  it("renders full Bahasa Melayu copy with canonical UI-SPEC copy on both steps", () => {
    currentLocale = "ms";
    render(<KidsHomeContent />);

    // Step 1 BM
    expect(screen.getByText("Belajar Bercakap dengan AI!")).toBeInTheDocument();
    expect(screen.getByText("Belajar menulis prompt yang jelas melalui permainan, cerita dan misi.")).toBeInTheDocument();
    expect(screen.getByText("Langkah 1 daripada 2")).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: /Seterusnya/i });
    fireEvent.click(nextBtn);

    // Step 2 BM
    expect(screen.getByText("Langkah 2 daripada 2")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Mula belajar/i })).toHaveAttribute("href", "/map");
    expect(screen.getByText("Pelajari asas menulis prompt di Bumi.")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /Terokai planet/i })).toHaveAttribute("href", "/planets");
    expect(screen.getByText("Lawati planet dan pilih misi subjek.")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Kembali/i })).toBeInTheDocument();
  });

  it("triggers analytics events when clicking the destination choices", () => {
    const startGameSpy = vi.spyOn(analyticsModule.analyticsKids, "startGame");
    const exploreSolarSystemSpy = vi.spyOn(analyticsModule.analyticsKids, "exploreSolarSystem");

    render(<KidsHomeContent />);

    const nextBtn = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn);

    const earthLink = screen.getByRole("link", { name: /Start learning/i });
    fireEvent.click(earthLink);
    expect(startGameSpy).toHaveBeenCalledTimes(1);

    const planetsLink = screen.getByRole("link", { name: /Explore planets/i });
    fireEvent.click(planetsLink);
    expect(exploreSolarSystemSpy).toHaveBeenCalledTimes(1);
  });
});
