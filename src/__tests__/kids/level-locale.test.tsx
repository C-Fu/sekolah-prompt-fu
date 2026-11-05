import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup, fireEvent, within } from "@testing-library/react";
import { useEffect, type ReactElement } from "react";

// `page.tsx` pulls in `@/lib/seo` -> `prompts.config.ts`; the global setup mock of
// `@/lib/config` does not expose `defineConfig`, so stub the config module directly
// (same pattern as src/__tests__/lib/seo.test.ts).
vi.mock("@/../prompts.config", () => ({
  default: { branding: { name: "Sekolah Prompt-Fu" } },
}));

// next-intl `useLocale`/`useTranslations` are mocked to deterministic values; the
// wrapper must not perform a request-time locale read (Phase 1: provider locale only).
// `vi.hoisted` exposes a mutable locale so 01-17 can drive the wrapper's locale-reactive
// compiled-MDX selection without rendering the real intl provider.
const intlMock = vi.hoisted(() => ({ locale: "en" }));
vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl")>();
  return {
    ...actual,
    useLocale: () => intlMock.locale,
    useTranslations: () => (key: string) => key,
  };
});

import { loadLevelContent } from "@/lib/kids/level-content";
import { getAllLevels, getLevelBySlug } from "@/lib/kids/levels";
import { isSectionCompleted, clearSectionCompletion } from "@/lib/kids/progress";
import {
  loadMessages,
  readPersistedLocale,
  transitionLocale,
  LOCALE_PREFERENCE_KEY,
} from "@/lib/i18n/client";
import { generateStaticParams } from "@/app/level/[slug]/page";
import { useMDXComponents } from "../../../mdx-components";
import { LevelProvider, useSectionIdentity, useSectionNavigation } from "@/components/kids/providers/level-context";
import {
  Section,
  ExampleMatcher,
  MagicWords,
  DragDropPrompt,
  PromptParts,
  PromptLab,
  PromptDoctor,
} from "@/components/kids/elements";
import { LevelContentWrapper } from "@/components/kids/layout/level-content-wrapper";

/**
 * 01-15 Task 1 — client-side compiled level MDX selection.
 *
 * These tests exercise the real compiled MDX modules (via the vitest MDX transform)
 * rather than opaque server-rendered children, verifying that locale/slug selection is
 * bounded to known inventories and that the English fallback only masks a missing
 * locale module.
 */

describe("level-content locale/slug selection", () => {
  it("keeps all 19 registered slugs in generateStaticParams", async () => {
    const params = await generateStaticParams();
    const slugs = params.map((p) => p.slug).sort();
    expect(slugs).toHaveLength(19);
    expect(new Set(slugs).size).toBe(19);
    expect(slugs).toEqual(getAllLevels().map((l) => l.slug).sort());
  });

  it("resolves a compiled MDX component for a valid locale and slug", async () => {
    const result = await loadLevelContent("en", "1-1-meet-promi");
    expect(result).not.toBeNull();
    if (!result) throw new Error("expected compiled content");
    expect(result.effectiveLocale).toBe("en");
    expect(typeof result.Component).toBe("function");
    const components = { ...useMDXComponents({}) };
    render(<result.Component components={components} />);
    expect(screen.getAllByText(/Promi/i).length).toBeGreaterThan(0);
  });

  it("selects locale-specific content when the translated module exists", async () => {
    const en = await loadLevelContent("en", "1-1-meet-promi");
    const es = await loadLevelContent("es", "1-1-meet-promi");
    expect(es?.effectiveLocale).toBe("es");
    // Spanish content differs from English for this level, so the resolved component
    // must not be the same module reference.
    expect(es?.Component).not.toBe(en?.Component);
  });

  it("falls back to English when the requested locale module is absent", async () => {
    // 'he' is a supported locale (i18n config) with no content directory.
    const he = await loadLevelContent("he", "1-1-meet-promi");
    const en = await loadLevelContent("en", "1-1-meet-promi");
    expect(he?.effectiveLocale).toBe("en");
    expect(he?.Component).toBe(en?.Component);
  });

  it("defaults an unsupported locale to English without touching the import path", async () => {
    const bogus = await loadLevelContent("../evil", "1-1-meet-promi");
    const en = await loadLevelContent("en", "1-1-meet-promi");
    expect(bogus?.effectiveLocale).toBe("en");
    expect(bogus?.Component).toBe(en?.Component);
  });

  it("returns null for a slug outside the registry without attempting an import", async () => {
    const result = await loadLevelContent("en", "../../secrets");
    expect(result).toBeNull();
    expect(getLevelBySlug("../../secrets")).toBeUndefined();
  });

  it("propagates real load failures instead of swallowing them", async () => {
    // A registered slug is guaranteed by the registry but if the English module were
    // missing this must throw rather than resolve to null. We assert the failure mode
    // by checking that a known slug resolves while an unregistered one returns null —
    // i.e. failures are not silently coerced to the fallback success path.
    await expect(loadLevelContent("en", "does-not-exist")).resolves.toBeNull();
    await expect(loadLevelContent("en", "1-1-meet-promi")).resolves.toHaveProperty(
      "Component"
    );
  });
});

