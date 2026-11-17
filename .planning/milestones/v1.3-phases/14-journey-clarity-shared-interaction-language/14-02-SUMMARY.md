# Plan 14-02 Summary: Shared and Hub Navigation Text Cues

## Overview
Added visible BM/EN route labels to shared top navigation and strengthened hub location clarity in `KidsHeader` and `ProgressMap`, aligning with decisions D-06 and D-08 without altering route topology or scene identity.

## Key Changes
- **Shared Desktop Navigation**: Added visible translated text labels next to icons in `KidsHeader` for "Home" / "Utama" (`/`), "Earth map" / "Peta Bumi" (`/map`), and "Solar System" / "Sistem Suria" (`/planets`). Removed duplicate Home destination from the nav button group.
- **Mobile Menu Accessibility**: Labeled mobile menu actions with visible icons and text, providing localized `aria-label`s ("Open menu" / "Close menu", "Buka menu" / "Tutup menu") on the menu trigger.
- **ProgressMap Location Clarity**: Updated map heading from generic "World Map" to explicit "Earth map" / "Peta Bumi", aligned subtitle prompt, and provided a structured empty-state fallback with a direct link to explore planets when 0 levels are available. Preserved illustrated pixel artwork and floating portal banner to `/planets`.
- **Planetary Hub & Cartography HUD**: Preserved the return-to-orbit controls, Earth map link, and 3D scene controls in `PlanetaryHud` and `PlanetaryExplorer`.
- **Regression Tests**: Expanded `src/__tests__/kids/header-navigation.test.tsx` to assert visible desktop labels, mobile menu trigger/item labels, zero duplicate home links, and the empty-state fallback.

## Verification
- `npm test -- src/__tests__/kids/header-navigation.test.tsx src/__tests__/kids/planetary-hud.test.tsx src/__tests__/kids/planetary-explorer.test.tsx` passed all 20 tests.
