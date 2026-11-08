# Phase 09 Plan 01: Planetary Schema & Subject Alignment Summary

**Updated `src/lib/kids/planets.ts` with authentic 5-world subject alignment (Earth = Prompting, Moon = BM, Mars = English, Venus = Matematik, Mercury = Moral) and 35 cartographic features mapped to Tahun 1-6 with Feature 7 as Capstone Boss, verified by a comprehensive Vitest test suite.**

## Frontmatter

- **phase:** `09-planetary-schema-subject-alignment`
- **plan:** `01`
- **subsystem:** `curriculum-cartography`
- **tags:** `[planets, cartography, schema, kssr, subjects, tdd]`
- **status:** `complete`
- **dependency graph:**
  - **requires:** `[]`
  - **provides:** `[PLANET_WORLDS, latLonToVector3, getPlanetWorld, getAllPlanetFeatures, getFeatureBySlug, getFeaturesByPlanet]`
  - **affects:** `[src/lib/kids/planets.ts, src/__tests__/kids/planets.test.ts]`
- **tech-stack:**
  - **added:** `[]`
  - **patterns:** `[TDD RED/GREEN, Spherical-to-Cartesian 3D math, Strongly typed cartographic models]`
- **key-files:**
  - **created:**
    - `src/__tests__/kids/planets.test.ts`
  - **modified:**
    - `src/lib/kids/planets.ts`
- **decisions:**
  - Locked 1-to-1 planetary subject mapping per D-01: Earth (`earth-prompting`), Moon (`moon-bm`), Mars (`mars-english`), Venus (`venus-matematik`), Mercury (`mercury-moral`).
  - Exactly 7 features per planet per D-03: Features 1-6 map to Tahun 1-6 (`isFinalBoss: false`), Feature 7 maps to Year 6 Mastery / Capstone Boss (`isFinalBoss: true`, `featureNumber: 7`).
  - Fully bilingual metadata (`name`, `nameMs`, `description`, `descriptionMs`, `badge`, `badgeMs`, `geologicalProfile`, `geologicalProfileMs`) and coordinates (`lat`, `lon`, `radiusDeg`, `elevation`) for all 35 features per D-02 and D-05.
  - Implemented `latLonToVector3` converting spherical geographic coordinates to Three.js Cartesian space with magnitude safety and clamping.
- **metrics:**
  - **duration:** `~5 minutes`
  - **completed:** `2026-11-08`
- **actuals:**
  - **tokens:** `41000`
  - **tasks:** `2`
  - **commits:** `2`

---

## What Was Built

1. **Unit Test Suite (`src/__tests__/kids/planets.test.ts`)**:
   - 15 unit test cases validating:
     - 5 planetary worlds and subject mappings (`prompting`, `bm`, `english`, `matematik`, `moral`).
     - Exactly 7 features per world (total 35) with proper Tahun 1-6 mapping and Capstone Boss flags.
     - Coordinate range limits (lat in `[-90, 90]`, lon in `[-180, 180]`).
     - Non-empty bilingual content in MS and EN across all features.
     - `latLonToVector3` mathematical accuracy (poles, equator, magnitude preservation).
     - Query helpers `getPlanetWorld`, `getAllPlanetFeatures`, `getFeatureBySlug`, and `getFeaturesByPlanet`.

2. **Planetary Schema Refactoring (`src/lib/kids/planets.ts`)**:
   - Refined TypeScript types: `SubjectId`, `PlanetId`, `GeoCoordinates`, `Vector3D`, `PlanetFeature`, `Planet`.
   - Populated `PLANET_WORLDS` constant with all 5 worlds and 35 authentic geological features drawn from planetary cartography mockups:
     - **Mercury (`mercury-moral`)**: Borealis Planitia, Rembrandt Basin, Beethoven Basin, Rachmaninoff Basin, Raditladi Basin, Antipodal Weird Terrain, Caloris Planitia (Capstone Boss).
     - **Venus (`venus-matematik`)**: Sedna Planitia, Atalanta Planitia, Aphrodite Terra, Beta Regio, Lada Terra, Ishtar Terra, Maxwell Montes (Capstone Boss).
     - **Earth (`earth-prompting`)**: Africa, Asia, Europe, North America, South America, Oceania, Antarctica (Capstone Boss).
     - **Moon (`moon-bm`)**: Oceanus Procellarum, Imbrium Basin, Eastern Maria, Near-Side Highlands, Far-Side Highlands, Near-Side Northern Highlands, South Pole-Aitken (Capstone Boss).
     - **Mars (`mars-english`)**: Elysium Planitia, Valles Marineris, Syrtis Major, Hellas Planitia, Tharsis Rise, Arabia Terra, Olympus Mons (Capstone Boss).
   - Mathematical helper `latLonToVector3(lat, lon, radius)` converting spherical coordinates to Three.js Cartesian vectors.
   - Query helper functions providing safe access for downstream 3D visualization and curriculum authoring.

---

## Verification

- **Automated Unit Tests:**
  `npx vitest run src/__tests__/kids/planets.test.ts` passed (15/15 tests green).
- **TypeScript Strict Check:**
  `npx tsc --noEmit` passed with 0 errors.
- **Import Closure Check:**
  `node scripts/check-kids-import-closure.js` passed (396 modules visited, closed).
- **Full Test Suite:**
  `npm test` passed (9 test files, 144 tests passed).

---

## Deviations from Plan

None - plan executed exactly as written.

---

## Threat Flags

None identified. No new runtime dependencies or external network endpoints introduced.

---

## Self-Check: PASSED

- FOUND: `src/__tests__/kids/planets.test.ts`
- FOUND: `src/lib/kids/planets.ts`
- FOUND: `62afad9c` (Task 1 commit)
- FOUND: `8789ac52` (Task 2 commit)