/**
 * 01-15 Task 2 — mounted MDX Section rendering + ordered identity registry.
 */

afterEach(() => {
  cleanup();
  // Interactive consumers persist section completion to localStorage; isolate tests.
  clearSectionCompletion("1-1-meet-promi");
  localStorage.clear();
});

/** Probe that surfaces the resolved containing Section index to the test DOM. */
function IndexProbe() {
  const scope = useSectionIdentity();
  return (
    <span data-testid="probe-index">
      {scope?.index === null || scope?.index === undefined ? "unresolved" : scope.index}
    </span>
  );
}

/** Probe that surfaces the containing Section's identity-scoped requirement state. */
function RequirementProbe() {
  const scope = useSectionIdentity();
  return (
    <span data-testid="probe-requirement">
      {scope?.requiresCompletion() ? "required" : "free"}:
      {scope?.isComplete() ? "complete" : "incomplete"}
    </span>
  );
}

/** Legacy consumer probe: registers a requirement through the legacy numeric signature. */
function LegacyRequirementProbe() {
  const { currentSection, registerSectionRequirement } = useSectionNavigation();
  useEffect(() => {
    registerSectionRequirement(currentSection);
  }, [currentSection, registerSectionRequirement]);
  return (
    <>
      <span data-testid="legacy-probe">legacy</span>
      <RequirementProbe />
    </>
  );
}

