import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  WORLD_1_TO_3_SECTION_TITLES,
  getSectionTitle,
  getAllSectionTitles,
} from "@/lib/kids/section-titles";

const WORLD_1_TO_3_SLUGS = [
  // World 1
  "1-1-meet-peromfu",
  "1-2-first-words",
  "1-3-being-clear",
  // World 2
  "2-1-missing-details",
  "2-2-who-and-what",
  "2-3-when-and-where",
  "2-4-detail-detective",
  // World 3
  "3-1-setting-the-scene",
  "3-2-show-dont-tell",
  "3-3-format-finder",
  "3-4-context-champion",
];

function countMdxSections(locale: "en" | "ms", slug: string): number {
  const filePath = path.join(process.cwd(), "src", "content", "kids", locale, `${slug}.mdx`);
  const content = fs.readFileSync(filePath, "utf8");
  const matches = content.match(/<Section\b/g);
  return matches ? matches.length : 0;
}

describe("World 1-3 Section Titles Registry", () => {
  it("covers all 11 lesson slugs in worlds 1-3", () => {
    for (const slug of WORLD_1_TO_3_SLUGS) {
      expect(WORLD_1_TO_3_SECTION_TITLES[slug]).toBeDefined();
    }
  });

  it("matches MDX section count exactly for both EN and MS in all world 1-3 lessons", () => {
    for (const slug of WORLD_1_TO_3_SLUGS) {
      const enMdxCount = countMdxSections("en", slug);
      const msMdxCount = countMdxSections("ms", slug);

      expect(enMdxCount).toBeGreaterThan(0);
      expect(msMdxCount).toBe(enMdxCount);

      const enTitles = getAllSectionTitles("en", slug);
      const msTitles = getAllSectionTitles("ms", slug);

      expect(enTitles).toBeDefined();
      expect(msTitles).toBeDefined();

      expect(enTitles?.length).toBe(enMdxCount);
      expect(msTitles?.length).toBe(msMdxCount);

      // Verify each title is non-empty and non-trivial
      enTitles?.forEach((t, idx) => {
        expect(t.trim().length).toBeGreaterThan(2);
        expect(getSectionTitle("en", slug, idx)).toBe(t);
      });

      msTitles?.forEach((t, idx) => {
        expect(t.trim().length).toBeGreaterThan(2);
        expect(getSectionTitle("ms", slug, idx)).toBe(t);
      });
    }
  });

  it("returns undefined for unknown locale, unknown slug, or out-of-bounds index without silent fallback", () => {
    // Unknown locale
    expect(getSectionTitle("fr", "1-1-meet-peromfu", 0)).toBeUndefined();
    expect(getAllSectionTitles("de", "1-1-meet-peromfu")).toBeUndefined();

    // Unknown slug
    expect(getSectionTitle("en", "non-existent-slug", 0)).toBeUndefined();
    expect(getAllSectionTitles("ms", "non-existent-slug")).toBeUndefined();

    // Out of bounds index
    expect(getSectionTitle("en", "1-1-meet-peromfu", -1)).toBeUndefined();
    expect(getSectionTitle("en", "1-1-meet-peromfu", 999)).toBeUndefined();
    expect(getSectionTitle("ms", "1-2-first-words", 100)).toBeUndefined();
  });
});
