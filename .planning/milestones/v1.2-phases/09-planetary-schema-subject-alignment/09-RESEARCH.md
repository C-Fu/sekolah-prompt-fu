# Phase 09: Planetary Schema & Subject Alignment - Research

**Researched:** 2026-11-08  
**Domain:** Planetary Cartography, Subject Alignment, TypeScript Schema, Bilingual Content Architecture, Route Boundaries  
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Dedicated 1-to-1 planetary subject mapping:
  - **Earth (Bumi)**: Foundational Prompting / Core 19 Lessons (`earth-prompting`)
  - **Moon (Bulan)**: Bahasa Melayu (`moon-bm`)
  - **Mars (Marikh)**: English Language (`mars-english`)
  - **Venus (Zuhrah)**: Matematik (`venus-matematik`)
  - **Mercury (Utarid)**: Pendidikan Moral (`mercury-moral`) — *Costly reversibility: touches curriculum mapping and lesson paths.*
- **D-02:** Authentic geological palette and celestial metadata per planet:
  - Moon: Slate/silver basalt crust (`#94A3B8`, accent `#38BDF8`)
  - Earth: Verdant blue-marble/atmosphere (`#10B981`, accent `#3B82F6`)
  - Mars: Rust/iron oxide red-orange (`#EF4444`, accent `#F97316`)
  - Venus: Sulfur amber & golden shroud (`#F59E0B`, accent `#FBBF24`)
  - Mercury: Caloris crater basalt & dark charcoal (`#64748B`, accent `#A855F7`)
- **D-03:** Each planet contains exactly 7 distinct geological features (drawn from `planets_mockup/planets_features_descriptions.md`):
  - Features 1 to 6 correspond directly to **Tahun 1 through Tahun 6**.
  - Feature 7 is designated as **Capstone Boss / Mastery Arena ("Cabaran Unggul")** requiring combining skills from all years.
- **D-04:** Minimum of 7 interactive stages (`<Section>`) per lesson unit (e.g. intro story, concept demo, 4 progressive prompt challenges, final mastery check).
- **D-05:** Rich Hybrid Information Model:
  - Blends authentic planetary cartography (real geological names, coordinates, and physical properties) with KSSR/KBAT prompt learning objectives and curriculum badges.
  - Fully localized in Bahasa Melayu (`ms`) and English (`en`) without silent English fallback.
- **D-06:** Dedicated Planet-Scoped URL Structure:
  - `/planets` — 3D Solar System Hub (overview of all planets).
  - `/planets/[planetId]` — 3D Cartographic inspection and feature picker (7 regions for Tahun 1-6 + Boss).
  - `/planets/[planetId]/[featureId]` — Specific lesson stage/experience (or linking into `/level/[slug]` while preserving planet context).

### Builder Discretion
- Specific coordinate mappings (lat/lon and 3D spherical vectors) and Three.js camera target vectors for each feature hotspot (fine-tuned directly from `planets_mockup/*.html`).
- Exact naming of KSSR learning badges and star rewards per stage.

### Deferred Ideas (OUT OF SCOPE)
- Science as a standalone planet (Science is currently represented on Earth/shared; Mercury is locked as Moral).
- Multiplayer co-op prompt battles across planets.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **SCHEMA-01** | Update `src/lib/kids/planets.ts` and data structures to reflect user-defined subject mappings (Earth=Prompting, Moon=BM, Mars=English, Venus=Matematik, Mercury=Moral). | Defines refined `SubjectId`, `Planet`, and `PLANET_WORLDS` constant in `src/lib/kids/planets.ts` with complete metadata. |
| **SCHEMA-02** | Ensure all planets define 7 distinct geological features/regions (from `planets_mockup/planets_features_descriptions.md`) mapped to Tahun 1 to Tahun 6 (with feature 7 as mastery/final boss). | Catalogs all 35 features (5 planets × 7 features) with geological descriptions, KSSR year mapping, and coordinates. |
| **SCHEMA-03** | Full bilingual support (`en` and `ms`) for planet names, descriptions, and feature details. | Specifies dictionary entries for `messages/en.json` and `messages/ms.json` plus inline bilingual string pairs. |
</phase_requirements>

---

## Summary

