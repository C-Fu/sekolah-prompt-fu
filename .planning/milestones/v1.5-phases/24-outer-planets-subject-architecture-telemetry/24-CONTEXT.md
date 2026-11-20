# Phase 24: Outer Planets Subject Architecture & Telemetry - Context

## Executive Summary
This phase establishes the foundational subject mapping, type contracts, color palettes, and bilingual translation bundles for the four outer solar system planets in Sekolah Prompt-Fu:
- **Jupiter (Musytari):** Sains (Science & Scientific Exploration)
- **Saturn (Zuhal):** Sejarah (History & Timelines)
- **Uranus (Uranus):** Reka Bentuk & Teknologi (RBT & Design Constraints)
- **Neptune (Neptun):** Pendidikan Seni Visual (PSV & Visual Arts)

## Key Decisions Confirmed

### 1. Planet ID & Subject ID Naming Convention
- **Old IDs:** `jupiter-astronomy`, `saturn-astronomy`, `uranus-astronomy`, `neptune-astronomy`
- **New IDs:**
  - `jupiter-sains` (Subject: `sains`)
  - `saturn-sejarah` (Subject: `sejarah`)
  - `uranus-rbt` (Subject: `rbt`)
  - `neptune-psv` (Subject: `psv`)
- **Compatibility:** Backward compatibility type aliases or mappings will be retained in `src/lib/kids/planets.ts` so older references resolve gracefully if queried.
- **SubjectId Type:** Expanded to `"prompting" | "bm" | "english" | "matematik" | "moral" | "sains" | "sejarah" | "rbt" | "psv" | "astronomy"`.

### 2. Thematic Color Palettes & Visual Identifiers
- **Jupiter (Sains):** Amber / Storm Bronze
  - `themeColor`: `#D97706`
  - `accentColor`: `#F59E0B`
- **Saturn (Sejarah):** Golden Ochre / Antique Ring Gold
  - `themeColor`: `#EAB308`
  - `accentColor`: `#FDE047`
- **Uranus (RBT):** Cyan / Blueprint Teal
  - `themeColor`: `#06B6D4`
  - `accentColor`: `#22D3EE`
- **Neptune (PSV):** Royal Azure / Deep Canvas Indigo
  - `themeColor`: `#2563EB`
  - `accentColor`: `#3B82F6`

### 3. Subject Titles & i18n Strategy
Bilingual titles in `messages/ms.json` and `messages/en.json`, as well as `PLANET_WORLDS`:
- **Jupiter:**
  - BM: Title = `Musytari: Sains & Penerokaan Saintifik`, Tagline = `Gergasi bergelora membuka rahsia pemerhatian saintifik, benda hidup, dan hipotesis alam.`
  - EN: Title = `Jupiter: Science & Empirical Inquiry`, Tagline = `Swirling giant unlocks the secrets of scientific observation, living wonders, and nature hypotheses.`
- **Saturn:**
  - BM: Title = `Zuhal: Sejarah & Garis Masa`, Tagline = `Gelung masa purba membimbing kronologi peristiwa, sejarah diri, dan riwayat keluarga.`
  - EN: Title = `Saturn: History & Chronology`, Tagline = `Ancient cosmic rings guiding event timelines, personal history, and family chronicles.`
- **Uranus:**
  - BM: Title = `Uranus: Reka Bentuk & Teknologi`, Tagline = `Paksi condong menguji kreativiti bentuk asas, blok binaan 2D/3D, dan batas rekaan.`
  - EN: Title = `Uranus: Design & Technology (RBT)`, Tagline = `Tilted axis challenging creative basic shapes, 2D/3D blocks, and structural constraints.`
- **Neptune:**
  - BM: Title = `Neptun: Pendidikan Seni Visual`, Tagline = `Jurang biru kosmik menyemarakkan harmoni warna asas, corak garisan, dan imaginasi seni.`
  - EN: Title = `Neptune: Visual Arts (PSV)`, Tagline = `Deep azure abyss inspiring primary color harmony, line patterns, and artistic imagination.`

## Impacted Files
- `src/lib/kids/planets.ts`
- `src/components/kids/planets/planet-cartography-scene.ts`
- `src/components/kids/planets/solar-system-scene.ts`
- `messages/en.json`
- `messages/ms.json`
- `src/__tests__/kids/planetary-hud.test.tsx`
- `src/__tests__/kids/planets-i18n.test.ts`
- `src/__tests__/kids/planets.test.ts`
- `src/__tests__/kids/solar-system-scene.test.ts`

## Downstream Phases
- **Phase 25:** Will populate the 7 geological / atmospheric regions (`features`) for each of these 4 updated planet worlds.
- **Phase 26:** Author Jupiter (Sains) and Saturn (Sejarah) Year 1 interactive lessons.
- **Phase 27:** Author Uranus (RBT) and Neptune (PSV) Year 1 interactive lessons.
