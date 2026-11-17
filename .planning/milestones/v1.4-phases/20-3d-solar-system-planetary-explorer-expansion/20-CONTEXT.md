# Phase 20: 3D Solar System & Planetary Explorer Expansion — Context

**Gathered:** 2026-11-17  
**Status:** Locked & Decided

<domain>
Three.js WebGL scenes, 3D celestial cartography, orbital mechanics, planetary ring geometry, and camera controls in Sekolah Prompt-Fu.
</domain>

<canonical_refs>
- `src/components/kids/planets/solar-system-scene.ts` — 3D Solar System overview scene
- `src/components/kids/planets/planet-cartography-scene.ts` — 3D Planet inspection & cartography scene
- `src/components/kids/planets/planetary-explorer.tsx` — Main explorer controller and scene switcher
- `public/images/planets/` — 2K equirectangular textures for Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Neptune
</canonical_refs>

<decisions>
### 1. Saturn's Ring System Rendering (Least CPU / GPU Cost)
- **Decision:** Use a single lightweight `THREE.RingGeometry` mesh with `THREE.MeshBasicMaterial` (or standard with `side: THREE.DoubleSide`), transparent alpha gradient, and inclined by Saturn's 26.7° tilt (`0.466 rad`).
- **Rationale:** A single 2D ring geometry has minimal vertex count (~32 segments, <100 triangles), consumes negligible CPU/GPU cycles, perfectly renders on mobile/tablets, and avoids heavy procedural shaders or particle loops.

### 2. Solar System Orbital Scaling
- **Decision:** Use a balanced logarithmic visual distance layout (Mercury at ~6.0 up to Neptune at ~46.0 units) so all 9 bodies (Mercury, Venus, Earth+Moon, Mars, Jupiter, Saturn, Uranus, Neptune) are visible, interactive, and easy to click without requiring extreme zoom or causing camera clipping.

### 3. Texture Mapping & Visual Appearance
- **Decision:**
  - Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Neptune all use their newly bundled 2K textures from `public/images/planets/`.
  - Uranus uses procedural soft cyan atmosphere (`#b8e8ee` / `#9ed5de`).
  - Both `solar-system-scene.ts` and `planet-cartography-scene.ts` correctly resolve textures for all 9 bodies.
</decisions>
