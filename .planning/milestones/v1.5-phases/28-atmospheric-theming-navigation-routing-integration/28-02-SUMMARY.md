---
phase: 28-atmospheric-theming-navigation-routing-integration
plan: 02
subsystem: kids-curriculum
tags:
  - levels
  - dynamic-import
  - section-titles
  - i18n
  - vitest
dependency_graph:
  requires:
    - 28-01
  provides:
    - 28-03
  affects:
    - levels-registry
    - level-content-loaders
    - section-titles-registry
    - i18n-dictionaries
tech-stack:
  added: []
  patterns:
    - Dynamic MDX lazy-loaders map per locale
    - Strict non-fallback section title lookup
    - Dynamic total levels calculation
key-files:
  created: []
  modified:
    - src/lib/kids/levels.ts
    - src/lib/kids/level-content.ts
    - src/lib/kids/section-titles.ts
    - messages/en.json
    - messages/ms.json
    - src/__tests__/kids/section-titles.test.ts
    - src/__tests__/kids/level-locale.test.tsx
decisions:
  - "Expanded total levels dynamically from 23 to 27 by registering Worlds 10 (Musytari: Sains), 11 (Zuhal: Sejarah), 12 (Uranus: RBT), and 13 (Neptun: PSV) with their Year 1 pilot levels."
  - "Preserved explicit static dictionary loader functions in level-content.ts to eliminate arbitrary string interpolation and guarantee static analyzer closure."
  - "Registered all 8 stage section titles per lesson in section-titles.ts for both en and ms, strictly matching authored MDX headings."
metrics:
  duration: 4m 30s
  completed_date: "2026-11-20"
actuals:
  tokens: 35000
  tasks: 3
  commits: 3
plan_head_before: ee46a8d82d4e0e4fd429bd9beac98bc3e9592442
plan_head_after: 280776a6d8b5312d3b53804d76b5fa1e697ee32f
status: complete
---

# Phase 28 Plan 02: Global Level Registry & Lazy Content Loading Expansion Summary

Expanded application level corpus from 23 to 27 levels across Worlds 10–13 with lazy MDX dynamic loaders, localized section titles, bilingual translation bundles, and synchronized Vitest suites.

## Overview of Changes

1. **Levels Registry & i18n Messages (`src/lib/kids/levels.ts`, `messages/en.json`, `messages/ms.json`):**
   - Added World 10: Musytari: Sains (`musytari-sains`, color `amber`, emoji `🟠`) with Level `10-1-sains-benda-hidup`.
   - Added World 11: Zuhal: Sejarah (`zuhal-sejarah`, color `yellow`, emoji `🪐`) with Level `11-1-sejarah-garis-masa`.
   - Added World 12: Uranus: Reka Bentuk & Teknologi (`uranus-rbt`, color `cyan`, emoji `🧊`) with Level `12-1-rbt-bentuk-asas`.
   - Added World 13: Neptun: Pendidikan Seni Visual (`neptun-psv`, color `blue`, emoji `🎨`) with Level `13-1-psv-warna-imaginasi`.
   - `getTotalLevels()` now dynamically resolves to 27.
   - Symmetrically registered world titles and level titles & descriptions in English and Bahasa Melayu dictionaries.

2. **Lazy Dynamic MDX Loaders & Section Titles (`src/lib/kids/level-content.ts`, `src/lib/kids/section-titles.ts`):**
   - Registered explicit static dynamic loaders `L_en__*` and `L_ms__*` for all 4 lessons.
   - Wired `loaders.en` and `loaders.ms` dictionary entries.
   - Registered 8 ordered stage section titles per lesson for both `en` and `ms` in `ALL_LESSON_SECTION_TITLES`.
   - Verified static closure with `npm run check:closure` (27 slugs, 420 visited modules, 0 unresolved specifiers).

3. **Test Suite Synchronization (`src/__tests__/kids/section-titles.test.ts`, `src/__tests__/kids/level-locale.test.tsx`):**
   - Expanded `ALL_23_LESSON_SLUGS` to `ALL_27_LESSON_SLUGS`.
   - Updated `generateStaticParams` and `effectiveLocale` assertions in `level-locale.test.tsx` from 23 to 27.
   - All 57 tests across both test suites pass without regressions.

## Verification

- `node -e 'const { getTotalLevels } = require("./src/lib/kids/levels.ts"); console.log(getTotalLevels());'` -> output: `27`
- `npm run check:closure` -> PASSED (27 MDX slugs, 420 modules visited, closure closed)
- `npx vitest run src/__tests__/kids/section-titles.test.ts src/__tests__/kids/level-locale.test.tsx` -> PASSED (57 tests passed)
- `npx tsc --noEmit` -> PASSED (0 errors)

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED
- FOUND: src/lib/kids/levels.ts
- FOUND: src/lib/kids/level-content.ts
- FOUND: src/lib/kids/section-titles.ts
- FOUND: messages/en.json
- FOUND: messages/ms.json
- FOUND: src/__tests__/kids/section-titles.test.ts
- FOUND: src/__tests__/kids/level-locale.test.tsx
- FOUND commit a08c74a0
- FOUND commit 0b556adf
- FOUND commit 280776a6
