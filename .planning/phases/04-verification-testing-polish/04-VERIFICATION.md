---
phase: 04-verification-testing-polish
verified: 2026-11-05T21:05:00Z
status: gaps_found
score: 7/9 must-haves verified
covered_files: [".github/workflows/ci.yml", ".github/workflows/deploy.yml", ".planning/HANDOFF.md", ".planning/PROJECT.md", ".planning/REQUIREMENTS.md", ".planning/STATE.md", ".planning/phases/04-verification-testing-polish/04-01-PLAN.md", ".planning/phases/04-verification-testing-polish/04-01-SUMMARY.md", ".planning/phases/04-verification-testing-polish/04-02-PLAN.md", ".planning/phases/04-verification-testing-polish/04-02-SUMMARY.md", "package.json", "scripts/verify-project.js", "src/__tests__/scripts/verify-project.test.ts", "src/__tests__/scripts/workflows.test.ts"]
covered_digest: "v4:sha256:f779c0c0d57466553f6e8c172ec28579ed9cc6b93e29190df342d614454ec97f"
behavior_unverified: 0
overrides_applied: 0
gaps:
  - truth: "CI enforces the same gate set as local certification (`npx tsc --noEmit` + `npm run verify`), i.e. the wired steps actually pass on a clean runner."
    status: failed
    reason: "The `Run verification script` step in `.github/workflows/ci.yml` runs `npm run verify`, which hard-exits 1 when `out/` is absent. `out/` is gitignored (`.gitignore:18`) and untracked (`git ls-files out` = 0), `ci.yml` has no build step (by design D-12), and `out/` is never produced by `npm ci`. On a clean GitHub Actions checkout the step therefore fails on every push/PR — the certified gate is red-by-construction, so CI does not enforce a passing gate set. Reproduced three ways: (1) clean worktree of HEAD, `node scripts/verify-project.js` → exit 1 `out/ does not exist`; (2) current repo with `out/` moved aside and deps present, both gates green yet → exit 1 `out/ does not exist`; (3) script reads its `out/` guard at line 100, before any artifact inspection."
    artifacts:
      - path: ".github/workflows/ci.yml"
        issue: "Step `Run verification script` (lines 40-41, `run: npm run verify`) can never pass — no build step produces `out/` in CI."
      - path: "scripts/verify-project.js"
        issue: "Unconditional `out/` existence guard (lines 100-106) exits 1 when `out/` is absent; the script does not build, so a clean checkout has no `out/`."
    missing:
      - "Reconcile D-03 (inspect the built `out/`) with D-12 (no build in CI): either build once in CI before `Run verification script` (keeping `deploy.yml` as the deployment build), OR add a `--gates-only`/artifacts-only mode so CI runs tsc+vitest without the `out/` inspection, OR move the full `npm run verify` out of `ci.yml` and run it in `deploy.yml` after its build."
human_verification:
  - test: "Push a commit to `main` (or open a PR against `main`) and observe the `CI / Test` job on GitHub Actions."
    expected: "The job finishes green: `Run TypeScript type check`, `Run linter`, `Check ms vocabulary guard`, `Run tests`, and `Run verification script` all succeed."
    why_human: "Only exercisable on a real GitHub-hosted runner; local reproduction already shows the `Run verification script` step exits 1 (CR-01), but a live run confirms the required check is red."
---

# Phase 4: Verification, Testing & Polish Verification Report

