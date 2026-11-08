import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SUBJECT_SLUGS = [
  "6-1-bm-kucing-peromfu",
  "7-1-english-colorful-toys",
  "8-1-matematik-tambah-bintang",
  "9-1-moral-sahabat-prihatin",
];

const LOCALES = ["en", "ms"];

describe("Subject Prompt Lessons 7-Stage Interactive Architecture (PEDAG-01, PEDAG-02, D-03, D-04)", () => {
  for (const slug of SUBJECT_SLUGS) {
    for (const locale of LOCALES) {
      const filePath = path.join(
        process.cwd(),
        "src",
        "content",
        "kids",
        locale,
        `${slug}.mdx`
      );

      describe(`Lesson ${slug} [${locale}]`, () => {
        it("exists on disk", () => {
          expect(fs.existsSync(filePath), `File missing: ${filePath}`).toBe(true);
        });

        it("contains at least 7 distinct <Section> blocks", () => {
          const content = fs.readFileSync(filePath, "utf-8");
          // Count opening <Section> tags
          const sectionMatches = content.match(/<Section\b/g) || [];
          expect(
            sectionMatches.length,
            `Expected at least 7 <Section> elements in ${locale}/${slug}.mdx, found ${sectionMatches.length}`
          ).toBeGreaterThanOrEqual(7);
        });

        it("culminates in a <LevelComplete> targeting its levelSlug in the final section", () => {
          const content = fs.readFileSync(filePath, "utf-8");
          // Extract sections
          const sections = content.split(/<\/Section>/);
          const lastSection = sections[sections.length - 2] || "";

          expect(lastSection).toContain("<LevelComplete");
          expect(lastSection).toContain(`levelSlug="${slug}"`);
        });
      });
    }
  }
});
