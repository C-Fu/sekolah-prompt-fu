---
phase: 01-purge-non-kids-code-dependencies
plan: 12
subsystem: lib-pruning
tags: [non-kids, domain-trees, analytics-kids, import-closure]
requires:
  - 01-06-PLAN.md
provides:
  - non-kids-domain-utilities-removed
  - offline-kids-analytics
affects:
  - 01-13
tech-stack:
  added: []
  patterns: [import-closure-trace-before-delete, local-kids-analytics-interface]
key-files:
  created: []
  modified:
    - src/lib/analytics.ts
  deleted:
    - src/lib/ai/ (12 files)
    - src/lib/book/ (1 file)
    - src/lib/bots/ (12 files)
    - src/lib/connectors/ (1 file)
    - src/lib/mcp/ (14 files + tools/)
    - src/lib/api-key.ts
    - src/lib/hf-data-studio.ts
    - src/lib/prompt-access.ts
    - src/lib/prompt-list.ts
    - src/lib/prompt-write.ts
    - src/lib/webhook.ts
key-decisions:
  - "Reduced src/lib/analytics.ts to the analyticsKids interface only (9 methods + local trackEvent/GTagEvent helper); every non-kids analytics family dropped. No network/auth/database references remain — trackEvent forwards to the standard window.gtag global, and all seven live kids call sites are unchanged."
  - "Stayed strictly inside the declared <files> set: individual src/lib helper cleanup (listing-pagination, related-content, rate-limit, trending, urls, etc.) is 01-13's task-1 inventory, so the cascade-orphaned helpers were logged to deferred-items rather than deleted here."
  - "Committed directly on main, consistent with every prior plan in this phase (01-06/01-08/01-09 all landed on main); this is the purpose-run main checkout, not an agent worktree."
requirements-completed: [NFR-1, FR-2]  # declared by this plan; shared-ID gate keeps them unmarked until the last declaring sibling SUMMARY exists
metrics:
  duration: 2 min
  completed: 2026-11-04T18:32:52Z
  tasks: 2
  commits: 2
  files_changed: 48
---

# Phase 01 Plan 12: Remove detached non-kids server-domain utilities Summary

Deleted five non-kids domain utility trees (`ai`, `book`, `bots`, `connectors`, `mcp`), the six
named server/prompt modules (`api-key`, `hf-data-studio`, `prompt-access`, `prompt-list`,
`prompt-write`, `webhook`), and trimmed `src/lib/analytics.ts` to the retained, offline
`analyticsKids` interface — leaving the kids game import-complete (closure checker exit 0).

## What Was Built

- **Five domain trees removed (41 files).** `src/lib/ai/` (prompt builder tools, embeddings,
  improve-prompt, quality-check, generation + prompt YAML), `src/lib/book/` (chapters),
  `src/lib/bots/` (team API, pairings, snapshots, upsert, schema, graph), `src/lib/connectors/`
  (registry), and `src/lib/mcp/` (auth, prompts, resources, shared, http, server, tool, tools/).
  Each had **no live (non-test) importer** in the retained kids closure.
- **Six named server/prompt modules removed (6 files).** `api-key.ts`, `hf-data-studio.ts`,
  `prompt-access.ts` (NextAuth-coupled), `prompt-list.ts` (Prisma-coupled), `prompt-write.ts`
  (db/embedding/bot-coupled), `webhook.ts` (db/Prisma-coupled). Their only live importers were the
  five deleted trees (plus the also-deleted `mcp/*`), so no live non-test importer survived.
- **`src/lib/analytics.ts` reduced to the kids interface.** Kept `analyticsKids` (all nine
  methods: `startGame`, `viewLevel`, `completeLevel`, `completeWorld`, `interactiveComplete`,
  `openSettings`, `changeLanguage`, `resetProgress`, `viewMap`) and the local `trackEvent` /
  `GTagEvent` helper. Removed all non-kids families (auth, prompt, bot, search, nav, profile,
  category, tag, settings, hero, sponsor, mcp, engagement, comment, collection, translate,
  external, widget, action-button, admin). **No network, auth or database references remain** —
  `trackEvent` only forwards to the ambient `window.gtag`.

