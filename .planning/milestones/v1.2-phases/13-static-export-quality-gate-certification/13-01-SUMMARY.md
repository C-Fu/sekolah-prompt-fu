---
phase: 13-static-export-quality-gate-certification
plan: 01
subsystem: quality-gates-certification
tags: [static-export, eslint, vitest, tsc, quality-gate, certification]
requires:
  - phase: 09-planetary-schema-subject-cartography
  - phase: 10-3d-planetary-explorer-threejs
  - phase: 11-game-flow-navigation-rocket-return
  - phase: 12-theme-styling-pedagogical-guardrails
provides:
  - hardened-verification-script
  - clean-lint-zero-errors
  - certified-static-export
affects:
  - scripts/verify-project.js
  - src/__tests__/scripts/verify-project.test.ts
  - src/components/kids/planets/planetary-hud.tsx
  - src/__tests__/kids/planets-i18n.test.ts
  - src/__tests__/kids/header-navigation.test.tsx
  - src/__tests__/kids/home-navigation.test.tsx
  - src/lib/kids/planets.ts
  - src/__tests__/kids/planetary-hud.test.tsx
  - vitest.config.ts
tech-stack:
  added: []
  patterns:
    - strict-static-route-assertion
    - typed-test-mocks-and-dictionaries
decisions:
  - "scripts/verify-project.js strictly asserts out/planets/index.html along with /, /map, 23 level routes, and kids-music.mp3."
  - "Eliminated all 13 ESLint errors across the codebase without disabling rules or introducing eslint-disable comments."
  - "Bumped vitest testTimeout to 15000ms to eliminate CPU contention timeouts on compiled-MDX test suites during full-suite runs."
status: complete
actuals:
  tokens: 45000
  tasks: 3
  commits: 5
  plan_head_before: be1eb006c845153ecad41d9b74c4e83e86cbb998
  plan_head_after: 539fa36d1cf797ad3e7f8c60a4834598d281d5fc
metrics:
  duration: 19m
  completed_date: "2026-11-08"
---

# Phase 13 Plan 01: Static Export Quality Gate Certification Summary

Comprehensive Milestone v1.2 quality gate certification: expanded `scripts/verify-project.js` to assert `/planets` static route, resolved all ESLint errors across components and tests, tuned test timeouts, and certified 100% green static export pipeline.

## Overview

Milestone v1.2 introduced the 3D Planetary Hub, subject cartography, navigation bridges, and subject-specific lesson stages. Plan 13-01 delivers the final quality gate and export certification:
1. Hardened `scripts/verify-project.js` to assert `out/planets/index.html` as a required artifact and updated its unit tests in `src/__tests__/scripts/verify-project.test.ts`.
2. Cleaned up all 13 ESLint errors and warnings across `planetary-hud.tsx`, navigation test mocks, `planets-i18n.test.ts`, and `planets.ts`.
3. Executed the complete project certification pipeline (`tsc --noEmit`, Vitest, `check:closure`, `check:vocab`, `npm run lint`, `npm run build`, and `npm run verify`), verifying that all quality gates pass cleanly with exit code 0.

## Tasks Completed

### Task 1: Expand static route verification in scripts/verify-project.js and verify-project.test.ts
- Added `requireArtifact("planets/index.html", "/planets route")` in `scripts/verify-project.js`.
- Updated full-mode PASS verdict string to record `/, /map, and /planets`.
- Extended `makeSandbox` in `src/__tests__/scripts/verify-project.test.ts` to support `planetsIndex` and added a unit test asserting that missing `out/planets/index.html` triggers a non-zero exit code.
- Removed unused `beforeAll` import.
- **Commit:** `0cfb9217` — `feat(13-01): assert /planets static route in verify-project.js and unit tests`

