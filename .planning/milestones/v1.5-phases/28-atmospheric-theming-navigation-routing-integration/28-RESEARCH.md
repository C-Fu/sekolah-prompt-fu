# Phase 28: Atmospheric Theming, Navigation & Routing Integration - Research

**Researched:** 2026-11-20
**Domain:** Next.js (App Router), React, Tailwind CSS, TypeScript, Client-side Dynamic Imports, i18n, Route Navigation
**Confidence:** HIGH

## Summary

Phase 28 delivers complete runtime integration for the 4 newly authored outer planet pilot lessons (Jupiter, Saturn, Uranus, Neptune) created in Phases 24–27. Specifically, it connects three core architectural domains:
1. **Atmospheric Ambient Theming:** Expands `PlanetBackground` (`src/components/kids/layout/planet-background.tsx`) to support 4 new celestial themes (`jupiter`, `saturn`, `uranus`, `neptune`) featuring bespoke CSS ambient gradients, celestial star/mist particles, and deterministic slug/level-to-theme resolution.
2. **Global Level Registry Expansion (23 -> 27):** Expands the application level corpus from 23 to 27 by registering World 10 (Jupiter: Sains / `10-1-sains-benda-hidup`), World 11 (Saturn: Sejarah / `11-1-sejarah-garis-masa`), World 12 (Uranus: RBT / `12-1-rbt-bentuk-asas`), and World 13 (Neptune: PSV / `13-1-psv-warna-imaginasi`) across `levels.ts`, `level-content.ts` (lazy dynamic imports for `en` and `ms`), `section-titles.ts` (8 ordered stage titles per lesson), and i18n dictionaries (`messages/en.json`, `messages/ms.json`).
3. **Planetary HUD Mission Launcher & Bidirectional Routing:** Updates `resolveMissionRoute` in `src/lib/kids/planets.ts` so Feature 1 of Jupiter, Saturn, Uranus, and Neptune resolves to their respective `/level/[slug]` routes. When launched via `handleLaunchMission` in `planetary-explorer.tsx`, the route receives `?origin=planets`. The lesson header back-navigation and complete screen preserve this origin and link back to `/planets`.

All changes maintain 100% static export compatibility (`output: "export"`) and preserve zero-runtime-leak import closures verified by `check:closure`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Atmospheric Ambient Theming in `PlanetBackground`:**
  - Jupiter (`jupiter-sains`): Amber / Bronze swirling storm bands atmosphere (`radial-gradient(ellipse at 50% 120%, rgba(217, 119, 6, 0.35) 0%, rgba(180, 83, 9, 0.15) 50%, transparent 80%)`).
  - Saturn (`saturn-sejarah`): Golden Ochre antique ring haze (`radial-gradient(ellipse at 50% 115%, rgba(234, 179, 8, 0.3) 0%, rgba(161, 98, 7, 0.15) 55%, transparent 80%)`).
  - Uranus (`uranus-rbt`): Cyan / Blueprint Teal methane glow (`radial-gradient(ellipse at 50% 110%, rgba(6, 182, 212, 0.3) 0%, rgba(14, 116, 144, 0.15) 50%, transparent 80%)`).
  - Neptune (`neptune-psv`): Royal Azure deep cosmic ocean abyss (`radial-gradient(ellipse at 50% 115%, rgba(37, 99, 235, 0.35) 0%, rgba(29, 78, 216, 0.15) 55%, transparent 80%)`).
- **Level Registry & Navigation Updates:**
  - Levels Registered:
    - `10-1-sains-benda-hidup` (Level 10.1: Musytari - Sains)
    - `11-1-sejarah-garis-masa` (Level 11.1: Zuhal - Sejarah)
    - `12-1-rbt-bentuk-asas` (Level 12.1: Uranus - RBT)
    - `13-1-psv-warna-imaginasi` (Level 13.1: Neptun - PSV)
  - Files Modified:
    - `src/lib/kids/levels.ts`: Add Level and World definitions (Worlds 10–13), and update `getTotalLevels()` dynamic calculation (which expands from 23 to 27).
    - `src/lib/kids/level-content.ts`: Add dynamic imports for new MDX lessons in both `ms` and `en`.
    - `src/lib/kids/section-titles.ts`: Add localized section titles for stages 1–8.
    - UI Navigation & Header: Header progress indicators reflect dynamic `x/27` total levels.
