# Phase 24: Outer Planets Subject Architecture & Telemetry - Research
**Researched:** 2026-11-19
**Domain:** Planetary Subject Architecture, KSSR Subject Alignments, Bilingual Localization, Cartographic Telemetry & Three.js Integration
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Planet ID & Subject ID Naming Convention:**
  - Previous IDs: `jupiter-astronomy`, `saturn-astronomy`, `uranus-astronomy`, `neptune-astronomy`
  - New Canonical IDs:
    - `jupiter-sains` (Subject: `sains`)
    - `saturn-sejarah` (Subject: `sejarah`)
    - `uranus-rbt` (Subject: `rbt`)
    - `neptune-psv` (Subject: `psv`)
  - **Compatibility:** Backward compatibility type aliases or union mappings will be retained in `src/lib/kids/planets.ts` so older references resolve gracefully if queried.
  - **SubjectId Type:** Expanded to `"prompting" | "bm" | "english" | "matematik" | "moral" | "sains" | "sejarah" | "rbt" | "psv" | "astronomy"`.
- **Thematic Color Palettes & Visual Identifiers:**
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
- **Subject Titles & i18n Strategy:**
  - Bilingual titles and taglines in `messages/ms.json` and `messages/en.json`, as well as `PLANET_WORLDS`:
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

### the agent's Discretion
- Exact naming and structure of backward-compatibility type unions/aliases in `src/lib/kids/planets.ts` (`CanonicalPlanetId`, `LegacyPlanetId`, or backward-compatible union in `PlanetId`).
- Structure of the migration in `solar-system-scene.ts` and `planet-cartography-scene.ts` to support both legacy and new IDs.
- Strategy for dictionary keys in `messages/en.json` and `messages/ms.json` (replacing keys vs providing duplicate alias keys).

### Deferred Ideas (OUT OF SCOPE)
- Populating the 7 geological / atmospheric regions (`features`) for each of the outer planets (deferred to **Phase 25**).
- Authoring interactive lessons for Jupiter (Sains) and Saturn (Sejarah) (deferred to **Phase 26**).
- Authoring interactive lessons for Uranus (RBT) and Neptune (PSV) (deferred to **Phase 27**).
- Level registry expansion (10.1–13.1), HUD mission launcher wiring, and `PlanetBackground` shaders (deferred to **Phase 28**).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| `SUBJ-01` | User sees all 4 outer planets mapped to core KSSR primary subjects: Jupiter = Sains (Science), Saturn = Sejarah (History), Uranus = Reka Bentuk & Teknologi (RBT), and Neptune = Pendidikan Seni Visual (PSV). | Validated via `PLANET_WORLDS` in `src/lib/kids/planets.ts`, updating `subjectId`, `subjectTitle`, `subjectTitleMs`, and canonical `PlanetId`. |
| `SUBJ-02` | Celestial schemas and i18n message bundles provide authentic subject titles, taglines, and curriculum descriptions in both Bahasa Melayu (`ms`) and English (`en`). | Validated via `messages/en.json`, `messages/ms.json`, `PLANET_WORLDS` data structures, and `planets-i18n.test.ts` symmetry test assertions. |
</phase_requirements>

## Summary

Phase 24 establishes the structural, semantic, and localized foundations for transforming the four outer solar system bodies (Jupiter, Saturn, Uranus, Neptune) from placeholder astronomical exhibits into active primary school curriculum worlds in Sekolah Prompt-Fu. This directly advances Milestone v1.5 towards KSSR Sains, Sejarah, RBT, and PSV lesson delivery.

The codebase currently defines nine celestial worlds in `PLANET_WORLDS` (`src/lib/kids/planets.ts:125-1239` [VERIFIED: src/lib/kids/planets.ts:125-1239]). The five inner worlds (`earth-prompting`, `moon-bm`, `mars-english`, `venus-matematik`, `mercury-moral`) possess active curricula and 7 geological features each. In contrast, the four outer worlds are currently typed under `subjectId: "astronomy"` with empty features arrays (`features: []`) and placeholder tags (`jupiter-astronomy`, `saturn-astronomy`, `uranus-astronomy`, `neptune-astronomy`).

