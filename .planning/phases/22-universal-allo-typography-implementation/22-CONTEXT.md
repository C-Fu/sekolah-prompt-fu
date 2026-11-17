# Phase 22: Universal Allo Typography Implementation — Context

**Gathered:** 2026-11-17  
**Status:** Locked & Decided

<domain>
Global web typography, font family integration, variable web fonts, CSS @font-face rules, and theme aesthetic balance (playful, cheerful, cheeky yet mature).
</domain>

<canonical_refs>
- `node_modules/allo-font/` — Josh Puckett's Allo font package
- `public/fonts/allo/` — Static bundle for offline, self-hosted WOFF2 fonts
- `src/app/globals.css` — Global typography styles and `@font-face` definitions
- `src/app/layout.tsx` — Root layout font integration
</canonical_refs>

<decisions>
### 1. Font Selection & Loading Strategy
- **Decision:** Self-host the variable `Allo` font (`AlloVariable.woff2`) and its oblique variants in `public/fonts/allo/`, with CSS `@font-face` declarations loaded locally in `src/app/globals.css`.
- **Family Name:** `"Allo", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
- **Aesthetic Balance:** Use standard variable optical sizing (`font-optical-sizing: auto`) and default friendly roundness (`ROND: 50`), ensuring the text feels warm, playful, and cheerful for kids without being childish or cartoonish, maintaining excellent legibility for adult educators and parents.

### 2. Universal Replacement of Legacy Fonts
- **Decision:** Replace Google Schoolbell completely with Allo.
- **Coverage:** Apply Allo across:
  - Root `body` and layout wrapper
  - Headings (h1–h6), titles, badges, navigation buttons, header, language toggles
  - Interactive widgets (DragDrop, Matcher, Predictor, Lab, LevelComplete)
  - 3D Telemetry HUD and orbital controls
  - MDX lesson content and prose
</decisions>
