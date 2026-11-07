# Phase 08 Context: Pilot KSSR Standard 1 Prompt-Learning Levels

## 1. Vision & Core Decisions

### Core Objective
Author and integrate 5 pilot KSSR Semakan Standard 1 (Tahun 1) prompt-learning levels into the live runtime game engine, covering the foundational subjects mapped in Phase 07.

### Subject Worlds Structure (5 Distinct Worlds)
Instead of grouping them into one shared world, each planet receives its own dedicated World entry in `src/lib/kids/levels.ts` so that each subject has space to grow from Tahun 1 through Tahun 6:
- **World 6:** 🌕 **Bulan: Bahasa Melayu (Moon BM)**
  - Slug: `bulan-bm`
  - Color: `slate` / `sky`
  - Level 6.1: `6-1-bm-kucing-peromfu` (Oceanus Procellarum / DSKP 5.1: Kata Nama & Kata Kerja)
- **World 7:** 🌍 **Bumi: Sains (Earth Science)**
  - Slug: `bumi-sains`
  - Color: `emerald`
  - Level 7.1: `7-1-sains-benda-hidup` (Biosphere Sanctuary / DSKP 3.1: Benda Hidup vs Bukan Hidup)
- **World 8:** 🔴 **Marikh: Matematik (Mars Math)**
  - Slug: `marikh-matematik`
  - Color: `rose` / `red`
  - Level 8.1: `8-1-matematik-tambah-bintang` (Elysium Planitia / DSKP 2.1: Operasi Tambah asas)
- **World 9:** 🟡 **Zuhrah: Bahasa Inggeris (Venus English)**
  - Slug: `zuhrah-english`
  - Color: `amber` / `yellow`
  - Level 9.1: `9-1-english-colorful-toys` (Ishtar Terra / DSKP 2.1: Simple description & polite role-play)
- **World 10:** 🟣 **Utarid: Pendidikan Moral (Mercury Moral)**
  - Slug: `utarid-moral`
  - Color: `purple`
  - Level 10.1: `10-1-moral-sahabat-prihatin` (Borealis Planitia / DSKP 2.1: Tolong-menolong & empati)

### Content Authoring Strategy: Bahasa Melayu First
- Author rich, contextual, culturally authentic Bahasa Melayu MDX files (`src/content/kids/ms/`).
- Author corresponding English MDX files (`src/content/kids/en/`) with full baseline parity so English learners or bilingual classrooms can play both.
- Ensure all 5 levels pass `scripts/check-ms-vocabulary.js` (no banned slang, proper terminology like *tahap*, no residual untranslated English).

### Full Game Pipeline Integration
- **Levels Registry:** Register the 5 new worlds and levels in `src/lib/kids/levels.ts`.
- **Loader Map:** Wire the new level slugs into `src/lib/kids/level-content.ts` for all supported locales (with fallback to `en` and direct `ms` loaders).
- **Internationalization Bundles:** Add corresponding title and description keys in `messages/ms.json` and `messages/en.json`.
- **Static Export & Routing:** `generateStaticParams` in `src/app/level/[slug]/page.tsx` expands to all 24 level slugs (19 legacy + 5 pilot).
- **Automated Tests:** Update test assertions in `level-locale.test.tsx` and `verify-project.test.ts` to accommodate 24 levels.
- **Verification Gates:** `npx tsc --noEmit`, `npm test`, `npm run check:closure`, `npm run check:vocab`, and `npm run verify -- --gates-only` must all pass 100% green.
EOF
