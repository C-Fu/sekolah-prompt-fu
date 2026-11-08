# Phase 12: Planet-Themed Lesson Aesthetics & Subject Prompt Lessons - Validation Architecture

**Created:** 2026-11-08  
**Phase:** 12-planet-themed-lesson-aesthetics-subject-prompt-lessons  
**Status:** Active

---

## 1. Test Infrastructure & Frameworks

- **Unit & Logic Tests**: Vitest (`npm test`)
- **Component Tests**: React Testing Library + `@testing-library/jest-dom`
- **TypeScript Gate**: `npx tsc --noEmit`
- **Quality Gates**:
  - `npm run check:closure` (ensures zero broken imports across 23 static routes)
  - `npm run check:vocab` (enforces strict Malay vocabulary standards with zero English leaks)
  - `npm run verify` (full static export certification across Next.js App Router `out/`)

---

## 2. Per-Task Verification Map

| Plan | Task | Target Component / File | Verification Command | Expected Outcome |
|------|------|-------------------------|----------------------|------------------|
| **12-01** | Task 1 | `PlanetBackground` component | `npx vitest run src/__tests__/kids/planet-background.test.tsx` | Renders correct celestial theme, colors, and celestial particles per world |
| **12-01** | Task 2 | Curriculum Realignment (`levels.ts`, `planets.ts`, `level-content.ts`) | `npx vitest run src/__tests__/kids/levels.test.ts src/__tests__/kids/planets.test.ts` | 23 levels, Worlds 1-5 Earth, 6 Moon, 7 Mars, 8 Venus, 9 Mercury |
| **12-02** | Task 1 | BM & English 7-stage MDX authoring (6-1, 7-1) | `npx vitest run src/__tests__/kids/subject-lessons-stages.test.ts` | >= 7 `<Section>` elements in both `en` and `ms`, interactive widgets wired |
| **12-02** | Task 2 | Matematik & Moral 7-stage MDX authoring (8-1, 9-1) | `npx vitest run src/__tests__/kids/subject-lessons-stages.test.ts` | >= 7 `<Section>` elements in both `en` and `ms`, ending with `<LevelComplete>` |
| **12-02** | Task 3 | Full Static Export & Guard Certification | `npm run check:closure && npm run check:vocab && npm run verify` | Zero vocabulary errors, clean closure, 100% static `out/` export certified |

---

## 3. Wave 0 Mitigations

- Component tests mock `useLevelSlug()` to test celestial rendering for all 5 planetary themes in isolation.
- Static parameter tests ensure `generateStaticParams()` emits all 23 valid slugs without referencing retired levels.