**Phase Goal:** NFR-2 is certified end-to-end — a committed, rerunnable verification script re-runs `npx tsc --noEmit` and the Vitest suite and inspects the built `out/` export, CI enforces the same gate set, and an onboarding handoff (`HANDOFF.md`) documents architecture, gates, deploy, and known non-blocking advisories.
**Verified:** 2026-11-05T21:05:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
| --- | ----- | ------ | -------- |
| 1 | `npm run verify` runs `npx tsc --noEmit` and the Vitest suite, inspects the already-built `out/` tree, and prints a PASS/FAIL verdict with exit 0 on pass. | ✓ VERIFIED | `npm run verify` with `out/` present → exit 0; output: `✔ tsc --noEmit`, `✔ vitest run`, `✔ root / route`, `✔ /map route`, `✔ 19/19 level routes`, `✔ bundled media kids-music.mp3`, `✅ NFR-2 certified…`. Script spawns both gates (`scripts/verify-project.js:80-83`). |
| 2 | The verify script refuses loudly (non-zero exit) when `out/` is absent or when the level-route set is empty, instead of passing silently. | ✓ VERIFIED | Probe: `out/` moved aside → exit 1 `❌ out/ does not exist — run npm run build before npm run verify`; empty-slug/levels.ts-missing paths covered by `verify-project.test.ts` (18/18 green). |
| 3 | The verify script does NOT run `npm run build` — the build stays solely in `deploy.yml` (D-12). | ✓ VERIFIED | `grep "npm run build"` in script finds only comments/message text (lines 18, 20, 77, 103), no spawned command; `package.json` `verify` = `node scripts/verify-project.js` (no `build`); `ci.yml` has 0 build refs, `deploy.yml` has 1. |
| 4 | `npm run verify` requires `out/` to exist (built beforehand); the script inspects it read-only. | ✓ VERIFIED | Guard at `scripts/verify-project.js:100-106`; only `fs.existsSync` reads, no writes/moves/deletes anywhere in the script. |
| 5 | `ci.yml` runs `npx tsc --noEmit` and `npm run verify` as additional steps, and `ci.yml` does not build (D-12). | ✓ VERIFIED (wiring only) | `ci.yml:28-29` `Run TypeScript type check` → `npx tsc --noEmit`; `ci.yml:40-41` `Run verification script` → `npm run verify`; both steps present, no `npm run build`. **NOTE: the `npm run verify` step cannot pass on a clean checkout — see Truth 6 / CR-01.** |
| 6 | **CI enforces the same gate set** (the phase-goal outcome — the wired CI steps actually pass on a clean runner). | ✗ FAILED | `Run verification script` is red-by-construction. `out/` is gitignored (`.gitignore:18`) and untracked (`git ls-files out` = 0); `ci.yml` never builds; `npm ci` does not create `out/`. Reproduced on a clean worktree of HEAD → exit 1 `out/ does not exist`; reproduced in the live repo with `out/` moved aside → exit 1 despite both gates green. The step is wired but guaranteed to fail. |
| 7 | `deploy.yml` is byte-identical to HEAD (D-13). | ✓ VERIFIED | `git diff --quiet HEAD -- .github/workflows/deploy.yml` → exit 0. |
| 8 | `.planning/HANDOFF.md` covers all four D-06 areas (architecture, gate commands, deploy process, known advisories), naming the exact certified commands, and lists WR-04/IN-03 as known/tracked/non-blocking (not fixed). | ✓ VERIFIED | All 13 content tokens present (export/localStorage/`/map`/`/level/`/`npx tsc --noEmit`/`npm test`/`npm run build`/`npm run verify`/`deploy.yml`/`upload-pages-artifact`/`deploy-pages`/WR-04/IN-03). Lives in `.planning/`, not repo root. Advisory table explicitly labels both "known, tracked, non-blocking … NOT fixed". |
| 9 | NFR-2 is flipped from `◑ partial` to satisfied with Phase-4 evidence; PROJECT.md Phase-4 items checked; STATE.md records the Phase-4 certification. | ✓ VERIFIED | `REQUIREMENTS.md:30` reads `**NFR-2: Quality & Type Safety** ✅ ✓ (Phase 4, certified)` with evidence note; `PROJECT.md:43,45` both `- [x]`; `STATE.md` §Status Phase-4 summary + `[Phase 04]` decision bullet present. |

