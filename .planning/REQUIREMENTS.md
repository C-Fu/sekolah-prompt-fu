# Requirements: Milestone v1.1

## Overview
Milestone v1.1 addresses critical visual rebranding (purging stale `prompts.chat` Open Graph social previews), fixing and wiring dormant quality guards into CI, adding a convenient header BM/EN quick toggle, and researching and piloting Malaysian Standard 1 (KSSR Semakan / KBAT) prompt-based learning levels across foundational subjects.

## Functional Requirements

### Branding & Identity
- [ ] **BRAND-01**: Replace legacy `public/og.png` and `src/app/opengraph-image.png` with authentic Sekolah Prompt-Fu / Peromfu social preview banner (1200x630) so social sharing renders correct preview.
- [ ] **BRAND-02**: Audit and remove any lingering prompts.chat or upstream brand text references in UI and docs.

### Quality Guards & CI Hardening
- [ ] **GUARD-01**: Update `scripts/check-kids-import-closure.js` entry points to match promoted root routes (`src/app/layout.tsx`, `src/app/page.tsx`, `src/app/map/page.tsx`, `src/app/level/[slug]/page.tsx`) and verify exit code 0.
- [ ] **GUARD-02**: Wire `npm run check:closure` and `npm run check:vocab` (`scripts/check-ms-vocabulary.js`) into `package.json` scripts and `.github/workflows/ci.yml`.

### Architecture & Localization
- [ ] **I18N-01**: Consolidate supported locales into a single source of truth (`src/lib/i18n/config.ts`), eliminating drift between `prompts.config.ts` and `settings-modal.tsx`.
- [ ] **UI-01**: Add dual-toggle "BM | EN" pill button to the header next to Music and Settings buttons for instant 1-click language switching with visual active state.

### Codebase Hygiene & Documentation
- [ ] **CLEAN-01**: Remove vestigial empty `public/sounds/` directory, purge stale `prisma/**` ignore in `eslint.config.mjs`, and remove unused `next/headers` stub in `vitest.setup.ts`.
- [ ] **CLEAN-02**: Synchronize `HANDOFF.md` test counts (119/119) and clarify CI verify flags (`--gates-only`).

### KSSR & KBAT Standard 1 Prompt-Based Learning
- [ ] **KSSR-01**: Formulate KSSR Semakan Year 1 DSKP prompt-learning architecture mapping core subjects (BM, English, Matematik, Sains, Pendidikan Moral) to prompt engineering concepts (clarity, specificity, formatting, constraints, verification).
- [ ] **KSSR-02**: Author and register pilot Standard 1 interactive prompt-learning levels with widgets in both Bahasa Melayu (`src/content/kids/ms/`) and English (`src/content/kids/en/`).
- [ ] **KSSR-03**: Ensure all new KSSR levels adhere to zero silent English fallback and pass `check:vocab` and Vitest suites.

## Non-Functional Requirements
- **NFR-1**: All existing and new tests pass (Vitest 100% green).
- **NFR-2**: TypeScript zero errors (`npx tsc --noEmit`).
- **NFR-3**: 100% Static HTML export build succeeds (`npm run build`).
- **NFR-4**: `npm run verify` passes with all routes verified.
