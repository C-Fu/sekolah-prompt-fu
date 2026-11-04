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