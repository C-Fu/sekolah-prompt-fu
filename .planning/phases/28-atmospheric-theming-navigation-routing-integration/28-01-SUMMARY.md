---
phase: 28-atmospheric-theming-navigation-routing-integration
plan: 01
subsystem: ui-kids
tags: [ambient-theming, planet-background, outer-planets, css-gradients, vitest]
status: complete
requires:
  - 28-CONTEXT.md
  - 28-RESEARCH.md
provides:
  - "PlanetTheme union extended with jupiter, saturn, uranus, neptune"
  - "PLANET_THEMES styling definitions for all 4 outer planets"
  - "Deterministic route & slug resolver in getThemeForLevelSlug"
affects:
  - src/components/kids/layout/planet-background.tsx
  - src/__tests__/kids/planet-background.test.tsx
tech-stack:
  added: []
  patterns:
    - "Radial gradient atmospheric overlays"
    - "Deterministic slug matching for solar system outer worlds"
key-files:
  created: []
  modified:
    - src/components/kids/layout/planet-background.tsx
    - src/__tests__/kids/planet-background.test.tsx
decisions:
  - "D-01: Applied locked atmospheric CSS palettes and radial overlays for Jupiter, Saturn, Uranus, and Neptune"
metrics:
  duration: 4m
  completed: 2026-11-20
actuals:
  tokens: 18000
  tasks: 2
  commits: 1
  plan_head_before: 0c669ba0f48866e4a287f39a04a3f1fc953b6cb5
  plan_head_after: ee46a8d82d4e0e4fd429bd9beac98bc3e9592442
---

# Phase 28 Plan 01: Atmospheric Ambient Theming in PlanetBackground Summary

**One-liner:** Bespoke planetary ambient gradients, radial atmospheric overlays, and deterministic slug resolution implemented for Jupiter, Saturn, Uranus, and Neptune.

## Overview
Implemented THEME-01 and confirmed user decision D-01 in `src/components/kids/layout/planet-background.tsx`, extending the `PlanetTheme` type union from 5 inner world bodies to 9 complete solar system celestial bodies:
- **Jupiter (`jupiter`):** Amber / Bronze swirling storm bands atmosphere (`radial-gradient(ellipse at 50% 120%, rgba(217, 119, 6, 0.35) 0%, rgba(180, 83, 9, 0.15) 50%, transparent 80%)`).
- **Saturn (`saturn`):** Golden Ochre antique ring haze (`radial-gradient(ellipse at 50% 115%, rgba(234, 179, 8, 0.3) 0%, rgba(161, 98, 7, 0.15) 55%, transparent 80%)`) with diagonal luminous ring band accent.
- **Uranus (`uranus`):** Cyan / Blueprint Teal methane glow (`radial-gradient(ellipse at 50% 110%, rgba(6, 182, 212, 0.3) 0%, rgba(14, 116, 144, 0.15) 50%, transparent 80%)`) with crystalline dust particles.
- **Neptune (`neptune`):** Royal Azure deep cosmic ocean abyss (`radial-gradient(ellipse at 50% 115%, rgba(37, 99, 235, 0.35) 0%, rgba(29, 78, 216, 0.15) 55%, transparent 80%)`) with deep abyss vortex glow.

Updated `getThemeForLevelSlug` to detect outer planet routes via prefix checks (`10-`, `11-`, `12-`, `13-`), subject slugs (`-sains-`, `-sejarah-`, `-rbt-`, `-psv-`), Malay planet names (`musytari-`, `zuhal-`, `uranus-`, `neptun-`), and registered level world IDs (`10` through `13`), falling back safely to `'earth'`.

## Completed Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 & 2 | Expand PlanetTheme union and implement Jupiter, Saturn, Uranus, and Neptune ambient themes | `ee46a8d8` | `src/components/kids/layout/planet-background.tsx`, `src/__tests__/kids/planet-background.test.tsx` |

## Verification
- Vitest suite `src/__tests__/kids/planet-background.test.tsx`: 22/22 tests passing cleanly (11 slug resolution assertions, 10 theme rendering assertions, 1 constants map validation).
- Type checking: verified with `npx tsc --noEmit` with zero errors.

## Deviations from Plan
None - plan executed exactly as written.

## Self-Check: PASSED
- [x] `src/components/kids/layout/planet-background.tsx` exists and verified
- [x] `src/__tests__/kids/planet-background.test.tsx` exists and verified
- [x] Commit `ee46a8d8` exists in git log
