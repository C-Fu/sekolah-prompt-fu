---
phase: 03-bahasa-melayu-ms-localization
plan: 04
subsystem: i18n
tags: [next-intl, mdx, localization, bahasa-melayu, static-export, vitest, phase-gate]

# Dependency graph
requires:
  - phase: 03-bahasa-melayu-ms-localization
    provides: "ms registered in all five locale registries; messages/ms.json 212-key bundle; all 19 ms MDX levels + loader/map entries (03-01 tracer, 03-02 levels 1-2…3-3, 03-03 levels 3-4…5-4)"
provides:
  - "Corpus-wide ms resolution test: every one of the 19 registered slugs resolves effectiveLocale 'ms' with a Component distinct from en"
  - "Green phase gate: tsc 0, lint 0, full suite 94/94, self-failing ms/en leaf-key parity (212 keys)"
  - "Static export (npm run build) succeeds; out/ contains all 19 level routes with ms MDX compiled"
affects: [04]

# Actuals (#2632) — pairs with the plan's `estimate` to calibrate future estimates.
actuals:
  tokens: 287
  tasks: 3
  commits: 1
  plan_head_before: c4bb21964731cc3ab3f181ad30ca2d5f5d52db02
  plan_head_after: 5c7a62dfe354ff015d3d7786dcfe0590213c2b6f

tech-stack:
  added: []
  patterns:
    - "Corpus-wide registry assertion: iterate getAllLevels() and assert per-slug ms resolution + Component distinctness, with the slug in the failure message — one case guards all 19 silent-fallback modes"
    - "Self-failing ms/en flattened-leaf-key parity node assertion (check-translations.js is report-only and always exits 0, so it can never be the gate)"

key-files:
  created: []
  modified:
    - src/__tests__/kids/level-locale.test.tsx

key-decisions:
  - "The ms parity gate is the self-failing node -e flattened-key-set-equality assert against messages/en.json (212 leaf keys); scripts/check-translations.js is run only as a human-readable report because it always exits 0 (PATTERNS.md correction honored)."
  - "The corpus-wide test asserts BOTH effectiveLocale === 'ms' AND ms.Component !== en.Component per slug — a missing loader silently falls back to en, so locale alone would not catch a shared module reference."
  - "Tasks 2 and 3 are pure gate tasks (empty <files>); they produced no source change and therefore no separate commit — the gate evidence is recorded here."

patterns-established:
  - "Final phase gate = corpus test (all slugs) + tsc/lint/full-suite + self-failing translation parity + npm run build with out/ level routes verified."

requirements-completed: [FR-3]

# Coverage metadata (#1602) — one entry per shipped deliverable.
coverage:
  - id: D1
    description: "All 19 registered slugs resolve via loadLevelContent('ms', slug) to effectiveLocale 'ms' with a Component distinct from en — no silent English fallback anywhere"
    requirement: "FR-3"
    verification:
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#resolves effectiveLocale 'ms' for every one of the 19 registered slugs"
        status: pass
    human_judgment: false
  - id: D2
    description: "messages/ms.json is leaf-key-identical with messages/en.json (212 keys), asserted by a self-failing node -e gate"
    requirement: "FR-3"
    verification:
      - kind: automated_ui
        ref: "node -e flattened leaf-key-set equality assertion — 'ms parity OK: 212 leaf keys'"
        status: pass
      - kind: automated_ui
        ref: "node scripts/check-translations.js — '✅ All translation files are complete!' (report only, always exits 0)"
        status: pass
      - kind: gate
        ref: "npx tsc --noEmit && npm run lint -- --quiet && npm run test (94/94)"
        status: pass
    human_judgment: true
    rationale: "Machine checks prove key parity and structural correctness, not linguistic naturalness / kid-appropriate register (03-VALIDATION.md Manual-Only row). A human must read the translations."
  - id: D3
    description: "Static export (npm run build) compiles all 19 ms MDX levels and emits out/ with every level route"
    requirement: "FR-3"
    verification:
      - kind: gate
        ref: "npm run build && node -e existence check for out/level/<slug>/index.html — 'build OK; out/ level pages present'"
        status: pass
      - kind: automated_ui
        ref: "ls out/level | wc -l → 19 level route directories present"
        status: pass
    human_judgment: false

# Metrics
duration: 4min
completed: 2026-11-05
status: complete
---

# Phase 3 Plan 04: Bahasa Melayu (`ms`) Corpus Test + Phase Gate Summary

**Closed the phase: added a corpus-wide test proving all 19 registered slugs resolve to `ms` (never the silent English fallback), then ran the phase gate green end-to-end — tsc 0, lint 0, tests 94/94, self-failing 212-key ms/en parity, and a successful `npm run build` emitting `out/` with all 19 level routes.**

## Performance

