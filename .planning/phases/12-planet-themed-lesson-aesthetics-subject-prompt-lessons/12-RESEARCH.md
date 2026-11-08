# Phase 12: Planet-Themed Lesson Aesthetics & Subject Prompt Lessons - Research
**Researched:** 2026-11-08  
**Domain:** Dynamic UI Theming, Context-Driven Celestial Aesthetics, Pedagogical MDX Authoring & Static Route Alignment  
**Confidence:** HIGH  

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Dynamically styled lesson background:
  - Inside level pages, the background detects the active planet/world and swaps the ambient gradient, celestial particles, and theme accents:
    - **Earth (Worlds 1-5)**: Classic bright daytime sky gradient (`#4A90D9` to `#B8E8F8`) with drifting pixel clouds.
    - **Moon (World 6 - BM)**: Deep cosmic slate/charcoal gradient (`#0F172A` to `#1E293B`), silver crater rim glow, twinkling white stars.
    - **Mars (World 7 - English)**: Rust-red oxidized atmosphere (`#450A0A` to `#7F1D1D`), warm amber stars, Martian dust haze.
    - **Venus (World 8 - Matematik)**: Dense sulfuric golden/amber glow (`#78350F` to `#D97706`), golden nebula dust.
    - **Mercury (World 9 - Moral)**: Deep crater basalt & purple dusk (`#1E1B4B` to `#3B0764`), ultra-bright violet cosmic points.
  - The lesson wrapper (`LevelContentWrapper`) and navigation footer apply the matching theme border and accent highlights (`accentColor`).
- **D-02:** Realign `src/lib/kids/levels.ts`:
  - **Worlds 1–5**: Earth (Foundational Prompting Academy - 19 core levels).
  - **World 6**: Moon (Bulan: Bahasa Melayu - `6-1-bm-kucing-peromfu`).
  - **World 7**: Mars (Marikh: English Language - `7-1-english-colorful-toys`).
  - **World 8**: Venus (Zuhrah: Matematik - `8-1-matematik-tambah-bintang`).
  - **World 9**: Mercury (Utarid: Pendidikan Moral - `9-1-moral-sahabat-prihatin`).
  - Ensures clean 1-to-1 match with Phase 09 `PLANET_WORLDS` (`moon-bm`, `mars-english`, `venus-matematik`, `mercury-moral`).
- **D-03:** Each subject lesson is structured with at least 7 distinct interactive stages (`<Section>`):
  - **Stage 1 (Section 1)**: Mission Briefing & Subject Context (Story with Peromfu).
  - **Stage 2 (Section 2)**: Core Prompting Concept Demonstration (How clear instructions guide AI).
  - **Stage 3 (Section 3)**: Interactive Challenge 1 (e.g. `WordPredictor` / Identifying keywords).
  - **Stage 4 (Section 4)**: Interactive Challenge 2 (e.g. `DragDropPrompt` / Assembling prompt components).
  - **Stage 5 (Section 5)**: Interactive Challenge 3 (e.g. `MagicWords` / Applying constraints & style).
  - **Stage 6 (Section 6)**: Prompt Doctor / Debugging (e.g. `PromptDoctor` / Fixing vague/broken prompt).
  - **Stage 7 (Section 7)**: Mastery Boss Challenge & Level Complete (Capstone prompt task unlocking 3 stars and `<LevelComplete>` badge).
- **D-04:** Both language files (`src/content/kids/en/*.mdx` and `src/content/kids/ms/*.mdx`) must be authored symmetrically with full native terminology in Malay (e.g. `kata kerja`, `ayat matematik`, `sopan-santun`) passing `check:vocab`.

### the agent's Discretion
- Exact styling of background star particles vs cloud animations based on active world number.
- Choice of interactive widgets per stage (e.g. `StepByStep`, `PromptDoctor`, `WordPredictor`, `DragDropPrompt`, `PromptLab`).