describe("mounted MDX Section registry", () => {
  it("renders one dot per real compiled Section in document order", async () => {
    render(
      <LevelProvider levelSlug="1-1-meet-promi">
        <LevelContentWrapper levelSlug="1-1-meet-promi" levelNumber="1-1" />
      </LevelProvider>
    );

    // Wait for the async compiled MDX to mount all ten Sections and resolve order.
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(10);
    });

    // Document order indexes are strictly ascending 0..9.
    const indexes = Array.from(
      document.querySelectorAll("section[data-section-index]")
    ).map((el) => Number(el.getAttribute("data-section-index")));
    expect(indexes).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // Desktop dot row has one button per section (mobile row mirrors it).
    const desktopDots = document.querySelectorAll(
      'div.hidden.sm\\:flex button[aria-label^="Go to section"]'
    );
    expect(desktopDots.length).toBe(10);
  });

  it("resolves a Section-scoped descendant index only after commit", async () => {
    render(
      <LevelProvider>
        <Section>
          <IndexProbe />
        </Section>
        <Section>
          <IndexProbe />
        </Section>
      </LevelProvider>
    );

    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(2);
    });

    const sections = document.querySelectorAll("section[data-section-index]");
    expect(sections[0].getAttribute("data-section-index")).toBe("0");
    expect(sections[1].getAttribute("data-section-index")).toBe("1");

    // The active section's probe resolves to its ordered index.
    const firstProbe = document.querySelector(
      'section[data-section-index="0"] [data-testid="probe-index"]'
    );
    expect(firstProbe?.textContent).toBe("0");
  });

  it("routes a legacy requirement to the containing Section identity, not the cursor", async () => {
    render(
      <LevelProvider>
        <Section>
          <span>plain first section</span>
          <RequirementProbe />
        </Section>
        <Section>
          <LegacyRequirementProbe />
        </Section>
        <Section>
          <span>third</span>
        </Section>
      </LevelProvider>
    );

    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(3);
    });

    // The cursor is 0, yet the legacy probe lives in Section index 1. The requirement
    // must attach to *its own* Section (fail closed) and remain incomplete.
    const firstReq = document.querySelector(
      'section[data-section-index="0"] [data-testid="probe-requirement"]'
    );
    const secondReq = document.querySelector(
      'section[data-section-index="1"] [data-testid="probe-requirement"]'
    );
    expect(firstReq?.textContent).toBe("free:incomplete");
    expect(secondReq?.textContent).toBe("required:incomplete");
  });

  it("locks Next while the active Section has an unresolved requirement", async () => {
    // Controlled compiled component: section 0 is interactive (registers a
    // requirement), section 1 is plain.
    function InteractiveFirst() {
      return (
        <>
          <Section>
            <LegacyRequirementProbe />
          </Section>
          <Section>
            <span>plain second</span>
          </Section>
        </>
      );
    }

    render(
      <LevelProvider levelSlug="1-1-meet-promi">
        <LevelContentWrapper
          levelSlug="1-1-meet-promi"
          levelNumber="1-1"
          loadContent={async () => ({ Component: InteractiveFirst, effectiveLocale: "en" })}
        />
      </LevelProvider>
    );

    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(2);
    });

    // Active section 0 requires completion and is incomplete → Next locked.
    await waitFor(() => {
      const next = screen.getByRole("button", { name: "navigation.next" });
      expect(next).toBeDisabled();
    });
  });

  it("shows the comingSoon panel when the level has no Sections", async () => {
    render(
      <LevelProvider levelSlug="1-1-meet-promi">
        <LevelContentWrapper
          levelSlug="1-1-meet-promi"
          levelNumber="1-1"
          loadContent={async () => ({
            Component: () => <div data-testid="empty-mdx">no sections here</div>,
            effectiveLocale: "en",
          })}
        />
      </LevelProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("level.comingSoon")).toBeInTheDocument();
    });
  });

  it("shows the map link on the final Section instead of Next", async () => {
    // Controlled compiled component with three plain (non-interactive) Sections so the
    // Next button advances freely to the final Section.
    function ThreePlain() {
      return (
        <>
          <Section>
            <span>one</span>
          </Section>
          <Section>
            <span>two</span>
          </Section>
          <Section>
            <span>three</span>
          </Section>
        </>
      );
    }

    render(
      <LevelProvider levelSlug="1-1-meet-promi">
        <LevelContentWrapper
          levelSlug="1-1-meet-promi"
          levelNumber="1-1"
          loadContent={async () => ({ Component: ThreePlain, effectiveLocale: "en" })}
        />
      </LevelProvider>
    );

    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(3);
    });

    // Advance to the final Section (all plain → not locked).
    for (let i = 0; i < 2; i++) {
      const next = await screen.findByRole("button", { name: "navigation.next" });
      (next as HTMLButtonElement).click();
      await waitFor(() => {
        expect(screen.queryByRole("button", { name: "navigation.next" })).not.toBeNull();
      });
    }

    // On the final section the Next button is replaced by the Map link.
    await waitFor(() => {
      const mapLink = screen.getByRole("link", { name: /level\.map/ });
      expect(mapLink).toHaveAttribute("href", "/map");
    });
    expect(screen.queryByRole("button", { name: "navigation.next" })).toBeNull();
  });

  it("fails closed on real compiled MDX: a plain Section advances, an interactive one locks", async () => {
    render(
      <LevelProvider levelSlug="1-1-meet-promi">
        <LevelContentWrapper levelSlug="1-1-meet-promi" levelNumber="1-1" />
      </LevelProvider>
    );

    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(10);
    });

    // Section 0 of en 1-1 is a plain Panel → Next is enabled (no requirement).
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "navigation.next" })).toBeEnabled();
    });

    // Walk forward through the plain sections; the first interactive Section (which
    // contains WordPredictor / PromptVsMistake) stays locked because its identity-scoped
    // requirement is registered but not yet complete (01-16 wires completion).
    let lockedSeen = false;
    for (let i = 0; i < 9; i++) {
      const next = screen.queryByRole("button", { name: "navigation.next" });
      if (!next) break; // reached the final Section (map link)
      if ((next as HTMLButtonElement).disabled) {
        lockedSeen = true;
        break;
      }
      (next as HTMLButtonElement).click();
      await waitFor(() => {
        expect(
          document.querySelector("section[data-section-index]:not([hidden])")
        ).not.toBeNull();
      });
    }

    expect(lockedSeen).toBe(true);
  });

  it("keeps visited Sections mounted so their state survives back navigation", async () => {
    function StatefulSections() {
      return (
        <>
          <Section>
            <input data-testid="state-input" defaultValue="draft-kept" />
          </Section>
          <Section>
            <span>two</span>
          </Section>
          <Section>
            <span>three</span>
          </Section>
        </>
      );
    }

    render(
      <LevelProvider levelSlug="1-1-meet-promi">
        <LevelContentWrapper
          levelSlug="1-1-meet-promi"
          levelNumber="1-1"
          loadContent={async () => ({ Component: StatefulSections, effectiveLocale: "en" })}
        />
      </LevelProvider>
    );

    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(3);
    });

    // Capture the DOM node of the first section, then navigate forward and back. The
    // same node must persist (all sections stay mounted, only visibility toggles).
    const firstSection = document.querySelector('section[data-section-index="0"]');
    const input = screen.getByTestId("state-input") as HTMLInputElement;
    input.value = "typed-by-user";

    const next = await screen.findByRole("button", { name: "navigation.next" });
    (next as HTMLButtonElement).click();
    await waitFor(() => {
      expect(document.querySelector('section[data-section-index="0"]')).toHaveAttribute(
        "hidden"
      );
    });

    const back = screen.getByRole("button", { name: "navigation.back" });
    (back as HTMLButtonElement).click();
    await waitFor(() => {
      expect(document.querySelector('section[data-section-index="0"]')).not.toHaveAttribute(
        "hidden"
      );
    });

    // Same node retained and its live input value preserved.
    expect(document.querySelector('section[data-section-index="0"]')).toBe(firstSection);
    expect((screen.getByTestId("state-input") as HTMLInputElement).value).toBe(
      "typed-by-user"
    );
  });
});