### Task 2: Resolve ESLint errors and warnings across components, utilities, and tests
- Fixed raw comment textnode syntax `{celestialName}{" // "}{planetTitle}` in `src/components/kids/planets/planetary-hud.tsx`.
- Defined clean typed dictionary interfaces in `src/__tests__/kids/planets-i18n.test.ts` eliminating 9 `as any` casts.
- Cleanly typed `next/link` mock props with `React.AnchorHTMLAttributes<HTMLAnchorElement>` in `header-navigation.test.tsx` and `home-navigation.test.tsx`.
- Removed unused variable `idx` in `src/__tests__/kids/planetary-hud.test.tsx`.
- Cleaned up parameter typing in `resolveMissionRoute` in `src/lib/kids/planets.ts`.
- **Commits:**
  - `444e5a9d` — `fix(13-01): resolve all ESLint errors across components, tests, and utilities`
  - `1779ce54` — `fix(13-01): support optional feature parameter in resolveMissionRoute`

### Task 3: Execute full end-to-end quality gates and static export certification
- Fixed Vitest CPU-contention timeouts on heavy compiled-MDX test suites during full-suite runs by adjusting `testTimeout: 15000` in `vitest.config.ts`.
- Executed `npx tsc --noEmit` -> 0 errors.
- Executed `npm test` -> 21 test files passed, 245 tests passed (100% pass rate).
- Executed `npm run check:closure` -> 406 modules visited, import closure complete.
- Executed `npm run check:vocab` -> 23 files scanned, 0 Malay vocabulary violations.
- Executed `npm run lint` -> 0 errors.
- Executed `npm run build` -> Turbopack static export built 31 static/SSG routes including `/planets` and all 23 level routes.
- Executed `npm run verify` -> `✅ NFR-2 certified: tsc pass, vitest pass, 23 level routes, /, /map, and /planets, bundled media (full — out/ inspected)`.
- Audited and updated `.planning/REQUIREMENTS.md` satisfying GATE-01 and GATE-02.
- **Commits:**
  - `db639fb0` — `chore(test): set vitest testTimeout to 15s to prevent timeouts during full suite`
  - `539fa36d` — `docs(13-01): certify GATE-01 and GATE-02 requirements in REQUIREMENTS.md`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Parameter count mismatch in resolveMissionRoute**
- **Found during:** Task 2 verification (`npx tsc --noEmit`).
- **Issue:** Removing `_feature` completely caused TypeScript error TS2554 in `planetary-explorer.tsx` which calls `resolveMissionRoute(activePlanet.id, feature)`.
- **Fix:** Kept `feature?: PlanetFeature` optional with `void feature;` comment in `resolveMissionRoute`.
- **Files modified:** `src/lib/kids/planets.ts`
- **Commit:** `1779ce54`

**2. [Rule 3 - Blocking Issue] Vitest 5000ms test timeout during parallel full suite execution**
- **Found during:** Task 3 verification (`npm test`).
- **Issue:** Under full-suite load (21 test files), several heavy compiled-MDX tests timed out at exactly 5000ms despite passing when run individually.
- **Fix:** Added `testTimeout: 15000` to `vitest.config.ts`.
- **Files modified:** `vitest.config.ts`
- **Commit:** `db639fb0`

## Verification Results

| Gate | Command | Result |
|------|---------|--------|
| TypeScript Check | `npx tsc --noEmit` | Exit code 0, 0 errors |
| Test Suite | `npm test` | 21/21 files passed, 245/245 tests passed |
| Unit Tests (verify-project) | `npx vitest run src/__tests__/scripts/verify-project.test.ts` | 17/17 tests passed |
| Import Closure | `npm run check:closure` | 406 modules visited, closed |
| Malay Vocabulary Guard | `npm run check:vocab` | 23/23 files clean |
| ESLint Check | `npm run lint` | 0 errors |
| Static Build | `npm run build` | Turbopack export succeeded, 31 routes emitted in `out/` |
| Project Certifier | `npm run verify` | NFR-2 certified with exit code 0 |

## Self-Check: PASSED
- [x] `scripts/verify-project.js` exists and asserts `/planets`
- [x] `src/__tests__/scripts/verify-project.test.ts` exists and tests missing `/planets`
- [x] Commit `0cfb9217` exists in history
- [x] Commit `444e5a9d` exists in history
- [x] Commit `1779ce54` exists in history
- [x] Commit `db639fb0` exists in history
- [x] Commit `539fa36d` exists in history
