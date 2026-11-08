# Phase 10: 3D Planetary Explorer Component (Three.js) - Context

**Gathered:** 2026-11-08  
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase implements the interactive 3D graphics rendering and user interface for exploring the solar system and inspecting individual planetary worlds in Sekolah Prompt-Fu. It introduces Three.js and OrbitControls into the client-side Next.js static export architecture, provides a high-level 3D Solar System View and a deep 3D Planet Cartography View, downloads and bundles highly optimized NASA-based texture assets directly in the repository under `public/images/planets/`, supports dual interaction (3D sphere raycasting + glassmorphic HUD button selection), and provides smooth cubic ease-out camera glide to region hotspots.

</domain>

<decisions>
## Implementation Decisions

### 1. View Architecture & Navigation Flow
- **D-01:** Hybrid Two-Level Navigation:
  - **Solar System Overview Mode**: Displays the Sun at the center with orbits for Mercury, Venus, Earth (with Moon orbiting), and Mars. Clicking or tapping any planet smoothly transitions and zooms into that world.
  - **Deep Planet Cartography Mode**: Renders the selected celestial sphere with realistic atmospheric tilt, 7 geological boundary rings/hotspot pins, and real-time OrbitControls inspection.
  - Quick-switch back navigation to return from Planet Detail to the Solar System Overview.

### 2. Texture & Visual Asset Strategy
- **D-02:** Optimized External NASA Textures in Git Repo:
  - High-performance, lightweight equirectangular textures downloaded and bundled in `public/images/planets/`:
    - `earth.jpg` (~68 KB) & `earth_clouds.jpg` (~162 KB)
    - `moon.jpg` (~146 KB)
    - `mars.jpg` (~92 KB)
    - `mercury.jpg` (~116 KB)
    - `venus_surface.jpg` (~113 KB)
    - `sun.jpg` (lightweight solar map)
  - Total asset footprint is < 800 KB, ensuring rapid client download without external CDN dependencies or runtime network failures.
  - Attributions documented per CC-BY-4.0 in `public/images/planets/ATTRIBUTION.md`.

### 3. Interaction & Hotspot Selection
- **D-03:** Dual Hotspot Interaction (3D Raycasting + Glassmorphic HUD):
  - Every feature from `src/lib/kids/planets.ts` renders a 3D boundary ring and pulsing surface marker at its calculated `latLonToVector3()` coordinate.
  - Clicking a 3D hotspot marker or clicking the corresponding button in the HUD sidebar highlights the region and triggers a smooth cubic ease-out camera glide focused on that feature.
  - HUD card displays feature name, Tahun badge, KSSR objective, authentic coordinates, elevation, and a "Start Mission" action button.

### 4. Technical Integration & Static Export Safety
- **D-04:** SSR-Safe Dynamic Client Rendering:
  - Three.js components encapsulated with Next.js dynamic client loading (`'use client'`, `next/dynamic` with `ssr: false` or mounted effect checks) so `npm run build` static export never encounters `window` or `document` ReferenceErrors.
  - ResizeObserver-driven WebGL canvas scaling to fit any mobile, tablet, or desktop viewport.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Cartographic & Three.js Reference Implementations
- `planets_mockup/mars_cartography.html` — Camera glide lerp, boundary line generation, starfield, and OrbitControls setup.
- `planets_mockup/earth_cartography.html` — Atmosphere glow shader, clouds layer, and multi-layer texture loader.
- `planets_mockup/venusian_cartography.html` — Atmospheric haze and sulfur surface materials.
- `planets_mockup/lunar_geological_cartography.html` — Lunar basalt materials and crater rim boundary rings.

### Schema & Data Contracts
- `src/lib/kids/planets.ts` — `PLANET_WORLDS`, `PlanetFeature`, `latLonToVector3()`, `getPlanetWorld()`.
- `messages/en.json` & `messages/ms.json` — `kids.planets` dictionary for titles, telemetry labels, and mission buttons.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/kids/planets.ts`: Mathematical coordinate converter and typed 35 feature definitions.
- `src/components/kids/elements/pixel-art.tsx`: Pixel badges, star icons, and Peromfu avatar for HUD cards.
- `src/lib/i18n/config.ts`: Canonical locale handling for bilingual HUD text.

### Established Patterns
- Client-side static export (`output: 'export'`) with unoptimized images.
- Full bilingual next-intl client hooks (`useTranslations("kids.planets")`).

</code_context>

<specifics>
## Specific Ideas
- Glassmorphic HUD styled to match the active planet's theme color (`themeColor`, `accentColor`) with backdrop blur, glowing borders, and smooth transitions.

</specifics>

<deferred>
## Deferred Ideas
- Dynamic VR / WebXR headsets mode.
- Custom WebGL post-processing bloom shaders (can be added later if performance allows).

</deferred>

---

*Phase: 10-3d-planetary-explorer-component*  
*Context gathered: 2026-11-08*
