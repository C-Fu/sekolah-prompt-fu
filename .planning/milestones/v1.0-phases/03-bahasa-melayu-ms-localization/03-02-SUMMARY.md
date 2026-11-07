---
phase: 03-bahasa-melayu-ms-localization
plan: 02
subsystem: i18n
tags: [next-intl, mdx, localization, bahasa-melayu, static-export, vitest]

# Dependency graph
requires:
  - phase: 03-bahasa-melayu-ms-localization
    provides: "ms registered in all five locale registries; messages/ms.json 212-key bundle; the 1-1-meet-promi tracer MDX and its loader/map entry (03-01)"
provides:
  - "Nine more registered ms MDX levels: 1-2, 1-3, 2-1, 2-2, 2-3, 2-4, 3-1, 3-2, 3-3"
  - "Nine L_ms__* literal loader defs + nine matching quoted slug keys in the level-content.ts ms map (now 10 keys)"
  - "ms resolves to effectiveLocale 'ms' with a distinct Component for slugs 1-2 … 3-3 (no silent English fallback)"
affects: [03-remaining, 04]

# Actuals (#2632) — pairs with the plan's `estimate` to calibrate future estimates.
actuals:
  tokens: 19915
  tasks: 3
  commits: 3
  plan_head_before: f54989c74cec3b8ccc29a4206d332c85c3097561
  plan_head_after: 8030acc9a92b02da4893957fc5db90a4949ac474

tech-stack:
  added: []
  patterns:
    - "One literal static import() loader def + one quoted slug map key per ms level (never locale-interpolated) — preserves T-01-14 / T-03-05 static-import bound"
    - "en-structure mirror: each ms level copies its en counterpart's Section order/count; all prose and every interactive prop value translated (D-01)"

key-files:
  created:
    - src/content/kids/ms/1-2-first-words.mdx
    - src/content/kids/ms/1-3-being-clear.mdx
    - src/content/kids/ms/2-1-missing-details.mdx
    - src/content/kids/ms/2-2-who-and-what.mdx
    - src/content/kids/ms/2-3-when-and-where.mdx
    - src/content/kids/ms/2-4-detail-detective.mdx
    - src/content/kids/ms/3-1-setting-the-scene.mdx
    - src/content/kids/ms/3-2-show-dont-tell.mdx
    - src/content/kids/ms/3-3-format-finder.mdx
  modified:
    - src/lib/kids/level-content.ts

key-decisions:
  - "Mirrored each en level's Section order and count exactly (D-01 strict-parity authoring contract), translating every Panel body, heading, and interactive prop value — no half-localized English props."
  - "Kept the loanword 'prompt' untranslated in Bahasa Melayu copy (D-01) since a native substitute would confuse the kid reader."
  - "All nine loader defs are literal import() calls and all nine map keys are quoted string literals; no path is built from the locale string (T-03-05 mitigation)."

patterns-established:
  - "Adding an ms level is exactly two edits: author src/content/kids/ms/<slug>.mdx mirroring en, then add L_ms__<slug> def + quoted key to the level-content.ts ms map."

requirements-completed: [FR-3]

# Coverage metadata (#1602) — one entry per shipped deliverable.
coverage:
  - id: D1
    description: "Nine ms MDX levels (1-2, 1-3, 2-1, 2-2, 2-3, 2-4, 3-1, 3-2, 3-3) authored, mirroring en structure, ending in a LevelComplete with the matching registry slug"
    requirement: "FR-3"
    verification:
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx (37 tests) — ms content selection + map link contract"
        status: pass
      - kind: automated_ui
        ref: "node structural check — per-task existence/slug/no-script/map-key assertions ('03-02 task1/2/3 OK')"
        status: pass
    human_judgment: true
    rationale: "Structural/parity checks pass; Bahasa Melayu register/terminology quality and kid-appropriateness require a human read (03-VALIDATION.md Manual-Only row)."
  - id: D2
    description: "The ms loader map holds exactly 10 quoted slug keys (1-1 from 03-01 plus the nine here); each key is a literal import() so loadLevelContent('ms', slug) resolves effectiveLocale 'ms' with a Component distinct from en's"
    requirement: "FR-3"
    verification:
      - kind: automated_ui
        ref: "node -e ms-map key-count assertion — 'expected 10 ms map keys'"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#selects ms content (not the en fallback) when the ms module exists"
        status: pass
    human_judgment: false

# Metrics
duration: 16min
completed: 2026-11-05
status: complete
---

# Phase 3 Plan 02: Bahasa Melayu (`ms`) Levels 1-2 … 3-3 Summary

**Authored nine Bahasa Melayu MDX levels (World 1 tail through World 3 partial) mirroring their `en` counterparts and registered each with a literal loader — the `ms` level map now holds 10 of 19 slugs with no silent English fallback.**

## Performance

- **Duration:** 16 min
- **Started:** 2026-11-05T10:41:00Z
- **Completed:** 2026-11-05T10:57:00Z
- **Tasks:** 3
- **Files modified:** 10 (9 created, 1 modified)