To achieve `SUBJ-01` and `SUBJ-02` with zero regressions:
1. `SubjectId` must expand from 6 subjects to 10: adding `"sains" | "sejarah" | "rbt" | "psv"`.
2. `PlanetId` must adopt canonical IDs (`"jupiter-sains" | "saturn-sejarah" | "uranus-rbt" | "neptune-psv"`) while retaining legacy IDs as a backward-compatibility union.
3. `PLANET_WORLDS` entries for planets 6–9 must be updated with the locked thematic subject titles, taglines, and subject IDs.
4. Translation dictionaries in `messages/en.json` and `messages/ms.json` must provide localized entries for the new IDs under `kids.planets.worlds`, with alias support for legacy keys.
5. Three.js scenes (`solar-system-scene.ts`, `planet-cartography-scene.ts`), HUD (`planetary-hud.tsx`), and test suites must be updated synchronously to guarantee 100% test pass rate and typecheck purity.

**Primary recommendation:** Use a discriminative union for `PlanetId` (`export type CanonicalPlanetId = ...; export type LegacyPlanetId = ...; export type PlanetId = CanonicalPlanetId | LegacyPlanetId;`) and update `PLANET_WORLDS` entries to canonical IDs. In `messages/{en,ms}.json`, replace or dual-key the outer planet dictionary objects so both canonical and legacy lookups succeed without missing keys. Update `solar-system-scene.ts` and `planet-cartography-scene.ts` to reference the canonical IDs while accepting legacy IDs as fallbacks.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Subject & World Type Definitions (`SubjectId`, `PlanetId`) | Core Library (`src/lib/kids/planets.ts`) | — | Single source of truth for planetary domain model and type safety. |
| Planetary Telemetry & Metadata (`PLANET_WORLDS`) | Core Library (`src/lib/kids/planets.ts`) | — | Static dataset consumed by 3D scenes, cartography, and HUD components. |
| Bilingual Copy & Dictionaries | i18n Data Layer (`messages/en.json`, `messages/ms.json`) | Core Library (`PLANET_WORLDS`) | Client and SSR components query `useTranslations('kids.planets')` for localized UI chrome, titles, and taglines. |
| 3D Solar System Overview & Mesh Anchors | Three.js Scene Tier (`solar-system-scene.ts`) | Client Component (`planetary-explorer.tsx`) | Renders orbits and planet meshes; raycasts mesh `userData.planetId` to trigger planet selection. |
| 3D Planetary Cartography Textures & Rings | Three.js Scene Tier (`planet-cartography-scene.ts`) | Client Component (`planetary-canvas.tsx`) | Binds globe textures and atmospheric shaders based on `planet.id`. |
| Telemetry HUD & Status Displays | Client UI Component (`planetary-hud.tsx`) | — | Glassmorphic HUD displaying telemetry cards, province sidebars, and subject banners. |

## In-Repo Values & Discrete Constants (Verbatim Quotes)

Per the In-Repo Value Provenance Rule, the definitions were inspected directly in this session:

### 1. Existing `SubjectId` and `PlanetId`
From `src/lib/kids/planets.ts:6-17` [VERIFIED: src/lib/kids/planets.ts:6-17]:
```typescript
export type SubjectId = "prompting" | "bm" | "english" | "matematik" | "moral" | "astronomy";

export type PlanetId =
  | "earth-prompting"
  | "moon-bm"
  | "mars-english"
  | "venus-matematik"
  | "mercury-moral"
  | "jupiter-astronomy"
  | "saturn-astronomy"
  | "uranus-astronomy"
  | "neptune-astronomy";
```

### 2. Existing Outer World Definitions in `PLANET_WORLDS`
From `src/lib/kids/planets.ts:1075-1238` [VERIFIED: src/lib/kids/planets.ts:1075-1238]:
- Order 6 (Jupiter):
  `id: "jupiter-astronomy"`, `subjectId: "astronomy"`, `themeColor: "#D97706"`, `accentColor: "#F59E0B"`
- Order 7 (Saturn):
  `id: "saturn-astronomy"`, `subjectId: "astronomy"`, `themeColor: "#EAB308"`, `accentColor: "#FDE047"`
