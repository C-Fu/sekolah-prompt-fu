# Phase 26: Jupiter (Sains) & Saturn (Sejarah) Year 1 Curriculum - Research
**Researched:** 2026-11-20
**Domain:** KSSR Sains & Sejarah Primary Year 1 Interactive Prompt Engineering MDX Authoring
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Jupiter (Sains Tahun 1) Focus:**
  - Topic: *Benda Hidup & Benda Bukan Hidup* (Living and Non-Living Things)
  - Pedagogical Goal: Teaching children how to guide AI to observe, compare, and classify biological characteristics (e.g. bernafas, memerlukan air/makanan, membiak vs tidak bernafas, tidak membesar).
  - Slug: `10-1-sains-benda-hidup`
  - File Paths:
    - `src/content/kids/ms/10-1-sains-benda-hidup.mdx`
    - `src/content/kids/en/10-1-sains-benda-hidup.mdx`
- **Saturn (Sejarah Tahun 1) Focus:**
  - Topic: *Garis Masa Diri & Riwayat Keluarga* (Personal Timeline, Chronology & Respectful Family Interview)
  - Pedagogical Goal: Teaching children chronological sequencing keywords (dahulu, sekarang, sebelum, selepas, tahun lepas) and formulating courteous, precise historical inquiry prompts.
  - Slug: `11-1-sejarah-garis-masa`
  - File Paths:
    - `src/content/kids/ms/11-1-sejarah-garis-masa.mdx`
    - `src/content/kids/en/11-1-sejarah-garis-masa.mdx`
- **Canonical 7-Stage Interactive Widget Flow:**
  - Each lesson contains at least 7 `<Section>` elements in sequential order:
    1. **Section 1: Pengenalan Konsep (Concept Discovery)** — Story hook with Peromfu exploring Great Red Spot (Jupiter) / Hexagon (Saturn).
    2. **Section 2: WordPredictor** — Predictive fill-in-the-blank for core subject terminology.
    3. **Section 3: PromptVsMistake** — Side-by-side contrast between a vague prompt and a precise observation/chronological prompt.
    4. **Section 4: PromptDoctor** — Diagnosing and fixing an incomplete prompt with missing attributes or timeframes.
    5. **Section 5: DragDropPrompt** — Reordering prompt components into the canonical structure: `[Peranan/Subjek] + [Tindakan/Kriteria] + [Format/Had]`.
    6. **Section 6: MagicWords** — Unlocking powerful prompt modifiers (e.g., 'Kategorikan mengikut ciri', 'Susun mengikut kronologi masa').
    7. **Section 7: LevelComplete** — XP celebration, star allocation, and mastery badge award.
- **Language & Static Compliance:**
  - All Malay content must pass `npm run check:vocab` with zero unlocalized English residuals.
  - All lessons are 100% static compatible with Next.js export.

### The Agent's Discretion
- Choice of specific living things (e.g. pokok bunga, kucing, burung) vs non-living things (batu, robot mainan, roket) for Sains challenges.
- Specific family chronology events (e.g. hari lahir, langkah pertama, masuk sekolah, hari sukan) for Sejarah timeline prompts.
- Exact text, options, explanations, and `aiThinking` dialogues matching KSSR DSKP standards and kid tone.

