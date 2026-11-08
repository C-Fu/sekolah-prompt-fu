# Milestones

## v1.2 3D Planetary Hub, Subject Cartography & Rocket Return (Shipped: 2026-11-09)

**Phases completed:** 5 phases (Phases 09–13), 11 plans, 23 tasks  
**Code Changes:** 122 files changed, 14,050 insertions(+), 974 deletions(-)

**Key accomplishments:**
- **Planetary Cartographic Alignment:** Symmetrically mapped 5 celestial worlds to core subjects (Earth = Prompting Academy, Moon = BM, Mars = English, Venus = Matematik, Mercury = Moral) and established 35 authentic geological features (Tahun 1–6 + Capstone Boss "Cabaran Unggul") with spherical coordinate math (`latLonToVector3`).
- **3D Solar System & Planetary Explorer (Three.js):** Integrated SSR-safe Three.js canvas, bundled 7 equirectangular NASA textures (< 750 KB total) with CC-BY-4.0 attribution, interactive solar system view with OrbitControls drag disambiguation, deep planet cartography with pulsing beacon pins, and glassmorphic telemetry HUD.
- **Game Flow & Grand Rocket Launch:** Implemented Title Screen dual entry paths (`/map` vs `/planets`), retro pixel rocket sprite, and full-screen 3.. 2.. 1.. BLAST OFF! countdown animation triggered on Earth graduation (`5-4-graduation-day`) transitioning cadets to `/planets`.
- **Dynamic Celestial Theming:** Reactive `PlanetBackground` component adapting ambient sky, dust, clouds, and stars per planet, with accent-tinted lesson navigation borders.
- **7-Stage Interactive Subject Curriculum:** Authored all 4 primary subject lessons across at least 7 structured `<Section>` stages with rich interactive widgets (`WordPredictor`, `DragDropPrompt`, `MagicWords`, `PromptDoctor`, `StepByStep`) and `<LevelComplete>` celebration.
- **NFR-2 Quality & Route Certification:** Added explicit inspection for `out/planets/index.html` to `scripts/verify-project.js`, eliminated all ESLint errors (0 errors), passed Malay vocabulary guard on 23 MDX files, verified 406 modules in import closure, and certified 245/245 tests green with 100% static export.

---

## v1.1 Rebrand, Tech Debt, & KSSR Tahun 1 Integration (Shipped: 2026-11-07)

**Phases completed:** 4 phases (Phases 5-8), 8 plans, 16 tasks

**Key accomplishments:**
- Replaced legacy `prompts.chat` Open Graph social preview (`public/og.png`, `src/app/opengraph-image.png`, `src/app/twitter-image.png`) with a high-resolution custom Sekolah Prompt-Fu banner featuring Peromfu the robot, pixel styling, and dual-language tags.
- Repaired `scripts/check-kids-import-closure.js` to target promoted root routes and wired closure check and vocabulary check (`npm run check:closure`, `npm run check:vocab`) directly into `package.json` scripts and GitHub Actions CI.
- Consolidated supported locales into a canonical single source of truth in `src/lib/i18n/config.ts`, eliminating list drift across config and settings modal, and purged dead code/assets.
- Added a kid-friendly dual toggle button `[ BM | EN ]` directly on `KidsHeader` (both desktop and mobile dropdown views) for 1-click language switching.
- Established the Malaysian KSSR Semakan & KBAT prompt-learning framework, mapping primary subjects to celestial planets (Moon=BM, Earth=Sains, Mars=Matematik, Venus=English, Mercury=Moral) and 30 geological regions to Standards 1-6.
- Authored and wired 5 pilot interactive prompt-learning levels in both Bahasa Melayu (`src/content/kids/ms/`) and English (`src/content/kids/en/`) covering BM, Sains, Matematik, English, and Pendidikan Moral, verified with zero silent English fallback and full static export certification across all 24 routes.

---

## v1.0 Kids Prompting Game Standalone & GitHub Pages (Shipped: 2026-11-07)

**Phases completed:** 5 phases, 27 plans, 51 tasks

**Key accomplishments:**
- Kids entry now renders through an auth-free, request-independent root shell.
- Pruned npm manifest/lockfile to a kids-only surface (1492 -> 826 packages), deleted community prompt datasets.
- Removed non-kids book MDX corpus and editor data (565 files, ~215k lines).
- Kids game promoted to application root (/, /map, /level/[slug]), music bundled locally, and 100% static export built for GitHub Pages.
- Full Bahasa Melayu localization across all 19 original interactive MDX levels.
- Committed Node-stdlib `scripts/verify-project.js` that certifies TypeScript, Vitest, and inspects `out/`.

---
