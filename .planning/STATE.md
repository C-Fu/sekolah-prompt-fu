---
gsd_state_version: "1.0"
status: Awaiting next milestone
stopped_at: Phase 04 complete — all phases complete
last_updated: "2026-11-07T02:49:26.597Z"
last_activity: 2026-11-07
last_activity_desc: Milestone v1.0 completed and archived
state_head: f6ca41c776d16f9dd25eacc6b3c64807b99106ce
progress:
  total_phases: 5
  completed_phases: 4
  total_plans: 27
  completed_plans: 27
  percent: 80
current_phase: "04.1"
current_phase_name: "Address tech debt: stale kids import-closure guard + wire ms vocabulary guard into CI"
---

# Project State

## Scope

**Milestone:** v1.0 — Kids Prompting Game Standalone & GitHub Pages (SHIPPED 2026-11-07)
**Next milestone:** v1.1 — Tech Debt Cleanup (Phase 04.1)

## Current Position

Phase: Milestone v1.0 complete
Plan: —
Status: Awaiting next milestone
Last activity: 2026-11-07 — Milestone v1.0 completed and archived

## Project Reference

See: .planning/PROJECT.md (updated 2026-11-07 after v1.0)

**Core value:** A lightweight, standalone, gamified kids app for learning prompt engineering — pure client-side, 100% static (GitHub Pages), with full Bahasa Melayu support.
**Current focus:** Planning next milestone (v1.1 tech-debt cleanup) or closing the v1.1 `04.1` phase.

## Status
- **Current Phase:** Phase 04.1 (Address tech debt: stale kids import-closure guard + wire ms vocabulary guard into CI)
- **Status:** Phase 4 complete & verified — all 4 phases done. 04-01 delivered the NFR-2 certification source of truth (`scripts/verify-project.js` + `npm run verify` + `ci.yml` hardened with tsc + verify steps; `deploy.yml` untouched); 04-02 delivered `.planning/HANDOFF.md` and certified NFR-2 satisfied; 04-03 closed the CI gap (CR-01/WR-01/WR-02) with `--gates-only` mode, a finite gate timeout and an aggregated absent-`out/` verdict. `04-VERIFICATION.md` = passed (12/12 must-haves); `04-UAT.md` = complete (2/2 passed); `04-SECURITY.md` threats_open 0.
- **Next Command:** `/gsd-plan-phase 04.1` — urgent tech-debt insertion (Phase 04.1). Milestone 04 remains complete.

## Key Decisions
- Pure client-side static site architecture for GitHub Pages deployment.
- Storage and game state managed in `localStorage`.
- Support for Bahasa Melayu (`ms`) added across UI and all 19 MDX levels.
- Stripping all server/database dependencies (PostgreSQL, Prisma, NextAuth).
- Root layout is a kids-compatible, auth-free, request-independent shell; the shared `Providers` wrapper exposes only `NextIntlClientProvider` (locale/messages kept as props for later client locale switching).
- i18n request config is deterministic (bundled default-locale messages, no cookie/header lookup); a locale candidate is validated against `supportedLocales` before any message import path is built.
- Kids level content is selected on the client from a validated slug via a statically analyzable, bounded lazy MDX import map (English fallback only when the locale module is absent); the level page performs no request-time locale read.
- Mounted MDX Sections own stable identities resolved to ordered indexes from document order; navigation locking is identity-scoped and fails closed. The legacy numeric context signatures stay callable but cannot unlock a mounted interactive Section until 01-16 migrates the consumers.
- All nine retained interactive MDX consumers (drag-drop-prompt, example-matcher, magic-words, prompt-doctor, prompt-lab, prompt-parts, prompt-vs-mistake, step-by-step, word-predictor) resolve their containing Section via `useSectionIdentity()` and register/persist completion by that resolved index, never the navigation cursor. Adjacent repeated challenges (WordPredictor 3/4, PromptVsMistake 7/8) lock and complete independently. Completion writes refuse an unresolved identity (fail closed). The wrapper's current-Section lock now recomputes on `completedSections` changes so an identity-scoped completion actually unlocks Next (Rule 2 fix in 01-16).
- Client locale switching is a validated, localStorage-persisted preference signal owned by the shared `Providers` (single locale/messages pair switched atomically); the kids layout resolves direction from a client `LocaleDirection` child, and no request-time locale read remains. A genuine user locale change invalidates locale-incompatible useId component drafts and index-based Section completions (fail closed on storage denial) while retaining kids-progress and sound; initial restoration of a saved locale does not invalidate it; confirmed reset clears kids-progress, kids-component-state and kids-section-completion.