Phase 09 establishes the single source of truth for the planetary schema, celestial cartography, and KSSR subject alignment in Sekolah Prompt-Fu. In Milestone v1.1, `src/lib/kids/planets.ts` was introduced as an exploratory prototype with 5 worlds (Moon: BM, Earth: Sains, Mars: Matematik, Venus: English, Mercury: Moral) containing 6 features each without coordinate geometries. In Milestone v1.2, this is upgraded to a robust cartographic schema matching locked user decisions:
1. **Earth** is refactored from `earth-sains` to `earth-prompting` (Foundational Prompting, anchoring the 19 core lessons).
2. **Mars** becomes `mars-english` (English Language).
3. **Venus** becomes `venus-matematik` (Matematik).
4. **Mercury** becomes `mercury-moral` (Pendidikan Moral).
5. **Moon** remains `moon-bm` (Bahasa Melayu).

Every planet contains **exactly 7 distinct geological features** extracted directly from `planets_mockup/planets_features_descriptions.md` and cartography prototypes (`earth_cartography.html`, `mars_cartography.html`, `venusian_cartography.html`, and `lunar_geological_cartography.html`). Features 1–6 align with primary education **Tahun 1 through Tahun 6**, and Feature 7 is crowned as the **Capstone Boss Arena ("Cabaran Unggul")** requiring comprehensive prompt mastery.

Crucially, this phase is strictly a **data architecture, typing, and content alignment phase**. It updates `src/lib/kids/planets.ts` and bilingual messages (`messages/en.json`, `messages/ms.json`) while preserving backwards compatibility for existing `/level/[slug]` routes and the static build pipeline (`npm run verify`, `scripts/check-kids-import-closure.js`, `scripts/check-ms-vocabulary.js`).

**Primary recommendation:** Formalize `PlanetFeature` with coordinates (`lat`, `lon`, `radiusDeg`, and 3D spherical vector generator `vector3`), KSSR metadata (`year: 1..6`, `isFinalBoss: boolean`, `badge: string`, `badgeMs: string`), and comprehensive bilingual descriptions in `src/lib/kids/planets.ts`. Provide mirror keys under `kids.planets` in `messages/en.json` and `messages/ms.json`. Keep `src/lib/kids/levels.ts` intact until new level MDX files are authored in Phase 12.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Planetary Data & Schema (`src/lib/kids/planets.ts`) | Shared Core Library (`src/lib/kids`) | Client App / 3D Viewer | Universal source of truth for planet IDs, colors, features, coordinates, and KSSR metadata. |
| Bilingual Translations (`messages/*.json`) | Internationalization Layer (`next-intl`) | Static Build Crawler | Ensures user-facing text is localized without missing keys or English residue. |
| Route Slugs & Static Export (`src/lib/kids/levels.ts`) | Static Build Generation (`src/app`) | Navigation Components | Manages `generateStaticParams` for Next.js client-side SSG export to GitHub Pages. |
| 3D Coordinates & Camera Vectors | Math / Cartographic Utilities | Three.js Viewport (Phase 10) | Spherical math transforms `(lat, lon)` into Three.js normalized vectors `(x, y, z)`. |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | `^5.0.0` [VERIFIED: package.json:52] | Schema definition & static type safety | Guarantees compile-time validation for 35 features, subject enums, and coordinates. |
| next-intl | `^4.5.8` [VERIFIED: package.json:28] | Bilingual i18n dictionary support | Standard in-repo framework for server and client translations (`messages/en.json`, `messages/ms.json`). |
| Next.js | `^16.0.10` [VERIFIED: package.json:27] | Static export SSG crawler (`output: 'export'`) | Zero-SSR architecture deploying cleanly to static hosting. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | `^2.1.9` [VERIFIED: package.json:53] | Unit & regression testing | Run tests on schema getters, coordinate bounds, and dictionary completeness. |
| Lucide React | `^0.556.0` [VERIFIED: package.json:26] | UI Icons | Subject and planetary badge iconography. |

---

## 1. Data Models & TypeScript Schema (`src/lib/kids/planets.ts`)

### 1.1 Refined Types & Interfaces

