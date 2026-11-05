# Phase 4: Verification, Testing & Polish - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-11-05
**Phase:** 4-Verification, Testing & Polish
**Areas discussed:** Verification depth & evidence, Onboarding summary / handoff, Polish scope, CI / quality-gate enforcement

---

## Verification depth & evidence

### Q1 — How rigorous should Phase 4's verification be?

| Option | Description | Selected |
|--------|-------------|----------|
| Re-run gates + capture exit codes | Run tsc/lint/tests/build, confirm exit codes, count tests, confirm `out/` routes. Fast and repeatable. | ✓ |
| Independent must-have reproduction (Phase 3 style) | Independently reproduce each NFR-2 claim with full evidence. Slower but defensible. | |
| Gates + targeted artifact checks | Hybrid: gate run plus targeted checks on the emitted bundle. | |

**User's choice:** Re-run gates + capture exit codes
**Notes:** Matches "certify NFR-2" literally; keeps the phase bounded.

### Q2 — Which gates exactly must pass for NFR-2 certification?

| Option | Description | Selected |
|--------|-------------|----------|
| tsc + tests + build | Exactly what PROJECT.md/ROADMAP lists. No additions. | ✓ |
| Add lint + guard scripts | Adds lint and both guard scripts to the certified set. | |
| Everything runnable | tsc, lint, tests, build, both guards, and lint:mdx. | |

**User's choice:** tsc + tests + build
**Notes:** Keeps the NFR-2 claim bounded and honest.

### Q3 — Should verification inspect the emitted `out/` artifact?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — count routes + confirm assets | Confirm 19 level routes + `/` + `/map` + bundled music. | ✓ |
| No — exit code is enough | A successful build is sufficient. | |

**User's choice:** Yes — count routes + confirm assets
**Notes:** Matches Phase 2's "25 pages" claim and supports FR-1/FR-4.

### Q4 — What should the verification output be?

| Option | Description | Selected |
|--------|-------------|----------|
| Verdict report with captured evidence | Plain markdown report, no automation. | |
| Rerunnable verification script | Committed script that runs all gates and prints PASS/FAIL. | ✓ |
| Both script + report | Committed script that produces a report file. | |

**User's choice:** Rerunnable verification script
**Notes:** Reproducible certification; future sessions re-certify with one command.

---

## Onboarding summary / handoff

### Q1 — What form should the handoff take?

| Option | Description | Selected |
|--------|-------------|----------|
| One HANDOFF.md | Single markdown file discoverable by humans and agents. | ✓ |
| Split docs by audience | Separate `.planning/ONBOARDING.md` and a README section. | |
| Extend README.md | Add a "Project status & handoff" section to the existing README. | |

**User's choice:** One HANDOFF.md
**Notes:** Single canonical entry point.

### Q2 — What content must the handoff cover?

| Option | Description | Selected |
|--------|-------------|----------|
| Architecture + gates + deploy + open advisories | The four required content areas. | ✓ |
| Minimal run/deploy guide | Just build/run/deploy and where things live. | |
| Comprehensive with history | Above plus per-phase changelog and rationale digest. | |

**User's choice:** Architecture + gates + deploy + open advisories
**Notes:** None.

### Q3 — Where should HANDOFF.md live?

| Option | Description | Selected |
|--------|-------------|----------|
| Repo root | Next to README.md, most discoverable. | |
| `.planning/` | Co-located with lifecycle artifacts, keeps root clean. | ✓ |

**User's choice:** `.planning/`
**Notes:** None.

### Q4 — How should the handoff treat the open advisory at 03-REVIEW-DISPOSITION.md?

| Option | Description | Selected |
|--------|-------------|----------|
| List as known non-blocking issues | Cite WR-04 / IN-03 as known, tracked, non-blocking. | ✓ |
| Omit advisories | Keep handoff focused on what works. | |
| List + remediation guidance | Add short remediation descriptions for each. | |

**User's choice:** List as known non-blocking issues
**Notes:** Visible for the next owner without acting on them here.

---

## Polish scope (what 'polish' includes)

### Q1 — What does 'polish' mean for Phase 4 — where's the boundary?

| Option | Description | Selected |
|--------|-------------|----------|
| Verification + docs only | No open-ended polish; advisories stay logged but unfixed. | ✓ |
| Include the guard fixes | Also fix the check-ms-vocabulary.js advisory items. | |
| Open-ended polish pass | Actively hunt and fix polish issues with no pre-defined list. | |

**User's choice:** Verification + docs only
**Notes:** Keeps scope tight and honest; remaining advisories go to a future phase.

### Q2 — If verification surfaces a failure, does Phase 4 fix it or just report it?

| Option | Description | Selected |
|--------|-------------|----------|
| Fix regressions only | Fix real gate failures; new features still out of scope. | ✓ |
| Report only, never fix | Failures go to a new phase or /gsd-debug. | |

**User's choice:** Fix regressions only
**Notes:** Fixing a broken gate is the point of a verification phase.

---

## CI / quality-gate enforcement

### Q1 — Should Phase 4 harden the CI pipeline?

| Option | Description | Selected |
|--------|-------------|----------|
| Add tsc to ci.yml | Add `npx tsc --noEmit` so type errors fail before merge. | ✓ |
| Leave CI alone | CI hardening belongs in a future phase. | |
| Harden both ci.yml and deploy.yml | Also gate deploy on lint + tests. | |

**User's choice:** Add tsc to ci.yml
**Notes:** `deploy.yml` left untouched.

### Q2 — Should ci.yml invoke the new verification script, or keep gates as separate steps?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — invoke the verify script | CI and local certification use the identical gate set. | ✓ |
| No — keep steps separate | The verify script is for local/manual use only. | |

**User's choice:** Yes — invoke the verify script
**Notes:** Single source of truth for the certified gates.

### Q3 — Should the verification script include the static build, and be exposed as an npm script?

| Option | Description | Selected |
|--------|-------------|----------|
| Add `npm run verify`, build stays in deploy | Verify script excludes build; exposed as `npm run verify`. | ✓ |
| verify includes build | Script runs the build too; CI would build twice. | |

**User's choice:** Add npm run verify, build stays in deploy
**Notes:** Avoids double-building in CI.

---

## the agent's Discretion

- Exact filename and internal structure of the verification script (`scripts/verify-*.js`), following the existing Node-stdlib guard-script style.
- Exact section ordering and depth of `.planning/HANDOFF.md`, provided the four required content areas are covered.
- Whether the verification script emits a machine-readable summary block.

## Deferred Ideas

- Fix WR-04 — `settings-modal.tsx` hard-codes a locale list drifted from `supportedLocales` (future phase).
- Fix IN-03 — duplicated locale literal arrays in `prompts.config.ts` / `src/lib/i18n/config.ts` (future refactor phase).
- Harden `deploy.yml` with lint/test/tsc gates (explicitly declined for Phase 4).
- Open-ended polish pass (dead code, stale references, UI rough edges) — declined.