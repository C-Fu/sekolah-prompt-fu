# Phase 11: Game Flow & Rocket Navigation - Context

**Gathered:** 2026-11-08  
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase establishes the cohesive player flow connecting the Title Screen, Earth's foundational prompt learning curriculum, the 3D Planetary Explorer, and return navigation. It provides dual entry paths on the Title Screen, integrates a grand pixel-art Rocket launch sequence upon Earth curriculum completion (and inside lesson headers), redirects the primary Map navigation to `/planets` while preserving Earth's 2D world map, and routes planet feature "Start Mission" actions to their designated curriculum experiences.

</domain>

<decisions>
## Implementation Decisions

### 1. Title Screen Dual Entry (FLOW-01)
- **D-01:** On the Title Screen (`KidsHomeContent` step 2), offer two distinct, prominent buttons:
  - **"Mula di Bumi (Asas Prompt) / Start on Earth (Prompting 101)"**: Direct entry to Level 1-1 (`/level/1-1-meet-peromfu`) or Earth's world map.
  - **"Terokai Sistem Suria (Planet 3D) / Explore Solar System (3D Planets)"**: Direct entry to `/planets` (3D Solar System View).
- **D-02:** Add an informative banner or badge indicating Earth is the foundational academy that unlocks the wider cosmos.

### 2. Grand Rocket Launch Overlay (FLOW-03)
- **D-03:** Construct a pixel-art Rocket Launch component (`PixelRocketLaunch` / `RocketReturnModal`):
  - When completing Earth's final graduation lesson (`5-4-graduation-day`), the `LevelComplete` banner displays a special "Launch Rocket to Space / Lancar Roket ke Angkasa" button.
  - Clicking launches a full-screen retro pixel rocket countdown animation (3... 2... 1... BLAST OFF!) with smoke particles, sound effect triggers, and Peromfu in the cockpit, smoothly redirecting the player to `/planets`.
- **D-04:** Provide an accessible Rocket icon in the lesson header navigation when on Earth levels that allows jumping back to the Space Hub at any time.

### 3. Header & Route Navigation Harmonization (FLOW-02)
- **D-05:** Update Header Navigation:
  - The main Map icon in `KidsHeader` routes to `/planets` (the central 3D space hub).
  - In `PlanetaryExplorer`, selecting Earth gives options to either view Earth's 7 macro features or enter the 5-world Prompting Academy map (`/map`).
  - On `/map` (Earth World Map), add a clear "To Solar System / Ke Sistem Suria" button with a rocket icon.

### 4. Planet Feature Launch Routing
- **D-06:** Wire `onLaunchMission` in `PlanetaryExplorer`:
  - When on Earth (`earth-prompting`): launches into the appropriate core prompting level or map.
  - When on Moon, Mars, Venus, Mercury: routes to the corresponding subject lesson (or placeholder mission briefing for future standards) while preserving the active planet theme context.

### Builder Discretion
- Pixel art rocket animation timing (2.5 - 3.5 seconds countdown and lift-off).
- Particle styling for rocket thrust (pixel orange/yellow flames and gray smoke).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Key Components & Layouts
- `src/components/kids/layout/kids-home-content.tsx` — Title Screen entry steps and CTA buttons.
- `src/components/kids/layout/kids-header.tsx` — Navigation header with map/home links.
- `src/components/kids/elements/level-complete.tsx` — Level completion modal and next-level buttons.
- `src/components/kids/planets/planetary-explorer.tsx` — 3D Solar system & planet cartography orchestrator.
- `src/app/planets/page.tsx` — Standalone planets route.

### Translations & Assets
- `messages/en.json` & `messages/ms.json` — `kids.home`, `kids.levelComplete`, `kids.planets`, `kids.navigation`.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/kids/elements/pixel-art.tsx`: Pixel art primitives (`PixelRobot`, `PixelStar`, `PixelCastle`).
- `src/lib/kids/levels.ts`: Level querying (`getLevelBySlug`, `getAdjacentLevels`, `getWorlds`).
- `src/lib/kids/planets.ts`: Planetary worlds and feature schema.

### Established Patterns
- Client-side navigation via `next/link` and `next/navigation` (`useRouter`).
- Pure CSS pixel animations and keyframes in `src/app/globals.css`.

</code_context>

<specifics>
## Specific Ideas
- Pixel-art rocket sprite styled in the same 8-bit/16-bit retro aesthetic as Peromfu, with animated thrust flames on launch.

</specifics>

<deferred>
## Deferred Ideas
- 3D WebGL rocket flight mini-game between planets (keep as 2D pixel-art launch animation).

</deferred>

---

*Phase: 11-game-flow-rocket-navigation*  
*Context gathered: 2026-11-08*
