# Phase 13: Static Export & Quality Gate Certification - Validation Architecture

**Created:** 2026-11-09  
**Phase:** 13-static-export-quality-gate-certification  
**Status:** Active

---

## 1. Test Infrastructure & Frameworks

- **Unit & Logic Tests**: Vitest (`npm test`)
- **Component Tests**: React Testing Library + `@testing-library/jest-dom`
- **TypeScript Gate**: `npx tsc --noEmit`
- **Linter Gate**: `npm run lint` (ESLint)
- **Quality Guards**:
  - `npm run check:closure` (406 modules in closure)
  - `npm run check:vocab` (23 MDX files scanned)
  - `npm run verify` (full static export certification across Next.js App Router `out/` including `/`, `/map`, `/planets`, and 23 level routes)

---

## 2. Per-Task Verification Map

| Plan | Task | Target Component / File | Verification Command | Expected Outcome |
|------|------|-------------------------|----------------------|------------------|
| **13-01** | Task 1 | `scripts/verify-project.js` & `src/__tests__/scripts/verify-project.test.ts` | `npx vitest run src/__tests__/scripts/verify-project.test.ts` | Tests pass asserting `/planets` existence and failure on missing artifact |
| **13-01** | Task 2 | ESLint Cleanup in `PlanetaryHud`, tests & schema | `npm run lint` | 0 errors across all 61 previous complaints |
| **13-01** | Task 3 | Full End-to-End Milestone Certification | `npm run build && npm run verify` | Full static build succeeds and `verify` exits 0 certifying `/`, `/map`, `/planets`, 23 level routes, and media |

---

## 3. Wave 0 Mitigations

- Verification script sandbox tests use temporary directories (`mkdtempSync`) to isolate fixture inspection from production `out/`.
- ESLint rule exceptions or typing casts use typed interfaces (`MessagesDict`, `Record<string, unknown>`) instead of untyped `any`.
