---
phase: 15-mobile-first-responsive-accessibility
plan: 06
subsystem: kids-layout
tags: [accessibility, a11y, lesson-footer, keyboard-nav, responsive, i18n]
dependency_graph:
  requires: [15-01]
  provides: [scroll-safe-lesson-shell, keyboard-readable-lock, accessible-section-dots]
  affects:
    - src/components/kids/layout/level-content-wrapper.tsx
    - src/__tests__/kids/level-title-guidance.test.tsx
    - src/__tests__/kids/level-locale.test.tsx
    - src/__tests__/kids/settings-locale.test.tsx
tech_stack:
  added: []
  patterns: [aria-disabled-focusable-button, aria-describedby-explanation, opaque-scrim-wrap, touch-target-hitbox]
key_files:
  created: []
  modified:
    - src/components/kids/layout/level-content-wrapper.tsx
    - src/__tests__/kids/level-title-guidance.test.tsx
    - src/__tests__/kids/level-locale.test.tsx
    - src/__tests__/kids/settings-locale.test.tsx
decisions:
  - "Opaque backing and title wrapping: Active section title and ordinal wrap on opaque #0F172A scrim without truncation to guarantee legibility across planetary backgrounds (D-04, D-15)."
  - "Flowing lesson footer with scroll clearance: Anchored footer stays in normal flow with safe-area bottom padding while content region uses min-h-0 overflow-y-auto and scroll-padding-bottom (D-02)."
  - "Keyboard-discoverable locked Next: Locked Next button is focusable with aria-disabled=true and aria-describedby referencing the locked explanation, guarded against accidental activation via Enter/Space/Click (D-11, D-16)."
  - "Section dots accessibility: Section dots provide at least 44x44 CSS px hitboxes while maintaining 16px pixel art, take locked future dots out of the tab order, and use bilingual accessible labels (D-13)."
status: complete
actuals:
  tokens: 6515
  tasks: 2
  commits: 2
  plan_head_before: "ae96e770069979d2eaebdd7aa9d65ba5454ab16e"
  plan_head_after: "e3f61f491286f64a0b04dc42d878d670e18f1e97"
---

# Phase 15 Plan 06: Readable Lesson Content and Discoverable Locked Next Summary

**One-liner:** Delivered scroll-safe lesson shell with opaque title wrapping, in-flow footer with safe-area inset, keyboard-discoverable locked Next button, and touch-accessible section dots.

## Plan Summary

### Objective
Keep lesson answers readable and the footer independently reachable on short/zoomed screens, ensuring bilingual section titles and locked Next reasons are fully discoverable by touch and keyboard users without bypassing progression gates.

### Implemented Capabilities
1. **Opaque Backing & Unconstrained Title Wrapping (D-04, D-15):**
   - Active section context header in `LevelContentWrapper` upgraded to an opaque backing (`bg-[#0F172A] border-2 border-[#DAA520] pixel-border-sm`) guaranteeing contrast over dynamic planetary backgrounds.
   - Removed `truncate` class and enabled `break-words` with flex wrapping so longer Bahasa Melayu and English titles never clip or lose essential instructions.

2. **Scroll-Safe Lesson Layout & In-Flow Footer (D-02):**
   - Content region uses `flex-1 min-h-0 overflow-y-auto scroll-pb-20 sm:scroll-pb-24` ensuring answers and feedback remain independently scrollable and never sit obscured behind the footer.
   - Anchored lesson footer stays in normal flow (`shrink-0`) with safe-area padding (`pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]`) and an independently scrollable interior (`max-h-[40vh] overflow-y-auto`) to prevent clipped controls under extreme zoom.

3. **Keyboard-Discoverable Locked Next (D-11, D-16):**
   - Incomplete Next button rendered as a focusable non-activating button with `aria-disabled="true"` and `aria-describedby="locked-next-explanation"`, allowing keyboard users to Tab to the control and discover the lock reason.
   - Prevents Enter, Space, and Click from advancing the section cursor while incomplete; `goToNext` strictly guards on `currentComplete`.
   - Distinctive visual treatment with lock icon, `#8B4513` border, and text styling rather than opacity reduction alone.

4. **Accessible Section Dots & Hitbox Expansion (D-13):**
   - Expanded interactive button target size to at least 44×44 CSS px (`w-11 h-11 min-w-[44px] min-h-[44px]`) while preserving the 16px decorative inner diamond pixel art.
   - Removed locked future section dots from keyboard tab order (`tabIndex={-1}` and `disabled`).
   - Wired localized accessible names using `navigation.sectionDot` and `navigation.sectionDotLocked` translation keys with resilient fallback.

## Verification

- Automated test suites:
  - `src/__tests__/kids/level-title-guidance.test.tsx` (6 tests passing): asserts loading copy, absence of false Next, originating-hub error return, saved progress preservation, title wrapping on opaque backing, and bilingual footer labels.
  - `src/__tests__/kids/level-locale.test.tsx` (41 tests passing): asserts keyboard Tab reachability to locked Next, lock explanation linkage, Enter/Space/Click non-activation, and accessible section dot tabIndex/hitbox behavior.
  - Full test suite: 28 test files, 324 tests passing.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 / Rule 3 - Test Assertion Update] Aligned Settings test with aria-disabled Next contract**
- **Found during:** Task 2 full suite check.
- **Issue:** `src/__tests__/kids/settings-locale.test.tsx` previously asserted `toBeDisabled()` for Next, which checks native HTML `disabled`. Because the accessible Next button uses `aria-disabled="true"` to remain keyboard-focusable per D-11, `toBeDisabled()` failed.
- **Fix:** Updated `settings-locale.test.tsx` line 265 to assert `toHaveAttribute("aria-disabled", "true")`.
- **Files modified:** `src/__tests__/kids/settings-locale.test.tsx`
- **Commit:** `e3f61f49`

## Known Stubs

None - all controls wire directly to level navigation, section completion registry, and localized message bundles.

## Self-Check: PASSED

- FOUND: `src/components/kids/layout/level-content-wrapper.tsx`
- FOUND: `src/__tests__/kids/level-title-guidance.test.tsx`
- FOUND: `src/__tests__/kids/level-locale.test.tsx`
- FOUND: `src/__tests__/kids/settings-locale.test.tsx`
- FOUND commit `2cd9e4bf`: `feat(15-06): keep lesson footer in flow while answers scroll independently`
- FOUND commit `e3f61f49`: `feat(15-06): make locked Next reason discoverable from keyboard and add accessible section dots`
