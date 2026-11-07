# Milestones

## v1.1 v1.1 (Shipped: 2026-11-07)

**Phases completed:** 4 phases, 8 plans, 0 tasks

**Key accomplishments:**
- (none recorded)

---

## v1.1 Rebrand, Tech Debt, & KSSR Tahun 1 Integration (Shipped: 2026-11-07)

**Phases completed:** 4 phases (Phases 5-8), 8 plans, 16 tasks

**Key accomplishments:**
- Replaced legacy `prompts.chat` Open Graph social preview (`public/og.png`, `src/app/opengraph-image.png`, `src/app/twitter-image.png`) with a high-resolution custom Sekolah Prompt-Fu banner featuring Peromfu the robot, pixel styling, and dual-language tags.
- Repaired `scripts/check-kids-import-closure.js` to target promoted root routes and wired closure check and vocabulary check (`npm run check:closure`, `npm run check:vocab`) directly into `package.json` scripts and GitHub Actions CI.
- Consolidated supported locales into a canonical single source of truth in `src/lib/i18n/config.ts`, eliminating list drift across config and settings modal, and purged dead code/assets.
- Added a kid-friendly dual toggle button `[ BM | EN ]` directly on `KidsHeader` (both desktop and mobile dropdown views) for 1-click language switching.
- Established the Malaysian KSSR Semakan & KBAT prompt-learning framework, mapping primary subjects to celestial planets (Moon=BM, Earth=Sains, Mars=Matematik, Venus=English, Mercury=Moral) and 30 geological regions to Standards 1-6.
- Authored and wired 5 pilot interactive prompt-learning levels in both Bahasa Melayu (`src/content/kids/ms/`) and English (`src/content/kids/en/`) covering BM, Sains, Matematik, English, and Pendidikan Moral, verified with zero silent English fallback and full static export certification across all 24 routes.

---

## v1.0 Kids Prompting Game Standalone & GitHub Pages (Shipped: 2026-11-07)

**Phases completed:** 5 phases, 27 plans, 51 tasks

**Key accomplishments:**
- Kids entry now renders through an auth-free, request-independent root shell.
- Pruned npm manifest/lockfile to a kids-only surface (1492 -> 826 packages), deleted community prompt datasets.
- Removed non-kids book MDX corpus and editor data (565 files, ~215k lines).
- Kids game promoted to application root (/, /map, /level/[slug]), music bundled locally, and 100% static export built for GitHub Pages.
- Full Bahasa Melayu localization across all 19 original interactive MDX levels.
- Committed Node-stdlib `scripts/verify-project.js` that certifies TypeScript, Vitest, and inspects `out/`.

---
