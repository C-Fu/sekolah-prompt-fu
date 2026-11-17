# Phase 19: Planetary Schema & Astronomical Telemetry Data — Discussion Log

**Date:** 2026-11-17  
**Mode:** Interactive

## Areas Explored & Decisions

### 1. Planetary Registration Architecture
- **Question:** How should we register outer non-curriculum planets in planets.ts?
- **Options Presented:**
  1. (Recommended) Extend PlanetId and PLANET_WORLDS with outer planets (jupiter, saturn, uranus, neptune) using empty features: [] and subjectId: "astronomy"
  2. Keep PLANET_WORLDS strictly to 5 curriculum worlds, and provide an auxiliary SOLAR_BODIES table
- **Selection:** Option 1 (Extend PlanetId and PLANET_WORLDS).

### 2. Localization Strategy for Field Notes & Astronomical Facts
- **Question:** How should the astronomical field notes and facts from how-big-is-big be localized into Bahasa Melayu?
- **Options Presented:**
  1. (Recommended) Full human-reviewed translation of facts & field notes into natural Bahasa Melayu with scientific terms (e.g., kawah, atmosfera, bintik merah gergasi)
  2. Keep English scientific terms with brief bilingual summaries
- **Selection:** Option 1 (Full human-reviewed translation with authentic scientific terms).
