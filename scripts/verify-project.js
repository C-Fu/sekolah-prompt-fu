#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * NFR-2 certification script (read-only).
 *
 * Purpose: re-run the certified quality gates and inspect the already-built
 * `out/` static export, printing a PASS/FAIL verdict. It is the source of truth
 * for NFR-2 (quality & type safety) certification (Phase 4 / D-01, D-04): a
 * non-zero exit means certification FAILED.
 *
 * Certified gate set (exactly — D-02; lint / lint:mdx / the guard scripts are
 * deliberately NOT part of the NFR-2 claim):
 *   1. `npx tsc --noEmit`
 *   2. `npm test` (Vitest)
 *
 * Artifact inspection (D-03): the script inspects the ALREADY-BUILT `out/` tree
 * (root `/`, `/map`, one `index.html` per registered level slug, and bundled
 * media). It deliberately does NOT run `npm run build` (D-12): the static build
 * stays solely in `deploy.yml`, so CI does not build twice. Run
 * `npm run build` beforehand; this script only reads `out/`.
 *
 * Read-only: never writes, moves, or deletes anything. A real regression
 * surfaced by verification is a separate fix (D-09), not a side effect here.
 * Exit 0 = all certified gates pass and the artifact set is complete.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "out");
const LEVELS_TS = path.join(ROOT, "src", "lib", "kids", "levels.ts");

/**
 * Run a certified gate and capture whether it exited 0. execSync throws on a
 * non-zero exit; the thrown error's stdout is surfaced for the failure report.
 */
function runGate(label, command) {
  try {
    execSync(command, {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "inherit"],
      encoding: "utf8",
    });
    return { label, passed: true };
  } catch (err) {
    return { label, passed: false, output: (err.stdout || "").toString() };
  }
}

/**
 * Derive the level-slug set from the registry (`src/lib/kids/levels.ts`) rather
 * than hard-coding a count — the registry is the source of truth (PATTERNS.md).
 * Level slugs match the `/^\d-\d-/` pattern (e.g. `1-1-meet-promi`). A simple
 * Node-stdlib regex over the file text — no TypeScript import.
 */
function deriveLevelSlugs() {
  const slugs = new Set();
  if (!fs.existsSync(LEVELS_TS)) return [...slugs].sort();
  const text = fs.readFileSync(LEVELS_TS, "utf8");
  const re = /slug:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (/^\d-\d-/.test(m[1])) slugs.add(m[1]);
  }
  return [...slugs].sort();
}

function main() {
  console.log("🔎 Project verification — NFR-2 certification (read-only)\n");

  const problems = [];

  // --- Certified gates (D-02) -------------------------------------------------
  // Deliberately NOT run: `npm run build` — D-12 keeps the static build in
  // deploy.yml so CI/local certification does not double-build. This script
  // inspects the ALREADY-BUILT out/ tree instead.
  const gates = [
    runGate("tsc --noEmit", "npx tsc --noEmit"),
    runGate("vitest run", "npm test"),
  ];

  for (const gate of gates) {
    if (gate.passed) {
      console.log(`   ✔ ${gate.label}`);
    } else {
      console.error(`   ✘ ${gate.label}`);
      problems.push(`gate failed: ${gate.label}`);
      if (gate.output) {
        for (const line of gate.output.split("\n")) {
          if (line.trim()) console.error(`       ${line}`);
        }
      }
    }
  }

  // --- Artifact inspection (D-03) --------------------------------------------
  if (!fs.existsSync(OUT)) {
    // Refuse to pass silently (mirrors check-ms-vocabulary.js:80-85).
    console.error(
      "❌ out/ does not exist — run `npm run build` before `npm run verify` (the build stays in deploy.yml)."
    );
    process.exit(1);
  }

  const requireArtifact = (rel, label) => {
    if (fs.existsSync(path.join(OUT, rel))) {
      console.log(`   ✔ ${label}`);
    } else {
      console.error(`   ✘ missing ${label} (out/${rel})`);
      problems.push(`missing artifact: out/${rel} (${label})`);
    }
  };

  // Root `/` and `/map`.
  requireArtifact("index.html", "root / route");
  requireArtifact("map/index.html", "/map route");

  // One emitted index.html per registered level slug.
  const slugs = deriveLevelSlugs();
  if (slugs.length === 0) {
    // Never pass on an empty derived set.
    console.error(
      "❌ no level slugs derived from src/lib/kids/levels.ts — refusing to pass silently."
    );
    process.exit(1);
  }
  const missingSlugs = [];
  for (const slug of slugs) {
    if (!fs.existsSync(path.join(OUT, "level", slug, "index.html"))) {
      missingSlugs.push(slug);
    }
  }
  if (missingSlugs.length === 0) {
    console.log(`   ✔ ${slugs.length}/${slugs.length} level routes (${slugs.length} slugs derived)`);
  } else {
    console.error(`   ✘ ${slugs.length - missingSlugs.length}/${slugs.length} level routes`);
    for (const slug of missingSlugs) {
      console.error(`       missing level route: out/level/${slug}/index.html`);
      problems.push(`missing level route: out/level/${slug}/index.html`);
    }
  }

  // Bundled media asset.
  requireArtifact("kids-music.mp3", "bundled media kids-music.mp3");

  // --- Verdict ----------------------------------------------------------------
  if (problems.length > 0) {
    console.error(`\n❌ NFR-2 certification FAILED (${problems.length} problem(s)):\n`);
    for (const p of problems) console.error(`   • ${p}`);
    console.error("");
    process.exit(1);
  }

  console.log(
    `\n✅ NFR-2 certified: tsc pass, vitest pass, ${slugs.length} level routes, / and /map, bundled media.`
  );
  process.exit(0);
}

main();