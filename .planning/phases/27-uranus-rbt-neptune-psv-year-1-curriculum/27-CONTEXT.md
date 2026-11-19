# Phase 27: Uranus (RBT) & Neptune (PSV) Year 1 Curriculum - Context

## Executive Summary
This phase designs and authors two complete Year 1 (Tahun 1) interactive pilot lessons in bilingual MDX (Bahasa Melayu & English) for:
1. **Uranus (Uranus) - Reka Bentuk & Teknologi (RBT):** Basic 2D & 3D Shapes and Structural Design Constraints (`12-1-rbt-bentuk-asas.mdx`)
2. **Neptune (Neptun) - Pendidikan Seni Visual (PSV):** Primary Colors, Line Patterns & Artistic Style Prompts (`13-1-psv-warna-imaginasi.mdx`)

Both lessons follow the canonical 7-stage interactive pedagogical structure with rich prompt engineering widgets and zero English residuals in Malay content.

## Confirmed Curriculum Decisions

### 1. Uranus (RBT Tahun 1) Focus
- **Topic:** *Bentuk Asas 2D & 3D dan Blok Binaan* (Basic 2D/3D Shapes and Building Blocks)
- **Pedagogical Goal:** Teaching children how to guide AI to construct objects using geometric primitives (segi empat, segi tiga, bulat, kubus, kuboid, silinder, kon, piramid) with spatial and dimensional constraints (e.g., tapak kukuh, bahagian atas seimbang).
- **Slug:** `12-1-rbt-bentuk-asas`
- **File Paths:**
  - `src/content/kids/ms/12-1-rbt-bentuk-asas.mdx`
  - `src/content/kids/en/12-1-rbt-bentuk-asas.mdx`

### 2. Neptune (PSV Tahun 1) Focus
- **Topic:** *Warna Asas, Corak Garisan & Imaginasi Seni* (Primary Colors, Line Patterns, and Artistic Style Prompts)
- **Pedagogical Goal:** Teaching children how to craft expressive visual art prompts using primary color harmonies (merah, biru, kuning) and expressive lines (garisan lurus, beralun, zig-zag, putus-putus) to control mood and visual style in AI image generation.
- **Slug:** `13-1-psv-warna-imaginasi`
- **File Paths:**
  - `src/content/kids/ms/13-1-psv-warna-imaginasi.mdx`
  - `src/content/kids/en/13-1-psv-warna-imaginasi.mdx`

### 3. Canonical 7-Stage Interactive Widget Flow
Each lesson contains at least 7 `<Section>` elements in sequential order:
1. **Section 1: Pengenalan Konsep (Concept Discovery)** — Story hook with Peromfu exploring Miranda Rift (Uranus) / Great Dark Spot (Neptune).
2. **Section 2: WordPredictor** — Predictive fill-in-the-blank for core subject terminology (shapes, dimensions, primary colors, line types).
3. **Section 3: PromptVsMistake** — Side-by-side contrast between a vague prompt and a structured design/art prompt.
4. **Section 4: PromptDoctor** — Diagnosing and fixing an incomplete prompt with missing geometric forms or color combinations.
5. **Section 5: DragDropPrompt** — Reordering prompt components into canonical structure: `[Subjek/Gaya] + [Bentuk/Warna/Elemen] + [Format/Perincian]`.
6. **Section 6: MagicWords** — Unlocking powerful prompt modifiers (e.g., 'Gunakan blok 3D bersaiz', 'Warnakan dengan warna asas terang').
7. **Section 7: LevelComplete** — XP celebration, star allocation, and mastery badge award.

### 4. Quality & Compliance
- Malay vocabulary check: `npm run check:vocab` must pass with 0 errors across all files.
- Full bilingual symmetry between `ms` and `en` versions.
- All lessons compile statically for static GitHub Pages export.

## Downstream Impact
- Phase 28: Atmospheric Theming, Navigation & Routing Integration (registering levels 12.1 & 13.1, updating level total from 23 to 27).
