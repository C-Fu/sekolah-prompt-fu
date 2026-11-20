---
phase: 24-outer-planets-subject-architecture-telemetry
plan: 01
status: complete
subsystem: kids-planets
tags:
  - planets
  - kssr
  - telemetry
  - i18n
requires:
  - 19-01
provides:
  - canonical-outer-planet-ids
  - outer-planet-kssr-subjects
  - outer-planet-i18n-dictionaries
affects:
  - 24-02
tech-stack:
  added: []
  patterns:
    - Canonical vs Legacy ID normalization for backward compatibility
    - Symmetric bilingual translation dictionary expansion
key-files:
  created: []
  modified:
    - src/lib/kids/planets.ts
    - messages/en.json
    - messages/ms.json
decisions:
  - "Adopted canonical IDs ('jupiter-sains', 'saturn-sejarah', 'uranus-rbt', 'neptune-psv') in PLANET_WORLDS with locked colors and titles per D-01, D-02, D-03."
  - "Preserved LegacyPlanetId union ('jupiter-astronomy', etc.) and normalizePlanetId helper in getPlanetWorld for backward compatibility."
  - "Expanded messages/en.json and messages/ms.json with symmetric canonical and legacy entries."
metrics:
  duration: 3m
  completed_date: "2026-11-19T14:42:15Z"
actuals:
  tokens: 2963
  tasks: 2
  commits: 2
  plan_head_before: 5a3b614cfb0f82599913cbc8a85c9cf83a00d348
  plan_head_after: 5ddc87f594075b70b16d27e8437374c5c3f24d32
---

# Phase 24 Plan 01: Core Architecture & Dictionaries for Outer Planets Summary

Migrated core outer solar system architecture from generic placeholder astronomy tags to canonical KSSR Malaysian primary subjects (`sains`, `sejarah`, `rbt`, `psv`) with backward-compatible legacy aliasing and symmetric bilingual translation dictionaries.

## Key Changes

1. **Planetary Data Architecture (`src/lib/kids/planets.ts`)**:
   - Expanded `SubjectId` union: `"prompting" | "bm" | "english" | "matematik" | "moral" | "sains" | "sejarah" | "rbt" | "psv" | "astronomy"`.
   - Defined `CanonicalPlanetId`, `LegacyPlanetId`, and composite `PlanetId`.
   - Implemented `normalizePlanetId(id: PlanetId | string)` to seamlessly map legacy `*-astronomy` IDs to canonical IDs.
   - Updated `getPlanetWorld()` to normalize IDs before lookup, supporting both canonical and legacy IDs.
   - Migrated outer planet definitions in `PLANET_WORLDS` (orders 6-9) to canonical IDs:
     - Order 6: `jupiter-sains` (Sains & Penerokaan Saintifik / Amber `#D97706` & `#F59E0B`)
     - Order 7: `saturn-sejarah` (Sejarah & Garis Masa / Golden Ochre `#EAB308` & `#FDE047`)
     - Order 8: `uranus-rbt` (Reka Bentuk & Teknologi / Cyan `#06B6D4` & `#22D3EE`)
     - Order 9: `neptune-psv` (Pendidikan Seni Visual / Royal Azure `#2563EB` & `#3B82F6`)
   - Kept `features: []` intact for outer worlds (curriculum features deferred to Phase 25).

2. **Bilingual Translation Dictionaries (`messages/en.json`, `messages/ms.json`)**:
   - Added canonical entries under `kids.planets.worlds` for `jupiter-sains`, `saturn-sejarah`, `uranus-rbt`, and `neptune-psv`.
   - Maintained legacy aliases (`jupiter-astronomy`, `saturn-astronomy`, `uranus-astronomy`, `neptune-astronomy`) with matching titles and taglines for zero breaking changes.
   - Maintained 100% key and content symmetry between `en.json` and `ms.json`.

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

1. Created/modified files exist:
   - `src/lib/kids/planets.ts` - FOUND
   - `messages/en.json` - FOUND
   - `messages/ms.json` - FOUND

2. Commits exist:
   - `474732bb`: feat(24-01): migrate core outer planet architecture to canonical kssr subjects - FOUND
   - `5ddc87f5`: feat(24-01): expand bilingual localization dictionary for outer planets - FOUND
