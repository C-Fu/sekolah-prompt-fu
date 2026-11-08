# Phase 10 Plan 01: Three.js Bedrock, Spherical Math & Textures Summary

**Installed Three.js 0.187.0, implemented spherical boundary math and cubic ease-out lerp utilities, constructed SSR-safe PlanetaryCanvas with complete GPU resource disposal, and bundled 7 optimized NASA equirectangular textures (< 750 KB total) with CC-BY-4.0 attribution.**

## Frontmatter

- **phase:** `10-3d-planetary-explorer-component`
- **plan:** `01`
- **subsystem:** `3d-graphics`
- **tags:** `[threejs, webgl, cartography, textures, spherical-math, ssr-safe]`
- **status:** `complete`
- **dependency graph:**
  - **requires:** `[PLANET_WORLDS, latLonToVector3, withBasePath]`
  - **provides:** `[PlanetaryCanvas, generateBoundaryPoints, easeOutCubic, normalizeAngle, ExplorerMode, CameraGlideState, FeatureSelection, OrbitAnimationConfig]`
  - **affects:** `[src/components/kids/planets/planetary-canvas.tsx, src/components/kids/planets/planetary-math.ts, src/components/kids/planets/planetary-types.ts, public/images/planets/*]`
- **tech-stack:**
  - **added:** `[three@^0.187.0, @types/three@^0.187.0]`
  - **patterns:** `[Dynamic Client WebGL Lifecycle, GPU Buffer & Texture Disposal Loop, Spherical Haversine Destination Points, Drag-Disambiguated Pointer Interaction]`
- **key-files:**
  - **created:**
    - `src/components/kids/planets/planetary-types.ts`
    - `src/components/kids/planets/planetary-math.ts`
    - `src/components/kids/planets/planetary-canvas.tsx`
    - `src/__tests__/kids/planetary-math.test.ts`
    - `src/__tests__/kids/planetary-canvas.test.tsx`
    - `public/images/planets/ATTRIBUTION.md`
    - `public/images/planets/earth.jpg`
    - `public/images/planets/earth_clouds.jpg`
    - `public/images/planets/moon.jpg`
    - `public/images/planets/mars.jpg`
    - `public/images/planets/mercury.jpg`
    - `public/images/planets/venus_surface.jpg`
    - `public/images/planets/sun.jpg`
  - **modified:**
    - `package.json`
    - `package-lock.json`
- **decisions:**
  - Installed official `three` and `@types/three` at version `0.187.0` verified through package legitimacy audit (Task 1).
  - Designed `PlanetaryCanvas` as client-only (`'use client'`) component with safe fallback for headless/SSR environments and systematic WebGL disposal loop disposing geometries, materials, texture maps, OrbitControls, and ResizeObserver upon unmount per D-04.
  - Implemented `generateBoundaryPoints` using great-circle destination formulas with subtle fractal scarp perturbation, offset by `+0.015` units above base sphere radius to eliminate Z-fighting per D-04 and T-10-01.
  - Sourced 7 authentic NASA / USGS / Solar System Scope textures, downscaled to 1024x512 JPEGs (~730 KB total, under the 800 KB budget) and bundled directly in `public/images/planets/` with `ATTRIBUTION.md` per D-02.
- **metrics:**
  - **duration:** `~10 minutes`
  - **completed:** `2026-11-08`
- **actuals:**
  - **tokens:** `7439`
  - **tasks:** `3`
  - **commits:** `2`
  - **plan_head_before:** `6e749e53f1c87c820b51e7060d726eaa1102de89`
  - **plan_head_after:** `8f656a819f98bfcf2792a956b5e2be1b0f40554a`

---

## What Was Built

1. **Three.js Core Integration & Type Definitions**:
   - Cleanly installed `three` (`^0.187.0`) and `@types/three` (`^0.187.0`) into `package.json`.
   - Defined core domain types in `src/components/kids/planets/planetary-types.ts`: `ExplorerMode`, `CameraGlideState`, `FeatureSelection`, and `OrbitAnimationConfig`.

2. **Spherical Cartography Math Utilities (`src/components/kids/planets/planetary-math.ts`)**:
   - `generateBoundaryPoints(centerLat, centerLon, radiusDeg, sphereRadius, segments)`: Computes great-circle boundary vectors elevated slightly (`sphereRadius + 0.015`) above the globe surface to prevent Z-fighting, with subtle harmonic fractal jitter for realistic geological scarp contours and pole handling for latitude extremes (90° and -90°).
   - `easeOutCubic(t)`: Cubic deceleration curve ($1 - (1 - t)^3$) for smooth camera glide lerps.
   - `normalizeAngle(angleRad)`: Normalizes rotation angles into $[0, 2\pi)$.

