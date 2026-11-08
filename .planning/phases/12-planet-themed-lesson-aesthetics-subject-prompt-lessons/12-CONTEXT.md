# Phase 12: Planet-Themed Lesson Aesthetics & Subject Prompt Lessons - Context

**Gathered:** 2026-11-08  
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers dynamic planet-themed aesthetics across all interactive lesson views and expands the subject prompt engineering curriculum to meet the minimum 7 interactive stages (`<Section>`) per lesson requirement. It aligns the curriculum worlds in `src/lib/kids/levels.ts` to match Phase 09's subject mapping (Earth = Worlds 1-5 Prompting, Moon = World 6 BM, Mars = World 7 English, Venus = World 8 Matematik, Mercury = World 9 Pendidikan Moral). Each subject lesson is authored with rich pedagogical progression (Intro, Concept Demo, 3 Core Prompt Challenges, Prompt Doctor / Debugger, and Final Mastery Boss Challenge with `<LevelComplete>`) in both Bahasa Melayu (`ms`) and English (`en`), with zero residual English fallback and certified static export.

</domain>

<decisions>
## Implementation Decisions

### 1. Dynamic Contextual Lesson Aesthetics (THEME-01)
- **D-01:** Dynamically styled lesson background:
  - Inside level pages, the background detects the active planet/world and swaps the ambient gradient, celestial particles, and theme accents:
    - **Earth (Worlds 1-5)**: Classic bright daytime sky gradient (`#4A90D9` to `#B8E8F8`) with drifting pixel clouds.
    - **Moon (World 6 - BM)**: Deep cosmic slate/charcoal gradient (`#0F172A` to `#1E293B`), silver crater rim glow, twinkling white stars.
    - **Mars (World 7 - English)**: Rust-red oxidized atmosphere (`#450A0A` to `#7F1D1D`), warm amber stars, Martian dust haze.
    - **Venus (World 8 - Matematik)**: Dense sulfuric golden/amber glow (`#78350F` to `#D97706`), golden nebula dust.
    - **Mercury (World 9 - Moral)**: Deep crater basalt & purple dusk (`#1E1B4B` to `#3B0764`), ultra-bright violet cosmic points.
  - The lesson wrapper (`LevelContentWrapper`) and navigation footer apply the matching theme border and accent highlights (`accentColor`).

### 2. World Curriculum Alignment in levels.ts
- **D-02:** Realign `src/lib/kids/levels.ts`:
  - **Worlds 1–5**: Earth (Foundational Prompting Academy - 19 core levels).
  - **World 6**: Moon (Bulan: Bahasa Melayu - `6-1-bm-kucing-peromfu`).
  - **World 7**: Mars (Marikh: English Language - `7-1-english-colorful-toys`).
  - **World 8**: Venus (Zuhrah: Matematik - `8-1-matematik-tambah-bintang`).
  - **World 9**: Mercury (Utarid: Pendidikan Moral - `9-1-moral-sahabat-prihatin`).
  - Ensures clean 1-to-1 match with Phase 09 `PLANET_WORLDS` (`moon-bm`, `mars-english`, `venus-matematik`, `mercury-moral`).

### 3. Minimum 7 Stages per Subject Lesson (PEDAG-01, PEDAG-02)
- **D-03:** Each subject lesson is structured with at least 7 distinct interactive stages (`<Section>`):
  - **Stage 1 (Section 1)**: Mission Briefing & Subject Context (Story with Peromfu).
  - **Stage 2 (Section 2)**: Core Prompting Concept Demonstration (How clear instructions guide AI).
  - **Stage 3 (Section 3)**: Interactive Challenge 1 (e.g. `WordPredictor` / Identifying keywords).
  - **Stage 4 (Section 4)**: Interactive Challenge 2 (e.g. `DragDropPrompt` / Assembling prompt components).
  - **Stage 5 (Section 5)**: Interactive Challenge 3 (e.g. `MagicWords` / Applying constraints & style).
  - **Stage 6 (Section 6)**: Prompt Doctor / Debugging (e.g. `PromptDoctor` / Fixing vague/broken prompt).
  - **Stage 7 (Section 7)**: Mastery Boss Challenge & Level Complete (Capstone prompt task unlocking 3 stars and `<LevelComplete>` badge).
- **D-04:** Both language files (`src/content/kids/en/*.mdx` and `src/content/kids/ms/*.mdx`) must be authored symmetrically with full native terminology in Malay (e.g. `kata kerja`, `ayat matematik`, `sopan-santun`) passing `check:vocab`.

### Builder Discretion
- Exact styling of background star particles vs cloud animations based on active world number.
- Choice of interactive widgets per stage (e.g. `StepByStep`, `PromptDoctor`, `WordPredictor`, `DragDropPrompt`, `PromptLab`).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Schemas & Registries
- `src/lib/kids/planets.ts` — `PLANET_WORLDS`, theme colors, and geological features.
- `src/lib/kids/levels.ts` — Worlds and level registry to align.
- `src/components/kids/layout/level-content-wrapper.tsx` — Level host component and section navigation.
- `src/app/layout.tsx` — Root layout holding the default background and header.

### Interactive Components
- `src/components/kids/elements/level-complete.tsx` — Completion banner and rocket launch modal.
- `src/components/kids/consumers/*.tsx` — Interactive MDX widgets (`DragDropPrompt`, `WordPredictor`, `PromptDoctor`, `MagicWords`, `StepByStep`, `PromptLab`).

### Content Corpus
- `src/content/kids/en/*.mdx` & `src/content/kids/ms/*.mdx` — Lesson files for BM (6-1), English (7-1), Math (8-1), and Moral (9-1).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `LevelProvider` in `src/components/kids/providers/level-context.tsx`: Provides current `levelSlug` to dynamically resolve the active world and planet.
- `src/lib/kids/planets.ts`: Exposes `getPlanetWorld()` and theme color definitions.
- `scripts/check-ms-vocabulary.js`: Strict guard checking for forbidden English terms in Malay content.

### Established Patterns
- Next.js static export (`output: 'export'`) with static slug pre-generation (`generateStaticParams`).
- Clean import closures (`scripts/check-kids-import-closure.js`).

</code_context>

<specifics>
## Specific Ideas
- Celestial backgrounds with subtle ambient star drifting on Moon, Mars, Venus, and Mercury while preserving the cheerful pixel art clouds for Earth.

</specifics>

<deferred>
## Deferred Ideas
- Interactive 3D planetary mini-globe spinning inside the lesson header (keep 2D pixel-art and theme styling for performance).

</deferred>

---

*Phase: 12-planet-themed-lesson-aesthetics-subject-prompt-lessons*  
*Context gathered: 2026-11-08*