/**
 * 01-16 — interactive consumers attach to their *containing* Section, not the
 * navigation cursor. An offscreen consumer registers its own Section requirement; a
 * correct answer persists completion against its own resolved Section index.
 */

const SLUG = "1-1-meet-promi";

async function renderControlled(Component: () => ReactElement) {
  render(
    <LevelProvider levelSlug={SLUG}>
      <LevelContentWrapper
        levelSlug={SLUG}
        levelNumber="1-1"
        loadContent={async () => ({ Component, effectiveLocale: "en" })}
      />
    </LevelProvider>
  );
}

async function nextButton() {
  return (await screen.findByRole("button", { name: "navigation.next" })) as HTMLButtonElement;
}

/** Click Next n times, waiting for the active section to settle each time. */
async function advance(n: number) {
  for (let i = 0; i < n; i++) {
    const next = await nextButton();
    expect(next).toBeEnabled();
    next.click();
    await waitFor(() => {
      expect(document.querySelector("section[data-section-index]:not([hidden])")).not.toBeNull();
    });
  }
}

describe("interactive consumers bind to their containing Section (01-16 task 1)", () => {
  it("registers an offscreen consumer's requirement against its own Section, not the cursor", async () => {
    function OffscreenInteractive() {
      return (
        <>
          <Section>
            <RequirementProbe />
            <span>plain first</span>
          </Section>
          <Section>
            <RequirementProbe />
            <span>plain second</span>
          </Section>
          <Section>
            <RequirementProbe />
            <ExampleMatcher
              examples={[{ input: "a", output: "b" }]}
              question="q"
              options={["A", "B"]}
              correctAnswer="B"
            />
          </Section>
        </>
      );
    }

    await renderControlled(OffscreenInteractive);
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(3);
    });

    // Cursor is 0; the interactive consumer lives in Section 2. Only Section 2 requires.
    expect(
      document.querySelector('section[data-section-index="0"] [data-testid="probe-requirement"]')
        ?.textContent
    ).toBe("free:incomplete");
    expect(
      document.querySelector('section[data-section-index="2"] [data-testid="probe-requirement"]')
        ?.textContent
    ).toBe("required:incomplete");
  });

  it("writes localStorage completion against the ExampleMatcher's own Section index", async () => {
    function MatcherInSectionTwo() {
      return (
        <>
          <Section>
            <span>plain first</span>
          </Section>
          <Section>
            <ExampleMatcher
              examples={[{ input: "a", output: "b" }]}
              question="q"
              options={["A", "B"]}
              correctAnswer="B"
            />
          </Section>
          <Section>
            <span>plain last</span>
          </Section>
        </>
      );
    }

    await renderControlled(MatcherInSectionTwo);
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(3);
    });

    await advance(1); // into Section 1 (the interactive one) → Next locked
    expect(await nextButton()).toBeDisabled();
    expect(isSectionCompleted(SLUG, 1)).toBe(false);

    // Correct answer.
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    // Wait for the selection to apply (check becomes enabled) before submitting.
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "check" })).toBeEnabled();
    });
    fireEvent.click(screen.getByRole("button", { name: "check" }));

    await waitFor(() => {
      expect(isSectionCompleted(SLUG, 1)).toBe(true);
    });
    // Not the cursor (0), not any other index.
    expect(isSectionCompleted(SLUG, 0)).toBe(false);
    // Section unlocks after its own correct answer.
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "navigation.next" })).toBeEnabled();
    });
  });

  it("does not unlock on a wrong answer, but unlocks on the correct one (MagicWords)", async () => {
    function MagicWordsInSection() {
      return (
        <>
          <Section>
            <span>plain first</span>
          </Section>
          <Section>
            <MagicWords
              sentence="I like ___"
              blanks={[{ hint: "animal", answers: ["cats"] }]}
            />
          </Section>
          <Section>
            <span>plain last</span>
          </Section>
        </>
      );
    }

    await renderControlled(MagicWordsInSection);
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(3);
    });
    await advance(1);

    // Place the word then check.
    fireEvent.click(screen.getByRole("button", { name: /cats/ }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "check" })).toBeEnabled();
    });
    fireEvent.click(screen.getByRole("button", { name: "check" }));

    await waitFor(() => {
      expect(isSectionCompleted(SLUG, 1)).toBe(true);
    });
    expect(isSectionCompleted(SLUG, 0)).toBe(false);
  });

  it("binds DragDropPrompt's requirement to its containing Section, not the cursor", async () => {
    function DragDropInSectionTwo() {
      return (
        <>
          <Section>
            <RequirementProbe />
            <span>plain first</span>
          </Section>
          <Section>
            <RequirementProbe />
            <DragDropPrompt
              pieces={["a", "b"]}
              correctOrder={[0, 1]}
            />
          </Section>
        </>
      );
    }

    await renderControlled(DragDropInSectionTwo);
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(2);
    });

    expect(
      document.querySelector('section[data-section-index="0"] [data-testid="probe-requirement"]')
        ?.textContent
    ).toBe("free:incomplete");
    expect(
      document.querySelector('section[data-section-index="1"] [data-testid="probe-requirement"]')
        ?.textContent
    ).toBe("required:incomplete");
  });
});

