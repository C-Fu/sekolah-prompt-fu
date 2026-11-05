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
 * Two modes:
 *   - DEFAULT (no flag): run the gates AND inspect the ALREADY-BUILT `out/`
 *     tree (root `/`, `/map`, one `index.html` per registered level slug, and
 *     bundled media) — the full artifact certification (D-03).
 *   - `--gates-only`: run ONLY the two certified gates and skip the `out/`
 *     inspection entirely. For a context with no build — CI, which never builds
 *     per D-12 — where the certification step must pass on a clean checkout.
 *
 * It deliberately does NOT run `npm run build` (D-12): the static build stays
 * solely in `deploy.yml`, so CI does not build twice. In default mode run
 * `npm run build` beforehand; this script only reads `out/`.
 *
 * Read-only: never writes, moves, or deletes anything. A real regression
 * surfaced by verification is a separate fix (D-09), not a side effect here.
 * Exit 0 = every gate that ran passed (and, in default mode, the artifact set
 * is complete).
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
 *
 * A finite timeout (5 min — WR-02) bounds a hung gate: a stuck `npx tsc` or
 * `npm test` fails the gate with an actionable "timed out" line instead of
 * hanging verification (and CI) until the runner's job timeout.
 */
function runGate(label, command) {
  try {
    execSync(command, {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "inherit"],
      encoding: "utf8",
      timeout: 5 * 60 * 1000, // 5 min — a hung gate must not hang CI (WR-02)
    });
    return { label, passed: true };
  } catch (err) {
    const timedOut =
      err.killed === true ||
      err.code === "ETIMEDOUT" ||
      err.signal === "SIGTERM";
    const captured = (err.stdout || "").toString();
    const output = timedOut
      ? `timed out after 300s\n${captured}`
      : captured;
    return { label, passed: false, output };
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
  // --- Arg parse --------------------------------------------------------------
  // Only the literal `--gates-only` is recognised (T-04-09). Any unknown flag is
  // rejected loudly — never silently ignored (the repo's exit-code-gate
  // convention; no external dep, mirroring check-ms-vocabulary.js).
  const SUPPORTED = ["--gates-only"];
  const argv = process.argv.slice(2);
  const unknown = argv.filter((a) => !SUPPORTED.includes(a));
  if (unknown.length > 0) {
    console.error(
      `❌ unknown argument(s): ${unknown.join(", ")} — supported flag: --gates-only`
    );
    process.exit(1);
  }
  const GATES_ONLY = argv.includes("--gates-only");

  console.log(
    `🔎 Project verification — NFR-2 certification (read-only${
      GATES_ONLY ? ", gates-only" : ""
    })\n`
  );

  const problems = [];

  // --- Certified gates (D-02) -------------------------------------------------
  // Deliberately NOT run: `npm run build` — D-12 keeps the static build in
  // deploy.yml so CI/local certification does not double-build. In default mode
  // this script inspects the ALREADY-BUILT out/ tree instead; in --gates-only
  // mode it inspects nothing and reports only the gates.
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

  // --- Artifact inspection (D-03) — default mode only -------------------------
  // `--gates-only` skips this entire block so it can pass on a clean checkout
  // with no out/ (CI never builds — D-12). The skip is explicit by flag; the
  // default (no-flag) mode keeps inspecting and keeps hard-failing on absent
  // out/ (never a silent pass).
  let slugs = [];
  if (!GATES_ONLY) {
    if (!fs.existsSync(OUT)) {
      // Refuse to pass silently (mirrors check-ms-vocabulary.js).
      // IN-01: collect into `problems` and fall through to the aggregated verdict
      // (instead of an early process.exit(1) that skips the FAILED block). Guard
      // the rest of the block so we do not cascade redundant "missing …" problems.
      console.error(
        "❌ out/ does not exist — run `npm run build` before `npm run verify` (the build stays in deploy.yml)."
      );
      problems.push(
        "out/ does not exist — run `npm run build` before `npm run verify` (the build stays in deploy.yml)."
      );
    } else {
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
      slugs = deriveLevelSlugs();
      if (slugs.length === 0) {
        // Never pass on an empty derived set — collect and fall through (IN-01).
        console.error(
          "❌ no level slugs derived from src/lib/kids/levels.ts — refusing to pass silently."
        );
        problems.push(
          "no level slugs derived from src/lib/kids/levels.ts — refusing to pass silently"
        );
      } else {
        const missingSlugs = [];
        for (const slug of slugs) {
          if (!fs.existsSync(path.join(OUT, "level", slug, "index.html"))) {
            missingSlugs.push(slug);
          }
        }
        if (missingSlugs.length === 0) {
          console.log(
            `   ✔ ${slugs.length}/${slugs.length} level routes (${slugs.length} slugs derived)`
          );
        } else {
          console.error(`   ✘ ${slugs.length - missingSlugs.length}/${slugs.length} level routes`);
          for (const slug of missingSlugs) {
            console.error(`       missing level route: out/level/${slug}/index.html`);
            problems.push(`missing level route: out/level/${slug}/index.html`);
          }
        }
      }

      // Bundled media asset.
      requireArtifact("kids-music.mp3", "bundled media kids-music.mp3");
    }
  }

  // --- Verdict ----------------------------------------------------------------
  if (problems.length > 0) {
    console.error(`\n❌ NFR-2 certification FAILED (${problems.length} problem(s)):\n`);
    for (const p of problems) console.error(`   • ${p}`);
    console.error("");
    process.exit(1);
  }

  // The PASS line states which mode ran so a green gates-only run is NOT
  // mistaken for a full artifact certification (T-04-07). Gates-only must not
  // claim level-route/media counts it did not inspect.
  const verdict = GATES_ONLY
    ? "✅ NFR-2 certified: tsc pass, vitest pass (gates-only — out/ not inspected)."
    : `✅ NFR-2 certified: tsc pass, vitest pass, ${slugs.length} level routes, / and /map, bundled media (full — out/ inspected).`;
  console.log(`\n${verdict}`);
  process.exit(0);
}

main();