```typescript
/**
 * Planetary Subject Worlds & Cartographic Schema for Sekolah Prompt-Fu
 * Source: .planning/phases/09-planetary-schema-subject-alignment/09-CONTEXT.md
 */

export type SubjectId = "prompting" | "bm" | "english" | "matematik" | "moral";

export type PlanetId =
  | "earth-prompting"
  | "moon-bm"
  | "mars-english"
  | "venus-matematik"
  | "mercury-moral";

export interface GeoCoordinates {
  lat: number;          // Latitude in degrees [-90..90]
  lon: number;          // Longitude in degrees [-180..180]
  radiusDeg?: number;   // Visual boundary radius in degrees on the sphere surface
  elevation?: string;   // Authentic geological elevation/depth description
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface PlanetFeature {
  id: string;               // URL-friendly unique slug (e.g. 'oceanus-procellarum')
  featureNumber: number;    // 1 to 7
  year: number;             // 1 to 6 (Features 1-6 map to Tahun 1-6; Feature 7 maps to Tahun 6 Mastery)
  isFinalBoss: boolean;     // true ONLY for Feature 7 ("Cabaran Unggul")
  
  // Names
  name: string;             // English / International geological name
  nameMs: string;           // Bahasa Melayu geological name
  
  // Cartography & Coordinates
  coordinates: GeoCoordinates;
  
  // Pedagogical & Thematic Details
  badge: string;            // English KSSR skill badge (e.g. 'Foundational Vocabulary')
  badgeMs: string;          // Malay KSSR skill badge (e.g. 'Kosa Kata Asas')
  description: string;      // English narrative & prompt learning focus
  descriptionMs: string;    // Malay narrative & prompt learning focus
  geologicalProfile: string;   // English authentic planetary geological summary
  geologicalProfileMs: string; // Malay authentic planetary geological summary
  
  // Visual Theme
  accentColor?: string;     // Feature-specific neon hotspot glow
}

export interface Planet {
  id: PlanetId;
  order: number;            // 1 to 5 display sequence (Sun -> Mercury -> Venus -> Earth -> Moon -> Mars)
  celestialBody: string;    // 'Earth' | 'Moon' | 'Mars' | 'Venus' | 'Mercury'
  celestialBodyMs: string;  // 'Bumi' | 'Bulan' | 'Marikh' | 'Zuhrah' | 'Utarid'
  subjectId: SubjectId;
  subjectTitle: string;     // 'Foundational Prompting' | 'Bahasa Melayu' | etc.
  subjectTitleMs: string;   // 'Asas Prompting' | 'Bahasa Melayu' | etc.
  
  // Visual Aesthetics
  themeColor: string;       // Primary surface color hex
  accentColor: string;      // Glowing aura / UI accent hex
  textureType: "procedural" | "shader"; // Ready for Phase 10 Three.js rendering
  
  // Celestial & Orbital Telemetry
  tagline: string;
  taglineMs: string;
  orbitalPeriodDays?: number;
  diameterKm?: number;
  
  // The 7 Distinct Geological Features
  features: PlanetFeature[];
}
```

### 1.2 Mathematical Coordinate Conversion Helper
Converting `(lat, lon)` on a sphere of radius $R$ into Three.js Cartesian `(x, y, z)`:

```typescript
/**
 * Converts standard spherical coordinates (latitude, longitude in degrees)
 * into a Three.js Cartesian Vector3 (Y-up convention).
 * Standard: lat [-90..90], lon [-180..180].
 */
export function latLonToVector3(lat: number, lon: number, radius: number = 1.0): Vector3D {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}
```

---

## 2. Planetary Inventory & The 35 Geological Features

Below is the verified cartographic mapping for all 5 planets and their 7 geological features, mapped to Tahun 1–6 and Capstone Boss (`planets_mockup/planets_features_descriptions.md` [VERIFIED: lines 1-165]):

### 2.1 Earth (Bumi) — Foundational Prompting (`earth-prompting`)
*Theme Color:* `#10B981` (Verdant Green), *Accent:* `#3B82F6` (Atmospheric Sky Blue)  
*Subject:* Foundational Prompting (Connecting to the 19 core lessons across 7 continental terranes)