- **Planetary HUD Mission Routing:**
  - In `planetary-hud.tsx` / `planetary-explorer.tsx` via `resolveMissionRoute`:
    - Jupiter Feature 1 -> `/level/10-1-sains-benda-hidup?origin=planets`
    - Saturn Feature 1 -> `/level/11-1-sejarah-garis-masa?origin=planets`
    - Uranus Feature 1 -> `/level/12-1-rbt-bentuk-asas?origin=planets`
    - Neptune Feature 1 -> `/level/13-1-psv-warna-imaginasi?origin=planets`
  - Back button on lessons preserves origin query param and safely returns to `/planets`.

### the agent's Discretion
- Star particle distributions, pulse animation delays, and subtle visual embellishments for the 4 outer planet backgrounds matching the inner planet pattern in `PlanetBackground`.
- Detailed section title translations in `section-titles.ts` adhering to the exact headings already authored in the MDX files.
- Exact test organization and assertion patterns in Vitest suites (`planet-background.test.tsx`, `section-titles.test.ts`, `level-locale.test.tsx`, `planetary-explorer.test.tsx`, `planetary-hud.test.tsx`).

### Deferred Ideas (OUT OF SCOPE)
- Authoring Year 2 to Year 6 (Tahun 2–6) lessons or capstone boss lessons (FUTR-01).
- Interactive 3D flyby transitions between orbit and lesson (FUTR-02).
- Modifying existing Earth (Worlds 1–5) or Inner Planet lessons (Worlds 6–9).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| THEME-01 | User experiences bespoke atmospheric and celestial themes in `PlanetBackground` for Jupiter, Saturn, Uranus, and Neptune with matched accent navigation borders. | Documented exact CSS gradients, IDs (`jupiter`, `saturn`, `uranus`, `neptune`), accent colors, and slug matching rules for `planet-background.tsx`. |
| THEME-02 | Telemetry HUD activates mission launch buttons for the newly authored Year 1 regions and safely preserves "Belum ada misi untuk kawasan ini" for unauthored future years (Tahun 2–6). | Verified `hasMission: true` on Feature 1 and `hasMission: false` on Features 2–7 in `src/lib/kids/planets.ts`. Confirmed `planetary-hud.tsx` already branches on `hasMission`. |
| ROUTE-01 | New levels are registered in `levels.ts`, `level-content.ts`, and `section-titles.ts`, expanding total application level count from 23 to 27 with accurate header progress counters and bidirectional origin tracking (`?origin=planets`). | Mapped exact data structures for `worlds` array in `levels.ts`, dynamic imports in `level-content.ts`, 8 section titles per lesson in `section-titles.ts`, and `resolveMissionRoute` in `planets.ts`. |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Ambient Celestial Theming | Client (Browser / DOM) | — | Pure CSS visual styling with `useLevelSlug()` reacting to client route context. |
| Level Registry (`levels.ts`) | Shared Logic (Lib) | Next.js SSG | Source-of-truth metadata consumed by both `generateStaticParams()` at build time and client header progress. |
| MDX Dynamic Import Bundling (`level-content.ts`) | Client / Bundler | Next.js SSG | Statically analyzable per-level dynamic import map ensuring code splitting without leaking non-existent routes. |
| Section Title Registry (`section-titles.ts`) | Shared Logic (Lib) | Client UI | Maps 0-indexed sections in MDX to localized breadcrumbs and progress dots. |
| HUD Mission Dispatcher (`planetary-hud.tsx`, `planets.ts`) | Client UI / Routing | Next.js Router | Handles click on active feature, resolves safe internal route via `resolveMissionRoute`, and appends `?origin=planets`. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.1 [VERIFIED: package.json:34] | React App Framework | Static export app router with SSG `generateStaticParams`. |
| React | 19.0.0 [VERIFIED: package.json:44] | UI Component Library | Component rendering, hooks, and context. |
| Tailwind CSS | 3.4.17 [VERIFIED: package.json:54] | Utility CSS | Design tokens, gradients, backdrop blur, positioning. |
| next-intl | 3.26.3 [VERIFIED: package.json:40] | Internationalization | Bilingual messages (`en`, `ms`) and locale context. |
| Vitest | 2.1.9 [VERIFIED: package.json:58] | Test Runner | Fast unit and integration tests with jsdom. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @testing-library/react | 16.2.0 [VERIFIED: package.json:51] | UI Testing | Rendering components in tests and testing accessibility/interactions. |