### Deferred Ideas (OUT OF SCOPE)
- Registering levels 10.1 & 11.1 into `levels.ts`, `level-content.ts`, and `section-titles.ts` or `PlanetBackground` theming (Deferred to Phase 28).
- Authoring Year 2–6 lessons (Future milestone scope).
- Modifying existing Earth (Worlds 1–5), Moon (6.1), Mars (7.1), Venus (8.1), or Mercury (9.1) lesson content.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| `LESSON-01` | User can play a complete Tahun 1 interactive prompt lesson for Jupiter (Sains: Benda Hidup & Benda Bukan Hidup / AI Observation Prompts) across 7 structured `<Section>` stages with rich interactive widgets (`WordPredictor`, `PromptDoctor`, `PromptVsMistake`, `DragDropPrompt`, `MagicWords`, `LevelComplete`). | Exact MDX component API, Section structure, and KSSR DSKP Sains Year 1 vocabulary verified. |
| `LESSON-02` | User can play a complete Tahun 1 interactive prompt lesson for Saturn (Sejarah: Garis Masa Diri & Keluarga / Historical Chronology Prompts) across 7 structured `<Section>` stages with rich interactive widgets. | Exact component props and KSSR DSKP Sejarah Year 1 chronological terminology verified. |
| `LESSON-05` | Both lessons are fully authored and localized in both Bahasa Melayu (`src/content/kids/ms/`) and English (`src/content/kids/en/`) with zero silent fallbacks and strict adherence to Malay vocabulary guards. | `scripts/check-ms-vocabulary.js` rules identified; test coverage verified with Vitest. |
</phase_requirements>

## Summary

Phase 26 authors two full Year 1 pilot curriculum lessons for the newly mapped outer planets:
1. **Jupiter (Musytari) - Sains**: `10-1-sains-benda-hidup.mdx` in `ms` and `en`.
2. **Saturn (Zuhal) - Sejarah**: `11-1-sejarah-garis-masa.mdx` in `ms` and `en`.

Each lesson is written in MDX using Next.js Turbopack-compatible JSX without frontmatter or import statements (global MDX component bindings provided by `mdx-components.tsx`). Each file contains at least 7 `<Section>` elements encapsulating the interactive components (`Panel`, `WordPredictor`, `PromptVsMistake`, `PromptDoctor`, `DragDropPrompt`, `MagicWords`, and `LevelComplete`).

Vitest test suite `src/__tests__/kids/subject-lessons-stages.test.ts` currently verifies the 7-stage architecture for subjects 6.1 through 9.1. Expanding this test suite to include `10-1-sains-benda-hidup` and `11-1-sejarah-garis-masa` guarantees that all 4 new MDX files exist, contain at least 7 `<Section>` elements, and conclude with `<LevelComplete levelSlug="..." />`.

**Primary recommendation:**
Follow the verified 7-stage MDX pattern from `6-1-bm-kucing-peromfu.mdx`, `7-1-english-colorful-toys.mdx`, `8-1-matematik-tambah-bintang.mdx`, and `9-1-moral-sahabat-prihatin.mdx`. Ensure zero English residuals in Malay files, verify against `check:vocab`, and extend `subject-lessons-stages.test.ts` to assert test passing.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| MDX Lesson Content | Content / Static Asset (`src/content/kids/{ms,en}/*.mdx`) | Next.js Build Pipeline | MDX content files are statically compiled at build time by Turbopack / `@next/mdx`. |
| Interactive Widgets State | Client Runtime Component (`src/components/kids/elements/*`) | LocalStorage (`progress.ts`) | Interactive widget state, submission, and validation are evaluated client-side in the browser. |
| Section Navigation & Locking | Client Provider (`LevelContentWrapper`, `level-slides.tsx`) | Level Context | Handles slide transitions, locking Next button until requirements are met. |
| Vocabulary Compliance | Node.js Test / Guard Script (`check-ms-vocabulary.js`) | CI / Pre-commit | Enforces pure Bahasa Melayu without accidental English residuals. |

## Standard Stack

### Core
| Library / System | Version | Purpose | Why Standard |
|------------------|---------|---------|--------------|
| Next.js `@next/mdx` | `^16.1.1` [VERIFIED: package.json:28] | MDX compilation | Built-in Next.js static MDX rendering engine. |
| React | `19.2.3` [VERIFIED: package.json:34] | Component runtime | Core UI rendering framework. |
| Vitest | `^2.1.9` [VERIFIED: package.json:52] | Test runner | Blazing fast unit and integration testing. |

