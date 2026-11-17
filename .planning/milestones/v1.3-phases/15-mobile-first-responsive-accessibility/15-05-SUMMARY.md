---
phase: 15-mobile-first-responsive-accessibility
plan: 05
subsystem: kids-elements
tags: [accessibility, a11y, drag-drop, reorder, keyboard, touch, i18n]
dependency_graph:
  requires: [15-01]
  provides: [accessible-drag-drop-ordering, item-then-position-reorder, in-place-retry]
  affects:
    - src/components/kids/elements/drag-drop-prompt.tsx
    - src/__tests__/kids/drag-drop-prompt.test.tsx
    - messages/en.json
    - messages/ms.json
tech_stack:
  added: []
  patterns: [item-then-position-selection, multimodal-aria-pressed, in-place-error-correction, scoped-completion-guard]
key_files:
  created:
    - src/__tests__/kids/drag-drop-prompt.test.tsx
  modified:
    - src/components/kids/elements/drag-drop-prompt.tsx
    - messages/en.json
    - messages/ms.json
decisions:
  - "Native button item-then-position ordering: Replaced pointer-only row drag with native piece buttons and destination-position buttons exposing aria-pressed and visible Selected / Dipilih indicator (D-09)."
  - "In-place error correction: handleSubmit reports wrong order in persistent role=status without resetting or shuffling currentOrder, allowing children to correct wrong answers in place (D-10, D-12)."
  - "Scoped completion gate: Bound both markSectionCompleted and scope.markComplete to non-null scope.getIndex() only for exact correctOrder."
  - "Enlarged touch targets: Up/Down arrow buttons and destination-position buttons have >=44x44 CSS px hitboxes with visible terminal disabled states."
status: complete
actuals:
  tokens: 10709
  tasks: 2
  commits: 2
  plan_head_before: "ad51965d9c2d47f8aa31c64a6ca5e08a791c593f"
  plan_head_after: "dfc9c50f3a11059fa8e7e831c31ac8070fba74b0"
---

# Phase 15 Plan 05: Accessible Item-Then-Position Ordering Interaction Summary

**One-liner:** Provided accessible native button select-then-destination reordering, persistent bilingual status announcements, and non-destructive in-place retry for the ordering puzzle.

## Plan Summary

### Objective
Give the order puzzle an equivalent item-then-position interaction and non-destructive retry without requiring drag or pointer precision.

### Implemented Capabilities
1. **Selectable Piece & Destination Buttons (D-09):**
   - Added native `<button>` controls for each indexed piece in `currentOrder` with `aria-pressed`, checkmark indicator, and visible bilingual `Selected` / `Dipilih` marker.
   - Added native `<button>` destination-position controls for each position slot (e.g. `Position 1` / `Kedudukan 1`) with minimum 44×44 CSS px touch areas.
   - Activating a destination position moves the selected piece to that position through a single indexed move operation that preserves all pieces exactly once without duplicates.
   - Supports selection interruption (switching pieces or deselecting on repeat click).

2. **Up/Down Arrow Controls & Touch Drag Parity:**
   - Kept Up and Down move buttons with localized accessible names (`Move up` / `Move down`, `Gerak ke atas` / `Gerak ke bawah`) and enlarged hitboxes (≥44×44 CSS px).
   - Terminal positions show visible disabled styling (first item cannot move up; last item cannot move down).
   - Optional pointer/touch dragging routes through the same unified reorder function.

3. **In-Place Error Correction (D-10, D-12):**
   - On wrong sequence submission, `handleSubmit` reports the wrong order in persistent `role="status"` without shuffling or consuming `currentOrder`.
   - Piece, destination, and arrow controls remain fully operable so learners correct their mistake in place.
   - Removed destructive shuffle-on-retry behavior.

4. **Scoped Progress Gating:**
   - Both `markSectionCompleted(levelSlug, index)` and `scope.markComplete()` require exact `correctOrder` and a non-null `scope.getIndex()`.
   - Preserves stable submit button focus and handles repeated check submissions idempotently.

5. **Persistent Bilingual Live Announcer:**
   - Added persistent `<div data-testid="drag-drop-status" role="status" aria-live="polite" aria-atomic="true">`.
   - Displays and announces initial prompt, selection updates, placement feedback, wrong retry hints, and completion success in English and Bahasa Melayu.

## Verification

- Automated test suite:
  - `src/__tests__/kids/drag-drop-prompt.test.tsx` (15/15 tests passing)
  - Full test suite: 28 test files, 317 tests passing across the entire repository.
- Verified keyboard/touch equivalence: order puzzle is fully navigable and solvable via keyboard Tab/Enter and single touch taps without dragging.
- Verified in-place correction: wrong submissions retain existing order and allow immediate reordering without progress reset.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - component is connected to authentic `pieces` and `correctOrder`, message keys are localized in `messages/en.json` and `messages/ms.json`, and progress persists via `saveComponentState`.

## Self-Check: PASSED

- FOUND: `src/components/kids/elements/drag-drop-prompt.tsx`
- FOUND: `src/__tests__/kids/drag-drop-prompt.test.tsx`
- FOUND: `messages/en.json`
- FOUND: `messages/ms.json`
- FOUND commit `689283ca`: `feat(15-05): offer selectable piece and explicit destination-position buttons`
- FOUND commit `dfc9c50f`: `feat(15-05): keep wrong ordering editable and scoped completion correct`