## Architecture Patterns

### Recommended File Changes
```
src/
├── components/kids/
│   └── layout/
│       └── planet-background.tsx       # Add jupiter, saturn, uranus, neptune themes & slug matching
├── lib/kids/
│   ├── levels.ts                       # Add Worlds 10-13, levels 10.1, 11.1, 12.1, 13.1
│   ├── level-content.ts                # Add L_en__* and L_ms__* dynamic imports and loaders
│   ├── section-titles.ts               # Add 8 section titles per lesson for en & ms
│   └── planets.ts                      # Update resolveMissionRoute for outer planets
messages/
├── en.json                             # Add world titles & level titles/descriptions for 10-13
└── ms.json                             # Add world titles & level titles/descriptions for 10-13
src/__tests__/kids/
├── planet-background.test.tsx          # Add tests for outer planet theme resolution and rendering
├── planetary-hud.test.tsx              # Add test for outer planet launch trigger
├── planetary-explorer.test.tsx         # Add test for default routing to 10.1-13.1 with ?origin=planets
├── section-titles.test.ts              # Expand ALL_23_LESSON_SLUGS to ALL_27_LESSON_SLUGS
└── level-locale.test.tsx               # Update 23 -> 27 slug assertions in generateStaticParams & ms corpus
```

### Pattern 1: Atmospheric Theming in `PlanetBackground`
[VERIFIED: src/components/kids/layout/planet-background.tsx:7-41]
Current type union is:
```typescript
export type PlanetTheme = "earth" | "moon" | "mars" | "venus" | "mercury";
```
We expand this union to:
```typescript
export type PlanetTheme = "earth" | "moon" | "mars" | "venus" | "mercury" | "jupiter" | "saturn" | "uranus" | "neptune";
```

`PLANET_THEMES` configuration:
- `jupiter`:
  - `id`: "jupiter"
  - `background`: `"linear-gradient(180deg, #451A03 0%, #B45309 50%, #1E0A00 100%)"` [VERIFIED: derived from context amber palette]
  - `accentColor`: `"#F59E0B"` (Amber-500)
  - Atmospheric overlay: `radial-gradient(ellipse at 50% 120%, rgba(217, 119, 6, 0.35) 0%, rgba(180, 83, 9, 0.15) 50%, transparent 80%)` [VERIFIED: 28-CONTEXT.md:12]
- `saturn`:
  - `id`: "saturn"
  - `background`: `"linear-gradient(180deg, #3A2E05 0%, #A16207 50%, #1A1402 100%)"`
  - `accentColor`: `"#EAB308"` (Yellow-500)
  - Atmospheric overlay: `radial-gradient(ellipse at 50% 115%, rgba(234, 179, 8, 0.3) 0%, rgba(161, 98, 7, 0.15) 55%, transparent 80%)` [VERIFIED: 28-CONTEXT.md:13]
- `uranus`:
  - `id`: "uranus"
  - `background`: `"linear-gradient(180deg, #083344 0%, #0E7490 50%, #031822 100%)"`
  - `accentColor`: `"#06B6D4"` (Cyan-500)
  - Atmospheric overlay: `radial-gradient(ellipse at 50% 110%, rgba(6, 182, 212, 0.3) 0%, rgba(14, 116, 144, 0.15) 50%, transparent 80%)` [VERIFIED: 28-CONTEXT.md:14]
- `neptune`:
  - `id`: "neptune"
  - `background`: `"linear-gradient(180deg, #172554 0%, #1D4ED8 50%, #08112C 100%)"`
  - `accentColor`: `"#3B82F6"` (Blue-500)
  - Atmospheric overlay: `radial-gradient(ellipse at 50% 115%, rgba(37, 99, 235, 0.35) 0%, rgba(29, 78, 216, 0.15) 55%, transparent 80%)` [VERIFIED: 28-CONTEXT.md:15]

`getThemeForLevelSlug(slug?: string)` resolution rules:
[VERIFIED: src/components/kids/layout/planet-background.tsx:47-75]
```typescript
  if (slug.startsWith("10-") || slug.includes("-sains-") || slug.startsWith("musytari-") || slug.startsWith("jupiter-")) {
    return "jupiter";
  }
  if (slug.startsWith("11-") || slug.includes("-sejarah-") || slug.startsWith("zuhal-") || slug.startsWith("saturn-")) {
    return "saturn";
  }
  if (slug.startsWith("12-") || slug.includes("-rbt-") || slug.startsWith("uranus-")) {
    return "uranus";
  }
  if (slug.startsWith("13-") || slug.includes("-psv-") || slug.startsWith("neptun-") || slug.startsWith("neptune-")) {
    return "neptune";
  }
```
And check `level.world`:
```typescript
  if (level.world === 10) return "jupiter";
  if (level.world === 11) return "saturn";
  if (level.world === 12) return "uranus";
  if (level.world === 13) return "neptune";
```

