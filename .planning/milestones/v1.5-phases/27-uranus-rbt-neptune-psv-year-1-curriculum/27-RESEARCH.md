# Phase 27: Uranus (RBT) & Neptune (PSV) Year 1 Curriculum - Research
**Researched:** 2026-11-20
**Domain:** KSSR Semakan Year 1 (Tahun 1) RBT & PSV Curriculum, Bilingual MDX Lesson Authoring, Interactive AI Prompt Widgets
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Uranus (RBT Tahun 1) Focus:**
  - Topic: *Bentuk Asas 2D & 3D dan Blok Binaan* (Basic 2D/3D Shapes and Building Blocks)
  - Pedagogical Goal: Teaching children how to guide AI to construct objects using geometric primitives (`segi empat sama`, `segi empat tepat`, `segi tiga`, `bulatan`; `kubus`, `kuboid`, `silinder`, `kon`, `piramid`, `sfera`) with spatial and dimensional constraints (e.g., tapak kukuh, bahagian atas seimbang).
  - Slug: `12-1-rbt-bentuk-asas`
  - Target files:
    - `src/content/kids/ms/12-1-rbt-bentuk-asas.mdx`
    - `src/content/kids/en/12-1-rbt-bentuk-asas.mdx`
- **Neptune (PSV Tahun 1) Focus:**
  - Topic: *Warna Asas, Corak Garisan & Imaginasi Seni* (Primary Colors, Line Patterns, and Artistic Style Prompts)
  - Pedagogical Goal: Teaching children how to craft expressive visual art prompts using primary color harmonies (`merah`, `biru`, `kuning`) and expressive lines (`garisan lurus`, `beralun`, `zig-zag`/`bergerigi`, `putus-putus`, `melengkung`) to control mood and visual style in AI image generation.
  - Slug: `13-1-psv-warna-imaginasi`
  - Target files:
    - `src/content/kids/ms/13-1-psv-warna-imaginasi.mdx`
    - `src/content/kids/en/13-1-psv-warna-imaginasi.mdx`
- **Canonical 7-Stage Interactive Widget Flow:**
  - Each lesson contains at least 7 `<Section>` elements in sequential order:
    1. **Section 1: Pengenalan Konsep (Concept Discovery)** — Story hook with Peromfu exploring Miranda Rift (Uranus) / Great Dark Spot (Neptune).
    2. **Section 2: WordPredictor** — Predictive fill-in-the-blank for core subject terminology (shapes, dimensions, primary colors, line types).
    3. **Section 3: PromptVsMistake** — Side-by-side contrast between a vague prompt and a structured design/art prompt.
    4. **Section 4: PromptDoctor** — Diagnosing and fixing an incomplete prompt with missing geometric forms or color combinations.
    5. **Section 5: DragDropPrompt** — Reordering prompt components into canonical structure: `[Subjek/Gaya] + [Bentuk/Warna/Elemen] + [Format/Perincian]`.
    6. **Section 6: MagicWords** — Unlocking powerful prompt modifiers (e.g., 'Gunakan blok 3D bersaiz', 'Warnakan dengan warna asas terang').
    7. **Section 7: LevelComplete** — XP celebration, star allocation, and mastery badge award targeting `levelSlug="12-1-rbt-bentuk-asas"` and `levelSlug="13-1-psv-warna-imaginasi"`.
- **Quality & Compliance:**
  - Malay vocabulary check: `npm run check:vocab` must pass with 0 errors across all files.
  - Full bilingual symmetry between `ms` and `en` versions.
  - All lessons compile statically for static GitHub Pages export.

### the agent's Discretion
- Choice of specific Peromfu story situations and dialogues across the celestial locations (`Miranda Rift Canyon` on Uranus and `Great Dark Spot` on Neptune).
- Precise framing and options for the interactive challenges (WordPredictor, PromptVsMistake, PromptDoctor, DragDropPrompt, MagicWords).
- Expansion of the automated test harness in `src/__tests__/kids/subject-lessons-stages.test.ts` to include `12-1-rbt-bentuk-asas` and `13-1-psv-warna-imaginasi`.