## How It Was Verified

- **Task 1 automated gate (per-group absence + closure):** five trees absent, `kids/progress.ts`
  present, `scripts/check-kids-import-closure.js` → exit 0 (366 modules visited, closure closed).
- **Task 2 automated gate (per-file absence + closure):** six modules absent, `kids/progress.ts`
  and `kids/levels.ts` present, closure checker → exit 0.
- **Plan-level verification:** combined absence gate passes; kids import closure closed; the five
  live kids `@/lib/analytics` importers still resolve; all seven `analyticsKids.*` call sites
  unchanged.
- **Pre-delete safety:** closure confirmed green before any deletion; live-importer trace run for
  each tree and module before removal.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `8f5d0ce0` | feat(01-12): remove five detached non-kids domain utility trees (41 files) |
| 2 | `75b782d4` | feat(01-12): remove detached prompt/api-key utilities and trim analytics to kids |

(Commits measured with `git rev-list --count 91c7e5fe..HEAD` = 2; the 01-06 docs commit `91c7e5fe`
was the plan's starting HEAD. `git diff --stat` across the range: 48 files changed, 7 insertions,
9931 deletions.)

## Deviations from Plan

None affecting the declared `<files>` set — plan executed as written.

**Scope-boundary report (not fixed, per executor scope boundary):**

1. **`src/lib/related-content.ts` now has a dangling `@/lib/bots` import.**
   - **Found during:** Task 1 (after deleting `src/lib/bots/`).
   - **Issue:** `related-content.ts` (which also had pre-existing dangling `@prisma/client` and
     `@/lib/db` imports from 01-06) had **zero live importers**; it is an unreferenced individual
     helper outside 01-12's declared `<files>`.
   - **Action:** left as-is; logged to `deferred-items.md` as 01-13's individual-`src/lib`
     inventory. Kids closure unaffected (checker exits 0).
2. **`scripts/generate-book-pdf.ts` now has a dangling `src/lib/book/chapters` import.**
   - **Found during:** Task 1.
   - **Issue:** the legacy PDF script imports the deleted book tree; `scripts/**` is 01-13's
     `<files>` (its task 2 explicitly deletes this script).
   - **Action:** left as-is; logged to `deferred-items.md`.
3. **13 individual `src/lib` helpers orphaned by the tree deletions** (0 live importers):
   `listing-pagination`, `related-content`, `date`, `format`, `list-diff`, `rate-limit`,
   `run-platforms`, `similarity`, `skill-files`, `trending`, `urls`, `variable-detection`,
   `works-best-with`. `slug.ts`'s sole live importer is a script; `seo.ts` is now kids-only.
   - **Action:** recorded for 01-13's inventory; nothing modified here (outside declared `<files>`).

**Total deviations:** 0 auto-fixed; 3 scope-boundary reports logged to `deferred-items.md`.
**Impact:** none on the retained kids surface — closure stays closed and all kids call sites are
unchanged.

## Deferred Issues

- Stale legacy tests under `src/__tests__/**` that import the deleted trees/modules remain
  (owned by 01-13). Full-project `tsc` / `vitest` stay out of scope for this slice; the bounded
  kids import-closure checker is the load-bearing gate and is green.
- See `.planning/phases/01-purge-non-kids-code-dependencies/deferred-items.md` (## From 01-12).

## Self-Check: PASSED

- Five domain trees absent; six named modules absent; `kids/progress.ts` + `kids/levels.ts` present.
- `node scripts/check-kids-import-closure.js` → exit 0 (before and after both tasks).
- `src/lib/analytics.ts` has no `@prisma/client`, `@/lib/db`, `@/lib/auth` or network references;
  all seven live kids `analyticsKids.*` call sites and all kids progress code unchanged.
- Both task commits present (`8f5d0ce0`, `75b782d4`); no files outside the declared `<files>` set
  modified (only SUMMARY/deferred-items state docs added).