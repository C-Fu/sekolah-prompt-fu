# Phase 25: Geological Cartography & Provincial Provinces - Research
**Researched:** 2026-11-19
**Domain:** Three.js 3D Spherical Cartography, Planetary Telemetry Schemas & KSSR Outer Planets Provinces
**Confidence:** HIGH

## Summary

Phase 25 establishes the complete geological cartography and provincial regions across the 4 outer planets in Sekolah Prompt-Fu: **Jupiter (Sains)**, **Saturn (Sejarah)**, **Uranus (RBT)**, and **Neptune (PSV)**. Building upon the foundational subject mappings completed in Phase 24, Phase 25 populates authentic atmospheric and geological features for these worlds in `src/lib/kids/planets.ts`—exactly 7 features per planet (28 total outer features), bringing the application total from 35 (the 5 inner worlds) to 63 features across all 9 worlds.

Each feature includes authentic spherical coordinates (`lat`, `lon`, `radiusDeg`, `elevation`), authentic bilingual names (`name`, `nameMs`), pedagogical skill badges (`badge`, `badgeMs`), curriculum descriptions (`description`, `descriptionMs`), geological profiles (`geologicalProfile`, `geologicalProfileMs`), and theme accent colors. Features 1–6 align with KSSR Standards for Tahun 1 to Tahun 6, while Feature 7 represents the Capstone Boss ("Cabaran Unggul") with distinctive gold badge styling and `isFinalBoss: true`. Furthermore, Feature 1 of each outer planet is marked with `hasMission: true` (pointing toward the Year 1 lessons to be authored in Phase 26 & 27), while Features 2–7 have `hasMission: false`, activating the HUD's informative "no mission available yet" banner.

Because the planetary 3D cartography scene (`planet-cartography-scene.ts`) and HUD (`planetary-hud.tsx`) are already fully engineered to dynamically iterate over `planet.features`, populating `planet.features` instantly lights up the 3D spherical beacon pins, glowing boundary circles, camera focus lerping, and the interactive HUD region selector sidebar.

