---
phase: "04"
slug: "verification-testing-polish"
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
status: validated
nyquist_compliant: false
wave_0_complete: false
created: "2026-11-05"
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Reconstructed post-hoc (State B) from 04-01/04-02 PLAN + SUMMARY artifacts and the
> phase's own certification script. Nyquist gaps for the phase's requirements (NFR-2,
> FR-1, FR-4) were filled by the auditor; see **Nyquist Gap Closure** below.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 2.1.x (`globals: true`, jsdom) |
| **Config file** | `vitest.config.ts` (`include: ["src/**/*.{test,spec}.{ts,tsx}"]`) |
| **Quick run command** | `npx vitest run <file>` |
| **Full suite command** | `npm test` (`vitest run`) |
| **Estimated runtime** | ~15s full suite; ~10s for the verify-script behavioral tests |

> Note: `scripts/*.js` guard/verification scripts are **outside** the Vitest `include`
> glob. The Phase-4 auditor added behavioral tests under `src/__tests__/scripts/` that
> spawn those scripts as subprocesses against sandboxed repo roots, bringing the
> otherwise-uncovered verifier behaviors into the automated suite.

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run <touched spec>`
- **After every plan wave:** Run `npm test` (full suite)
- **Before `/gsd-verify-work`:** Full suite must be green; `npm run verify` must exit 0 against a built `out/`
- **Max feedback latency:** ~20 seconds (full suite)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | NFR-2 | T-04-01 / T-04-02 | Verifier is read-only; command literals are static (no injection); refuses loudly on absent `out/` / empty slug set | integration (subprocess) + smoke | `npx vitest run src/__tests__/scripts/verify-project.test.ts` | ✅ | ✅ green |
| 04-01-02 | 01 | 1 | NFR-2 | — | `npm run verify` exposes the verifier; exits 0 against a built tree | smoke | `npm run verify` / `node scripts/verify-project.js` | ✅ | ✅ green |
| 04-01-03 | 01 | 1 | NFR-2 / FR-4 | T-04-03 | `ci.yml` runs `npx tsc --noEmit` + `npm run verify`; no build step (D-12) | integration (workflow text) | `npx vitest run src/__tests__/scripts/workflows.test.ts` | ✅ | ✅ green |
| 04-02-01 | 02 | 1 | NFR-2 | T-04-04 | `HANDOFF.md` names the exact certified commands and points at the runnable verifier | docs (no runtime) | `node -e '<HANDOFF assertion>'` (plan verify) | ✅ | ⚠️ manual |
| 04-02-02 | 02 | 1 | NFR-2 | T-04-06 | NFR-2 flip gated on gates actually passing | docs (no runtime) | `node -e '<NFR-2 assertion>'` (plan verify) | ✅ | ⚠️ manual |
| 04-02-03 | 02 | 1 | NFR-2 | — | PROJECT/STATE record the Phase-4 certification | docs (no runtime) | `node -e '<STATE/PROJECT assertion>'` (plan verify) | ✅ | ⚠️ manual |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky · ⚠️ manual = docs-only, no runtime automation*

---

## Wave 0 Requirements

- [x] `src/__tests__/scripts/verify-project.test.ts` — behavioral coverage for `scripts/verify-project.js` (refuse-loudly paths, artifact inspection, slug derivation, real-tree PASS, D-12 no-build)
- [x] `src/__tests__/scripts/workflows.test.ts` — structural coverage for `deploy.yml` (FR-4) and `ci.yml` (D-10/D-11/D-12)
- [x] Existing infrastructure covers the remaining phase requirements (Vitest config/setup already present; no new framework install)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `HANDOFF.md` contains all four D-06 content areas with exact certified commands | NFR-2 | Docs artifact; the plan's inline `node -e` assertion was run at execution time but is not a committed test | `node -e` assertion from 04-02 Task 1 (grep for `output: 'export'`, `localStorage`, `/map`, `/level/`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm run verify`, `deploy.yml`, `upload-pages-artifact`, `WR-04`, `IN-03`) |
| NFR-2 marked satisfied with Phase-4 evidence in `REQUIREMENTS.md` | NFR-2 | Docs/status flip; not a runtime behavior | Inspect `.planning/REQUIREMENTS.md` NFR-2 block — `✓` marker + Phase-4 evidence note citing tsc/vitest/build/`npm run verify` |
| `STATE.md` / `PROJECT.md` record the Phase-4 certification | NFR-2 | Docs-only; no runtime behavior to assert in the suite | Inspect `.planning/STATE.md` `[Phase 04]` bullet + `§Status`; `PROJECT.md` Phase-4 `### Active` items both `- [x]` |
| Live GitHub Pages deployment (upload + deploy-pages) | FR-4 | Only exercisable on a real GitHub-hosted runner; cannot be run locally | Push to `main`; confirm the `Deploy to GitHub Pages` workflow succeeds and the site resolves under `/<repo>/` |

