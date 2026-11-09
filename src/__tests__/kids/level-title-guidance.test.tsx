import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { LevelContentWrapper } from "@/components/kids/layout/level-content-wrapper";
import { LevelProvider, useSectionNavigation } from "@/components/kids/providers/level-context";
import enMessages from "../../../messages/en.json";
import msMessages from "../../../messages/ms.json";

let currentLocale = "en";

vi.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => (key: string, params?: Record<string, unknown>) => {
    const bundle: Record<string, any> = currentLocale === "ms" ? msMessages : enMessages;
    let target: any = namespace ? bundle[namespace] : bundle.kids;
    const parts = key.split(".");
    for (const p of parts) {
      target = target?.[p];
    }
    if (typeof target === "string" && params) {
      return target.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ""));
    }
    return target ?? key;
  },
  useLocale: () => currentLocale,
}));

// Mock Next Link
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

// Mock Level component with Sections
function MockLesson({ components }: { components: Record<string, any> }) {
  const Section = components.Section || "section";
  return (
    <div>
      <Section id="sec-1">
        <h2>First Section Content</h2>
      </Section>
      <Section id="sec-2">
        <h2>Second Section Content</h2>
      </Section>
    </div>
  );
}

function IncompleteFirstProbe() {
  const { currentSection, registerSectionRequirement } = useSectionNavigation();
  useEffect(() => {
    registerSectionRequirement(currentSection);
  }, [currentSection, registerSectionRequirement]);
  return <span>probe</span>;
}

function IncompleteLesson({ components }: { components: Record<string, any> }) {
  const Section = components.Section || "section";
  return (
    <div>
      <Section id="sec-1">
        <h2>Incomplete First Section Content</h2>
        <IncompleteFirstProbe />
      </Section>
      <Section id="sec-2">
        <h2>Second Section Content</h2>
      </Section>
    </div>
  );
}

