# Phase 11: Game Flow & Rocket Navigation - Research

**Researched:** 2026-11-08  
**Domain:** Frontend UI / React 19 / Next.js 16 Navigation / Pixel Art Components / Bilingual Localization  
**Confidence:** HIGH  

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01: Title Screen Dual Entry (FLOW-01)**
  - On the Title Screen (`KidsHomeContent` step 2), offer two distinct, prominent buttons:
    - **"Mula di Bumi (Asas Prompt) / Start on Earth (Prompting 101)"**: Direct entry to Level 1-1 (`/level/1-1-meet-peromfu`) or Earth's world map.
    - **"Terokai Sistem Suria (Planet 3D) / Explore Solar System (3D Planets)"**: Direct entry to `/planets` (3D Solar System View).
  - Add an informative banner or badge indicating Earth is the foundational academy that unlocks the wider cosmos.

- **D-02: Foundational Academy Distinction**
  - Clarify visually that Earth's 5 worlds teach core AI prompting skills, while the wider solar system explores subject-specific missions (Bahasa Melayu, Mathematics, English, Moral Education).

- **D-03: Grand Rocket Launch Overlay (FLOW-03)**
  - Construct a pixel-art Rocket Launch component (`PixelRocketLaunch` / `RocketLaunchOverlay`):
    - When completing Earth's final graduation lesson (`5-4-graduation-day`), the `LevelComplete` banner displays a special "Launch Rocket to Space / Lancar Roket ke Angkasa" button.
    - Clicking launches a full-screen retro pixel rocket countdown animation (3... 2... 1... BLAST OFF!) with smoke particles, sound effect triggers, and Peromfu in the cockpit, smoothly redirecting the player to `/planets`.

- **D-04: Header Quick Rocket Navigation**
  - Provide an accessible Rocket icon/button in the navigation header (`KidsHeader`) when on Earth levels that allows jumping to the Space Hub (`/planets`) at any time.

- **D-05: Header & Route Navigation Harmonization (FLOW-02)**
  - Update Header Navigation:
    - The main Map icon in `KidsHeader` routes to `/planets` (the central 3D space hub) or adds a dedicated rocket button.
    - In `PlanetaryExplorer`, selecting Earth gives options to either view Earth's 7 macro features or enter the 5-world Prompting Academy map (`/map`).
    - On `/map` (Earth World Map), add a clear "To Solar System / Ke Sistem Suria" button/banner with a rocket icon.

- **D-06: Planet Feature Launch Routing**
  - Wire `onLaunchMission` in `PlanetaryExplorer`:
    - When on Earth (`earth-prompting`): launches into the appropriate core prompting level or map (`/map` or `/level/1-1-meet-peromfu`).
    - When on Moon, Mars, Venus, Mercury: routes to the corresponding subject lesson (e.g. `/level/6-1-bm-kucing-peromfu`, `/level/8-1-matematik-tambah-bintang`, `/level/9-1-english-colorful-toys`, `/level/10-1-moral-sahabat-prihatin`) while preserving active context.

### Builder Discretion
- Pixel art rocket animation timing (2.5 - 3.5 seconds countdown and lift-off sequence).
- Particle styling for rocket thrust (pixel orange/yellow flames and white/gray billowing smoke).
- Sound effect trigger points (optional audio hook integration with fallback if audio muted).

### Deferred Ideas (OUT OF SCOPE)
- 3D WebGL rocket flight mini-game between planets (retain as 2D retro pixel-art launch animation).
- Full multiplayer or cloud progress sync for rocket launches.

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FLOW-01 | Title Screen Dual Entry CTA (Earth Foundational Academy vs 3D Solar System) | Researched in `KidsHomeContent`, step 2 layout, responsive flex/grid, pixel button styling, and badge semantics. |
| FLOW-02 | Space Hub & Earth World Map Navigation Harmonization (`KidsHeader`, `/map`, `PlanetaryExplorer`) | Researched `KidsHeader` desktop & mobile menus, `/map` banner overlay, and `PlanetaryExplorer` back-to-map vs feature launch options. |
| FLOW-03 | Retro Pixel Rocket Launch Overlay (`PixelRocket`, `RocketLaunchOverlay`, `LevelComplete`) | Researched SVG pixel grid for rocket sprite, CSS keyframe animations for countdown and blast-off thrust, and `5-4-graduation-day` integration. |
| FLOW-04 | Planet Feature Mission Routing (`PlanetaryExplorer` `onLaunchMission`) | Researched mapping between `PlanetId` (`moon-bm`, `mars-english`, `venus-matematik`, `mercury-moral`, `earth-prompting`) and existing curriculum slugs in `src/lib/kids/levels.ts`. |
| FLOW-05 | Full Bilingual Locale Parity (`messages/en.json` & `messages/ms.json`) | Verified zero missing keys, verified vocabulary constraints (e.g. `tahap` vs `level`, zero English residuals), verified `check:vocab`. |
</phase_requirements>

