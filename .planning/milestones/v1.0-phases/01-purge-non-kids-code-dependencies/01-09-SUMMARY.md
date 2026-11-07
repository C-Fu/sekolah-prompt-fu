---
phase: 01-purge-non-kids-code-dependencies
plan: 09
subsystem: ui
tags: [shared-dependencies, selective-prune, import-closure, mdx-content, book-removal, ui-primitives, providers, hooks]
requires:
  - 01-08-PLAN.md
provides:
  - book-and-editor-data-removed
  - shared-ui-primitives-pruned-to-live-importers
  - providers-retained-to-kids-shell-only
affects:
  - 01-06
  - 01-12
  - 01-13
key-files:
  created: []
  modified:
    - src/components/providers/index.tsx
    - src/components/ui/button.tsx
    - src/components/ui/sonner.tsx
  removed:
    - src/content/book/
    - src/data/
    - src/components/providers/branding-provider.tsx
    - src/components/providers/locale-detector.tsx
    - src/components/providers/theme-styles.tsx
    - src/components/ui/ (31 primitives)
    - src/hooks/use-mobile.ts
key-decisions:
  - "Selective prune, not recursive delete: keep only shared files with a live importer in the retained kids closure; keep providers/index.tsx, ui/button.tsx and ui/sonner.tsx."
  - "Remove all of src/content/book/ and src/data/ because no retained entry (MDX registry, kids routes, build config, error surfaces) imports them."
  - "Remove src/hooks/use-mobile.ts and its pair: no live (non-test) importer remained; the stale test is 01-13-owned (test-command implication recorded)."
  - "Leave 01-12/01-13-owned dangling importers (src/lib/ai/**, src/__tests__/**, scripts/**) untouched and log them to deferred-items.md rather than expand scope."
actuals:
  tokens: 53760
  tasks: 2
  commits: 2
metrics:
  duration: 4 min
  completed: 2026-11-04
  files_changed: 601
  lines_deleted: 215039
status: complete
---

# Phase 01 Plan 09: Selective Shared-Dependency Pruning Summary

**Removed the non-kids book MDX corpus and editor data (565 files, ~215k lines) and pruned shared providers/UI primitives/hooks down to the exact files the retained kids game imports — `providers/index.tsx`, `ui/button.tsx`, `ui/sonner.tsx` — with the kids import closure staying green.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-11-04T18:14:38Z
- **Completed:** 2026-11-04T18:18:44Z
- **Tasks:** 2 / 2
- **Files changed:** 601 (565 book/data deletions, 35 provider/UI/hook deletions, 1 planning doc)

## Commits

| Task | Commit | Description |
| ---- | ------ | ----------- |
| 1 | `eb6af181` | `feat(01-09): remove book content and editor data trees` |
| 2 | `41018c94` | `feat(01-09): prune shared providers, UI primitives and hooks by retained imports` |
| (metadata) | see final docs commit | `docs(01-09): complete …` SUMMARY/STATE/ROADMAP |

## Task 1 — Remove book content and editor data

Traced imports before deleting: the retained MDX registry (`mdx-components.tsx`), kids routes (`src/app/kids/**`), the kids component tree and `next.config.ts` all import **neither** `src/content/book` nor `src/data`.

- Deleted `src/content/book/` (all 29 chapter slugs × 16 locale dirs) and `src/data/` (`api-docs.ts`, `type-definitions.ts`, `method-options.ts`, `sql-examples.json`).
- Preserved every locale directory under `src/content/kids/**` (ar, az, de, el, en, es, fa, fr, it, ja, ko, nl, pt, ru, tr, zh — 19 MDX each); `src/content/kids/en/1-1-meet-promi.mdx` intact.

## Task 2 — Prune providers, UI primitives and hooks by retained imports

Traced the transitive kids closure from `src/app/kids/**`, `src/components/kids/**`, `mdx-components.tsx`, the error surfaces (`src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/global-error.tsx`) and the retained kids tests (`src/__tests__/kids/*`).

- **Providers** — removed `branding-provider.tsx`, `locale-detector.tsx`, `theme-styles.tsx` (no live importer; retired non-kids shell). Retained `index.tsx` (imported by `src/app/layout.tsx`, `src/components/kids/layout/settings-modal.tsx` and the retained kids test).
- **UI** — retained `button.tsx` (kids elements + error surfaces) and `sonner.tsx` (imported by `providers/index.tsx`); removed the other **31** primitives, each with no live importer in the retained closure.
- **Hooks** — removed `src/hooks/use-mobile.ts` (no live non-test importer; only stale legacy tests referenced it).

