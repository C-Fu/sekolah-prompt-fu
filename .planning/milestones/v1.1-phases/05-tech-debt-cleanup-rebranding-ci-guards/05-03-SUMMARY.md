# Plan 05-03 Summary: Unify Locale Registries, Clean Dead Code & Sync Docs

## Completed Tasks
- **Locale Single Source of Truth**: Created canonical `LOCALE_OPTIONS` in `src/lib/i18n/config.ts` including Hebrew (`he`), exported `supportedLocales` and `defaultLocale`, and refactored `prompts.config.ts` and `src/components/kids/layout/settings-modal.tsx` to derive directly from it.
- **Dead Code Cleanup**:
  - Removed empty directory `public/sounds/`.
  - Removed unused `next/headers` mock from `vitest.setup.ts`.
  - Verified `eslint.config.mjs` has no stale references.
- **Documentation Sync**:
  - Updated `.planning/HANDOFF.md` test metrics to 124/124 tests.
  - Documented closure and vocabulary guards and added `--gates-only` verification command table entries.
- **Certified Gates**:
  - `npx tsc --noEmit`: 0 errors.
  - `npm run lint`: 0 errors.
  - `npm test`: 124/124 tests passed.
  - `npm run check:closure`: 385 modules passed.
  - `npm run check:vocab`: 19 levels passed.
  - `npm run verify -- --gates-only`: PASS.

## Requirements Satisfied
- I18N-01: Single source of truth for supported locales.
- CLEAN-01: Removed residual non-kids assets and unused test stubs.
- CLEAN-02: Synchronized HANDOFF.md test counts and verify flags.
