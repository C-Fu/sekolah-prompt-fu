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