## Verification

| Gate | Command | Result |
| ---- | ------- | ------ |
| Task 1 presence | `node -e "…['src/content/book','src/data'] absent && kids MDX exists…"` | PASS |
| Task 2 presence | `node -e "…providers/index.tsx, ui/button.tsx, progress-map.tsx exist…"` | PASS |
| Kids import closure | `node scripts/check-kids-import-closure.js` | PASS (exit 0, 366 modules, 19 en slugs, closure closed) |
| Lint | `npm run lint -- --quiet` | PASS (exit 0) |
| Bounded typecheck | `npx tsc --noEmit` | 288 baseline errors → 291; **3 new, all out-of-scope** (see below) |

**New bounded-typecheck errors (all outside the declared `<files>`, owned by later plans, NOT fixed here):**

| File | Error | Owner |
| ---- | ----- | ----- |
| `src/lib/ai/improve-prompt.ts:6` | `TS2307: Cannot find module '@/data/type-definitions'` | 01-12 (removes `src/lib/ai/`) |
| `src/__tests__/hooks/use-mobile.test.ts:3` | `TS2307: Cannot find module '@/hooks/use-mobile'` | 01-13 (removes stale tests) |
| `src/__tests__/components/bot-computer-badge.test.tsx:3` | `TS2307: Cannot find module '@/components/ui/tooltip'` | 01-13 (removes stale tests) |

Baseline already carried 288 errors (Prisma/scripts/stale legacy tests); these three are the only ones this plan introduces, and all three resolve when 01-12/01-13 delete their owning subtrees.

## Deviations from Plan

### Auto-fixed Issues

None — both tasks executed exactly as written.

### Out-of-scope breakage (logged, not fixed)

Per deviation Scope Boundary (and matching the 01-08 precedent), three dangling importers created by this plan's deletions live in files owned by later plans. They were **reported, not edited** (editing them would expand scope beyond the declared `<files>`):

1. `@/data/type-definitions` from `src/lib/ai/improve-prompt.ts` → **01-12** owns `src/lib/ai/`.
2. `@/hooks/use-mobile` / `@/components/ui/tooltip` from `src/__tests__/**` → **01-13** owns tests.
3. `src/content/book` path refs in `scripts/generate-book-pdf.ts` / `scripts/lint-mdx.js` → **01-13** owns `scripts/`.

All are recorded in `.planning/phases/01-purge-non-kids-code-dependencies/deferred-items.md`.

**Total deviations:** 0 auto-fixed. **Impact:** none — the retained kids import closure and lint are green; the only new type errors are in subtrees scheduled for deletion by 01-12/01-13.

## Test-command implication for 01-02 / 01-06 / 01-07

`src/hooks/use-mobile.ts` was removed with the pair (no retained code uses it). Its stale test remains (01-13-owned), so:

- `npm test -- src/__tests__/hooks/use-mobile.test.ts` (01-02's tracer `<verify>`) will fail until 01-13 removes the stale test.
- Any full-suite run and `npx tsc --noEmit` will surface the `@/hooks/use-mobile` missing-module error until 01-13 cleans it.
- The retained kids suites (`src/__tests__/kids/level-locale.test.tsx`, `settings-locale.test.tsx`) and `scripts/check-kids-import-closure.js` are unaffected (they reference only retained modules).

## Threat Surface Scan

No new security-relevant surface introduced — this plan is deletion-only. Behaviour preserved: `providers/index.tsx`, `ui/button.tsx`, `ui/sonner.tsx` remain, and the kids import closure resolves.

## Known Stubs

None — deletion-only plan; no stub/placeholder values introduced.

## Threat Flags

None.

## Self-Check: PASSED

- `src/content/book` and `src/data` confirmed absent; `src/content/kids/en/1-1-meet-promi.mdx` and all 16 locale dirs present.
- `src/components/providers/index.tsx`, `src/components/ui/button.tsx`, `src/components/ui/sonner.tsx` present; `progress-map.tsx` present.
- `scripts/check-kids-import-closure.js` exits 0; `npm run lint -- --quiet` exits 0.
- Commits `eb6af181` and `41018c94` on `main`; `git rev-list --count 17ba8e6a..HEAD` = 2 (ledger-measured).