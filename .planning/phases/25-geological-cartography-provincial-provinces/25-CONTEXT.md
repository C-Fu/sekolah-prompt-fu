# Phase 25: Geological Cartography & Provincial Provinces - Context

## Executive Summary
This phase populates the 28 authentic atmospheric and geological features across the 4 outer planets (Jupiter, Saturn, Uranus, Neptune), with exactly 7 features per world. Each feature includes 3D spherical coordinates (`lat`, `lon`, `radiusDeg`, `elevation`), authentic scientific geological descriptions, bilingual names, and curriculum badges matching the KSSR standard progression.

## Confirmed Design Decisions

### 1. Authentic Atmospheric & Geological Cartography
Features will use real scientific landmarks and storms:
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

### 2. KSSR Standard Progression & Badge Styling
- **Features 1–6:** Map to Tahun 1 through Tahun 6 curriculum skills (e.g. observation, timeline sequence, basic structural shapes, primary color harmonies).
- **Feature 7:** Designated as Capstone Boss (`isFinalBoss: true`, gold badge styling, "Cabaran Unggul").

### 3. Mission Linking & Feature Availability
- **Feature 1:** Has `hasMission: true` with target lesson links:
  - Jupiter Feature 1: `targetLessonSlug: "10-1-sains-benda-hidup"`
  - Saturn Feature 1: `targetLessonSlug: "11-1-sejarah-garis-masa"`
  - Uranus Feature 1: `targetLessonSlug: "12-1-rbt-bentuk-asas"`
  - Neptune Feature 1: `targetLessonSlug: "13-1-psv-warna-imaginasi"`
- **Features 2–7:** `hasMission: false` with complete cartographic profiles, coordinates, descriptions, and learning badges for exploration.

## Impacted Files
- `src/lib/kids/planets.ts`
- `src/__tests__/kids/planets.test.ts`
- `src/__tests__/kids/planetary-hud.test.tsx`