### Supporting (In-Repo MDX Components)
[VERIFIED: mdx-components.tsx:50-65]
- `<Section>`: Slide container, registers section identity for navigation and lockstep completion.
- `<Panel character="peromfu" mood="...">`: Story dialogue card with Peromfu avatar (`happy`, `thinking`, `excited`, `confused`, `celebrating`).
- `<WordPredictor>`: Multiple-choice fill-in-the-blank for keywords.
- `<PromptVsMistake>`: A/B choice contrasting high-quality prompt vs vague/bad prompt.
- `<PromptDoctor>`: Multi-step prompt diagnostic and repair widget.
- `<DragDropPrompt>`: Word/clause block ordering widget for prompt formulas.
- `<MagicWords>`: Multi-slot prompt template enrichment widget with drop-down / chip selections.
- `<LevelComplete>`: Level graduation celebration and star persist widget.

## MDX Component Props & Contracts

All components are registered globally in [VERIFIED: mdx-components.tsx:50-65] and available directly inside MDX without imports. MDX files have **NO frontmatter** (`---`) and **NO import statements** (`import ...`).

### 1. `<Section>`
- Props: `{ children: ReactNode }` [VERIFIED: src/components/kids/elements/level-slides.tsx:25-27]
- Usage: Every stage is wrapped in `<Section>...</Section>`.

### 2. `<Panel>`
- Props: [VERIFIED: src/components/kids/elements/story-scene.tsx:90-95]
  - `character?: "peromfu" | "none"` (default `"peromfu"`)
  - `mood?: "happy" | "thinking" | "excited" | "confused" | "celebrating"` (default `"happy"`)
  - `children: React.ReactNode`
  - `highlight?: boolean`

### 3. `<WordPredictor>`
- Props: [VERIFIED: src/components/kids/elements/word-predictor.tsx:9-18]
  - `title?: string`
  - `instruction?: string`
  - `sentence: string` (e.g., `"Tumbuhan memerlukan ____ untuk hidup."`)
  - `options: string[]` (array of 4 choices)
  - `correctAnswer: string` (must match one item in `options`)
  - `explanation: string` (explanation of why the answer is correct)
  - `aiThinking?: string` (simulated AI reasoning thought)
  - `successMessage?: string`

### 4. `<PromptVsMistake>`
- Props: [VERIFIED: src/components/kids/elements/prompt-vs-mistake.tsx:10-16]
  - `question: string`
  - `good: string` (the effective prompt)
  - `bad: string` (the flawed or vague prompt)
  - `explanation?: string`
  - `peromfuMessage?: string`

### 5. `<PromptDoctor>`
- Props: [VERIFIED: src/components/kids/elements/prompt-doctor.tsx:9-21]
  - `title?: string`
  - `brokenPrompt: string`
  - `problems: Array<{ issue: string; symptom: string; fix: string }>` (typically 3 sequential stages)
  - `healedPrompt: string`
  - `successMessage?: string`

### 6. `<DragDropPrompt>`
- Props: [VERIFIED: src/components/kids/elements/drag-drop-prompt.tsx:10-16]
  - `title?: string`
  - `instruction?: string`
  - `pieces: string[]` (usually 3 clauses)
  - `correctOrder: number[]` (e.g., `[0, 1, 2]`)
  - `successMessage?: string`

### 7. `<MagicWords>`
- Props: [VERIFIED: src/components/kids/elements/magic-words.tsx:11-23]
  - `title?: string`
  - `sentence: string` (Use `___` for blanks)
  - `blanks: Array<{ hint: string; answers: string[]; id?: string; emoji?: string }>`
  - `successMessage?: string`

### 8. `<LevelComplete>`
- Props: [VERIFIED: src/components/kids/elements/level-complete.tsx:16-20]
  - `levelSlug: string` (e.g. `"10-1-sains-benda-hidup"`)
  - `stars?: number` (default `3`)
  - `message?: string`

## Curriculum & Terminology (KSSR Year 1)

