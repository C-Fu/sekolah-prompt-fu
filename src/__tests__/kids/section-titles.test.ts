import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  ALL_LESSON_SECTION_TITLES,
  getSectionTitle,
  getAllSectionTitles,
} from "@/lib/kids/section-titles";

const ALL_27_LESSON_SLUGS = [
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
  // World 4
  "4-1-pretend-time",
  "4-2-story-starters",
  "4-3-character-creator",
  "4-4-world-builder",
  // World 5
  "5-1-perfect-prompt",
  "5-2-fix-it-up",
  "5-3-prompt-remix",
  "5-4-graduation-day",
  // Worlds 6-9 (Planetary Missions)
  "6-1-bm-kucing-peromfu",
  "7-1-english-colorful-toys",
  "8-1-matematik-tambah-bintang",
  "9-1-moral-sahabat-prihatin",
  // Worlds 10-13 (Outer Planet Missions)
  "10-1-sains-benda-hidup",
  "11-1-sejarah-garis-masa",
  "12-1-rbt-bentuk-asas",
  "13-1-psv-warna-imaginasi",
];

function countMdxSections(locale: "en" | "ms", slug: string): number {
  const filePath = path.join(process.cwd(), "src", "content", "kids", locale, `${slug}.mdx`);
  const content = fs.readFileSync(filePath, "utf8");
  const matches = content.match(/<Section\b/g);
  return matches ? matches.length : 0;
}

describe("Complete Lesson Section Titles Registry (Plan 14-08 & 28-02)", () => {
  it("covers all 27 registered lesson slugs across Earth and Planetary missions", () => {
    expect(ALL_27_LESSON_SLUGS).toHaveLength(27);
    for (const slug of ALL_27_LESSON_SLUGS) {
      expect(ALL_LESSON_SECTION_TITLES[slug]).toBeDefined();
    }
  });

  it("matches MDX section count exactly for both EN and MS in all 27 lessons", () => {
    for (const slug of ALL_27_LESSON_SLUGS) {
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

      // Verify each title is non-empty, non-trivial, and matches getSectionTitle
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

  it("returns undefined for unknown locale, unknown slug, or out-of-bounds index without cross-locale fallback", () => {
    // Unknown locale
    expect(getSectionTitle("fr", "4-1-pretend-time", 0)).toBeUndefined();
    expect(getAllSectionTitles("de", "5-1-perfect-prompt")).toBeUndefined();

    // Unknown slug
    expect(getSectionTitle("en", "unknown-slug-123", 0)).toBeUndefined();
    expect(getAllSectionTitles("ms", "unknown-slug-123")).toBeUndefined();

    // Out of bounds index
    expect(getSectionTitle("en", "6-1-bm-kucing-peromfu", -1)).toBeUndefined();
    expect(getSectionTitle("en", "6-1-bm-kucing-peromfu", 999)).toBeUndefined();
    expect(getSectionTitle("ms", "9-1-moral-sahabat-prihatin", 100)).toBeUndefined();
  });
});