### Deferred Ideas (OUT OF SCOPE)
- Interactive 3D planetary mini-globe spinning inside the lesson header (keep 2D pixel-art and theme styling for performance).
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| THEME-01 | Dynamic celestial theme background in level views responding to world/planet | Architected via client-side `PlanetBackground` or Level context in `RootLayout` / `LevelContentWrapper` |
| PEDAG-01 | Realign subject worlds 6-9 in `levels.ts` with Phase 09 cartographic schema (Moon=BM, Mars=English, Venus=Math, Mercury=Moral) | Complete audit of `levels.ts`, `planets.ts`, route resolution, and slug re-indexing |
| PEDAG-02 | Minimum 7 interactive `<Section>` stages per subject lesson with authentic Year 1 pedagogy | Exact 7-stage specification mapped for BM, English, Math, and Moral with interactive widgets |
| I18N-01 | Symmetrical EN/MS bilingual parity and zero English leak in Malay MDX | Guarded via `scripts/check-ms-vocabulary.js` and `messages/{en,ms}.json` sync |
</phase_requirements>

---

## Summary

Phase 12 elevates the Sekolah Prompt-Fu learning experience by introducing planet-tailored ambient aesthetics to the lesson views and establishing a rigorous 7-stage interactive pedagogical structure for the Year 1 subject prompt engineering curriculum.

Currently, the root layout (`src/app/layout.tsx`) statically renders an Earth-like blue sky gradient (`linear-gradient(180deg, #4A90D9 ... #B8E8F8)`) with drifting pixel clouds across all routes. Because `LevelProvider` already wraps the entire body inside `RootLayout`, the active level slug (`useLevelSlug()`) is globally accessible on the client. By inspecting this slug, the background can dynamically morph between Earth (daytime pixel clouds), the Moon (lunar dark slate with twinkling stars), Mars (rust-red oxidized dust haze), Venus (sulfuric golden amber nebula), and Mercury (violet dusk with crystalline star points).

Furthermore, the curriculum worlds in `src/lib/kids/levels.ts` are currently misaligned with the cartographic schema defined in Phase 09 (`src/lib/kids/planets.ts`). In `levels.ts`, World 7 is currently "Bumi: Sains" (`7-1-sains-benda-hidup`), World 8 is "Marikh: Matematik", World 9 is "Zuhrah: English", and World 10 is "Utarid: Moral". Under locked decision **D-02**, worlds 6–9 are realigned to match Phase 09 exactly:
1. **World 6**: Moon (`6-1-bm-kucing-peromfu`)
2. **World 7**: Mars (`7-1-english-colorful-toys`)
3. **World 8**: Venus (`8-1-matematik-tambah-bintang`)
4. **World 9**: Mercury (`9-1-moral-sahabat-prihatin`)

Each of these four subject lessons will be authored with at least 7 interactive stages (`<Section>`), culminating in `<LevelComplete>`, tested for both `en` and `ms` locales, and verified against `npm run check:vocab`, `npm run check:closure`, and `npm run verify`.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Dynamic Theme Background | Client Component (`PlanetBackground`) | Root Shell (`RootLayout`) | Renders animated gradients, starfields, or drifting clouds based on reactive `levelSlug` while preserving SSR compatibility. |
| Navigation Footer Accents | Client Component (`LevelContentWrapper`) | UI Tokens / Tailwind | Applies border and button highlight colors matching the active planet's `accentColor`. |
| Curriculum World Registry | Static Lib (`src/lib/kids/levels.ts`) | Server/Static Generator | Generates static params for all 23 levels during `npm run build` static export. |
| Subject Lesson Content | MDX Corpus (`src/content/kids/{en,ms}/*.mdx`) | MDX Runtime Components | Supplies 7 distinct stages per lesson with interactive widget verification. |
| Vocabulary Compliance | Node Guard Script (`scripts/check-ms-vocabulary.js`) | CI / Pre-commit | Enforces pure Bahasa Melayu terminology in `ms/*.mdx`. |

---

## Standard Stack

### Core
| Library / System | Version | Purpose | Why Standard |
|------------------|---------|---------|--------------|
| Next.js Static Export | `15.x` | SSG HTML generation | Project requirement: zero server runtime, pure static output in `out/`. |
| React Context | `19.x` | Global level state | `LevelProvider` in `level-context.tsx` shares active slug without prop drilling. |
| Tailwind CSS & CSS Animations | `3.4.x` | Performant particle & sky animations | Pure CSS keyframes ensure 60fps star twinkling and cloud drift with zero JS animation overhead. |
| MDX Registry | Custom | Section & widget hydration | Renders interactive components (`<WordPredictor>`, `<DragDropPrompt>`, etc.) inside compiled MDX. |