| Feature | Feature Slug | Name (EN) | Name (MS) | Lat, Lon | Year | Role |
|---------|--------------|-----------|-----------|----------|------|------|
| 1 | `africa-cradle` | Africa (The Rift Cradle) | Afrika (Lembah Rekahan) | 2.0, 21.0 | 1 | Tahun 1: Clarity & Simple Instructions |
| 2 | `asia-himalayas` | Asia (Himalayan Crown) | Asia (Kemuncak Himalaya) | 34.0, 95.0 | 2 | Tahun 2: Who, What, When & Where Details |
| 3 | `europe-peninsula` | Europe (Peninsula of Knowledge) | Eropah (Semenanjung Ilmu) | 53.0, 18.0 | 3 | Tahun 3: Context & Tone Setting |
| 4 | `north-america-canyons` | North America (Great Basin & Plains) | Amerika Utara (Lembah & Dataran) | 44.0, -100.0 | 4 | Tahun 4: Role-play & Persona Prompts |
| 5 | `south-america-amazon` | South America (Amazonia & Andes) | Amerika Selatan (Amazonia & Andes) | -14.0, -58.0 | 5 | Tahun 5: Multi-Step Reasoning & Formatting |
| 6 | `oceania-archipelago` | Australia & Oceania (Great Barrier Reef) | Oceania & Australia (Terumbu Karang) | -24.0, 134.0 | 6 | Tahun 6: Evaluation, Iteration & Edge Cases |
| 7 | `antarctica-apex` | Antarctica (The Polar Ice Cap) | Antartika (Kutub Ais Abadi) | -82.0, 0.0 | 6 | **Cabaran Unggul (Capstone Boss): Master Prompting Arena** |

### 2.2 Moon (Bulan) — Bahasa Melayu (`moon-bm`)
*Theme Color:* `#94A3B8` (Slate Silver), *Accent:* `#38BDF8` (Cyan/Sky Glow)  
*Subject:* Bahasa Melayu (Tatabahasa, Bina Ayat, Pemahaman, Karangan, Peribahasa)

| Feature | Feature Slug | Name (EN) | Name (MS) | Lat, Lon | Year | Role |
|---------|--------------|-----------|-----------|----------|------|------|
| 1 | `oceanus-procellarum` | Oceanus Procellarum | Lautan Procellarum | 10.0, -50.0 | 1 | Tahun 1: Kata Nama & Kata Kerja Asas |
| 2 | `imbrium-basin` | The Imbrium Basin | Lembah Imbrium | 35.0, -15.0 | 2 | Tahun 2: Kata Adjektif & Kembangan Ayat |
| 3 | `eastern-maria` | Eastern Maria (Tranquility Cluster) | Laut Ketenangan (Maria Timur) | 10.0, 30.0 | 3 | Tahun 3: Soalan Pemahaman & Imbuhan |
| 4 | `near-side-highlands` | Near-Side Southern Highlands | Tanah Tinggi Sisi Dekat | -40.0, 0.0 | 4 | Tahun 4: Format Surat & Dialog Temubual |
| 5 | `far-side-highlands` | Far-Side Highlands | Tanah Tinggi Sisi Jauh | 0.0, 180.0 | 5 | Tahun 5: Karangan Kreatif, Peribahasa & Puisi |
| 6 | `near-side-north-highlands` | Near-Side Northern Highlands | Tanah Tinggi Utara Sisi Dekat | 60.0, 0.0 | 6 | Tahun 6: Ulasan Kritis & Wacana Tatabahasa |
| 7 | `south-pole-aitken` | South Pole-Aitken Basin | Lembangan Kutub Selatan-Aitken | -50.0, 180.0 | 6 | **Cabaran Unggul (Capstone Boss): Karangan Lengkap & KBAT** |

### 2.3 Mars (Marikh) — English Language (`mars-english`)
*Theme Color:* `#EF4444` (Rust Red), *Accent:* `#F97316` (Vibrant Orange)  
*Subject:* English Language (Phonics, Vocabulary, Grammar, Creative Writing, Speech)

| Feature | Feature Slug | Name (EN) | Name (MS) | Lat, Lon | Year | Role |
|---------|--------------|-----------|-----------|----------|------|------|
| 1 | `elysium-planitia` | Elysium Planitia | Dataran Elysium | 25.0, 147.0 | 1 | Tahun 1: Phonics, Greetings & Classroom Objects |
| 2 | `valles-marineris` | Valles Marineris | Lembah Marineris | -14.0, -70.0 | 2 | Tahun 2: Daily Routines & Simple Storytelling |
| 3 | `syrtis-major` | Syrtis Major Planum | Dataran Syrtis Major | 9.9, 70.0 | 3 | Tahun 3: Question Words, Weather & Animals |
| 4 | `hellas-planitia` | Hellas Planitia Basin | Lembangan Hellas Planitia | -42.5, 70.0 | 4 | Tahun 4: Past & Future Tenses, Role-play Dialogues |
| 5 | `tharsis-rise` | Tharsis Volcanic Plateau | Dataran Tinggi Tharsis | 0.0, -110.0 | 5 | Tahun 5: Environmental Prompts & Persuasive Speeches |
| 6 | `arabia-terra` | Arabia Terra Highlands | Tanah Tinggi Arabia Terra | 20.0, 30.0 | 6 | Tahun 6: Figurative Language, Idioms & Debates |
| 7 | `olympus-mons` | Olympus Mons | Gunung Olympus Mons | 18.65, -133.8 | 6 | **Cabaran Unggul (Capstone Boss): Advanced Essay & Dialogue Scripting** |

