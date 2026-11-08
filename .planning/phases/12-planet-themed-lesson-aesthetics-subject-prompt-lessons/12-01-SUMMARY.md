---
phase: 12-planet-themed-lesson-aesthetics-subject-prompt-lessons
plan: 01
subsystem: ui-theming-and-curriculum-registry
tags: [kids, celestial-themes, curriculum, planets, vitest, mdx]
status: complete
requires:
  - 09-01
  - 11-02
provides:
  - dynamic-celestial-lesson-backgrounds
  - realigned-23-level-curriculum
affects:
  - src/components/kids/layout/planet-background.tsx
  - src/components/kids/layout/level-content-wrapper.tsx
  - src/app/layout.tsx
  - src/lib/kids/levels.ts
  - src/lib/kids/planets.ts
  - src/lib/kids/level-content.ts
  - messages/en.json
  - messages/ms.json
tech-stack:
  added: []
  patterns:
    - Dynamic contextual client styling resolved from active LevelContext slug
    - Fail-closed Earth default fallback for unmapped/external slugs
    - Strict 1-to-1 curriculum-cartography parity across Worlds 1-9
key-files:
  created:
    - src/components/kids/layout/planet-background.tsx
    - src/__tests__/kids/planet-background.test.tsx
  modified:
    - src/app/layout.tsx
    - src/components/kids/layout/level-content-wrapper.tsx
    - src/lib/kids/levels.ts
    - src/lib/kids/planets.ts
    - src/lib/kids/level-content.ts
    - messages/en.json
    - messages/ms.json
    - src/content/kids/en/7-1-english-colorful-toys.mdx
    - src/content/kids/ms/7-1-english-colorful-toys.mdx
    - src/content/kids/en/8-1-matematik-tambah-bintang.mdx
    - src/content/kids/ms/8-1-matematik-tambah-bintang.mdx
    - src/content/kids/en/9-1-moral-sahabat-prihatin.mdx
    - src/content/kids/ms/9-1-moral-sahabat-prihatin.mdx
    - src/__tests__/kids/level-locale.test.tsx
decisions:
  - Implemented PlanetBackground client component with dynamic celestial theming for Earth, Moon, Mars, Venus, and Mercury with strict Earth fallback.
  - Realigned curriculum registry to 23 levels across Worlds 1-9 (Earth Worlds 1-5, Moon World 6, Mars World 7, Venus World 8, Mercury World 9), retiring legacy Science and World 10.
metrics:
  duration: 9m
  completed_date: "2026-11-08"
actuals:
  tokens: 11382
  tasks: 2
  commits: 2
  plan_head_before: 3599c1e79b37729c1220e33b873a8e4672216ca1
  plan_head_after: 4ac029820d63e917cd64bb13f28f36a6f21d0f37
---

# Phase 12 Plan 01: Planet-Themed Lesson Aesthetics & Curriculum Realignment Summary

Dynamic celestial lesson theming (Earth daytime clouds, Moon cosmic slate, Mars rust-red haze, Venus sulfur amber glow, Mercury violet dusk) and realigned 23-level curriculum across Worlds 1–9.

## One-Liner
Dynamic celestial planetary backgrounds mounted across lesson routes and full curriculum realignment to 23 levels across Worlds 1–9 matching Phase 09 cartography.

## Objectives Achieved
1. **Dynamic Celestial Theming (THEME-01, D-01)**:
   - Created `PlanetBackground` client component in `src/components/kids/layout/planet-background.tsx`.
   - Wired `PlanetBackground` into `src/app/layout.tsx` replacing static sky background.
   - Updated `src/components/kids/layout/level-content-wrapper.tsx` to read active world/planet `accentColor` and tint the navigation footer and layout borders dynamically.
   - Verified with 14 unit tests in `src/__tests__/kids/planet-background.test.tsx`.

2. **Curriculum Realignment (PEDAG-01, D-02)**:
   - Realigned `src/lib/kids/levels.ts` to exactly 23 levels across 9 Worlds:
     - Worlds 1-5: Earth Foundational Prompting Academy (19 levels)
     - World 6: Moon (`Bulan: Bahasa Melayu` -> `6-1-bm-kucing-peromfu`)
     - World 7: Mars (`Marikh: Bahasa Inggeris` -> `7-1-english-colorful-toys`)
     - World 8: Venus (`Zuhrah: Matematik` -> `8-1-matematik-tambah-bintang`)
     - World 9: Mercury (`Utarid: Pendidikan Moral` -> `9-1-moral-sahabat-prihatin`)
   - Retired legacy World 7 Sains and obsolete World 10.
   - Renamed and harmonized MDX content files for English and Moral.
   - Updated `resolveMissionRoute` in `src/lib/kids/planets.ts` to route missions to `/level/7-1-english-colorful-toys` and `/level/9-1-moral-sahabat-prihatin`.
   - Reindexed loaders in `src/lib/kids/level-content.ts` and bilingual catalogs in `messages/en.json` and `messages/ms.json`.
   - Updated test suite in `src/__tests__/kids/level-locale.test.tsx` verifying static parameter generation and closure for 23 levels.

## Verification
- Unit test suite passed:
  - `src/__tests__/kids/planet-background.test.tsx`: 14 passed
  - `src/__tests__/kids/level-locale.test.tsx`: 38 passed
  - `src/__tests__/kids/planets.test.ts`: 15 passed
- Kids import closure check: `node scripts/check-kids-import-closure.js` passed (23 MDX slugs, 406 modules visited).
- TypeScript check: `npx tsc --noEmit` exited 0.

## Deviations from Plan
- None - plan executed exactly as written.

## Threat Flags
None. All routes and themes adhere strictly to the threat model whitelist (T-12-01 and T-12-02).

## Self-Check: PASSED
- FOUND: `src/components/kids/layout/planet-background.tsx`
- FOUND: `src/__tests__/kids/planet-background.test.tsx`
- FOUND commit `ab60fba7` (Task 1)
- FOUND commit `4ac02982` (Task 2)
