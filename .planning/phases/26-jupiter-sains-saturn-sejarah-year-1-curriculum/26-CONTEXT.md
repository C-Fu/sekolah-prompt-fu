# Phase 26: Jupiter (Sains) & Saturn (Sejarah) Year 1 Curriculum - Context

## Executive Summary
This phase designs and authors two complete Year 1 (Tahun 1) interactive pilot lessons in bilingual MDX (Bahasa Melayu & English) for:
1. **Jupiter (Musytari) - Sains:** Living vs Non-Living Things (`10-1-sains-benda-hidup.mdx`)
2. **Saturn (Zuhal) - Sejarah:** Personal & Family History Timelines (`11-1-sejarah-garis-masa.mdx`)

Both lessons follow the canonical 7-stage interactive pedagogical structure with rich prompt engineering widgets and zero English residuals in Malay content.

## Confirmed Curriculum Decisions

### 1. Jupiter (Sains Tahun 1) Focus
- **Topic:** *Benda Hidup & Benda Bukan Hidup* (Living and Non-Living Things)
- **Pedagogical Goal:** Teaching children how to guide AI to observe, compare, and classify biological characteristics (e.g. bernafas, memerlukan air/makanan, membiak vs tidak bernafas, tidak membesar).
- **Slug:** `10-1-sains-benda-hidup`
- **File Paths:**
  - `src/content/kids/ms/10-1-sains-benda-hidup.mdx`
  - `src/content/kids/en/10-1-sains-benda-hidup.mdx`

### 2. Saturn (Sejarah Tahun 1) Focus
- **Topic:** *Garis Masa Diri & Riwayat Keluarga* (Personal Timeline, Chronology & Respectful Family Interview)
- **Pedagogical Goal:** Teaching children chronological sequencing keywords (dahulu, sekarang, sebelum, selepas, tahun lepas) and formulating courteous, precise historical inquiry prompts.
- **Slug:** `11-1-sejarah-garis-masa`
- **File Paths:**
  - `src/content/kids/ms/11-1-sejarah-garis-masa.mdx`
  - `src/content/kids/en/11-1-sejarah-garis-masa.mdx`

### 3. Canonical 7-Stage Interactive Widget Flow
Each lesson contains at least 7 `<Section>` elements in sequential order:
1. **Section 1: Pengenalan Konsep (Concept Discovery)** — Story hook with Peromfu exploring Great Red Spot (Jupiter) / Hexagon (Saturn).
2. **Section 2: WordPredictor** — Predictive fill-in-the-blank for core subject terminology.
3. **Section 3: PromptVsMistake** — Side-by-side contrast between a vague prompt and a precise observation/chronological prompt.
4. **Section 4: PromptDoctor** — Diagnosing and fixing an incomplete prompt with missing attributes or timeframes.
5. **Section 5: DragDropPrompt** — Reordering prompt components into the canonical structure: `[Peranan/Subjek] + [Tindakan/Kriteria] + [Format/Had]`.
6. **Section 6: MagicWords** — Unlocking powerful prompt modifiers (e.g., 'Kategorikan mengikut ciri', 'Susun mengikut kronologi masa').
7. **Section 7: LevelComplete** — XP celebration, star allocation, and mastery badge award.

### 4. Language & Static Compliance
- All Malay content must pass `npm run check:vocab` with zero unlocalized English residuals.
- All lessons are 100% static compatible with Next.js export.

## Downstream Impact
- Phase 27: Uranus (RBT) & Neptune (PSV) Year 1 Curriculum.
- Phase 28: Atmospheric Theming, Navigation & Routing Integration (registering levels 10.1 & 11.1 into level manifest).