### 1. Jupiter: Sains Tahun 1 (Unit 3: Benda Hidup dan Benda Bukan Hidup)
Authentic KSSR DSKP Terminology:
- **Benda Hidup (Living Things):**
  - Ciri-ciri: `bernafas` (breathes), `memerlukan air dan makanan` (needs water and food), `bergerak` (moves), `membesar` (grows), `membiak` (reproduces).
  - Contoh: manusia, haiwan (kucing, burung, ikan), tumbuhan (pokok bunga ros, pokok pisang).
- **Benda Bukan Hidup (Non-Living Things):**
  - Ciri-ciri: `tidak bernafas`, `tidak memerlukan makanan atau air`, `tidak membesar`, `tidak membiak`.
  - Contoh: batu, kereta mainan, kerusi, buku, robot mainan.
- **AI Prompting Angle:**
  - Guiding AI to observe and categorize by biological characteristics.
  - Formula: `[Peranan Subjek] + [Tindakan Pengelasan & Ciri] + [Format/Had]`.
  - Contoh Prompt: *"Bertindak sebagai pembantu sains cilik. Kelaskan senarai objek berikut kepada benda hidup atau benda bukan hidup berdasarkan keperluan makanan dan pernafasan dalam bentuk jadual ringkas."*

### 2. Saturn: Sejarah Tahun 1 (Unit 1: Diri dan Keluarga)
Authentic KSSR DSKP Terminology:
- **Garis Masa Diri & Riwayat Keluarga (Personal & Family Timeline):**
  - Konsep Kronologi: `dahulu` (past / then), `kini / sekarang` (present / now), `masa depan` (future), `sebelum` (before), `selepas` (after), `peristiwa penting` (milestones / significant events).
  - Contoh Garis Masa: Tahun 2018 (Dilahirkan), Tahun 2019 (Mula berjalan), Tahun 2023 (Prasekolah / Tadika), Tahun 2024 / Sekarang (Masuk Tahun 1).
  - Kaedah Temu Bual Bersopan (Polite Inquiry): Bertanya kepada datuk, nenek, ibu, atau bapa menggunakan perkataan santun: `sila`, `terima kasih`, `bolehkah`.
- **AI Prompting Angle:**
  - Guiding AI to organize events chronologically and ask polite historical interview questions.
  - Formula: `[Peranan Sejarawan] + [Peristiwa & Kata Masa Kronologi] + [Format Susunan]`.
  - Contoh Prompt: *"Bertindak sebagai sejarawan cilik. Susun peristiwa riwayat keluarga saya mengikut urutan masa dari dahulu hingga sekarang dalam satu senarai nombor ringkas."*

## Vocabulary Guard Rules (`scripts/check-ms-vocabulary.js`)

[VERIFIED: scripts/check-ms-vocabulary.js:90-108]
When authoring `src/content/kids/ms/*.mdx`, strictly avoid:
1. `\bbodil\b`: Invented non-word (use `lawak` / `kelakar`).
2. `\bbedtime\b`: Untranslated English (use `sebelum tidur`).
3. `\bsuperhero\b`: Untranslated English (use `adiwira`).
4. `\blevel\b`: Bare English content word (use `tahap` / `cabaran`). Note: `<LevelComplete levelSlug="..." />` is a JSX component/prop name, which does NOT count as a bare content word in regex `/ \blevel\b /i` because of word boundary matching in plain text vs JSX tags. However, avoid the word "level" in titles, body text, and prompts.
5. `bahasa inggeris`: Do not mention "bahasa inggeris" in Malay lessons (except in 7-1 English planet introduction).
6. `The cat sat` / `on the mat`: Old test residual phrases.

## Step-by-Step Lesson Architecture (7 Sections)

Both lessons must follow the exact 7-section structure:

### Lesson 10.1: `10-1-sains-benda-hidup` (Jupiter / Sains)
- **Section 1: Pengenalan Konsep (Concept Discovery)**
  - Panel with Peromfu exploring Musytari (Jupiter) and Great Red Spot (Bintik Merah Gergasi).
  - Introduction to scientific observation: living things vs non-living things.