- Order 8 (Uranus):
  `id: "uranus-astronomy"`, `subjectId: "astronomy"`, `themeColor: "#06B6D4"`, `accentColor: "#22D3EE"`
- Order 9 (Neptune):
  `id: "neptune-astronomy"`, `subjectId: "astronomy"`, `themeColor: "#2563EB"`, `accentColor: "#3B82F6"`

### 3. Existing Three.js Texture Switch
From `src/components/kids/planets/planet-cartography-scene.ts:20-52` [VERIFIED: src/components/kids/planets/planet-cartography-scene.ts:20-52]:
```typescript
export function getPlanetTexturePath(planet: Planet): string {
  switch (planet.id) {
    case 'earth-prompting':
      return '/images/planets/earth.jpg';
    case 'moon-bm':
      return '/images/planets/moon.jpg';
    case 'mars-english':
      return '/images/planets/mars.jpg';
    case 'mercury-moral':
      return '/images/planets/mercury.jpg';
    case 'venus-matematik':
      return '/images/planets/venus_surface.jpg';
    case 'jupiter-astronomy':
      return '/images/planets/jupiter.jpg';
    case 'saturn-astronomy':
      return '/images/planets/saturn.jpg';
    case 'uranus-astronomy':
      return ''; // Procedural atmosphere
    case 'neptune-astronomy':
      return '/images/planets/neptune.jpg';
    default: {
...
```

### 4. Existing Three.js Solar System Scene Config
From `src/components/kids/planets/solar-system-scene.ts:116-125` [VERIFIED: src/components/kids/planets/solar-system-scene.ts:116-125]:
```typescript
  const primaryConfigs: PlanetOrbitConfig[] = [
    { id: 'mercury-moral', radius: 0.45, dist: 6.0, tex: 'mercury.jpg', speed: 0.4 },
    { id: 'venus-matematik', radius: 0.75, dist: 9.5, tex: 'venus_surface.jpg', speed: 0.3 },
    { id: 'earth-prompting', radius: 0.85, dist: 14.5, tex: 'earth.jpg', speed: 0.22 },
    { id: 'mars-english', radius: 0.60, dist: 20.0, tex: 'mars.jpg', speed: 0.16 },
    { id: 'jupiter-astronomy', radius: 1.45, dist: 26.5, tex: 'jupiter.jpg', speed: 0.11 },
    { id: 'saturn-astronomy', radius: 1.25, dist: 33.0, tex: 'saturn.jpg', speed: 0.08 },
    { id: 'uranus-astronomy', radius: 0.95, dist: 39.5, tex: '', speed: 0.06 },
    { id: 'neptune-astronomy', radius: 0.90, dist: 46.0, tex: 'neptune.jpg', speed: 0.05 },
  ];
```
And Saturn ring conditional at lines 154-168 [VERIFIED: src/components/kids/planets/solar-system-scene.ts:154-168]:
```typescript
    if (cfg.id === 'saturn-astronomy') {
      const innerR = cfg.radius * 1.35;
      const outerR = cfg.radius * 2.35;
      const ringGeo = new THREE.RingGeometry(innerR, outerR, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xe2c592,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.name = 'ring-saturn-astronomy';
      ringMesh.rotation.x = Math.PI * 0.5 + 0.466;
      pMesh.add(ringMesh);
    }
```

### 5. Existing PlanetaryHud Coming Soon Conditional
From `src/components/kids/planets/planetary-hud.tsx:168-187` [VERIFIED: src/components/kids/planets/planetary-hud.tsx:168-187]:
```typescript
          {planet.subjectId === 'astronomy' ? (
            <div data-testid="coming-soon-card" className="p-4 text-center my-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold tracking-wide">
                <span>🚀</span>
                <span>{t('comingSoonTitle')}</span>
              </div>
...
```

## Standard Stack & Technology Architecture

