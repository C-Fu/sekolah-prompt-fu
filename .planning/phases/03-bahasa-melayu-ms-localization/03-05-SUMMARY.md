---
phase: 03-bahasa-melayu-ms-localization
plan: 05
subsystem: i18n (Bahasa Melayu content)
tags: [gap-closure, localization, ms, content-consistency]
gap_closure: true
gap_ids: ["G-03-5"]
requirements: [FR-3]
dependency_graph:
  requires: ["03-04"]
  provides: ["consistent ms World 4/5 display names across map bundle and lesson bodies"]
  affects: ["messages/ms.json", "src/content/kids/ms/*.mdx"]
tech-stack:
  added: []
  patterns: ["single source of truth for World display names"]
key-files:
  created: []
  modified:
    - messages/ms.json
    - src/content/kids/ms/4-1-pretend-time.mdx
    - src/content/kids/ms/4-2-story-starters.mdx
    - src/content/kids/ms/4-4-world-builder.mdx
    - src/content/kids/ms/5-1-perfect-prompt.mdx
decisions:
  - "World 4 is 'Gaung Penciptaan' everywhere (bundle + 5 lesson locations)."
  - "World 5 is 'Gunung Pakar' everywhere; no English word remains inside the World 5 name."
metrics:
  duration: 2 min
  completed: "2026-11-05"
status: complete
actuals:
  tokens: 3200
  tasks: 2
  commits: 2
plan_head_before: f12b411e30384ca928fb16922e231a7865658892
plan_head_after: 5ed4219314a65ef3ce9dee07cdb5119ba52c5b48
---

# Phase 3 Plan 05: Reconcile ms World 4/5 Display Names Summary

Closed UAT gap **G-03-5** by reconciling the Bahasa Melayu World 4 and World 5 display names: World 4 now reads `Gaung Penciptaan` in the map bundle and in every lesson-body occurrence, and World 5 reads `Gunung Pakar` with the residual English word "Master" removed from the World name — the map and the lessons now agree exactly.

## What Was Built

A pure string-value reconciliation across the `ms` corpus. Five files edited (1 bundle value + 6 lesson-body strings), with zero structural, key, or formatting change:

- `messages/ms.json` `kids.worlds[4].title`: `Ngarai Penciptaan` → `Gaung Penciptaan`; `kids.worlds[5].title` left at `Gunung Pakar`; exactly 212 leaf keys preserved.
- `src/content/kids/ms/4-1-pretend-time.mdx:3`: `**Ngarai Cipta**` → `**Gaung Penciptaan**` (bold markers kept).
- `src/content/kids/ms/4-2-story-starters.mdx:3`: bare `Ngarai Cipta` → `Gaung Penciptaan` (kept unbolded).
- `src/content/kids/ms/4-4-world-builder.mdx:3,77,83`: all three `Ngarai Cipta` occurrences → `Gaung Penciptaan` (line 83 inside the `message="..."` prop).
- `src/content/kids/ms/5-1-perfect-prompt.mdx:3`: `**Gunung Master**` → `**Gunung Pakar**` (bold markers kept).

Note: the two divergent World-4 spellings present in the pre-fix corpus (`Ngarai Penciptaan` in the bundle; `Ngarai Cipta` in lesson prose) were both normalized to the locked single value `Gaung Penciptaan`.

## Tasks Completed

| Task | Name | Commit | Files |
| ---- | ---- | ------ | ----- |
| 1 | Reconcile the ms map bundle World 4 title | ea91df68 | messages/ms.json |
| 2 | Reconcile the ms lesson-body World 4 and World 5 names | 5ed42193 | 4-1-pretend-time.mdx, 4-2-story-starters.mdx, 4-4-world-builder.mdx, 5-1-perfect-prompt.mdx |

## Verification

All gates run at repo root after both commits:

- Gap-closure gate → exit 0, printed `world names consistent`.
- Global scan: **0** `Ngarai` and **0** `Gunung Master` across `src/content/kids/ms/**` + `messages/ms.json`.
- `messages/ms.json` parse + leaf-key count → exactly **212**; `kids.worlds[4].title === "Gaung Penciptaan"`, `kids.worlds[5].title === "Gunung Pakar"`.
- `node scripts/check-translations.js` → `All translation files are complete!` (212-key parity).
- `npx tsc --noEmit` → **0** errors.
- `npm run lint` → **0** errors (43 pre-existing warnings, matches baseline).
- `npm test` → **94/94** passing.
- Scope check: `git diff --name-only` between plan base and HEAD lists only the five `files_modified` files. `src/content/kids/en/**` and every non-`ms` locale are unmodified.
- Out-of-scope boundary honored: the seven `Master` headings/sentences on `5-1` lines 8/43/55/67/79/91/96 are byte-identical to HEAD (only line 3 changed in that file).

## Deviations from Plan

None — plan executed exactly as written.

## Decisions Made

- World 4 = `Gaung Penciptaan` everywhere (locked user decision for G-03-5), applied to the bundle title plus all five lesson-body locations.
- World 5 = `Gunung Pakar` everywhere; the English word "Master" no longer appears inside the World 5 name. The standalone `Master` headings on `5-1` were deliberately left untouched as out of scope.

## Known Stubs

None.

## Threat Flags

None — this was a static in-repo string-value edit with no new input parsing, import path, runtime interpolation, or dependency. Consistent with the plan's `T-03-05-01` (accept) and `T-03-05-SC` (no package installs).

## Self-Check: PASSED

- FOUND: messages/ms.json
- FOUND: src/content/kids/ms/4-1-pretend-time.mdx
- FOUND: src/content/kids/ms/4-2-story-starters.mdx
- FOUND: src/content/kids/ms/4-4-world-builder.mdx
- FOUND: src/content/kids/ms/5-1-perfect-prompt.mdx
- FOUND: ea91df68 (task 1 commit)
- FOUND: 5ed42193 (task 2 commit)