---

## Summary

Phase 11 connects the player's journey from the Title Screen into the Earth Prompting Academy, through the graduation milestone, and onward to the 3D Solar System Explorer. Currently, players starting the game flow directly to `/map`, with no direct discovery of `/planets`, and completing the final Earth lesson (`5-4-graduation-day`) simply loops back to `/map`.

This research investigates the exact components, routing hooks, pixel assets, animations, and i18n keys needed to implement seamless navigation loops. Key discoveries:
1. **Title Screen (`KidsHomeContent`)**: Step 2 can cleanly host dual CTAs ("Mula di Bumi / Start on Earth" pointing to `/map` and "Terokai Sistem Suria / Explore Solar System" pointing to `/planets`), accompanied by an academy info badge.
2. **Pixel Rocket Sprite & Launch Overlay (`RocketLaunchOverlay`)**: A reusable retro pixel-art SVG rocket component (`PixelRocket`) in `src/components/kids/elements/pixel-art.tsx`, with a modal/overlay component (`RocketLaunchOverlay`) handling countdown (3.. 2.. 1.. Blast Off!), thruster flame/smoke CSS animations, and router push to `/planets`.
3. **Graduation Integration (`LevelComplete`)**: Level 5-4 (`5-4-graduation-day`) is the Earth graduation capstone. `LevelComplete` can detect when `levelSlug === "5-4-graduation-day"` and display the special "Lancar Roket ke Angkasa / Launch Rocket to Space" CTA triggering the overlay.
4. **Header & Map Harmonization**: `KidsHeader` can feature a dedicated rocket icon leading to `/planets`, and the world map (`ProgressMap`) can include a top floating banner/button "Ke Sistem Suria / To Solar System" so players are never trapped in 2D Earth mode.
5. **Feature Launch Routing in `PlanetaryExplorer`**: Earth features can route to `/map`, while Moon, Mars, Venus, and Mercury map to their registered Subject Worlds (World 6 `6-1-bm-kucing-peromfu`, World 8 `8-1-matematik-tambah-bintang`, World 9 `9-1-english-colorful-toys`, World 10 `10-1-moral-sahabat-prihatin`).

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Dual Title CTAs | Client Component (`KidsHomeContent`) | Next.js Router (`next/link`) | Interactive step-based onboarding screen rendering localized client links. |
| Rocket Sprite SVG | UI Component (`pixel-art.tsx`) | Tailwind / Inline SVG | 16-bit pixelated rendering consistent with Peromfu and existing game elements. |
| Rocket Launch Overlay | Client Component (`RocketLaunchOverlay`) | Next.js Navigation (`useRouter`) | State machine managing countdown timer, CSS particle animation, and programmatic route transition. |
| Graduation Launch Trigger | UI Component (`LevelComplete`) | State / Props | Injected into graduation level completion modal; opens `RocketLaunchOverlay`. |
| Header Space Hub Quick Link | Client Component (`KidsHeader`) | Next.js Router (`next/link`) | Global header navigation updated on desktop and mobile dropdown. |
| World Map Space Portal | Client Component (`ProgressMap`) | Next.js Router (`next/link`) | Top floating portal banner on 2D map linking to `/planets`. |
| Planetary Feature Mission Routing | Client Component (`PlanetaryExplorer`) | Next.js Navigation (`useRouter`) | Resolves `planet.id` and `feature.id` to specific level route `/level/[slug]`. |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | 16.0.10 | Framework & App Router (`useRouter`, `Link`) | [VERIFIED: package.json:32] Native routing and client-side page transitions. |
| `react` | 19.2.0 | UI rendering & state hooks (`useState`, `useEffect`) | [VERIFIED: package.json:35] Project UI runtime. |
| `next-intl` | 4.5.8 | Bilingual localization (`useTranslations`, `useLocale`) | [VERIFIED: package.json:33] Established i18n solution with zero layout shifts. |
| `tailwindcss` | 4.x | Utility classes & CSS animation | [VERIFIED: package.json:59] Project styling engine. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `clsx` / `tailwind-merge` | ^2.1.1 / ^3.4.0 | Class name utility (`cn`) | Dynamic conditional classes for animation states. |
| `vitest` | 2.1.9 | Component & unit testing | Automated test verification (`npm test`). |
| `@testing-library/react` | ^16.1.0 | React DOM testing utilities | Testing user events, buttons, and countdown timers. |