### Core Dependencies
| Library / System | Version | Purpose | Why Standard |
|------------------|---------|---------|--------------|
| `three` | `^0.174.0` (in `package.json`) [VERIFIED: package.json:34] | 3D WebGL rendering of planets, orbits, and rings | Industry standard 3D graphics in browser |
| `next-intl` | `^3.26.5` (in `package.json`) [VERIFIED: package.json:28] | Bilingual dictionary resolution (`useTranslations`, `useLocale`) | Native Next.js App Router i18n support |
| `vitest` | `^2.1.9` (in `package.json`) [VERIFIED: package.json:44] | Test runner for schema, i18n, and 3D mock suites | Fast ESM native test framework |
| `@testing-library/react` | `^16.3.0` (in `package.json`) [VERIFIED: package.json:38] | Component testing for `PlanetaryHud` | Standard React DOM testing |

## Architecture Patterns & Implementation Blueprint

### 1. Type Architecture & Backward-Compatibility Model (`src/lib/kids/planets.ts`)

To avoid breaking existing consumers, type guards, or external references while introducing canonical IDs, the recommended type structure is:

```typescript
export type SubjectId =
  | "prompting"
  | "bm"
  | "english"
  | "matematik"
  | "moral"
  | "sains"
  | "sejarah"
  | "rbt"
  | "psv"
  | "astronomy"; // Retained for backward compatibility

export type CanonicalPlanetId =
  | "earth-prompting"
  | "moon-bm"
  | "mars-english"
  | "venus-matematik"
  | "mercury-moral"
  | "jupiter-sains"
  | "saturn-sejarah"
  | "uranus-rbt"
  | "neptune-psv";

export type LegacyPlanetId =
  | "jupiter-astronomy"
  | "saturn-astronomy"
  | "uranus-astronomy"
  | "neptune-astronomy";

export type PlanetId = CanonicalPlanetId | LegacyPlanetId;
```

In `getPlanetWorld(id: string): Planet | undefined`, an ID resolution map or normalization function should be used so that querying either `jupiter-astronomy` or `jupiter-sains` returns the Jupiter planet object:
```typescript
const PLANET_ID_ALIASES: Record<string, CanonicalPlanetId> = {
  "jupiter-astronomy": "jupiter-sains",
  "saturn-astronomy": "saturn-sejarah",
  "uranus-astronomy": "uranus-rbt",
  "neptune-astronomy": "neptune-psv",
};

export function normalizePlanetId(id: string): string {
  return PLANET_ID_ALIASES[id] || id;
}

export function getPlanetWorld(id: string): Planet | undefined {
  const normalized = normalizePlanetId(id);
  return PLANET_WORLDS.find((planet) => planet.id === normalized);
}
```

### 2. PLANET_WORLDS Data Structure Updates

The entries for orders 6, 7, 8, and 9 in `PLANET_WORLDS` (`src/lib/kids/planets.ts`) are updated:

#### Order 6: Jupiter
- `id`: `"jupiter-sains"`
- `subjectId`: `"sains"`
- `subjectTitle`: `"Science & Empirical Inquiry"`
- `subjectTitleMs`: `"Sains & Penerokaan Saintifik"`
- `themeColor`: `"#D97706"`
- `accentColor`: `"#F59E0B"`
- `tagline`: `"Swirling giant unlocks the secrets of scientific observation, living wonders, and nature hypotheses."`
- `taglineMs`: `"Gergasi bergelora membuka rahsia pemerhatian saintifik, benda hidup, dan hipotesis alam."`
- (Retain orbital telemetry: `orbitalPeriodDays: 4332.59`, `diameterKm: 139820`, `radiusKm: 69911`, `distanceFromSun`, `fieldNotes`)
- `features`: `[]` (populated in Phase 25)

#### Order 7: Saturn
- `id`: `"saturn-sejarah"`
- `subjectId`: `"sejarah"`
- `subjectTitle`: `"History & Chronology"`
- `subjectTitleMs`: `"Sejarah & Garis Masa"`
- `themeColor`: `"#EAB308"`
- `accentColor`: `"#FDE047"`
- `tagline`: `"Ancient cosmic rings guiding event timelines, personal history, and family chronicles."`
- `taglineMs`: `"Gelung masa purba membimbing kronologi peristiwa, sejarah diri, dan riwayat keluarga."`
- (Retain orbital telemetry: `orbitalPeriodDays: 10759.22`, `diameterKm: 116460`, `radiusKm: 58232`, `distanceFromSun`, `fieldNotes`)
- `features`: `[]` (populated in Phase 25)

