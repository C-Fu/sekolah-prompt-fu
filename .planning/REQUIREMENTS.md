# Milestone v1.5 Requirements: Outer Planets Curriculum Expansion (KSSR Sains, Sejarah, RBT, PSV)

## Overview
Expand Sekolah Prompt-Fu to the outer solar system by transforming Jupiter, Saturn, Uranus, and Neptune from astronomical observation placeholders into active KSSR learning worlds. Author Year 1 (Tahun 1) interactive pilot lessons with 7 structured stages for each new subject, complete with authentic geological feature mapping, thematic visual environments, bilingual content, and static export certification.

## Requirements

### Outer Planets Subject Architecture & Telemetry
- [x] **SUBJ-01**: User sees all 4 outer planets mapped to core KSSR primary subjects: Jupiter = Sains (Science), Saturn = Sejarah (History), Uranus = Reka Bentuk & Teknologi (RBT), and Neptune = Pendidikan Seni Visual (PSV).
- [x] **SUBJ-02**: Celestial schemas and i18n message bundles provide authentic subject titles, taglines, and curriculum descriptions in both Bahasa Melayu (`ms`) and English (`en`).

### Geological Provinces & Feature Cartography
- [ ] **GEO-01**: User can explore 7 authentic geological or atmospheric features/regions per outer planet (28 total regions) with spherical coordinates, elevation/depth profiles, badges, and learning objectives.
- [ ] **GEO-02**: Features 1–6 map to Tahun 1–6 curricula; Feature 7 represents the Capstone Boss ("Cabaran Unggul") with distinctive badge styling and elevated visual beacon pins.

### Interactive Year 1 Pilot Lessons
- [ ] **LESSON-01**: User can play a complete Tahun 1 interactive prompt lesson for Jupiter (Sains: Benda Hidup & Benda Bukan Hidup / AI Observation Prompts) across 7 structured `<Section>` stages with rich interactive widgets (`WordPredictor`, `PromptDoctor`, `PromptVsMistake`, `DragDropPrompt`, `MagicWords`, `LevelComplete`).
- [ ] **LESSON-02**: User can play a complete Tahun 1 interactive prompt lesson for Saturn (Sejarah: Garis Masa Diri & Keluarga / Historical Chronology Prompts) across 7 structured `<Section>` stages with rich interactive widgets.
- [ ] **LESSON-03**: User can play a complete Tahun 1 interactive prompt lesson for Uranus (RBT: Bentuk Asas, Blok Binaan & Reka Bentuk / Geometric Prompt Engineering) across 7 structured `<Section>` stages with rich interactive widgets.
- [ ] **LESSON-04**: User can play a complete Tahun 1 interactive prompt lesson for Neptune (PSV: Warna Asas, Garisan & Imaginasi Visual / Artistic Visual Description Prompts) across 7 structured `<Section>` stages with rich interactive widgets.
- [ ] **LESSON-05**: All 4 lessons are fully authored and localized in both Bahasa Melayu (`src/content/kids/ms/`) and English (`src/content/kids/en/`) with zero silent fallbacks and strict adherence to Malay vocabulary guards.

### Theming, Atmospheric Environments & Routing
- [ ] **THEME-01**: User experiences bespoke atmospheric and celestial themes in `PlanetBackground` for Jupiter (swirling amber storms), Saturn (golden ring glow), Uranus (cyan procedural mist), and Neptune (deep azure storm winds) with matched accent navigation borders.
- [ ] **THEME-02**: Telemetry HUD activates mission launch buttons for the newly authored Year 1 regions and safely preserves "Belum ada misi untuk kawasan ini" for unauthored future years (Tahun 2–6).
- [ ] **ROUTE-01**: New levels are registered in `levels.ts`, `level-content.ts`, and `section-titles.ts`, expanding total application level count from 23 to 27 with accurate header progress counters and bidirectional origin tracking (`?origin=planets`).

### Quality, Verification & Performance
- [ ] **VERIF-01**: All existing and new test suites pass with zero failures (including Vitest unit/integration tests and responsive HUD specs).
- [ ] **VERIF-02**: `npm run verify` certifies TypeScript (0 errors), ESLint (0 errors), vocabulary checks (scanned across all 27 MDX files), import closure, and 100% static production build export (`out/`).

## Future Requirements
- **FUTR-01**: Author Year 2 to Year 6 (Tahun 2–6) and Capstone Boss curriculum lessons for all 8 celestial subject worlds.
- **FUTR-02**: Interactive 3D planetary flybys and cosmic flight transition animations.

## Out of Scope
- Modifying existing Earth (1.1–5.4), Moon (6.1), Mars (7.1), Venus (8.1), or Mercury (9.1) lesson content.
- Adding server dependencies or backend progress databases (pure client-side static application).
- Real-time online multi-player.

## Traceability
- **SUBJ-01**: Phase 24
- **SUBJ-02**: Phase 24
- **GEO-01**: Phase 25
- **GEO-02**: Phase 25
- **LESSON-01**: Phase 26
- **LESSON-02**: Phase 26
- **LESSON-03**: Phase 27
- **LESSON-04**: Phase 27
- **LESSON-05**: Phase 26, Phase 27
- **THEME-01**: Phase 28
- **THEME-02**: Phase 28
- **ROUTE-01**: Phase 28
- **VERIF-01**: Phase 29
- **VERIF-02**: Phase 29
