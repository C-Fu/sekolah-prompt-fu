---
phase: 01-purge-non-kids-code-dependencies
plan: 16
subsystem: ui
tags: [next, mdx, react-context, kids, section-identity, vitest, tdd]

requires:
  - plan: 01-15
    provides: useSectionIdentity / Section registry API and the loadContent test seam
  - plan: 01-14
    provides: audited, locally runnable next/eslint/tsc/vitest executables
provides:
  - section-scoped-interactive-completion
  - identity-bound-localstorage-completion-writes
  - independent-adjacent-section-locks
affects: [01-17]

actuals:
  tokens: 38000
  tasks: 3
  commits: 6
  plan_head_before: be2e13eaae9ab52662e34225242cf5078fbe5101
  plan_head_after: 2c39ec94a50f272228767bd44fe77add46b3a598

tech-stack:
  added: []
  patterns:
    - "Interactive consumers resolve their containing Section via useSectionIdentity() and register/complete by identity, never by the navigation cursor"
    - "Completion writes bind both the persisted localStorage section key and the in-memory lock to the resolved Section index; unresolved identities refuse the write (fail closed)"
    - "Offscreen mounted consumers register a requirement against their own Section, so adjacent repeated challenges lock independently"
    - "The current-Section lock in the wrapper recomputes on completedSections changes so an identity-scoped completion actually unlocks Next"

key-files:
  created: []
  modified:
    - src/components/kids/elements/drag-drop-prompt.tsx
    - src/components/kids/elements/example-matcher.tsx
    - src/components/kids/elements/magic-words.tsx
    - src/components/kids/elements/prompt-doctor.tsx
    - src/components/kids/elements/prompt-lab.tsx
    - src/components/kids/elements/prompt-parts.tsx
    - src/components/kids/elements/prompt-vs-mistake.tsx
    - src/components/kids/elements/step-by-step.tsx
    - src/components/kids/elements/word-predictor.tsx
    - src/components/kids/layout/level-content-wrapper.tsx
    - src/__tests__/kids/level-locale.test.tsx

key-decisions:
  - "Migrated all nine interactive consumers off the legacy numeric useSectionNavigation signatures to the 01-15 useSectionIdentity Section-scoped API; registration, persisted completion and in-memory lock all key on the containing Section's resolved index"
  - "Completion writes refuse unresolved identities: both markSectionCompleted(levelSlug, index) and scope.markComplete() are gated on a non-null resolved index, so localStorage and in-memory state cannot diverge"
  - "Made the wrapper's current-Section lock reactive to completedSections (the identity completion signal) — without it a correct answer persisted but Next stayed disabled (Rule 2 deviation, see below)"
  - "Kept every element's original puzzle behavior, scoring and persistence keys unchanged; only the identity used for requirement/completion writes changed"

requirements-completed: [NFR-1, FR-1, FR-2]

coverage:
  - id: D1
    description: "The early interactive consumers (DragDropPrompt, ExampleMatcher, MagicWords) register requirements and persist completion against their containing Section, not the cursor"
    requirement: FR-2
    verification:
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#registers an offscreen consumer's requirement against its own Section, not the cursor"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#writes localStorage completion against the ExampleMatcher's own Section index"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#does not unlock on a wrong answer, but unlocks on the correct one (MagicWords)"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#binds DragDropPrompt's requirement to its containing Section, not the cursor"
        status: pass
    human_judgment: false
  - id: D2
    description: "The prompt editing consumers (PromptDoctor, PromptLab, PromptParts) mark only their own Section even when driven offscreen"
    requirement: FR-2
    verification:
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#PromptParts persists completion against its own Section index, not the cursor"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#PromptLab persists completion against its own Section index, not the cursor"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#PromptDoctor persists completion against its own Section index, not the cursor"
        status: pass
    human_judgment: false
  - id: D3
    description: "On real compiled en 1-1-meet-promi MDX, repeated adjacent challenges (WordPredictor 3/4, PromptVsMistake 7/8) lock and complete independently to the final map link"
    requirement: NFR-1
    verification:
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#an off-render WordPredictor completion persists its own Section index, not the cursor"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#WordPredictor Sections 3 and 4 lock and complete independently through forward/back"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#PromptVsMistake Sections 7 and 8 lock and complete independently to the map link"
        status: pass
      - kind: automated
        ref: "npm run lint -- --quiet"
        status: pass
    human_judgment: false

duration: 31 min
completed: 2026-11-04
status: complete
---

# Phase 1 Plan 16: Section-Scoped Interactive Consumers Summary

**All nine retained interactive MDX elements now register requirements and persist completion against the Section they actually inhabit — resolved via `useSectionIdentity()` — so adjacent repeated challenges lock and complete independently instead of writing the navigation cursor.**

## Performance

- **Duration:** 31 min
- **Started:** 2026-11-04T16:24:12Z
- **Completed:** 2026-11-04T16:54:46Z
- **Tasks:** 3
- **Files modified:** 11 (9 consumers + 1 wrapper + 1 test)

## Accomplishments

- Migrated the nine interactive consumers
  (`drag-drop-prompt`, `example-matcher`, `magic-words`, `prompt-doctor`, `prompt-lab`,
  `prompt-parts`, `prompt-vs-mistake`, `step-by-step`, `word-predictor`) off the legacy
  numeric `useSectionNavigation` signatures. Each now:
  - registers its requirement via `scope.registerRequirement(true)` from
    `useSectionIdentity()`, so an offscreen (mounted) consumer binds to its own Section;
  - on a correct answer, persists `markSectionCompleted(levelSlug, scope.getIndex())` and
    the in-memory `scope.markComplete()`, keyed by the containing Section's resolved index;
  - refuses the write when the identity has not resolved (`getIndex()` returns `null`), so
    localStorage and in-memory completion cannot disagree.