#### Order 8: Uranus
- `id`: `"uranus-rbt"`
- `subjectId`: `"rbt"`
- `subjectTitle`: `"Design & Technology (RBT)"`
- `subjectTitleMs`: `"Reka Bentuk & Teknologi"`
- `themeColor`: `"#06B6D4"`
- `accentColor`: `"#22D3EE"`
- `tagline`: `"Tilted axis challenging creative basic shapes, 2D/3D blocks, and structural constraints."`
- `taglineMs`: `"Paksi condong menguji kreativiti bentuk asas, blok binaan 2D/3D, dan batas rekaan."`
- (Retain orbital telemetry: `orbitalPeriodDays: 30685.4`, `diameterKm: 50724`, `radiusKm: 25362`, `distanceFromSun`, `fieldNotes`)
- `features`: `[]` (populated in Phase 25)

#### Order 9: Neptune
- `id`: `"neptune-psv"`
- `subjectId`: `"psv"`
- `subjectTitle`: `"Visual Arts (PSV)"`
- `subjectTitleMs`: `"Pendidikan Seni Visual"`
- `themeColor`: `"#2563EB"`
- `accentColor`: `"#3B82F6"`
- `tagline`: `"Deep azure abyss inspiring primary color harmony, line patterns, and artistic imagination."`
- `taglineMs`: `"Jurang biru kosmik menyemarakkan harmoni warna asas, corak garisan, dan imaginasi seni."`
- (Retain orbital telemetry: `orbitalPeriodDays: 60189`, `diameterKm: 49244`, `radiusKm: 24622`, `distanceFromSun`, `fieldNotes`)
- `features`: `[]` (populated in Phase 25)

### 3. Localization (i18n) Schema Updates

In both `messages/en.json` and `messages/ms.json`:
Under `kids.planets.worlds`:
1. Add entries for `"jupiter-sains"`, `"saturn-sejarah"`, `"uranus-rbt"`, and `"neptune-psv"`.
2. Keep entries for `"jupiter-astronomy"`, `"saturn-astronomy"`, `"uranus-astronomy"`, and `"neptune-astronomy"` (identical or legacy) to avoid breaking any callers or tests that query legacy keys directly.
3. Content in `en.json`:
   ```json
   "jupiter-sains": {
     "title": "Jupiter: Science & Empirical Inquiry",
     "tagline": "Swirling giant unlocks the secrets of scientific observation, living wonders, and nature hypotheses."
   },
   "saturn-sejarah": {
     "title": "Saturn: History & Chronology",
     "tagline": "Ancient cosmic rings guiding event timelines, personal history, and family chronicles."
   },
   "uranus-rbt": {
     "title": "Uranus: Design & Technology (RBT)",
     "tagline": "Tilted axis challenging creative basic shapes, 2D/3D blocks, and structural constraints."
   },
   "neptune-psv": {
     "title": "Neptune: Visual Arts (PSV)",
     "tagline": "Deep azure abyss inspiring primary color harmony, line patterns, and artistic imagination."
   }
   ```
4. Content in `ms.json`:
   ```json
   "jupiter-sains": {
     "title": "Musytari: Sains & Penerokaan Saintifik",
     "tagline": "Gergasi bergelora membuka rahsia pemerhatian saintifik, benda hidup, dan hipotesis alam."
   },
   "saturn-sejarah": {
     "title": "Zuhal: Sejarah & Garis Masa",
     "tagline": "Gelung masa purba membimbing kronologi peristiwa, sejarah diri, dan riwayat keluarga."
   },
   "uranus-rbt": {
     "title": "Uranus: Reka Bentuk & Teknologi",
     "tagline": "Paksi condong menguji kreativiti bentuk asas, blok binaan 2D/3D, dan batas rekaan."
   },
   "neptune-psv": {
     "title": "Neptun: Pendidikan Seni Visual",
     "tagline": "Jurang biru kosmik menyemarakkan harmoni warna asas, corak garisan, dan imaginasi seni."
   }
   ```

### 4. Component Integration Impact

