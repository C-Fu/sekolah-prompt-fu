# Roadmap: Sekolah Prompt-Fu (Learn Prompting for Kids)

## Milestone v1.5: Outer Planets Curriculum Expansion (KSSR Sains, Sejarah, RBT, PSV)

**Goal:** Expand Sekolah Prompt-Fu to the outer solar system by transforming Jupiter, Saturn, Uranus, and Neptune from astronomical observation placeholders into active KSSR learning worlds. Author Year 1 (Tahun 1) interactive pilot lessons with 7 structured stages for each new subject, complete with authentic geological feature mapping, thematic visual environments, bilingual content, and static export certification.

### Phases Overview

| Phase | Name | Goal | Requirements | Success Criteria |
|---|---|---|---|---|
| 24 | Outer Planets Subject Architecture & Telemetry | Map Jupiter to Sains, Saturn to Sejarah, Uranus to RBT, and Neptune to PSV with bilingual schemas and i18n | `SUBJ-01`, `SUBJ-02` | 2 |
| 25 | Geological Cartography & Provincial Provinces | Define 28 authentic geological/atmospheric regions across outer planets with spherical coordinates and badges | `GEO-01`, `GEO-02` | 2 |
| 26 | Jupiter (Sains) & Saturn (Sejarah) Year 1 Curriculum | Author complete 7-stage interactive lessons for Sains and Sejarah in BM and EN with interactive widgets | `LESSON-01`, `LESSON-02`, `LESSON-05` | 3 |
| 27 | Uranus (RBT) & Neptune (PSV) Year 1 Curriculum | Author complete 7-stage interactive lessons for RBT and PSV in BM and EN with interactive widgets | `LESSON-03`, `LESSON-04`, `LESSON-05` | 3 |
| 28 | Atmospheric Theming, Navigation & Routing Integration | Implement bespoke ambient themes, wire HUD mission launchers, and register levels 10.1–13.1 (27 total levels) | `THEME-01`, `THEME-02`, `ROUTE-01` | 3 |
| 29 | Milestone Verification & Static Release Certification | Certify test suites, static build export, closure check, vocabulary guard, and zero regressions | `VERIF-01`, `VERIF-02` | 2 |

---

## Phase Details

### Phase 24: Outer Planets Subject Architecture & Telemetry
**Goal:** Configure the subject identities, color palettes, and bilingual translation bundles for the 4 outer planets: Jupiter = Sains (Science), Saturn = Sejarah (History), Uranus = Reka Bentuk & Teknologi (RBT), and Neptune = Pendidikan Seni Visual (PSV).
**Requirements:** `SUBJ-01`, `SUBJ-02`
**Plans:** 2/2 plans complete

Plans:
- [x] 24-01-PLAN.md — Migrate Subject & World Type Architecture and Bilingual i18n Dictionaries
- [x] 24-02-PLAN.md — Align 3D Scenes, Planetary HUD Consumer & Synchronize Test Suites

**Success Criteria:**
1. `SubjectId` and `Planet` structures in `src/lib/kids/planets.ts` recognize the 4 outer worlds with designated themes, accent colors, and curriculum metadata.
2. English and Bahasa Melayu translation strings in `messages/en.json` and `messages/ms.json` are populated for all 4 new subject titles, taglines, and learning goals.

### Phase 25: Geological Cartography & Provincial Provinces
**Goal:** Map 7 authentic geological or atmospheric features per outer world (28 total regions) with spherical coordinates, elevation/depth ranges, curriculum badges, and learning objectives.
**Requirements:** `GEO-01`, `GEO-02`
**Plans:** 2/2 plans complete

Plans:
- [x] 25-01-PLAN.md — Populate 28 Authentic Geological and Atmospheric Features for Outer Planets
- [x] 25-02-PLAN.md — Synchronize and Expand Vitest Suites for 63 Total Planetary Features

**Success Criteria:**
1. All 4 outer planets possess 7 distinct geological/atmospheric regions with spherical coordinates for 3D cartographic beacon rendering.
2. Features 1–6 align with KSSR Standards 1–6; Feature 7 is designated as the Capstone Boss ("Cabaran Unggul") with distinctive gold badge styling.