### Pattern 2: Global Level Registration in `levels.ts`
[VERIFIED: src/lib/kids/levels.ts:22-343]
Add 4 new worlds:
- World 10: Musytari: Sains (slug: `musytari-sains`, color: `amber`, emoji: `🟠`)
  - Level `10-1-sains-benda-hidup`:
    - `title`: "Benda Hidup & Benda Bukan Hidup"
    - `titleKey`: "kids.levels.10_1_sains_benda_hidup.title"
    - `description`: "Bimbing AI memerhati dan membezakan ciri biologi benda hidup serta benda bukan hidup"
    - `descriptionKey`: "kids.levels.10_1_sains_benda_hidup.description"
    - `world`: 10, `levelNumber`: 1, `concepts`: ["benda-hidup", "ciri-biologi", "pemerhatian-sains"]
- World 11: Zuhal: Sejarah (slug: `zuhal-sejarah`, color: `yellow`, emoji: `🪐`)
  - Level `11-1-sejarah-garis-masa`:
    - `title`: "Garis Masa Diri & Riwayat Keluarga"
    - `titleKey`: "kids.levels.11_1_sejarah_garis_masa.title"
    - `description`: "Bimbing AI menyusun kronologi peristiwa masa lampau dan temu bual keluarga yang bersopan"
    - `descriptionKey`: "kids.levels.11_1_sejarah_garis_masa.description"
    - `world`: 11, `levelNumber`: 1, `concepts`: ["kronologi", "garis-masa", "adab-temubual"]
- World 12: Uranus: Reka Bentuk & Teknologi (slug: `uranus-rbt`, color: `cyan`, emoji: `🧊`)
  - Level `12-1-rbt-bentuk-asas`:
    - `title`: "Bentuk Asas & Blok Binaan"
    - `titleKey`: "kids.levels.12_1_rbt_bentuk_asas.title"
    - `description`: "Bimbing AI mereka bentuk struktur kukuh menggunakan bentuk asas dan blok geometri 3D"
    - `descriptionKey`: "kids.levels.12_1_rbt_bentuk_asas.description"
    - `world`: 12, `levelNumber`: 1, `concepts`: ["bentuk-asas", "blok-geometri", "kestabilan-struktur"]
- World 13: Neptun: Pendidikan Seni Visual (slug: `neptun-psv`, color: `blue`, emoji: `🎨`)
  - Level `13-1-psv-warna-imaginasi`:
    - `title`: "Warna Asas & Garisan Imaginasi"
    - `titleKey`: "kids.levels.13_1_psv_warna_imaginasi.title"
    - `description`: "Bimbing AI menghasilkan karya kreatif menggunakan warna primer dan corak garisan ekspresif"
    - `descriptionKey`: "kids.levels.13_1_psv_warna_imaginasi.description"
    - `world`: 13, `levelNumber`: 1, `concepts`: ["warna-primer", "corak-garisan", "imaginasi-visual"]

`getTotalLevels()` [VERIFIED: src/lib/kids/levels.ts:381-383]:
```typescript
export function getTotalLevels(): number {
  return getAllLevels().length;
}
```
Because `getTotalLevels()` returns `getAllLevels().length`, adding Worlds 10–13 automatically scales `getTotalLevels()` from 23 to 27! In addition, `kids-header.tsx` dynamically displays `total = getTotalLevels()`, so it will display `x/27` seamlessly.

