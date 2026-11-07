# Deferred Items — Phase 01

Out-of-scope discoveries logged during plan execution (not fixed, per executor scope boundary).

## From 01-08 (component-family pruning)

- **Broken import left in dead non-kids code (out of scope).**
  `src/lib/plugins/widgets/spacefast.tsx:1` imports `SpacefastWidgetCard` from
  `@/components/widgets/spacefast-widget-card`, which 01-08 deleted (widgets is a
  non-kids feature family). The importer chain is fully dead:
  `spacefast.tsx` → `plugins/widgets/index.ts` → imported only by the deleted
  `src/components/prompts/*` family and stale legacy tests under `src/__tests__`.
  It is **not** part of the retained kids import closure (the closure checker exits 0).
  - **Owner:** `src/lib/**` is owned by 01-06 (lib pruning) / 01-12 (Prisma/auth).
    The `src/lib/plugins/widgets/` subtree is itself a non-kids feature family slated
    for removal by those plans; the stale `src/__tests__/**` references are owned by 01-13.
  - **Action:** leave as-is in 01-08 (would expand scope beyond the declared `<files>`);
    resolver in 01-06/01-12 should delete the widget plugin subtree, which removes the
    dangling import.
  status: acknowledged

## From 01-09 (shared dependency pruning)

- **Dangling `@/data/type-definitions` import left in dead non-kids code (out of scope).**
  `src/lib/ai/improve-prompt.ts:6` imports `{ TYPE_DEFINITIONS } from "@/data/type-definitions"`.
  01-09 removed the whole `src/data/` tree (declared `<files>`), so this bounded typecheck now
  reports `TS2307: Cannot find module '@/data/type-definitions'`.
  - **Importer chain is fully dead w.r.t. the retained game:** `improve-prompt.ts` is imported
    only by `src/lib/mcp/tools/prompts.ts`, `src/app/api/improve-prompt/route.ts` and stale
    legacy tests under `src/__tests__`; none are in the retained kids import closure (the
    closure checker exits 0).
  - **Owner:** `src/lib/ai/**` is owned by **01-12** (`files_modified: src/lib/ai/`), which
    deletes that subtree and therefore removes the dangling import. `src/app/api/**` and the
    stale tests are owned by 01-11/01-13 respectively.
  - **Action:** leave as-is in 01-09 (editing `src/lib/ai/**` would expand scope beyond the
    declared `<files>`); resolver 01-12 removes `src/lib/ai/`, which clears the error.
- **Dangling `src/content/book` path refs left in legacy scripts (out of scope).**
  `scripts/generate-book-pdf.ts:22` and `scripts/lint-mdx.js:17` reference the now-deleted
  `src/content/book` directory by path (no import specifier). Both scripts are in 01-13's
  `<files>` (`scripts/`), which prunes obsolete book/PDF tooling.

- **`use-mobile` removed with no live importer; stale legacy tests now reference a deleted module (out of scope).**
  `src/hooks/use-mobile.ts` had no live (non-test) importer in the retained game — the only
  references were two stale legacy tests. 01-09 removed the hook (its `<files>` include
  `src/hooks/`). Consequently the bounded typecheck now reports:
  - `src/__tests__/hooks/use-mobile.test.ts:3` — `TS2307: Cannot find module '@/hooks/use-mobile'`
  - `src/__tests__/components/injected-action-button.test.tsx:20` — `vi.mock("@/hooks/use-mobile", …)` (runtime only).
  - **Owner:** `src/__tests__/**` is owned by 01-13, which retires tests of deleted modules.
  - **Test-command implication for 01-02/01-06/01-07:** `npm test -- src/__tests__/hooks/use-mobile.test.ts`
    (01-02's tracer verify line) and any full-suite run will fail until 01-13 removes the stale
    test. `npx tsc --noEmit` likewise reports the missing-module error until 01-13 cleans it.
    The retained kids suites (`src/__tests__/kids/*`) and the import-closure checker are unaffected.
  - **Action:** leave the tests as-is in 01-09 (outside `<files>`); 01-13 removes them.

- **`src/components/ui/tooltip` removed; stale legacy test references it (out of scope).**
  `src/components/ui/tooltip.tsx` had no live importer in the retained game (only
  `src/__tests__/components/bot-computer-badge.test.tsx` imported `TooltipProvider`). 01-09
  removed it under its `src/components/ui/` `<files>` set, so the bounded typecheck reports
  `TS2307: Cannot find module '@/components/ui/tooltip'` in that legacy test.
  - **Owner:** `src/__tests__/**` is owned by 01-13. Other UI primitives removed here
    (`masonry` et al.) were likewise referenced only from stale legacy tests / already-deleted
    non-kids families.
  - **Action:** leave as-is; 01-13 retires the stale tests.
  status: acknowledged

## From 01-12 (non-kids `src/lib` domain-tree pruning)

- **Dangling `@/lib/bots` import left in dead non-kids helper (out of scope).**
  `src/lib/related-content.ts:4` imports `{ botSelect, toBotView, type BotView } from "@/lib/bots"`.
  01-12 removed the `src/lib/bots/` domain tree (declared `<files>`), so this module now has a
  dangling specifier. `related-content.ts` already carried dangling `@prisma/client` (line 1) and
  `@/lib/db` (line 3) imports from the 01-06 infrastructure retirement.
  - **Importer chain is fully dead:** `related-content.ts` has **zero live importers** (only
    `src/__tests__/lib/related-content.test.ts`); it is not in the retained kids import closure
    (the closure checker exits 0).
  - **Owner:** individual `src/lib/` helper cleanup is owned by **01-13** (its `src/lib/`
    `<files>` and task-1 action "remove unreferenced prompt CRUD, rate limiting, listing,
    webhook-adjacent, sitemap, old platform utilities"). `src/lib/related-content.ts` is an
    unreferenced individual helper, so it belongs to 01-13's inventory, not 01-12's declared set.
  - **Action:** leave as-is in 01-12; 01-13 removes the dead helper.

- **Dangling `src/lib/book/chapters` import left in legacy PDF script (out of scope).**
  `scripts/generate-book-pdf.ts:18` imports `{ parts, type Chapter } from '../src/lib/book/chapters'`.
  01-12 removed the `src/lib/book/` tree; the script also references the deleted `src/content/book`
  path (per the 01-09 note).
  - **Owner:** `scripts/**` is owned by **01-13** (task 2 explicitly deletes
    `scripts/generate-book-pdf.ts`). The closure checker ignores it (not a kids entry point).
  - **Action:** leave as-is in 01-12; 01-13 deletes the script.

- **Individual `src/lib` helpers orphaned by the 01-12 tree deletions (inventory for 01-13).**
  After removing the five domain trees, these individual helpers have **0 live importers** and are
  now fully dead (`src/lib/` individual-file cleanup is 01-13's task-1 mandate, outside 01-12's
  declared `<files>`): `listing-pagination.ts`, `related-content.ts`, `date.ts`, `format.ts`,
  `list-diff.ts`, `rate-limit.ts`, `run-platforms.ts`, `similarity.ts`, `skill-files.ts`,
  `trending.ts`, `urls.ts`, `variable-detection.ts`, `works-best-with.ts`. `slug.ts`'s only live
  importer is `scripts/convert-pairings-to-teams.ts`; `seo.ts` is now kids-only (preserve).
  - **Action:** recorded for 01-13's inventory; nothing modified here.
  status: acknowledged
