# Phase 05 Verification: Tech Debt Cleanup, Rebranding & CI Guards

## Summary
- **Status:** PASS
- **Phase Goal:** Replace legacy prompts.chat social preview images with Sekolah Prompt-Fu branding, fix and wire dormant import closure and vocabulary guards into CI, consolidate locale definitions, and eliminate dead code.

## Verification Checklist

1. **Branding & Social Preview:**
   - `public/og.png` & `src/app/opengraph-image.png` replaced with high-res (1200x630) Sekolah Prompt-Fu custom banner with Peromfu robot, pixel styling, dual language tags, and clear typography.
   - `src/app/twitter-image.png` also synced to the new image.
   - Vitest SEO suite passes (`src/__tests__/lib/seo.test.ts`).

2. **Quality Guards & CI Hardening:**
   - `scripts/check-kids-import-closure.js` targets root routes (`src/app/layout.tsx`, `src/app/page.tsx`, etc.). Traverses 385 modules and exits code 0.
   - `package.json` includes `check:closure` and `check:vocab`.
   - `.github/workflows/ci.yml` runs type check, lint, closure check, vocabulary check, and verification.

3. **Locale Registry Unification:**
   - `src/lib/i18n/config.ts` exports canonical `LOCALE_OPTIONS` and `supportedLocales`.
   - `prompts.config.ts` and `src/components/kids/layout/settings-modal.tsx` import directly from `src/lib/i18n/config.ts`.
   - Zero locale list drift.

4. **Codebase Hygiene & Documentation:**
   - Empty `public/sounds/` removed.
   - Unused `next/headers` mock removed from `vitest.setup.ts`.
   - `.planning/HANDOFF.md` updated with 124/124 tests, new guard commands, and `--gates-only` flag explanation.

## Test Results
- `npx tsc --noEmit` -> 0 errors.
- `npm run lint` -> 0 errors.
- `npm test` -> 124/124 passed.
- `npm run check:closure` -> 385 modules, exit 0.
- `npm run check:vocab` -> 19 levels scanned, exit 0.
- `npm run verify -- --gates-only` -> PASS.
