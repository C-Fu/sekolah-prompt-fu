---
phase: 10-3d-planetary-explorer-component
plan: 03
subsystem: 3d-graphics
tags:
  - threejs
  - webgl
  - cartography
  - glassmorphic-hud
  - next-intl
  - camera-glide
  - vitest
requires:
  - "10-01"
provides:
  - "planet-cartography-scene"
  - "planetary-hud"
affects:
  - "10-04"
tech-stack:
  added: []
  patterns:
    - "Equirectangular celestial globe with secondary atmospheric cloud layer"
    - "Additive atmospheric rim glow custom ShaderMaterial"
    - "Great-circle spherical boundary rings elevated at sphereRadius + 0.015 to prevent Z-fighting (D-03)"
    - "Pulsing surface beacon pins elevated at sphereRadius + 0.025 with emissive glow"
    - "Cubic ease-out camera glide lerp to feature coordinates with touch interruption handling (Pattern 4)"
    - "Tailwind glassmorphic responsive HUD overlay with next-intl bilingual support"
key-files:
  created:
    - src/components/kids/planets/planet-cartography-scene.ts
    - src/components/kids/planets/planetary-hud.tsx
    - src/__tests__/kids/planetary-hud.test.tsx
  modified: []
decisions:
  - "D-01: Rendered detailed planetary cartography globe with 7 authentic geological boundary rings and beacon pins for any selected world"
  - "D-03: Designed glassmorphic HUD overlay with responsive province sidebar (Tahun 1-6 & Capstone Boss badges) and 2x2 telemetry card with cubic ease-out camera glide"
metrics:
  duration: 10m
  completed: "2026-11-08T06:12:33Z"
status: complete
actuals:
  tokens: 6858
  tasks: 2
  commits: 4
  plan_head_before: "ee584862c8b6c6ca28bf6de4659f7d8884c2ac1f"
  plan_head_after: "b7c8b3ad4ef9827532e87b1bde2f86cc0d46dd1d"
---

# Phase 10 Plan 03: Planet Cartography 3D Scene & Glassmorphic Telemetry HUD Summary

Constructed the deep 3D Planet Cartography scene and the glassmorphic telemetry HUD overlay, rendering celestial planetary globes with equirectangular NASA textures, 7 authentic geological boundary rings, pulsing hotspot beacon pins, smooth cubic ease-out camera glide lerp, and responsive localized telemetry cards.

## Key Changes Implemented

### 1. Planet Cartography 3D Scene (`src/components/kids/planets/planet-cartography-scene.ts`)
- **Textured Celestial Sphere**: Built base globe geometry (radius 4.8, 128x64 SphereGeometry) textured via `TextureLoader` with equirectangular NASA maps (`earth.jpg`, `moon.jpg`, `mars.jpg`, `mercury.jpg`, `venus_surface.jpg`) loaded through `withBasePath`.
- **Atmospheric Cloud Layer**: Added an outer cloud sphere (radius 4.83) for Earth with `earth_clouds.jpg`, transparent opacity 0.5, and independent orbital rotation.
- **Atmospheric Rim Glow**: Created a custom `ShaderMaterial` on an outer inverted sphere (`radius 4.8 * 1.045`) with additive blending and BackSide culling, radiating a customized glowing rim in `planet.accentColor`.
- **Geological Boundary Loops**: Generated 7 closed spherical boundary loops using `generateBoundaryPoints` (fixed 84 segments for constant vertex memory per Threat Model T-10-05), elevated to 4.815 units to eliminate depth-buffer Z-fighting.
- **Pulsing Surface Beacon Pins**: Elevated beacon pin spheres (radius 0.12) to 4.825 units at each feature's `latLonToVector3` coordinate with emissive glowing materials and user data index bindings.
- **Camera Glide Lerp**: Implemented `focusFeature` using the cubic ease-out lerp pattern (`easeOutCubic`) over ~1.2s to smoothly fly the OrbitControls camera to selected landmarks; attaches an interruption handler to OrbitControls `start` event to abort gliding if the user drags or touches the canvas.
- **Raycasting**: Implemented `raycastFeaturePins` to detect pointer clicks on 3D beacon pins.
- **GPU Disposal**: Implemented full `dispose()` traversing the scene to release geometries, materials, and textures cleanly.

