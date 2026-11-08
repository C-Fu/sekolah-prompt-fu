# Roadmap: Sekolah Prompt-Fu (Learn Prompting for Kids)

## Milestones
- **[v1.0](milestones/v1.0-ROADMAP.md)** Kids Prompting Game Standalone & GitHub Pages (Shipped 2026-11-07)
- **[v1.1](milestones/v1.1-ROADMAP.md)** Rebrand, Tech Debt, & KSSR Tahun 1 Integration (Shipped 2026-11-07)
- **v1.2** 3D Planetary Hub, Subject Cartography & Rocket Return (In Progress)

---

## Milestone v1.2: 3D Planetary Hub, Subject Cartography & Rocket Return

### Phase 09: Planetary Schema & Subject Alignment (Completed: 2026-11-08)
**Goal:** Align planetary world schema with user requirements (Earth = Prompting, Moon = BM, Mars = English, Venus = Matematik, Mercury = Moral) and map 7 geological features to Tahun 1-6 with full bilingual metadata.
- **Plans:** 2 plans
  - [x] 09-01-PLAN.md — Update `src/lib/kids/planets.ts` with updated types, math helpers (`latLonToVector3`), 5 planetary worlds, 35 geological features, and unit tests in `src/__tests__/kids/planets.test.ts`.
  - [x] 09-02-PLAN.md — Update bilingual message bundles (`messages/en.json`, `messages/ms.json`) with planetary facts, badges, and run verification.
- **Requirements Covered:** SCHEMA-01, SCHEMA-02, SCHEMA-03 (All Satisfied)

### Phase 10: 3D Planetary Explorer Component (Three.js)
**Goal:** Integrate Three.js with client-side Next.js compatibility and construct the interactive 3D Planetary Explorer with orbital controls, planet selection, and cartographic detail view based on `planets_mockup/`.
- **Plans:**
  - 10-01: Install `three` & `@types/three` and build SSR-safe 3D Canvas component (`PlanetaryCanvas`) with lighting, procedural starfield, and procedural planet spheres.
  - 10-02: Build 3D Planet detail inspector with 7 feature hotspots/markers and cartographic information panel.
- **Requirements Covered:** THREE-01, THREE-02, THREE-03, THREE-04

### Phase 11: Game Flow & Rocket Navigation
**Goal:** Connect the title screen to the 3D Planetary Explorer, establish Earth as foundational prompting world, and implement rocket transition animations back to the planetary hub.
- **Plans:**
  - 11-01: Wire Title screen navigation to launch into the 3D Planetary Explorer (`/planets` or integrated interactive hub).
  - 11-02: Add Rocket return component and launch sequence at the end of Earth's foundational prompt lessons and header navigation.
- **Requirements Covered:** FLOW-01, FLOW-02, FLOW-03

### Phase 12: Planet-Themed Lesson Aesthetics & Subject Prompt Lessons
**Goal:** Implement dynamic planet-themed backgrounds for lesson views and wire subject-specific prompt engineering tasks for KSSR/KBAT standards with a minimum of 7 interactive stages per lesson.
- **Plans:**
  - 12-01: Dynamic lesson page theming (background gradients, starry sky, crust palettes) matching the active planet world.
  - 12-02: Ensure subject prompt lessons teach effective prompt structuring based on subject constraints, authoring at least 7 stages per lesson.
- **Requirements Covered:** THEME-01, PEDAG-01, PEDAG-02

### Phase 13: Static Export & Quality Gate Certification
**Goal:** Certify the entire application end-to-end with zero regressions, strict type safety, import closure, and 100% static GitHub Pages export.
- **Plans:**
  - 13-01: Run full verification suite (`tsc`, Vitest, `check:closure`, `check:vocab`, and static `out/` route crawler).
- **Requirements Covered:** GATE-01, GATE-02