---

## Dynamic Background Architecture (THEME-01)

### The Challenge
1. In `src/app/layout.tsx`, the background sky gradient and animated clouds are hardcoded in the server component root:
```tsx
{/* Smooth gradient sky background */}
<div
  className="absolute inset-0 -z-10"
  style={{
    background:
      "linear-gradient(180deg, #4A90D9 0%, #87CEEB 30%, #98D8F0 60%, #B8E8F8 100%)",
  }}
/>
```
2. In Next.js App Router with `output: 'export'`, `RootLayout` is rendered as an async server component. However, `LevelProvider` is already a client component mounted around the children in `RootLayout`:
```tsx
<LevelProvider>
  <MusicProvider>
    <LocaleDirection ...>
      ...
```
3. When the user navigates between `/`, `/map`, `/planets`, and `/level/[slug]`, the route transitions smoothly on the client. If the user enters `/level/7-1-english-colorful-toys`, `LevelContentWrapper` executes `setLevelSlug("7-1-english-colorful-toys")`.

### Architectural Solution: `PlanetBackground`
Create a dedicated client component `src/components/kids/layout/planet-background.tsx` placed inside `LocaleDirection` in `RootLayout`.

`PlanetBackground` consumes `useLevelSlug()` and maps the level to its planet theme:
- If `!levelSlug`: Default Earth sky (or map view).
- If `levelSlug` belongs to Worlds 1-5: Earth Sky (`#4A90D9` to `#B8E8F8`) with pixel clouds.
- If `levelSlug` belongs to World 6 (Moon): Cosmic slate gradient (`#0F172A` to `#1E293B`) with silver glow and twinkling stars.
- If `levelSlug` belongs to World 7 (Mars): Rust-red gradient (`#450A0A` to `#7F1D1D`) with Martian dust particles and warm amber stars.
- If `levelSlug` belongs to World 8 (Venus): Golden amber glow (`#78350F` to `#D97706`) with sulfuric haze and golden stars.
- If `levelSlug` belongs to World 9 (Mercury): Basalt purple dusk (`#1E1B4B` to `#3B0764`) with electric violet cosmic points.

### CSS Starfield Implementation
To avoid heavy canvas or Three.js dependencies in the 2D lesson view, create pure CSS starfields:
```css
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
@keyframes dustDrift {
  0% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-10px) translateX(5px); }
  100% { transform: translateY(0px) translateX(0px); }
}
```
A lightweight SVG/CSS starfield component renders fixed, deterministic pixel stars positioned via percentages with staggered animation delays.

---

## Curriculum Alignment in `levels.ts` (PEDAG-01)

### World Mapping Comparison

| World # | Current in `levels.ts` | Target Alignment (D-02 & Phase 09) | Planet | Subject | Slug |
|---------|------------------------|-----------------------------------|--------|---------|------|
| 1–5 | Earth (Worlds 1–5) | Earth (Worlds 1–5) | Earth | Prompting 101 | (19 core levels) |
| 6 | Bulan: Bahasa Melayu | Bulan: Bahasa Melayu | Moon | Bahasa Melayu | `6-1-bm-kucing-peromfu` |
| 7 | Bumi: Sains (`7-1-sains-benda-hidup`) | Marikh: English Language | Mars | English | `7-1-english-colorful-toys` |
| 8 | Marikh: Matematik (`8-1-matematik-tambah-bintang`) | Zuhrah: Matematik | Venus | Matematik | `8-1-matematik-tambah-bintang` |
| 9 | Zuhrah: English (`9-1-english-colorful-toys`) | Utarid: Pendidikan Moral | Mercury | Moral | `9-1-moral-sahabat-prihatin` |
| 10 | Utarid: Moral (`10-1-moral-sahabat-prihatin`) | *Removed (Merged into World 9)* | — | — | — |

