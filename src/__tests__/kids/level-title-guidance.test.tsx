import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { LevelContentWrapper } from "@/components/kids/layout/level-content-wrapper";
import { LevelProvider } from "@/components/kids/providers/level-context";
import enMessages from "../../../messages/en.json";
import msMessages from "../../../messages/ms.json";

let currentLocale = "en";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    const bundle: Record<string, any> = currentLocale === "ms" ? msMessages : enMessages;
    let target: any = bundle.kids;
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
});
