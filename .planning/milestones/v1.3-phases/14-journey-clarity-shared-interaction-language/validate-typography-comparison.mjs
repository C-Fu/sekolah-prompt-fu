#!/usr/bin/env node

/**
 * Validator for typography comparison specimen and report.
 * Supports --specimen (Task 1) and --complete (Task 2) modes.
 */

import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), ".planning/phases/14-journey-clarity-shared-interaction-language");
const htmlPath = path.join(dir, "14-typography-comparison.html");
const reportPath = path.join(dir, "14-typography-comparison-report.md");
const narrowPngPath = path.join(dir, "14-typography-narrow.png");
const widePngPath = path.join(dir, "14-typography-wide.png");

const mode = process.argv.includes("--specimen") ? "specimen" : "complete";

function assert(condition, message) {
  if (!condition) {
    console.error(`VALIDATION ERROR: ${message}`);
    process.exit(1);
  }
}

// 1. Specimen Checks
assert(fs.existsSync(htmlPath), "Specimen HTML file does not exist");
const html = fs.readFileSync(htmlPath, "utf8");

// No remote imports or external resources
assert(!html.includes("http://"), "Specimen HTML contains insecure remote HTTP links");
assert(!html.includes("https://"), "Specimen HTML contains external remote HTTPS links");
assert(!html.includes("@import url"), "Specimen HTML contains CSS @import url");
assert(!html.includes("from '@/"), "Specimen HTML contains production-app imports");

// Must name all three candidates
assert(html.includes("Schoolbell"), "Specimen HTML must include candidate Schoolbell");
assert(html.includes("Bubble Sans"), "Specimen HTML must include candidate Bubble Sans");
assert(html.includes("Comic Neue"), "Specimen HTML must include candidate Comic Neue");

// Must include both EN and BM samples
assert(html.includes("Learn to Talk to AI!"), "Specimen HTML must include English display sample");
assert(html.includes("Belajar Bercakap dengan AI!"), "Specimen HTML must include BM display sample");
assert(html.includes("Earth map"), "Specimen HTML must include English Earth map label");
assert(html.includes("Peta Bumi"), "Specimen HTML must include BM Peta Bumi label");

// Must include narrow and wide presets
assert(html.includes("viewport-narrow") && html.includes("viewport-wide"), "Specimen HTML must include narrow and wide viewport presets");

// 2. Report Checks
assert(fs.existsSync(reportPath), "Typography comparison report does not exist");
const report = fs.readFileSync(reportPath, "utf8");

const requiredHeadings = [
  "## Candidate Asset Inventory",
  "## BM Glyph and Punctuation Observations",
  "## EN Glyph and Punctuation Observations",
  "## Narrow Viewport Observations",
  "## Wide Viewport Observations",
  "## Static Export and Fallback Constraints",
  "## Child-Reading Evidence",
  "## Production Font Decision",
  "## Explicit Approval",
];

for (const heading of requiredHeadings) {
  assert(report.includes(heading), `Report is missing required heading: ${heading}`);
}

// Reject unpopulated templates, TODOs, TBDs
assert(!report.includes("TODO"), "Report contains unresolved TODO markers");
assert(!report.includes("TBD"), "Report contains unresolved TBD markers");

// Check candidate statuses
assert(report.includes("**Schoolbell**") && report.includes("available"), "Schoolbell must be documented as available");
assert(report.includes("**Bubble Sans**") && report.includes("unavailable"), "Bubble Sans must be documented as unavailable");
assert(report.includes("**Comic Neue**") && report.includes("unavailable"), "Comic Neue must be documented as unavailable");

// Check production decision preserves Schoolbell
assert(report.includes("**Selected Face**: Schoolbell"), "Selected Face must be Schoolbell absent measured child-reading results");
assert(report.includes("Schoolbell remains"), "Report must state that Schoolbell remains the production font");

if (mode === "complete") {
  // Check image files exist and are non-empty
  assert(fs.existsSync(narrowPngPath), "14-typography-narrow.png does not exist");
  assert(fs.existsSync(widePngPath), "14-typography-wide.png does not exist");

  const narrowStat = fs.statSync(narrowPngPath);
  const wideStat = fs.statSync(widePngPath);
  assert(narrowStat.size > 100, "14-typography-narrow.png is too small or empty");
  assert(wideStat.size > 100, "14-typography-wide.png is too small or empty");

  // Verify PNG signatures
  const narrowHeader = fs.readFileSync(narrowPngPath).slice(0, 8);
  const wideHeader = fs.readFileSync(widePngPath).slice(0, 8);
  const pngSig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  assert(narrowHeader.equals(pngSig), "narrow screenshot is not a valid PNG");
  assert(wideHeader.equals(pngSig), "wide screenshot is not a valid PNG");
}

console.log(`Typography comparison validation (${mode}) passed successfully.`);
