---
phase: 04-verification-testing-polish
plan: 01
subsystem: infra
tags: [verification, nfr-2, tsc, vitest, static-export, github-actions, node-stdlib]

# Dependency graph
requires:
  - phase: 02-promote-kids-game-to-root-configure-static-export
    provides: static `out/` export (/, /map, 19 level routes, bundled music) inspected by the verifier
  - phase: 03-bahasa-melayu-ms-localization
    provides: 94/94 Vitest baseline and the Node-stdlib guard-script convention followed here
provides:
  - "scripts/verify-project.js — committed, rerunnable NFR-2 certification script (source of truth, D-04)"
  - "npm run verify — single-command certification exposed from package.json (D-12)"
  - "ci.yml — tsc --noEmit step + npm run verify step so CI and local certification share the gate set (D-10/D-11)"
affects: [04-02, HANDOFF, deploy]

# Actuals (#2632)
actuals:
  tokens: 1768
  tasks: 3
  commits: 3

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Exit-code gate convention: deterministic Node-stdlib script, exit 0 on pass / non-zero on fail, loud refusal on an absent/empty check set"
    - "Read-only verification: the verifier inspects artifacts and runs gates but never mutates the tree"
    - "Bounded NFR-2 claim set: certified gates are exactly tsc + vitest + out/ inspection"

key-files:
  created:
    - scripts/verify-project.js
  modified:
    - package.json
    - .github/workflows/ci.yml

key-decisions:
  - "verify script deliberately excludes `npm run build` (D-12); it inspects the already-built out/ tree read-only, so CI does not double-build"
  - "level-slug set derived from src/lib/kids/levels.ts at run time (regex /^\\d-\\d-/), not hard-coded"
  - "deploy.yml left byte-identical to HEAD (D-13) — no gates added to the deploy workflow"

patterns-established:
  - "Certification-as-script: NFR-2 is proven by a committed rerunnable script, not a hand-written report"
  - "Fail-loud on empty/absent set: absent out/ or an empty derived slug set exits non-zero instead of passing silently"

requirements-completed: [NFR-2, FR-1, FR-4]

coverage:
  - id: D1
    description: "scripts/verify-project.js — committed Node-stdlib certification script that runs tsc + vitest and inspects out/ (/, /map, 19 level routes, bundled media), prints PASS/FAIL, exits non-zero on failure, never runs the build"
    requirement: "NFR-2"
    verification:
      - kind: other
        ref: "node scripts/verify-project.js (exit 0, ✅ PASS)"
        status: pass
      - kind: other
        ref: "mv out /tmp && node scripts/verify-project.js (exit 1, loud refusal) — probe restored out/"
        status: pass
    human_judgment: false
  - id: D2
    description: "npm run verify — package.json exposes the certification script; exits 0 against a built tree (D-12)"
    requirement: "NFR-2"
    verification:
      - kind: other
        ref: "npm run verify (exit 0, ✅ PASS)"
        status: pass
    human_judgment: false
  - id: D3
    description: "ci.yml hardened with a Run TypeScript type check step (npx tsc --noEmit) placed after Install dependencies/before Run linter, and a Run verification script step (npm run verify) placed last; no build step; deploy.yml untouched"
    requirement: "NFR-2"
    verification:
      - kind: other
        ref: "node -e '<ci.yml assertion>' → ci.yml hardened OK"
        status: pass
      - kind: other
        ref: "git diff --quiet HEAD -- .github/workflows/deploy.yml (exit 0, untouched)"
        status: pass
    human_judgment: false

# Metrics
duration: 3min
completed: 2026-11-05
status: complete
---

# Phase 4 Plan 01: NFR-2 Certification Script & CI Hardening Summary

**Committed Node-stdlib `scripts/verify-project.js` that re-runs `npx tsc --noEmit` + Vitest and inspects the built `out/` export (19 level routes + `/` + `/map` + bundled media), exposed as `npm run verify` and wired into `ci.yml` alongside a new tsc step — NFR-2 certified end-to-end.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-11-05T12:19:20Z
- **Completed:** 2026-11-05T12:22:26Z
- **Tasks:** 3
- **Files modified:** 3 (1 created, 2 modified)

## Accomplishments
- `scripts/verify-project.js` — read-only, Node-stdlib-only (fs/path/child_process) certification script: runs the two certified gates (`npx tsc --noEmit`, `npm test`) and inspects the already-built `out/` artifact set (root `/`, `/map`, 19 level routes derived from the registry, `kids-music.mp3`), then prints a `✅`/`❌` verdict with `process.exit(0)`/`process.exit(1)`.
- `npm run verify` — the single-command certification entry point (D-12); exits 0 against the built tree with the identical PASS verdict as the direct script invocation.
- `.github/workflows/ci.yml` — added `Run TypeScript type check` (`npx tsc --noEmit`, fast-fail before lint) and `Run verification script` (`npm run verify`, last) so CI and local certification share the exact gate set; no build step added and `deploy.yml` left untouched (D-12/D-13).

## Task Commits

Each task was committed atomically:

1. **Task 1: End-to-end verify script** - `de59019d` (feat)
2. **Task 2: Expose as `npm run verify`** - `6449fc40` (feat)
3. **Task 3: Harden `ci.yml`** - `d05c318f` (ci)

**Plan metadata:** see the final docs commit below.

## Files Created/Modified
- `scripts/verify-project.js` (created) — NFR-2 certification script; `runGate(label, command)`, `deriveLevelSlugs()`, `main()`; refuses silently-passing on absent `out/` or empty derived slug set; never runs `npm run build`.
- `package.json` (modified) — added `"verify": "node scripts/verify-project.js"` after `lint:ms`; no other script changed.
- `.github/workflows/ci.yml` (modified) — added the tsc and verify steps; the six pre-existing steps are unchanged.

## Decisions Made
- Verify script excludes `npm run build` (D-12) and inspects the pre-built `out/` tree read-only, keeping the build solely in `deploy.yml` so CI does not build twice.
- The 19-slug set is derived from `src/lib/kids/levels.ts` text (`slug: "…"` where the value matches `/^\d-\d-/`) rather than hard-coded, and the script exits 1 if the derived set is empty (fail-loud, mirrors `check-ms-vocabulary.js:80-85`).
- Certified gate set kept bounded to exactly tsc + vitest + `out/` inspection (D-02) — lint/`lint:mdx`/guards are not advertised as NFR-2 gates.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. The `out/` tree was already present; the absent-`out/` failure path was probed by temporarily moving `out/` aside and was restored immediately (verified `ls out/index.html`).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 04-02 (HANDOFF.md + NFR-2 certification notes) can proceed: `npm run verify` is the rerunnable certification source of truth, and `ci.yml` now enforces the identical gate set.
- Plan-level verification reproduced: `npx tsc --noEmit` exit 0; `npm test` 94/94 pass; `npm run verify` exit 0 (PASS); `ci.yml` assertion `ci.yml hardened OK`; `deploy.yml` byte-identical to HEAD.
- Known non-blocking advisories (WR-04, IN-03) remain open and unfixed per D-08 — handed off in 04-02, not addressed here.

---
*Phase: 04-verification-testing-polish*
*Completed: 2026-11-05*

## Self-Check: PASSED

- FOUND: scripts/verify-project.js
- FOUND: package.json
- FOUND: .github/workflows/ci.yml
- FOUND: .planning/phases/04-verification-testing-polish/04-01-SUMMARY.md
- FOUND commit: de59019d
- FOUND commit: 6449fc40
- FOUND commit: d05c318f