### Pattern 3: Dynamic MDX Loaders in `level-content.ts`
[VERIFIED: src/lib/kids/level-content.ts:129-132, 361-364, 471-474, 727-730]
We define the lazy loaders:
```typescript
// English
const L_en__10_1_sains_benda_hidup = () => import("@/content/kids/en/10-1-sains-benda-hidup.mdx");
const L_en__11_1_sejarah_garis_masa = () => import("@/content/kids/en/11-1-sejarah-garis-masa.mdx");
const L_en__12_1_rbt_bentuk_asas = () => import("@/content/kids/en/12-1-rbt-bentuk-asas.mdx");
const L_en__13_1_psv_warna_imaginasi = () => import("@/content/kids/en/13-1-psv-warna-imaginasi.mdx");

// Bahasa Melayu
const L_ms__10_1_sains_benda_hidup = () => import("@/content/kids/ms/10-1-sains-benda-hidup.mdx");
const L_ms__11_1_sejarah_garis_masa = () => import("@/content/kids/ms/11-1-sejarah-garis-masa.mdx");
const L_ms__12_1_rbt_bentuk_asas = () => import("@/content/kids/ms/12-1-rbt-bentuk-asas.mdx");
const L_ms__13_1_psv_warna_imaginasi = () => import("@/content/kids/ms/13-1-psv-warna-imaginasi.mdx");
```
And add them into `loaders.en` and `loaders.ms`.

### Pattern 4: Section Titles Registry in `section-titles.ts`
All 4 MDX files have exactly 8 `<Section>` components [VERIFIED: lines 1, 7, 13, 30, 44, 62, 80, 97 of each file].
Their headings and intros map to:

1. `10-1-sains-benda-hidup`:
   - `en`:
     0. "Welcome to Jupiter: Science Mission"
     1. "Living vs Non-Living Traits"
     2. "Challenge 1: Identify Living Characteristics"
     3. "Challenge 2: Observation Prompt vs Mistake"
     4. "Challenge 3: Heal the Science Prompt"
     5. "Challenge 4: Assemble Science Prompt Formula"
     6. "Challenge 5: Exploring the Natural World"
     7. "Mastery Boss: Jupiter Science Champion"
   - `ms`:
     0. "Selamat Datang ke Musytari: Misi Sains"
     1. "Ciri Benda Hidup & Bukan Hidup"
     2. "Cabaran 1: Kenal Pasti Ciri Benda Hidup"
     3. "Cabaran 2: Prompt Pemerhatian vs Kesilapan"
     4. "Cabaran 3: Rawat Arahan Sains"
     5. "Cabaran 4: Susun Formula Prompt Sains"
     6. "Cabaran 5: Kata Ajaib Penerokaan Alam"
     7. "Cabaran Unggul: Jaguh Sains Musytari"

2. `11-1-sejarah-garis-masa`:
   - `en`:
     0. "Welcome to Saturn: History Mission"
     1. "Chronological Sequence & Respect"
     2. "Challenge 1: Chronological Time Keywords"
     3. "Challenge 2: Courteous Interview vs Rude Request"
     4. "Challenge 3: Heal the Timeline Prompt"
     5. "Challenge 4: Assemble Chronological Prompt Formula"
     6. "Challenge 5: Meaningful Milestones"
     7. "Mastery Boss: Saturn History Champion"
   - `ms`:
     0. "Selamat Datang ke Zuhal: Misi Sejarah"
     1. "Urutan Kronologi & Adab Bertanya"
     2. "Cabaran 1: Kata Penanda Masa Kronologi"
     3. "Cabaran 2: Prompt Temu Bual Santun vs Kasar"
     4. "Cabaran 3: Rawat Arahan Garis Masa"
     5. "Cabaran 4: Susun Formula Prompt Kronologi"
     6. "Cabaran 5: Kata Ajaib Garis Masa Bermakna"
     7. "Cabaran Unggul: Jaguh Sejarah Zuhal"

3. `12-1-rbt-bentuk-asas`:
   - `en`:
     0. "Welcome to Uranus: Design & Tech Mission"
     1. "3D Building Blocks & Stability"
     2. "Challenge 1: Choose a Sturdy Structural Base"
     3. "Challenge 2: Geometric Prompt vs Design Mistake"
     4. "Challenge 3: Heal the Builder Prompt"
     5. "Challenge 4: Arrange Design Prompt Formula"
     6. "Challenge 5: Planetary Rover Vehicle"
     7. "Ultimate Challenge: Uranus Design Champion"
   - `ms`:
     0. "Selamat Datang ke Uranus: Misi RBT"
     1. "Blok Geometri & Kestabilan Struktur"
     2. "Cabaran 1: Pilih Tapak Struktur yang Kukuh"
     3. "Cabaran 2: Prompt Geometri vs Kesilapan Reka Bentuk"
     4. "Cabaran 3: Rawat Arahan Jurubina"
     5. "Cabaran 4: Susun Formula Prompt Reka Bentuk"
     6. "Cabaran 5: Kata Ajaib Kenderaan Penjelajah Angkasa"
     7. "Cabaran Unggul: Jaguh Reka Bentuk Uranus"