---

## Package Legitimacy Audit

No external packages are required for this phase. All features will be built using existing project dependencies (`next`, `react`, `next-intl`, `tailwindcss`, `vitest`).

---

## Architecture Patterns

### System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  TITLE SCREEN                                     |
|                              (KidsHomeContent)                                    |
|                                                                                   |
|      [Mula di Bumi / Start on Earth]            [Terokai Sistem Suria / 3D Hub]   |
+---------------------+---------------------------------------------+---------------+
                      |                                             |
                      v                                             v
         +--------------------------+                  +-------------------------+
         |      EARTH MAP /         |                  |   3D PLANETARY HUB      |
         |    PROMPTING ACADEMY     |                  |       (/planets)        |
         |         (/map)           |                  |                         |
         +------------+-------------+                  +------------+------------+
                      |                                             |
        [Level Progression 1-1..5-4]                     [Select Planet & Feature]
                      |                                             |
                      v                                             v
         +--------------------------+                  +-------------------------+
         |     GRADUATION LEVEL     |                  | PLANETARY MISSION LAUNCH|
         |   (5-4-graduation-day)   |                  | (Moon/Mars/Venus/Utarid)|
         +------------+-------------+                  +------------+------------+
                      |                                             |
            [LevelComplete Modal]                                   |
         "Lancar Roket ke Angkasa!"                                 |
                      |                                             |
                      v                                             |
         +--------------------------+                               |
         |   ROCKET LAUNCH OVERLAY  |                               |
         | (3..2..1..Blast Off SVG) |                               |
         +------------+-------------+                               |
                      |                                             |
                      +---------------------------------------------+
