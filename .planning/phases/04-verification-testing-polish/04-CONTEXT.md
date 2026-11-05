# Phase 4: Verification, Testing & Polish - Context

**Gathered:** 2026-11-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 4 is the final end-to-end quality pass for the standalone kids prompting game. It delivers three things and nothing more:

1. **NFR-2 certification** — the quality stack (`npx tsc --noEmit`, the Vitest suite, and `npm run build` static export) passes cleanly and is captured as reproducible evidence.
2. **A rerunnable verification script** — a committed script that runs the certified gates and prints a PASS/FAIL verdict, so any future session can re-certify with one command.
3. **An onboarding summary / handoff** at `.planning/HANDOFF.md` covering architecture recap, gate commands, deploy process, and known non-blocking advisories.

Plus one bounded infrastructure hardening: `npx tsc --noEmit` is added to `.github/workflows/ci.yml`, and CI invokes the committed verification script via a new `npm run verify` script.

**Scope guardrail:** This is a verification + documentation phase. It clarifies HOW we verify and hand off — it does NOT add capabilities, features, or fix pre-existing advisory findings. If a certified gate actually fails during verification, Phase 4 fixes that regression (the point of a verification phase); new capabilities and non-regression polish are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Verification Depth & Evidence
- **D-01:** Verification rigor = **re-run the gates and capture exit codes**, not independent must-have reproduction (Phase 3 style). Run the three gates, confirm exit codes, count tests, confirm the emitted route count. Fast, repeatable, and matches "certify NFR-2" literally.
- **D-02:** The certified gate set is exactly the three gates from PROJECT.md / ROADMAP: `npx tsc --noEmit`, the Vitest suite (`npm test` → `vitest run`), and `npm run build` (static export). Do NOT expand the certified set to lint, `lint:mdx`, or the guard scripts (`check-ms-vocabulary.js`, `check-kids-import-closure.js`) — keeps the claim bounded and honest. (Note: `lint:ms` + guard wiring already exist from Phase 3's CR-01/WR-02 resolution; Phase 4 does not need to re-certify them.)
- **D-03:** Verification DOES inspect the emitted `out/` artifact — confirm the 19 level routes (one `index.html` per registered slug) plus `/` and `/map`, and confirm bundled assets (e.g. `kids-music.mp3`). Matches Phase 2's "25 pages" claim and supports FR-1 / FR-4.
- **D-04:** Verification output is a **rerunnable verification script** (e.g. `scripts/verify-*.js`, Node stdlib), committed to the repo, that runs the three gates and prints PASS/FAIL. Not a hand-written report-only verdict. The script is the source of truth for certification.

### Onboarding Summary / Handoff
- **D-05:** Handoff form = **one file**, `HANDOFF.md`, located in **`.planning/`** (co-located with the other lifecycle artifacts; keeps repo root clean).
- **D-06:** HANDOFF.md must cover: architecture recap (static-first, `output: 'export'`, client-only `localStorage` persistence, root routes `/`, `/map`, `/level/[slug]`), gate commands (tsc / tests / build / `npm run verify`), the GitHub Pages deploy process (`deploy.yml`), and the known non-blocking advisories.
- **D-07:** Open advisories from `03-REVIEW-DISPOSITION.md` are listed in HANDOFF.md as **known, tracked, non-blocking issues** — visible for the next owner without acting on them in Phase 4. (Currently open: WR-04 `settings-modal.tsx` hard-codes a drifted locale list; IN-03 duplicated locale literal arrays in `prompts.config.ts` / `src/lib/i18n/config.ts`. The CR-01/CR-02/WR-01/WR-02 guard findings are already `fixed`.)

### Polish Scope (boundary)
- **D-08:** "Polish" for Phase 4 = **verification + docs only**. There is no open-ended polish hunt and no pre-defined fix list. The remaining open advisories (WR-04, IN-03) stay logged but unfixed — they belong to a future phase.
- **D-09:** If verification surfaces a real failure, Phase 4 **fixes the regression** (that is the phase's job). New features or capabilities surfaced during verification are still out of scope and go to deferred ideas.

### CI / Quality-Gate Enforcement
- **D-10:** Add `npx tsc --noEmit` to `.github/workflows/ci.yml` (lint and tests already run there), so type errors fail before merge.
- **D-11:** `ci.yml` invokes the committed verification script (D-04) as a step, so CI and local certification use the identical gate set.
- **D-12:** Expose the verification script as an **`npm run verify`** script. The static build stays out of `npm run verify` and out of `ci.yml` — `deploy.yml` (Node 24, `npm ci`, static build, upload-pages-artifact) owns the build. Increase CI steps without double-building.
- **D-13:** `deploy.yml` is NOT hardened with lint/test/tsc gates in this phase (explicitly declined) — only `ci.yml` is touched.

### the agent's Discretion
- Exact filename and internal structure of the verification script (`scripts/verify-*.js`) — follow the existing Node-stdlib style of `scripts/check-ms-vocabulary.js` / `scripts/check-kids-import-closure.js`.
- Exact section ordering and depth of HANDOFF.md, so long as D-06's four content areas are all present.
- Whether the verification script also prints a machine-readable summary block (nice-to-have, not required).

### Folded Todos
None — `todo.match-phase 4` returned 0 matches.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope & requirements
- `.planning/ROADMAP.md` §"Phase 4: Verification, Testing & Polish" — the four scope bullets (tsc, tests, build + verify `out/`, handoff).
- `.planning/REQUIREMENTS.md` — **NFR-2 (Quality & Type Safety)** is the requirement Phase 4 finally certifies; also FR-1 / FR-4 for the route-count/artifact checks.
- `.planning/PROJECT.md` — vision, key decisions (static-first, client-only persistence), and the Active checklist Phase 4 closes.

### Quality-gate state & prior verification
- `.planning/STATE.md` — Phase 1/2/3 verification summaries; the baseline "tsc 0, lint 0, tests 94/94, build emits `out/`" numbers to reproduce.
- `.planning/phases/03-bahasa-melayu-ms-localization/03-VERIFICATION.md` — the Phase 3 verification report format and the "19 registered slugs" evidence model.
- `.planning/phases/02-promote-kids-game-to-root-configure-static-export/VERIFICATION.md` — the "25 static pages incl. 19 level routes" claim to re-confirm.
- `.planning/phases/03-bahasa-melayu-ms-localization/03-REVIEW-DISPOSITION.md` — open advisory rows (WR-04, IN-03) to list in HANDOFF.md as known non-blocking issues.
- `.planning/phases/03-bahasa-melayu-ms-localization/03-SECURITY.md` — threats_open 0 baseline (no security work in Phase 4).

### Codebase maps (may be stale — mapped pre-Phase-1)
- `.planning/codebase/TESTING.md` — Vitest config, test location (`src/__tests__/**`), run commands.
- `.planning/codebase/CONCERNS.md` — ⚠ stale (mapped 2026-11-04 before the Phase 1 purge; its Prisma/NextAuth/`prompts.csv` concerns no longer apply).

### Live source of truth (read directly — maps are stale)
- `package.json` — scripts (`lint`, `test`, `build`, `lint:mdx`; `npm run verify` will be added), dependency set.
- `.github/workflows/ci.yml` — current CI (lint + test; tsc and verify-script steps to be added).
- `.github/workflows/deploy.yml` — GitHub Pages deploy pipeline (unchanged in this phase).
- `scripts/check-ms-vocabulary.js` — existing Node-stdlib guard; the style template for the new verification script.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/check-ms-vocabulary.js` and `scripts/check-kids-import-closure.js` — existing Node-stdlib, exit-code-based guard scripts. The new verification script should follow this same pattern (deterministic, no external deps, non-zero exit on failure).
- `npm run build` (`next build` with `output: 'export'`) — already emits `out/`; the verification script just needs to invoke it and inspect the result.
- `.github/workflows/ci.yml` — existing lint + test steps; tsc and the verify-script step slot in as additional steps.

### Established Patterns
- **Exit-code gates:** Phase 1–3 established the pattern that quality gates are deterministic scripts returning non-zero on failure (guards, `tsc`, `vitest run`, `next build`). Phase 4's verification script extends this pattern rather than inventing a new one.
- **Static route generation:** `output: 'export'` + `trailingSlash: true` produces directory-index output (`out/level/<slug>/index.html`), which is what makes GitHub Pages clean URLs work and what the route-count check must parse.
- **`NEXT_PUBLIC_BASE_PATH`-driven links:** basePath/assetPrefix are env-driven (empty by default for local builds) — artifact checks must not assume a hard-coded base path.

### Integration Points
- **`package.json` `scripts`** — add `"verify"`. This is the connection point between local certification, CI, and (potentially later) deploy.
- **`.github/workflows/ci.yml`** — add `npx tsc --noEmit` step + verify-script step.
- **`.planning/HANDOFF.md`** — new artifact, no code integration; consumed by humans and future agents.
- **`out/`** — the build artifact the verification script inspects (route count, bundled assets).

</code_context>

<specifics>
## Specific Ideas

- Certified gates are exactly three: `npx tsc --noEmit`, `npm test` (Vitest), `npm run build`. Do not add lint/guards to the certified set even though they exist — keep the NFR-2 claim bounded.
- Verification must confirm the real emitted `out/` tree, not just a zero exit code: 19 level route directories + `/` + `/map` (matching Phase 2's 25-page figure), plus bundled media.
- Verification output is a committed, rerunnable script — not a one-shot report. Exposed as `npm run verify`. The script deliberately excludes `npm run build` (the build stays in `deploy.yml`) so CI does not build twice.
- CI hardening is limited to adding a `tsc --noEmit` step and invoking the verify script in `ci.yml`; `deploy.yml` is untouched.
- HANDOFF.md lives in `.planning/`, not the repo root, and lists WR-04 / IN-03 as known non-blocking advisories rather than fixing them.

</specifics>

<deferred>
## Deferred Ideas

- **Fix `scripts/check-ms-vocabulary.js` open advisory (WR-04)** — `settings-modal.tsx` hard-codes a locale list that has drifted from `supportedLocales`. Belongs in its own phase; NOT Phase 4 scope (D-08).
- **Fix IN-03** — duplicated locale literal arrays across `prompts.config.ts` and `src/lib/i18n/config.ts`. Pre-existing; defer to a future refactor phase.
- **Harden `deploy.yml` with lint/test/tsc gates** — explicitly declined for Phase 4 (D-13); consider if a future phase wants deploy-time gating.
- **Open-ended polish pass** (dead code, stale references, minor UI rough edges) — declined (D-08); Phase 4 does not hunt for polish issues.

### Reviewed Todos (not folded)
None — no todos matched Phase 4.

</deferred>

---

*Phase: 4-Verification, Testing & Polish*
*Context gathered: 2026-11-05*