## Session

**Last session:** 2026-11-05T12:30:59.917Z
**Stopped at:** Phase 04 complete — all phases complete
**Resume file:** None
- **Last Completed Plan:** 03-06 (gap closure G-03-4 + G-03-6 — `bodil`→`lawak` ×3, `bedtime`→`sebelum tidur`, `level/LEVEL`→`tahap/TAHAP` ×4, `superhero`→`adiwira` ×5; 1-1:30 explanation re-grounded in Malay + 1-1:31 aiThinking quotes the Malay puzzle sentence; added persistent `scripts/check-ms-vocabulary.js` guard (exit 0 post-edit, exit 1 on pre-edit HEAD with 16 offenders); `messages/ms.json` unmodified at 212 keys; en/** and non-ms locales untouched)
- **Phase 1 Verification:** PASS — 9/9 must-haves independently reproduced in `.planning/phases/01-purge-non-kids-code-dependencies/VERIFICATION.md`. NFR-1 satisfied; FR-1/FR-2 preparatory (root `/` promotion + full FR-2 verification owned by Phase 2 / later phases); FR-3, FR-4 and NFR-2 final certification explicitly out of Phase 1 scope.
- **Phase 2 Verification:** PASS — 8/8 must-haves independently reproduced in `.planning/phases/02-promote-kids-game-to-root-configure-static-export/VERIFICATION.md`. Kids game served at `/`, `/map`, `/level/[slug]`; static `out/` bundle (25 pages incl. 19 levels + bundled music); GitHub Pages workflow added. FR-1 and FR-4 satisfied; NFR-2 interim (final certification Phase 4). Follow-up fixed post-verification: kids header home links now use `next/link` so they respect `basePath` under a Pages project sub-path.
- **Phase 3 Verification:** PASS — 19/19 must-haves independently reproduced in `.planning/phases/03-bahasa-melayu-ms-localization/03-VERIFICATION.md` (canonicalized `human_needed` → `passed` after UAT). All automated plumbing green (`tsc` 0, `lint` 0 errors, `npm test` 94/94, `npm run build` exit 0 with 19 static level routes; `messages/ms.json` 212-key parity; all 19 slugs resolve to `effectiveLocale: ms` with `Component !== en`). UAT 10/10: 8 passed, 2 originally-reported issues (G-03-4 `bodil`, G-03-6 1-1 re-localization) verified-resolved by 03-06; G-03-5 closed by 03-05. FR-3 satisfied. Security: `03-SECURITY.md` verified, threats_open 0 (15 threats, L1 grep-depth).

## Performance Metrics

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 01 P03 | 1 min | 2 tasks | 83 files |
| Phase 01 P10 | 1 min | 2 tasks | 13 files |
| Phase 01 P11 | 4 min | 2 tasks | 32 files |
| Phase 01 P04 | 6 min | 2 tasks | 11 files |
| Phase 01 P05 | 8 min | 2 tasks | 110 files |
| Phase 01-purge-non-kids-code-dependencies P08 | 6 min | 2 tasks | 114 files |
| Phase 01 P09 | 4 min | 2 tasks | 601 files |
| Phase 01 P06 | 6 min | 1 task | 81 files |
| Phase 01 P12 | 2 min | 2 tasks | 48 files |
| Phase 01 P13 | 8 min | 3 tasks | 119 files |
| Phase 01 P07 | 2h 0min | 3 tasks | 85 files |
| Phase 02 P01 | 18 min | 3 tasks | 21 files |
| Phase 03 P05 | 2 min | 2 tasks | 5 files |
| Phase 03 P06 | 3 min | 2 tasks | 10 files |
| Phase 04 P01 | 3 min | 3 tasks | 3 files |
| Phase 04 P02 | 1 min | 3 tasks | 4 files |

## Decisions

- [Phase 01]: Thirteen non-kids route trees (auth, [username], about, admin, book, bots, brand, categories, collection, developers, discover, docs, embed) deleted as two atomic route slices; kids entry/map/level/layout and all 01-11-owned routes preserved. Retained routes still linking to deleted paths are out of scope for this slice.
- [Phase 01]: Remaining thirteen community routes (feed, how-to-write-effective-prompts, presentation, privacy, promptmasters, prompts, settings, skills, support, tags, taste, terms, workflows) deleted as two atomic slices; `/kids` tree, root layout, globals.css and shared error files preserved. Cross-tree references to removed routes remain only in two 01-13-owned test files (reported, not modified).
- [Phase 01]: Kids MDX registry reduced to the 12 components used by src/content/kids/**/*.mdx plus basic table tags; Section stays bound to the real exported component (no bypass wrapper) so 01-15/01-16 section registration is preserved; book/prompt imports removed.
- [Phase 01]: src/lib/seo.ts canonical origin now derives from NEXT_PUBLIC_SITE_URL (fallback https://prompts.chat), removing NEXTAUTH_URL coupling; community pagination/sitemap helpers (paginatedPath, escapeXml, toSitemapImageUrl) removed; buildPageMetadata/NOINDEX_ROBOTS retained.
- [Phase 01]: Sentry instrumentation/config and legacy proxy rewrites deleted; next.config.ts unwrapped from withSentryConfig and stripped of standalone output and legacy redirects/crawler headers; error/not-found pages retargeted to /kids and /kids/map. Static export and image optimization untouched (Phase 2).
- [Phase 01]: Eight orphaned non-kids component families (admin, api, auth, book, bots, categories, changes, comments) deleted in two atomic groups after proving no retained kids importer references them; added a reusable read-only kids import-closure checker (scripts/check-kids-import-closure.js) as the bounded post-prune verification gate, since full-project tsc still includes stale legacy tests cleaned in 01-13.
- [Phase 01-purge-non-kids-code-dependencies]: Defer dangling src/lib/plugins/widgets import to 01-06/01-12 rather than expand 01-08 scope (dead chain, outside kids closure).
- [Phase 01]: Selective shared-dependency prune (01-09): removed book MDX corpus (src/content/book) and editor data (src/data) plus 3 provider siblings, 31 UI primitives and src/hooks/use-mobile.ts, keeping only files with a live importer in the retained kids closure; providers/index.tsx, ui/button.tsx and ui/sonner.tsx retained; dangling importers in 01-12/01-13-owned subtrees logged, not fixed.
- [Phase 01]: Approved DB/auth infrastructure retired in one bounded removal-only commit (01-06): prisma/ (schema, 40 migrations, seed/reset), prisma.config.ts, src/lib/db.ts, src/lib/db-errors.ts, src/lib/auth/, src/lib/admin-auth.ts, src/lib/plugins/ and the orphaned src/lib/i18n/server.ts deleted (81 files) after tracing that no retained kids-surface file imports them and the kids import closure stays closed (exit 0). src/lib/i18n/{client,config}.ts, src/lib/kids/** and all kids local progress/audio persistence preserved; no migration run, no auth added, no kids semantics changed. 60 stale tests (01-13) and 22 non-kids src/lib utilities (01-12) that still import the deleted modules were reported in 01-06-deferred-items.md, not fixed.
- [Phase 01]: Non-kids domain utilities pruned in 01-12 (two atomic commits): five domain trees (src/lib/{ai,book,bots,connectors,mcp}, 41 files) and six named server/prompt modules (api-key, hf-data-studio, prompt-access, prompt-list, prompt-write, webhook) removed after per-tree/per-module live-importer tracing proved no non-test importer survives outside the deleted set. src/lib/analytics.ts reduced to the retained analyticsKids interface (9 methods + local trackEvent helper forwarding to window.gtag) with no network/auth/database references; all seven live kids call sites and kids progress untouched. Individual orphaned src/lib helpers (related-content, listing-pagination, rate-limit, trending, urls, …) are 01-13's task-1 inventory — logged to deferred-items.md, not deleted here. Kids import closure stays closed (exit 0).
- [Phase 01]: Kids-only config and dead-code/tests reconciliation (01-13): prompts.config.ts + src/lib/config/index.ts reduced to a typed KidsConfig (branding/theme/i18n) with no PCHAT_* runtime env overrides (owner-approved); 14 unreferenced non-kids src/lib helpers + the i18n barrel removed; 9 obsolete maintenance scripts pruned (keeping check-kids-import-closure.js/check-translations.js/lint-mdx.js); 91 stale tests importing deleted auth/API/bot/data/mcp modules retired; seo.test.ts and vitest.setup.ts repaired — retained suite (89 tests), lint, tsc and kids import closure all green.
- [Phase 01]: [Phase 01-purge-non-kids-code-dependencies]: 01-07 finished dependency/dataset pruning: prompts.csv, PROMPTS.md, public/{book-pdf,bots,sponsors} and three non-kids workflows (docker-publish, reset-credits, update-contributors) deleted; CI env DATABASE_URL dropped (lint+test kept); .env.example reduced to NEXT_PUBLIC_SITE_URL (the only key retained source reads). package.json build -> next build; postinstall, prisma seed config, db:*, setup/generate:examples/book:pdf* scripts removed; every direct package with zero retained imports removed (Prisma/NextAuth/@auth/prisma-adapter/S3/MCP/bcryptjs + Sentry/Monaco/d3/jszip/openai/pino/react-markdown/react-hook-form/cmdk/date-fns/yaml/sharp/puppeteer/tsx/@clack/unused radix), keeping Next/React/next-intl/MDX/kids-UI/Vitest; lock regenerated --package-lock-only (1492 -> 826 packages). All four gates pass: lint 0, test 89/89, tsc 0, normal next build 0 (25 static pages, 19 level routes, no / root). Two lockfile divergences from immutable baseline 2c6e5cfc... were OWNER-APPROVED as benign (Option 2): @testing-library/dom 10.4.1->10.4.2 (registry-published 2026-09-13, integrity verified) and six npm-11-materialized bundled nested entries of the unchanged optional @tailwindcss/oxide-wasm32-wasi@4.1.18; verbatim audit gate human-waived for exactly these categories with 0 other unexpected diffs. All 19 kids levels preserved (requirements prose says 17). / root promotion + static export deferred to Phase 2; NFR-2 certification to Phase 4.
- [Phase 02]: Kids routes relocated to the application root (`/`, `/map`, `/level/[slug]`) rather than redirected, because `output: 'export'` disables Next redirects and `/` must be a real page; the kids chrome (Schoolbell font, gradient sky, pixel clouds, KidsHeader, LevelProvider/MusicProvider/LocaleDirection, `<main>`) was merged into the existing root layout while preserving the already-rebranded root metadata.
- [Phase 02]: Static export set with `output:'export'` + `images.unoptimized` + `trailingSlash:true` (directory-index output for GitHub Pages clean URLs); basePath/assetPrefix and the bundled music URL are driven by `NEXT_PUBLIC_BASE_PATH` (empty by default so local `npm run build` stays navigable). Removed the export-incompatible `experimental.serverActions` and now-unnecessary `images.remotePatterns`.
- [Phase 02]: Background music now loads the bundled `/kids-music.mp3` base-path-aware; no `raw.githubusercontent.com` reference remains. Added `.github/workflows/deploy.yml` (Node 24, `npm ci`, static build, upload-pages-artifact, deploy-pages, github-pages environment, least-privilege perms, concurrency); `ci.yml` untouched.
- [Phase 03]: [G-03-5] World 4 reads `Gaung Penciptaan` everywhere (map bundle `messages/ms.json` title + lesson bodies 4-1:3, 4-2:3, 4-4:3/77/83) and World 5 reads `Gunung Pakar` everywhere (bundle + 5-1:3), removing the residual English word "Master" from the World 5 name. Value edits only — 212 bundle keys preserved; standalone `Master` content headings on 5-1 lines 8/43/55/67/79/91/96 deliberately left untouched as out of scope.
- [Phase 03]: [G-03-4 + G-03-6] ms vocabulary normalized at enumerated file:line sites — invented non-word `bodil`→`lawak` (2-4:82, 3-2:56,58), `bedtime`→`sebelum tidur` (1-3:47), `level/LEVEL`→`tahap/TAHAP` (3-4:3, 4-4:3, 5-4:3,85), `superhero`→`adiwira` (4-1:66, 5-2:90, 5-4:30,31,32); 1-1:30 explanation re-grounded in Malay (no `bahasa Inggeris`) and 1-1:31 aiThinking now quotes the Malay puzzle sentence `Kucing itu duduk di atas tikar`. Committed a persistent deterministic guard `scripts/check-ms-vocabulary.js` (Node stdlib; `git ls-files`-resolved ms set with recursive-walk fallback + loud empty-set failure) that exits non-zero on any recurrence — proven exit 1 with 16 offenders on the pre-edit HEAD tree and exit 0 post-edit. `messages/ms.json` unmodified at 212 keys; en/** and all non-ms locales untouched; deskoped `master` prose/headings not touched.
- [Phase 03]: Phase 3 closed — UAT 10/10 (G-03-4/G-03-6 resolved by 03-06, G-03-5 closed by 03-05); 03-VERIFICATION.md regenerated after gap closure (19/19 must-haves) and canonicalized `human_needed` → `passed`; `03-SECURITY.md` verified (15 threats, threats_open 0). Open advisory (non-blocking, tracked in `03-REVIEW-DISPOSITION.md`, 9 rows open): CR-01/CR-02/WR-01/WR-02 in `scripts/check-ms-vocabulary.js` — guard should walk on-disk (not just `git ls-files`), scope the 1-1 `aiThinking` check to the prop, add the `/i` flag to the `The cat sat` rule, and be wired into CI/npm to actually prevent recurrence. Recommended follow-up, not a Phase 3 blocker.
- [Phase 04]: 04-01 delivered the rerunnable NFR-2 certification source of truth: `scripts/verify-project.js` (Node-stdlib, read-only) re-runs `npx tsc --noEmit` + `npm test` and inspects the already-built `out/` tree (`/`, `/map`, 19 level routes derived from `src/lib/kids/levels.ts`, `kids-music.mp3`), printing PASS/FAIL and exiting non-zero on failure. It deliberately does NOT run `npm run build` (D-12 — build stays in `deploy.yml`); refuses loudly on absent `out/` or an empty derived slug set. Exposed as `npm run verify` and wired into `ci.yml` (new `Run TypeScript type check` step before lint + `Run verification script` step last); `deploy.yml` byte-identical to HEAD (D-13). Certification reproduced: tsc 0, tests 94/94, `npm run verify` exit 0.
- [Phase 04]: Phase 4 closed — the certified gates were re-run green end-to-end (tsc 0, tests 94/94, `npm run build` emits `out/` with `/` + `/map` + 19 level routes) and NFR-2 is flipped to satisfied in REQUIREMENTS.md with Phase-4 evidence (D-01); the rerunnable verification script is committed and `ci.yml` runs the identical gate set (`npx tsc --noEmit` + `npm run verify`) while `deploy.yml` remains untouched (D-12/D-13); `.planning/HANDOFF.md` is the single onboarding/handoff doc (architecture recap, gate commands, GitHub Pages deploy process) and hands off WR-04/IN-03 as known, tracked, non-blocking advisories, unfixed (D-05…D-08).

## Quick Tasks Completed

| Date | Slug | Description | Commit |
|------|------|-------------|--------|
| 2026-11-06 | rename-promi-peromfu | Character rename Promi→Peromfu app-wide (18 locales, slug `1-1-meet-peromfu`, i18n keys, component API, SEO, svgs, localStorage slug migration) + ms 1-1 "dahulu" duplication fix | 304aa078 |

## Accumulated Context

### Roadmap Evolution

- Phase 04.1 inserted after Phase 04: Address tech debt: stale kids import-closure guard + wire ms vocabulary guard into CI (URGENT)

## Deferred Items

Items acknowledged and deferred at milestone close, most recent first:

| Category | Item | Status | Deferred At | Milestone |
|----------|------|--------|-------------|-----------|
| debug_sessions | ms-1-1-wordpredictor-english | diagnosed | 2026-11-07 | v1.0 |
| debug_sessions | ms-rare-vocabulary-bodil | diagnosed | 2026-11-07 | v1.0 |
| deferred_items | 01/deferred-items.md: From 01-08 (component-family pruning) — broken import left in dead non-kids code | acknowledged | 2026-11-07 | v1.0 |
| deferred_items | 01/deferred-items.md: From 01-09 (shared dependency pruning) — dangling `@/data/type-definitions` import left in dead non-kids code | acknowledged | 2026-11-07 | v1.0 |
| deferred_items | 01/deferred-items.md: From 01-12 (non-kids `src/lib` domain-tree pruning) — dangling `@/lib/bots` import left in dead non-kids helper | acknowledged | 2026-11-07 | v1.0 |

## Operator Next Steps

- Start the next milestone with /gsd-new-milestone
