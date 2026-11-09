# Plan 14-03 Summary: First-Visit Hub Guidance Cues

## Overview
Added independent, resilient first-visit guidance tips to the Earth map and Planetary hub (`ProgressMap` and `PlanetaryExplorer`), storing dismissals separately from learning progress per decision D-12 and the UI-SPEC copywriting contract.

## Key Changes
- **Preference Storage (`src/lib/kids/journey-preferences.ts`)**: Built a robust preference storage module isolated under the key `kids-journey-preferences` (completely separate from `kids-progress`). Validates `map` and `planets` screen IDs, catches storage exceptions and corrupt JSON, and prevents SSR hydration mismatches.
- **Reusable Tip Component (`src/components/kids/elements/journey-tip.tsx`)**: Created a semantic, non-intrusive tip callout with an accessible dismissal button ("Got it" / "Faham") and icon.
- **Map & Planetary Hub Integration**:
  - `ProgressMap`: Integrated tip in an inline area below the portal banner, avoiding overlap with tappable map nodes or controls.
  - `PlanetaryExplorer`: Integrated tip into the central header banner, sharing a single dismissal across solar-system orbit and planetary cartography modes.
- **Canonical Translations**: Added `kids.tips.map`, `kids.tips.planets`, and `kids.tips.dismiss` ("Got it" / "Faham") in `messages/en.json` and `messages/ms.json`.
- **Comprehensive Tests (`src/__tests__/kids/journey-tips.test.tsx`)**: Verified independent dismissal per screen, persistent storage across reloads, resilience against corrupt JSON, non-mutation of `kids-progress`, and bilingual rendering.

## Verification
- `npm test -- src/__tests__/kids/journey-tips.test.tsx` passed with 6/6 test cases.