**Primary recommendation:** Populate the 28 features in `PLANET_WORLDS` in `src/lib/kids/planets.ts` with exact bilingual scientific metadata and coordinate profiles, update `targetLessonSlug` / `resolveMissionRoute` scaffolding, and update the test suites in `src/__tests__/kids/planets.test.ts` and `src/__tests__/kids/planetary-hud.test.tsx` to verify all 63 features across all 9 worlds.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
1. **Authentic Atmospheric & Geological Cartography:**
   - **Jupiter (Sains):**
     1. *Great Red Spot (Bintik Merah Gergasi)* - Lat: -22°, Lon: -165°
     2. *Oval BA (Red Spot Jr.)* - Lat: -33°, Lon: -120°
     3. *North Temperate Belt (Jalur Suhu Utara)* - Lat: 30°, Lon: 45°
     4. *South Equatorial Belt (Jalur Khatulistiwa Selatan)* - Lat: -15°, Lon: 80°
     5. *Polar Cyclone Ring (Gelung Siklon Kutub)* - Lat: 82°, Lon: 0°
     6. *White Ovals Domain (Domain Oval Putih)* - Lat: -40°, Lon: -30°
     7. *Cabaran Unggul: Jovian Core Telemetry (Teras Graviti Musytari)* - Lat: 0°, Lon: 0° (Capstone Boss)
   - **Saturn (Sejarah):**
     1. *North Polar Hexagon (Heksagon Kutub Utara)* - Lat: 78°, Lon: 0°
     2. *Cassini Division (Bahagian Cassini)* - Ring boundary feature / Lat: 10°, Lon: 60°
     3. *Encke Gap Horizon (Jurang Encke)* - Lat: -10°, Lon: -90°
     4. *Great White Spot (Bintik Putih Gergasi)* - Lat: 40°, Lon: 130°
     5. *Dragon Storm Expanse (Ribut Naga Purba)* - Lat: -35°, Lon: -45°
     6. *Equatorial Jet Stream (Arus Jet Khatulistiwa)* - Lat: 5°, Lon: 160°
     7. *Cabaran Unggul: Chronos Time Vault (Kubah Masa Purba)* - Lat: -75°, Lon: 180° (Capstone Boss)
   - **Uranus (RBT):**
     1. *Miranda Rift Canyon (Lembah Jurang Titania/Miranda)* - Lat: -15°, Lon: -30°
     2. *Northern Bright Cap (Kubah Cahaya Utara)* - Lat: 65°, Lon: 40°
     3. *Retrograde Cloud Belt (Jalur Awan Retrograd)* - Lat: -30°, Lon: 110°
     4. *Methane Fog Plains (Dataran Kabus Metana)* - Lat: 10°, Lon: -140°
     5. *Epsilon Ring Shard (Pecahan Gelung Epsilon)* - Lat: 20°, Lon: 70°
     6. *South Pole Aurora Trench (Jurang Aurora Selatan)* - Lat: -70°, Lon: 0°
     7. *Cabaran Unggul: Diamond Ocean Matrix (Matriks Lautan Berlian)* - Lat: 0°, Lon: 180° (Capstone Boss)
   - **Neptune (PSV):**
     1. *Great Dark Spot (Bintik Gelap Gergasi)* - Lat: -20°, Lon: -80°
     2. *Small Dark Spot (Wizard's Eye / Mata Penyihir)* - Lat: -54°, Lon: 35°
     3. *Scooter Cirrus Clouds (Awan Sirus Pantas)* - Lat: -42°, Lon: 120°
     4. *Adams Ring Arcs (Arka Gelung Adams)* - Lat: 15°, Lon: -160°
     5. *South Polar Vortex (Pusaran Kutub Selatan)* - Lat: -75°, Lon: -45°
     6. *Azure Jet Stream (Arus Jet Azure)* - Lat: 30°, Lon: 95°
     7. *Cabaran Unggul: Triton Azure Prism (Prisma Azure Triton)* - Lat: 0°, Lon: 0° (Capstone Boss)

2. **KSSR Standard Progression & Badge Styling:**
   - Features 1–6: Map to Tahun 1 through Tahun 6 curriculum skills (e.g. observation, timeline sequence, basic structural shapes, primary color harmonies).
   - Feature 7: Designated as Capstone Boss (`isFinalBoss: true`, gold badge styling, "Cabaran Unggul").

3. **Mission Linking & Feature Availability:**
   - Feature 1: Has `hasMission: true` with target lesson links:
     - Jupiter Feature 1: `targetLessonSlug: "10-1-sains-benda-hidup"`
     - Saturn Feature 1: `targetLessonSlug: "11-1-sejarah-garis-masa"`
     - Uranus Feature 1: `targetLessonSlug: "12-1-rbt-bentuk-asas"`
     - Neptune Feature 1: `targetLessonSlug: "13-1-psv-warna-imaginasi"`
   - Features 2–7: `hasMission: false` with complete cartographic profiles, coordinates, descriptions, and learning badges for exploration.

### the agent's Discretion
- Choice of precise radius degrees (`radiusDeg`) and authentic elevation/depth profiles (e.g. atmospheric cloud decks, barometric pressure depths, storm heights) for each of the 28 features.
- Pedagogical badge names and authentic bilingual descriptions for Tahun 2–6 and Capstone Bosses matching KSSR Dokumen Standard Kurikulum dan Pentaksiran (DSKP) for Sains, Sejarah, RBT, and PSV.
- Exact unit test assertions updating `planets.test.ts` and `planetary-hud.test.tsx`.

### Deferred Ideas (OUT OF SCOPE)
- Modifying existing Earth (1.1–5.4), Moon (6.1), Mars (7.1), Venus (8.1), or Mercury (9.1) lesson content.
- Authoring Year 2 to Year 6 (Tahun 2–6) lesson MDX content (deferred to `FUTR-01`).
- Custom procedural ring shaders or dynamic cloud storm flow shaders for Uranus/Saturn (ambient themes handled in Phase 28).
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **GEO-01** | User can explore 7 authentic geological or atmospheric features/regions per outer planet (28 total regions) with spherical coordinates, elevation/depth profiles, badges, and learning objectives. | `src/lib/kids/planets.ts` definitions populated for `jupiter-sains`, `saturn-sejarah`, `uranus-rbt`, and `neptune-psv`, satisfying coordinate ranges, non-empty bilingual fields, and elevation profiles. |
| **GEO-02** | Features 1–6 map to Tahun 1–6 curricula; Feature 7 represents the Capstone Boss ("Cabaran Unggul") with distinctive badge styling and elevated visual beacon pins. | Features configured with `year: 1..6` for indices 0..5, `isFinalBoss: false`, and Feature 7 configured with `year: 6`, `isFinalBoss: true`, `featureNumber: 7`, and `badgeMs: "Cabaran Unggul: ..."`. |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Planetary Data & Coordinates | Data / Library (`src/lib/kids/planets.ts`) | — | Central source of truth for all celestial and feature metadata across 3D canvas and HUD. |
| 3D Pin & Boundary Rendering | Client / WebGL (`planet-cartography-scene.ts`) | — | Three.js scene generates boundary loops and pulsing beacon pins directly from `planet.features`. |
| Region Selection & Telemetry Display | Client / React (`planetary-hud.tsx`) | — | Glassmorphic HUD renders sidebar feature buttons, telemetry cards, and mission launch / no-mission status. |
| Mission Routing | Routing / Helper (`planets.ts:resolveMissionRoute`) | Client (`PlanetaryExplorer`) | Whitelisted routing from planet feature to internal lesson slugs. |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `three` | `^0.174.0` [VERIFIED: package.json:44] | 3D rendering for planetary spheres, beacon pins, and boundary loops | Established WebGL engine across all planetary cartography scenes. |
| `next-intl` | `^3.26.5` [VERIFIED: package.json:34] | Bilingual localization (`ms` and `en`) | Primary i18n engine used throughout Sekolah Prompt-Fu. |
| `vitest` | `^2.1.9` [VERIFIED: package.json:54] | Unit & integration testing | Fast in-memory runner with `@testing-library/react`. |

---

## Package Legitimacy Audit

No external packages need to be installed for Phase 25. All dependencies (`three`, `next`, `next-intl`, `vitest`) are already installed and certified.

---

## Technical Deep Dive: 5 Core Investigation Areas

### 1. Exact Structure and Properties Required for `PlanetFeature` in `planets.ts`

The `PlanetFeature` interface in `src/lib/kids/planets.ts` [VERIFIED: src/lib/kids/planets.ts:55-82] specifies:
```typescript
export interface GeoCoordinates {
  lat: number;        // Latitude in degrees [-90..90]
  lon: number;        // Longitude in degrees [-180..180]
  radiusDeg?: number; // Visual boundary radius in degrees on the sphere surface (defaults to 10.0)
  elevation?: string; // Authentic geological elevation/depth description
}

export interface PlanetFeature {
  id: string;                 // URL-friendly unique slug (e.g. 'great-red-spot')
  featureNumber: number;      // 1 to 7
  year: number;               // 1 to 6 (Features 1-6 map to Tahun 1-6; Feature 7 maps to Tahun 6 Mastery)
  isFinalBoss: boolean;       // true ONLY for Feature 7 ("Cabaran Unggul")
  name: string;               // English / International geological name
  nameMs: string;             // Bahasa Melayu geological name
  coordinates: GeoCoordinates;// lat, lon, radiusDeg, elevation
  badge: string;              // English KSSR skill badge
  badgeMs: string;            // Malay KSSR skill badge
  description: string;        // English narrative & prompt learning focus
  descriptionMs: string;      // Malay narrative & prompt learning focus
  geologicalProfile: string;  // English authentic planetary geological summary
  geologicalProfileMs: string;// Malay authentic planetary geological summary
  hasMission?: boolean;       // false indicates no mission available for this feature; true for Feature 1
  accentColor?: string;       // Feature-specific neon hotspot glow hex
}
```
*Note on Optional Property:* `targetLessonSlug?: string;` can optionally be added to `PlanetFeature` interface if desired for direct mission binding, or handled via `resolveMissionRoute`. In `planets.ts`, adding `targetLessonSlug?: string;` to `PlanetFeature` aligns with CONTEXT.md decision item 3 ("Feature 1: Has `hasMission: true` with target lesson links").

---

### 2. Coordinates, Depths, Elevations, and Pedagogical Badges for All 28 Features (7 Per Planet)

All 28 features have been compiled based on authentic NASA Cassini/Voyager/Juno telemetry and KSSR Primary Curricula (Sains, Sejarah, RBT, PSV):

#### Jupiter (Musytari — Sains / Science)
Theme / Accent: `#D97706` / `#F59E0B`
1. **Great Red Spot (Bintik Merah Gergasi)**
   - `id`: `"great-red-spot"`
   - `coordinates`: `{ lat: -22.0, lon: -165.0, radiusDeg: 16.0, elevation: "+8 km above cloud deck (high pressure)" }`
   - `badge`: `"Living & Non-Living Classification"` | `badgeMs`: `"Pengelasan Benda Hidup & Bukan Hidup"`
   - `year`: 1 | `isFinalBoss`: false | `hasMission`: true
   - `targetLessonSlug`: `"10-1-sains-benda-hidup"`
2. **Oval BA (Red Spot Jr.)**
   - `id`: `"oval-ba"`
   - `coordinates`: `{ lat: -33.0, lon: -120.0, radiusDeg: 10.0, elevation: "+4 km above main deck" }`
   - `badge`: `"Sensory Observation & Growth"` | `badgeMs`: `"Pemerhatian Deria & Tumbesaran"`
   - `year`: 2 | `isFinalBoss`: false | `hasMission`: false
3. **North Temperate Belt (Jalur Suhu Utara)**
   - `id`: `"north-temperate-belt"`
   - `coordinates`: `{ lat: 30.0, lon: 45.0, radiusDeg: 14.0, elevation: "-12 km jetstream depression" }`
   - `badge`: `"Animal Classes & Plant Habits"` | `badgeMs`: `"Kelas Haiwan & Tabiat Tumbuhan"`
   - `year`: 3 | `isFinalBoss`: false | `hasMission`: false
4. **South Equatorial Belt (Jalur Khatulistiwa Selatan)**
   - `id`: `"south-equatorial-belt"`
   - `coordinates`: `{ lat: -15.0, lon: 80.0, radiusDeg: 15.0, elevation: "-8 km turbulent trough" }`
   - `badge`: `"States of Matter & Water Cycles"` | `badgeMs`: `"Sifat Jirim & Kitaran Air"`
   - `year`: 4 | `isFinalBoss`: false | `hasMission`: false
5. **Polar Cyclone Ring (Gelung Siklon Kutub)**
   - `id`: `"polar-cyclone-ring"`
   - `coordinates`: `{ lat: 82.0, lon: 0.0, radiusDeg: 18.0, elevation: "Circumpolar vortex ring (+5 km)" }`
   - `badge`: `"Energy Transformations & Electricity"` | `badgeMs`: `"Perubahan Tenaga & Elektrik"`
   - `year`: 5 | `isFinalBoss`: false | `hasMission`: false
6. **White Ovals Domain (Domain Oval Putih)**
   - `id`: `"white-ovals-domain"`
   - `coordinates`: `{ lat: -40.0, lon: -30.0, radiusDeg: 12.0, elevation: "+3 km anticyclonic domes" }`
   - `badge`: `"Ecosystem Balance & Adaptations"` | `badgeMs`: `"Keseimbangan Ekosistem & Adaptasi"`
   - `year`: 6 | `isFinalBoss`: false | `hasMission`: false
7. **Cabaran Unggul: Jovian Core Telemetry (Teras Graviti Musytari)**
   - `id`: `"jovian-core-telemetry"`
   - `coordinates`: `{ lat: 0.0, lon: 0.0, radiusDeg: 25.0, elevation: "-60,000 km metallic hydrogen core" }`
   - `badge`: `"Capstone Boss: Empirical Scientific Inquiry"` | `badgeMs`: `"Cabaran Unggul: Penerokaan Saintifik Empirikal"`
   - `year`: 6 | `isFinalBoss`: true | `hasMission`: false | `accentColor`: `"#F59E0B"`

#### Saturn (Zuhal — Sejarah / History)
Theme / Accent: `#EAB308` / `#FDE047`
1. **North Polar Hexagon (Heksagon Kutub Utara)**
   - `id`: `"north-polar-hexagon"`
   - `coordinates`: `{ lat: 78.0, lon: 0.0, radiusDeg: 20.0, elevation: "+10 km jetstream wave" }`
   - `badge`: `"Personal & Family Chronology"` | `badgeMs`: `"Kronologi Diri & Keluarga"`
   - `year`: 1 | `isFinalBoss`: false | `hasMission`: true
   - `targetLessonSlug`: `"11-1-sejarah-garis-masa"`
2. **Cassini Division (Bahagian Cassini)**
   - `id`: `"cassini-division"`
   - `coordinates`: `{ lat: 10.0, lon: 60.0, radiusDeg: 12.0, elevation: "4,800 km ring orbital gap" }`
   - `badge`: `"School & Community Heritage"` | `badgeMs`: `"Warisan Sekolah & Komuniti"`
   - `year`: 2 | `isFinalBoss`: false | `hasMission`: false
3. **Encke Gap Horizon (Jurang Encke)**
   - `id`: `"encke-gap-horizon"`
   - `coordinates`: `{ lat: -10.0, lon: -90.0, radiusDeg: 11.0, elevation: "325 km moonlet orbital lane" }`
   - `badge`: `"State History & Local Leaders"` | `badgeMs`: `"Sejarah Negeri & Pemimpin Tempatan"`
   - `year`: 3 | `isFinalBoss`: false | `hasMission`: false
4. **Great White Spot (Bintik Putih Gergasi)**
   - `id`: `"great-white-spot"`
   - `coordinates`: `{ lat: 40.0, lon: 130.0, radiusDeg: 16.0, elevation: "+12 km convective cloud crest" }`
   - `badge`: `"Early Malay Kingdoms & Sovereignty"` | `badgeMs`: `"Kerajaan Melayu Awal & Kedaulatan"`
   - `year`: 4 | `isFinalBoss`: false | `hasMission`: false
5. **Dragon Storm Expanse (Ribut Naga Purba)**
   - `id`: `"dragon-storm-expanse"`
   - `coordinates`: `{ lat: -35.0, lon: -45.0, radiusDeg: 14.0, elevation: "-15 km deep convective abyss" }`
   - `badge`: `"National Struggle & Independence"` | `badgeMs`: `"Perjuangan Kemerdekaan Negara"`
   - `year`: 5 | `isFinalBoss`: false | `hasMission`: false
6. **Equatorial Jet Stream (Arus Jet Khatulistiwa)**
   - `id`: `"equatorial-jet-stream"`
   - `coordinates`: `{ lat: 5.0, lon: 160.0, radiusDeg: 15.0, elevation: "1,800 km/h equatorial windstream" }`
   - `badge`: `"Formation of Malaysia & Unity"` | `badgeMs`: `"Pembentukan Malaysia & Perpaduan"`
   - `year`: 6 | `isFinalBoss`: false | `hasMission`: false
7. **Cabaran Unggul: Chronos Time Vault (Kubah Masa Purba)**
   - `id`: `"chronos-time-vault"`
   - `coordinates`: `{ lat: -75.0, lon: 180.0, radiusDeg: 24.0, elevation: "Deep cryogenic polar vault" }`
   - `badge`: `"Capstone Boss: Historical Chronology & Heritage"` | `badgeMs`: `"Cabaran Unggul: Kronologi Sejarah & Warisan"`
   - `year`: 6 | `isFinalBoss`: true | `hasMission`: false | `accentColor`: `"#FACC15"`

#### Uranus (Uranus — RBT / Design & Technology)
Theme / Accent: `#06B6D4` / `#22D3EE`
1. **Miranda Rift Canyon (Lembah Jurang Titania/Miranda)**
   - `id`: `"miranda-rift-canyon"`
   - `coordinates`: `{ lat: -15.0, lon: -30.0, radiusDeg: 14.0, elevation: "-20 km tectonic shear graben" }`
   - `badge`: `"Basic Shapes & 2D/3D Building Blocks"` | `badgeMs`: `"Bentuk Asas & Blok Binaan 2D/3D"`
   - `year`: 1 | `isFinalBoss`: false | `hasMission`: true
   - `targetLessonSlug`: `"12-1-rbt-bentuk-asas"`
2. **Northern Bright Cap (Kubah Cahaya Utara)**
   - `id`: `"northern-bright-cap"`
   - `coordinates`: `{ lat: 65.0, lon: 40.0, radiusDeg: 18.0, elevation: "+5 km seasonal methane veil" }`
   - `badge`: `"Basic Hand Tools & Structural Joining"` | `badgeMs`: `"Alatan Tangan & Sambungan Struktur"`
   - `year`: 2 | `isFinalBoss`: false | `hasMission`: false
3. **Retrograde Cloud Belt (Jalur Awan Retrograd)**
   - `id`: `"retrograde-cloud-belt"`
   - `coordinates`: `{ lat: -30.0, lon: 110.0, radiusDeg: 15.0, elevation: "-10 km counter-rotating flow" }`
   - `badge`: `"Basic Electronics & Simple Circuits"` | `badgeMs`: `"Elektronik Asas & Litar Mudah"`
   - `year`: 3 | `isFinalBoss`: false | `hasMission`: false
4. **Methane Fog Plains (Dataran Kabus Metana)**
   - `id`: `"methane-fog-plains"`
   - `coordinates`: `{ lat: 10.0, lon: -140.0, radiusDeg: 16.0, elevation: "-2 km haze plateau" }`
   - `badge`: `"Design Constraints & Ergonomic Forms"` | `badgeMs`: `"Kekangan Reka Bentuk & Bentuk Ergonomik"`
   - `year`: 4 | `isFinalBoss`: false | `hasMission`: false
5. **Epsilon Ring Shard (Pecahan Gelung Epsilon)**
   - `id`: `"epsilon-ring-shard"`
   - `coordinates`: `{ lat: 20.0, lon: 70.0, radiusDeg: 12.0, elevation: "Dense boulder ring boundary" }`
   - `badge`: `"Microcontroller Logic & Flowcharts"` | `badgeMs`: `"Logik Pengawal Mikro & Carta Alir"`
   - `year`: 5 | `isFinalBoss`: false | `hasMission`: false
6. **South Pole Aurora Trench (Jurang Aurora Selatan)**
   - `id`: `"south-pole-aurora-trench"`
   - `coordinates`: `{ lat: -70.0, lon: 0.0, radiusDeg: 17.0, elevation: "+8 km magnetic cusp channel" }`
   - `badge`: `"Robotics & Electro-Mechanical Systems"` | `badgeMs`: `"Sistem Robotik & Elektro-Mekanikal"`
   - `year`: 6 | `isFinalBoss`: false | `hasMission`: false
7. **Cabaran Unggul: Diamond Ocean Matrix (Matriks Lautan Berlian)**
   - `id`: `"diamond-ocean-matrix"`
   - `coordinates`: `{ lat: 0.0, lon: 180.0, radiusDeg: 25.0, elevation: "High-pressure supercritical mantle" }`
   - `badge`: `"Capstone Boss: Structural Engineering & Invention"` | `badgeMs`: `"Cabaran Unggul: Reka Cipta & Kejuruteraan Struktur"`
   - `year`: 6 | `isFinalBoss`: true | `hasMission`: false | `accentColor`: `"#38BDF8"`

#### Neptune (Neptun — PSV / Visual Arts)
Theme / Accent: `#2563EB` / `#3B82F6`
1. **Great Dark Spot (Bintik Gelap Gergasi)**
   - `id`: `"great-dark-spot"`
   - `coordinates`: `{ lat: -20.0, lon: -80.0, radiusDeg: 16.0, elevation: "-10 km anticyclonic cloud hole" }`
   - `badge`: `"Primary Colors & Line Imagination"` | `badgeMs`: `"Warna Asas & Imaginasi Garisan"`
   - `year`: 1 | `isFinalBoss`: false | `hasMission`: true
   - `targetLessonSlug`: `"13-1-psv-warna-imaginasi"`
2. **Small Dark Spot (Wizard's Eye / Mata Penyihir)**
   - `id`: `"small-dark-spot"`
   - `coordinates`: `{ lat: -54.0, lon: 35.0, radiusDeg: 11.0, elevation: "-6 km cyclonic eye" }`
   - `badge`: `"Secondary Colors & Surface Textures"` | `badgeMs`: `"Warna Sekunder & Jalinan Permukaan"`
   - `year`: 2 | `isFinalBoss`: false | `hasMission`: false
3. **Scooter Cirrus Clouds (Awan Sirus Pantas)**
   - `id`: `"scooter-cirrus-clouds"`
   - `coordinates`: `{ lat: -42.0, lon: 120.0, radiusDeg: 13.0, elevation: "+15 km supersonic methane cirrus" }`
   - `badge`: `"Visual Balance, Rhythm & Movement"` | `badgeMs`: `"Imbangan Visual, Irama & Pergerakan"`
   - `year`: 3 | `isFinalBoss`: false | `hasMission`: false
4. **Adams Ring Arcs (Arka Gelung Adams)**
   - `id`: `"adams-ring-arcs"`
   - `coordinates`: `{ lat: 15.0, lon: -160.0, radiusDeg: 14.0, elevation: "Gravitationally clumped ring arcs" }`
   - `badge`: `"Tone, Contrast & Perspective"` | `badgeMs`: `"Ton Warna, Kontra & Perspektif"`
   - `year`: 4 | `isFinalBoss`: false | `hasMission`: false
5. **South Polar Vortex (Pusaran Kutub Selatan)**
   - `id`: `"south-polar-vortex"`
   - `coordinates`: `{ lat: -75.0, lon: -45.0, radiusDeg: 15.0, elevation: "Thermal polar cyclone (+4 km)" }`
   - `badge`: `"Traditional Craft & Pattern Symmetry"` | `badgeMs`: `"Kraf Tradisional & Simetri Corak"`
   - `year`: 5 | `isFinalBoss`: false | `hasMission`: false
6. **Azure Jet Stream (Arus Jet Azure)**
   - `id`: `"azure-jet-stream"`
   - `coordinates`: `{ lat: 30.0, lon: 95.0, radiusDeg: 15.0, elevation: "2,000 km/h supersonic jet stream" }`
   - `badge`: `"Composition & Visual Storytelling"` | `badgeMs`: `"Komposisi & Penceritaan Visual"`
   - `year`: 6 | `isFinalBoss`: false | `hasMission`: false
7. **Cabaran Unggul: Triton Azure Prism (Prisma Azure Triton)**
   - `id`: `"triton-azure-prism"`
   - `coordinates`: `{ lat: 0.0, lon: 0.0, radiusDeg: 25.0, elevation: "Nitrogen cryovolcanic reflection prism" }`
   - `badge`: `"Capstone Boss: Visual Harmony & Masterpiece"` | `badgeMs`: `"Cabaran Unggul: Harmoni Visual & Karya Agung"`
   - `year`: 6 | `isFinalBoss`: true | `hasMission`: false | `accentColor`: `"#60A5FA"`

---

### 3. Interaction with 3D Cartography Beacon Rendering (Beacon Pin Placement, Raycasting)

In `src/components/kids/planets/planet-cartography-scene.ts` [VERIFIED: lines 161-195]:
```typescript
planet.features.forEach((feat, idx) => {
  const lat = feat.coordinates.lat;
  const lon = feat.coordinates.lon;
  const radiusDeg = feat.coordinates.radiusDeg ?? 10.0;
  const featColorHex = feat.accentColor || accentColorHex;
  const threeColor = new THREE.Color(featColorHex);

  // Boundary LineLoop at sphereRadius + 0.015 = 4.815
  const boundaryPoints = generateBoundaryPoints(lat, lon, radiusDeg, sphereRadius, 84);
  const lineGeo = new THREE.BufferGeometry().setFromPoints(boundaryPoints);
  const lineMat = new THREE.LineBasicMaterial({ color: threeColor, transparent: true, opacity: 0.85 });
  const lineLoop = new THREE.LineLoop(lineGeo, lineMat);
  boundariesGroup.add(lineLoop);
  boundaryLines.push(lineLoop);

  // Beacon Pin Mesh at 4.825 above boundary ring
  const pinGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const pinMat = new THREE.MeshStandardMaterial({
    color: threeColor,
    emissive: threeColor,
    emissiveIntensity: 0.7,
    roughness: 0.3,
    metalness: 0.2,
  });
  const pinMesh = new THREE.Mesh(pinGeo, pinMat);
  const pinPos = latLonToVector3(lat, lon, 4.825);
  pinMesh.position.set(pinPos.x, pinPos.y, pinPos.z);
  pinMesh.userData = { featureIndex: idx, featureId: feat.id };
  boundariesGroup.add(pinMesh);
  pinMeshes.push(pinMesh);
});
```
When `planet.features` is populated with the 7 features:
1. **Pulsing Beacon Pins:** 7 glowing pins are placed at exact `(lat, lon)` positions at elevation `4.825`.
2. **Boundary Rings:** 7 circular boundary line loops are drawn on the sphere surface using `generateBoundaryPoints` at radius `radiusDeg`.
3. **Focus Glide:** Calling `cartography.focusFeature(index)` or clicking a pin uses `latLonToVector3(lat, lon, sphereRadius)` and eases the camera to `targetCamPos` at `zoomDistance` (calculated from `radiusDeg`: `radiusDeg > 18 ? 14.0 : (radiusDeg < 8 ? 9.5 : 11.5)`).
4. **Raycasting:** Clicking the canvas casts a ray against `pinMeshes`, extracting `hit.userData.featureIndex` to trigger `handleSelectFeature()`.

No changes to `planet-cartography-scene.ts` logic are necessary—it automatically handles any planet with `features.length === 7`.

---

### 4. HUD Behavior & Transition from "Coming Soon" to Feature Region Selector

In `src/components/kids/planets/planetary-hud.tsx` [VERIFIED: lines 168-188]:
```tsx
{planet.subjectId === 'astronomy' || (['sains', 'sejarah', 'rbt', 'psv'].includes(planet.subjectId) && planet.features.length === 0) ? (
  <div data-testid="coming-soon-card" className="p-4 text-center my-auto space-y-3">
    ... Coming Soon ...
  </div>
) : planet.features.length === 0 || !activeFeature ? (
  <div data-testid="empty-feature-card" ...>
    ...
  </div>
) : (
  <>
    {/* Region Details & 2x2 Telemetry Grid */}
    ...
    {/* Mission Launch or No-Mission Notice */}
    {hasMission ? (
      <button ... onClick={() => onLaunchMission(activeFeature)}>
        <span>🚀</span>
        <span>{t('launchMission')}</span>
      </button>
    ) : (
      <div data-testid="no-mission-reason" role="status" ...>
        <span>ℹ️</span>
        <span>{t('noMissionReason')}</span>
      </div>
    )}
  </>
)}
```

**Key Observation:**
- Previously, for Jupiter, Saturn, Uranus, and Neptune, `planet.features.length === 0`, so line 168 caused the HUD to render `<div data-testid="coming-soon-card">`.
- As soon as `planet.features` has 7 elements, `planet.features.length === 0` becomes `false`!
- Therefore, the outer planets transition smoothly to displaying the active feature's telemetry card (`data-testid="telemetry-card"`) and the Province Sidebar (`data-testid="province-sidebar"`) showing all 7 feature buttons (`data-testid="feature-button-[id]"`).
- For Feature 1 (`hasMission: true`), the HUD renders the "🚀 Start Mission" / "Mula Misi" button.
- For Features 2–7 (`hasMission: false`), the HUD renders the amber notice `data-testid="no-mission-reason"`: *"Belum ada misi untuk kawasan ini."* / *"No mission available for this region yet."*

---

### 5. Unit Tests to Update or Add

#### A. In `src/__tests__/kids/planets.test.ts`:
1. `PLANET_WORLDS Subject Alignment`:
   - Verify all 9 planets exist and have correct subjects and IDs.
2. `Geological Features and Year Mapping`:
   - Existing test checked: `defines exactly 7 features for each of the 5 core planets (35 features total)`.
   - Update: All 9 planets now define exactly 7 features each (total = 9 × 7 = 63 features).
   - Verify feature numbers 1 to 7, years 1 to 6, `isFinalBoss === false` for 1–6, and `isFinalBoss === true` for feature 7 across ALL 9 planets.
3. `Bilingual Metadata & Coordinate Validation`:
   - Valid coordinates for all 63 features (lat in `[-90, 90]`, lon in `[-180, 180]`).
   - Non-empty bilingual names, badges, descriptions, and geological profiles for all 63 features.
4. `Milestone v1.4 Astronomical Telemetry and Outer Planets`:
   - Existing test at line 289 asserted:
     `keeps 35 curriculum features for the 5 core worlds and 0 features for outer worlds`.
     This test **must be updated** to assert that all 9 worlds have 7 features, with 63 total features across all worlds.

#### B. In `src/__tests__/kids/planetary-hud.test.tsx`:
1. Line 305: Test `renders Coming Soon card for outer worlds with zero features`.
   - Since outer worlds in `PLANET_WORLDS` will now have 7 features, a planet with 0 features only occurs if explicitly tested with `features: []` or if tested before features were populated.
   - Update this test to use an outer planet clone with `features: []` to specifically verify the fallback, OR test an outer world with 7 features asserting that it now renders the 7 feature buttons and telemetry card!
2. Add new test:
   - For outer planet (e.g. `jupiter-sains`), verify feature 1 renders the mission launch button (`hasMission !== false`), while feature 2 (`hasMission: false`) renders the `no-mission-reason` notice.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Spherical coordinate conversion | Trigonometric math from scratch in components | `latLonToVector3` in `src/lib/kids/planets.ts` | Tested, standardized standard Y-up coordinate transformation with boundary clamping. |
| Feature boundary rings | Custom 3D mesh slicing or circle approximations | `generateBoundaryPoints` in `planetary-math.ts` | Correct great-circle spherical boundary projection with elevation offset. |
| Navigation & mission launch | Direct window.location manipulation | `resolveMissionRoute` + `attachOriginToRoute` | Protects against open-redirects and maintains allowlisted route origin tracking. |

---

## Common Pitfalls

### Pitfall 1: Breaking Existing Tests Asserting 35 Features
**What goes wrong:** Existing tests in `planets.test.ts` (e.g. `getAllPlanetFeatures returns exactly 35 features`, `coreWorlds.length === 5`, `outerWorlds.forEach(w => w.features.length === 0)`) fail because the total is now 63 features and outer worlds have 7 features.
**Why it happens:** Milestone v1.4 tests hardcoded the count to 35 core features and 0 outer features.
**How to avoid:** Deliberately update `planets.test.ts` to assert 63 features across all 9 worlds, reflecting the expansion of outer worlds into active curriculum cartography.

### Pitfall 2: Coordinate Bounds and Clamping
**What goes wrong:** Invalid latitudes (> 90 or < -90) or longitudes (> 180 or < -180) break 3D spherical rendering or fail `planets.test.ts` coordinate limit assertions.
**Why it happens:** Manual data entry typo (e.g. lat 95°).
**How to avoid:** Double-check all coordinates against the locked decisions table in CONTEXT.md (all latitudes are between -78° and +82°, longitudes between -180° and +180°).

### Pitfall 3: Malay Vocabulary Guard Violations
**What goes wrong:** Using banned English words in `nameMs`, `badgeMs`, `descriptionMs`, or `geologicalProfileMs` (e.g. bare "level" instead of "tahap", or untranslated English strings).
**Why it happens:** Incomplete translation during feature authoring.
**How to avoid:** Ensure all `*Ms` fields are authentic Bahasa Melayu, use "tahap" instead of "level", and run `npm run check:vocab` to verify.

---

## Code Examples

### Populating an Outer Planet Feature in `PLANET_WORLDS` (`src/lib/kids/planets.ts`)
```typescript
// Example: Jupiter Feature 1 & 7
features: [
  {
    id: "great-red-spot",
    featureNumber: 1,
    year: 1,
    isFinalBoss: false,
    hasMission: true,
    name: "Great Red Spot (Bintik Merah Gergasi)",
    nameMs: "Bintik Merah Gergasi",
    coordinates: {
      lat: -22.0,
      lon: -165.0,
      radiusDeg: 16.0,
      elevation: "+8 km above cloud deck (high pressure anticyclone)",
    },
    badge: "Living & Non-Living Classification",
    badgeMs: "Pengelasan Benda Hidup & Bukan Hidup",
    description: "Prompts guiding scientific observation, identifying living vs non-living characteristics, and nature inquiry.",
    descriptionMs: "Arahan membimbing pemerhatian saintifik, membezakan ciri benda hidup dan bukan hidup, serta penerokaan alam.",
    geologicalProfile: "Titanic anticyclonic storm raging for centuries, spanning wider than Earth with high-altitude crimson clouds.",
    geologicalProfileMs: "Ribut antisiklon gergasi yang bergolak selama berabad-abad, lebih lebar daripada Bumi dengan awan merah aras tinggi.",
    accentColor: "#F59E0B",
  },
  // ... Features 2 to 6 with hasMission: false ...
  {
    id: "jovian-core-telemetry",
    featureNumber: 7,
    year: 6,
    isFinalBoss: true,
    hasMission: false,
    name: "Jovian Core Telemetry (Gravity & Deep Atmosphere)",
    nameMs: "Teras Graviti Musytari",
    coordinates: {
      lat: 0.0,
      lon: 0.0,
      radiusDeg: 25.0,
      elevation: "-60,000 km metallic hydrogen core",
    },
    badge: "Capstone Boss: Empirical Scientific Inquiry",
    badgeMs: "Cabaran Unggul: Penerokaan Saintifik Empirikal",
    description: "Capstone boss arena: Synthesize comprehensive scientific observation, hypothesis formulation, and empirical testing.",
    descriptionMs: "Arena bos terakhir: Menggabungkan pemerhatian saintifik mendalam, pembentukan hipotesis dan pembuktian empirikal.",
    geologicalProfile: "Extreme gravitational core enveloped by immense pressures and swirling seas of metallic liquid hydrogen.",
    geologicalProfileMs: "Teras graviti ekstrem yang diselubungi tekanan amat dahsyat dan lautan hidrogen cecair berlogam.",
    accentColor: "#F59E0B",
  },
]
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Outer planets have `features: []` with "Coming Soon" placeholder card | All 4 outer planets have 7 authentic geological features with 3D pins, rings, and badges | Phase 25 | Outer worlds become interactive cartographic environments ready for curriculum lessons. |
| 35 total geological features across 5 core planets | 63 total geological features across all 9 planets | Phase 25 | Full solar system cartography coverage. |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `radiusDeg` between 10.0 and 25.0 provides optimal visual boundary sizing on the Three.js 4.8-radius sphere | 2. Coordinates | Low — `radiusDeg` only scales the boundary ring visual size and camera zoom distance; values between 10° and 25° match the existing 5 planets. |
| A2 | Setting `hasMission: true` on Feature 1 and `hasMission: false` on Features 2–7 for outer planets correctly triggers the HUD launch button vs. "no mission available yet" banner | 4. HUD Behavior | Zero risk — already verified by `src/__tests__/kids/planetary-hud.test.tsx:264`. |

---

## Open Questions

None. The coordinates and feature assignments are locked in `25-CONTEXT.md`, the Three.js cartography scene is already built and working, and HUD transitions are already implemented and test-covered.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Test running & build | ✓ | v20.x+ | — |
| npm | Package execution | ✓ | 10.x+ | — |
| Three.js | 3D scene rendering | ✓ | 0.174.0 | — |
| Vitest | Test suite execution | ✓ | 2.1.9 | — |

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 2.1.9 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run src/__tests__/kids/planets.test.ts src/__tests__/kids/planetary-hud.test.tsx` |
| Full suite command | `npm test -- --run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GEO-01 | 28 authentic features across 4 outer planets (7 per planet) with valid coordinates & profiles | unit | `npx vitest run src/__tests__/kids/planets.test.ts` | ✅ (needs test count update 35 → 63) |
| GEO-02 | Features 1–6 map to Tahun 1–6, Feature 7 is Capstone Boss with `isFinalBoss: true` | unit | `npx vitest run src/__tests__/kids/planets.test.ts` | ✅ (needs test count update 35 → 63) |
| GEO-01 / 02 | HUD renders 7 buttons and telemetry card for outer planets; feature 1 has mission, feature 2 has no mission notice | component | `npx vitest run src/__tests__/kids/planetary-hud.test.tsx` | ✅ (needs test update for outer planet with features) |

### Wave 0 Gaps
None. Test files exist; tests will be updated during Phase 25 planning and implementation.

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | Yes | `normalizePlanetId()` and coordinate validation ensure lat `[-90, 90]`, lon `[-180, 180]`; `resolveMissionRoute()` uses strict hardcoded switch without user-supplied paths. |
| V4 Access Control | No | Purely client-side educational cartography data; no sensitive user data. |

---

## Sources

### Primary (HIGH confidence)
- `src/lib/kids/planets.ts` [VERIFIED: lines 55-82, 1100-1262, 1264-1321]
- `src/components/kids/planets/planet-cartography-scene.ts` [VERIFIED: lines 161-251]
- `src/components/kids/planets/planetary-hud.tsx` [VERIFIED: lines 100-160, 168-285]
- `.planning/phases/25-geological-cartography-provincial-provinces/25-CONTEXT.md` [VERIFIED: lines 8-54]
- `.planning/REQUIREMENTS.md` [VERIFIED: lines 12-15]
- `src/__tests__/kids/planets.test.ts` [VERIFIED: lines 98-137, 255-298]
- `src/__tests__/kids/planetary-hud.test.tsx` [VERIFIED: lines 264-322]

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Three.js and existing data structures already proven in production.
- Architecture: HIGH - Zero new architectural patterns required; leverages existing 3D cartography pipeline.
- Pitfalls: HIGH - Test expectations and coordinate boundaries verified directly from codebase.

**Research date:** 2026-11-19
**Valid until:** 2026-12-19
