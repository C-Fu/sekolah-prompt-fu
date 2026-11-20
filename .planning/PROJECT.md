# Project: Sekolah Prompt-Fu (Learn Prompting for Kids)

## Vision & Objective
Sekolah Prompt-Fu is a lightweight, standalone, gamified interactive learning web application designed for primary school students (Tahun 1 - 6) to learn prompt engineering and AI literacy ("Learn Prompting for Kids") aligned with Malaysian KSSR Semakan & KBAT methodology.

The application is built 100% static (`output: 'export'`) with client-side persistence and zero server dependencies, fully localized in Bahasa Melayu (`ms`) and English (`en`), deployable on GitHub Pages.

## Key Decisions

1. **Prompt-First Syllabus Integration (KSSR & KBAT):**
   - Core learning remains prompt engineering (how to instruct AI, specify context, role-play, constrain formats, give feedback).
   - Subject domain knowledge (BM, English, Matematik, Sains, Pendidikan Moral) serves as authentic context for prompt tasks.
   - Celestial planetary mapping:
     * **Earth (Bumi)**: Foundational Prompting / Current 19 Prompt Lessons (Starting world)
     * **Moon (Bulan)**: Bahasa Melayu
     * **Mars (Marikh)**: English Language
     * **Venus (Zuhrah)**: Matematik
     * **Mercury (Utarid)**: Pendidikan Moral
   - On each celestial world, 7 distinct geological features/regions correspond to Tahun 1 to Tahun 6 (with feature 7 as Capstone Boss / Mastery Arena).

2. **3D Planetary Navigation & Interactive Cartography:**
   - From the title screen, users can enter a 3D Planetary Explorer powered by Three.js (interactive orbit, rotation, lighting, and planetary cards with basic info).
   - Clicking a planet zooms/selects that celestial body and presents its 7 cartographic regions (Tahun 1-6).
   - Earth is the starting point for foundational prompt lessons. Completing lessons triggers a rocket launch sequence returning to the planetary hub.

3. **Static-First Architecture (GitHub Pages Ready):**
   - Next.js `output: 'export'` with `images: { unoptimized: true }`.
   - Client-side persistence using `localStorage` for level progress, stars, volume, and section completion.
   - Zero database or server runtime dependencies.

4. **Bilingual Navigation & Zero Silent Fallback:**
   - Fast dual-toggle "BM | EN" on the header for instant locale switching.
   - All levels authored in both BM (`src/content/kids/ms/`) and English (`src/content/kids/en/`).
   - Lesson backgrounds match each planet's aesthetic and theme colors.

5. **Accessibility & Responsive Polish:**
   - Mobile-first layouts with zero horizontal clipping down to 320px screens.
   - Minimum 44×44px interactive hit targets conforming to WCAG 2.5.5.
   - High-contrast two-tone keyboard focus indicators and live ARIA announcements.
   - Reduced-motion-safe animations with full respects for user OS and browser preferences.

6. **Quality Gates & Clean Imports:**
   - Dedicated scripts for import closure (`npm run check:closure`) and vocabulary checks (`npm run check:vocab`) wired into CI.
   - Verified zero regression with `npm run verify` across all 23 level routes, `/`, `/map`, `/planets`, and static assets.

## Current State

**Shipped Version:** v1.5 (2026-11-20)  
**Phases Completed:** 29 phases total across v1.0, v1.1, v1.2, v1.3, v1.4, and v1.5.  
**Verification:** 32 test files, 393/393 unit and integration tests passing; clean production build with 100% static export (35 static pages and 27 static level routes).

<details>
<summary>Prior Milestones Summary</summary>

- **v1.0 (2026-11-06):** Core Foundation, Levels & Static Engine (Phases 1–5).
- **v1.1 (2026-11-07):** Audio, Polish & Kid Engagement (Phases 6–8).
- **v1.2 (2026-11-09):** Planetary Subject Worlds & KSSR Integration (Phases 9–13).
- **v1.3 (2026-11-17):** Responsive Polish & Production Hardening (Phases 14–17).
- **v1.4 (2026-11-17):** Planetary Assets, Data, Solar System Explorer & Allo Typography (Phases 18–23).
- **v1.5 (2026-11-20):** Outer Planets Curriculum Expansion (KSSR Sains, Sejarah, RBT, PSV) (Phases 24–29).

</details>

## Next Milestone Goals

*Run `/gsd-new-milestone` to define goals for the next version (e.g., Year 2+ curricula, interactive mini-games, teacher dashboard, or audio narration).*

