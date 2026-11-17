# Phase 18: Planetary Texture & Asset Pipeline — Context

**Gathered:** 2026-11-17  
**Status:** Locked & Decided

<domain>
Asset management, equirectangular planetary texture maps, image compression optimization, and open-source attribution for Three.js 3D rendering.
</domain>

<canonical_refs>
- `how-big-is-big/maps/` — Source textures: `mercury.jpg`, `venus.jpg`, `mars.jpg`, `jupiter.jpg`, `saturn.jpg`, `neptune.jpg`, `CREDITS.md`
- `public/images/planets/` — Target directory for bundled textures and `ATTRIBUTION.md`
- `src/components/kids/planets/planet-cartography-scene.ts` — Texture loading and resolution mapping
- `src/components/kids/planets/solar-system-scene.ts` — Solar system 3D scene texture references
</canonical_refs>

<decisions>
### 1. Texture Resolution & Optimization Target
- **Decision:** Resize large source maps from `how-big-is-big/maps/` to 2048x1024 with 85% JPEG quality via `ffmpeg`.
- **Rationale:** Preserves ultra-crisp spherical detail when mapped onto Three.js sphere geometries while keeping total asset payload to ~1.5 MB total across all 6 bodies, well within the static bundle budget and fast for mobile devices (320px–428px).

### 2. Uranus Treatment
- **Decision:** Uranus will use a procedural soft cyan atmosphere shader / MeshStandardMaterial (#b8e8ee / #9ed5de) rather than a photographic bitmap, matching both real astronomical data (Uranus has virtually zero surface features) and `how-big-is-big` design.

### 3. Licensing & Attribution
- **Decision:** Copy `how-big-is-big/maps/CREDITS.md` details into `public/images/planets/ATTRIBUTION.md`.
- **Attribution Text:** Solar System Scope (https://www.solarsystemscope.com/textures/), CC BY 4.0 license, derived from NASA mission imagery.
</decisions>

<code_context>
- `public/images/planets/` currently holds legacy textures for `earth.jpg`, `earth_clouds.jpg`, `mars.jpg`, `mercury.jpg`, `moon.jpg`, `sun.jpg`, and `venus_surface.jpg`.
- New textures to add/replace:
  - `mercury.jpg`: Replace with Solar System Scope 2K
  - `venus_surface.jpg` / `venus.jpg`: Update with Solar System Scope cloud tops 2K
  - `mars.jpg`: Replace with Solar System Scope 2K
  - `jupiter.jpg`: Add Solar System Scope 2K
  - `saturn.jpg`: Add Solar System Scope 2K
  - `neptune.jpg`: Add Solar System Scope 2K
- Earth and Moon existing NASA textures remain untouched.
</code_context>