### 2.4 Venus (Zuhrah) — Matematik (`venus-matematik`)
*Theme Color:* `#F59E0B` (Sulfur Amber), *Accent:* `#FBBF24` (Golden Shroud)  
*Subject:* Matematik (Nombor, Operasi Asas, Pecahan, Wang, Sukatan, Geometri, Data)

| Feature | Feature Slug | Name (EN) | Name (MS) | Lat, Lon | Year | Role |
|---------|--------------|-----------|-----------|----------|------|------|
| 1 | `sedna-planitia` | Sedna Planitia | Dataran Sedna | 40.0, -20.0 | 1 | Tahun 1: Nombor hingga 100 & Tambah/Tolak Asas |
| 2 | `atalanta-planitia` | Atalanta Planitia | Dataran Atalanta | 56.0, 165.0 | 2 | Tahun 2: Darab, Bahagi & Pecahan Wajar |
| 3 | `aphrodite-terra` | Aphrodite Terra | Aphrodite Terra | -6.0, 110.0 | 3 | Tahun 3: Wang hingga RM10,000 & Masa/Waktu |
| 4 | `beta-regio` | Beta Regio | Beta Regio | 25.3, -78.0 | 4 | Tahun 4: Perpuluhan, Peratusan & Ruang Sudut |
| 5 | `lada-terra` | Lada Terra | Lada Terra | -62.0, 20.0 | 5 | Tahun 5: Operasi Bergabung, Nisbah & Koordinat |
| 6 | `ishtar-terra` | Ishtar Terra (Lakshmi Planum) | Ishtar Terra | 70.0, 25.0 | 6 | Tahun 6: Kebarangkalian, Carta Pai & Celik Kewangan |
| 7 | `maxwell-montes` | Maxwell Montes | Pergunungan Maxwell | 65.2, 3.3 | 6 | **Cabaran Unggul (Capstone Boss): Penyelesaian Masalah KBAT Matematik** |

*(Note: In Venusian cartography, Maxwell Montes sits atop Ishtar Terra at 65.2°N, 3.3°E and is the highest mountain on Venus, perfectly suited for the Capstone Boss!)*

### 2.5 Mercury (Utarid) — Pendidikan Moral (`mercury-moral`)
*Theme Color:* `#64748B` (Charcoal Basalt), *Accent:* `#A855F7` (Electric Violet Glow)  
*Subject:* Pendidikan Moral (Nilai Universal, Kekeluargaan, Tanggungjawab Sivik, Integriti)

| Feature | Feature Slug | Name (EN) | Name (MS) | Lat, Lon | Year | Role |
|---------|--------------|-----------|-----------|----------|------|------|
| 1 | `borealis-planitia` | Borealis Planitia | Dataran Borealis | 73.0, -80.0 | 1 | Tahun 1: Kasih Sayang & Menghormati Rakan |
| 2 | `rembrandt-basin` | Rembrandt Basin | Lembah Rembrandt | -33.2, 88.2 | 2 | Tahun 2: Tanggungjawab Diri & Keharmonian Keluarga |
| 3 | `beethoven-basin` | Beethoven Basin | Lembah Beethoven | -20.8, -123.6 | 3 | Tahun 3: Kebersihan Komuniti & Sayangi Sekolah |
| 4 | `rachmaninoff-basin` | Rachmaninoff Basin | Lembah Rachmaninoff | 27.6, 57.6 | 4 | Tahun 4: Menghargai Jiran & Kepelbagaian Budaya |
| 5 | `raditladi-basin` | Raditladi Basin | Lembah Raditladi | 27.3, 119.1 | 5 | Tahun 5: Keberanian Menolak Kezaliman & Etika Digital |
| 6 | `antipodal-weird-terrain` | The Antipodal Chaotic Terrain | Bentuk Muka Bumi Antipodal | -30.0, 20.0 | 6 | Tahun 6: Toleransi, Perpaduan Nasional & Semangat Patriotik |
| 7 | `caloris-planitia` | Caloris Planitia (Caloris Basin) | Lembangan Caloris | 30.5, -160.2 | 6 | **Cabaran Unggul (Capstone Boss): Kepimpinan Sivik & Integriti Unggul** |

