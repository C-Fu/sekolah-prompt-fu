---
phase: 01-purge-non-kids-code-dependencies
plan: 05
subsystem: components
tags: [component-pruning, import-closure, kids-preservation, bounded-verification]
requires:
  - 01-01
  - 01-04
provides:
  - kids-import-closure-checker
  - eight-non-kids-component-families-removed
affects:
  - 01-06
  - 01-08
  - 01-09
  - 01-13
key-files:
  created:
    - scripts/check-kids-import-closure.js
  modified: []
  deleted:
    - src/components/admin/
    - src/components/api/
    - src/components/auth/
    - src/components/book/
    - src/components/bots/
    - src/components/categories/
    - src/components/changes/
    - src/components/comments/
metrics:
  tasks: 2
  commits: 2
  files: 110
  duration: 8 min
  plan_head_before: bae65897e7aab8199701cdad08baafc136ae899a
  plan_head_after: a1d971e09ea93ad47ea16a090c2ba961dc42b86e
actuals:
  tokens: 6100
  tasks: 2
  commits: 2
---

# Phase 01 Plan 05: Prune Legacy Component Families (Group A + Group B) Summary

Added a reusable read-only kids import-closure checker (`scripts/check-kids-import-closure.js`), then deleted eight orphaned non-kids component families in two bounded groups — `admin/api/auth/book` and `bots/categories/changes/comments` (110 files, ~25,176 deletions) — after proving that neither the retained kids routes nor the shared provider shell ever imports them; kids components, `src/components/providers/index.tsx`, `mdx-components.tsx` and the bounded import closure remain intact.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `ced6563c` | feat(01-05): delete admin/api/auth/book families and add kids import-closure checker |
| 2 | `a1d971e0` | feat(01-05): delete bots/categories/changes/comments component families |

`plan_head_before` = `bae65897` (01-04 completion); `plan_head_after` = `a1d971e0`. Commits measured with `git rev-list --count bae65897..HEAD` = 2.

## Task Results

### Task 1 — Delete approved admin/auth/API/book component families

- Created `scripts/check-kids-import-closure.js`: a read-only closure checker that starts from the retained kids surface (`src/app/**` layout/error/not-found + `/kids/**` routes, `src/components/kids/**`, `src/components/providers/index.tsx`, `mdx-components.tsx`), recursively resolves repo-local `@/…` and relative `import`/`export … from` plus dynamic `import()` specifiers across `.ts/.tsx/.js/.jsx/.json/.mdx` and `index.*` variants, and reports the missing target **and** the importer with a nonzero exit. Bare npm imports and CSS/assets are ignored; dynamic `content/kids/en/<slug>.mdx` registry specifiers are validated against `src/content/kids/en` files.
- Traced retained importers before deletion: **no** retained kids entry point (app files, `kids/**`, `providers/index.tsx`, `mdx-components.tsx`) imports any of the eight target families. The only importers of the targets are the target families themselves, the surviving non-kids `src/components/prompts/*` family (owned by other plans), and stale legacy tests under `src/__tests__` (owned by 01-13). No genuinely shared component required relocation.
- Deleted `src/components/{admin,api,auth,book}` (22 files).

**Verify (automated):**
`node -e "…admin/api/auth/book absent; kids/elements, providers/index.tsx, checker present…" && node scripts/check-kids-import-closure.js` → **PASS** (exit 0).

### Task 2 — Delete detached bots, category, changes and comments components

- Re-traced live imports from kids and the shared shells: again **no** retained kids importer references these families. Preserved kids interactions and local progress state (untouched; `progress-map.tsx` and `src/lib/kids/progress.ts` unchanged).
- Deleted `src/components/{bots,categories,changes,comments}` (44 files).

**Verify (automated):**
`node -e "…bots/categories/changes/comments absent; kids/elements/progress-map.tsx present…" && node scripts/check-kids-import-closure.js` → **PASS** (exit 0).

## Verification