```

### Component Structure & Responsibilities

1. **`src/components/kids/elements/pixel-art.tsx`**
   - Add `PixelRocket`: A multi-colored 16-bit retro rocket sprite with Peromfu visible in the cockpit window, aerodynamic fins, and optional thruster flame elements.
   - Add `PixelRocketIcon`: Compact 16x16 icon for buttons in headers and map banners.

2. **`src/components/kids/elements/rocket-launch-overlay.tsx` (NEW)**
   - Client component rendering a full-screen retro overlay (`fixed inset-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md`).
   - Countdown state: 3 → 2 → 1 → "BLAST OFF!" / "BERLEPAS!".
   - Rocket lift-off animation: moves from center screen upwards past top of viewport with expanding flame & billowing smoke particles.
   - Sounds/haptics trigger callback hooks.
   - On completion (~3 seconds), triggers `router.push('/planets')` and unmounts.
   - Accessible skip button for quick navigation or reduced motion preference.

3. **`src/components/kids/layout/kids-home-content.tsx`**
   - Step 2 update:
     - Replace single "Start Playing!" button with dual prominent buttons:
       1. Primary Green Pixel Button: "Mula di Bumi (Asas Prompt) / Start on Earth (Prompting 101)" -> links to `/map`.
       2. Secondary Blue/Cyan Pixel Button: "Terokai Sistem Suria (Planet 3D) / Explore Solar System (3D Planets)" -> links to `/planets`.
     - Informational badge explaining that Earth is the foundation for the entire solar system.

4. **`src/components/kids/layout/kids-header.tsx`**
   - Header navigation update:
     - Add rocket quick-launch button (icon `PixelRocketIcon`, label tooltip "Sistem Suria / Solar System") pointing directly to `/planets`.
     - In mobile dropdown, include distinct links for both "Peta Dunia (Bumi) / World Map (Earth)" and "Sistem Suria 3D / 3D Solar System".

5. **`src/components/kids/elements/progress-map.tsx`**
   - Top portal banner:
     - Render a floating pixel panel badge: "🚀 Ke Sistem Suria / To Solar System" in the upper corner of the map.
     - When clicked, opens the rocket launch sequence or navigates directly to `/planets`.

6. **`src/components/kids/elements/level-complete.tsx`**
   - Inspect `levelSlug`:
     - If `levelSlug === "5-4-graduation-day"`, render a glowing golden CTA: "Lancar Roket ke Angkasa / Launch Rocket to Space" with `PixelRocketIcon`.
     - Clicking triggers `RocketLaunchOverlay`.

7. **`src/components/kids/planets/planetary-explorer.tsx`**
   - Implement `defaultLaunchMission` handler:
     - If `activePlanet.id === "earth-prompting"`: route to `/map`.
     - If `activePlanet.id === "moon-bm"`: route to `/level/6-1-bm-kucing-peromfu`.
     - If `activePlanet.id === "mars-english"`: route to `/level/9-1-english-colorful-toys`.
     - If `activePlanet.id === "venus-matematik"`: route to `/level/8-1-matematik-tambah-bintang`.
     - If `activePlanet.id === "mercury-moral"`: route to `/level/10-1-moral-sahabat-prihatin`.
     - *Note on curriculum alignment*: Verify mapping between Subject IDs and existing Worlds 6-10 in `src/lib/kids/levels.ts`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Route transitions | Custom window.location manipulation | Next.js `useRouter().push()` / `<Link>` | Preserves client-side Next.js state, prefetching, and avoids full page reloads. |
| Countdown & Particle Timing | Raw setInterval loops with memory leaks | React `useEffect` with clean `setTimeout` / requestAnimationFrame | Avoids state race conditions on unmount and respects reduced-motion. |
| Pixel Art Rendering | Blurry canvas bitmaps | SVG with `imageRendering: "pixelated"` and integer coordinate rects | Crisp at every screen DPI, zero external image assets required, fully responsive. |
| Bilingual Strings | Hardcoded English/Malay ternary strings | `next-intl` translation keys in `messages/*.json` | Enforces vocabulary checks (`npm run check:vocab`) and guarantees zero translation drift. |

---

## Code Examples

### 1. Pixel Art Rocket (`PixelRocket` in `pixel-art.tsx`)

```tsx
export function PixelRocket({ className, showFlames = true }: { className?: string; showFlames?: boolean }) {
  return (
    <svg 
      viewBox="0 0 24 36" 
      className={cn("w-12 h-18", className)}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Nose cone (Red) */}
      <rect x="11" y="2" width="2" height="2" fill="#EF4444" />
      <rect x="10" y="4" width="4" height="2" fill="#EF4444" />
      <rect x="9" y="6" width="6" height="2" fill="#DC2626" />
      
      {/* Main Body (White/Silver) */}
      <rect x="8" y="8" width="8" height="14" fill="#F8FAFC" />
      <rect x="7" y="10" width="1" height="10" fill="#E2E8F0" />
      <rect x="16" y="10" width="1" height="10" fill="#CBD5E1" />
      
      {/* Cockpit Window (Cyan glass with Peromfu eyes) */}
      <rect x="10" y="11" width="4" height="4" fill="#38BDF8" />
      <rect x="11" y="12" width="1" height="1" fill="#0F172A" />
      <rect x="13" y="12" width="1" height="1" fill="#0F172A" />
      <rect x="10" y="11" width="1" height="1" fill="#FFFFFF" />

      {/* Stripe (Yellow / Gold) */}
      <rect x="8" y="17" width="8" height="2" fill="#F59E0B" />

      {/* Fins (Red) */}
      <rect x="5" y="18" width="3" height="4" fill="#EF4444" />
      <rect x="4" y="20" width="1" height="4" fill="#DC2626" />
      <rect x="16" y="18" width="3" height="4" fill="#EF4444" />
      <rect x="19" y="20" width="1" height="4" fill="#DC2626" />

      {/* Thruster Nozzle (Dark Gray) */}
      <rect x="9" y="22" width="6" height="2" fill="#475569" />

      {/* Animated Flames (if active) */}
      {showFlames && (
        <g className="animate-pulse">
          <rect x="10" y="24" width="4" height="4" fill="#F97316" />
          <rect x="11" y="28" width="2" height="4" fill="#FBBF24" />
          <rect x="11" y="32" width="2" height="2" fill="#FEF08A" />
        </g>
      )}
    </svg>
  );
}
```

### 2. Rocket Launch Countdown Overlay (`RocketLaunchOverlay`)

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PixelRocket, PixelStar } from "@/components/kids/elements/pixel-art";

interface RocketLaunchOverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  destination?: string;
}

export function RocketLaunchOverlay({ 
  isOpen, 
  onClose,
  destination = "/planets" 
}: RocketLaunchOverlayProps) {
  const router = useRouter();
  const t = useTranslations("kids.rocketLaunch");
  const [countdown, setCountdown] = useState<number | "blastoff">(3);
  const [isBlasting, setIsBlasting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Sequence: 3 -> 2 -> 1 -> BLAST OFF -> Route transition
    const t1 = setTimeout(() => setCountdown(2), 700);
    const t2 = setTimeout(() => setCountdown(1), 1400);
    const t3 = setTimeout(() => {
      setCountdown("blastoff");
      setIsBlasting(true);
    }, 2100);
    const t4 = setTimeout(() => {
      router.push(destination);
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, destination, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated stars */}
      </div>

      {/* Center Countdown Display */}
      <div className="text-center z-10">
        <h2 className="text-6xl md:text-8xl font-black text-amber-400 pixel-text-shadow animate-bounce">
          {countdown === "blastoff" ? t("blastOff") : countdown}
        </h2>
        <p className="text-xl md:text-2xl text-cyan-300 font-mono mt-4">
          {t("subheading")}
        </p>
      </div>

      {/* Animated Rocket Sprite */}
      <div className={`mt-8 transition-transform duration-1000 ease-in ${isBlasting ? "-translate-y-[150vh] scale-125" : "animate-bounce-slow"}`}>
        <PixelRocket className="w-28 h-42 md:w-36 md:h-54" showFlames={true} />
      </div>

      {/* Skip button */}
      <button 
        onClick={() => router.push(destination)} 
        className="absolute bottom-6 right-6 text-sm text-slate-400 hover:text-white font-mono underline"
      >
        {t("skip")}
      </button>
    </div>
  );
}
```