- Preserved every element's original answer validation, scoring and persistence keys — only
  the identity used for requirement/completion writes changed.
- Added 10 tests in `src/__tests__/kids/level-locale.test.tsx` (file grew from 15 → 25):
  - offscreen registration binds to the containing Section, not the cursor;
  - completion persists the containing Section index (ExampleMatcher, MagicWords,
    PromptParts, PromptLab, PromptDoctor);
  - on **real compiled** en `1-1-meet-promi` MDX: an off-render WordPredictor completion
    persists its own index; WordPredictor Sections 3/4 and PromptVsMistake Sections 7/8 each
    lock until their own correct answer, stay isolated, and the final Section shows the map
    link.

## Task Commits

Each task was committed atomically following RED → GREEN:

| Task | Commit | Type | Description |
|------|--------|------|-------------|
| 1 RED | `cc2b460c` | test | add failing tests for Section-scoped interactive completion |
| 1 GREEN | `037fd213` | feat | bind early interactive elements to their owning MDX Section |
| 2 RED | `a2304dd3` | test | add failing tests for Section-scoped prompt editing completion |
| 2 GREEN | `9c48c755` | feat | bind prompt editing interactions to their owning MDX Section |
| 3 RED | `66b1338c` | test | add failing tests for repeated adjacent Section locks on real MDX |
| 3 GREEN | `2c39ec94` | feat | bind repeated adjacent challenges to their owning MDX Section |

**Plan metadata:** committed with this SUMMARY.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Made the wrapper's current-Section lock reactive to identity completion**
- **Found during:** Task 1 (ExampleMatcher completion test)
- **Issue:** A correct answer persisted `isSectionCompleted(slug, 1) === true`, but Next stayed **disabled**. `useCurrentSectionComplete` in `level-content-wrapper.tsx` memoized on `[registry, currentSection, totalSections, ordering]`; none of those change when a Section completes, so the identity-scoped completion never reached navigation and an interactive Section could never unlock. `level-content-wrapper.tsx` is a 01-15-owned file outside this plan's declared `<files>` set, but the declared task behavior ("Section unlocks after its own correct answer") and the plan `<verification>` cannot pass without it.
- **Fix:** Destructured `completedSections` from `useSectionNavigation()` (the reactive signal that `markSectionCompleteByIdentity` updates) and added it to the memo dependency list so the lock recomputes on completion. No change to fail-closed semantics: a section with an unfinished requirement still locks.
- **Files modified:** `src/components/kids/layout/level-content-wrapper.tsx`
- **Verification:** `npm test -- src/__tests__/kids/level-locale.test.tsx` (25/25 pass, including the unlock assertions) and `npm run lint -- --quiet` (exit 0).
- **Committed in:** `037fd213` (Task 1 GREEN)

---

**Total deviations:** 1 auto-fixed (Rule 2). **Impact:** minimal, correctness-only — a one-line dependency addition to a memoized selector; no scoring, key or fail-closed behavior changed. No scope creep: no settings locale switch or progress-reset (01-17), no `mdx-components.tsx` cleanup (01-04), no route/package deletion, no root promotion or static export (Phase 2).

## Issues Encountered

- **Test-harness click batching:** in jsdom, calling `HTMLElement.click()` on an option button and its submit button in the same tick let the submit handler read stale state (React had not re-rendered between synthetic clicks). Fixed by driving option selection through `fireEvent.click` (act-wrapped) and awaiting the submit button's enabled state before submitting.
- **Offscreen interaction:** to distinguish the Section index from the cursor, tests interact with a Section that is not the active cursor using Testing Library's `hidden: true` queries scoped with `within(sectionEl)`; jsdom does not enforce `inert`, so the handler fires while the real UI keeps the element inert.
- **`gsd_run`/`gsd-tools` unavailable in this environment:** the `check tdd-red-evidence` machine classifier could not run. Each task's full RED report was captured unchanged to a TAP file and preserved as a record under
  `.planning/phases/01-purge-non-kids-code-dependencies/.tdd/`; the semantic RED assessment is that each task's named target test failed on its planned assertion (unrelated tests passing) before the GREEN implementation.

## Authentication Gates

None.

## Known Stubs

None.

## Threat Flags

None. Only existing answer validation and scoped section-completion keys are touched
(threat register T-01-15 mitigation applied: unresolved identities are rejected and only
Section-scoped keys are persisted).

## Next Phase Readiness

- All nine interactive consumers are identity-bound; an interactive Section now locks
  fail-closed until its own correct answer and unlocks on completion.
- Ready for 01-17 (settings locale switch + progress-reset semantics): the locale switch
  was intentionally **not** implemented here, and locale-incompatible section-completion
  clearing remains 01-17 ownership.
- No route was deleted, no package removed, no root promotion or static export performed.

## Self-Check: PASSED

- All 11 modified files exist on disk.
- Commits `cc2b460c`, `037fd213`, `a2304dd3`, `9c48c755`, `66b1338c`, `2c39ec94` are ancestors of HEAD.
- `npm test -- src/__tests__/kids/level-locale.test.tsx` → 25/25 passed.
- `npm run lint -- --quiet` → exit 0.
- `npx tsc --noEmit` reports no errors in the modified/created files (project-wide
  pre-existing type debt elsewhere is unchanged).