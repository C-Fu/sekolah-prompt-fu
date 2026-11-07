# Plan 05-02 Summary: Repair Import-Closure Guard & Wire CI Checks

## Completed Tasks
- Updated `scripts/check-kids-import-closure.js` entry points from removed `src/app/kids/...` paths to root routes (`src/app/layout.tsx`, `src/app/page.tsx`, `src/app/error.tsx`, `src/app/global-error.tsx`, `src/app/not-found.tsx`, `src/app/map/page.tsx`, `src/app/level/[slug]/page.tsx`).
- Verified `node scripts/check-kids-import-closure.js` traverses 385 modules and exits code 0.
- Updated `src/app/twitter-image.png` to match the new Sekolah Prompt-Fu banner.
- Added `check:closure` and `check:vocab` to `package.json` scripts.
- Wired both `npm run check:closure` and `npm run check:vocab` into `.github/workflows/ci.yml`.

## Requirements Satisfied
- GUARD-01: Fix `scripts/check-kids-import-closure.js` entry points.
- GUARD-02: Wire closure check and vocabulary check into `package.json` and `ci.yml`.
