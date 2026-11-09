---
phase: 15-mobile-first-responsive-accessibility
plan: 04
subsystem: kids-elements
tags: [accessibility, a11y, magic-words, native-buttons, two-step-selection, retry, i18n]
dependency_graph:
  requires: [15-01]
  provides: [native-button-word-placement, item-to-destination-selection, wrong-placement-retry, duplicate-word-stability]
  affects:
    - src/components/kids/elements/magic-words.tsx
    - src/__tests__/kids/magic-words.test.tsx
    - src/__tests__/kids/level-locale.test.tsx
tech_stack:
  added: []
  patterns: [native-button-blanks, polite-aria-live-status, multimodal-selection-d16, duplicate-safe-indexing]
key_files:
  created:
    - src/__tests__/kids/magic-words.test.tsx
  modified:
    - src/components/kids/elements/magic-words.tsx
    - src/__tests__/kids/level-locale.test.tsx
decisions:
  - "Item-to-destination native buttons: Replaced implicit first-empty word fill with explicit select-item then select-destination native button workflow with >=44x44px touch hitbox and readable hint (D-09, D-13)."
  - "Non-consuming retry on mistaken blank: Validates item against target blank answers before placement; invalid placements retain selected word and keep prior correct placements intact with localized retry feedback (D-10, D-12)."
  - "Independent duplicate-word identities: Word bank derives identity from index and origin blankId so identical words in the bank operate independently without mutual locking (A11Y-03)."
  - "Exact correctness and scoped completion: Replaced allFilled check with all-correct verification and required non-null scope.getIndex() before marking section complete (D-10, D-11, T-15-05)."
status: complete
actuals:
  tokens: 9823
  tasks: 2
  commits: 2
  plan_head_before: "b1bcb51d004884fc835a8bda1b63e55088386b19"
  plan_head_after: "14d0f8247d79dcbe0ca003412fe82f0c4a007f2a"
---

# Phase 15 Plan 04: Native-Button Item-to-Destination Word Activity Summary

**One-liner:** Converted MagicWords into a native-button item-to-destination interactive learning activity with duplicate-safe identity, non-consuming wrong-destination retry, visible polite live status announcements, and exact all-correct section scoping.

## Plan Summary

### Objective
Turn word placement into a real native-button item→destination activity with non-consuming retry and nearby bilingual status, ensuring touch and keyboard children can solve without dragging, while local progress remains identity-scoped.

### Implemented Capabilities
1. **Native Button Blanks & Touch Targets (D-09, D-13):**
   - Converted blanks from non-interactive `<span>` drop targets into native `<button type="button">` elements with accessible labels, readable hints, and `>=44x44px` touch hitboxes (`min-w-[100px] min-h-[44px]`).
   - Supports keyboard focus (Tab/Space/Enter) and touch tap without suppressing click events.

2. **Item-to-Destination Two-Step Selection & Retry (D-09, D-10, D-12):**
   - Child selects a word in the word bank (`aria-pressed="true"`, visible `✓ Selected` / `✓ Dipilih` indicator, high-contrast ring).
   - Child selects a target destination blank button.
   - Validation checks target blank's allowed `answers`:
     - If correct: word is placed into target blank, item is consumed, and polite success status announces.
     - If incorrect: selected word is retained, target blank is not modified, other earlier placed answers remain intact, and polite retry status announces (`Not there yet. Choose another place for this item.` / `Belum tepat. Pilih tempat lain untuk item ini.`).
   - If no word is selected, tapping an already filled blank unplaces the word, returning it to the word bank.
   - Drag shortcut uses the identical validation logic.

3. **Duplicate-Word Identity Stability (A11Y-03, Truth 4):**
   - Word identity derived from available word index and origin blankId.
   - Placing one duplicate word instance (e.g. one of multiple "cat" entries) only consumes that specific button, leaving other duplicates available and selectable.
   - Legacy saved state without `placedIndices` is cleanly reconciled into index-safe placements upon load.

4. **Exact Correctness & Scoped Section Completion (D-10, D-11, T-15-05):**
   - Replaced old `allFilled` completion condition with all-blanks-correct validation.
   - Requires non-null `scope.getIndex()` before calling both `markSectionCompleted` and `scope.markComplete()`.
   - Action controls remain mounted in stable positions across checking, retrying, and completion states.

## Verification

- Automated test suites:
  - `src/__tests__/kids/magic-words.test.tsx` (16/16 tests passing, covering keyboard/touch, duplicate words, wrong-retry, interrupted selection, repeated submit, legacy state recovery, BM locale).
  - `src/__tests__/kids/level-locale.test.tsx` (38/38 tests passing).
  - Full project test suite: 27 test files, 302 tests passing (0 failures).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Auto-fix blocking issue] Updated level-locale.test.tsx line 648 for two-step selection**
- **Found during:** Task 1 verification
- **Issue:** `src/__tests__/kids/level-locale.test.tsx` line 648 only clicked `/cats/`, relying on the deprecated implicit first-empty slot fill. With native item-to-destination button interaction (D-09), clicking `/cats/` selects the word; the destination blank must be clicked to place the word.
- **Fix:** Added `fireEvent.click(screen.getByRole("button", { name: /animal/ }));` following the word selection click.
- **Files modified:** `src/__tests__/kids/level-locale.test.tsx`
- **Commit:** `f41e9ad8`

## Known Stubs

None - all activities connect to authentic MDX level props, localized message bundles (`kids.magicWords` and `kids.activity`), and client-side progress stores.

## Threat Surface Scan

No new network endpoints, authentication paths, or backend surface added. Learning progress and component drafts remain client-side only.

## Self-Check: PASSED

- FOUND: `src/components/kids/elements/magic-words.tsx`
- FOUND: `src/__tests__/kids/magic-words.test.tsx`
- FOUND commit `f41e9ad8`: `feat(15-04): support select-item then explicit blank with non-consuming retry`
- FOUND commit `14d0f824`: `feat(15-04): guard exact correctness and scoped progress through repeat and reload`
