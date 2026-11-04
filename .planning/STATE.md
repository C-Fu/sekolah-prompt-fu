---
gsd_state_version: "1.0"
status: unknown
stopped_at: Completed 01-09-PLAN.md
last_updated: "2026-11-04T18:19:24.025Z"
state_head: 41018c943ac9bf77bc5c7faddf79023dfa5a54b4
progress:
  total_phases: 4
  completed_phases: 0
  total_plans: 17
  completed_plans: 13
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

**Last session:** 2026-11-04T18:19:23.712Z
**Stopped at:** Completed 01-09-PLAN.md
**Resume file:** None
- **Last Completed Plan:** 01-09 (Selective shared-dependency pruning — book/editor data removed; providers/UI/hooks pruned to live importers)

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

## Decisions

- [Phase 01]: Thirteen non-kids route trees (auth, [username], about, admin, book, bots, brand, categories, collection, developers, discover, docs, embed) deleted as two atomic route slices; kids entry/map/level/layout and all 01-11-owned routes preserved. Retained routes still linking to deleted paths are out of scope for this slice.
- [Phase 01]: Remaining thirteen community routes (feed, how-to-write-effective-prompts, presentation, privacy, promptmasters, prompts, settings, skills, support, tags, taste, terms, workflows) deleted as two atomic slices; `/kids` tree, root layout, globals.css and shared error files preserved. Cross-tree references to removed routes remain only in two 01-13-owned test files (reported, not modified).
- [Phase 01]: Kids MDX registry reduced to the 12 components used by src/content/kids/**/*.mdx plus basic table tags; Section stays bound to the real exported component (no bypass wrapper) so 01-15/01-16 section registration is preserved; book/prompt imports removed.
- [Phase 01]: src/lib/seo.ts canonical origin now derives from NEXT_PUBLIC_SITE_URL (fallback https://prompts.chat), removing NEXTAUTH_URL coupling; community pagination/sitemap helpers (paginatedPath, escapeXml, toSitemapImageUrl) removed; buildPageMetadata/NOINDEX_ROBOTS retained.
- [Phase 01]: Sentry instrumentation/config and legacy proxy rewrites deleted; next.config.ts unwrapped from withSentryConfig and stripped of standalone output and legacy redirects/crawler headers; error/not-found pages retargeted to /kids and /kids/map. Static export and image optimization untouched (Phase 2).
- [Phase 01]: Eight orphaned non-kids component families (admin, api, auth, book, bots, categories, changes, comments) deleted in two atomic groups after proving no retained kids importer references them; added a reusable read-only kids import-closure checker (scripts/check-kids-import-closure.js) as the bounded post-prune verification gate, since full-project tsc still includes stale legacy tests cleaned in 01-13.
- [Phase 01-purge-non-kids-code-dependencies]: Defer dangling src/lib/plugins/widgets import to 01-06/01-12 rather than expand 01-08 scope (dead chain, outside kids closure).
- [Phase 01]: Selective shared-dependency prune (01-09): removed book MDX corpus (src/content/book) and editor data (src/data) plus 3 provider siblings, 31 UI primitives and src/hooks/use-mobile.ts, keeping only files with a live importer in the retained kids closure; providers/index.tsx, ui/button.tsx and ui/sonner.tsx retained; dangling importers in 01-12/01-13-owned subtrees logged, not fixed.