- **Section 2: WordPredictor (Cabaran 1: Kenal Pasti Ciri Benda Hidup)**
  - Completing an observation sentence with key biological trait (`bernafas`, `air`, etc.).
- **Section 3: PromptVsMistake (Cabaran 2: Prompt Pemerhatian vs Kesilapan)**
  - Contrasting a vague prompt (`"Tengok haiwan"`) with a clear scientific observation prompt (`"Kelaskan kucing dan batu mengikut ciri bernafas..."`).
- **Section 4: PromptDoctor (Cabaran 3: Doktor Prompt — Rawat Arahan Sains)**
  - Diagnosing and fixing an incomplete prompt (`"Cari benda hidup"` -> healed prompt specifying role, subjects, and classification criteria).
- **Section 5: DragDropPrompt (Cabaran 4: Susun Formula Prompt Sains)**
  - Reordering prompt blocks: `[Peranan Pembantu Sains] + [Tindakan & Ciri Biologi] + [Format Senarai]`.
- **Section 6: MagicWords (Cabaran 5: Kata Ajaib — Penerokaan Alam)**
  - Blank-filling prompt template with options for living organisms, habitat, and life needs.
- **Section 7: LevelComplete (Cabaran Unggul: Jaguh Sains Musytari)**
  - Panel celebrating mastery + `<LevelComplete levelSlug="10-1-sains-benda-hidup" stars={3} message="..." />`.

### Lesson 11.1: `11-1-sejarah-garis-masa` (Saturn / Sejarah)
- **Section 1: Pengenalan Konsep (Concept Discovery)**
  - Panel with Peromfu exploring Zuhal (Saturn) and Heksagon Kutub Utara (North Polar Hexagon).
  - Introduction to time, chronology, and personal history.
- **Section 2: WordPredictor (Cabaran 1: Kata Kunci Kronologi)**
  - Completing a timeline sentence with temporal connector (`dahulu`, `sekarang`, `selepas`).
- **Section 3: PromptVsMistake (Cabaran 2: Temu Bual Santun vs Kasar)**
  - Contrasting an impolite, scrambled query with a courteous, chronological interview prompt.
- **Section 4: PromptDoctor (Cabaran 3: Doktor Prompt — Rawat Garis Masa)**
  - Diagnosing and healing a timeline prompt lacking time markers, context, and format.
- **Section 5: DragDropPrompt (Cabaran 4: Susun Garis Masa Keluarga)**
  - Reordering prompt blocks: `[Peranan Penemu Bual Cilik] + [Urutan Peristiwa Dahulu ke Sekarang] + [Format Senarai Bersopan]`.
- **Section 6: MagicWords (Cabaran 5: Kata Ajaib — Catatan Sejarah Diri)**
  - Blank-filling prompt template with options for milestones, past years, and memorable family moments.