### Deferred Ideas (OUT OF SCOPE)
- Registration of levels in `src/lib/kids/levels.ts`, `level-content.ts`, and `section-titles.ts` (owned by Phase 28).
- Ambient background shaders for Uranus and Neptune in `PlanetBackground` and launcher button wiring in HUD (owned by Phase 28).
- Years 2–6 curriculum lessons for Uranus and Neptune (future milestones).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LESSON-03 | User can play a complete Tahun 1 interactive prompt lesson for Uranus (RBT: Bentuk Asas, Blok Binaan & Reka Bentuk / Geometric Prompt Engineering) across 7 structured `<Section>` stages with rich interactive widgets. | Detailed DSKP KSSR RBT Year 1 geometry vocabulary (`segi empat sama`, `segi empat tepat`, `segi tiga`, `bulatan`, `kubus`, `kuboid`, `kon`, `silinder`, `piramid`, `sfera`), structural stability rules, and exact widget specifications documented in this research. |
| LESSON-04 | User can play a complete Tahun 1 interactive prompt lesson for Neptune (PSV: Warna Asas, Garisan & Imaginasi Visual / Artistic Visual Description Prompts) across 7 structured `<Section>` stages with rich interactive widgets. | Detailed DSKP KSSR PSV Year 1 art vocabulary (`warna asas`: `merah`, `biru`, `kuning`; `jenis garisan`: `lurus`, `beralun`, `zig-zag`/`bergerigi`, `putus-putus`, `melengkung`), color harmony rules, and exact widget specifications documented in this research. |
| LESSON-05 | All 4 lessons are fully authored and localized in both Bahasa Melayu (`src/content/kids/ms/`) and English (`src/content/kids/en/`) with zero silent fallbacks and strict adherence to Malay vocabulary guards. | Bilingual structural alignment, vocabulary guard rules in `scripts/check-ms-vocabulary.js`, and banned word patterns catalogued and validated. |
</phase_requirements>

## Summary

Phase 27 authors two complete Year 1 (Tahun 1) pilot interactive prompt engineering lessons:
1. **Uranus (RBT):** `12-1-rbt-bentuk-asas.mdx` (Bilingual: `ms` & `en`), teaching how to construct stable physical forms with AI using geometric primitives (2D shapes and 3D building blocks) and structural constraints set against the dramatic backdrop of Miranda Rift Canyon (`Lembah Jurang Titania/Miranda`).
2. **Neptune (PSV):** `13-1-psv-warna-imaginasi.mdx` (Bilingual: `ms` & `en`), teaching children how to craft expressive visual art prompts with AI image generators using primary color palettes and expressive line types set against the azure tempest of Neptune's Great Dark Spot (`Bintik Gelap Gergasi`).

Each lesson implements the canonical 7-stage interactive architecture established in Phase 26 (demonstrated in `10-1-sains-benda-hidup.mdx` and `11-1-sejarah-garis-masa.mdx`). The test suite `src/__tests__/kids/subject-lessons-stages.test.ts` validates that every lesson contains at least 7 `<Section>` blocks and culminates in `<LevelComplete levelSlug="..." />`.

**Primary recommendation:** Author both pairs of MDX lessons (`ms` and `en`) with authentic KSSR Semakan terminology, wire all 5 interactive widget types (`WordPredictor`, `PromptVsMistake`, `PromptDoctor`, `DragDropPrompt`, `MagicWords`) plus `LevelComplete`, register `12-1-rbt-bentuk-asas` and `13-1-psv-warna-imaginasi` into `src/__tests__/kids/subject-lessons-stages.test.ts`, and run `npm run check:vocab` and `npm test` to verify.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| MDX Lesson Content Authoring | Static Content (`src/content/kids/{locale}/`) | Next.js MDX Compiler | Lesson text and structured learning stages are static MDX files compiled at build time into React components. |
| Interactive Widgets (`WordPredictor`, etc.) | Client Components (`src/components/kids/elements/`) | Local Storage Progress | Interactive prompt puzzles manage localized UI state on the client and persist completions to localStorage via `saveComponentState`. |
| Stage & Section Flow Control | Level Context Provider (`useSectionIdentity`) | Section Components | Tracks section completion and unlocks sequential progress as children finish widget interactions. |
| Test Harness Coverage | Test Runner (Vitest) | Node.js File System | Validates presence, minimum 7 `<Section>` elements, and levelSlug in `<LevelComplete>`. |
| Malay Vocabulary Enforcement | Pre-commit / Verify Script (`check-ms-vocabulary.js`) | CI / Build Guard | Scans all `ms` MDX files to prevent banned English residuals, non-words, or unlocalized content words. |