#### A. Three.js Cartography Scene (`planet-cartography-scene.ts`)
In `getPlanetTexturePath(planet: Planet)`:
Update switch cases to support both canonical and legacy IDs:
```typescript
    case 'jupiter-sains':
    case 'jupiter-astronomy':
      return '/images/planets/jupiter.jpg';
    case 'saturn-sejarah':
    case 'saturn-astronomy':
      return '/images/planets/saturn.jpg';
    case 'uranus-rbt':
    case 'uranus-astronomy':
      return ''; // Procedural atmosphere
    case 'neptune-psv':
    case 'neptune-astronomy':
      return '/images/planets/neptune.jpg';
```

#### B. Three.js Solar System Scene (`solar-system-scene.ts`)
1. In `primaryConfigs`:
   Update IDs to canonical:
   ```typescript
   { id: 'jupiter-sains', radius: 1.45, dist: 26.5, tex: 'jupiter.jpg', speed: 0.11 },
   { id: 'saturn-sejarah', radius: 1.25, dist: 33.0, tex: 'saturn.jpg', speed: 0.08 },
   { id: 'uranus-rbt', radius: 0.95, dist: 39.5, tex: '', speed: 0.06 },
   { id: 'neptune-psv', radius: 0.90, dist: 46.0, tex: 'neptune.jpg', speed: 0.05 },
   ```
2. In Saturn ring logic:
   Support `cfg.id === 'saturn-sejarah' || cfg.id === 'saturn-astronomy'`.
   Name the ring `ring-saturn` or keep both `ring-saturn-sejarah` and backward-compatible alias.

#### C. Planetary HUD (`planetary-hud.tsx`)
In `planetary-hud.tsx:168` [VERIFIED: src/components/kids/planets/planetary-hud.tsx:168]:
Currently:
```typescript
{planet.subjectId === 'astronomy' ? (
  <div data-testid="coming-soon-card" ...>
```
With the subject IDs changing to `"sains"`, `"sejarah"`, `"rbt"`, `"psv"`, but `features: []` still empty until Phase 25:
The HUD must check if the planet is an outer planet or has no features:
```typescript
{planet.features.length === 0 ? (
  <div data-testid="coming-soon-card" ...>
```
OR
```typescript
{planet.subjectId === 'astronomy' || ['sains', 'sejarah', 'rbt', 'psv'].includes(planet.subjectId) && planet.features.length === 0 ? (
  <div data-testid="coming-soon-card" ...>
```
*Crucial insight:* In `planetary-hud.test.tsx:306-322` [VERIFIED: src/components/kids/planets/planetary-hud.test.tsx:306-322], there is a specific test:
`it('renders Coming Soon card for outer worlds with zero features')`.
If the condition only checked `planet.subjectId === 'astronomy'`, changing `jupiter`'s subject to `"sains"` would break this test and display `empty-feature-card` instead of `coming-soon-card`!
Therefore, the HUD condition should check `planet.features.length === 0` (or `planet.subjectId === 'astronomy' || planet.features.length === 0`) so that until Phase 25 populates features, outer worlds continue rendering the informative Coming Soon card without regression.

## Test Suite Coverage & Verification Matrix

The test suite consists of 32 test files and 354 tests, running in ~43 seconds via Vitest [VERIFIED: test run task-52].
Specific tests directly impacted by Phase 24:

### 1. `src/__tests__/kids/planets.test.ts`
- **Line 234-244:**
  Currently checks `expect(ids).toContain('jupiter-astronomy')`, etc.
  Update to check canonical IDs (`'jupiter-sains'`, `'saturn-sejarah'`, `'uranus-rbt'`, `'neptune-psv'`).
- **Line 266-273:**
  Currently filters by `subjectId !== 'astronomy'` and `subjectId === 'astronomy'`.
  Update to check:
  - 5 inner worlds have `features.length === 7`.
  - 4 outer worlds have `features.length === 0` (and have subjectIds `"sains"`, `"sejarah"`, `"rbt"`, `"psv"`).
- **Line 18-54:**
  Add assertions for the 4 outer worlds in the subject mapping test (`jupiter-sains` -> `sains`, etc.).

### 2. `src/__tests__/kids/planets-i18n.test.ts`
- **Line 98-108:**
  Currently expects `expectedWorldIds: PlanetId[]` to contain `*-astronomy`.
  Update to expect canonical IDs (`jupiter-sains`, etc.) or verify both sets of keys if legacy keys are retained.
