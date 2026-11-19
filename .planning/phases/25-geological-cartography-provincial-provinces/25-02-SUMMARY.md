---
phase: 25-geological-cartography-provincial-provinces
plan: 02
subsystem: testing
tags:
  - vitest
  - planets
  - planetary-hud
  - outer-planets
  - testing-library
status: complete
requires:
  - "25-01"
provides:
  - "Unit and component test suites validating 63 total planetary features across all 9 solar system worlds"
  - "Telemetry HUD tests certifying outer world province buttons, active feature cards, and mission availability flags"
affects:
  - src/__tests__/kids/planets.test.ts
  - src/__tests__/kids/planetary-hud.test.tsx
tech-stack:
  added: []
  patterns:
    - Vitest unit testing for schema cartography and KSSR year mapping
    - React Testing Library component assertions for localized HUD telemetry cards and province buttons
key-files:
  created: []
  modified:
    - src/__tests__/kids/planets.test.ts
    - src/__tests__/kids/planetary-hud.test.tsx
decisions:
  - "Retained backward compatibility in planetary-hud.test.tsx by testing zero-feature fallback using a mocked planet with empty features array"
  - "Added dedicated outer planet test suite in planetary-hud.test.tsx verifying feature 1 launch button vs features 2-7 localized exploratory notice"
metrics:
  duration: 3m
  completed_date: "2026-11-19T15:25:30Z"
estimate:
  tokens: 35000
  raw_tokens: 35000
  tasks: 2
  confidence: low
actuals:
  tokens: 2408
  tasks: 2
  commits: 2
plan_head_before: aa25007eecea476d53c83dffaafb67f8e92895bd
plan_head_after: 351ad6c6496e9ed44fb476716c16300edcf4e8aa
---

# Phase 25 Plan 02: Synchronize and Expand Vitest Suites for 63 Total Planetary Features Summary

Updated and expanded Vitest test suites in `src/__tests__/kids/planets.test.ts` and `src/__tests__/kids/planetary-hud.test.tsx` to validate 63 total planetary features across all 9 solar system worlds, asserting KSSR year progression, Capstone Boss flags, spherical coordinates, bilingual strings, and HUD mission button behaviors.

## Accomplishments

1. **Updated `planets.test.ts` for 63 Total Planetary Features (GEO-01, GEO-02)**:
   - Expanded assertions from 35 features across 5 core planets to 63 features across all 9 solar system bodies (7 features per world).
   - Validated that features 1-6 map to years 1-6 with `isFinalBoss: false` and feature 7 is a Year 6 Capstone Boss (`isFinalBoss: true`).
   - Verified non-empty bilingual fields (`name`, `nameMs`, `badge`, `badgeMs`, `description`, `descriptionMs`, `geologicalProfile`, `geologicalProfileMs`) and valid spherical coordinate bounds for all 63 features.
   - Updated `getAllPlanetFeatures` assertion to 63 features and added slug lookup tests for Jupiter, Uranus, and Neptune features.

2. **Updated `planetary-hud.test.tsx` for Outer World Telemetry and Mission States**:
   - Preserved backward compatibility for empty-feature worlds by verifying the "Coming Soon" card fallback against an explicitly empty planet mock.
   - Added a dedicated test suite for outer planet HUD rendering using `jupiter-sains`:
     - Confirmed all 7 province buttons render in the sidebar and the active telemetry card displays without the "Coming Soon" card.
     - Verified Feature 1 (`great-red-spot`, `hasMission: true`) renders the Start Mission button and triggers `onLaunchMission`.
     - Verified Features 2-7 (`hasMission: false`) render the localized notice (`"No mission available for this region yet."` in EN, `"Belum ada misi untuk kawasan ini."` in MS) and do not render a launch button.

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- `npx --no-install vitest run src/__tests__/kids/planets.test.ts src/__tests__/kids/planetary-hud.test.tsx`:
  - 2 test files passed, 30 tests passed (18 in `planets.test.ts`, 12 in `planetary-hud.test.tsx`).
- `npm run check:vocab`:
  - Scanned 23 files, passed with 0 vocabulary violations.

## Self-Check: PASSED

- Modified files exist:
  - `src/__tests__/kids/planets.test.ts` (FOUND)
  - `src/__tests__/kids/planetary-hud.test.tsx` (FOUND)
- Commits exist:
  - `48e5aa21` (FOUND)
  - `351ad6c6` (FOUND)