## Standard Stack

### Core
| Library / Component | Version | Purpose | Why Standard |
|---------------------|---------|---------|--------------|
| MDX | `@next/mdx` (Next 15) | Content authoring for interactive lessons | Project standard for all kid lessons with embedded React components. [VERIFIED: package.json:34-40] |
| `WordPredictor` | In-repo | Stage 2 predictive terminology challenge | Used across 6-1, 7-1, 8-1, 9-1, 10-1, 11-1 for key vocabulary acquisition. [VERIFIED: src/components/kids/elements/word-predictor.tsx:1-40] |
| `PromptVsMistake` | In-repo | Stage 3 good vs bad prompt evaluation | Side-by-side prompt analysis for AI instructions. [VERIFIED: src/components/kids/elements/prompt-vs-mistake.tsx:1-40] |
| `PromptDoctor` | In-repo | Stage 4 diagnostic prompt healing | Step-by-step resolution of prompt bugs (role, subject, constraints). [VERIFIED: src/components/kids/elements/prompt-doctor.tsx:1-40] |
| `DragDropPrompt` | In-repo | Stage 5 prompt formula arrangement | Reorders prompt pieces into `[Peranan/Subjek] + [Arahan/Elemen] + [Format/Perincian]`. [VERIFIED: src/components/kids/elements/drag-drop-prompt.tsx:1-40] |
| `MagicWords` | In-repo | Stage 6 Mad-Libs prompt modifier generator | Fills prompt template with domain-specific modifiers. [VERIFIED: src/components/kids/elements/magic-words.tsx:1-40] |
| `LevelComplete` | In-repo | Stage 7 completion & badge award | Triggers XP celebration, stars, and navigation back to map or hub. [VERIFIED: src/components/kids/elements/level-complete.tsx:1-45] |
| `Panel` | In-repo | Story character narrative dialogue | Features Peromfu with moods (`excited`, `thinking`, `celebrating`). [VERIFIED: src/content/kids/ms/10-1-sains-benda-hidup.mdx:1-12] |

### Supporting
| Tool / Script | Location | Purpose | When to Use |
|---------------|----------|---------|-------------|
| `check:vocab` | `scripts/check-ms-vocabulary.js` | Enforces zero English residuals in `ms/` | Always run after authoring or modifying Malay MDX files. [VERIFIED: scripts/check-ms-vocabulary.js:1-128] |
| `vitest` | `src/__tests__/kids/subject-lessons-stages.test.ts` | Asserts 7 stages and `<LevelComplete>` | Run after adding new slugs to `SUBJECT_SLUGS`. [VERIFIED: src/__tests__/kids/subject-lessons-stages.test.ts:5-13] |

## Curriculum Specifications & Terminology (DSKP KSSR Semakan Tahun 1)

### 1. Uranus: Reka Bentuk & Teknologi (RBT) Tahun 1
In the KSSR Semakan curriculum for Tahun 1, early design principles focus on shapes, building blocks, and basic structural stability (*Bentuk Asas, Bongkah Bentuk Asas / Blok Binaan, dan Kestabilan*):
- **Bentuk Asas 2D (Basic 2D Shapes):**
  - `segi empat sama` (square) - 4 sisi sama panjang, 4 bucu.
  - `segi empat tepat` (rectangle) - 2 sisi bertentangan sama panjang, 4 bucu.
  - `segi tiga` (triangle) - 3 sisi, 3 bucu.
  - `bulatan` (circle) - 1 sisi melengkung, tiada bucu.
- **Bongkah Bentuk Asas 3D (3D Geometric Blocks):**
  - `kubus` (cube) - 6 permukaan rata segi empat sama.
  - `kuboid` (cuboid) - 6 permukaan rata segi empat tepat/sama.
  - `piramid` (pyramid) - tapak segi empat sama / segi tiga dan sisi segi tiga menumpu ke puncak.
  - `silinder` (cylinder) - 2 permukaan rata bulat, 1 permukaan melengkung.
  - `kon` (cone) - 1 permukaan rata bulat, 1 puncak runcing.
  - `sfera` (sphere) - 1 permukaan melengkung bulat sekata.