## Accomplishments
- Nine `src/content/kids/ms/*.mdx` levels authored — each copies its `en` counterpart's `<Section>` order/count and component vocabulary (`<Panel>`, `<WordPredictor>`, `<DragDropPrompt>`, `<MagicWords>`, `<PromptVsMistake>`, `<PromptParts>`, `<ExampleMatcher>`), with every Panel body, `##` heading, and interactive prop value translated to kid-simple Bahasa Melayu.
- Nine `L_ms__*` literal loader defs added next to `L_ms__1_1_meet_promi`; nine quoted slug keys added to the `ms` block in `level-content.ts`. The map now holds exactly **10 keys** (1-1 + nine).
- Every level ends in `<LevelComplete levelSlug="<real slug>">` so the map-link contract holds; no raw HTML/`<script>`.
- Baseline gates green: `npx tsc --noEmit` → 0 errors; `npm run lint` → 0 errors (43 pre-existing warnings, unchanged); `npm run test` → 93/93.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author ms levels 1-2, 1-3, 2-1 + register them** - `3da3abab` (feat)
2. **Task 2: Author ms levels 2-2, 2-3, 2-4 + register them** - `3def5c50` (feat)
3. **Task 3: Author ms levels 3-1, 3-2, 3-3 + register them** - `8030acc9` (feat)

**Plan metadata:** committed after this SUMMARY (docs: complete plan)

## Files Created/Modified
- `src/content/kids/ms/1-2-first-words.mdx` - 7-Section ms level (mirrors en), all props/prose translated (NEW)
- `src/content/kids/ms/1-3-being-clear.mdx` - 9-Section ms level (NEW)
- `src/content/kids/ms/2-1-missing-details.mdx` - 8-Section ms level (NEW)
- `src/content/kids/ms/2-2-who-and-what.mdx` - 9-Section ms level (NEW)
- `src/content/kids/ms/2-3-when-and-where.mdx` - 9-Section ms level (NEW)
- `src/content/kids/ms/2-4-detail-detective.mdx` - 9-Section ms level (NEW)
- `src/content/kids/ms/3-1-setting-the-scene.mdx` - 7-Section ms level (NEW)
- `src/content/kids/ms/3-2-show-dont-tell.mdx` - 9-Section ms level (NEW)
- `src/content/kids/ms/3-3-format-finder.mdx` - 8-Section ms level (NEW)
- `src/lib/kids/level-content.ts` - nine `L_ms__*` literal loader defs + nine quoted slug keys in the `ms` map (MODIFIED)

## Decisions Made
- **Strict en-structure mirror (D-01):** each ms level copies its en counterpart's Section order and count exactly, so the section count remains a valid mount gate and the level is reviewable side-by-side with en. Unlike the tracer (03-01, which mirrored en's 10 Sections), these files each mirror their own en counterpart's count.
- **Loanword "prompt" retained:** kept untranslated per D-01 — a native Bahasa Melayu substitute would confuse the kid register.
- **Terminology consistency:** "Panel"/heading prose and every interactive prop (`title`, `instruction`, `sentence`, `options`, `correctAnswer`, `explanation`, `aiThinking`, `successMessage`, `promptMessage`, `pieces`, `blanks`, `parts`) translated — no half-localized English props.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- The plan's Task 2 action prose contained a typo (`L_ms__2_3_when_and_were`→ use exact slug identifier `L_ms__2_3_when_and_where`); the self-correcting parenthetical identified the correct identifier, which was used as written. No change to intent.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The `ms` loader map covers 10 of 19 slugs (1-1 … 3-3). The remaining nine slugs (3-4, 4-1 … 4-4, 5-1 … 5-4) follow the identical two-edit recipe: author `src/content/kids/ms/<slug>.mdx` mirroring en, then add `L_ms__<slug>` def + quoted key to the `ms` map.
- No blockers. Baseline gates all green.

## Self-Check

- `src/content/kids/ms/1-2-first-words.mdx` — FOUND
- `src/content/kids/ms/1-3-being-clear.mdx` — FOUND
- `src/content/kids/ms/2-1-missing-details.mdx` — FOUND
- `src/content/kids/ms/2-2-who-and-what.mdx` — FOUND
- `src/content/kids/ms/2-3-when-and-where.mdx` — FOUND
- `src/content/kids/ms/2-4-detail-detective.mdx` — FOUND
- `src/content/kids/ms/3-1-setting-the-scene.mdx` — FOUND
- `src/content/kids/ms/3-2-show-dont-tell.mdx` — FOUND
- `src/content/kids/ms/3-3-format-finder.mdx` — FOUND
- Commit `3da3abab` (Task 1) — FOUND (ancestor of HEAD)
- Commit `3def5c50` (Task 2) — FOUND (ancestor of HEAD)
- Commit `8030acc9` (Task 3) — FOUND (ancestor of HEAD)

## Self-Check: PASSED

---
*Phase: 03-bahasa-melayu-ms-localization*
*Completed: 2026-11-05*