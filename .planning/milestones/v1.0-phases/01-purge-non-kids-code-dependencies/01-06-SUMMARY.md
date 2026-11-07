---
phase: 01-purge-non-kids-code-dependencies
plan: 06
subsystem: infrastructure
tags: [prisma-removal, nextauth-removal, deletion-only, kids-preservation, bounded-verification]
requires:
  - 01-01
  - 01-04
  - 01-09
provides:
  - prisma-infra-retired
  - nextauth-server-trees-retired
  - db-auth-plugin-trees-absent
affects:
  - 01-12
  - 01-13
key-files:
  created: []
  modified: []
  deleted:
    - prisma/
    - prisma.config.ts
    - src/lib/auth/
    - src/lib/db.ts
    - src/lib/admin-auth.ts
    - src/lib/db-errors.ts
    - src/lib/plugins/
    - src/lib/i18n/server.ts
metrics:
  tasks: 1
  commits: 1
  files: 81
  duration: 6 min
  plan_head_before: 120e10c3e0295bc2a85ed88ea86fc738f42e0ec4
  plan_head_after: b73c653077791bdee28d6f218b1f18a49b3f53ef
actuals:
  tokens: 1320
  tasks: 1
  commits: 1
---

# Phase 01 Plan 06: Remove Approved Prisma and NextAuth Server Trees Summary

Deleted the entire approved database/auth infrastructure in one bounded removal-only commit — `prisma/` (schema, 40 migrations, seed/reset scripts), `prisma.config.ts`, the Prisma client singleton and helpers (`src/lib/db.ts`, `src/lib/db-errors.ts`), NextAuth trees (`src/lib/auth/`, `src/lib/admin-auth.ts`), the provider/plugin system (`src/lib/plugins/`) and the orphaned db-backed server locale action (`src/lib/i18n/server.ts`) — 81 files / 5,270 lines removed, after proving that no retained kids-surface file imports any of them and that the kids import closure stays closed (366 modules, exit 0); `src/lib/i18n/client.ts`, `src/lib/i18n/config.ts`, `src/lib/kids/**` and all kids local progress/audio persistence are untouched.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `b73c6530` | feat(01-06): retire approved Prisma and NextAuth server trees (81 deletions) |

`plan_head_before` = `120e10c3` (01-05 completion); `plan_head_after` = `b73c6530`. Commits measured with `git rev-list --count 120e10c3..HEAD` = 1.

## Task Results

### Task 1 — Remove approved Prisma and NextAuth server trees

**Import trace before deletion (read-first gate honoured).** Read every `<read_first>` file (`prisma.config.ts`, `prisma/schema.prisma`, `src/lib/db.ts`, `src/lib/auth/index.ts`, `src/lib/i18n/server.ts`, `src/lib/kids/progress.ts`) plus `src/lib/admin-auth.ts`, `src/lib/db-errors.ts`, `src/lib/kids/levels.ts`, `src/lib/config/index.ts`, `prompts.config.ts`, `src/lib/i18n/index.ts` and `scripts/check-kids-import-closure.js`. Then grepped the whole `src/` tree for importers of the target modules:

- **No retained kids-surface importer** (`src/lib/kids/**`, `src/components/kids/**`, the kids app routes, `src/components/providers/index.tsx`, `mdx-components.tsx`) references `@/lib/db`, `@/lib/auth`, `@/lib/admin-auth`, `@/lib/plugins`, `@/lib/db-errors`, `@/lib/i18n/server` or `@prisma/client`. The only importers are (a) files inside the deletion set itself, (b) non-kids `src/lib` utilities owned by 01-12, and (c) legacy tests under `src/__tests__` owned by 01-13.
- `src/lib/i18n/index.ts` re-exports only from `./config` and `./client` — never `./server`; `server.ts` had zero importers and was pure dead code.
- Nothing needed relocating: the plan's "trace retained imports" clause resolved to "no retained closure depends on any target".

**Deletion.** `git rm -r` on the eight declared targets: `prisma/`, `prisma.config.ts`, `src/lib/auth/`, `src/lib/db.ts`, `src/lib/admin-auth.ts`, `src/lib/db-errors.ts`, `src/lib/i18n/server.ts`, `src/lib/plugins/` — 81 files, 5,270 deletions. No migration was run, no auth mechanism was added, and no kids progress/audio semantics were changed (the deleted `server.ts` was a DB-cookie sync action with no remaining caller).

**Verify (automated):**
`node -e "…prisma, prisma.config.ts, src/lib/auth, src/lib/db.ts, src/lib/admin-auth.ts, src/lib/db-errors.ts, src/lib/i18n/server.ts, src/lib/plugins all absent; src/lib/kids/progress.ts present…" && node scripts/check-kids-import-closure.js` → **PASS** (exit 0; checker visited 366 modules, validated 19 English kids MDX slugs).

