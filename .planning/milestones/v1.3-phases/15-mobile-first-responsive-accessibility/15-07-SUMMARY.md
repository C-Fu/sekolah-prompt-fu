---
phase: 15-mobile-first-responsive-accessibility
plan: 07
subsystem: kids-elements
tags: [accessibility, a11y, keyboard-focus, prompt-parts, example-matcher, word-predictor, i18n]
dependency_graph:
  requires: [15-04, 15-05, 15-06]
  provides: [focus-safe-category-choice, non-color-matcher-feedback, stable-predictor-retry]
  affects:
    - src/components/kids/elements/prompt-parts.tsx
    - src/components/kids/elements/example-matcher.tsx
    - src/components/kids/elements/word-predictor.tsx
    - messages/en.json
    - messages/ms.json
    - src/__tests__/kids/level-locale.test.tsx
tech_stack:
  added: []
  patterns: [persistent-dom-buttons, aria-live-polite-announcer, d-12-focus-retention, d-16-multimodal-outcomes]
key_files:
  created: []
  modified:
    - src/components/kids/elements/prompt-parts.tsx
    - src/components/kids/elements/example-matcher.tsx
    - src/components/kids/elements/word-predictor.tsx
    - messages/en.json
    - messages/ms.json
    - src/__tests__/kids/level-locale.test.tsx
decisions:
  - "Stable Category Chooser: Rendered PromptParts category options as permanently mounted native button controls so activating a category does not unmount the focused node or drop keyboard focus to document.body (D-12, D-13)."
  - "Non-Color Distinguishable Feedback: Added visible outcome words ('Correct'/'Incorrect' in EN, 'Betul'/'Salah' in BM) alongside distinguishable icon markers ('✓' / '✗') and solid vs dashed border styles on PromptParts, ExampleMatcher, and WordPredictor options (D-16)."
  - "Focus-Preserving Answer and Retry Controls: Used aria-disabled instead of HTML disabled on answered options and preserved focus on the selected answer or retry control upon submission and reset (D-12)."
  - "Dynamic Status Announcers: Wired localized persistent role=status polite live regions into PromptParts, ExampleMatcher, and WordPredictor that evaluate dynamically in the active locale without preserving stale strings across locale switch (A11Y-04)."
status: complete
actuals:
  tokens: 12441
  tasks: 2
  commits: 2
  plan_head_before: "435e7fdd28fc17b3a1604b59746f0d1356e9d8bb"
  plan_head_after: "c8beda779e4e3d97ea4cf00ee323c285ee2c0c99"
---

# Phase 15 Plan 07: Accessible Choice, Matcher, and Predictor Activities Summary

**One-liner:** Retained keyboard focus and native buttons across category choices, pattern matcher options, and predictor retries with visible non-color outcomes and polite status regions.

## Plan Summary

### Objective
Extend lesson answer accessibility beyond the two drag activities (MagicWords and DragDropPrompt) to the common choice, matching, and prediction surfaces (PromptParts, ExampleMatcher, and WordPredictor).

### Implemented Capabilities
1. **Focus Stability Across State Transitions (D-12, D-13):**
   - In `PromptParts`, category destination buttons (`Role`, `Task`, `Context`, `Constraint`) are kept mounted in the DOM with `min-h-[44px] min-w-[44px]` touch targets so selecting a category does not unmount the button and strand keyboard focus.
   - In `ExampleMatcher`, options use `aria-disabled` upon submission instead of native `disabled` to preserve `document.activeElement`, and focus is intentionally routed to the answering control or retry button.
   - In `WordPredictor`, options and action controls maintain focus upon submit and retry without dumping focus to `document.body`. Primary answers and retry targets are sized to >=44×44 CSS px.

2. **Multimodal Visual Feedback without Color Reliance (D-16):**
   - Replaced color-only green/red indicator states with visible outcome words (`Correct` / `Incorrect` in EN, `Betul` / `Salah` in BM), distinct symbol glyphs (`✓` / `✗`), and contrasting solid (`border-green-600`) vs dashed (`border-red-500`) borders.
   - Backing panels for AI visualizations and result feedback utilize high-opacity backgrounds (>=95%) to protect legibility against themed planetary backgrounds.

3. **Persistent Accessible Status Announcers (D-07, A11Y-04):**
   - Added persistent `<div role="status" aria-live="polite" aria-atomic="true">` regions to `PromptParts` (`prompt-parts-status`), `ExampleMatcher` (`example-matcher-status`), and `WordPredictor` (`word-predictor-status`).
   - All status messages are computed dynamically through `useTranslations` hooks (`t` and `tActivity`), ensuring immediate full Unicode localization without leaving stale translated status strings after a locale toggle.

4. **Section Completion Isolation:**
   - Section completion remains strictly scoped to the containing Section identity (`scope.getIndex()`) on correct answer only, preventing accidental unlock or progress contamination across adjacent or repeated activities.

## Verification

- Automated test suite:
  - `src/__tests__/kids/level-locale.test.tsx`: 47/47 tests passing (including 6 new tests covering PromptParts keyboard focus, ExampleMatcher focus retention/retry, WordPredictor wrong->retry->correct flow, multi-section isolation, and BM/EN message verification).
  - All kids test files: 250/250 tests passing across 23 test files.
  - Script guards: `npm run check:closure` and `npm run check:vocab` both pass cleanly with 0 errors.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all activities are wired to actual lesson content props and persisted through `lib/kids/progress`.

## Self-Check: PASSED

- FOUND: `src/components/kids/elements/prompt-parts.tsx`
- FOUND: `src/components/kids/elements/example-matcher.tsx`
- FOUND: `src/components/kids/elements/word-predictor.tsx`
- FOUND: `src/__tests__/kids/level-locale.test.tsx`
- FOUND commit `caba6481`: `feat(15-07): retain keyboard focus across category choice and answer submission`
- FOUND commit `c8beda77`: `feat(15-07): keep predictor answer control and feedback coherent after wrong answer`
