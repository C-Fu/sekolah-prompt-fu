# Phase 28: Atmospheric Theming, Navigation & Routing Integration - Context

## Executive Summary
This phase fully integrates the 4 new outer planet pilot lessons into the application's runtime systems:
1. **Atmospheric Theming:** Configures bespoke ambient backgrounds in `PlanetBackground` for Jupiter, Saturn, Uranus, and Neptune.
2. **Global Level Registration:** Expands total application levels from 23 to 27 by registering levels 10.1, 11.1, 12.1, and 13.1 across `levels.ts`, `level-content.ts`, `section-titles.ts`, and navigation components.
3. **Planetary HUD Mission Launcher & Routing:** Wires the Feature 1 Start Mission buttons in `planetary-hud.tsx` to the lessons with `?origin=planets` query parameter and breadcrumb back-navigation.

## Confirmed Design Decisions

### 1. Atmospheric Ambient Theming in `PlanetBackground`
- **Jupiter (`jupiter-sains`):** Amber / Bronze swirling storm bands atmosphere (`radial-gradient(ellipse at 50% 120%, rgba(217, 119, 6, 0.35) 0%, rgba(180, 83, 9, 0.15) 50%, transparent 80%)`).
- **Saturn (`saturn-sejarah`):** Golden Ochre antique ring haze (`radial-gradient(ellipse at 50% 115%, rgba(234, 179, 8, 0.3) 0%, rgba(161, 98, 7, 0.15) 55%, transparent 80%)`).
- **Uranus (`uranus-rbt`):** Cyan / Blueprint Teal methane glow (`radial-gradient(ellipse at 50% 110%, rgba(6, 182, 212, 0.3) 0%, rgba(14, 116, 144, 0.15) 50%, transparent 80%)`).
- **Neptune (`neptune-psv`):** Royal Azure deep cosmic ocean abyss (`radial-gradient(ellipse at 50% 115%, rgba(37, 99, 235, 0.35) 0%, rgba(29, 78, 216, 0.15) 55%, transparent 80%)`).

### 2. Level Registry & Navigation Updates
- **Levels Registered:**
  - `10-1-sains-benda-hidup` (Level 10.1: Musytari - Sains)
  - `11-1-sejarah-garis-masa` (Level 11.1: Zuhal - Sejarah)
  - `12-1-rbt-bentuk-asas` (Level 12.1: Uranus - RBT)
  - `13-1-psv-warna-imaginasi` (Level 13.1: Neptun - PSV)
- **Files Modified:**
  - `src/lib/kids/levels.ts`: Add Level definitions and update `TOTAL_LEVELS = 27`.
  - `src/lib/kids/level-content.ts`: Add dynamic imports for new MDX lessons in both `ms` and `en`.
  - `src/lib/kids/section-titles.ts`: Add localized section titles for stages 1–8.
  - UI Navigation & Header: Header progress indicators reflect `x/27` total levels.

### 3. Planetary HUD Mission Routing
- In `planetary-hud.tsx`, clicking Feature 1 on outer worlds opens:
  - Jupiter Feature 1 -> `/level/10-1-sains-benda-hidup?origin=planets`
  - Saturn Feature 1 -> `/level/11-1-sejarah-garis-masa?origin=planets`
  - Uranus Feature 1 -> `/level/12-1-rbt-bentuk-asas?origin=planets`
  - Neptune Feature 1 -> `/level/13-1-psv-warna-imaginasi?origin=planets`
- Back button on lessons preserves origin query param and safely returns to `/planets`.

## Downstream Impact
- Phase 29: Milestone Verification & Static Release Certification.
