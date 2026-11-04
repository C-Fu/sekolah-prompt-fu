---
phase: 01-purge-non-kids-code-dependencies
plan: 13
subsystem: config-tooling-tests
tags: [kids-only-config, orphan-helpers, scripts-prune, stale-tests, vitest-setup, import-closure]
requires:
  - 01-01-PLAN.md
  - 01-06-PLAN.md
  - 01-08-PLAN.md
  - 01-09-PLAN.md
  - 01-12-PLAN.md
provides:
  - kids-only-config-no-env-overrides
  - oracle-helpers-removed
  - maintenance-scripts-pruned
  - stale-module-tests-retired
  - retained-suite-green
affects:
  - 01-07
tech-stack:
  added: []
  patterns:
    - "kids-only typed config with no runtime environment overrides"
    - "trace live importers + retained-test references before each deletion"
    - "repair retained tests to surviving exports; drop tests of deleted modules"
key-files:
  created: []
  modified:
    - prompts.config.ts
    - src/lib/config/index.ts
    - src/__tests__/lib/seo.test.ts
    - vitest.setup.ts
  deleted:
    - src/lib/date.ts
    - src/lib/format.ts
    - src/lib/i18n/index.ts
    - src/lib/list-diff.ts
    - src/lib/listing-pagination.ts
    - src/lib/rate-limit.ts
    - src/lib/related-content.ts
    - src/lib/run-platforms.ts
    - src/lib/similarity.ts
    - src/lib/skill-files.ts
    - src/lib/slug.ts
    - src/lib/trending.ts
    - src/lib/urls.ts
    - src/lib/variable-detection.ts
    - src/lib/works-best-with.ts
    - scripts/setup.js
    - scripts/docker-setup.js
    - scripts/generate-book-pdf.ts
    - scripts/html-to-pdf.ts
    - scripts/generate-examples.ts
    - scripts/generate-contributors.sh
    - scripts/rebuild-history.sh
    - scripts/seed-skills.ts
    - scripts/convert-pairings-to-teams.ts
    - "src/__tests__/api/** (37 files)"
    - "src/__tests__/app/** (4 files)"
    - "src/__tests__/components/** (16 files)"
    - "src/__tests__/hooks/use-mobile.test.ts"
    - "src/__tests__/lib/** (32 files)"
    - tests/generate-contributors-format.test.js
key-decisions:
  - "Simplified prompts.config.ts and src/lib/config/index.ts to a kids-only KidsConfig (branding/theme/i18n) with no PCHAT_* runtime environment overrides; retained the typed defineConfig identity helper and dropped getConfig/getConfigSync/applyEnvOverrides plus auth/features/homepage/announcement blocks (owner-approved config structure in 01-01-SUMMARY.md)."
  - "Removed 14 unreferenced non-kids src/lib platform helpers plus the dead i18n barrel, each proven to have zero live (non-test) importers and no retained-test reference; preserved kids/**, i18n/client.ts, i18n/config.ts, seo.ts, utils.ts, analytics.ts and config."
  - "Preserved scripts/check-kids-import-closure.js, check-translations.js, lint-mdx.js and find-unused-translations.js; removed 9 DB/book/dataset/bot/contributor maintenance scripts."
  - "Kept src/lib/hooks/use-debounce.ts and its passing test (source survives, generic shared hook, no stale import), per the 'keep any test whose source still exists' rule."
  - "Repaired seo.test.ts to the retained kids-only seo exports (dropped escapeXml/paginatedPath/toSitemapImageUrl; switched getBaseUrl assertions to NEXT_PUBLIC_SITE_URL) rather than deleting a test whose source survives."
  - "Repaired vitest.setup.ts by dropping the Prisma @/lib/db mock, the @/lib/config mock and NEXTAUTH/DATABASE env vars; retained next/navigation, next/headers and next-intl mocks."
requirements-completed: [NFR-1, FR-2]
metrics:
  duration: 8 min
  completed: 2026-11-04T18:47:47Z
  tasks: 3
  commits: 3
  files_changed: 119
  plan_head_before: 17704f2b86bdeaaf9396688e319e43a88b26105e
  plan_head_after: 1f8d9b27573c072a863e23338fce4853b6f706c5
actuals:
  tokens: 25000
  tasks: 3
  commits: 3
status: complete
---

# Phase 01 Plan 13: Reconcile Kids Config, Orphan Helpers, Maintenance Scripts and Obsolete Tests Summary