### 2. Glassmorphic Planetary HUD Overlay (`src/components/kids/planets/planetary-hud.tsx`)
- **Top Header**: Placed a "Return to Orbit" navigation button with back-arrow icon and a pulsing celestial status badge (`Bumi // Asas Prompting` or `Earth // Foundational Prompting`).
- **Province List Sidebar (Bottom Left)**: Scrollable list of all 7 features with 2-digit index numbers (`'01'..'07'`), localized feature names, and badges (`Tahun 1-6` or `Capstone Boss` / `Cabaran Unggul`). Highlights active selection with glowing cyan borders and background.
- **Telemetry Detail Card (Bottom Right)**: Displays selected feature title, KSSR skill badge, 2x2 telemetry grid (coordinates, elevation/depth, geological profile, learning objective), narrative description, and a high-contrast "Start Mission" action button styled in the feature's accent color.
- **Glassmorphic & Responsive**: Applied `bg-slate-900/85 backdrop-blur-xl border border-white/10 shadow-2xl` with responsive stacking for mobile screens (< 768px).
- **Full Localization**: Localized all titles, telemetry keys, and badges in Bahasa Melayu and English using `useTranslations('kids.planets')` and active locale.

### 3. Automated Component Test Suite (`src/__tests__/kids/planetary-hud.test.tsx`)
- Verified rendering of Return to Orbit button and `onBackToOrbit` callback.
- Verified rendering of all 7 feature buttons with correct Tahun badges and localized names.
- Verified `onSelectFeature` triggers with target feature object and index upon clicking sidebar buttons.
- Verified authentic coordinates, elevation, description, and KSSR objective in the telemetry card.
- Verified "Start Mission" action button triggers `onLaunchMission`.
- Verified bilingual Bahasa Melayu localization under `ms` locale with Malay titles, badges, and buttons.

## Verification Results

1. **Component Unit Tests**:
   - `npx vitest run src/__tests__/kids/planetary-hud.test.tsx`: Passed (6/6 tests green).
2. **TypeScript Compilation**:
   - `npx tsc --noEmit`: Clean (0 errors).
3. **Malay Vocabulary Guard**:
   - `npm run check:vocab`: Clean (0 violations).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Scoped DOM assertions for localized planet and feature names in unit test**
- **Found during:** Task 2 test run
- **Issue:** `screen.getByText(/Marikh/i)` and `screen.getByText(activeFeature.nameMs)` failed due to multiple matches because the celestial body and feature names appear in both the header/sidebar and the narrative telemetry description card.
- **Fix:** Switched to scoped query on `screen.getByTestId('telemetry-card')` and `getAllByText` for the header element.
- **Files modified:** `src/__tests__/kids/planetary-hud.test.tsx`
- **Commit:** `b7c8b3ad`

## Threat Model Compliance

- **T-10-05 (Denial of Service)**: Enforced bounded line vertex buffer allocation (fixed 84 segments per boundary ring in `generateBoundaryPoints`) ensuring constant memory footprint across all features.
- **T-10-06 (Spoofing / Injection)**: Strict React JSX text escaping for all telemetry strings and typed `PlanetFeature` models preventing HTML/script injection.
- **T-10-SC (Dependency Tampering)**: Zero external package additions; reused verified Three.js (`three@0.187.0`).

## Self-Check: PASSED
- [x] `src/components/kids/planets/planet-cartography-scene.ts` exists on disk.
- [x] `src/components/kids/planets/planetary-hud.tsx` exists on disk.
- [x] `src/__tests__/kids/planetary-hud.test.tsx` exists on disk.
- [x] Task 1 commit `152dbda9` exists in git log.
- [x] Task 2 commit `b7c8b3ad` exists in git log.
- [x] All 6 automated unit tests passing green.
