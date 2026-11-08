# Phase 10: 3D Planetary Explorer Component - Validation Architecture

**Created:** 2026-11-08  
**Phase:** 10-3d-planetary-explorer-component  
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

| Plan | Task | Target Unit / Component | Verification Command | Expected Outcome |
|------|------|-------------------------|----------------------|------------------|
| **10-01** | Task 1 | Three.js Package Legitimacy Audit | `npm view three version && npm view @types/three version` | Human approval of established package identity |
| **10-01** | Task 2 | `planetary-math.ts` (boundary math, ease-out lerp) & `planetary-canvas.tsx` | `npx vitest run src/__tests__/kids/planetary-math.test.ts` | 6/6 tests passing (boundary point count, offset radius, interpolation limits) |
| **10-01** | Task 3 | Optimized NASA Textures (< 800 KB) in `public/images/planets/` | `node -e '...'` check file existence & size | Total directory size < 800 KB, `ATTRIBUTION.md` present |
| **10-02** | Task 1 | `planetary-interaction.ts` (drag disambiguation, raycasting) | `npx vitest run src/__tests__/kids/solar-system-scene.test.ts` | Disambiguates drag vs click; tests passing |
| **10-02** | Task 2 | `solar-system-scene.ts` (Sun, 5 orbits, planet meshes) | `npx tsc --noEmit && npm test` | Typecheck passes, scene constructors compile cleanly |
| **10-03** | Task 1 | `PlanetaryHud.tsx` (glassmorphic telemetry, bilingual badges) | `npx vitest run src/__tests__/kids/planetary-hud.test.tsx` | All 7 features rendered with Tahun 1-6 badges and telemetry |
| **10-03** | Task 2 | `planet-cartography-scene.ts` (globe, 7 boundary rings, pins) | `npx tsc --noEmit && npm test` | Scene loads globe, elevates rings (+0.015), handles camera glide |
| **10-04** | Task 1 | `PlanetaryExplorer.tsx` (root two-level orchestrator) | `npx vitest run src/__tests__/kids/planetary-explorer.test.tsx` | Transitions between Solar System and Planet Cartography views |
| **10-04** | Task 2 | `/planets` static route & full certification | `npm run check:closure && npm run check:vocab && npm run verify` | Full static build passes with `/planets` in `out/` export |

---

## 3. Wave 0 Gaps & Mitigation

- **WebGL Testing in Vitest**: Vitest runs in Node/JSDOM where `WebGLRenderer` is not natively implemented.
  - *Mitigation*: Pure mathematical logic (`generateBoundaryPoints`, cubic ease-out lerp, drag detection) is decoupled into `planetary-math.ts` and `planetary-interaction.ts`. Component tests mock canvas context or Three.js WebGL rendering, ensuring test runs succeed without headless GPU dependencies.