Reconciled the retained kids-only surface after bounded infrastructure retirement: simplified
`prompts.config.ts` + `src/lib/config/index.ts` to a typed kids config with no runtime env
overrides, removed 14 dead non-kids `src/lib` helpers and the dead i18n barrel, pruned 9 obsolete
DB/book/dataset/bot/contributor scripts (keeping the kids/translation checks), retired **91** stale
test files that imported deleted auth/API/bot/data/mcp modules, and repaired `vitest.setup.ts` — so
the full retained suite (`npm test` → 5 files / 89 tests), lint, `tsc --noEmit` and the kids
import-closure checker all pass for the first time.

## Performance

- **Duration:** 8 min
- **Started:** 2026-11-04T18:39:46Z
- **Completed:** 2026-11-04T18:47:47Z
- **Tasks:** 3 / 3
- **Files changed:** 119 (102 insertions, 26,322 deletions)

## Task Results

### Task 1 — Keep kids configuration and selectively remove orphan helpers

- **Read-first gate honoured:** read `prompts.config.ts`, `src/lib/config/index.ts`,
  `src/lib/utils.ts`, `src/lib/seo.ts`, `src/lib/i18n/config.ts`, `src/lib/kids/progress.ts`.
- **Config simplification:** `prompts.config.ts` and `src/lib/config/index.ts` reduced to a
  kids-only `KidsConfig` (`branding` / `theme` / `i18n`) with the typed `defineConfig` identity
  helper. Removed the `PCHAT_*` `applyEnvOverrides` layer (no runtime environment overrides), the
  auth/features/homepage/announcement blocks and the unreferenced `getConfig`/`getConfigSync`.
  Branding now reflects the actual kids game ("Promi's Prompt School").
- **Live-importer trace before deletion:** walked every non-test repo-local import; only
  `analytics.ts`, `seo.ts`, `utils.ts`, `config/index.ts` (via `prompts.config`), `i18n/client.ts`,
  `i18n/config.ts` and `kids/**` have live importers.
- **Removed 14 dead helpers + dead barrel:** `date.ts`, `format.ts`, `list-diff.ts`,
  `listing-pagination.ts`, `rate-limit.ts`, `related-content.ts`, `run-platforms.ts`,
  `similarity.ts`, `skill-files.ts`, `slug.ts`, `trending.ts`, `urls.ts`, `variable-detection.ts`,
  `works-best-with.ts`, and `i18n/index.ts`. Each had 0 live importers (the 01-12-deferred orphan
  inventory) and no retained-test reference.

**Verify (automated):** `node scripts/check-kids-import-closure.js` → exit 0 (366 modules, 19 en
slugs); presence gate for `prompts.config.ts`, `src/lib/config/index.ts`, `src/lib/kids/progress.ts`,
`src/lib/seo.ts` → PASS. `tsc` reports zero errors in the config/seo/prompts.config files.

### Task 2 — Delete obsolete maintenance scripts while keeping kids checks

- **Removed 9 obsolete scripts:** `setup.js`, `docker-setup.js` (env-driven config scaffolding),
  `generate-book-pdf.ts`, `html-to-pdf.ts` (book/PDF), `generate-examples.ts`, `seed-skills.ts`
  (dataset generators), `generate-contributors.sh`, `rebuild-history.sh` (contributors/history),
  `convert-pairings-to-teams.ts` (bot/DB conversion).
- **Preserved 4:** `check-kids-import-closure.js`, `check-translations.js`, `lint-mdx.js`,
  `find-unused-translations.js`.
- Removed scripts recorded for 01-07's `package.json` cleanup: `setup`, `db:convert:teams`,
  `generate:examples`, `book:pdf`, `book:pdf:all`, `book:pdf:convert`, `book:pdf:print`,
  `book:pdf:print:all` (and the `prisma`/`db:*`/`postinstall` scripts 01-07 already owns).

**Verify (automated):** absence of `setup.js`/`generate-book-pdf.ts`/`generate-examples.ts`/
`seed-skills.ts` + presence of the three named retained scripts + `node
scripts/check-kids-import-closure.js` → PASS (exit 0).

### Task 3 — Retire tests of deleted modules and repair retained suite setup

- **Test inventory by import:** a repo-local specifier resolver classified every test file; 90
  under `src/__tests__/**` imported deleted auth/API/bot/data/mcp modules or the removed helpers,
  and `tests/generate-contributors-format.test.js` read the deleted contributor generator.
- **Removed 91 stale test files** (37 api, 4 app, 16 components, 32 lib under `src/__tests__`,
  plus `hooks/use-mobile.test.ts` and `tests/generate-contributors-format.test.js`).
- **Kept 5 tests whose source survives:** `kids/level-locale.test.tsx` (34),
  `kids/settings-locale.test.tsx` (6), `lib/utils.test.ts` (19), `lib/seo.test.ts` (19, repaired),
  `hooks/use-debounce.test.ts` (11).
- **Repaired `seo.test.ts`** to the retained kids-only exports (dropped `escapeXml`,
  `paginatedPath`, `toSitemapImageUrl`; `getBaseUrl` assertions now use `NEXT_PUBLIC_SITE_URL`).