- **Plan `<verification>`:** both four-directory absence inventories confirmed (`admin api auth book` and `bots categories changes comments` all gone); retained import closure closed after each group.
- **`<success_criteria>`:** eight named non-kids component families removed while the kids-game import closure stays intact. ✅
- **`must_haves.artifacts`:** `src/components/kids/`, `src/components/providers/index.tsx`, `scripts/check-kids-import-closure.js` all present. ✅
- **Bounded check (no full-project tsc):** `node scripts/check-kids-import-closure.js` exits 0 — every repo-local specifier in the retained closure resolves (366 modules visited; 19 English kids MDX slugs validated).
- **Lint (`npm run lint`):** exit 0, 0 errors (112 pre-existing warnings in unrelated `src/lib`/`src/components/ui` files — out of scope).
- **Negative-control test:** injecting a fake `@/components/admin/does-not-exist` import into a kids file made the checker report the missing target + importer with exit 1; the file was restored immediately (working tree clean).
- **Full-project `tsc` deliberately not run** — it still includes stale legacy tests (`src/__tests__/**`, cleaned in 01-13) that reference the deleted families; the plan scopes verification to the bounded closure checker for exactly this reason.

## Deviations from Plan

**1. [Rule 1 - Bug] Checker mis-resolved dotted basenames without a real module extension**
- **Found during:** Task 1 (first checker run before deletion).
- **Issue:** `src/lib/seo.ts` imports `@/../prompts.config` (root config). `path.extname` reported `.config`, so the resolver treated it as an explicit extension and never appended `.ts`, producing a false "missing target" failure.
- **Fix:** Only treat the basename suffix as an explicit extension when it is a known module extension (`.ts/.tsx/.js/.jsx/.json/.mdx`); otherwise try extension and `index.*` variants. Verified the checker then exits 0 on the real closure.
- **Files modified:** `scripts/check-kids-import-closure.js`.
- **Commit:** `ced6563c` (folded into the Task 1 commit).

**2. [Rule 3 - Blocking issue] SDK `query commit --files <deleted-dir>` no-ops on staged deletions**
- **Found during:** Task 2 commit.
- **Issue:** After `git rm -r`, the `query commit --files src/components/{bots,…}` verb matched no working-tree files and returned `nothing`, leaving 44 deletions staged and uncommitted.
- **Fix:** Committed the already-staged deletions with a conventional, 01-05-scoped `git commit` message (same single logical change). No scope expansion.
- **Files affected:** `src/components/{bots,categories,changes,comments}` (44 deletions).
- **Commit:** `a1d971e0`.

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking issue). **Impact:** none on plan scope — both kept the two-group deletion pattern and the bounded closure verification intact; no file outside the declared `<files>` set was touched.

## Known Stubs

None. This plan only adds a checker and removes orphaned directories; no placeholder or stub code was introduced.

## Threat Flags

None. No new network endpoints, auth paths, file-access patterns or trust-boundary schema changes were introduced (removal-only plus one read-only local script). `T-01-04` (missing kids import) mitigated via the per-group closure check; `T-01-SC` (installs) accepted — no installs performed.

## Decisions Made

1. **Relocation vs. deletion:** Because no retained kids importer references any of the eight families, nothing needed relocating — all eight were deleted outright, satisfying the plan's "relocate a genuinely shared component rather than deleting something the kids game needs" without a relocation.
2. **Bounded verification over full `tsc`:** Per plan, used the closure checker as the compile-adjacent gate; deferred whole-project type-checking until the stale legacy tests are removed in 01-13.

## Next

More plans remain in Phase 01 — ready for the next plan (remaining component families are handled by 01-08/01-09; `src/lib`/Prisma/auth by 01-06/01-12; packages by 01-07; legacy tests by 01-13).

## Self-Check: PASSED

- Created file exists: `scripts/check-kids-import-closure.js` — FOUND.
- Commits exist and are ancestors of HEAD: `ced6563c`, `a1d971e0` — FOUND.
- Eight target directories absent; retained artifacts present; closure checker exits 0.
- Working tree clean; no files outside the declared `<files>` set modified (checker is the sole addition; SUMMARY/state docs excluded).