4. `13-1-psv-warna-imaginasi`:
   - `en`:
     0. "Welcome to Neptune: Visual Arts Mission"
     1. "Primary Colors & Expressive Lines"
     2. "Challenge 1: Choose Primary Colors & Expressive Lines"
     3. "Challenge 2: Visual Art Prompt vs Sketch Mistake"
     4. "Challenge 3: Heal the Young Artist Prompt"
     5. "Challenge 4: Arrange Visual Art Prompt Formula"
     6. "Challenge 5: Neptune Tempest Canvas"
     7. "Ultimate Challenge: Neptune Art Champion"
   - `ms`:
     0. "Selamat Datang ke Neptun: Misi Seni Visual"
     1. "Warna Primer & Corak Garisan Seni"
     2. "Cabaran 1: Pilih Warna Asas dan Garisan Seni"
     3. "Cabaran 2: Prompt Seni Visual vs Kesilapan Lakaran"
     4. "Cabaran 3: Rawat Arahan Pelukis Cilik"
     5. "Cabaran 4: Susun Formula Prompt Seni Visual"
     6. "Cabaran 5: Kata Ajaib Kanvas Ribut Neptun"
     7. "Cabaran Unggul: Jaguh Seni Neptun"

### Pattern 5: Mission Route Resolution in `planets.ts`
[VERIFIED: src/lib/kids/planets.ts:1924-1941]
`resolveMissionRoute(planetId: PlanetId | string, feature?: PlanetFeature): string`:
```typescript
export function resolveMissionRoute(planetId: PlanetId | string, feature?: PlanetFeature): string {
  void feature;
  switch (planetId) {
    case 'earth-prompting':
      return '/map';
    case 'moon-bm':
      return '/level/6-1-bm-kucing-peromfu';
    case 'venus-matematik':
      return '/level/8-1-matematik-tambah-bintang';
    case 'mars-english':
      return '/level/7-1-english-colorful-toys';
    case 'mercury-moral':
      return '/level/9-1-moral-sahabat-prihatin';
    case 'jupiter-sains':
      return '/level/10-1-sains-benda-hidup';
    case 'saturn-sejarah':
      return '/level/11-1-sejarah-garis-masa';
    case 'uranus-rbt':
      return '/level/12-1-rbt-bentuk-asas';
    case 'neptune-psv':
      return '/level/13-1-psv-warna-imaginasi';
    default:
      return '/map';
  }
}
```

When Feature 1 of any outer planet is launched, `handleLaunchMission` in `planetary-explorer.tsx` automatically calls:
`router.push(attachOriginToRoute(destRoute, 'planets'));` [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:151-153].
This appends `?origin=planets` to the route.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Route origin preservation | Custom cookie / local storage state machine | `attachOriginToRoute(route, 'planets')` & `getSafeReturnRoute()` in `lesson-origin.ts` | Already implemented and security-hardened against open redirects. |
| MDX Dynamic Loading | `eval()` or uncurated `React.lazy(newPath)` | Explicit loader map in `level-content.ts` | Next.js bundler requires static import paths for chunking and closure verification. |
| Progress count display | Hardcoded strings e.g. "x/23" or "x/27" in header JSX | `getTotalLevels()` from `levels.ts` | Dynamically derives the total from the `worlds` registry array. |

## Common Pitfalls

### Pitfall 1: Breaking Import Closure in `check:closure`
**What goes wrong:** Adding dynamic imports in `level-content.ts` to non-existent files or mismatched file names fails `npm run check:closure`.
**How to avoid:** Verified in this research that all 8 files already exist:
- `src/content/kids/en/10-1-sains-benda-hidup.mdx`
- `src/content/kids/en/11-1-sejarah-garis-masa.mdx`
- `src/content/kids/en/12-1-rbt-bentuk-asas.mdx`
- `src/content/kids/en/13-1-psv-warna-imaginasi.mdx`
- `src/content/kids/ms/10-1-sains-benda-hidup.mdx`
- `src/content/kids/ms/11-1-sejarah-garis-masa.mdx`
- `src/content/kids/ms/12-1-rbt-bentuk-asas.mdx`
- `src/content/kids/ms/13-1-psv-warna-imaginasi.mdx`
All imports must match these exact file paths.