3. **SSR-Safe PlanetaryCanvas Component (`src/components/kids/planets/planetary-canvas.tsx`)**:
   - Marked `'use client'` to strictly isolate WebGL rendering from Node.js server passes during static export.
   - Initializes `THREE.Scene`, `PerspectiveCamera` (FOV 45°, near 0.1, far 1000), `WebGLRenderer` (antialias, high-performance power preference), and `OrbitControls` with damping factor 0.05.
   - Binds `ResizeObserver` for dynamic aspect ratio and renderer resizing.
   - Renders requestAnimationFrame loop with frame delta calculation.
   - Full GPU resource cleanup on unmount: stops animation frame, disconnects observer, disposes OrbitControls, traverses scene to dispose all geometries, materials, and textures, disposes WebGLRenderer, and detaches canvas DOM node.

4. **Bundled & Optimized NASA Planetary Textures (`public/images/planets/`)**:
   - 7 equirectangular textures scaled to 1024x512 JPEGs:
     - `earth.jpg` (74.9 KB)
     - `earth_clouds.jpg` (130.3 KB)
     - `moon.jpg` (112.9 KB)
     - `mars.jpg` (89.2 KB)
     - `mercury.jpg` (82.8 KB)
     - `venus_surface.jpg` (102.5 KB)
     - `sun.jpg` (137.5 KB)
   - Total bundle size: **747,662 bytes (~730 KB)**, well under the 800 KB budget.
   - Authored `public/images/planets/ATTRIBUTION.md` documenting CC-BY-4.0 licensing and cartographic provenance from NASA Earth Observatory, USGS Astrogeology, MOLA, MESSENGER, Magellan, SDO, and Solar System Scope.

5. **Automated Unit & Component Tests**:
   - `src/__tests__/kids/planetary-math.test.ts`: 12 tests covering segment counts, closed loop distance, radius elevation offset, polar coordinate stability at 90°/-90°, easeOutCubic curve concavity/clamping, and angle wrapping.
   - `src/__tests__/kids/planetary-canvas.test.tsx`: 7 tests verifying existence of all 7 textures, < 800 KB total size constraint, ATTRIBUTION.md licensing statements, client rendering, children overlay mounting, unmount cleanup, and `onInit`/`onRenderFrame` callbacks.

---

## Verification Results

1. **Package Verification:**
   `npm list three @types/three` confirmed both packages installed at `0.187.0`.
2. **Math Utility Tests:**
   `npx vitest run src/__tests__/kids/planetary-math.test.ts` passed (12/12 tests green).
3. **Canvas & Asset Tests:**
   `npx vitest run src/__tests__/kids/planetary-canvas.test.tsx` passed (7/7 tests green).
4. **TypeScript Strict Type Check:**
   `npx tsc --noEmit` passed with 0 errors.

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Deprecated THREE.Clock replaced with performance.now() delta**
- **Found during:** Task 3 verification
- **Issue:** Three.js 0.187.0 logs a runtime deprecation warning on `THREE.Clock` (`THREE.Clock: This module has been deprecated. Please use THREE.Timer instead`).
- **Fix:** Switched frame delta calculation in `PlanetaryCanvas` to use standard high-precision `performance.now()`, clamped to a 0.1s max delta per frame.
- **Files modified:** `src/components/kids/planets/planetary-canvas.tsx`
- **Commit:** `8f656a81`

---

## Threat Flags

None identified. External package legitimacy verified; textures are local static assets; WebGL lifecycle contains complete unmount disposal preventing memory exhaustion.

---

## Self-Check: PASSED

- FOUND: `src/components/kids/planets/planetary-types.ts`
- FOUND: `src/components/kids/planets/planetary-math.ts`
- FOUND: `src/components/kids/planets/planetary-canvas.tsx`
- FOUND: `src/__tests__/kids/planetary-math.test.ts`
- FOUND: `src/__tests__/kids/planetary-canvas.test.tsx`
- FOUND: `public/images/planets/ATTRIBUTION.md`
- FOUND: `public/images/planets/earth.jpg`
- FOUND: `public/images/planets/earth_clouds.jpg`
- FOUND: `public/images/planets/moon.jpg`
- FOUND: `public/images/planets/mars.jpg`
- FOUND: `public/images/planets/mercury.jpg`
- FOUND: `public/images/planets/venus_surface.jpg`
- FOUND: `public/images/planets/sun.jpg`
- FOUND: `cb0e0fae` (Task 2 commit)
- FOUND: `8f656a81` (Task 3 commit)