- **Line 139-154:**
  Add authentic Malay body names test assertions for `jupiter-sains` ("Musytari"), `saturn-sejarah` ("Zuhal"), `uranus-rbt` ("Uranus"), and `neptune-psv` ("Neptun").

### 3. `src/__tests__/kids/planetary-hud.test.tsx`
- **Line 306:**
  `const jupiter = PLANET_WORLDS.find((w) => w.id === 'jupiter-sains') || PLANET_WORLDS.find((w) => w.id === 'jupiter-astronomy')!;`
  Update to look up `jupiter-sains`.
  Ensure `coming-soon-card` continues rendering as tested.

### 4. `src/__tests__/kids/solar-system-scene.test.ts`
- **Line 22-25:**
  Checks `planetIds` contains `jupiter-astronomy`, `saturn-astronomy`, `uranus-astronomy`, `neptune-astronomy`.
  Update to `jupiter-sains`, `saturn-sejarah`, `uranus-rbt`, `neptune-psv`.
- **Line 28-31:**
  Checks `saturn-astronomy` mesh and `ring-saturn-astronomy` or `ring-saturn-sejarah`.
  Update to `saturn-sejarah`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Custom i18n resolution logic | Custom key parser or fallback dictionary | `useTranslations('kids.planets')` via `next-intl` | `next-intl` handles locale switching, caching, SSR hydration, and parameter interpolation automatically. |
| Custom 3D Coordinate transformations | Hardcoded (x,y,z) coordinate arrays for planets | `latLonToVector3()` in `src/lib/kids/planets.ts` | Tested, robust spherical-to-cartesian projection adhering to Three.js Y-up convention. |
| Ad-hoc Planet ID lookups | Custom search loops in individual UI components | `getPlanetWorld()` with alias normalization | Centralizes backward compatibility and fallback handling in one verified function. |

## Common Pitfalls & Edge Cases

### Pitfall 1: Breaking `planetary-hud.tsx` Coming Soon Display
**What goes wrong:** In `planetary-hud.tsx`, the Coming Soon card is currently guarded by `if (planet.subjectId === 'astronomy')`. When Jupiter's `subjectId` is changed to `"sains"`, the card would fall through to the empty feature branch (`empty-feature-card`), displaying "Belum ada kawasan di sini" instead of "Coming Soon: Exciting new curriculum worlds will arrive in future updates!".
**Why it happens:** The previous code coupled the "Coming Soon" state to the placeholder subject `"astronomy"` rather than `features.length === 0`.
**How to avoid:** Update the condition in `planetary-hud.tsx:168` to check `planet.features.length === 0` (or `planet.subjectId === 'astronomy' || planet.features.length === 0`).
**Warning signs:** `src/__tests__/kids/planetary-hud.test.tsx` fails at line 318 (`expected coming-soon-card to be in document`).

### Pitfall 2: Breaking Three.js Orbit Raycasting & Selection
**What goes wrong:** Clicking on Jupiter in the 3D Solar System overview fails to select it or throws an error.
**Why it happens:** `solar-system-scene.ts` sets `pMesh.userData = { planetId: cfg.id }`. If `primaryConfigs` has `jupiter-sains` but `planetary-explorer.tsx` or route handlers expect `jupiter-astronomy` (or vice versa), raycasting returns an ID that fails lookup in `getPlanetWorld()`.
**How to avoid:**
1. Update `solar-system-scene.ts` config to `jupiter-sains`, etc.
2. Ensure `getPlanetWorld()` normalizes legacy IDs (`normalizePlanetId`).
3. Keep `getPlanetTexturePath()` handling both old and new IDs.

### Pitfall 3: i18n Key Discrepancy between EN and MS Dictionaries
**What goes wrong:** `src/__tests__/kids/planets-i18n.test.ts` fails key symmetry check (`expect(Object.keys(enWorlds).sort()).toEqual(Object.keys(msWorlds).sort())`).
**Why it happens:** Adding a key in `en.json` but omitting or misspelling it in `ms.json`, or having different keys between the two dictionaries.
**How to avoid:** Run `npm test planets-i18n.test.ts` immediately after editing dictionary files; maintain exact key parity.