**Score:** 7/9 truths verified (0 present, behavior-unverified)

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `scripts/verify-project.js` | Committed Node-stdlib certification script | ✓ VERIFIED | 163 lines; shebang + `"use strict"`; requires only `fs`/`path`/`child_process`; `runGate`, `deriveLevelSlugs`, `main`; read-only; no build invocation. |
| `package.json` | `"verify": "node scripts/verify-project.js"` | ✓ VERIFIED | Line 18 exact; valid JSON; no other script changed; `verify` does not reference `build`. |
| `.github/workflows/ci.yml` | `tsc --noEmit` step + `npm run verify` step | ⚠️ PARTIAL | Both steps present and correctly ordered (tsc after install/before lint; verify last). **Wiring is complete but the verify step cannot pass in CI (CR-01/Truth 6).** |
| `.planning/HANDOFF.md` | Onboarding/handoff doc | ✓ VERIFIED | All four areas present; exact commands; WR-04/IN-03 advisory table. |
| `src/__tests__/scripts/verify-project.test.ts` | Behavioral coverage of the verifier | ✓ VERIFIED | 10 tests, all green against the real script (refuse-loudly paths, slug derivation, artifact inspection). |
| `src/__tests__/scripts/workflows.test.ts` | Structural coverage of ci.yml/deploy.yml | ✓ VERIFIED | 8 tests, all green. |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| `package.json` `verify` script | `scripts/verify-project.js` | npm script path | ✓ WIRED | `"verify": "node scripts/verify-project.js"`; file exists; runs. |
| `ci.yml` `Run verification script` step | `npm run verify` | `run:` | ✓ WIRED (but non-passing) | Step present; note the phase-goal outcome requires the step to pass, which it cannot (Truth 6). |
| `scripts/verify-project.js` | `out/` tree | read-only inspection | ✓ WIRED | Inspects `index.html`, `map/index.html`, `level/<slug>/index.html`, `kids-music.mp3`; verified by real-tree PASS and the 4 artifact-inspection tests. |
| `HANDOFF.md` gate section | `npm run verify` | prose reference | ✓ WIRED | Documents `npm run verify` as the rerunnable source of truth and states it does not build / requires pre-built `out/`. |
| `HANDOFF.md` deploy section | `.github/workflows/deploy.yml` | prose reference | ✓ WIRED | Recaps Node 24, `npm ci`, build with `NEXT_PUBLIC_BASE_PATH`, `upload-pages-artifact` `path: ./out`, `deploy-pages`, `github-pages` — matches deploy.yml. |

### Data-Flow Trace (Level 4)

Not applicable — no dynamic-rendering data path introduced this phase. The verifier reads real filesystem artifacts (`out/` tree) and derives the slug set from real `src/lib/kids/levels.ts` text (verified: 19 slugs derived, matches 19 emitted routes). No static/mock fallback.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| Verifier passes against the built tree | `npm run verify` | exit 0, `✅ NFR-2 certified …` (tsc, vitest, 19/19 routes, `/`, `/map`, media) | ✓ PASS |
| Verifier refuses loudly on absent `out/` | `mv out /tmp/… && node scripts/verify-project.js` | exit 1, `❌ out/ does not exist …` (both gates were green) | ✓ PASS (truth confirmed; also proves Truth 6 failure) |
| `tsc --noEmit` standalone (CI type-check step) | `npx tsc --noEmit` | exit 0 | ✓ PASS |
| Phase test files | `npx vitest run src/__tests__/scripts/verify-project.test.ts src/__tests__/scripts/workflows.test.ts` | 18/18 passed | ✓ PASS |
| CR-01 clean-checkout reproduction | `git worktree add --detach /tmp/cr01-verify HEAD && node scripts/verify-project.js` | exit 1, `out/ does not exist`; `git ls-files out` = 0 | ✗ FAIL (CI verify step cannot pass) |

### Probe Execution

SKIPPED — no `probe-*.sh` files declared or present in this phase; the phase declares no probe-based verification.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| NFR-2 | 04-01, 04-02 | Quality & Type Safety: tsc 0, static build emits `out/`, unit tests pass, re-certifiable via `npm run verify` | ✓ SATISFIED (local) / ⚠️ CI-enforcement gap | Local certification fully reproducible: tsc 0, `npm run verify` exit 0, 94/94 suite (18/18 phase tests). The claim "CI enforces the same gate set" is not met (Truth 6/CR-01). |
| FR-1 | 04-01 | Kids game as primary experience at `/`, `/map`, `/level/[slug]` | ✓ SATISFIED | Verifier asserts `out/index.html`, `out/map/index.html`, and 19/19 `out/level/<slug>/index.html`; `workflows.test.ts` and `generateStaticParams` tests corroborate. |
| FR-4 | 04-01 | GitHub Pages static deployment (`out/` via `npm run build`; automated deploy workflow) | ✓ SATISFIED | `deploy.yml` byte-identical to HEAD and structurally asserted (8 workflow tests); `out/` produced by build; live deployment remains manual (see Human Verification / VALIDATION.md manual-only). |