describe("Active Section Title & Locked State Guidance Integration (Plan 14-09)", () => {
  beforeEach(() => {
    currentLocale = "en";
  });

  it("renders specific section title and step ordinal for 1-1-meet-peromfu in English", async () => {
    const fakeLoader = vi.fn().mockResolvedValue({
      Component: MockLesson,
      effectiveLocale: "en",
    });

    render(
      <LevelProvider>
        <LevelContentWrapper
          levelSlug="1-1-meet-peromfu"
          levelNumber="1.1"
          loadContent={fakeLoader}
        />
      </LevelProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("active-section-context")).toBeInTheDocument();
    });

    // Section 0 in 1-1-meet-peromfu is "Meet Peromfu"
    expect(screen.getByText("Meet Peromfu")).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of/i)).toBeInTheDocument();
  });

  it("switches to localized Bahasa Melayu section title and ordinal", async () => {
    currentLocale = "ms";
    const fakeLoader = vi.fn().mockResolvedValue({
      Component: MockLesson,
      effectiveLocale: "ms",
    });

    render(
      <LevelProvider>
        <LevelContentWrapper
          levelSlug="1-1-meet-peromfu"
          levelNumber="1.1"
          loadContent={fakeLoader}
        />
      </LevelProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("active-section-context")).toBeInTheDocument();
    });

    // BM Section 0 is "Kenali Peromfu"
    expect(screen.getByText("Kenali Peromfu")).toBeInTheDocument();
    expect(screen.getByText(/Langkah 1 daripada/i)).toBeInTheDocument();
  });

  it("loading state shows localized status and no false Next progression or phantom answer controls (E4/E5 loading)", async () => {
    // Loader never resolves during this check to keep it in loading state
    const pendingLoader = vi.fn().mockReturnValue(new Promise(() => {}));

    render(
      <LevelProvider>
        <LevelContentWrapper
          levelSlug="1-1-meet-peromfu"
          levelNumber="1.1"
          loadContent={pendingLoader}
        />
      </LevelProvider>
    );

    const statusEl = screen.getByRole("status");
    expect(statusEl).toBeInTheDocument();
    expect(statusEl).toHaveTextContent("Loading...");

    // No false Next progression or phantom answer buttons in loading state
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
    expect(screen.queryByTestId("active-section-context")).not.toBeInTheDocument();
    expect(screen.queryByText("First Section Content")).not.toBeInTheDocument();
  });

  it("error state displays localized load failure, offers originating-hub return, and preserves saved progress (E5 error)", async () => {
    localStorage.setItem("prompt_fu_test_progress", JSON.stringify({ completed: [0, 1] }));

    const failingLoader = vi.fn().mockRejectedValue(new Error("Network load failure"));

    render(
      <LevelProvider>
        <LevelContentWrapper
          levelSlug="1-1-meet-peromfu"
          levelNumber="1.1"
          loadContent={failingLoader}
        />
      </LevelProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/This lesson could not load/i)).toBeInTheDocument();
    });

    // Originating hub link resolves to default map route
    const returnLink = screen.getByRole("link", { name: /Earth map/i });
    expect(returnLink).toBeInTheDocument();
    expect(returnLink).toHaveAttribute("href", "/map");

    // Saved progress in localStorage remains intact
    expect(localStorage.getItem("prompt_fu_test_progress")).toBe(
      JSON.stringify({ completed: [0, 1] })
    );

    localStorage.removeItem("prompt_fu_test_progress");
  });

  it("active section title and ordinal wrap on opaque backing without truncation (D-04, D-15)", async () => {
    const fakeLoader = vi.fn().mockResolvedValue({
      Component: MockLesson,
      effectiveLocale: "en",
    });

    render(
      <LevelProvider>
        <LevelContentWrapper
          levelSlug="1-1-meet-peromfu"
          levelNumber="1.1"
          loadContent={fakeLoader}
        />
      </LevelProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("active-section-context")).toBeInTheDocument();
    });

    const contextEl = screen.getByTestId("active-section-context");
    // Opaque backing class per D-15
    expect(contextEl.className).toContain("bg-[#0F172A]");
    expect(contextEl.className).toContain("border-2");

    // Title element wraps with break-words and does NOT truncate
    const titleEl = screen.getByText("Meet Peromfu");
    expect(titleEl.className).toContain("break-words");
    expect(titleEl.className).not.toContain("truncate");
  });

  it("footer actions and labels are rendered in English and Bahasa Melayu (D-04, E5 long-text)", async () => {
    // English first
    currentLocale = "en";
    const fakeLoaderEn = vi.fn().mockResolvedValue({
      Component: IncompleteLesson,
      effectiveLocale: "en",
    });

    const { unmount } = render(
      <LevelProvider>
        <LevelContentWrapper
          levelSlug="1-1-meet-peromfu"
          levelNumber="1.1"
          loadContent={fakeLoaderEn}
        />
      </LevelProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Back/i })).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("locked-next-explanation")).toHaveTextContent(
        "Complete the activity first to continue."
      );
    });

    // Verify safe-area and overflow layout styling
    const footer = screen.getByRole("contentinfo");
    expect(footer.className).toContain("shrink-0");
    expect(footer.className).toContain("pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]");

    unmount();

    // Now test Bahasa Melayu
    currentLocale = "ms";
    const fakeLoaderMs = vi.fn().mockResolvedValue({
      Component: IncompleteLesson,
      effectiveLocale: "ms",
    });

    render(
      <LevelProvider>
        <LevelContentWrapper
          levelSlug="1-1-meet-peromfu"
          levelNumber="1.1"
          loadContent={fakeLoaderMs}
        />
      </LevelProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Kembali/i })).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /Seterusnya/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("locked-next-explanation")).toHaveTextContent(
        "Siapkan aktiviti ini dahulu untuk teruskan."
      );
    });
  });
});