### Impact Analysis of Realigning Worlds
1. **Total Levels Count**:
   - Currently: 19 (Earth) + 5 (Worlds 6-10) = 24 levels.
   - Target: 19 (Earth) + 4 (Worlds 6-9) = 23 levels.
   - Note on `7-1-sains-benda-hidup`: User locked decision D-02 explicitly specifies:
     - World 6 = Moon (BM)
     - World 7 = Mars (English)
     - World 8 = Venus (Matematik)
     - World 9 = Mercury (Moral)
     Science is retired from the active curriculum (or moved to a deferred state). The level slug `9-1-english-colorful-toys` becomes `7-1-english-colorful-toys`, and `10-1-moral-sahabat-prihatin` becomes `9-1-moral-sahabat-prihatin`. `8-1-matematik-tambah-bintang` stays in World 8 (Venus).
2. **Slug Renaming & File Renaming**:
   - Rename `src/content/kids/{en,ms}/9-1-english-colorful-toys.mdx` -> `7-1-english-colorful-toys.mdx`
   - Rename `src/content/kids/{en,ms}/10-1-moral-sahabat-prihatin.mdx` -> `9-1-moral-sahabat-prihatin.mdx`
   - Remove/archive `7-1-sains-benda-hidup.mdx` from active loaders.
   - Update `src/lib/kids/level-content.ts` import map and loader registry.
   - Update `src/lib/kids/planets.ts` `resolveMissionRoute()`:
     ```typescript
     case 'earth-prompting': return '/map';
     case 'moon-bm': return '/level/6-1-bm-kucing-peromfu';
     case 'mars-english': return '/level/7-1-english-colorful-toys';
     case 'venus-matematik': return '/level/8-1-matematik-tambah-bintang';
     case 'mercury-moral': return '/level/9-1-moral-sahabat-prihatin';
     ```
   - Update `messages/en.json` and `messages/ms.json` world/level keys.
   - Update tests expecting 24 levels to 23 levels (`level-locale.test.tsx`, `verify-project.js`).

---

## Curriculum Authoring: 7 Interactive Stages (PEDAG-01, PEDAG-02)

To satisfy **D-03**, every subject lesson must have at least 7 distinct `<Section>` elements with active interactive widgets and culminating in `<LevelComplete>`.

### 1. `6-1-bm-kucing-peromfu` (Moon: Bahasa Melayu - Tahun 1)
- **Pedagogical Theme**: KSSR Semakan Bahasa Melayu Tahun 1 — Kata Nama Am/Khas, Kata Kerja Aktif, Kata Adjektif, Pembinaan Ayat Tunggal.
- **7-Stage Blueprint**:
  1. `<Section>` 1: **Pengenalan & Misi Angkasa**: Peromfu tiba di Bulan (Lautan Procellarum). Cikgu minta kita bina ayat bercerita tentang kucing peliharaan.
  2. `<Section>` 2: **Konsep Utama — Kuasa Kata Kerja**: Peromfu menerangkan bahawa AI perlukan kata kerja aksi untuk melukis pergerakan yang hidup.
  3. `<Section>` 3: **Cabaran 1 — `<WordPredictor>`**: Memilih kata kerja aksi lincah (`melompat`) dan bukannya kata nama atau kata sifat pasif.
  4. `<Section>` 4: **Cabaran 2 — `<DragDropPrompt>`**: Menyusun formula ayat asas: `[Watak/Kata Nama] + [Kata Kerja] + [Keterangan Tempat]`.
  5. `<Section>` 5: **Cabaran 3 — `<MagicWords>`**: Mengembangkan ayat dengan kata adjektif sifat/warna (`bulu putih gebu`, `bermain riang`).
  6. `<Section>` 6: **Cabaran 4 — `<PromptDoctor>`**: Membaiki prompt lemah ("Lukis kucing") kepada arahan lengkap dengan watak, aksi dan emosi.
  7. `<Section>` 7: **Cabaran Unggul & Tamat Tahap**: `<PromptLab>` / Ringkasan capstone diakhiri dengan `<LevelComplete levelSlug="6-1-bm-kucing-peromfu" stars={3} />`.