- **Konsep Kestabilan & Reka Bentuk (Stability & Design Constraints):**
  - Tapak kukuh dan luas di bahagian bawah (*wide base*).
  - Puncak atau bahagian atas lebih kecil dan seimbang (*balanced top*).
  - Menggabungkan bongkah 3D untuk membina objek (contoh: rumah daripada gabungan kubus dan piramid; roket daripada silinder dan kon).
- **Prompt Engineering Application for Kids:**
  - AI needs explicit geometric primitives: Instead of *"Lukiskan rumah angkasa"*, prompt *"Bina model rumah angkasa menggunakan tapak kubus biru yang kukuh dan bumbung piramid merah di bahagian atas"*.

### 2. Neptune: Pendidikan Seni Visual (PSV) Tahun 1
In KSSR Semakan PSV Tahun 1, foundational visual art concepts revolve around Bahasa Seni Visual (Visual Art Language), specifically **Warna Asas** and **Garisan**:
- **Warna Asas / Warna Primer (Primary Colors):**
  - `merah` (red) - warna asas panas, melambangkan keberanian dan tenaga.
  - `biru` (blue) - warna asas sejuk, melambangkan ketenangan dan kedalaman lautan/angkasa.
  - `kuning` (yellow) - warna asas cerah, melambangkan keceriaan dan cahaya.
  - *Nota DSKP:* Warna asas ialah warna utama yang tidak boleh dihasilkan melalui campuran warna lain.
- **Jenis Garisan (Line Types):**
  - `garisan lurus` (straight line) - memberi kesan teguh, teratur dan stabil.
  - `garisan beralun` (wavy line) - memberi kesan pergerakan lembut seperti ombak laut atau angin.
  - `garisan bergerigi / zig-zag` (zigzag / jagged line) - memberi kesan tajam, bahaya, petir atau getaran rancak.
  - `garisan putus-putus` (dotted / dashed line) - memberi kesan lintasan, bayang-bayang atau sempadan.
  - `garisan melengkung` (curved line) - memberi kesan dinamik dan bulat.
- **Prompt Engineering Application for Kids:**
  - Guiding visual AI generators: Instead of *"Lukiskan gambar laut"*, prompt *"Lukis pemandangan lautan bergelora menggunakan warna asas biru pekat dan garisan beralun lembut, dengan sebuah bot kuning bergarisan lurus di atas ombak"*.

## Widget Component Usage & Prop Contracts

Every widget contract has been inspected in `src/components/kids/elements/`:

### 1. `WordPredictor` (`word-predictor.tsx:1-40`)
```tsx
<WordPredictor
  title="Bantu Peromfu Memilih Bentuk Asas!"
  instruction="Lengkapkan arahan reka bentuk ini dengan bongkah 3D yang paling stabil:"
  sentence="Bantu arkitek cilik: Bina tapak menara angkasa yang kukuh menggunakan bongkah ____ supaya tidak mudah tumbang."
  options={["kuboid yang lebar", "bola sfera bulat", "kon terbalik", "roda kecil"]}
  correctAnswer="kuboid yang lebar"
  explanation="Bongkah kuboid mempunyai permukaan rata yang luas, menjadikannya tapak binaan yang sangat stabil dan kukuh!"
  aiThinking="Bongkah 'kuboid yang lebar' memberikan kestabilan asas mengikut prinsip reka bentuk struktur!"
  successMessage="Tepat sekali! AI kini memahami asas kestabilan struktur dalam reka bentuk!"
/>
```

### 2. `PromptVsMistake` (`prompt-vs-mistake.tsx:1-40`)
```tsx
<PromptVsMistake
  question="Arahan manakah yang membimbing AI mereka bentuk robot angkasa dengan perincian geometri yang jelas?"
  good="Reka bentuk robot bantuan angkasa. Gunakan kubus besar sebagai badan, dua silinder panjang sebagai tangan, dan kepala sfera dengan mata biru bersinar."
  bad="Buat robot comel sekarang juga."
  explanation="Arahan pertama sangat jelas kerana menyenaraikan bentuk bongkah 3D yang tepat (kubus, silinder, sfera) untuk setiap bahagian robot!"
  peromfuMessage="Sentiasa namakan bentuk bongkah 3D yang ingin digunakan supaya AI membina objek yang tepat dan seimbang!"
/>
```

