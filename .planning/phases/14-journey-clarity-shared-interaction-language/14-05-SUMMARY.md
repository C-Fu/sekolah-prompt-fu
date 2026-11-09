# Plan 14-05 Summary: Context-Aware Lesson Return Routing

## Overview
Applied the allowlisted lesson origin contract across all lesson return states in `LevelContentWrapper` and `LevelComplete` per decisions D-08, D-09, and requirement CLAR-03 without mutating saved learning progress.

## Key Changes
- **Origin Context Expansion (`src/components/kids/providers/lesson-origin-context.tsx`)**: Added `hubLabelKey` mapping ("level.map" vs "level.planets") to support localized return link text ("Return to Earth map" / "Return to Planets", "Kembali ke Peta Bumi" / "Kembali ke Planet").
- **Lesson Recovery & Footer Routing (`src/components/kids/layout/level-content-wrapper.tsx`)**:
  - `NavigationFooter`: Mapped final section return action to the resolved `returnRoute` (`/map` or `/planets`) with localized return label.
  - `ComingSoon` & Load Error: Directed recovery links to the originating hub (`returnRoute`) and rendered localized load error messages (`kids.level.loadError`).
- **Completion Dialog Routing (`src/components/kids/elements/level-complete.tsx`)**:
  - Bound completion return button to `returnRoute` with localized text.
  - Propagated origin to next-level links (`/level/${next.slug}?origin=${origin}`) so continuous learning retains hub origin.
- **Localization Bundles**: Added canonical strings for `returnToHub`, `loadError`, and hub labels in `messages/en.json` and `messages/ms.json`.
- **Verification Tests**:
  - `src/__tests__/kids/level-locale.test.tsx` verified loading, rendering, and Section progression with backward compatibility.
  - `src/__tests__/kids/level-complete.test.tsx` verified capstone, overlay, and standard completion views.
  - `src/__tests__/kids/level-complete-origin.test.tsx` tested map, planets, direct, and invalid origin behavior, next-level propagation, and Bahasa Melayu copy.

## Verification
- `npm test -- src/__tests__/kids/level-locale.test.tsx src/__tests__/kids/level-complete.test.tsx src/__tests__/kids/level-complete-origin.test.tsx` passed all 44 tests.