### Pitfall 4: Malay Vocabulary Violations (`npm run check:vocab`)
**What goes wrong:** The build or verify script fails due to unapproved English terms in Malay content.
**Why it happens:** While `check:vocab` primarily targets `.mdx` files in `src/content/kids/ms/`, adding untranslated English strings into `messages/ms.json` or `PLANET_WORLDS.taglineMs` violates the bilingual requirements of `SUBJ-02`.
**How to avoid:** Use authentic Malay terms verified in `CONTEXT.md`:
- Jupiter: "Musytari: Sains & Penerokaan Saintifik"
- Saturn: "Zuhal: Sejarah & Garis Masa"
- Uranus: "Uranus: Reka Bentuk & Teknologi"
- Neptune: "Neptun: Pendidikan Seni Visual"

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Runtime | ✓ | v20.x | — |
| npm | Package Manager | ✓ | v10.x | — |
| Vitest | Test Suite | ✓ | 2.1.9 | — |
| Three.js | 3D Rendering | ✓ | 0.174.0 | — |

**Missing dependencies:** None.

## Validation Architecture

Nyquist validation is enabled (`.planning/config.json`).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 2.1.9 |
| Config file | `vitest.config.ts` [VERIFIED: vitest.config.ts] |
| Quick run command | `npx vitest run src/__tests__/kids/planets.test.ts src/__tests__/kids/planets-i18n.test.ts` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| `SUBJ-01` | Outer planets mapped to KSSR subjects (`sains`, `sejarah`, `rbt`, `psv`) with valid themes and colors in `PLANET_WORLDS` | Unit | `npx vitest run src/__tests__/kids/planets.test.ts` | ✅ (needs update for new IDs) |
| `SUBJ-01` | Three.js Solar System scene renders outer planet meshes with new IDs and Saturn ring intact | Unit / Integration | `npx vitest run src/__tests__/kids/solar-system-scene.test.ts` | ✅ (needs update for new IDs) |
| `SUBJ-01` | Planetary HUD renders Coming Soon telemetry for outer worlds with zero features | Unit / Component | `npx vitest run src/__tests__/kids/planetary-hud.test.tsx` | ✅ (needs update for `jupiter-sains`) |
| `SUBJ-02` | Bilingual translation strings populated symmetrically in `en.json` and `ms.json` for outer worlds | Unit | `npx vitest run src/__tests__/kids/planets-i18n.test.ts` | ✅ (needs update for new IDs) |
| Zero-Reg | Full test suite passes without regressions | Regression | `npm test` | ✅ |

### Wave 0 Gaps
None. Test infrastructure already exists and covers 100% of the modified domains. Test files need assertion updates to match the new canonical IDs and subject mappings.

## Security Domain

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | Yes | `normalizePlanetId()` clamps/normalizes string inputs before indexing or lookup; `resolveMissionRoute()` uses strict hardcoded switch without user-supplied paths. |
| Content Security / Static Safety | Yes | All planetary data is static JSON/TS objects; no external network requests or dynamic script evaluations. |

## Sources

### Primary (HIGH confidence)
- `src/lib/kids/planets.ts` - Planetary data schema and `PLANET_WORLDS` definitions.
- `messages/en.json` & `messages/ms.json` - i18n dictionaries for planetary worlds.
- `src/components/kids/planets/planet-cartography-scene.ts` & `solar-system-scene.ts` - Three.js scene implementations.
- `src/components/kids/planets/planetary-hud.tsx` - Glassmorphic HUD overlay.
- `src/__tests__/kids/planets.test.ts`, `planets-i18n.test.ts`, `planetary-hud.test.tsx`, `solar-system-scene.test.ts` - Vitest test specifications.
- `.planning/phases/24-outer-planets-subject-architecture-telemetry/24-CONTEXT.md` - Phase 24 locked decisions and user specifications.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified in `package.json` and active Vitest runs.
- Architecture: HIGH - Fully inspected source files and verified runtime behavior.
- Pitfalls: HIGH - Identified specific test assertions and conditional branches that would fail without care.

**Research date:** 2026-11-19
**Valid until:** Stable across Milestone v1.5