- **Section 7: LevelComplete (Cabaran Unggul: Jaguh Sejarah Zuhal)**
  - Panel celebrating mastery + `<LevelComplete levelSlug="11-1-sejarah-garis-masa" stars={3} message="..." />`.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 2.1.9 [VERIFIED: package.json:52] |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run src/__tests__/kids/subject-lessons-stages.test.ts` |
| Vocab guard command | `npm run check:vocab` |
| Full suite command | `npm run test` |
| Build test command | `npm run build` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| `LESSON-01` | Jupiter Sains lesson exists in MS/EN with 7 sections and LevelComplete | integration | `npx vitest run src/__tests__/kids/subject-lessons-stages.test.ts` | ✅ (needs adding slugs to array) |
| `LESSON-02` | Saturn Sejarah lesson exists in MS/EN with 7 sections and LevelComplete | integration | `npx vitest run src/__tests__/kids/subject-lessons-stages.test.ts` | ✅ (needs adding slugs to array) |
| `LESSON-05` | Zero English residuals in Malay files and pure vocab compliance | unit / static | `npm run check:vocab` | ✅ `scripts/check-ms-vocabulary.js` |

### Wave 0 / Plan Update Gaps
- Update `SUBJECT_SLUGS` in `src/__tests__/kids/subject-lessons-stages.test.ts` to include:
  ```ts
  "10-1-sains-benda-hidup",
  "11-1-sejarah-garis-masa",
  ```
- No new framework installation needed.

## Security Domain
`security_enforcement`: N/A (Static MDX content files and client UI components only, no server API endpoints or backend mutations).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| MDX Component Registry | Don't create per-file React imports | Use global mapping in `mdx-components.tsx` | All MDX lessons rely on automatic MDX component injection without `import` boilerplate. |
| Section Navigation & Unlocking | Don't write custom slide buttons in MDX | Use `<Section>` wrapper and let `LevelContentWrapper` handle it | Section registration auto-manages slide dots, focus, and completion state. |
| Reward & XP Logic | Don't manually call storage APIs inside MDX | Use `<LevelComplete levelSlug="..." />` | Handles stars, localStorage update, telemetry, and rocket modal cleanly. |

## Common Pitfalls

### Pitfall 1: Frontmatter in MDX
**What goes wrong:** Adding `--- title: "..." ---` at top of MDX.
**Why it happens:** Standard MDX in content collections often uses frontmatter.
**How to avoid:** Sekolah Prompt-Fu kids MDX files start directly with `<Section>`. Frontmatter will render as raw markdown or cause compile error.

### Pitfall 2: Accidental English Residuals in Malay Lessons
**What goes wrong:** Writing `"Level"` instead of `"Tahap"`, or leaving English descriptions in `explanation` or `aiThinking`.
**Why it happens:** Translating from English templates and missing nested props.
**How to avoid:** Run `npm run check:vocab` immediately after writing MDX files. Check every string in `explanation`, `peromfuMessage`, `aiThinking`, and `instruction`.

### Pitfall 3: Broken Order in DragDropPrompt
**What goes wrong:** Setting `correctOrder` mismatched with `pieces`.
**Why it happens:** Confusing 0-indexed original pieces with their display positions.
**How to avoid:** Define `pieces` in sequential correct order (0, 1, 2) and set `correctOrder={[0, 1, 2]}`. `DragDropPrompt` internally shuffles on mount.

### Pitfall 4: Registering Slugs in Levels Registry Too Early
**What goes wrong:** Adding `10-1` and `11-1` to `levels.ts` or `level-content.ts` in Phase 26.
**Why it happens:** Wanting to see the level in the map immediately.
**How to avoid:** `ROUTE-01` and level registry expansion is explicitly deferred to Phase 28. Phase 26 only authors the MDX files and validates them via `subject-lessons-stages.test.ts` and `check:vocab`.

## Sources

### Primary (HIGH confidence)
- `src/content/kids/ms/6-1-bm-kucing-peromfu.mdx`, `7-1-english-colorful-toys.mdx`, `8-1-matematik-tambah-bintang.mdx`, `9-1-moral-sahabat-prihatin.mdx` [VERIFIED: in-repo]
- `src/content/kids/en/6-1-bm-kucing-peromfu.mdx`, `7-1-english-colorful-toys.mdx` [VERIFIED: in-repo]
- `src/components/kids/elements/index.ts` and individual element implementations [VERIFIED: in-repo]
- `mdx-components.tsx` [VERIFIED: in-repo]
- `scripts/check-ms-vocabulary.js` [VERIFIED: in-repo]
- `src/__tests__/kids/subject-lessons-stages.test.ts` [VERIFIED: in-repo]
- `src/lib/kids/planets.ts` (Jupiter and Saturn feature 1 descriptions & badges) [VERIFIED: in-repo]

## Metadata
**Confidence breakdown:**
- Standard stack: HIGH - Verified directly in codebase.
- Architecture: HIGH - Matched against existing 4 subject pilot lessons.
- Curriculum & Terminology: HIGH - Based on authentic KSSR DSKP Year 1 standards for Sains and Sejarah.

**Research date:** 2026-11-20
**Valid until:** Indefinite (internal project codebase standard)