### 2. `7-1-english-colorful-toys` (Mars: English Language - Year 1)
- **Pedagogical Theme**: CEFR / KSSR English Year 1 — Unit 2: Let's Play (Toys & Colors), Polite Requests ("Please show me..."), Role-Play Personas ("Act as a toy shopkeeper").
- **7-Stage Blueprint**:
  1. `<Section>` 1: **Mission Briefing**: Peromfu lands in Elysium Planitia on Mars! Visiting the Martian Toy Bazaar.
  2. `<Section>` 2: **Core Concept — AI Role-Play & Politeness**: Teaching kids how giving AI a persona ("friendly shopkeeper") and polite phrasing shapes friendly responses.
  3. `<Section>` 3: **Challenge 1 — `<WordPredictor>`**: Identifying color adjectives (`blue`, `green`) to specify toys clearly.
  4. `<Section>` 4: **Challenge 2 — `<DragDropPrompt>`**: Assembling a polite request: `[Greeting/Please] + [Show me] + [Quantity & Color Toy]`.
  5. `<Section>` 5: **Challenge 3 — `<MagicWords>`**: Prompt template crafting with role, items, and response length constraint (`one short sentence`).
  6. `<Section>` 6: **Challenge 4 — `<PromptDoctor>`**: Debugging a rude/vague prompt ("Give toys") into a polite, structured dialogue prompt.
  7. `<Section>` 7: **Mastery Boss & Level Complete**: Capstone toy shopping role-play prompt finishing with `<LevelComplete levelSlug="7-1-english-colorful-toys" stars={3} />`.

### 3. `8-1-matematik-tambah-bintang` (Venus: Matematik - Tahun 1)
- **Pedagogical Theme**: KSSR Matematik Tahun 1 — Operasi Tambah dalam lingkungan 20, Kombinasi Nombor (Number Bonds), Format Ayat Matematik, Penaakulan Langkah demi Langkah.
- **7-Stage Blueprint**:
  1. `<Section>` 1: **Misi Zuhrah**: Mengira gugusan bintang di sebalik kabut emas Dataran Sedna.
  2. `<Section>` 2: **Konsep Utama — Kekangan Format & Logik**: Mengapa AI perlukan format jawapan spesifik supaya tidak berleter panjang.
  3. `<Section>` 3: **Cabaran 1 — `<StepByStep>`**: Menyusun langkah pengiraan matematik: Bilang bintang kuning -> Bilang bintang merah -> Jumlahkan.
  4. `<Section>` 4: **Cabaran 2 — `<PromptVsMistake>`**: Memilih arahan dengan kekangan format ayat matematik (`7 + 5 = 12`) tanpa ayat tambahan.
  5. `<Section>` 5: **Cabaran 3 — `<DragDropPrompt>`**: Membina prompt kombinasi nombor: `[Situasi Nombor] + [Operasi Tambah] + [Format Jawapan]`.
  6. `<Section>` 6: **Cabaran 4 — `<PromptDoctor>`**: Membaiki prompt matematik kabur ("Kira bintang ni") kepada prompt berstruktur dengan angka tepat.
  7. `<Section>` 7: **Cabaran Unggul & Tamat Tahap**: Capstone pengiraan bintang diakhiri dengan `<LevelComplete levelSlug="8-1-matematik-tambah-bintang" stars={3} />`.

### 4. `9-1-moral-sahabat-prihatin` (Mercury: Pendidikan Moral - Tahun 1)
- **Pedagogical Theme**: KSSR Pendidikan Moral Tahun 1 — Unit: Kasih Sayang & Menghormati Rakan, Nilai Tolong-menolong, Bahasa Santun, Nasihat Berempati.
- **7-Stage Blueprint**:
  1. `<Section>` 1: **Misi Utarid**: Di Dataran Borealis Utarid, rakan sekelas berdepan masalah barang sekolah terjatuh.
  2. `<Section>` 2: **Konsep Utama — Panduan Nilai Murni untuk AI**: Mengajar AI memberi respon dengan nada empati, sopan dan membantu.
  3. `<Section>` 3: **Cabaran 1 — `<PromptDoctor>`**: Membaiki arahan acuh tak acuh kepada arahan prihatin yang mencadangkan bantuan ikhlas.
  4. `<Section>` 4: **Cabaran 2 — `<PromptVsMistake>`**: Memilih ucapan sokongan yang menenangkan hati rakan yang cemas.
  5. `<Section>` 5: **Cabaran 3 — `<DragDropPrompt>`**: Menyusun langkah nasihat berhemah: `[Sapaan Lembut] + [Tawaran Bantuan] + [Tindakan Bersama]`.
  6. `<Section>` 6: **Cabaran 4 — `<MagicWords>`**: Menjana kata-kata semangat dan adab tolong-menolong di dalam kelas.
  7. `<Section>` 7: **Cabaran Unggul & Tamat Tahap**: Capstone sahabat prihatin diakhiri dengan `<LevelComplete levelSlug="9-1-moral-sahabat-prihatin" stars={3} />`.