---

## 3. Bilingual Translation Dictionary (`messages/en.json` & `messages/ms.json`)

To support the 3D explorer and cartographic cards in Phase 10 without cluttering the client bundle, UI keys and planetary labels are added under `kids.planets`:

### 3.1 Proposed Structure for `messages/en.json`
```json
{
  "kids": {
    "planets": {
      "title": "Solar System Explorer",
      "subtitle": "Select a celestial world to explore subjects and geological features!",
      "hubTitle": "Planetary System",
      "explorePlanet": "Inspect Planet",
      "viewCartography": "Geological Cartography",
      "yearBadge": "Tahun {year}",
      "capstoneBadge": "Capstone Boss",
      "backToOrbit": "Return to Orbit",
      "launchMission": "Start Mission",
      "lockedFeature": "Unlock prior Year features to enter",
      "telemetry": {
        "coordinates": "Coordinates",
        "elevation": "Elevation / Depth",
        "geology": "Geological Profile",
        "objective": "Learning Objective"
      },
      "worlds": {
        "earth-prompting": {
          "title": "Earth: Foundational Prompting",
          "tagline": "The cradle of intelligence and prompt crafting mastery."
        },
        "moon-bm": {
          "title": "Moon: Bahasa Melayu",
          "tagline": "Ancient volcanic maria inspiring eloquence and rich Malay prose."
        },
        "mars-english": {
          "title": "Mars: English Language",
          "tagline": "Vast canyons and soaring volcanoes fueling bold English expression."
        },
        "venus-matematik": {
          "title": "Venus: Mathematics",
          "tagline": "Golden clouds concealing geometric order and numerical logic."
        },
        "mercury-moral": {
          "title": "Mercury: Moral Education",
          "tagline": "Sun-scorched basalt craters forged in integrity, empathy, and courage."
        }
      }
    }
  }
}
```

### 3.2 Corresponding Structure for `messages/ms.json`
```json
{
  "kids": {
    "planets": {
      "title": "Peneroka Sistem Suria",
      "subtitle": "Pilih dunia cakerawala untuk meneroka subjek dan bentuk muka bumi!",
      "hubTitle": "Sistem Planet",
      "explorePlanet": "Periksa Planet",
      "viewCartography": "Kartografi Geologi",
      "yearBadge": "Tahun {year}",
      "capstoneBadge": "Cabaran Unggul",
      "backToOrbit": "Kembali ke Orbit",
      "launchMission": "Mula Misi",
      "lockedFeature": "Selesaikan tahap Tahun sebelumnya untuk buka",
      "telemetry": {
        "coordinates": "Koordinat",
        "elevation": "Ketinggian / Kedalaman",
        "geology": "Profil Geologi",
        "objective": "Objektif Pembelajaran"
      },
      "worlds": {
        "earth-prompting": {
          "title": "Bumi: Asas Prompting",
          "tagline": "Pusat kecerdasan dan penguasaan teknik binaan arahan AI."
        },
        "moon-bm": {
          "title": "Bulan: Bahasa Melayu",
          "tagline": "Lautan lava purba menyemarakkan keindahan bahasa dan sastera Melayu."
        },
        "mars-english": {
          "title": "Marikh: Bahasa Inggeris",
          "tagline": "Lembah raksasa membina keyakinan bertutur dan berkarya dalam bahasa Inggeris."
        },
        "venus-matematik": {
          "title": "Zuhrah: Matematik",
          "tagline": "Kabut keemasan merungkai ketertiban logik dan kejituan nombor."
        },
        "mercury-moral": {
          "title": "Utarid: Pendidikan Moral",
          "tagline": "Kawah basalt membina keteguhan integriti, empati dan keperibadian mulia."
        }
      }
    }
  }
}
```

---

## 4. Impact Analysis on Existing Routes & Verification Guards

