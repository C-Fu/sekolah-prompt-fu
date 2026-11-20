---
phase: 24-outer-planets-subject-architecture-telemetry
plan: 02
subsystem: planetary-3d-scenes-and-telemetry
status: complete
tags:
  - 3d-scenes
  - cartography
  - planetary-hud
  - telemetry
  - vitest
  - threejs
requires:
  - "24-01"
provides:
  - canonical-3d-outer-planet-ids
  - synced-planetary-hud-telemetry
  - full-green-test-suite
affects:
  - src/components/kids/planets/planet-cartography-scene.ts
  - src/components/kids/planets/solar-system-scene.ts
  - src/components/kids/planets/planetary-hud.tsx
  - src/__tests__/kids/planets.test.ts
  - src/__tests__/kids/planets-i18n.test.ts
  - src/__tests__/kids/solar-system-scene.test.ts
  - src/__tests__/kids/planetary-hud.test.tsx
tech-stack:
  added: []
  patterns:
    - Canonical ID resolution with legacy fallback in Three.js scenes
    - Conditional telemetry card rendering for outer worlds with zero regions
decisions:
  - Render Coming Soon card in PlanetaryHud when subject is astronomy or planet is an outer world (sains, sejarah, rbt, psv) with 0 features.
  - Assert canonical outer planet IDs across all Vitest test suites while preserving Malay localized body names.
metrics:
  duration: 7m
  completed_date: "2026-11-19T22:50:30+08:00"
actuals:
  tokens: 2928
  tasks: 2
  commits: 2
plan_head_before: 2c97dbf2df49c1c843a61b9877f0c4838a1c0d24
plan_head_after: e31e241af494ebce5efc1c38e788bc592bb3b0f5
---

# Phase 24 Plan 02: 3D Scenes, HUD & Test Suite Synchronization Summary

Synchronization of Three.js planetary cartography and solar system overview scenes, the planetary telemetry HUD component, and all test suites to canonical KSSR outer planet IDs.

## Objectives Achieved

1. **Scene Texture and ID Mapping:**
   - Updated `planet-cartography-scene.ts`'s `getPlanetTexturePath` switch block to handle both canonical IDs (`jupiter-sains`, `saturn-sejarah`, `uranus-rbt`, `neptune-psv`) and legacy `*-astronomy` aliases.
   - Updated `solar-system-scene.ts` to configure primary orbit bodies with canonical outer IDs and attached Saturn's ring mesh to `saturn-sejarah` (`ring-saturn-sejarah`).

2. **Telemetry HUD Coming Soon Logic:**
   - Updated `planetary-hud.tsx` so that outer worlds (`['sains', 'sejarah', 'rbt', 'psv'].includes(planet.subjectId) && planet.features.length === 0` or `subjectId === 'astronomy'`) continue rendering the rich `coming-soon-card` without prematurely regressing to `empty-feature-card` or throwing missing feature errors.

3. **Complete Test Suite Synchronization:**
   - Synchronized `planets.test.ts` to validate all 9 solar system celestial bodies, ensuring 5 core worlds have 7 features and 4 outer worlds have 0 features.
   - Synchronized `planets-i18n.test.ts` to check canonical world IDs and authentic Malay translations ("Musytari", "Zuhal", "Uranus", "Neptun").
   - Synchronized `solar-system-scene.test.ts` to verify meshes and Saturn's ring using canonical IDs.
   - Synchronized `planetary-hud.test.tsx` to verify `jupiter-sains` Coming Soon card rendering.
   - Verified that all 32 test files (354 tests) pass with 100% green status in Vitest and TypeScript compiles cleanly with zero diagnostics.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Clarified HUD Coming Soon Condition for Outer Planets**
- **Found during:** Task 2 verification of `planetary-hud.test.tsx`
- **Issue:** Using `planet.subjectId === 'astronomy' || planet.features.length === 0` caused the E3 empty-state test for inner core planets (when mocked with empty features) to render `coming-soon-card` instead of `empty-feature-card`.
- **Fix:** Refined the condition to `planet.subjectId === 'astronomy' || (['sains', 'sejarah', 'rbt', 'psv'].includes(planet.subjectId) && planet.features.length === 0)`.
- **Files modified:** `src/components/kids/planets/planetary-hud.tsx`
- **Commit:** `e31e241a`

## Key Files Created/Modified

- `src/components/kids/planets/planet-cartography-scene.ts`
- `src/components/kids/planets/solar-system-scene.ts`
- `src/components/kids/planets/planetary-hud.tsx`
- `src/__tests__/kids/planets.test.ts`
- `src/__tests__/kids/planets-i18n.test.ts`
- `src/__tests__/kids/solar-system-scene.test.ts`
- `src/__tests__/kids/planetary-hud.test.tsx`

## Self-Check: PASSED

- All 7 modified files exist and have clean git diffs.
- Commits `acb2ad1f` and `e31e241a` are recorded in git history.
- Full Vitest suite passes 32/32 files (354/354 tests).
- `npx tsc --noEmit` runs cleanly.
