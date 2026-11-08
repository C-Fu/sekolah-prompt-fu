# Phase 13: Static Export & Quality Gate Certification - Context

**Gathered:** 2026-11-09  
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the final quality and static export certification for Milestone v1.2 ("3D Planetary Hub, Subject Cartography & Rocket Return"). It updates `scripts/verify-project.js` to inspect the newly introduced `/planets` route (`out/planets/index.html`) alongside `/`, `/map`, and all 23 level routes; resolves all ESLint errors in newly authored components and test files (fixing JSX textnode comment syntax in `PlanetaryHud` and replacing unsafe `any` casts with typed record schemas in tests); runs the full gate suite (`tsc`, Vitest, `check:closure`, `check:vocab`, `npm run lint`, and `npm run verify`); and produces the milestone audit and completion artifacts.

</domain>

<decisions>
## Implementation Decisions

### 1. Route Verification Expansion in `scripts/verify-project.js` (GATE-02)
- **D-01:** Expand `scripts/verify-project.js` to explicitly assert the existence of `out/planets/index.html` as a core first-class application route:
  - Required routes asserted: root `/` (`out/index.html`), `/map` (`out/map/index.html`), `/planets` (`out/planets/index.html`), and all 23 level routes (`out/level/[slug]/index.html`).
  - Update tests in `src/__tests__/scripts/verify-project.test.ts` to assert coverage of `/planets`.

### 2. Clean Code & ESLint Compliance (GATE-01)
- **D-02:** Fix ESLint errors in newly added files:
  - `PlanetaryHud.tsx`: Fix unescaped `//` comment syntax inside JSX element children.
  - Test files (`planets-i18n.test.ts`, `header-navigation.test.tsx`, `home-navigation.test.tsx`): Replace explicit `any` with strongly-typed interfaces or `Record<string, unknown>`.
  - Fix unused parameters or vars flagged by `@typescript-eslint/no-unused-vars` in new files.
  - Ensure `npm run lint` passes with 0 errors.

### 3. Comprehensive End-to-End Milestone Audit & Quality Gates
- **D-03:** Execute the full verification suite:
  - `npx tsc --noEmit` (strict TypeScript check).
  - `npm test` (all Vitest suites).
  - `npm run check:closure` (ensures zero broken or non-kids imports across 23 routes).
  - `npm run check:vocab` (enforces strict Malay vocabulary standards with zero English leaks).
  - `npm run lint` (ESLint verification).
  - `npm run build && npm run verify` (full Next.js static export build and inspection of `out/`).
- **D-04:** Audit all active requirements in `.planning/REQUIREMENTS.md` and transition milestone status to complete.

### Builder Discretion
- Formatting adjustments for the console output in `scripts/verify-project.js` when reporting `/planets`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Quality Scripts & Verification
- `scripts/verify-project.js` — Source of truth for NFR-2 certification and static route inspection.
- `src/__tests__/scripts/verify-project.test.ts` — Unit tests for the verification script.
- `scripts/check-kids-import-closure.js` — Import closure analyzer.
- `scripts/check-ms-vocabulary.js` — Malay vocabulary guard.
- `.github/workflows/ci.yml` — Continuous integration gate definition.

### Source Files to Clean for ESLint
- `src/components/kids/planets/planetary-hud.tsx` (JSX textnode comment error).
- `src/__tests__/kids/planets-i18n.test.ts` (`no-explicit-any`).
- `src/__tests__/kids/header-navigation.test.tsx` (`no-explicit-any`).
- `src/__tests__/kids/home-navigation.test.tsx` (`no-explicit-any`).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `deriveLevelSlugs()` in `scripts/verify-project.js`: Statically extracts level slugs from `src/lib/kids/levels.ts`.
- `requireArtifact()` helper in `scripts/verify-project.js`: Asserts file presence in `out/`.

### Established Patterns
- Pure Node.js standard library for scripts (no runtime external dependencies).
- Bounded timeouts (300s) on subprocess executions to prevent CI deadlocks.

</code_context>

<specifics>
## Specific Ideas
- Clean, green passing CI run with zero warnings/errors on `npm run lint` and `npm run verify`.

</specifics>

<deferred>
## Deferred Ideas
- None — this is the final certification and hardening phase for Milestone v1.2.

</deferred>

---

*Phase: 13-static-export-quality-gate-certification*  
*Context gathered: 2026-11-09*
