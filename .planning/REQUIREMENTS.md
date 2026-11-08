# Requirements: Sekolah Prompt-Fu (Learn Prompting for Kids)

**Defined:** 2026-11-08  
**Milestone:** v1.2 — 3D Planetary Hub, Subject Cartography & Rocket Return  
**Core Value:** A lightweight, standalone, gamified kids app for learning prompt engineering — pure client-side, 100% static (GitHub Pages), with full Bahasa Melayu support and KSSR/KBAT alignment.

---

## v1.2 Requirements

Requirements for milestone v1.2. Each maps to roadmap phases.

### 1. Planetary Schema & Subject Alignment
- [x] **SCHEMA-01**: Update `src/lib/kids/planets.ts` and data structures to reflect user-defined subject mappings:
  - **Earth (Bumi)**: Foundational Prompting (the 19 core prompt lessons)
  - **Moon (Bulan)**: Bahasa Melayu
  - **Mars (Marikh)**: English Language
  - **Venus (Zuhrah)**: Matematik
  - **Mercury (Utarid)**: Sains / Pendidikan Moral
- [x] **SCHEMA-02**: Ensure all planets define 7 distinct geological features/regions (from `planets_mockup/planets_features_descriptions.md`) mapped to Tahun 1 to Tahun 6 (with feature 7 as mastery/final boss).
- [x] **SCHEMA-03**: Full bilingual support (`en` and `ms`) for planet names, descriptions, and feature details.

### 2. 3D Planetary Explorer (Three.js)
- [x] **THREE-01**: Integrate Three.js (and OrbitControls) into the Next.js static client bundle with zero SSR breakdown (dynamic client-side canvas).
- [x] **THREE-02**: Build interactive 3D Planetary System screen (`/planets` or integrated into navigation) allowing kids to rotate, inspect, and select planets.
- [x] **THREE-03**: Display rich planet info cards (celestial body details, subject title, feature count, progress overview) matching the `planets_mockup` cartography aesthetic.
- [ ] **THREE-04**: Build planetary detail view showing the 7 continent/basin/volcano features mapped to Tahun 1-6 with interactive region selection.

### 3. Game Flow & Navigation
- [ ] **FLOW-01**: Greet users from Title screen with option to enter the 3D Planetary System directly or start at Earth.
- [ ] **FLOW-02**: Earth serves as the starting world for foundational prompting lessons.
- [ ] **FLOW-03**: Implement interactive Rocket animation/button at the conclusion of Earth lessons (and throughout lesson headers) that flies back to the Planetary Explorer.

### 4. Planet-Themed Lesson Aesthetics & Pedagogy
- [ ] **THEME-01**: Adapt lesson background styling to mirror the aesthetic of the active planet (Earth greens/blues, Moon slate/silver, Mars oxidized red, Venus amber/sulfur, Mercury basalt gray).
- [ ] **PEDAG-01**: Provide KSSR/KBAT prompt structuring tasks tailored to the respective subjects (BM sentence building prompts, English descriptive prompts, Math logic & constraint prompts, Science observation prompts).
- [ ] **PEDAG-02**: Enforce a minimum of 7 interactive stages/sections (`<Section>`) per lesson (e.g. Tahun 1 Bahasa Melayu) covering introduction, concept demonstration, interactive prompt challenges, formative checks, and mastery challenge.

### 5. Quality & Static Certification
- [ ] **GATE-01**: Ensure all new components, packages, and routes pass type checking (`tsc --noEmit`), unit tests (`npm test`), import closure (`npm run check:closure`), and vocabulary checks (`npm run check:vocab`).
- [ ] **GATE-02**: Certify 100% static export (`npm run build` and `npm run verify`) for GitHub Pages with zero regression.

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Photorealistic 8K NASA texture packs | Excessively large static assets that slow down loading on mobile and low-bandwidth school devices |
| Backend DB / Cloud User Accounts | App remains strictly client-side static with `localStorage` |
| Live Paid LLM API calls in browser | Keeps app free, safe, private, and deterministic for primary school students |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCHEMA-01 | Phase 09 | Satisfied |
| SCHEMA-02 | Phase 09 | Satisfied |
| SCHEMA-03 | Phase 09 | Satisfied |
| THREE-01 | Phase 10 | Complete |
| THREE-02 | Phase 10 | Complete |
| THREE-03 | Phase 10 | Complete |
| THREE-04 | Phase 10 | Pending |
| FLOW-01 | Phase 11 | Pending |
| FLOW-02 | Phase 11 | Pending |
| FLOW-03 | Phase 11 | Pending |
| THEME-01 | Phase 12 | Pending |
| PEDAG-01 | Phase 12 | Pending |
| PEDAG-02 | Phase 12 | Pending |
| GATE-01 | Phase 13 | Pending |
| GATE-02 | Phase 13 | Pending |