7. **Universal Allo Typography & High-Res Astronomical Pipeline (v1.4):**
   - Self-hosted Josh Puckett's `allo-font` variable webfonts in `public/fonts/allo/` with friendly roundness (`ROND: 50`) and optical sizing for a cheerful, playful, cheeky aesthetic. Removed external Google Fonts.
   - High-fidelity CC BY 4.0 planetary textures for Mercury, Venus surface, Mars, Jupiter, Saturn, and Neptune from `how-big-is-big` with strictly bounded bundle size (< 800 KB).
   - Expanded 3D Solar System view to 9 celestial bodies, tilted Saturn rings, and educational "Akan Datang" placeholders for future KSSR curricula on outer worlds.

## Current Milestone: v1.5 Outer Planets Curriculum Expansion (KSSR Sains, Sejarah, RBT, PSV)

**Goal:** Expand Sekolah Prompt-Fu to the outer solar system by transforming Jupiter, Saturn, Uranus, and Neptune from astronomical observation placeholders into active KSSR learning worlds. Author Year 1 (Tahun 1) interactive pilot lessons with 7 structured stages for each new subject, complete with authentic geological feature mapping, thematic visual environments, bilingual content, and static export certification.

**Target features:**
- Outer Planets Subject Architecture: Map Jupiter to Sains (Science), Saturn to Sejarah (History), Uranus to Reka Bentuk & Teknologi (RBT), and Neptune to Pendidikan Seni Visual (PSV).
- Geological Provinces & Cartography: Define 7 authentic geological regions per outer planet in `src/lib/kids/planets.ts` with spherical coordinates, elevation, badges, and learning objectives.
- Interactive Year 1 Pilot Lessons: Author 4 new interactive lessons in both Bahasa Melayu (`src/content/kids/ms/`) and English (`src/content/kids/en/`) across 7 structured stages featuring interactive widgets (`WordPredictor`, `PromptDoctor`, `PromptVsMistake`, `DragDropPrompt`, `MagicWords`, `LevelComplete`).
- Atmospheric Theming & Dynamic Backgrounds: Add bespoke atmospheric palettes, clouds, storms, and animations for Jupiter (Bintik Merah Gergasi), Saturn (Golden Ring Haze), Uranus (Cyan Procedural Mist), and Neptune (Deep Azure Winds).
- Curriculum Routing & Mission Activation: Wire mission launchers in `planetary-hud.tsx`, register new levels in `levels.ts` and `level-content.ts`, and update header progress tracking (expanding from 23 to 27 total levels).
- Quality & Release Certification: 100% static export (`35/35` routes), zero TypeScript/ESLint errors, clean Malay vocabulary check, and 100% green Vitest suites.

## Requirements