## Verification

- **Task `<verify>` (automated):** PASS — all eight named targets absent, `src/lib/kids/progress.ts` present, kids import closure closed.
- **`<acceptance_criteria>`:** PASS — every named DB/auth tree absent; kids local persistence untouched.
- **`<fails_when>`:** not triggered — no DB/auth implementation remains and `src/lib/kids/progress.ts` survives.
- **Preserved artifacts confirmed at HEAD:** `src/lib/i18n/client.ts`, `src/lib/i18n/config.ts`, `src/lib/kids/progress.ts`, `src/lib/kids/levels.ts`, `src/components/kids/layout/background-music.tsx` — all still tracked.
- **Scope containment:** `git status --short` before commit showed exactly the 81 deletions inside the declared `<files>` set — zero files outside it.
- **Post-commit deletion check:** `git show --diff-filter=D` reports 81 deletions, all intended (no accidental disappearance of a preserved file).
- **Full-project `tsc`/`vitest` deliberately not run** — they still include the 60 stale legacy tests and 22 non-kids `src/lib` utilities that now import the deleted modules; those are owned by 01-13 and 01-12 respectively (see Deferred Items). Verification is scoped to the bounded infra-absence gate + kids closure checker for exactly this reason.

## Deviations from Plan

None - plan executed exactly as written.

The single task ran on the first attempt: read-first gate honoured, import trace confirmed no retained dependency, eight declared targets removed, `<verify>` passed, one atomic commit. No bugs, no blocking issues, no architectural changes — so no deviation rules were triggered.

## Known Stubs

None. This plan is removal-only; it introduced no placeholder or stub code.

## Threat Flags

None. No new network endpoints, auth paths, file-access patterns or trust-boundary schema changes were introduced — the commit is pure deletion. `T-01-05` (information disclosure via auth/DB integration) is mitigated by removing the provider/DB files outright with no live retained imports; `T-01-SC` (installs) accepted — no installs performed.

## Deferred Items (out of scope — reported, not fixed)

Recorded in `01-06-deferred-items.md`:

- **01-12:** 22 retained non-kids `src/lib` modules still import the deleted `@/lib/db`, `@/lib/auth` or `@prisma/client` (bots/*, mcp/*, ai/*, listing-pagination, prompt-{access,list,write}, related-content, webhook).
- **01-13:** 60 stale test files under `src/__tests__/**` still import/mock the deleted modules.
- **01-12/01-13/01-07:** `package.json` Prisma scripts (`build`, `postinstall`, `db:*`) and `scripts/{convert-pairings-to-teams,seed-skills}.ts` still reference `prisma`/`@prisma/client`.

None were modified here — doing so would exceed the declared `<files>` set and collide with the owning plans.

## Decisions Made

1. **Deletion without relocation.** The import trace showed no retained kids-surface dependency on any target, so all eight trees were deleted outright (no shared module needed moving), satisfying the plan's relocation clause as a no-op.
2. **Bounded verification.** Used the infra-absence gate plus the 01-05 closure checker as the compile-adjacent gate; deferred whole-project `tsc`/`vitest` until 01-12 (utilities) and 01-13 (tests) prune the orphaned importers — matching the plan's "expect obsolete legacy tests to remain until 01-13".
3. **Out-of-scope `package.json` scripts left intact.** The Prisma-coupled npm scripts are outside this plan's `<files>` set (config/tooling belongs to 01-12/01-13); reported rather than touched.

## Next

More plans remain in Phase 01 — ready for the next plan. Utilities (`src/lib`) pruning is 01-12; scripts/config 01-12/01-13; stale tests 01-13; packages 01-07; static export Phase 2.

## Self-Check: PASSED

- Deleted targets absent: `prisma`, `prisma.config.ts`, `src/lib/auth`, `src/lib/db.ts`, `src/lib/admin-auth.ts`, `src/lib/db-errors.ts`, `src/lib/i18n/server.ts`, `src/lib/plugins` — FOUND absent in working tree and at HEAD.
- Preserved artifacts present: `src/lib/i18n/client.ts`, `src/lib/i18n/config.ts`, `src/lib/kids/progress.ts`, `src/lib/kids/levels.ts`, `src/components/kids/layout/background-music.tsx` — FOUND.
- Commit exists and is an ancestor of HEAD: `b73c6530` — FOUND.
- Kids import closure exits 0; working tree clean; no files outside the declared `<files>` set modified (SUMMARY/deferred-items/state docs excluded).