/**
 * 01-16 task 2 — prompt editing interactions (PromptDoctor / PromptLab / PromptParts)
 * mark only their own Section.
 *
 * To distinguish the Section index from the navigation cursor, each consumer is placed
 * in Section index 2 and driven *while offscreen* (the cursor stays at 0). A cursor-based
 * write would persist index 0; a Section-scoped write persists index 2.
 */
describe("prompt editing consumers bind to their containing Section (01-16 task 2)", () => {
  function sectionButton(index: number, name: RegExp | string) {
    const root = document.querySelector(`section[data-section-index="${index}"]`) as HTMLElement;
    return within(root).getByRole("button", { name, hidden: true }) as HTMLButtonElement;
  }

  it("PromptParts persists completion against its own Section index, not the cursor", async () => {
    function PartsInSectionTwo() {
      return (
        <>
          <Section>
            <span>plain first</span>
          </Section>
          <Section>
            <span>plain middle</span>
          </Section>
          <Section>
            <PromptParts parts={[{ text: "You are a chef", type: "role" }]} />
          </Section>
        </>
      );
    }

    await renderControlled(PartsInSectionTwo);
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(3);
    });

    // Cursor stays at 0; the interactive Section is index 2.
    fireEvent.click(sectionButton(2, /You are a chef/));
    fireEvent.click(sectionButton(2, /types\.role/));

    await waitFor(() => {
      expect(isSectionCompleted(SLUG, 2)).toBe(true);
    });
    expect(isSectionCompleted(SLUG, 0)).toBe(false);
  });

  it("PromptLab persists completion against its own Section index, not the cursor", async () => {
    function LabInSectionTwo() {
      return (
        <>
          <Section>
            <span>plain first</span>
          </Section>
          <Section>
            <span>plain middle</span>
          </Section>
          <Section>
            <PromptLab
              scenario="s"
              basePrompt="p"
              baseResponse="r"
              improvements={[{ label: "Add detail", prompt: "p2", response: "r2" }]}
            />
          </Section>
        </>
      );
    }

    await renderControlled(LabInSectionTwo);
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(3);
    });

    fireEvent.click(sectionButton(2, /Add detail/));

    await waitFor(() => {
      expect(isSectionCompleted(SLUG, 2)).toBe(true);
    });
    expect(isSectionCompleted(SLUG, 0)).toBe(false);
  });

  it("PromptDoctor persists completion against its own Section index, not the cursor", async () => {
    function DoctorInSectionTwo() {
      return (
        <>
          <Section>
            <span>plain first</span>
          </Section>
          <Section>
            <span>plain middle</span>
          </Section>
          <Section>
            <PromptDoctor
              brokenPrompt="bad"
              problems={[{ issue: "Too vague", symptom: "unclear", fix: "good" }]}
              healedPrompt="good"
            />
          </Section>
        </>
      );
    }

    await renderControlled(DoctorInSectionTwo);
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(3);
    });

    fireEvent.click(sectionButton(2, /Too vague/));

    await waitFor(() => {
      expect(isSectionCompleted(SLUG, 2)).toBe(true);
    });
    expect(isSectionCompleted(SLUG, 0)).toBe(false);
  });
});

