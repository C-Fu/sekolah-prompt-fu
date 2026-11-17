---
phase: 15-mobile-first-responsive-accessibility
plan: 08
subsystem: kids-elements
tags: [accessibility, a11y, keyboard-operable, focus-preservation, prompt-vs-mistake, prompt-doctor, prompt-lab, step-by-step, i18n]
dependency_graph:
  requires: [15-07]
  provides: [accessible-comparison-answers, accessible-doctor-corrections, accessible-lab-improvements, accessible-step-sequence]
  affects:
    - src/components/kids/elements/prompt-vs-mistake.tsx
    - src/components/kids/elements/prompt-doctor.tsx
    - src/components/kids/elements/prompt-lab.tsx
    - src/components/kids/elements/step-by-step.tsx
    - src/__tests__/kids/level-locale.test.tsx
tech_stack:
  added: []
  patterns: [persistent-dom-buttons, aria-live-polite-announcer, d-12-focus-retention, d-16-multimodal-outcomes]
key_files:
  created: []
  modified:
    - src/components/kids/elements/prompt-vs-mistake.tsx
    - src/components/kids/elements/prompt-doctor.tsx
    - src/components/kids/elements/prompt-lab.tsx
    - src/components/kids/elements/step-by-step.tsx
    - src/__tests__/kids/level-locale.test.tsx
decisions:
  - "Focus-Preserving Option and Problem Controls: Replaced HTML disabled attributes on submitted or applied items with aria-disabled='true' across PromptVsMistake, PromptDoctor, PromptLab, and StepByStep to avoid dropping keyboard focus to document.body (D-12, D-13)."
  - "Multimodal Status Feedback without Color Alone: Provided visible outcome words ('Correct'/'Incorrect' in EN, 'Betul'/'Salah' in BM) alongside distinguishable icon glyphs ('✓' / '✗') and solid vs dashed border styles on all comparison, diagnosis, lab improvement, and step-sequence controls (D-16)."
  - "Persistent DOM Mount Across Completed State: Kept problem, improvement, and sequence step controls permanently mounted in DOM when completed, preserving focus and allowing retry/reset without sudden unmounting (D-12, D-13)."
  - "Dynamic Status Announcers: Wired localized persistent role=status polite live regions into all four activities evaluating dynamically with next-intl hooks in EN and BM (A11Y-04)."
status: complete
actuals:
  tokens: 15557
  tasks: 2
  commits: 2
  plan_head_before: "23a67102684a7c90cae79bda793074317e3c359f"
  plan_head_after: "4cacf90c8b772485d2a967e1460443cd29577527"
---

# Phase 15 Plan 08: Remaining Lesson Activity Accessibility Audit Summary

**One-liner:** Audited and corrected PromptVsMistake, PromptDoctor, PromptLab, and StepByStep with focus-preserving native buttons, >=44x44 CSS px hitboxes, visible non-color outcomes, and polite live status announcers.

## Plan Summary

### Objective
Audit and correct the remaining four shipped lesson activity families (`PromptVsMistake`, `PromptDoctor`, `PromptLab`, and `StepByStep`) for equivalent touch and keyboard controls, visible non-color feedback, and section-scoped progression.

### Implemented Capabilities

1. **Comparison & Correction Interactions (Task 1, D-12–D-16):**
   - In `PromptVsMistake`, replaced `disabled={showResult}` with `aria-disabled="true"` on answer option buttons with `min-h-[44px] min-w-[44px]` touch targets so activating an option retains keyboard focus on that element.
   - Replaced color-only cues in `PromptVsMistake` with visible outcome words (`Correct` / `Incorrect` in EN, `Betul` / `Salah` in BM), distinct glyphs (`✓` / `✗`), and solid (`border-green-600`) vs dashed (`border-red-500`) border styles.
   - In `PromptDoctor`, kept diagnosis problem buttons permanently mounted when solved rather than unmounting the list on completion, using `aria-pressed` and `aria-disabled` so keyboard focus never drops to `document.body`.
   - Wired persistent polite live regions (`prompt-vs-mistake-status` and `prompt-doctor-status`) for dynamic localized screen-reader and visible feedback in both languages.

2. **Lab & Step-by-Step Interactions (Task 2, D-09, D-12–D-16):**
   - In `PromptLab`, preserved native button choice path, sized all improvement and retry controls to `>=44x44` CSS px, kept applied improvements mounted with `aria-pressed="true"` and `aria-disabled="true"`, and added solid vs dashed borders and visible check badges.
   - In `StepByStep`, kept the "Add Magic Words" and "Reveal Next Step" buttons mounted with `min-h-[44px]` touch targets and `aria-disabled` upon activation, preserving keyboard focus across step progression.
   - Wired persistent polite live regions (`prompt-lab-status` and `step-by-step-status`) announcing step count, progress ratio, and completion status.
   - Maintained section completion scoping strictly to the containing Section identity (`scope.getIndex()`) on full completion only.

## Verification

- Automated test suite:
  - `src/__tests__/kids/level-locale.test.tsx`: 54/54 tests passing (added 7 new tests covering keyboard navigation, focus preservation, wrong answer retry, section isolation, and BM/EN message bundles).
  - All kids test suite: 257/257 tests passing across 23 test files.
  - Script guards: `npm run check:closure` and `npm run check:vocab` pass with 0 errors.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all activities are wired to authentic lesson props and progress APIs.

## Self-Check: PASSED

- FOUND: `src/components/kids/elements/prompt-vs-mistake.tsx`
- FOUND: `src/components/kids/elements/prompt-doctor.tsx`
- FOUND: `src/components/kids/elements/prompt-lab.tsx`
- FOUND: `src/components/kids/elements/step-by-step.tsx`
- FOUND: `src/__tests__/kids/level-locale.test.tsx`
- FOUND commit `8c0b9c2e`: `feat(15-08): make comparison and correction interactions keyboard and focus safe`
- FOUND commit `4cacf90c`: `feat(15-08): make lab and step-by-step interactions independently keyboard operable`