---

## Common Pitfalls

### Pitfall 1: Router Push During SSR or Premature Navigation
- **What goes wrong:** Calling `router.push('/planets')` before the animation finishes or causing hydration errors if mounted on server.
- **Why it happens:** Failing to mark overlay `"use client"` or triggering router immediately on click rather than on countdown completion.
- **How to avoid:** Ensure `RocketLaunchOverlay` is strictly client-side, clear timers on unmount, and provide a manual skip button.

### Pitfall 2: Disconnecting Earth Curriculum from the 3D Planets Route
- **What goes wrong:** Players reaching `/planets` cannot easily return to Earth's 2D world map (`/map`), creating a dead end.
- **Why it happens:** `PlanetaryExplorer` currently has a "← Peta Dunia / World Map" link in the top-left, but selecting Earth inside the 3D scene only showed Earth's 7 features without an obvious way to enter the 5-world prompt curriculum.
- **How to avoid:** In `PlanetaryExplorer`, when Earth is inspected, add a prominent button "Masuk Akademi Prompting (Peta 2D) / Enter Prompting Academy (2D Map)" that directs to `/map`.

### Pitfall 3: Subject vs World Number Mismatch in Feature Mission Launch
- **What goes wrong:** Launching missions from Moon, Mars, Venus, or Mercury routes to non-existent levels or wrong subject lessons.
- **Why it happens:** In `src/lib/kids/levels.ts`:
  - World 6 is `bulan-bm` (Level `6-1-bm-kucing-peromfu`)
  - World 7 is `bumi-sains` (Level `7-1-sains-benda-hidup`)
  - World 8 is `marikh-matematik` (Level `8-1-matematik-tambah-bintang`)
  - World 9 is `zuhrah-english` (Level `9-1-english-colorful-toys`)
  - World 10 is `utarid-moral` (Level `10-1-moral-sahabat-prihatin`)
  Notice that in `PLANET_WORLDS` (`src/lib/kids/planets.ts`):
  - `mercury-moral` maps to Moral Education (World 10)
  - `venus-matematik` maps to Mathematics (World 8)
  - `mars-english` maps to English Language (World 9)
  - `moon-bm` maps to Bahasa Melayu (World 6)
  - `earth-prompting` maps to Worlds 1-5 (Foundational Prompting)
