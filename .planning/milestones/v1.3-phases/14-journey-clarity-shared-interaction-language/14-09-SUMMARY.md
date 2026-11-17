# Plan 14-09 Summary: Bilingual Section Title and Locked State Guidance Integration

## Overview
Wired the complete bilingual section title lookup and localized step ordinal ("Step {current} of {total}") into the lesson view, and added visible inline explanation for locked Next actions per decisions D-07, D-10, and D-11.

## Key Changes
- **Active Section Title & Ordinal (`src/components/kids/layout/level-content-wrapper.tsx`)**:
  - Dynamically looked up the current section's title via `getSectionTitle(locale, levelSlug, currentSection)`.
  - Displayed a high-contrast context header (`data-testid="active-section-context"`) with section title and localized step ordinal ("Step {current} of {total}" / "Langkah {current} daripada {total}").
  - Avoided introducing global breadcrumb trails per D-07.
- **Visible Locked Action Guidance**:
  - Rendered inline localized copy adjacent to the disabled Next button (`data-testid="locked-next-explanation"`) displaying "Complete the activity first to continue." / "Siapkan aktiviti ini dahulu untuk teruskan.".
  - Maintained the fail-closed identity-scoped section gate: completing the interactive activity immediately enables Continue and removes the locked warning.
- **Localization Parity**: Updated `messages/en.json` and `messages/ms.json` with canonical copy for `navigation.stepOrdinal` and `navigation.completeFirst`.
- **Comprehensive Tests**:
  - Verified that all 38 existing `level-locale.test.tsx` tests pass without regression.
  - Added `src/__tests__/kids/level-title-guidance.test.tsx` asserting bilingual title and ordinal rendering.

## Verification
- `npm test -- src/__tests__/kids/level-locale.test.tsx src/__tests__/kids/level-title-guidance.test.tsx` passed with 40/40 tests.