---

## Bilingual Parity & Vocabulary Guard

### `check-ms-vocabulary.js` Rules
The script tests every `src/content/kids/ms/*.mdx` file:
1. Rejects forbidden non-words: `bodil`, `bedtime`, `superhero`.
2. Rejects bare English word `level` (must use `tahap`).
3. Rejects residual markers: `bahasa inggeris`, `The cat sat`, `on the mat`.
4. Enforces proper Malay pedagogical terms:
   - Use `kata kerja`, `kata nama`, `kata adjektif` (never verbs/nouns in Malay text).
   - Use `ayat matematik` (never math equation).
   - Use `sopan-santun`, `tolong-menolong`, `sahabat prihatin`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Celestial background animations | Heavy Canvas / WebGL library inside level view | Pure CSS / SVG Keyframes (`PlanetBackground`) | WebGL/Three.js inside 2D interactive slide views causes memory leaks, battery drain, and hydration glitches on mobile devices. |
| Progress and Star State | Custom level completion sink | `<LevelComplete levelSlug="..." />` & `@/lib/kids/progress` | Existing `recordLevelCompletion()` manages stars, localStorage keys, and unlocks next levels reliably. |
| Section Navigation | Custom slide carousel | `<Section>` and `useSectionNavigation()` | The existing Section identity registry handles interactive locking, inert state, and document-order commit safely. |

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 2.1.9 |
| Quick run command | `npx vitest run src/__tests__/kids/planets.test.ts` |
| Full suite command | `npm test` |
| Verification Gate | `npm run check:closure && npm run check:vocab && npm run verify` |

### Wave 0 Test Plan
1. **Curriculum Alignment Test**:
   - `src/__tests__/kids/levels-alignment.test.ts`: Verify `getAllLevels()` returns 23 levels. Verify World 6 is Moon (BM), World 7 is Mars (English), World 8 is Venus (Matematik), World 9 is Mercury (Moral).
2. **7-Stage Pedagogical Audit Test**:
   - Test that loads `en` and `ms` MDX files for the 4 subject lessons and verifies that each renders at least 7 `<Section>` elements and includes `<LevelComplete>`.
3. **Planet Background Theme Test**:
   - Verify `PlanetBackground` renders the correct theme class/palette for each world/planet.

---

## Open Questions (RESOLVED)

1. **Question**: Should World 7 (Sains - `7-1-sains-benda-hidup`) be retained alongside English, or replaced by English?
   - **Resolution**: Under locked decision **D-02** and Phase 09 alignment, World 6=Moon (BM), World 7=Mars (English), World 8=Venus (Matematik), World 9=Mercury (Moral). Earth (Worlds 1-5) represents Foundational Prompting. Science is removed from the active world curriculum, reducing total levels from 24 to 23.
2. **Question**: How should the background adapt for non-level pages (e.g. `/`, `/map`, `/planets`)?
   - **Resolution**: When `levelSlug` is empty or belongs to Worlds 1-5, `PlanetBackground` defaults to Earth's cheerful blue sky gradient with pixel clouds, ensuring non-level pages look consistent. Inside level views for Worlds 6-9, it renders the celestial theme.
3. **Question**: Are any extra dependencies needed for starfield animations?
   - **Resolution**: No external libraries. Lightweight CSS animations (`@keyframes twinkle`) with SVG pixel stars satisfy all requirements cleanly and pass bundle closure checks.
