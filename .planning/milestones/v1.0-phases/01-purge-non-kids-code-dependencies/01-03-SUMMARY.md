---
phase: 01-purge-non-kids-code-dependencies
plan: 03
subsystem: app-routing
tags: [deletion, api-removal, routing, kids-preservation]
requires:
  - 01-17-PLAN.md
provides:
  - legacy-route-prefixes-absent
  - community-root-and-discovery-endpoints-absent
affects:
  - 01-07
  - 01-10
  - 01-11
key-files:
  created: []
  modified:
    - src/app/page.tsx
    - src/app/robots.ts
    - src/app/sitemap.ts
requirements-completed: [NFR-1, FR-1]
metrics:
  tasks: 2
  commits: 2
  plan_head_before: 41cc1230bcd04c8052006ba32342fa4fcfe85b73
  plan_head_after: c1099a0b
---

# Phase 1 Plan 03: Remove Legacy API, Machine-Readable and Root Endpoints Summary

Deleted the four legacy route prefixes (API, `.well-known` skills discovery, `prompts.csv`, `prompts.json` — 80 files) plus the database-backed community root and dynamic `robots`/`sitemap`, while keeping every `/kids` entry route, the root layout, `globals.css` and shared error files intact. `/` is deliberately not promoted to the kids home until Phase 2.

## What Was Built

- **Task 1 — Remove legacy API and machine-readable routing:** `git rm -r` on the four exact prefixes. 80 files removed: `src/app/api/**` (admin, auth/nextauth, bots, MCP, prompt-builder, health, webhooks, media-generate, exports and all nested resources), `src/app/.well-known/skills/**` (2 handlers), `src/app/prompts.csv/route.ts`, `src/app/prompts.json/route.ts`. No retained code outside these trees imports them (importers live only in `src/__tests__/api/**` and `src/components/admin/**`, owned by 01-13 and 01-05 respectively).
- **Task 2 — Remove community root landing and dynamic discovery endpoints:** Deleted `src/app/page.tsx` (DB/config/auth-backed community landing), `src/app/robots.ts` and `src/app/sitemap.ts` (Prisma-backed dynamic discovery). Retained `/kids/**`, `src/app/layout.tsx`, `src/app/globals.css`, and `error.tsx` / `global-error.tsx` / `not-found.tsx`. Phase 2 owns root promotion and static discovery.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `017bfef8` | feat(01-03): remove legacy API and machine-readable routing (80 files) |
| 2 | `c1099a0b` | feat(01-03): remove community root landing and dynamic discovery endpoints (3 files) |

## Verification

- **Task 1 `<verify>`:** `node -e "…existsSync checks…"` → exit 0 (PASS). All four prefixes absent; all three kids entry files present.
- **Task 2 `<verify>`:** `node -e "…existsSync checks…"` → exit 0 (PASS). Root/discovery files absent; `src/app/kids/page.tsx` present.
- **Kids registry:** 19 level slugs across 5 worlds in `src/lib/kids/levels.ts`; `getAllLevels`/`getLevelBySlug` intact — matches the plan's `must_haves` truths.
- **Kids entry routes:** `src/app/kids/page.tsx`, `src/app/kids/map/page.tsx`, `src/app/kids/level/[slug]/page.tsx` all present.
- **Shared files retained:** `src/app/layout.tsx`, `src/app/globals.css`, `src/app/error.tsx`, `src/app/global-error.tsx`, `src/app/not-found.tsx`.

## Deviations from Plan

None - plan executed exactly as written.

Pre-deletion importer check confirmed the kids game has zero dependency on the four route trees. Importers of `src/app/api/**` exist only in `src/__tests__/api/**` (owned by 01-13) and `src/components/admin/prompts-management.tsx` (owned by 01-05); both are outside this plan's declared `<files>` and are left for their owning plans to reconcile — not silently retained within the deleted trees.

## Self-Check: PASSED

- `[ -d src/app/api ]` → absent; `[ -d src/app/.well-known ]` → absent; `[ -d src/app/prompts.csv ]` → absent; `[ -d src/app/prompts.json ]` → absent.
- `[ -f src/app/kids/page.tsx ]`, `[ -f src/app/kids/map/page.tsx ]`, `[ -f "src/app/kids/level/[slug]/page.tsx" ]` → all FOUND.
- `[ -f src/app/page.tsx ]`, `[ -f src/app/robots.ts ]`, `[ -f src/app/sitemap.ts ]` → all absent.
- `git merge-base --is-ancestor 017bfef8 HEAD` → FOUND; `git merge-base --is-ancestor c1099a0b HEAD` → FOUND.
- Working tree clean after both commits; no files modified outside the declared `<files>` set.