# Roadmap: Sekolah Prompt-Fu (Learn Prompting for Kids)

## Milestone v1.4: Planetary Assets, Data & Solar System Explorer Expansion

**Goal:** Upgrade Sekolah Prompt-Fu's 3D planetary explorer (`/planets`), assets, and informational telemetry with rich astronomical textures, verified data, and field notes from `how-big-is-big`, while retaining core lesson structures.

### Phases Overview

| Phase | Name | Goal | Requirements | Success Criteria |
|---|---|---|---|---|
| 18 | Planetary Texture & Asset Pipeline | Import, optimize, and attribute textures from `how-big-is-big` | `AST-01`, `AST-02` | [x] 2 |
| 19 | Planetary Schema & Astronomical Telemetry Data | Enrich celestial data models with bilingual facts, dimensions, and field notes | `DATA-01`, `DATA-02`, `DATA-03` | [x] 3 |
| 20 | 3D Solar System & Planetary Explorer Expansion | Expand Three.js Solar System scene with all planets, orbits, and ring structures | `EXPLR-01`, `EXPLR-02`, `EXPLR-03` | 3 |
| 21 | Telemetry HUD & Astronomical Field Notes | Update HUD with cycling "Tahukah Anda?" cards and observation mode | `HUD-01`, `HUD-02` | 2 |
| 22 | Universal Allo Typography Implementation | Fully implement Allo variable font across all UI elements and MDX lessons | `ALLO-01`, `ALLO-02` | 2 |
| 23 | Milestone Verification & Static Release Certification | Certify test suites, static build export, closure check, and zero regressions | `VERIF-01`, `VERIF-02` | 2 |

---

## Phase Details

### Phase 18: Planetary Texture & Asset Pipeline
**Goal:** Import, optimize, and attribute high-resolution planetary textures from `how-big-is-big/maps` into `public/images/planets/` with CC BY 4.0 attribution.
**Requirements:** `AST-01`, `AST-02`
**Success Criteria:**
1. Optimized texture maps for Mercury, Venus, Mars, Jupiter, Saturn, and Neptune exist in `public/images/planets/` and load smoothly without excessive bundle overhead.
2. `ATTRIBUTION.md` in `public/images/planets/` documents Solar System Scope CC BY 4.0 licensing and NASA mission imagery origin.

### Phase 19: Planetary Schema & Astronomical Telemetry Data
**Goal:** Enrich `src/lib/kids/planets.ts` with authentic astronomical dimensions, distances, and 3 cycling field notes per planet from `how-big-is-big` in both English and Bahasa Melayu.
**Requirements:** `DATA-01`, `DATA-02`, `DATA-03`
**Success Criteria:**
1. Celestial data structures provide authentic radii, distance from Sun in km / AU, light travel time, and 3 curated field notes for all solar system planets.
2. All new content is fully localized in Bahasa Melayu (`ms`) and English (`en`) with zero empty fallback fields.
3. Existing 5 curriculum planets and their 35 geological feature mappings for KSSR prompt lessons remain 100% intact and functional.

### Phase 20: 3D Solar System & Planetary Explorer Expansion
**Goal:** Expand Three.js solar system overview and planetary cartography scenes to render full planetary bodies, orbital tracks, Saturn's rings, and smooth camera targeting.
**Requirements:** `EXPLR-01`, `EXPLR-02`, `EXPLR-03`
**Success Criteria:**
1. The 3D Solar System view renders Mercury, Venus, Earth-Moon, Mars, Jupiter, Saturn, Uranus, and Neptune with accurate relative visual orbits and speeds.
2. Saturn renders distinct procedural or textured ring planes inclined to its rotational axis.
3. Users can click any planet in the solar system to orbit, inspect, and explore cartographic views with smooth camera zoom.

### Phase 21: Telemetry HUD & Astronomical Field Notes
**Goal:** Enhance `PlanetaryHud` to present cycling "Tahukah Anda?" / "Did You Know?" field notes and authentic telemetry while supporting non-curriculum observation planets.
**Requirements:** `HUD-01`, `HUD-02`
**Success Criteria:**
1. The Telemetry HUD displays authentic radius, distance, and 3 cycling field notes with interactive or timed rotation.
2. Outer planets without active KSSR missions show an educational "Astronomical Observation" badge and status instead of broken mission buttons.

### Phase 22: Universal Allo Typography Implementation
**Goal:** Fully implement the Allo font family across all elements, components, and typography stylesheets in the app, creating a cheerful, playful, cheeky yet mature look for kids and adults.
**Requirements:** `ALLO-01`, `ALLO-02`
**Success Criteria:**
1. `allo-font` variable web fonts are integrated into root layout, CSS variables, Tailwind configuration, and MDX prose styles.
2. All buttons, headings, navigation links, HUD cards, badges, and body copy render with Allo font with balanced roundness, playfulness, and readability.

### Phase 23: Milestone Verification & Static Release Certification
**Goal:** Validate all unit and integration tests, verify TypeScript, run bundle closure and Malay vocabulary checks, and certify 100% static export.
**Requirements:** `VERIF-01`, `VERIF-02`
**Success Criteria:**
1. All unit and integration test suites pass with zero failures.
2. `npm run verify` runs cleanly with 0 TypeScript errors, 0 ESLint errors, passing vocabulary guards, and verified static export files in `out/planets/`.