### Phase 26: Jupiter (Sains) & Saturn (Sejarah) Year 1 Curriculum
**Goal:** Author and compile Year 1 (Tahun 1) interactive pilot lessons for Jupiter (Sains) and Saturn (Sejarah) in both Bahasa Melayu (`src/content/kids/ms/`) and English (`src/content/kids/en/`).
**Requirements:** `LESSON-01`, `LESSON-02`, `LESSON-05`
**Plans:** 2/2 plans executed
Plans:
- [x] 26-01-PLAN.md — Author Jupiter (Sains) Year 1 lesson across 7 canonical stages with test harness and vocab check
- [x] 26-02-PLAN.md — Author Saturn (Sejarah) Year 1 lesson across 7 canonical stages with test harness and vocab check
**Success Criteria:**
1. `10-1-sains-benda-hidup.mdx` (Jupiter) authored across at least 7 `<Section>` stages with rich interactive widgets (`WordPredictor`, `PromptDoctor`, `PromptVsMistake`, `DragDropPrompt`, `MagicWords`, `<LevelComplete>`).
2. `11-1-sejarah-garis-masa.mdx` (Saturn) authored across at least 7 `<Section>` stages with rich interactive widgets focusing on historical chronology and polite interview prompts.
3. Both lessons pass Malay vocabulary checks (`npm run check:vocab`) with zero English residuals.

### Phase 27: Uranus (RBT) & Neptune (PSV) Year 1 Curriculum
**Goal:** Author and compile Year 1 (Tahun 1) interactive pilot lessons for Uranus (RBT) and Neptune (PSV) in both Bahasa Melayu (`src/content/kids/ms/`) and English (`src/content/kids/en/`).
**Requirements:** `LESSON-03`, `LESSON-04`, `LESSON-05`
**Plans:** 2/2 plans executed

Plans:
- [x] 27-01-PLAN.md — Author Uranus (RBT) Year 1 lesson across 7 canonical stages with test harness and vocab check
- [x] 27-02-PLAN.md — Author Neptune (PSV) Year 1 lesson across 7 canonical stages with test harness and vocab check

**Success Criteria:**
1. `12-1-rbt-bentuk-asas.mdx` (Uranus) authored across at least 7 `<Section>` stages with interactive widgets focusing on 2D/3D shapes, basic building blocks, and design constraints.
2. `13-1-psv-warna-imaginasi.mdx` (Neptune) authored across at least 7 `<Section>` stages with interactive widgets focusing on primary colors, line patterns, and artistic imagination prompts.
3. Both lessons pass Malay vocabulary checks with zero English residuals.

### Phase 28: Atmospheric Theming, Navigation & Routing Integration
**Goal:** Create bespoke ambient atmospheric backgrounds in `PlanetBackground`, wire mission launch buttons in `planetary-hud.tsx`, and integrate levels 10.1–13.1 into the app's registry and navigation systems.
**Requirements:** `THEME-01`, `THEME-02`, `ROUTE-01`
**Success Criteria:**
1. `PlanetBackground` renders distinct atmospheric environments for Jupiter (swirling storm amber), Saturn (golden ring glow), Uranus (cyan procedural mist), and Neptune (deep azure storm winds).
2. Telemetry HUD activates mission launch buttons for the Year 1 regions of all 4 outer planets and routes to the new lessons with `?origin=planets`.
3. Total levels expand from 23 to 27 across `levels.ts`, `level-content.ts`, and `section-titles.ts`, with accurate progress counters (`completed / 27`).

### Phase 29: Milestone Verification & Static Release Certification
**Goal:** Validate all unit and integration tests, verify TypeScript, run bundle closure and Malay vocabulary checks, and certify 100% static export.
**Requirements:** `VERIF-01`, `VERIF-02`
**Success Criteria:**
1. All unit and integration test suites pass with zero failures (including planetary explorer, HUD, and all 27 level routes).
2. `npm run verify` runs cleanly with 0 TypeScript errors, 0 ESLint errors, passing vocabulary guards on all 27 MDX lessons, and verified static export files in `out/`.