All three declared requirement IDs (NFR-2, FR-1, FR-4) are accounted for across the two plans. No orphaned requirements: REQUIREMENTS.md maps no other IDs to Phase 4.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| `.github/workflows/ci.yml` | 40-41 | CI step guaranteed to fail (runs `npm run verify` with no `out/`) | 🛑 Blocker | Same root cause as Truth 6; the required check is permanently red. |
| `scripts/verify-project.js` | 40-51 | `execSync` with no `timeout` | ⚠️ Warning | A hung gate can hang verification/CI until the runner job timeout (CR review WR-02). |
| `.github/workflows/ci.yml` | 37-41 | Full Vitest suite run twice (`npm test` then inside `npm run verify`) | ⚠️ Warning | Doubles suite runtime/flakiness (review WR-01). |
| `scripts/verify-project.js` | 100-106 | Early `process.exit(1)` on absent `out/` skips aggregated verdict block | ℹ️ Info | Summary-line inconsistency (review IN-01). |

No unreferenced `TBD`/`FIXME`/`XXX` debt markers in any phase-modified source file (checked `scripts/verify-project.js`, `package.json`, `.github/workflows/ci.yml`).

### Human Verification Required

1. **Live CI run of the `CI / Test` job**

   **Test:** Push to `main` (or open a PR against `main`) and watch the `CI / Test` job on GitHub Actions.
   **Expected:** All steps succeed, including `Run verification script`. (Local evidence says this will fail with `out/ does not exist` — CR-01.)
   **Why human:** Only exercisable on a real GitHub-hosted runner; cannot be run locally.

2. **Live GitHub Pages deployment** (carried from 04-VALIDATION.md manual-only)

   **Test:** Confirm the `Deploy to GitHub Pages` workflow succeeds after a `main` push and the site resolves under `/<repo>/`.
   **Expected:** Static site served at the Pages sub-path.
   **Why human:** Requires a real runner and Pages environment.

## Gaps Summary

The phase delivered most of its goal: the committed, rerunnable certification script (`scripts/verify-project.js`), its `npm run verify` alias, correct `ci.yml` step wiring, the untouched `deploy.yml`, a complete `HANDOFF.md`, and the NFR-2/STATE/PROJECT certification flip. Local certification is fully reproducible and verified (tsc 0, `npm run verify` exit 0, 94/94 suite, 18/18 phase tests).

**One must-have truth fails: "CI enforces the same gate set."** The `Run verification script` step in `ci.yml` runs `npm run verify`, but `out/` is gitignored and untracked, `ci.yml` never builds, and the script hard-exits 1 when `out/` is absent. I reproduced this three independent ways, including with all local gates green. The step is red-by-construction: it is *wired* but cannot *pass*, so CI does not enforce a passing gate set. This directly contradicts the phase-goal clause "CI enforces the same gate set" and matches the code reviewer's CR-01 finding exactly.

**Classification:** This is a goal failure (gaps_found), **not** a non-blocking advisory, because:
- The phase goal explicitly names "CI enforces the same gate set" as a required outcome, not an optional nicety.
- The failing artifact is a required part of the phase deliverable (`ci.yml` hardening was a declared success criterion), and the failure is deterministic and total — not an edge case.
- A permanently-red required CI check is worse than no check: it blocks merges and masks the real certification signal.

The reviewer's suggested fixes are sound and remain open (disposition `open` for CR-01/WR-01/WR-02/IN-01/IN-02/IN-03 in `04-REVIEW-DISPOSITION.md`). Any of: build once in CI before verify, add an artifacts-only mode for CI, or move the full `npm run verify` into `deploy.yml` after its build would resolve the contradiction between D-03 (inspect the built `out/`) and D-12 (no build in CI).

---

_Verified: 2026-11-05T21:05:00Z_
_Verifier: the agent (gsd-verifier)_