- **Repaired `vitest.setup.ts`:** removed the Prisma `@/lib/db` mock, the `@/lib/config` mock and
  the `NEXTAUTH_SECRET`/`NEXTAUTH_URL`/`DATABASE_URL` env vars; retained the next/navigation,
  next/headers and next-intl mocks.

**Verify (automated):** `npm test` → 5 files / 89 tests passed; `npm run lint -- --quiet` → exit 0;
`npx tsc --noEmit` → exit 0; `node scripts/check-kids-import-closure.js` → exit 0.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `99ffc40d` | feat(01-13): simplify config to kids-only and remove orphan lib helpers |
| 2 | `df5fb719` | chore(01-13): remove obsolete non-kids maintenance scripts |
| 3 | `1f8d9b27` | test(01-13): retire stale module tests and repair retained suite setup |

Commits measured with `git rev-list --count 17704f2b86bdeaaf9396688e319e43a88b26105e..HEAD` = 3.

## Verification

- **Plan `<verification>`:** retained graph verified after the helper/scripts slices, then the
  full retained suite + lint + typecheck before 01-07. ✅
- **`<success_criteria>`:** game-only config and meaningful scripts/tests remain; no stale server
  test imports. ✅
- **`must_haves.artifacts`:** `prompts.config.ts`, `src/lib/config/index.ts`,
  `src/__tests__/kids/level-locale.test.tsx`, `scripts/check-kids-import-closure.js` all present. ✅
- **`must_haves.key_links`:** retained kids components resolve config/i18n and local progress; test
  setup matches the kept kids suites. ✅

## Deviations from Plan

None affecting the declared `<files>` set — all three tasks executed as written.

**Decisions recorded (not deviations):**

1. **`src/lib/hooks/use-debounce.ts` + its test preserved.** It has no live kids importer, but the
   plan's "keep utility/hook tests if source remains" rule and the explicit instruction to keep any
   test whose source survives make deletion unwarranted; it is a generic shared hook with no stale
   import. Task 3's four gates pass with it retained.
2. **`scripts/find-unused-translations.js` preserved.** It is a retained translation-locale
   validation tool (it scans the surviving `messages/` + `src/`), aligned with keeping the kids
   locale checks; the plan's explicit preserve list names `check-translations.js` and the tool is
   not one of the named DB/book/dataset/bot/contributor flows.
3. **`seo.test.ts` repaired, not deleted.** Its source (`src/lib/seo.ts`) survives as kids-only, so
   the test was rewritten to the surviving exports rather than removed.

**Total deviations:** 0 auto-fixed. **Impact:** none — every retained gate (tests, lint, typecheck,
import closure) is green and no file outside the declared `<files>` set was modified.

## Known Stubs

None. This plan removes dead code and repairs setup; it introduces no placeholder or stub values.

## Threat Flags

None. The plan is deletion/repair-only — no new network endpoints, auth paths, file-access patterns
or trust-boundary schema changes. `T-01-12` (tampering via config/test pruning) is mitigated by
owner approval (01-01) plus re-running the real kids locale/progress suites; `T-01-SC` (installs)
accepted — no installs performed.

## Next

- **01-07** owns `package.json` / `package-lock.json`: remove the Prisma-coupled scripts and the
  now-orphaned `setup`, `db:convert:teams`, `generate:examples`, `book:pdf*`, `lint:mdx` unless the
  retained three checks are re-wired; prune removed dependencies (`@prisma/client`, `prisma`,
  `next-auth`, `@auth/prisma-adapter`, `puppeteer`, `@clack/prompts`, `d3`, ...) and the prompt
  datasets/CI.

## Self-Check: PASSED

- `prompts.config.ts` + `src/lib/config/index.ts` are kids-only with no `PCHAT_*` overrides;
  `getConfig`/`getConfigSync`/`applyEnvOverrides` gone; `defineConfig` and the kids types remain.
- 15 `src/lib` files removed; `kids/**`, `i18n/client.ts`, `i18n/config.ts`, `seo.ts`, `utils.ts`,
  `analytics.ts` present.
- 9 scripts removed; `scripts/check-kids-import-closure.js`, `check-translations.js`, `lint-mdx.js`
  present.
- 91 stale test files removed; 5 retained tests present and green.
- `node scripts/check-kids-import-closure.js` → exit 0; `npm test` → 89/89; `npm run lint --
  --quiet` → exit 0; `npx tsc --noEmit` → exit 0.
- Commits exist and are ancestors of HEAD: `99ffc40d`, `df5fb719`, `1f8d9b27` — FOUND.
- Working tree clean; no untracked files; no files outside the declared `<files>` set modified.