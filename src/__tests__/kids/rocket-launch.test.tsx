import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { PixelRocket } from "@/components/kids/elements/pixel-art";
import { RocketLaunchOverlay } from "@/components/kids/elements/rocket-launch-overlay";

// Mock next/navigation useRouter
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock next-intl translations
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    const messages: Record<string, string> = {
      "rocketLaunch.blastOff": "BLAST OFF!",
      "rocketLaunch.heading": "Destination: Planetary Explorer!",
      "rocketLaunch.subheading": "Leaving Earth to explore subject missions...",
      "rocketLaunch.skip": "Skip Launch",
      "rocketLaunch.launchButton": "Launch Rocket to Space!",
    };
    if (key === "rocketLaunch.countdown") {
      return `${values?.count}...`;
    }
    return messages[key] || key;
  },
}));

describe("PixelRocket sprite", () => {
  it("renders SVG sprite with pixelated rendering style", () => {
    const { container } = render(<PixelRocket className="w-16 h-24" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveStyle({ imageRendering: "pixelated" });
    expect(svg).toHaveClass("w-16", "h-24");
  });

  it("renders thruster flame elements when thrusting is true or by default", () => {
    const { container: activeContainer } = render(<PixelRocket thrusting={true} />);
    const flames = activeContainer.querySelectorAll('[data-testid="rocket-flame"]');
    expect(flames.length).toBeGreaterThan(0);

    const { container: idleContainer } = render(<PixelRocket thrusting={false} />);
    const idleFlames = idleContainer.querySelectorAll('[data-testid="rocket-flame"]');
    expect(idleFlames.length).toBe(0);
  });
});

describe("RocketLaunchOverlay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    pushMock.mockClear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("does not render when isOpen is false", () => {
    render(<RocketLaunchOverlay isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("mounts when isOpen is true, steps through countdown (3 -> 2 -> 1 -> BLAST OFF!), and navigates to /planets", () => {
    render(<RocketLaunchOverlay isOpen={true} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Initial count is 3
    expect(screen.getByTestId("rocket-countdown")).toHaveTextContent("3...");
    expect(screen.getByText("Destination: Planetary Explorer!")).toBeInTheDocument();

    // Advance 1s -> 2
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId("rocket-countdown")).toHaveTextContent("2...");

    // Advance 1s -> 1
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId("rocket-countdown")).toHaveTextContent("1...");

    // Advance 1s -> BLAST OFF!
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId("rocket-blastoff")).toHaveTextContent("BLAST OFF!");

    // Advance 1s -> router.push to destination
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(pushMock).toHaveBeenCalledWith("/planets");
  });

  it("allows navigating to custom destination prop", () => {
    render(<RocketLaunchOverlay isOpen={true} destination="/planets?focus=mars" />);
    // Advance full sequence (3s countdown + 1s liftoff)
    act(() => {
      vi.advanceTimersByTime(1000); // 3 -> 2
    });
    act(() => {
      vi.advanceTimersByTime(1000); // 2 -> 1
    });
    act(() => {
      vi.advanceTimersByTime(1000); // 1 -> 0 (blastoff)
    });
    act(() => {
      vi.advanceTimersByTime(1000); // blastoff -> redirect
    });
    expect(pushMock).toHaveBeenCalledWith("/planets?focus=mars");
  });

  it("supports clicking skip button to immediately navigate", () => {
    const onClose = vi.fn();
    render(<RocketLaunchOverlay isOpen={true} onClose={onClose} />);

    const skipButton = screen.getByRole("button", { name: /Skip Launch/i });
    expect(skipButton).toBeInTheDocument();

    fireEvent.click(skipButton);
    expect(pushMock).toHaveBeenCalledWith("/planets");
    expect(onClose).toHaveBeenCalled();
  });

  it("cleans up active timers when unmounted or closed early (T-11-01)", () => {
    const { unmount } = render(<RocketLaunchOverlay isOpen={true} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    // Unmount mid-countdown
    unmount();
    // Advance further timers
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    // pushMock should not have been called because component unmounted before completion
    expect(pushMock).not.toHaveBeenCalled();
  });
});
