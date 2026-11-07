---
phase: 04-verification-testing-polish
plan: 03
subsystem: infra
tags: [verification, nfr-2, ci, gates-only, github-actions, node-stdlib, gap-closure]
gap_closure: true

# Dependency graph
requires:
  - phase: 04-verification-testing-polish
    plan: 01
    provides: "scripts/verify-project.js + npm run verify + the ci.yml tsc/verify step wiring this plan reconciles with D-12"
  - phase: 02-promote-kids-game-to-root-configure-static-export
    provides: "the static out/ export (/, /map, 19 level routes, bundled music) the default full mode still inspects"
provides:
  - "scripts/verify-project.js --gates-only mode — CI can pass on a clean checkout with no out/ (CR-01/Truth 6 closed)"
  - "scripts/verify-project.js runGate finite execSync timeout + timeout-as-gate-failure (WR-02 closed)"
  - "scripts/verify-project.js aggregated absent-out/ verdict (IN-01 folded)"
  - "ci.yml Run verification script → npm run verify -- --gates-only; standalone Run tests step removed (WR-01 closed)"
  - "phase tests updated to the gates-only + single-suite-run contract"
affects: [VERIFICATION, ci, deploy]

# Actuals (#2632) — chars/4 over the realized diff (same scale as the plan estimate)
actuals:
  tokens: 4927
  tasks: 3
  commits: 3
  plan_head_before: 1af0d2843539b5cc13a0aa140ee0300b8f9b2318
  plan_head_after: 2aa728dde74142de5ca9b09535bf8cd3ac1a8d00

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Flag-scoped certification: a --gates-only CLI mode opts CI out of the artifact-inspection portion while the default keeps full D-03 certification"
    - "Bounded gate: every certified gate runs under a finite execSync timeout that surfaces a timeout as an actionable gate failure"
    - "Aggregated fail-loud verdict: an absent out/ is collected into `problems` and reported in the structured FAILED block, never an early exit"

key-files:
  modified:
    - scripts/verify-project.js
    - .github/workflows/ci.yml
    - src/__tests__/scripts/verify-project.test.ts
    - src/__tests__/scripts/workflows.test.ts

key-decisions:
  - "Route 2 taken: add --gates-only to verify-project.js rather than build-in-CI (would supersede D-12) or move verify into deploy.yml (D-13 risk) — zero locked-decision departures"
  - "Default (no-flag) mode keeps inspecting out/ and keeps hard-failing on absent out/ — D-03 untouched; the CI invocation alone opts out"
  - "PASS verdict names the mode (gates-only vs full) so a green gates-only run is not mistaken for a full artifact certification (T-04-07)"
  - "IN-02 (assert out/ isDirectory) and IN-03 (short-circuit npm test) explicitly deferred with recorded rationale"

patterns-established:
  - "Mode-scoped exit-code gate: same script, explicit flag selects the certified gate subset; no silent pass when out/ is absent in default mode"

requirements-completed: [NFR-2]

coverage:
  - id: D1
    description: "scripts/verify-project.js --gates-only mode: runs the two certified gates and skips out/ inspection (exits 0 with no out/); default mode unchanged and still fails on absent out/ via the aggregated verdict; runGate has a finite timeout; unknown flags rejected loudly"
    requirement: "NFR-2"
    verification:
      - kind: other
        ref: "node scripts/verify-project.js --gates-only (out absent) → EXIT=0 + gates-only PASS verdict"
        status: pass
      - kind: other
        ref: "node scripts/verify-project.js (out absent) → EXIT=1 + ❌ NFR-2 certification FAILED block"
        status: pass
      - kind: other
        ref: "node scripts/verify-project.js --bogus → EXIT=1 + usage naming --gates-only"
        status: pass
    human_judgment: false
  - id: D2
    description: "ci.yml Run verification script → npm run verify -- --gates-only; standalone Run tests step removed (one suite run); no build step; deploy.yml byte-identical"
    requirement: "NFR-2"
    verification:
      - kind: other
        ref: "node -e '<ci.yml assertion>' → ci.yml gates-only OK"
        status: pass
      - kind: other
        ref: "git diff --quiet HEAD -- .github/workflows/deploy.yml (exit 0, byte-identical)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Phase tests assert the gates-only CLI contract and the single-suite-run CI contract; IN-01 covered; IN-02/IN-03 deferred with rationale"
    requirement: "NFR-2"
    verification:
      - kind: other
        ref: "npx vitest run src/__tests__/scripts/verify-project.test.ts src/__tests__/scripts/workflows.test.ts → 25/25 passed"
        status: pass
      - kind: other
        ref: "npm test → 119/119 passed (baseline 94 + phase tests)"
        status: pass
    human_judgment: false

# Metrics
duration: 8min
completed: 2026-11-05
status: complete
---

# Phase 4 Plan 03: CI Gates-Only Mode & Gap Closure Summary

**Closes the single Phase-4 gap (Truth 6 / CR-01) by adding a `--gates-only` mode to `scripts/verify-project.js` — CI now runs `npm run verify -- --gates-only` and passes green-by-construction on a clean checkout with no `out/`, while the default full mode keeps inspecting `out/` (D-03), the build stays solely in `deploy.yml` (D-12, byte-identical D-13), and the Vitest suite runs exactly once (WR-01), with a bounded gate timeout (WR-02) and an aggregated absent-`out/` verdict (IN-01).**

## Performance

- **Duration:** 8 min
- **Tasks:** 3
- **Files modified:** 4
- **Commits:** 3 task commits (+ plan-metadata commit)