### 3. `PromptDoctor` (`prompt-doctor.tsx:1-40`)
```tsx
<PromptDoctor
  title="Rawat Prompt Reka Bentuk Bangunan"
  brokenPrompt="Bina istana angkasa"
  problems={[
    { issue: "Tiada Peranan Pereka", symptom: "Siapakah AI dan apakah tugas reka bentuknya?", fix: "Bertindak sebagai jurubina angkasa Tahun 1 yang kreatif." },
    { issue: "Tiada Bentuk Bongkah 3D", symptom: "Apakah bentuk struktur bangunan tersebut?", fix: "Bertindak sebagai jurubina angkasa Tahun 1. Bina istana menggunakan tapak kuboid dan menara silinder." },
    { issue: "Tiada Kestabilan & Perincian", symptom: "Bagaimanakah kedudukan dan kestabilan bahagian atas bangunan?", fix: "Bertindak sebagai jurubina angkasa Tahun 1 yang kreatif. Bina istana angkasa menggunakan tapak kuboid yang kukuh, empat menara silinder di setiap sudut, dan bumbung kon di bahagian atas." }
  ]}
  healedPrompt="Bertindak sebagai jurubina angkasa Tahun 1 yang kreatif. Bina istana angkasa menggunakan tapak kuboid yang kukuh, empat menara silinder di setiap sudut, dan bumbung kon di bahagian atas."
  successMessage="Syabas! Arahan reka bentuk telah dirawat dengan peranan pereka, bongkah 3D, dan struktur yang stabil!"
/>
```

### 4. `DragDropPrompt` (`drag-drop-prompt.tsx:1-40`)
```tsx
<DragDropPrompt
  title="Susun Formula Arahan Reka Bentuk"
  instruction="Susun blok perkataan mengikut urutan terbaik untuk membimbing AI:"
  pieces={[
    "Sebagai jurutera cilik yang bijak,",
    "cantumkan kubus kayu sebagai dinding dan piramid sebagai bumbung rumah,",
    "kemudian pastikan struktur tapak berdiri dengan kukuh serta seimbang."
  ]}
  correctOrder={[0, 1, 2]}
  successMessage="Cemerlang! Formula prompt reka bentuk anda sangat teratur dan mudah difahami oleh AI!"
/>
```

### 5. `MagicWords` (`magic-words.tsx:1-40`)
```tsx
<MagicWords
  title="Lengkapkan Kata Ajaib Reka Bentuk"
  sentence="Sila bina kenderaan angkasa dengan memasang ___ sebagai badan utama, ___ sebagai roda pusingan, dan ___ di bahagian bumbung."
  blanks={[
    { hint: "📦 bongkah badan utama", answers: ["kuboid segi empat bujur", "kubus logam kukuh", "kabin silinder panjang", "modul kuboid berkembar"] },
    { hint: "⚙️ bentuk roda bergerak", answers: ["empat roda silinder rata", "tayar sfera bergetah", "gelung silinder lebar", "roda bulat berjejari"] },
    { hint: "📡 bahagian atas kenderaan", answers: ["antena kon pemancar", "kubah sfera lut sinar", "piramid sensor navigasi", "cakera bulat berputar"] }
  ]}
  successMessage="Hebat sekali! Gabungan kata ajaib reka bentuk anda menghasilkan kenderaan angkasa yang mantap dan seimbang!"
/>
```

### 6. `LevelComplete` (`level-complete.tsx:1-45`)
```tsx
<LevelComplete
  levelSlug="12-1-rbt-bentuk-asas"
  stars={3}
  message="Tahniah! Anda menguasai bentuk asas 2D/3D dan reka bentuk struktur di Planet Uranus!"
/>
```

## Vocabulary Guard Rules & Common Pitfalls

