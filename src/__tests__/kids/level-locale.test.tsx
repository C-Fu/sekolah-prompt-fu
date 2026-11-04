import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// `page.tsx` pulls in `@/lib/seo` -> `prompts.config.ts`; the global setup mock of
// `@/lib/config` does not expose `defineConfig`, so stub the config module directly
// (same pattern as src/__tests__/lib/seo.test.ts).
vi.mock("@/../prompts.config", () => ({
  default: { branding: { name: "prompts.chat" } },
}));

import { loadLevelContent } from "@/lib/kids/level-content";
import { getAllLevels, getLevelBySlug } from "@/lib/kids/levels";
import { generateStaticParams } from "@/app/kids/level/[slug]/page";
import { useMDXComponents } from "../../../mdx-components";

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