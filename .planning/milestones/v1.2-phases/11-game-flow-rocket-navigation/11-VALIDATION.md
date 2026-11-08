# Phase 11: Game Flow & Rocket Navigation - Validation Architecture

**Created:** 2026-11-08  
**Phase:** 11-game-flow-rocket-navigation  
**Status:** Active

---

## 1. Test Infrastructure & Frameworks

- **Unit & Logic Tests**: Vitest (`npm test`)
- **Component Tests**: React Testing Library + `@testing-library/jest-dom`
- **TypeScript Gate**: `npx tsc --noEmit`
- **Quality Gates**:
  - `npm run check:closure` (ensures zero broken imports or non-kids dependencies)
  - `npm run check:vocab` (enforces no English leaks in Bahasa Melayu content)
  - `npm run verify` (full static export certification across Next.js App Router `out/`)

---

## 2. Per-Task Verification Map

| Plan | Task | Target Component / File | Verification Command | Expected Outcome |
|------|------|-------------------------|----------------------|------------------|
| **11-01** | Task 1 | `PixelRocket` & `RocketLaunchOverlay` | `npx vitest run src/__tests__/kids/rocket-launch.test.tsx` | Countdown ticks, animation fires, redirects to `/planets` |
| **11-01** | Task 2 | `LevelComplete` on `5-4-graduation-day` | `npx vitest run src/__tests__/kids/level-complete.test.tsx` | Graduation displays Rocket Launch CTA triggering overlay |
| **11-02** | Task 1 | `KidsHomeContent` (Dual CTA) | `npx vitest run src/__tests__/kids/home-navigation.test.tsx` | Renders Start on Earth (`/map`) and Explore Space (`/planets`) |
| **11-02** | Task 2 | `KidsHeader` & `/map` portal banner | `npx vitest run src/__tests__/kids/header-navigation.test.tsx` | Space Rocket button visible in header and portal banner on `/map` |
| **11-02** | Task 3 | `PlanetaryExplorer` mission router & static certification | `npm run check:closure && npm run check:vocab && npm run verify` | `onLaunchMission` routes to lessons; all static checks pass |

---

## 3. Wave 0 Mitigations

- `useRouter()` is mocked in Vitest component tests to assert route redirection without browser page reloads.
- Timer intervals in `RocketLaunchOverlay` use standard React Testing Library `act()` and fake timers.
