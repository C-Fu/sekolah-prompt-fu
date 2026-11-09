---
phase: 15-mobile-first-responsive-accessibility
plan: 02
subsystem: kids-ui
tags: [responsive, accessibility, mobile-first, navigation, touch-targets, keyboard-nav, i18n]
status: complete
requires:
  - phase: 15-mobile-first-responsive-accessibility
    plan: 01
provides:
  - responsive two-step title with wrapping cards and touch hitboxes (D-01, D-04)
  - keyboard-operable mobile navigation header with escape dismiss and touch targets (D-13)
  - local keyboard-scrollable Earth map with named accessible level nodes (D-04, D-13)
affects:
  - title screen destination flow
  - global header navigation and language switching
  - Earth progress map
tech-stack:
  added: []
  patterns:
    - responsive flex/grid wrapping with min-w-0 containment
    - touch-comfortable minimum 44x44px CSS hitbox targets
    - keyboard-operable menu with aria-expanded, aria-haspopup, and Escape listener
    - local overflow-x-auto scroll container with keyboard Arrow navigation
key-files:
  created: []
  modified:
    - src/components/kids/layout/kids-home-content.tsx
    - src/components/kids/layout/kids-header.tsx
    - src/components/kids/elements/progress-map.tsx
    - src/components/kids/layout/language-toggle.tsx
    - src/components/kids/elements/journey-tip.tsx
    - messages/en.json
    - messages/ms.json
    - src/__tests__/kids/home-navigation.test.tsx
    - src/__tests__/kids/header-navigation.test.tsx
decisions:
  - D-01/D-04: Preserve Phase 14's two-step welcome and equal title destination cards; allow cards to wrap naturally with min-w-0 without page horizontal overflow.
  - D-13: Guarantee minimum 44x44px CSS touch hitboxes for all interactive header triggers, language buttons, title actions, map controls, and available level nodes.
  - E1/E2 resilience: Wrap progress storage reads in defensive try/catch to ensure navigation routes and links remain operable even if client storage fails or is uninitialized.
  - Local map scrolling: Isolate wide Earth map illustration inside local overflow-x-auto region; add tabIndex=0, aria-label, and ArrowLeft/ArrowRight keyboard scrolling.
metrics:
  duration: 18m
  completed_date: "2026-11-10"
actuals:
  tokens: 9760
  tasks: 2
  commits: 2
  plan_head_before: ba849e0e
  plan_head_after: 418e601a
---

# Phase 15 Plan 02: Responsive Title, Header, and Map Reflow Summary

Responsive reflow, touch hitboxes (≥44×44 CSS px), and keyboard operability for title destination cards, shared header navigation, and the illustrated Earth progress map across bilingual BM/EN locales.

## What Was Built

1. **Responsive Title Destinations (`KidsHomeContent`)**:
   - Maintained Phase 14's two-step welcome flow and equal-weight `/map` (Earth) and `/planets` (Solar System) cards.
   - Enforced 16px horizontal side gutters (`px-4`) and `min-w-0` on children to prevent page-level horizontal overflow at 320px viewport width.
   - Replaced fixed-dimension card layouts with flexible wrapping (`break-words`, `min-w-0`, `w-full`) so long BM/EN text wraps naturally.
   - Added minimum 44×44 CSS px hitboxes to title Back/Next navigation buttons and card actions.
   - Verified that client progress storage failures or uninitialized progress never replace title destinations or invoke progress reset.

2. **Keyboard-Operable & Touch-Comfortable Header (`KidsHeader` & `LanguageToggle`)**:
   - Equipped mobile hamburger menu button with `aria-expanded`, `aria-haspopup`, and an `Escape` key listener that dismisses the menu and restores focus to the trigger.
   - Scaled header menu button, desktop navigation links (`/`, `/map`, `/planets`), and mobile dropdown links to at least 44×44 CSS px touch targets.
   - Updated `LanguageToggle` button hitboxes to reach touch-comfortable targets without causing horizontal crowding at 320px.
   - Wrapped progress reads (`getTotalStars`, `getCompletedLevelsCount`) in try/catch to survive localStorage read exceptions gracefully without breaking route navigation.
   - Moved level indicator badge to `hidden md:flex` to prevent top bar crowding on narrow screens.

3. **Locally Contained Earth Map Navigation (`ProgressMap` & `JourneyTip`)**:
   - Confined wide illustration scrolling strictly inside the local `scrollRef` `overflow-x-auto` region with `shrink-0` (removing page-width forcing `min-w-full`).
   - Added `role="region"`, localized `aria-label`, and `tabIndex={0}` to the map scroll area, supporting keyboard scrolling via `ArrowLeft` and `ArrowRight`.
   - Scaled map desktop left/right controls and planet portal banner to ≥44×44 CSS px hitboxes with visible text labels in both English and Bahasa Melayu.
   - Removed `whitespace-nowrap` on world banners and level titles, allowing titles up to 180–220px to wrap smoothly without clipping.
   - Preserved `buildLessonUrl(level.slug, 'map')` routing and verified that locked levels remain non-activating with `aria-disabled="true"`.
   - Increased `JourneyTip` dismiss button to ≥44×44 CSS px while keeping guidance unobstructed at the top of the map.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Auto-add missing critical functionality] Touch hitbox sizing on shared layout buttons**
- **Found during:** Task 1 & Task 2
- **Issue:** Language toggle buttons inside `LanguageToggle` and dismiss button in `JourneyTip` had sub-44px touch targets (`px-2 py-0.5` inside `h-8`), violating D-13 requirements for touch targets.
- **Fix:** Added `min-h-[44px] min-w-[44px]` touch target sizing and flex centering to `LanguageToggle` and `JourneyTip` dismiss button.
- **Files modified:** `src/components/kids/layout/language-toggle.tsx`, `src/components/kids/elements/journey-tip.tsx`
- **Commits:** `79ad0ea9`, `418e601a`

**2. [Rule 1 - Auto-fix bug] Safeguarded `scrollBy` on jsdom test environment**
- **Found during:** Task 2 verification
- **Issue:** `HTMLElement.prototype.scrollBy` is not implemented in jsdom, throwing an unhandled TypeError when triggering keyboard arrow scroll events in tests.
- **Fix:** Added defensive `typeof scrollRef.current?.scrollBy === "function"` guard before invoking `scrollBy`.
- **Files modified:** `src/components/kids/elements/progress-map.tsx`
- **Commit:** `418e601a`

## Verification Results

- `npm test -- src/__tests__/kids/home-navigation.test.tsx src/__tests__/kids/header-navigation.test.tsx`: 18/18 tests passed (including all E1 and E2 state assertions).
- `npm run check:closure`: Verified 411 modules in closure, all imports resolved.
- `npm run check:vocab`: Passed Malay vocabulary check across all 23 MDX files.

## Self-Check: PASSED
- FOUND: `src/components/kids/layout/kids-home-content.tsx`
- FOUND: `src/components/kids/layout/kids-header.tsx`
- FOUND: `src/components/kids/elements/progress-map.tsx`
- FOUND: `src/__tests__/kids/home-navigation.test.tsx`
- FOUND: `src/__tests__/kids/header-navigation.test.tsx`
- FOUND commit: `79ad0ea9`
- FOUND commit: `418e601a`
