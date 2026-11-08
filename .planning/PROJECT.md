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
     * **Mercury (Utarid)**: Sains / Pendidikan Moral
   - On each celestial world, 7 distinct geological features/regions correspond to Tahun 1 to Tahun 6 (and final boss/mastery challenge).

2. **3D Planetary Navigation & Interactive Cartography:**
   - From the title screen, users can enter a 3D Planetary Explorer powered by Three.js (interactive orbit, rotation, lighting, and planetary cards with basic info).
   - Clicking a planet zooms/selects that celestial body and presents its 7 cartographic regions (Tahun 1-6).
   - Earth is the starting point for foundational prompt lessons. Completing lessons or choosing to return launches a rocket animation that transitions back to the planetary system view.

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
   - Verified zero regression with `npm run verify` across all level routes and static assets.

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

### Active (v1.2: 3D Planetary Hub, Subject Cartography & Rocket Return)
- [ ] **PLANET-01**: Install Three.js & OrbitControls integration compatible with Next.js client-side rendering and static export.
- [ ] **PLANET-02**: Build 3D Planetary Explorer component allowing 3D visualization, interactive orbit/spin, and basic planetary info inspection for Earth, Moon, Mars, Venus, and Mercury.
- [ ] **PLANET-03**: Align planetary subject mapping: Earth (Foundational Prompt Lessons), Moon (Bahasa Melayu), Mars (English), Venus (Matematik), Mercury (Sains / Moral) with 7 geological features mapped to Tahun 1-6.
- [ ] **PLANET-04**: Implement Planet Detail / Cartography Screen showing the 7 macro features/regions (Tahun 1-6) per planet with bilingual descriptions and lesson route triggers.
- [ ] **PLANET-05**: Style lesson page backgrounds with dynamic planet-themed aesthetics (crust colors, stars, ambient glow) matching the active planet world.
- [ ] **FLOW-01**: Update Title Screen flow to seamlessly transition into the 3D Planetary Explorer.
- [ ] **FLOW-02**: Implement animated Rocket return from Earth/lesson completion back to the Planetary Explorer screen.
- [ ] **CURR-01**: Align subject-specific prompt lessons across Moon (BM), Mars (EN), Venus (Math), Mercury (Sains/Moral) to teach effective prompt structuring for kids following KSSR/KBAT principles.
- [ ] **CURR-02**: Enforce a minimum of 7 interactive stages/sections per lesson (e.g. Tahun 1 Bahasa Melayu) to ensure deep pedagogical progression and mastery.
- [ ] **GATE-01**: All new pages, components, and routes pass `npm run verify` (`tsc`, `vitest`, `npm run check:closure`, `npm run check:vocab`, and static `out/` export inspection).

### Out of Scope
- Real-time online multiplayer or backend user accounts.
- Live paid LLM API calls with real API keys during gameplay (game uses pre-computed interactive simulations, validator heuristics, and feedback).
- Photorealistic high-poly NASA 8K textures that blow up static bundle size (procedural Three.js shaders/bump/specular or lightweight textures optimized for fast web loading).

## Context
Shipped **v1.1** on 2026-11-07. Entering **v1.2** to implement the 3D Planetary System hub, subject-specific cartography (7 features per planet for Tahun 1-6), planet-themed lesson aesthetics, and rocket navigation flow.

---
*Last updated: 2026-11-08 (Milestone v1.2 initiation)*
