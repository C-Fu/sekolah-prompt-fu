# Plan 14-04 Summary: Lesson Origin Tracking Contract

## Overview
Established the narrow, deterministic lesson-origin contract and propagated it from both existing hubs (`/map` and `/planets`) into the lesson wrapper subtree per decisions D-08, D-09, and requirement CLAR-03.

## Key Changes
- **Allowlisted Origin Helper (`src/lib/kids/lesson-origin.ts`)**: Implemented `LessonOrigin` ("map" | "planets"), `parseLessonOrigin`, `resolveOriginRoute`, `buildLessonUrl`, and `attachOriginToRoute`. Enforces fail-safe deterministic resolution to `/map` for any empty, unknown, or hostile URL inputs.
- **Client Origin Context (`src/components/kids/providers/lesson-origin-context.tsx`)**: Created `LessonOriginProvider` and `useLessonOrigin` hook. Reads `window.location.search` after mount to preserve static-export compatibility and SSR hydration stability.
- **LevelContentWrapper Integration**: Wrapped lesson content in `LessonOriginProvider` so child components and completion modals can access the originating hub context.
- **Hub Entry Wiring**:
  - `ProgressMap`: Generated lesson links using `buildLessonUrl(slug, "map")` pointing to `/level/${slug}?origin=map`.
  - `PlanetaryExplorer`: Attached `?origin=planets` to mission navigation routes.
- **Tests**:
  - `src/__tests__/kids/lesson-origin.test.ts`: Verified allowlisting, fallbacks, route generation, and parameter preservation.
  - `src/__tests__/kids/planetary-explorer.test.tsx`: Verified router navigation carries `?origin=planets`.

## Verification
- `npm test -- src/__tests__/kids/lesson-origin.test.ts src/__tests__/kids/planetary-explorer.test.tsx` passed all 14 tests.