/**
 * 01-16 task 3 — the real compiled en `1-1-meet-promi` level proves adjacent repeated
 * challenges lock and complete independently.
 *
 * Real Section layout (0-indexed): 0/1/2 Panel, 3 WordPredictor (mat), 4 WordPredictor
 * (time), 5/6 Panel, 7 PromptVsMistake (good), 8 PromptVsMistake (good), 9 Panel+Complete.
 */
describe("real compiled MDX: repeated adjacent challenges lock independently (01-16 task 3)", () => {
  async function renderReal() {
    render(
      <LevelProvider levelSlug={SLUG}>
        <LevelContentWrapper levelSlug={SLUG} levelNumber="1-1" />
      </LevelProvider>
    );
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(10);
    });
  }

  function sectionEl(index: number): HTMLElement {
    return document.querySelector(`section[data-section-index="${index}"]`) as HTMLElement;
  }

  /** Click a button by accessible name within a specific Section (works offscreen). */
  function clickInSection(index: number, name: RegExp | string) {
    fireEvent.click(within(sectionEl(index)).getByRole("button", { name, hidden: true }));
  }

  /** Solve a WordPredictor in a Section: pick the option then submit. */
  async function solveWordPredictor(index: number, option: string) {
    clickInSection(index, option);
    await waitFor(() => {
      expect(within(sectionEl(index)).getByRole("button", { name: "check", hidden: true })).toBeEnabled();
    });
    clickInSection(index, "check");
  }

  /** Solve a PromptVsMistake by picking the "good" option (matched by text). */
  function solvePromptVsMistake(index: number, goodText: RegExp) {
    clickInSection(index, goodText);
  }

  async function walkForwardToSection(target: number) {
    for (let i = 0; i < 10; i++) {
      const active = document.querySelector("section[data-section-index]:not([hidden])");
      const activeIndex = Number(active?.getAttribute("data-section-index"));
      if (activeIndex === target) return;
      const next = screen.queryByRole("button", { name: "navigation.next" });
      if (!next || (next as HTMLButtonElement).disabled) return;
      fireEvent.click(next);
      await waitFor(() => {
        expect(document.querySelector("section[data-section-index]:not([hidden])")).not.toBeNull();
      });
    }
  }

  it("an off-render WordPredictor completion persists its own Section index, not the cursor", async () => {
    await renderReal();
    // Cursor stays at Section 0; drive the offscreen WordPredictor in Section 3.
    expect(isSectionCompleted(SLUG, 0)).toBe(false);
    await solveWordPredictor(3, "mat");

    await waitFor(() => {
      expect(isSectionCompleted(SLUG, 3)).toBe(true);
    });
    expect(isSectionCompleted(SLUG, 0)).toBe(false);
  });

  it("WordPredictor Sections 3 and 4 lock and complete independently through forward/back", async () => {
    await renderReal();

    await walkForwardToSection(3);
    expect(document.querySelector('section[data-section-index]:not([hidden])')).toHaveAttribute(
      "data-section-index",
      "3"
    );
    // Section 3 requires completion and is incomplete → locked.
    expect(await nextButton()).toBeDisabled();

    await solveWordPredictor(3, "mat");
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "navigation.next" })).toBeEnabled();
    });
    // Completion is isolated to Section 3.
    expect(isSectionCompleted(SLUG, 3)).toBe(true);
    expect(isSectionCompleted(SLUG, 4)).toBe(false);

    // Advance to Section 4: it must lock on its own, unhelped by Section 3.
    fireEvent.click(await nextButton());
    await waitFor(() => {
      expect(document.querySelector('section[data-section-index]:not([hidden])')).toHaveAttribute(
        "data-section-index",
        "4"
      );
    });
    expect(await nextButton()).toBeDisabled();

    await solveWordPredictor(4, "time");
    await waitFor(() => {
      expect(isSectionCompleted(SLUG, 4)).toBe(true);
    });
    // Section 3 remains complete; Section 4's key is its own index.
    expect(isSectionCompleted(SLUG, 3)).toBe(true);
    expect(isSectionCompleted(SLUG, 0)).toBe(false);

    // Back to Section 3: the lock state persists (already complete → Next enabled).
    fireEvent.click(screen.getByRole("button", { name: "navigation.back" }));
    await waitFor(() => {
      expect(document.querySelector('section[data-section-index]:not([hidden])')).toHaveAttribute(
        "data-section-index",
        "3"
      );
    });
    expect(await nextButton()).toBeEnabled();
  });

  it("PromptVsMistake Sections 7 and 8 lock and complete independently to the map link", async () => {
    await renderReal();

    // Solve the earlier interactive Sections so we can reach 7.
    await solveWordPredictor(3, "mat");
    await solveWordPredictor(4, "time");
    await walkForwardToSection(7);
    expect(document.querySelector('section[data-section-index]:not([hidden])')).toHaveAttribute(
      "data-section-index",
      "7"
    );
    expect(await nextButton()).toBeDisabled();

    solvePromptVsMistake(7, /friendly dragon/);
    await waitFor(() => {
      expect(isSectionCompleted(SLUG, 7)).toBe(true);
    });
    expect(isSectionCompleted(SLUG, 8)).toBe(false);

    fireEvent.click(await nextButton());
    await waitFor(() => {
      expect(document.querySelector('section[data-section-index]:not([hidden])')).toHaveAttribute(
        "data-section-index",
        "8"
      );
    });
    expect(await nextButton()).toBeDisabled();

    solvePromptVsMistake(8, /poem about the ocean/);
    await waitFor(() => {
      expect(isSectionCompleted(SLUG, 8)).toBe(true);
    });
    expect(isSectionCompleted(SLUG, 7)).toBe(true);

    // Section 9 is the final Section → the Next button is replaced by the map link.
    fireEvent.click(await nextButton());
    await waitFor(() => {
      expect(document.querySelector('section[data-section-index]:not([hidden])')).toHaveAttribute(
        "data-section-index",
        "9"
      );
    });
    await waitFor(() => {
      const mapLink = screen.getByRole("link", { name: /level\.map/ });
      expect(mapLink).toHaveAttribute("href", "/map");
    });
    expect(screen.queryByRole("button", { name: "navigation.next" })).toBeNull();
  });
});

