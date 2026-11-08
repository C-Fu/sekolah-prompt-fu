---
phase: 10-3d-planetary-explorer-component
plan: 02
subsystem: 3d-graphics
tags:
  - threejs
  - webgl
  - solar-system
  - raycasting
  - pointer-interaction
  - vitest
requires:
  - "10-01"
provides:
  - "solar-system-scene"
  - "planetary-interaction"
affects:
  - "10-04"
tech-stack:
  added: []
  patterns:
    - "Hierarchical scenegraph with Earth-Moon orbital group"
    - "Drag-filter thresholding (<5px displacement, <300ms duration) for OrbitControls vs selection clicks"
    - "NDC bounds-clamped raycasting with zero-dimension container defense"
    - "Bounded delta orbital stepping (T-10-03)"
key-files:
  created:
    - src/components/kids/planets/solar-system-scene.ts
    - src/components/kids/planets/planetary-interaction.ts
    - src/__tests__/kids/solar-system-scene.test.ts
  modified: []
decisions:
  - "D-01: Built solar system overview scenegraph with central Sun, 5 orbital rings, and textured planet meshes including Earth-Moon orbital hierarchy"
  - "D-03: Filtered OrbitControls gestures from clicks using setupDragFilter (<5px, <300ms) and raycasting against planet meshes"
metrics:
  duration: 9m
  completed: "2026-11-08T06:11:38Z"
status: complete
actuals:
  tokens: 5995
  tasks: 2
  commits: 3
  plan_head_before: "ee584862c8b6c6ca28bf6de4659f7d8884c2ac1f"
  plan_head_after: "fb8b48cf5f05251a13f8556153fac4a66b5d66b7"
---

# Phase 10 Plan 02: 3D Solar System Overview & Planetary Interaction Summary

Constructed the interactive 3D Solar System Overview scene and pointer raycasting interaction engine, enabling students to explore the central Sun, view 5 revolving orbital tracks, inspect all primary planets (Mercury, Venus, Earth with orbiting Moon, Mars), and select celestial bodies through gesture-disambiguated pointer clicks.

## Key Changes Implemented

### 1. Solar System Overview Scene (`src/components/kids/planets/solar-system-scene.ts`)
- **Central Sun & Lighting**: Placed emissive Sun sphere (radius 2.2) at origin with `sun.jpg` texture mapping, radiant `PointLight` (color `0xfff7ed`, intensity 2.5), and soft `AmbientLight` (intensity 0.25).
- **Deep Space Starfield**: Generated 2000 points randomly dispersed in a spherical shell [distance 120..350] using `BufferGeometry` and `PointsMaterial`.
- **5 Orbital Tracks**: Built circular 128-segment `LineLoop` tracks for Mercury (dist 6.0), Venus (dist 9.5), Earth (dist 14.5), Mars (dist 20.0), and Moon (dist 1.8 around Earth).
- **Textured Celestial Meshes**: Generated `MeshStandardMaterial` spheres with equirectangular textures loaded via `withBasePath`, assigning planet telemetry (`planetId`, `dist`, `speed`, `angle`) to `userData`.
- **Earth-Moon Scenegraph Hierarchy**: Created an `earthGroup` containing `earthMesh`, the Moon orbital track, and `moonGroup` so the Moon revolves around Earth while Earth orbits the Sun per Decision D-01.
- **Orbital Physics & Animation**: Implemented `updateOrbits` stepping angles by `(speed * delta * 0.4)` with Y-axis axial rotations and mandatory delta clamping (`max 0.1s` per Threat Model T-10-03).
- **Complete GPU Disposal**: Traversed scenegraph upon `dispose()` to free all geometries, materials, and textures without GPU memory retention.

### 2. Pointer Raycasting & Drag Filter Engine (`src/components/kids/planets/planetary-interaction.ts`)
- **Drag Disambiguation (`setupDragFilter`)**: Measures Euclidean distance `Math.hypot(dx, dy)` and elapsed duration between `pointerdown` and `pointerup`. Gestures with distance < 5px and duration < 300ms trigger selection clicks; larger or slower movements are safely discarded as OrbitControls rotation or pan gestures per Decision D-03.
- **Defensive Raycasting (`raycastObjects`)**: Converts pointer coordinates into Normalized Device Coordinates (NDC) in `[-1, 1]`. Defends against division-by-zero on zero-sized containers and clamps coordinates to prevent NaN raycasting vectors per Threat Model T-10-04.
- **Solar System Selector (`raycastSolarSystem`)**: Casts rays through `THREE.Raycaster` against celestial meshes and inspects `userData.planetId`, returning the selected planet slug or `null`.

### 3. Automated Test Suite (`src/__tests__/kids/solar-system-scene.test.ts`)
- Verified 5 celestial meshes matching `PLANET_WORLDS` IDs (`mercury-moral`, `venus-matematik`, `earth-prompting`, `moon-bm`, `mars-english`).
- Verified ascending radial orbit distances (`Mercury < Venus < Earth < Mars`).
- Verified `updateOrbits` updates positions and angles without producing `NaN` or coordinates blowing up under large deltas.
- Verified `setupDragFilter` fires for 2px/150ms clicks and suppresses 25px/400ms drags.
- Verified `dispose()` empties scene children and disposes geometries and materials.
- Verified `raycastObjects` container size defense and `raycastSolarSystem` hit detection.

## Verification Results

1. **Unit Tests**:
   - `npx vitest run src/__tests__/kids/solar-system-scene.test.ts`: Passed (7/7 tests green).
2. **TypeScript Compilation**:
   - `npx tsc --noEmit`: Clean (0 errors).
3. **Kids Import Closure Check**:
   - `npm run check:closure`: Passed (404 modules visited, closure closed).

## Deviations from Plan

None - plan executed exactly as written.

## Threat Model Compliance

- **T-10-03 (DoS / Animation Stall)**: Bounded delta time in `updateOrbits` with `Math.min(Math.max(0, delta), 0.1)` preventing physics explosion or animation freezes when tabs are backgrounded.
- **T-10-04 (Tampering / NaN Raycasting)**: Added bounds clamping `Math.max(-1, Math.min(1, ndc))` and checked container client dimensions `> 0` prior to NDC calculation in `raycastObjects`.
- **T-10-SC (Dependency Tampering)**: Reused verified in-repo Three.js (`three@0.187.0`) without adding external packages.

## Self-Check: PASSED
- [x] `src/components/kids/planets/solar-system-scene.ts` exists on disk.
- [x] `src/components/kids/planets/planetary-interaction.ts` exists on disk.
- [x] `src/__tests__/kids/solar-system-scene.test.ts` exists on disk.
- [x] Task 1 commit `c2112178` exists in git log.
- [x] Task 2 commit `fb8b48cf` exists in git log.
- [x] All 7 automated unit tests passing green.
