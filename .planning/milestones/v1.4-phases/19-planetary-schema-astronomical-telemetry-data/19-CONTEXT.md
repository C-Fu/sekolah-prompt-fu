# Phase 19: Planetary Schema & Astronomical Telemetry Data — Context

**Gathered:** 2026-11-17  
**Status:** Locked & Decided

<domain>
Planetary data modeling, TypeScript schemas, astronomical telemetry (radius, distance, speed, orbital period), and bilingual field notes (English & Bahasa Melayu) from `how-big-is-big`.
</domain>

<canonical_refs>
- `how-big-is-big/src/bodies.js` — Source for astronomical constants, `BODIES`, `LEARN`, and `JUMP`
- `src/lib/kids/planets.ts` — Target schema and planetary definitions
- `messages/en.json` & `messages/ms.json` — Translation bundles
</canonical_refs>

<decisions>
### 1. Planetary Schema Extension
- **Decision:** Extend `PlanetId` with `"jupiter-astronomy" | "saturn-astronomy" | "uranus-astronomy" | "neptune-astronomy"`. Extend `SubjectId` with `"astronomy"`.
- **Structure:** Outer planets will be defined in `PLANET_WORLDS` with `features: []`, `subjectId: "astronomy"`, and distinct celestial themes.
- **Backward Compatibility:** All existing 5 curriculum planets (Earth, Moon, Mars, Venus, Mercury) and their 35 geological features and KSSR Year 1–6 links remain completely intact.

### 2. Telemetry & Field Notes Schema
- **Decision:** Add fields to `Planet` interface:
  - `radiusKm`: number (authentic radius)
  - `distanceFromSun`: { km: number; au: number; lightTime: string; lightTimeMs: string }
  - `primaryFact`: string; `primaryFactMs`: string (from `BODIES.fact`)
  - `fieldNotes`: Array<{ title: string; titleMs: string; note: string; noteMs: string }> (from `LEARN`)
  - `jumpDistance`: { big: string; bigMs: string; small: string; smallMs: string } (from `JUMP`)

### 3. Bahasa Melayu Localization Quality
- **Decision:** Translate all facts and field notes into natural, child-friendly Bahasa Melayu with accurate scientific terms (*kawah, angin supersonik, bintik merah gergasi, gelang ais, atmosfera nipis*), avoiding robotic transliteration or silent fallbacks.
</decisions>