## Accomplishments

- `scripts/verify-project.js` — new `--gates-only` mode runs ONLY the two certified gates (`npx tsc --noEmit`, `npm test`) and skips the `out/` inspection, so it exits 0 on a clean checkout with no `out/`. Default (no-flag) behavior is preserved: it still inspects the built `out/` tree and still hard-fails when it is absent (now via the aggregated verdict). Unknown flags are rejected loudly with a usage line naming `--gates-only`. `runGate` now passes `timeout: 5 * 60 * 1000` and surfaces a timeout as a named gate failure. The PASS line states which mode ran so a green gates-only run is not mistaken for full artifact certification.
- `.github/workflows/ci.yml` — the `Run verification script` step now runs `npm run verify -- --gates-only` (CR-01 closed: the step passes on a clean checkout); the standalone `Run tests` step is removed so the suite runs once, inside the gates-only verify (WR-01). No build step added (D-12).
- `src/__tests__/scripts/verify-project.test.ts` — `runVerify` extended to accept extra argv; new `--gates-only` describe block (absent `out/` does not hard-fail; no artifact inspection when `out/` absent or present; unknown-flag usage); IN-01 aggregated-verdict test; gates-only D-12 no-build variant; IN-02/IN-03 deferral rationale recorded in the header.
- `src/__tests__/scripts/workflows.test.ts` — CI contract updated: asserts the gates-only `run:` value, no standalone `Run tests` step, and the verification step's ordering after the type-check/lint/vocabulary-guard steps.

## Task Commits

Each task was committed atomically:

1. **Task 1: `--gates-only` mode + timeout + aggregated verdict** - `aeead7c4` (feat)
2. **Task 2: Point CI at gates-only, drop duplicate test step** - `db0ab32a` (ci)
3. **Task 3: Update phase tests to the new contract** - `2aa728dd` (test)

**Measured commits:** `git rev-list --count 1af0d284..2aa728dd` = 3; plan_head_before `1af0d284`, plan_head_after `2aa728dd`.

## Files Created/Modified

- `scripts/verify-project.js` (modified) — arg parse (`--gates-only` + loud unknown-flag rejection), gates-only vs full branch, conditional artifact-inspection block, `runGate` finite timeout + timeout detection, aggregated absent-`out/` verdict (IN-01), mode-naming PASS line, updated docblock.
- `.github/workflows/ci.yml` (modified) — `Run verification script` → `npm run verify -- --gates-only`; standalone `Run tests` step removed; no build step; other steps unchanged.
- `src/__tests__/scripts/verify-project.test.ts` (modified) — `runVerify(cwd, args?)`; `--gates-only` describe block; IN-01 aggregated-verdict test; gates-only D-12 no-build test; deferral notes.
- `src/__tests__/scripts/workflows.test.ts` (modified) — gates-only `run:` assertion, single-suite-run assertion, verification-step ordering assertion.

## Decisions Made

- **Route 2 taken (recorded, load-bearing):** add a `--gates-only` mode to `scripts/verify-project.js`. It preserves D-03 (default full mode still inspects `out/`), D-12 (no build in CI or the script), and D-13 (`deploy.yml` byte-identical) with zero locked-decision departures. Route 1 (build in CI) would supersede D-12; Route 3 (verify in `deploy.yml`) would risk D-13.
- **IN-01 folded opportunistically:** the absent-`out/` case now collects into `problems` and falls through to the shared FAILED verdict block instead of an early `process.exit(1)`; the rest of the inspection block is guarded so no redundant "missing …" cascade follows.
- **IN-02 / IN-03 deferred:** IN-02 (`statSync().isDirectory()`) would change default-mode behaviour beyond gap-closure scope and is called informational in `04-REVIEW.md:112`; IN-03 (`npm test` short-circuit) is "Informational only" (`04-REVIEW.md:118`) and reporting both gates is the more useful certification output.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. The absent-`out/` paths were probed by temporarily moving `out/` aside and were restored immediately (verified `out/index.html` present).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The Phase-4 gap is closed: `ci.yml`'s certification step runs `npm run verify -- --gates-only` and passes on a clean checkout with no `out/` (Truth 6 / CR-01). The suite runs once (WR-01); `runGate` is bounded (WR-02); absent `out/` aggregates into the FAILED verdict (IN-01).
- Locked decisions honored: D-03 (full mode inspects `out/`), D-12 (no build in CI or script), D-13 (`deploy.yml` byte-identical).
- Full suite green: 119/119 (`npm test`), including 25/25 in the two phase test files.
- Remaining human-verification item (unchanged): a live GitHub Actions run of the `CI / Test` job to confirm the green-by-construction step.

## Threat Flags

None — the plan's threat register mitigations were honored: T-04-07 (gate is not a rubber stamp: both certified gates still run, PASS line names gates-only mode, default mode still fails loud on absent `out/`, asserted by tests), T-04-08 (finite timeout bounds a hung gate; gate commands remain static literals), T-04-09 (only the literal `--gates-only` recognised; unknown flags rejected loudly; no argv interpolation into a shell). T-04-SC accepted: no packages installed.

---

*Phase: 04-verification-testing-polish*
*Completed: 2026-11-05*

## Self-Check: PASSED

- FOUND: scripts/verify-project.js
- FOUND: .github/workflows/ci.yml
- FOUND: src/__tests__/scripts/verify-project.test.ts
- FOUND: src/__tests__/scripts/workflows.test.ts
- FOUND commit: aeead7c4
- FOUND commit: db0ab32a
- FOUND commit: 2aa728dd