- **How to avoid:** Explicitly code a helper function `resolvePlanetMissionRoute(planetId: PlanetId): string` that returns the correct level slug or `/map` and test it thoroughly with Vitest.

### Pitfall 4: Untranslated English in Malay Message Keys
- **What goes wrong:** `npm run check:vocab` fails due to English words or mismatched keys between `en.json` and `ms.json`.
- **Why it happens:** Adding new translation keys in `en.json` without adding exact matches in `ms.json`, or using the word "level" instead of "tahap".
- **How to avoid:** Use `tahap` in all Malay keys, maintain exact key parity between `messages/en.json` and `messages/ms.json`, and run `npm run check:vocab` before finalizing.

---

## Open Questions (RESOLVED)

1. **How should Earth be represented in `PlanetaryExplorer`'s mission launch?**
   - *Resolution:* Selecting Earth's "Start Mission" action in `PlanetaryHud` routes directly to the Earth Prompting Academy Map (`/map`) or the first incomplete level. In the Earth Cartography HUD, a distinct "Masuk Akademi Prompting / Enter Prompting Academy" button will link directly to `/map`.
2. **Where should the rocket icon appear in `KidsHeader`?**
   - *Resolution:* In `KidsHeader`, add a dedicated Rocket button next to the Map button on desktop (`pixel-btn pixel-btn-amber` with rocket icon, routing to `/planets`), and add a distinct "Sistem Suria 3D" link in the mobile drawer.
3. **What is the exact trigger for the grand graduation launch?**
   - *Resolution:* In `LevelComplete`, when `levelSlug === "5-4-graduation-day"`, replace or augment the "Next Level" button with a special "Lancar Roket ke Angkasa / Launch Rocket to Space" button that opens `RocketLaunchOverlay`.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 2.1.9 with `@testing-library/react` [VERIFIED: package.json:52] |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test` |
| Full suite command | `npm run verify` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FLOW-01 | Title screen step 2 renders dual CTAs (Earth & Solar System) | unit | `npm test src/__tests__/kids/game-flow-navigation.test.tsx` | ❌ Wave 0 |
| FLOW-02 | `KidsHeader` and `/map` have links to `/planets` | unit | `npm test src/__tests__/kids/game-flow-navigation.test.tsx` | ❌ Wave 0 |
| FLOW-03 | `LevelComplete` on `5-4-graduation-day` displays rocket launch CTA | unit | `npm test src/__tests__/kids/game-flow-navigation.test.tsx` | ❌ Wave 0 |
| FLOW-03 | `RocketLaunchOverlay` renders countdown and navigates to `/planets` | unit | `npm test src/__tests__/kids/rocket-launch-overlay.test.tsx` | ❌ Wave 0 |
| FLOW-04 | `PlanetaryExplorer` routes missions correctly by `PlanetId` | unit | `npm test src/__tests__/kids/planetary-explorer.test.tsx` | ✅ (extend) |
| FLOW-05 | Zero vocabulary / closure violations in new components | integration | `npm run check:closure && npm run check:vocab` | ✅ |

### Sampling Rate
- **Per task commit:** `npm test`
- **Per wave merge:** `npm run check:closure && npm run check:vocab && npm run verify`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/kids/game-flow-navigation.test.tsx` — covers FLOW-01, FLOW-02, FLOW-03
- [ ] `src/__tests__/kids/rocket-launch-overlay.test.tsx` — covers countdown & blast-off sequence

---

## Sources

### Primary (HIGH confidence)
- `src/components/kids/layout/kids-home-content.tsx` - Title screen structure and step management.
- `src/components/kids/elements/level-complete.tsx` - Level completion modal and slug handling.
- `src/components/kids/planets/planetary-explorer.tsx` - 3D Solar system & planet cartography orchestrator.
- `src/lib/kids/levels.ts` - All 24 registered levels across Worlds 1 to 10.
- `src/lib/kids/planets.ts` - All 5 planetary worlds and 35 geological features.
- `messages/en.json` & `messages/ms.json` - Bilingual localization dictionaries.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Standard Next.js 16 + React 19 + Vitest setup verified.
- Architecture: HIGH - Clear separation between pixel assets, overlay state, and routing hooks.
- Pitfalls: HIGH - Identified and resolved mapping between planet IDs and level slugs.

**Research date:** 2026-11-08  
**Valid until:** 2026-12-08
