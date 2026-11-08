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

5. **Quality Gates & Clean Imports:**
   - Dedicated scripts for import closure (`npm run check:closure`) and vocabulary checks (`npm run check:vocab`) wired into CI.
   - Verified zero regression with `npm run verify` across all 23 level routes, `/`, `/map`, `/planets`, and static assets.

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

### Active
- (none — run `/gsd-new-milestone` to start v1.3)

### Out of Scope
- Real-time online multiplayer or backend user accounts.
- Live paid LLM API calls with real API keys during gameplay (game uses pre-computed interactive simulations, validator heuristics, and feedback).
- Photorealistic high-poly NASA 8K textures that blow up static bundle size.

## Context
Shipped **v1.2** on 2026-11-09 (Phases 09–13; 11 plans, 23 tasks). Total test suite is 245/245; `npm run verify` certifies TypeScript, Vitest, and static export inspection across 31 routes including `/planets`, `/`, `/map`, and 23 level routes.

---
*Last updated: 2026-11-09 (Milestone v1.2 completion)*
