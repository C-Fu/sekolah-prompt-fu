---
phase: 09-planetary-schema-subject-alignment
plan: 02
subsystem: i18n
tags:
  - i18n
  - planetary-system
  - localization
  - bahasa-melayu
status: complete
requires:
  - "09-01"
provides:
  - "kids.planets localized dictionary namespace in English and Bahasa Melayu"
  - "Cartographic telemetry labels and world titles for 3D HUD (Phase 10)"
affects:
  - messages/en.json
  - messages/ms.json
  - src/__tests__/kids/planets-i18n.test.ts
tech-stack:
  added: []
  patterns:
    - "Symmetric JSON dictionaries with next-intl"
    - "Strict i18n parity testing in Vitest"
key-files:
  created:
    - src/__tests__/kids/planets-i18n.test.ts
  modified:
    - messages/en.json
    - messages/ms.json
decisions:
  - "Use authentic Bahasa Melayu planetary names (Bumi, Bulan, Marikh, Zuhrah, Utarid) without English fallback residue"
  - "Standardize telemetry labels (coordinates, elevation, geology, objective) symmetrically across locales for Phase 10 cartographic modal cards"
metrics:
  duration: 3m
  completed: "2026-11-08T04:43:30Z"
actuals:
  tokens: 15000
  tasks: 2
  commits: 2
  plan_head_before: 8789ac52bea490a8eba3122bbf27123c04675391
  plan_head_after: f3cc19267b3e4f7f7ba0136a79e239eba44c4af0
---

# Phase 09 Plan 02: Planetary i18n Dictionary Parity & Telemetry Strings Summary

Localized bilingual translation dictionaries under `kids.planets` across `messages/en.json` and `messages/ms.json` with authentic Malay astronomy terminology and zero English fallback residue.

## Overview
Added the `kids.planets` dictionary namespace supporting both English and Bahasa Melayu for the 3D Solar System Hub and Geological Cartography interfaces. Built an automated Vitest parity test suite asserting 100% key symmetry, non-empty values, and authentic Bahasa Melayu nomenclature (`Bumi`, `Bulan`, `Marikh`, `Zuhrah`, `Utarid`).

## Key Changes
1. **i18n Parity Test Suite** (`src/__tests__/kids/planets-i18n.test.ts`):
   - Validates existence of `kids.planets` in `messages/en.json` and `messages/ms.json`.
   - Checks symmetry across all 12 top-level keys (`title`, `subtitle`, `hubTitle`, `explorePlanet`, `viewCartography`, `yearBadge`, `capstoneBadge`, `backToOrbit`, `launchMission`, `lockedFeature`, `telemetry`, `worlds`).
   - Asserts non-empty strings and telemetry keys (`coordinates`, `elevation`, `geology`, `objective`).
   - Asserts that all 5 planetary worlds defined in `PLANET_WORLDS` have localized titles and taglines, with authentic Malay terminology.

2. **Bilingual Message Dictionaries** (`messages/en.json` & `messages/ms.json`):
   - Configured localized titles and descriptive taglines for all 5 planetary worlds:
     - Earth (`earth-prompting`) / Bumi: Asas Prompting
     - Moon (`moon-bm`) / Bulan: Bahasa Melayu
     - Mars (`mars-english`) / Marikh: Bahasa Inggeris
     - Venus (`venus-matematik`) / Zuhrah: Matematik
     - Mercury (`mercury-moral`) / Utarid: Pendidikan Moral
   - Added user-facing UI labels for Year badges ("Tahun {year}"), Capstone Boss ("Capstone Boss" / "Cabaran Unggul"), and telemetry labels.

## Verification
- `npx vitest run src/__tests__/kids/planets-i18n.test.ts`: 5 tests passed
- `node scripts/check-ms-vocabulary.js`: passed (24 files scanned, zero forbidden terms)
- `node scripts/check-kids-import-closure.js`: passed (396 modules visited, closed)
- `npm run verify`: passed (tsc clean, vitest passed, 23/23 level routes + / + /map static export NFR-2 certified)

## Deviations from Plan
None - plan executed exactly as written.

## Known Stubs
None.

## Self-Check: PASSED
- FOUND: `src/__tests__/kids/planets-i18n.test.ts`
- FOUND: `messages/en.json`
- FOUND: `messages/ms.json`
- FOUND commit `e2383b57`
- FOUND commit `f3cc1926`
