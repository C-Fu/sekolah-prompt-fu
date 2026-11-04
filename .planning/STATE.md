---
gsd_state_version: "1.0"
status: unknown
stopped_at: Completed 01-07-PLAN.md
last_updated: "2026-11-04T22:58:46.941Z"
state_head: 6757c777ce3f1020454f5a5f6e159a149d2c883f
progress:
  total_phases: 4
  completed_phases: 0
  total_plans: 17
  completed_plans: 17
  percent: 0
---

# Project State

## Status
- **Current Phase:** Phase 1 (Purge Non-Kids Code & Dependencies)
- **Status:** Ready to start Phase 1
- **Next Command:** `/gsd-plan-phase 1`

## Key Decisions
- Pure client-side static site architecture for GitHub Pages deployment.
- Storage and game state managed in `localStorage`.
- Support for Bahasa Melayu (`ms`) added across UI and all 17 MDX levels.
- Stripping all server/database dependencies (PostgreSQL, Prisma, NextAuth).
- Root layout is a kids-compatible, auth-free, request-independent shell; the shared `Providers` wrapper exposes only `NextIntlClientProvider` (locale/messages kept as props for later client locale switching).
- i18n request config is deterministic (bundled default-locale messages, no cookie/header lookup); a locale candidate is validated against `supportedLocales` before any message import path is built.
- Kids level content is selected on the client from a validated slug via a statically analyzable, bounded lazy MDX import map (English fallback only when the locale module is absent); the level page performs no request-time locale read.
- Mounted MDX Sections own stable identities resolved to ordered indexes from document order; navigation locking is identity-scoped and fails closed. The legacy numeric context signatures stay callable but cannot unlock a mounted interactive Section until 01-16 migrates the consumers.
- All nine retained interactive MDX consumers (drag-drop-prompt, example-matcher, magic-words, prompt-doctor, prompt-lab, prompt-parts, prompt-vs-mistake, step-by-step, word-predictor) resolve their containing Section via `useSectionIdentity()` and register/persist completion by that resolved index, never the navigation cursor. Adjacent repeated challenges (WordPredictor 3/4, PromptVsMistake 7/8) lock and complete independently. Completion writes refuse an unresolved identity (fail closed). The wrapper's current-Section lock now recomputes on `completedSections` changes so an identity-scoped completion actually unlocks Next (Rule 2 fix in 01-16).
- Client locale switching is a validated, localStorage-persisted preference signal owned by the shared `Providers` (single locale/messages pair switched atomically); the kids layout resolves direction from a client `LocaleDirection` child, and no request-time locale read remains. A genuine user locale change invalidates locale-incompatible useId component drafts and index-based Section completions (fail closed on storage denial) while retaining kids-progress and sound; initial restoration of a saved locale does not invalidate it; confirmed reset clears kids-progress, kids-component-state and kids-section-completion.

## Session

**Last session:** 2026-11-04T22:58:46.644Z
**Stopped at:** Completed 01-07-PLAN.md
**Resume file:** None
- **Last Completed Plan:** 01-12 (non-kids domain utility trees + named server/prompt modules removed — 48 files changed; analytics.ts trimmed to offline analyticsKids, kids import closure closed)

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