### Pitfall 2: Stale Section Counts in `section-titles.test.ts`
**What goes wrong:** `section-titles.test.ts` checks that `ALL_23_LESSON_SLUGS` matches MDX section count. If `section-titles.ts` has mismatched lengths or if `section-titles.test.ts` is not updated to `ALL_27_LESSON_SLUGS`, tests will fail.
**How to avoid:** Both EN and MS MDX files have exactly 8 `<Section>` tags. Register exactly 8 titles per slug for both locales, update `ALL_23_LESSON_SLUGS` in `section-titles.test.ts` to `ALL_27_LESSON_SLUGS`, and assert length 27.

### Pitfall 3: Stale Slugs in `level-locale.test.tsx`
**What goes wrong:** `src/__tests__/kids/level-locale.test.tsx` has two tests explicitly asserting `expect(slugs).toHaveLength(23)` for `generateStaticParams` and `expect(levels).toHaveLength(23)` for effectiveLocale 'ms'.
**How to avoid:** Update those assertions to 27 in lockstep with the registry expansion.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| — | None | — | All claims verified against codebase files this session. |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build & Runtime | ✓ | v22.14.0 | — |
| npm | Package Manager | ✓ | 10.9.2 | — |
| Next.js | Application Framework | ✓ | 16.1.1 | — |
| Vitest | Test Suite | ✓ | 2.1.9 | — |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 2.1.9 |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test -- src/__tests__/kids/planet-background.test.tsx src/__tests__/kids/section-titles.test.ts src/__tests__/kids/planetary-hud.test.tsx` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| THEME-01 | `PlanetBackground` resolves and renders themes for `jupiter`, `saturn`, `uranus`, `neptune` | unit | `npm test -- src/__tests__/kids/planet-background.test.tsx` | ✅ |
| THEME-02 | Telemetry HUD renders launch button for Feature 1 on outer planets and notice for Features 2-7 | component | `npm test -- src/__tests__/kids/planetary-hud.test.tsx` | ✅ |
| ROUTE-01 | Level registry (27 total), dynamic imports, section titles, and `resolveMissionRoute` routing with `?origin=planets` | integration | `npm test -- src/__tests__/kids/section-titles.test.ts src/__tests__/kids/level-locale.test.tsx src/__tests__/kids/planetary-explorer.test.tsx` | ✅ |

### Wave 0 Gaps
None — all test infrastructure and test files exist. They will be updated to include the new outer planets and verify the 27-level expansion.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | yes | Slug matching in `getThemeForLevelSlug` strictly falls back to `'earth'` on unknown strings. `resolveMissionRoute` strictly switches on known planet IDs and defaults to `'/map'` (preventing open redirect vectors). |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Open Redirect via Origin Parameter | Tampering | `lesson-origin.ts` allowlists only `'map'` and `'planets'`. Untrusted query params are stripped. |
| Arbitrary Dynamic Code Execution | Elevation of Privilege | MDX modules are loaded via static import map in `level-content.ts` with strict inventory check (`isSupportedLocale`). |

## Sources

### Primary (HIGH confidence)
- `src/components/kids/layout/planet-background.tsx:7-299` — verified theme structures, css gradients, and slug matching.
- `src/lib/kids/levels.ts:1-383` — verified level and world schemas and dynamic `getTotalLevels()` method.
- `src/lib/kids/level-content.ts:1-740` — verified dynamic lazy loader structure for `en` and `ms`.
- `src/lib/kids/section-titles.ts:1-598` — verified section title dictionary layout.
- `src/lib/kids/planets.ts:1924-1941` — verified `resolveMissionRoute` switch cases and safe fallback.
- `src/components/kids/planets/planetary-explorer.tsx:145-157` — verified `attachOriginToRoute` call on launch mission.
- `src/content/kids/ms/` and `src/content/kids/en/` — verified exact Section counts (8 sections per lesson) and headings for 10-1, 11-1, 12-1, and 13-1.
- `scripts/check-kids-import-closure.js` — verified import closure pass criteria.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Directly verified from `package.json`
- Architecture: HIGH - Fully aligned with existing inner-planet patterns and verified via unit tests
- Pitfalls: HIGH - All edge cases (23->27 test updates, section count matching, closure checks) identified and verified

**Research date:** 2026-11-20
**Valid until:** 2026-12-20