### 4.1 Relationship to `src/lib/kids/levels.ts`
- **Current State:** `src/lib/kids/levels.ts` defines 24 levels across 10 worlds (Worlds 1–5: 19 core prompting lessons; Worlds 6–10: 5 initial subject pilot lessons).
- **Static Route Generation:** `src/app/level/[slug]/page.tsx` calls `generateStaticParams()` directly from `getAllLevels()`. There are 24 slugs generated.
- **Verification Tests:** `src/__tests__/scripts/verify-project.test.ts` and `src/__tests__/kids/level-locale.test.tsx` strictly assert that exactly 24 slugs are registered in `levels.ts` and present in `src/content/kids/en` and `src/content/kids/ms`.
- **Architectural Decision:** **Do NOT delete or rename existing level slugs in `levels.ts` during Phase 09.**
  - Phase 09 focuses exclusively on `src/lib/kids/planets.ts` and messages.
  - In `levels.ts`, worlds 6–10 can be annotated with their respective `planetId` (`earth-prompting`, `moon-bm`, `mars-english`, `venus-matematik`, `mercury-moral`).
  - Full addition of new subject lesson MDX files will occur in Phase 12 (Curriculum & Lesson Authoring). Keeping `levels.ts` compatible avoids breaking the 24-slug static build certification now.

### 4.2 Script Guards
1. **`scripts/check-kids-import-closure.js`**: Checks that every repo-local module imported from entry points exists on disk, and verifies English MDX slugs.
   - *Risk:* Zero risk if `planets.ts` does not introduce dangling imports.
2. **`scripts/check-ms-vocabulary.js`**: Scans all `src/content/kids/ms/*.mdx` files for banned words (`bodil`, `bedtime`, `superhero`, bare `level`).
   - *Risk:* Does NOT scan `planets.ts` or `messages/ms.json` (`check-ms-vocabulary.js` line 19-21 explicitly targets MDX only). However, ensure all Malay text uses authentic terminology (`tahap` instead of `level`, `cabaran` instead of `challenge`).
3. **`scripts/check-translations.js`**: Checks for missing keys across all locale files in `messages/*.json`.
   - *Note:* In `package.json`, `npm run verify` runs `tsc`, `vitest`, and checks static output. It does not run `check-translations.js` because non-en/ms translations have missing keys from earlier phases. However, to keep `en` and `ms` perfectly synchronized, every key added to `messages/en.json` must have an identical counterpart in `messages/ms.json`.

---

## 5. Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Coordinate Math | Hand-crafted trigonometry scattered across UI components | Centralized `latLonToVector3()` in `planets.ts` | Eliminates mismatched axes, inverted latitude bugs, and inconsistent radius scaling across views. |
| Feature Slugs & Lookups | Custom string manipulation or index guessing in components | Helper functions: `getPlanetById()`, `getFeatureBySlug()`, `getFeaturesByPlanet()` | Centralizes lookup safety, null handling, and type narrowing. |
| Planetary Color Constants | Ad-hoc Tailwind color classes in 3D canvas and cards | Strongly typed `themeColor` and `accentColor` fields on `Planet` and `PlanetFeature` | Guarantees visual harmony between 3D glow shaders, canvas particles, and Tailwind glassmorphism borders. |

---

## 6. Common Pitfalls

### Pitfall 1: Three.js Coordinate Axes Inversion (Y-Up vs Z-Up)
**What goes wrong:** Hotspots placed on a 3D sphere appear upside down or rotated 90 degrees compared to cartographic maps.  
**Why it happens:** Standard cartography uses Latitude [-90°..90°] (South to North) and Longitude [-180°..180°] (West to East). In Three.js, $Y$ is typically Up, $X$ is Right, and $Z$ is Forward.  
**How to avoid:** Use the verified spherical transform:
$$\phi = (90 - \text{lat}) \times \frac{\pi}{180}, \quad \theta = (\text{lon} + 180) \times \frac{\pi}{180}$$
$$x = -R \sin\phi \cos\theta, \quad y = R \cos\phi, \quad z = R \sin\phi \sin\theta$$
This formula matches Three.js `SphereGeometry` UV mapping and OrbitControls defaults.

### Pitfall 2: Breaking the 24-Slug Static Export Barrier
**What goes wrong:** Modifying `src/lib/kids/levels.ts` prematurely to reference 35 new features before the MDX files exist causes `npm run verify` or `check:closure` to fail with missing MDX targets.  
**Why it happens:** Next.js static export crawls all routes returned by `generateStaticParams()`. `check-kids-import-closure.js` checks that every slug has an MDX file in `src/content/kids/en/`.  
**How to avoid:** Keep `PLANET_WORLDS` in `src/lib/kids/planets.ts` decoupled from `worlds` in `src/lib/kids/levels.ts` for Phase 09. Add a linking property (`planetId?: string`) to `World` in `levels.ts` without altering existing level slugs.

