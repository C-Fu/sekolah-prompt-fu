---
phase: 28-atmospheric-theming-navigation-routing-integration
plan: 03
subsystem: kids-planets
tags: [planets, routing, telemetry, hud, vitest]
requires:
  - 28-01
  - 28-02
provides:
  - HUD mission launch & bidirectional route resolution for outer planets
affects:
  - Planetary HUD & Explorer navigation
tech-stack:
  added: []
  patterns:
    - Route resolution with origin param preservation
    - Strict internal level route allowlisting
key-files:
  created: []
  modified:
    - src/lib/kids/planets.ts
    - src/__tests__/kids/planetary-hud.test.tsx
    - src/__tests__/kids/planetary-explorer.test.tsx
decisions:
  - "resolveMissionRoute maps outer planets directly to pilot lesson slugs (/level/10-1-sains-benda-hidup, /level/11-1-sejarah-garis-masa, /level/12-1-rbt-bentuk-asas, /level/13-1-psv-warna-imaginasi) with legacy alias support"
metrics:
  duration: 8m
  completed_date: "2026-11-20T03:01:00Z"
status: complete
actuals:
  tokens: 2170
  tasks: 2
  commits: 2
plan_head_before: bffb65064909344a3e3319e3768375464f7c402e
plan_head_after: 66e38432e5c5c2ef79fd83341267059f6a119693
---

# Phase 28 Plan 03: HUD Mission Launch & Bidirectional Routing Summary

Outer world mission launching and route resolution wired for Jupiter, Saturn, Uranus, and Neptune, connecting Feature 1 directly to Year 1 pilot lessons with origin query parameter propagation and protecting unauthored regions (Features 2–7).

## Key Implementations

1. **Outer World Route Resolution (`src/lib/kids/planets.ts`):**
   - Updated `resolveMissionRoute` with explicit mappings for:
     - `jupiter-sains` & `jupiter-astronomy` -> `/level/10-1-sains-benda-hidup`
     - `saturn-sejarah` & `saturn-astronomy` -> `/level/11-1-sejarah-garis-masa`
     - `uranus-rbt` & `uranus-astronomy` -> `/level/12-1-rbt-bentuk-asas`
     - `neptune-psv` & `neptune-astronomy` -> `/level/13-1-psv-warna-imaginasi`
   - Ensured unrecognized IDs safely fall back to `/map` to prevent open redirect vulnerabilities.

2. **Integration Verification & Test Coverage (`planetary-hud.test.tsx`, `planetary-explorer.test.tsx`):**
   - Verified that `PlanetaryHud` renders the active "Start Mission" button for Feature 1 (`hasMission: true`) across all outer planets.
   - Verified that `PlanetaryHud` preserves the inactive notice (`"Belum ada misi untuk kawasan ini"` / `"No mission available for this region yet."`) for Features 2–7 (`hasMission: false`) without active launch buttons.
   - Verified that `PlanetaryExplorer` triggers navigation to `/level/[slug]?origin=planets` upon mission launch for all 4 outer planets.

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- `npx vitest run src/__tests__/kids/planetary-hud.test.tsx src/__tests__/kids/planetary-explorer.test.tsx`: 31/31 passed.
- `npm run check:vocab`: Passed (clean Bahasa Melayu vocabulary guard).
- `npm run check:closure`: Passed (all module specifiers resolved).
- `npx tsc --noEmit`: Passed (clean types).

## Self-Check: PASSED
- FOUND: src/lib/kids/planets.ts
- FOUND: src/__tests__/kids/planetary-hud.test.tsx
- FOUND: src/__tests__/kids/planetary-explorer.test.tsx
- FOUND commit 1e985ae7
- FOUND commit 66e38432
