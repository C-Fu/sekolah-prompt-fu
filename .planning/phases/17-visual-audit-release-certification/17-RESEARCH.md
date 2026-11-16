# Phase 17: Technical Research & Audit Strategy

**Phase:** 17 - Visual Audit & Release Certification
**Requirements:** VIS-01, VIS-02

## 1. Domain & Verification Analysis
Phase 17 represents the final milestone gate for v1.3. Across Phases 14, 15, and 16, individual interaction patterns, responsive layouts, accessibility indicators, and game-feel feedback were developed and verified in isolation. Phase 17 verifies:
1. **Visual and Design Consistency (VIS-01):**
   - Title screen (`/`), Earth map (`/map`), Planetary hub (`/planets`), and Lesson screens (`/level/[slug]`) adhere to the unified typography scale, 4px grid spacing, two-tone focus outline, and 44px touch targets.
   - Distinct themes: Earth map retains organic terrestrial accents; planets retain unique cosmic color palettes and textures.
2. **Brand & Delivery Certification (VIS-02):**
   - Retro pixel-art style, Peromfu avatar, and animations conform to child-friendly game aesthetics.
   - Dual-language parity: All 23 lesson slugs and UI strings render in English and Bahasa Melayu without missing translation keys or broken layouts.
   - Static export pipeline: Zero server runtime requirements; output renders to GitHub Pages static structure.

## 2. Validation Architecture
- **Automated Verification:**
  - Automated project verification script: `npm run verify` (validates `tsc`, `vitest`, static routes `/`, `/map`, `/planets`, all 23 level routes, and media assets).
  - Cross-journey visual audit and consistency integration test: `src/__tests__/kids/visual-audit.test.tsx`.
- **Build Certification:**
  - Production build execution: `npm run build` validating zero export failures or hydration issues.
EOF
