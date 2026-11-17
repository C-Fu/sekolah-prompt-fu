# Milestone v1.4 Requirements: Planetary Assets, Data & Solar System Explorer Expansion

## Overview
Upgrade Sekolah Prompt-Fu's 3D planetary explorer (`/planets`), assets, and informational telemetry with the rich astronomical textures, verified data, and field notes from `how-big-is-big`, while retaining core lesson structures and educational routes.

## Requirements

### Asset & Texture Upgrades
- [x] **AST-01**: User experiences high-fidelity planetary surface textures (Mercury, Venus, Mars, Jupiter, Saturn, Neptune) adapted from `how-big-is-big/maps` with CC-BY-4.0 Solar System Scope attribution.
- [x] **AST-02**: All imported texture files are web-optimized (compressed, responsive resolutions) and integrated without exceeding static bundle constraints.

### Planetary Schema & Data Enrichment
- [x] **DATA-01**: User can view authentic astronomical statistics for celestial bodies (radius in km, distance from Sun, light travel time) in both Bahasa Melayu and English.
- [x] **DATA-02**: User can read curated astronomical observation facts per planetary body sourced from `how-big-is-big`.
- [x] **DATA-03**: Existing 5 curriculum planets (Earth, Moon, Mars, Venus, Mercury) maintain all 35 authentic geological features and KSSR Year 1–6 prompt lesson linkages without regression.

### 3D Solar System & Planetary Explorer Expansion
- [x] **EXPLR-01**: User can view an expanded Solar System overview (`SolarSystemScene`) featuring all planetary bodies (Mercury, Venus, Earth-Moon, Mars, Jupiter with rings, Saturn with rings, Uranus, Neptune) with proportional relative orbits and rotational speeds.
- [x] **EXPLR-02**: User can select and inspect any solar system planet in 3D orbit and cartography modes with dedicated camera framing and smooth transition curves.
- [x] **EXPLR-03**: Saturn's icy ring plane and planetary atmospheres are rendered accurately in 3D Three.js scenes.

### Telemetry HUD & Astronomical Fact Cards
- [x] **HUD-01**: User sees an enhanced Telemetry HUD displaying authentic distance-from-sun, radius, and primary observation facts alongside existing provincial navigation.
- [x] **HUD-02**: Celestial bodies without active KSSR prompt missions (e.g., outer gas giants) clearly show an educational "Astronomical Observation / Exploration" status instead of broken mission buttons.

### Complete Allo Typography Integration
- [x] **ALLO-01**: User experiences Josh Puckett's Allo font family (`allo-font`) rendered consistently across all application surfaces (root layout, headings, body text, buttons, HUD, game widgets, and lesson MDX content), establishing a cheerful, playful, cheeky yet mature look without looking childish or alienating adult readers.
- [x] **ALLO-02**: Allo font variants (weights, styles) are loaded via variable web fonts with optimal CSS font-display, zero layout shift (CLS), fallback font stacks, and zero external runtime Google Font dependencies.

### Quality, Verification & Performance
- [x] **VERIF-01**: All existing test suites pass (including Vitest unit/integration tests and responsive HUD specs).
- [x] **VERIF-02**: `npm run verify` certifies TypeScript type-checking, ESLint (0 errors), vocabulary checks, module closure, and 100% static export (`out/planets/index.html`).

## Future Requirements
- **FUTR-01**: Author KSSR prompt learning curriculum missions for outer gas giants (Jupiter, Saturn, Uranus, Neptune).
- **FUTR-02**: Cosmic flight mode / slingshot flyby transitions inspired by `how-big-is-big`.

## Out of Scope
- Modifying core MDX prompt lessons or altering Earth foundational curriculum levels.
- Raw uncompressed 8K textures that cause out-of-memory or high mobile load latency.
- Stellar, interstellar, or galactic objects outside the Solar System (stars, nebulae, galaxies from `how-big-is-big`).

## Traceability
- **AST-01**: Phase 18
- **AST-02**: Phase 18
- **DATA-01**: Phase 19
- **DATA-02**: Phase 19
- **DATA-03**: Phase 19
- **EXPLR-01**: Phase 20
- **EXPLR-02**: Phase 20
- **EXPLR-03**: Phase 20
- **HUD-01**: Phase 21
- **HUD-02**: Phase 21
- **ALLO-01**: Phase 22
- **ALLO-02**: Phase 22
- **VERIF-01**: Phase 23
- **VERIF-02**: Phase 23*