### Pitfall 3: Incomplete Feature Count (6 instead of 7)
**What goes wrong:** Previous mockups had 6 features on some planets; omitting Feature 7 breaks D-03 (Tahun 1–6 + Capstone Boss).  
**Why it happens:** Initial prototypes in `planets.ts` mapped 6 features to Tahun 1–6 without a dedicated Capstone Boss slot.  
**How to avoid:** Enforce an array length validation test in Vitest verifying `planet.features.length === 7` and exactly one feature has `isFinalBoss === true`.

---

## 7. Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Earth features use the 7 continents as geological terranes for the 19 prompt lessons. | Section 2.1 | Minimal — aligns with Earth cartography mockup in `earth_cartography.html`. |
| A2 | Existing 24 level MDX files will continue to be loaded via `/level/[slug]` until Phase 12 authors new subject levels. | Section 4.1 | Low — ensures NFR-2 static export certification remains 100% green at every commit. |

---

## 8. Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest `^2.1.9` [VERIFIED: package.json:53] |
| Quick run command | `npm test` or `npx vitest run src/__tests__/kids/planets.test.ts` |
| Full suite command | `npm run verify` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCHEMA-01 | Planet mapping matches locked subjects (Earth=Prompting, Moon=BM, Mars=English, Venus=Matematik, Mercury=Moral) | Unit | `npx vitest run src/__tests__/kids/planets.test.ts -t "planetary subjects"` | ❌ Wave 0 Gap |
| SCHEMA-02 | Exactly 7 distinct features per planet, Features 1-6 map to Tahun 1-6, Feature 7 is Capstone Boss | Unit | `npx vitest run src/__tests__/kids/planets.test.ts -t "feature count and boss"` | ❌ Wave 0 Gap |
| SCHEMA-03 | All planets and features have non-empty bilingual names and descriptions in MS and EN | Unit | `npx vitest run src/__tests__/kids/planets.test.ts -t "bilingual completeness"` | ❌ Wave 0 Gap |
| GATE-01 | Code passes TypeScript, import closure, and vocabulary checks | Linter/Static | `npx tsc --noEmit && npm run check:closure && npm run check:vocab` | ✅ Scripts Exist |
| GATE-02 | Project passes full static certification | Integration | `npm run verify` | ✅ Script Exists |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit && npx vitest run src/__tests__/kids/planets.test.ts`
- **Per wave merge:** `npm run verify`

### Wave 0 Gaps
- [ ] `src/__tests__/kids/planets.test.ts`: New unit test suite verifying `PLANET_WORLDS` data integrity:
  - 5 planets with correct IDs and subject mappings.
  - Exactly 7 features per planet.
  - Feature 7 has `isFinalBoss: true` and `year: 6`.
  - Coordinates have valid ranges: `lat` in `[-90, 90]`, `lon` in `[-180, 180]`.
  - Coordinate converter `latLonToVector3` returns normalized unit vectors when `radius=1`.
  - Helper functions `getPlanetWorld`, `getAllPlanetFeatures`, `getFeatureBySlug` work correctly.

---

## Sources

### Primary (HIGH confidence)
- `planets_mockup/planets_features_descriptions.md` [VERIFIED: lines 1-165] — 7 geological features, coordinates, and descriptions for Moon, Mercury, Venus, Mars.
- `planets_mockup/earth_cartography.html` [VERIFIED: lines 199-277] — Earth 7 continents cartography, coordinates, and elevations.
- `planets_mockup/mars_cartography.html` [VERIFIED: lines 130-194] — Mars 7 provinces, radii, and coordinates.
- `planets_mockup/venusian_cartography.html` [VERIFIED: lines 100-171] — Venus 7 provinces, coordinates, and descriptions.
- `planets_mockup/lunar_geological_cartography.html` [VERIFIED: lines 103-174] — Moon 7 lunar provinces, coordinates, and sizes.
- `src/lib/kids/planets.ts` [VERIFIED: lines 1-336] — Current TypeScript schema and prototypes.
- `src/lib/kids/levels.ts` [VERIFIED: lines 1-393] — Current level registry.
- `scripts/verify-project.js` [VERIFIED: lines 1-150] — Static export and test verification gate.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Zero new runtime dependencies; built on existing Next.js, TypeScript, and next-intl.
- Architecture: HIGH — Directly derives coordinates and properties from verified mockup files.
- Pitfalls: HIGH — Clear separation of concerns preserves 100% pass on existing 24-slug static build.

**Research date:** 2026-11-08  
**Valid until:** 2026-12-08