The Malay vocabulary guard `scripts/check-ms-vocabulary.js` strictly rejects:
1. `\bbodil\b` (invented non-word; use `lawak` / `kelakar`)
2. `\bbedtime\b` (use `sebelum tidur` / `waktu tidur`)
3. `\bsuperhero\b` (use `adiwira`)
4. `\blevel\b` (bare English content word; use `tahap` / `peringkat` in content. *Note: `levelSlug="..."` JSX prop is allowed because the regex matches `\blevel\b` and does not flag `levelSlug`*)
5. `bahasa inggeris` (residual marker)
6. `The cat sat` (residual marker)
7. `on the mat` (residual marker)

**Additional Pitfalls to Avoid:**
- **Do not introduce English words** in `src/content/kids/ms/` lessons: words like "designer", "primary colors", "lines", "shapes", "brush", "canvas", "render" must be properly translated into Malay (`pereka`, `warna asas`, `garisan`, `bentuk asas`, `berus`, `kanvas`, `cipta/hasilkan`).
- **Do not miss `levelSlug` match in test**: `src/__tests__/kids/subject-lessons-stages.test.ts` checks that `SUBJECT_SLUGS` contains each slug and that the last `<Section>` has `<LevelComplete levelSlug="${slug}">`. When adding `12-1-rbt-bentuk-asas` and `13-1-psv-warna-imaginasi` to `SUBJECT_SLUGS`, the slugs must match the filename and the prop exactly.
- **Section count**: Must have at least 7 `<Section>` elements in each file. Both lessons in Phase 26 used exactly 7 sections (Introduction 1, Introduction 2, Challenge 1, Challenge 2, Challenge 3, Challenge 4, Challenge 5, Mastery/Celebration). Having 8 sections (2 intro sections + 5 challenges + 1 celebration) satisfies `>= 7` effortlessly.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js, Vitest, scripts | ✓ | v24.15.0 | — |
| npm | Package manager | ✓ | 11.5.1 | — |
| Vitest | Test execution | ✓ | 2.1.9 | — |
| check:vocab script | Malay guard | ✓ | node scripts/check-ms-vocabulary.js | — |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 2.1.9 |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test src/__tests__/kids/subject-lessons-stages.test.ts` |
| Full suite command | `npm test` |
| Vocabulary check command | `npm run check:vocab` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LESSON-03 | Uranus RBT Year 1 lesson has 7 stages and `<LevelComplete levelSlug="12-1-rbt-bentuk-asas">` in EN and MS | integration | `npm test src/__tests__/kids/subject-lessons-stages.test.ts` | ⚠️ Needs slug added to `SUBJECT_SLUGS` |
| LESSON-04 | Neptune PSV Year 1 lesson has 7 stages and `<LevelComplete levelSlug="13-1-psv-warna-imaginasi">` in EN and MS | integration | `npm test src/__tests__/kids/subject-lessons-stages.test.ts` | ⚠️ Needs slug added to `SUBJECT_SLUGS` |
| LESSON-05 | Zero English residuals in `ms/12-1-rbt-bentuk-asas.mdx` and `ms/13-1-psv-warna-imaginasi.mdx` | lint/guard | `npm run check:vocab` | ✅ Runs on all `src/content/kids/ms/*.mdx` |

### Wave 0 Gaps
- Update `src/__tests__/kids/subject-lessons-stages.test.ts` to include `"12-1-rbt-bentuk-asas"` and `"13-1-psv-warna-imaginasi"` in `SUBJECT_SLUGS`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | DSKP KSSR Semakan Year 1 RBT emphasizes 2D shapes (`segi empat sama/tepat`, `segi tiga`, `bulatan`) and 3D blocks (`kubus`, `kuboid`, `piramid`, `silinder`, `kon`, `sfera`) and structural stability | Curriculum Specifications | Very low — standard KSSR Semakan curriculum for Malaysian primary schools. |
| A2 | DSKP KSSR Semakan Year 1 PSV emphasizes Primary Colors (`merah`, `biru`, `kuning`) and line types (`garisan lurus`, `beralun`, `zig-zag`, `putus-putus`, `melengkung`) | Curriculum Specifications | Very low — authentic primary visual arts standard in Malaysia. |

## Open Questions
None. The pedagogical structure, component APIs, test runner, vocabulary checker, and celestial lore are completely defined and proven by Phase 26.