*Manual-only items are documentation artifacts or live-CI-only behaviors; all phase
runtime behaviors (verifier semantics, workflow contracts) have automated verification.*

---

## Nyquist Gap Closure (auditor, 2026-11-05)

Requirement → verification map for the phase's requirements, built from the artifacts
(no pre-existing `VALIDATION.md`):

| Requirement | Classification | Automated verification (actual) | Notes |
|-------------|----------------|--------------------------------|-------|
| **NFR-2** (quality & type safety) | **COVERED** | `scripts/verify-project.js` is the automated certification gate (`npm run verify`). Auditor added 10 behavioral tests driving it as a subprocess: absent-`out/` refusal, empty-slug-set refusal, unreadable-`levels.ts` fallback, missing level route (named), missing `/map`, missing `/`, missing bundled media, slug-derivation correctness, real-tree PASS (exit 0), and D-12 no-build. | The verifier's refuse-loudly + inspection paths had **no automated test** before this audit (they sat outside the Vitest glob). Now covered. The real `tsc`/`vitest` gates are themselves covered by the normal suite + CI. |
| **FR-1** (kids game as primary experience) | **COVERED** | `out/index.html` (root `/`) asserted by the real-tree integration test; `/map` asserted via missing-`/map` behavioral test + `mapLink` href `/map` in `level-locale.test.tsx`; all 19 `/level/<slug>/` routes asserted by the real-tree PASS (19/19) **and** `generateStaticParams` test (`expect(slugs).toHaveLength(19)`). | Route model is machine-checked both at build-artifact level and at `generateStaticParams` level. |
| **FR-4** (GitHub Pages static deployment) | **COVERED** | Build → static bundle asserted by verify's `out/` inspection; deploy workflow behavior asserted by 8 new structural tests in `src/__tests__/scripts/workflows.test.ts` (build step present, `upload-pages-artifact` with `path: ./out`, `NEXT_PUBLIC_BASE_PATH` derived from repo name, `deploy-pages` + `github-pages` environment + least-privilege perms, upload-after-build ordering). | Was **PARTIAL** (deploy.yml content unasserted) → closed by the workflow tests. Live deployment remains manual. |

### `scripts/verify-project.js` behaviors: before → after

| Behavior | Pre-audit automated test | Post-audit |
|----------|--------------------------|------------|
| Refuse loudly on absent `out/` (exit 1, loud message) | ❌ none | ✅ `verify-project.test.ts` |
| Refuse loudly on empty derived slug set (exit 1) | ❌ none | ✅ `verify-project.test.ts` |
| Refuse when `levels.ts` missing (empty-set fallback) | ❌ none | ✅ `verify-project.test.ts` |
| Detect missing level route (by slug) | ❌ none | ✅ `verify-project.test.ts` |
| Detect missing `/map`, `/`, bundled media | ❌ none | ✅ `verify-project.test.ts` |
| Derive slugs from `levels.ts` (not hard-coded) | ❌ none | ✅ `verify-project.test.ts` |
| PASS + exit 0 against the real built tree | ⚠️ only manually probed in 04-01 | ✅ `verify-project.test.ts` (integration) |
| Does NOT run `npm run build` (D-12) | ❌ none | ✅ `verify-project.test.ts` (mutation-confirmed: a script that adds `npm run build` fails the test) |

*No implementation bugs found. No MISSING requirement remains. `scripts/verify-project.js`
was treated as read-only and not modified.*

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies (docs-only tasks 04-02-01..03 use inline `node -e` assertions; runtime tasks have committed tests)
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (the two new spec files cover the previously-uncovered verifier + workflow behaviors)
- [x] No watch-mode flags (`vitest run`, not `vitest`)
- [x] Feedback latency < 20s (full suite ~15s)
- [ ] `nyquist_compliant: true` set in frontmatter — **not set**: 4 docs/live-CI behaviors remain manual-only (see Manual-Only table)

**Approval:** approved 2026-11-05 (auditor; 2 test files added, 112/112 green)