- **Duration:** ~4 min (2026-11-05T03:04:56Z → commit at 11:05 local)
- **Tasks:** 3 (1 produced a source change; 2 were pure gate tasks)
- **Files modified:** 1 (14 insertions)

## Accomplishments

- **Task 1 — corpus-wide ms resolution test.** Added `resolves effectiveLocale 'ms' for every one of the 19 registered slugs` to `src/__tests__/kids/level-locale.test.tsx`. It iterates `getAllLevels()` (asserts length 19) and, per slug, asserts `(await loadLevelContent("ms", slug))?.effectiveLocale === "ms"` **and** `ms.Component !== en.Component`, with the slug embedded in each assertion's message. This is the exact silent-failure guard the phase was built around.
- **Proved the test catches silent fallback.** Temporarily deleted the `L_ms__5_4_graduation_day` map entry and confirmed the new case failed loudly with `5-4-graduation-day: expected 'en' to be 'ms'`; then restored the file byte-for-byte. Not a rubber-stamp test.
- **Task 2 — phase gate green.** `npx tsc --noEmit` → 0; `npm run lint -- --quiet` → 0; `npm run test` → **94/94** (baseline 93 + the new case); self-failing `node -e` flatten-and-compare gate → **"ms parity OK: 212 leaf keys"**. `node scripts/check-translations.js` prints "✅ All translation files are complete!" (report only).
- **Task 3 — static build gate.** `npm run build` exits 0, writes `out/`, and emits **19** `/level/<slug>` routes (verified `out/level/1-1-meet-promi/index.html`, `out/level/5-4-graduation-day/index.html`, `out/level/3-4-context-champion/index.html` present; `ls out/level` = 19 dirs). A malformed ms MDX would fail the whole export, so a green build proves all 19 ms files compiled.

## Task Commits

1. **Task 1: Add all-19-slugs ms resolution test** — `5c7a62df` (test)
   - `src/__tests__/kids/level-locale.test.tsx` (+14)

**Tasks 2 and 3 produced no commit** — both carry an empty `<files>` element and are pure gate tasks; their evidence is captured here.

**Plan metadata:** committed after this SUMMARY (docs: complete plan).

## Files Created/Modified

- `src/__tests__/kids/level-locale.test.tsx` — added the corpus-wide `resolves effectiveLocale 'ms' for every one of the 19 registered slugs` case (MODIFIED, +14 lines).

## Decisions Made

- **Parity gate = self-failing `node -e`, not the report script.** `scripts/check-translations.js` has no `process.exit`, so it always exits 0 and cannot fail a chained gate. The plan's `<verify>` chains a `node -e` that THROWS on any ms/en leaf-key diff; that is the real gate. Both were run; both pass at 212 keys.
- **Component distinctness asserted per slug, in addition to `effectiveLocale`.** A missing `ms` loader makes `loadLevelContent` return the en module with `effectiveLocale === "en"`; checking the effective locale alone is sufficient here, but asserting `Component !== en.Component` also guards a hypothetical shared module reference, so the corpus case checks both.
- **`ms-chunk candidates: 0` is expected.** Next.js content-hashes chunk filenames, so no literal "ms" appears in `out/_next/static/chunks` filenames; the plan's verify only prints this count (it is not an assertion) and its real assertions (out/ exists, level pages present) pass.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `git` has no repository-local `user.name`/`user.email`; commits resolve identity from the global config as `root <root@localhost>`, matching the prior phase commits (`4321c255`, `c4bb2196`). No impact.
- `gsd_run` is not on the default shell `PATH` (lives at `/root/.config/opencode/gsd-core/bin/gsd_run`); prepended for the HEAD-safety/base-branch assertions. No impact on shipped artifacts.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None — this plan adds only a test case and runs gates; no UI/data wiring is introduced.

## Threat Flags

None — no new network endpoints, auth paths, file-access patterns, or schema changes. The build-time MDX-compile → static-bundle boundary is unchanged; the corpus test strengthens the existing bounded-static-map mitigation (T-03-09).

## Next Phase Readiness

- The `ms` corpus is fully covered: all 19 registered slugs resolve to `ms` content with `effectiveLocale === "ms"`; no silent English fallback remains.
- Phase gate is green across all four axes (tsc, lint, tests, translation parity) and the static export succeeds with ms MDX compiled.
- Phase ready for `/gsd-verify-work`.
- Manual-only follow-up (unchanged from 03-01/03-02/03-03): human read of `messages/ms.json` and the 19 ms MDX levels for linguistic naturalness / kid-appropriate register (03-VALIDATION.md Manual-Only row).

---

*Phase: 03-bahasa-melayu-ms-localization*
*Completed: 2026-11-05*

## Self-Check: PASSED

- `src/__tests__/kids/level-locale.test.tsx` — FOUND
- Commit `5c7a62df` (Task 1) — FOUND (ancestor of HEAD)
- `.planning/phases/03-bahasa-melayu-ms-localization/03-04-SUMMARY.md` — FOUND