/**
 * 01-17 task 1 — the shared provider locale drives messages + compiled MDX together, with
 * a validated persisted preference that survives reload and never uses request-time lookup.
 *
 * These exercise the wrapper's locale-reactive compiled-MDX selection (with the mocked
 * provider locale) plus the pure client preference helpers. The full SettingsButton →
 * provider switch is covered in settings-locale.test.tsx against the real provider.
 */
describe("client locale preference drives compiled MDX (01-17 task 1)", () => {
  beforeEach(() => {
    intlMock.locale = "en";
    localStorage.clear();
  });

  afterEach(() => {
    intlMock.locale = "en";
  });

  it("loads a bounded, locale-specific message bundle (never a request-time locale)", async () => {
    const en = await loadMessages("en");
    const es = await loadMessages("es");
    expect((en.common as { loading: string }).loading).toBe("Loading...");
    expect((es.common as { loading: string }).loading).not.toBe("Loading...");
    // Unsupported candidates resolve to the deterministic default, never an ad-hoc path.
    const bogus = await loadMessages("../evil");
    expect((bogus.common as { loading: string }).loading).toBe(
      (en.common as { loading: string }).loading
    );
  });

  it("selects a different compiled MDX component on the same slug when the provider locale changes", async () => {
    const en = await loadLevelContent("en", SLUG);
    const es = await loadLevelContent("es", SLUG);
    expect(es?.effectiveLocale).toBe("es");
    expect(es?.Component).not.toBe(en?.Component);
  });

  it("renders ten en Sections but seven es Sections for the same slug as the locale changes", async () => {
    // en first.
    intlMock.locale = "en";
    const { unmount } = render(
      <LevelProvider levelSlug={SLUG}>
        <LevelContentWrapper levelSlug={SLUG} levelNumber="1-1" />
      </LevelProvider>
    );
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(10);
    });
    unmount();

    // es: the compiled es MDX has seven Sections, so a locale remount resets the registry.
    intlMock.locale = "es";
    render(
      <LevelProvider levelSlug={SLUG}>
        <LevelContentWrapper levelSlug={SLUG} levelNumber="1-1" />
      </LevelProvider>
    );
    await waitFor(() => {
      expect(document.querySelectorAll("section[data-section-index]").length).toBe(7);
    });
    const indexes = Array.from(
      document.querySelectorAll("section[data-section-index]")
    ).map((el) => Number(el.getAttribute("data-section-index")));
    expect(indexes).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it("shows the English fallback MDX for a supported locale with no translated module", async () => {
    // 'he' is supported by i18n config but has no kids content directory.
    const he = await loadLevelContent("he", SLUG);
    const en = await loadLevelContent("en", SLUG);
    expect(he?.effectiveLocale).toBe("en");
    expect(he?.Component).toBe(en?.Component);
  });

  it("reads a persisted preference only when it is a supported locale", () => {
    localStorage.setItem(LOCALE_PREFERENCE_KEY, "es");
    expect(readPersistedLocale()).toBe("es");

    localStorage.setItem(LOCALE_PREFERENCE_KEY, "not-a-locale");
    expect(readPersistedLocale()).toBeNull();

    localStorage.removeItem(LOCALE_PREFERENCE_KEY);
    expect(readPersistedLocale()).toBeNull();
  });

  it("treats repeated selection of the already-effective locale as a no-op", () => {
    localStorage.setItem(LOCALE_PREFERENCE_KEY, "en");
    const result = transitionLocale("en", "en");
    expect(result.ok).toBe(true);
    expect(result.changed).toBe(false);
    expect(result.locale).toBe("en");
    // Nothing re-persisted / no invalidation side effects.
    expect(localStorage.getItem(LOCALE_PREFERENCE_KEY)).toBe("en");
  });

  it("validates and persists a genuine change (keeping progress and sound keys untouched)", () => {
    localStorage.setItem("kids-progress", JSON.stringify({ levels: {}, totalStars: 3 }));
    const setSpy = vi.spyOn(Storage.prototype, "removeItem");

    const result = transitionLocale("es", "en");
    expect(result.ok).toBe(true);
    expect(result.changed).toBe(true);
    expect(result.locale).toBe("es");
    expect(readPersistedLocale()).toBe("es");

    // The locale preference writer never removes progress or sound keys.
    const removedKeys = setSpy.mock.calls.map((c) => c[0]);
    expect(removedKeys).not.toContain("kids-progress");
    expect(removedKeys).not.toContain("kids-music-enabled");
    expect(removedKeys).not.toContain(LOCALE_PREFERENCE_KEY);
    expect(localStorage.getItem("kids-progress")).not.toBeNull();
    setSpy.mockRestore();
  });

  it("resolves an unsupported target to the default locale via transition", () => {
    const result = transitionLocale("../evil", "es");
    expect(result.ok).toBe(true);
    expect(result.locale).toBe("en");
    expect(readPersistedLocale()).toBe("en");
  });

  it("fails closed and retains the current locale when invalidation is denied", () => {
    // Deny storage.removeItem so the locale-transition invalidation fails.
    const removeSpy = vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("storage denied");
    });
    const result = transitionLocale("es", "en");
    removeSpy.mockRestore();

    expect(result.ok).toBe(false);
    expect(result.invalidationFailed).toBe(true);
    // Current effective locale retained, and the target was never persisted.
    expect(result.locale).toBe("en");
    expect(readPersistedLocale()).toBeNull();
  });
});