# Phase 14 — Typography Comparison Report

## Candidate Asset Inventory
- **Schoolbell**: Production font bundled and loaded via `next/font/google` in `src/app/layout.tsx` (CSS variable `--font-kids`). Font files are local/self-hosted at build time. Status: **available**.
- **Bubble Sans**: Not bundled in the repository; no local font asset file (`.ttf`, `.woff2`) exists on disk or in system font directories (`/usr/share/fonts`). Remote download was explicitly disallowed by UI-SPEC and Plan constraints. Status: **unavailable**.
- **Comic Neue**: Not bundled in the repository; no local font asset file (`.ttf`, `.woff2`) exists on disk or in system font directories (`/usr/share/fonts`). Remote download was explicitly disallowed by UI-SPEC and Plan constraints. Status: **unavailable**.

## BM Glyph and Punctuation Observations
- **Schoolbell**: Tested against standard Bahasa Melayu strings ("Belajar Bercakap dengan AI!", "Mula Belajar di Bumi", "Utama • Peta Bumi • Planet", "Pilih satu tahap pada peta untuk mula belajar."). Full Latin glyph coverage, commas, exclamation marks, and question marks render cleanly with excellent visual charm and playful child-friendly presentation.
- **Bubble Sans**: Local asset unavailable. Fallback sans-serif demonstrates standard Latin glyph coverage, but lacks the distinct hand-drawn warmth and playful personality of Schoolbell.
- **Comic Neue**: Local asset unavailable. Fallback cursive/sans-serif demonstrates standard Latin glyph coverage, but cannot be evaluated against custom typography metrics without local font files.

## EN Glyph and Punctuation Observations
- **Schoolbell**: Tested against standard English journey strings ("Learn to Talk to AI!", "Start Learning on Earth", "Home • Earth map • Planets", "Choose a level on the map to start learning."). Punctuation, apostrophes, bullets, and emojis render without clipping or glyph corruption.
- **Bubble Sans**: Local asset unavailable; evaluated via CSS fallback.
- **Comic Neue**: Local asset unavailable; evaluated via CSS fallback.

## Narrow Viewport Observations
- Tested at narrow mobile viewport width (390px, representative modern smartphone).
- Schoolbell multi-line headings wrap naturally across 2 lines at 28px/48px sizes without breaking words awkwardly or clipping characters.
- Navigation bar items wrap cleanly without overflowing or obscuring buttons.
- Fallback fonts occupy comparable horizontal footprint with minor variations in character kerning.

## Wide Viewport Observations
- Tested at desktop wide viewport (1200px container width).
- Three-column side-by-side comparison layout demonstrates balanced line lengths, comfortable readable line-height (1.5 for body at 20px, 1.25 for labels, 1.2 for headings, 1.1 for display).
- High-contrast warm ink `#2C1810` on paper `#FEF3C7` ensures optimal legibility.

## Static Export and Fallback Constraints
- Static export with `next/font/google` ensures all needed font subsets are downloaded during build time and embedded into static assets without runtime third-party network requests.
- CSS fallback stack (`cursive, sans-serif`) functions reliably if font loading fails, preserving legible text and uninterrupted interaction.

## Child-Reading Evidence
- **Status**: unavailable / inconclusive
- **Source**: unavailable
- Formal participant reading sessions and structured reading-comprehension testing with primary-school children were not conducted. As mandated by UI-SPEC § Typography Decision Rule, visual inspection by developers or AI cannot be substituted for measured child-reading results.

## Production Font Decision
- **Selected Face**: Schoolbell
- **Reason**: Schoolbell has verified complete glyph coverage, is already integrated with zero-runtime-network static export, preserves the beloved pixel-art and playful identity of Sekolah Prompt-Fu, and no candidate font demonstrated measured superior child-reading results.

## Explicit Approval
- **Status**: not approved
- **Approver**: not provided
- No user approval or stakeholder sign-off was requested or granted for changing the production font. Schoolbell remains the sole production font.
