# Phase 09: Planetary Schema & Subject Alignment - Context

**Gathered:** 2026-11-08  
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase establishes the foundational schema, metadata, bilingual content models, and navigation contracts for the planetary system worlds in Sekolah Prompt-Fu. It aligns all celestial bodies with primary subjects, specifies 7 distinct geological features per planet corresponding to Tahun 1–6 (with the 7th feature as Capstone Mastery / Final Boss), and defines the cartographic schema and URL structure before 3D rendering and UI implementation in Phase 10.

</domain>

<decisions>
## Implementation Decisions

### Planetary World & Subject Assignment
- **D-01:** Dedicated 1-to-1 planetary subject mapping:
  - **Earth (Bumi)**: Foundational Prompting / Core 19 Lessons (`earth-prompting`)
  - **Moon (Bulan)**: Bahasa Melayu (`moon-bm`)
  - **Mars (Marikh)**: English Language (`mars-english`)
  - **Venus (Zuhrah)**: Matematik (`venus-matematik`)
  - **Mercury (Utarid)**: Pendidikan Moral (`mercury-moral`) — **Reversibility:** costly — undoing touches curriculum mapping and lesson paths.
- **D-02:** Each planet features an authentic geological palette and celestial metadata:
  - Moon: Slate/silver basalt crust (`#94A3B8`, accent `#38BDF8`)
  - Earth: Verdant blue-marble/atmosphere (`#10B981`, accent `#3B82F6`)
  - Mars: Rust/iron oxide red-orange (`#EF4444`, accent `#F97316`)
  - Venus: Sulfur amber & golden shroud (`#F59E0B`, accent `#FBBF24`)
  - Mercury: Caloris crater basalt & dark charcoal (`#64748B`, accent `#A855F7`)

### 7 Geological Features & Curriculum Mapping
- **D-03:** Each planet contains exactly 7 distinct geological features (drawn from `planets_mockup/planets_features_descriptions.md`):
  - Features 1 to 6 correspond directly to **Tahun 1 through Tahun 6**.
  - Feature 7 is designated as **Capstone Boss / Mastery Arena ("Cabaran Unggul")** requiring combining skills from all years. — **Reversibility:** costly — shapes level indexing and completion gates.
- **D-04:** Minimum of 7 interactive stages (`<Section>`) per lesson unit (e.g. intro story, concept demo, 4 progressive prompt challenges, final mastery check).

### Cartographic Information & Hybrid Schema
- **D-05:** Rich Hybrid Information Model:
  - Every planet and feature card blends authentic planetary cartography (real geological names, coordinates, and physical properties from `planets_mockup/`) with KSSR/KBAT prompt learning objectives and curriculum badges.
  - Fully localized in Bahasa Melayu (`ms`) and English (`en`) without silent English fallback.

### Navigation Hierarchy & Route Structure
- **D-06:** Dedicated Planet-Scoped URL Structure:
  - `/planets` — 3D Solar System Hub (overview of all planets).
  - `/planets/[planetId]` — 3D Cartographic inspection and feature picker (7 regions for Tahun 1-6 + Boss).
  - `/planets/[planetId]/[featureId]` — Specific lesson stage/experience (or linking into `/level/[slug]` while preserving planet context). — **Reversibility:** costly — route changes require updating static export crawler and redirects.

### Builder Discretion
- Specific coordinate mappings and Three.js camera target vectors for each feature hotspot (can be fine-tuned directly from `planets_mockup/*.html`).
- Exact naming of KSSR learning badges and star rewards per stage.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Cartography & Feature Data
- `planets_mockup/planets_features_descriptions.md` — Descriptions, coordinates, and geological details for 7 features on Moon, Mercury, Venus, Mars, and Earth.
- `planets_mockup/earth_cartography.html` — Earth 3D coordinates, shaders, and UI design.
- `planets_mockup/mars_cartography.html` — Mars 3D coordinates and cartographic layout.
- `planets_mockup/venusian_cartography.html` — Venus 3D coordinates and cartographic layout.
- `planets_mockup/lunar_geological_cartography.html` — Moon 3D coordinates and cartographic layout.

### Project Schemas & Requirements
- `.planning/REQUIREMENTS.md` — Active v1.2 requirements (SCHEMA-01, SCHEMA-02, SCHEMA-03, PEDAG-02).
- `src/lib/kids/planets.ts` — Existing planetary world definition file to be updated.
- `src/lib/kids/levels.ts` — Level registry and static slug generation.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/kids/planets.ts`: Already contains base TypeScript interfaces (`Planet`, `PlanetFeature`, `SubjectId`, `PLANET_WORLDS`) which will be refined with the new 7-feature structure, coordinates, and subject mappings.
- `src/lib/i18n/config.ts`: Handles canonical locale resolution (`en` and `ms`).
- `messages/en.json` & `messages/ms.json`: Translation dictionaries for UI labels and titles.

### Established Patterns
- Client-side static export compatibility (`output: 'export'`).
- Rerunnable verification scripts (`scripts/verify-project.js`, `scripts/check-ms-vocabulary.js`).

### Integration Points
- `src/lib/kids/planets.ts` exports helper functions (`getPlanetWorld`, `getAllPlanetFeatures`, `getFeatureBySlug`) consumed by both 3D visualization components and navigation breadcrumbs.

</code_context>

<specifics>
## Specific Ideas
- Visual look and feel inspired by `planets_mockup/` with glassmorphic cards, glowing borders matching planet themes, and bilingual terminology (e.g., *Lautan Procellarum*, *Maxwell Montes*, *Caloris Planitia*).

</specifics>

<deferred>
## Deferred Ideas
- Science as a standalone planet (Science is currently represented on Earth/shared; Mercury is locked as Moral).
- Multiplayer co-op prompt battles across planets.

</deferred>

---

*Phase: 09-planetary-schema-subject-alignment*  
*Context gathered: 2026-11-08*