### Validated
- ✓ Repository purged to a kids-only surface: Prisma/NextAuth/non-kids routes removed, npm lockfile pruned, community datasets deleted — v1.0
- ✓ 19 gamified interactive prompting levels with interactive widgets (`src/content/kids/en/*.mdx`); client-side progress (`localStorage`), audio engine, and pixel-art UI — v1.0
- ✓ Kids game promoted to root experience (`/`, `/map`, `/level/[slug]`) as 100% static `out/` export for GitHub Pages — v1.0
- ✓ Bahasa Melayu (`ms`) locale fully selectable with complete UI message bundle (`messages/ms.json`) and localized MDX levels — v1.0
- ✓ Rerunnable verification script (`scripts/verify-project.js` / `npm run verify`) and CI enforcement — v1.0
- ✓ Replace legacy social preview with Sekolah Prompt-Fu branded banner & Peromfu graphics — v1.1
- ✓ Repaired closure guard for root routes and wired `npm run check:closure` & `npm run check:vocab` into CI — v1.1
- ✓ Consolidated supported locales into a canonical single source of truth in `src/lib/i18n/config.ts` — v1.1
- ✓ Header quick toggle button ("BM | EN") for 1-click language switching — v1.1
- ✓ Researched and designed KSSR Semakan Year 1 prompt-learning pedagogy and initial planetary schema (`src/lib/kids/planets.ts`) — v1.1
- ✓ Authored and registered pilot KSSR levels with static export certification — v1.1
- ✓ Symmetrically mapped 5 celestial worlds to core subjects (Earth = Prompting, Moon = BM, Mars = English, Venus = Matematik, Mercury = Moral) and 35 authentic geological features with spherical math (`latLonToVector3`) — v1.2
- ✓ SSR-safe Three.js canvas, bundled 7 equirectangular NASA textures (< 750 KB) with CC-BY-4.0 attribution, interactive solar system view with drag filter, deep planet cartography with beacon pins, and glassmorphic telemetry HUD — v1.2
- ✓ Title Screen dual entry paths (`/map` vs `/planets`), retro pixel rocket sprite, and full-screen 3.. 2.. 1.. BLAST OFF! countdown animation on Earth graduation (`5-4-graduation-day`) transitioning to `/planets` — v1.2
- ✓ Reactive `PlanetBackground` component adapting ambient sky, dust, clouds, and stars per planet, with accent-tinted lesson navigation borders — v1.2
- ✓ Realigned curriculum to 23 levels across Worlds 1–9 and authored 4 subject lessons with minimum 7 interactive `<Section>` stages and `<LevelComplete>` celebration — v1.2
- ✓ Added explicit inspection for `out/planets/index.html` to `scripts/verify-project.js`, eliminated all ESLint errors (0 errors), passed Malay vocabulary guard on 23 MDX files, verified 406 modules in closure, and certified 245/245 tests green with 100% static export — v1.2
- ✓ Journey clarity with universal header navigation, equal destination choices, section titles and ordinal progress without silent locale fallbacks (`CLAR-01`, `CLAR-02`, `CLAR-03`) — v1.3
- ✓ Mobile-first responsive layout (320px–428px), 44px min hit targets, high-contrast two-tone focus outline, and screen-reader accessibility (`A11Y-01`, `A11Y-02`, `A11Y-03`, `A11Y-04`) — v1.3
- ✓ Proportional, reduced-motion-safe game feel, tactile feedback, and celebratory overlays (`FEEL-01`, `FEEL-02`, `FEEL-03`) — v1.3
- ✓ Visual consistency audit across typography scale, pixel borders, palette harmony, and static export release certification (`VIS-01`, `VIS-02`) — v1.3
- ✓ High-resolution texture pipeline with CC BY 4.0 Solar System Scope attribution within 800 KB budget (`AST-01`, `AST-02`) — v1.4
- ✓ Astronomical schema enrichment with physical radii, orbital distances, and bilingual observation facts (`DATA-01`, `DATA-02`, `DATA-03`) — v1.4
- ✓ 3D Solar System & planetary explorer expanded to all 9 celestial bodies and tilted Saturn rings (`EXPLR-01`, `EXPLR-02`, `EXPLR-03`) — v1.4
- ✓ Telemetry HUD enriched with authentic measurements and observation states (`HUD-01`, `HUD-02`) — v1.4
- ✓ Self-hosted universal Allo typography implemented across all app surfaces with friendly roundness (`ALLO-01`, `ALLO-02`) — v1.4
- ✓ Milestone v1.4 release certification with 354 tests green and 100% static export (`VERIF-01`, `VERIF-02`) — v1.4

### Active
- [ ] `OUTER-SUBJ`: Map outer planets to primary KSSR subjects (Jupiter = Sains, Saturn = Sejarah, Uranus = RBT, Neptune = Pendidikan Seni Visual) and configure `SubjectId` and metadata.
- [ ] `OUTER-GEO`: Define 7 authentic geological / atmospheric regions per outer world (28 total regions) with spherical coordinates, elevation, badges, and learning objectives.
- [ ] `OUTER-LESSONS`: Author 4 Year 1 (Tahun 1) interactive pilot lessons in both BM and English (`src/content/kids/ms/` and `src/content/kids/en/`) across 7 structured `<Section>` stages with rich interactive widgets.
- [ ] `OUTER-THEME`: Implement bespoke atmospheric and celestial themes in `PlanetBackground` for Jupiter, Saturn, Uranus, and Neptune with distinct accent colors and ambient animations.
- [ ] `OUTER-ROUTING`: Wire mission launcher buttons in `planetary-hud.tsx`, register new levels (10.1, 11.1, 12.1, 13.1) in `levels.ts`, `level-content.ts`, and `section-titles.ts`, expanding total levels from 23 to 27.
- [ ] `OUTER-VERIFY`: Certify full test suites, import closure (all 27 lessons), Malay vocabulary checks, and 100% static production build export (`out/`).

### Deferred / Backlog
- `CLAR-04`: Usability testing sessions with target age group (7–12) and educators.
- `A11Y-05`: In-app dynamic text-size preference control beyond standard browser zoom.
- Additional KSSR subject curriculum levels for Tahun 2–6 on all 8 celestial worlds.

### Out of Scope
- Real-time online multiplayer or backend user accounts.
- Live paid LLM API calls with real API keys during gameplay.
- Interstellar or galactic objects outside the Solar System.

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

## Context
Milestone **v1.4** initialized (2026-11-17). Shipped **v1.3** on 2026-11-17 with 17 phases completed, 347/347 tests passing.
