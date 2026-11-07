# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Kids Prompting Game Standalone & GitHub Pages

**Shipped:** 2026-11-07
**Phases:** 4 | **Plans:** 27 (51 tasks) | **Sessions:** ~5

### What Was Built
- **Standalone kids app** — purged Prisma/NextAuth, non-kids routes and component families, community datasets and legacy assets; npm lockfile cut from 1,492 → 826 packages (Phase 1, 17 plans).
- **Kids game at the root** (`/`, `/map`, `/level/[slug]`) as a 100% static `out/` export with a GitHub Pages deploy workflow and locally-bundled music (Phase 2).
- **Complete Bahasa Melayu localization** — 212-key `messages/ms.json` + all 19 interactive MDX levels localized with no silent English fallback (Phase 3, 6 plans incl. 2 gap-closure waves).
- **NFR-2 certified end-to-end** — committed `scripts/verify-project.js` (`npm run verify`) re-runs tsc + Vitest and inspects `out/`; CI enforces the same gates via `--gates-only` with a bounded gate timeout (Phase 4, incl. the 04-03 gap closure).
- **Onboarding handoff** (`.planning/HANDOFF.md`), character rename Promi → Peromfu app-wide, base-path-aware icons.

### What Worked
- **Deletion-first, import-closure-guarded pruning** — an import-closure checker let Phase 1 delete ~1M lines across 17 plans while guaranteeing the retained kids game kept compiling.
- **Gap-closure waves** — Phase 3 (Waves 5-6) and Phase 4 (plan 04-03) closed UAT/code-review gaps as explicit, bounded plans rather than ad-hoc patches.
- **Certification-as-code** — `npm run verify` made NFR-2 a rerunnable, reproducible gate instead of a one-off manual claim.
- **Independent milestone audit** caught stale/dormant artifacts (the Phase-1 import-closure guard) before close.

### What Was Inefficient
- **Stale verification reports** — the external Peromfu rename invalidated Phase 4's covered-input digest mid-close, forcing a verifier re-run (`stale` → regenerate).
- **Doc/count drift** — HANDOFF/REQUIREMENTS/STATE cited 94/94 tests while the suite had grown to 119/119.
- **Phases 1-2 left no on-disk VERIFICATION.md**, making the readiness check read `stale`/absent and requiring an audit to establish real coverage.
- **A post-close `04.1` phase stub was inserted** (unplanned tech debt) right before archiving, so it shipped inside the v1.0 bucket.

### Patterns Established
- Certification scripts (`scripts/verify-project.js`) with `--gates-only` for CI + full mode for release.
- UAT items persisted to `*-UAT.md` and canonicalized after passing.
- Milestone close = audit (`tech_debt` acceptable) → archive → ROADMAP collapse → PROJECT.md evolution → tag.
- Vocabulary guards (`check-ms-vocabulary.js`) and import-closure guards as committed, self-failing checks.

### Key Lessons
1. **Verify against the current tree, not the last report** — any external commit touching covered files silently stales a verification; re-run the fingerprint before trusting it.
2. **Wire guards into CI or they rot** — committed but un-wired guard scripts (`check-ms-vocabulary.js`, `check-kids-import-closure.js`) drift and become WARNINGs at audit time.
3. **Define the test-count/gate docs as generated or single-sourced** — prose counts (94 vs 119) drift immediately after milestone edits.
4. **Archive tooling copies, it does not delete** — `reorganize_roadmap_and_delete_originals` must explicitly `git rm` REQUIREMENTS.md and collapse ROADMAP.md.

### Cost Observations
- Model mix: advisory/verification gates ran on a substitute model (`anthropic/claude-sonnet-5` unavailable in this env → `kd/gpt-6-sol`); execution on the default agent.
- Sessions: ~5 (init → phase execution → UAT/verify → complete-milestone close).
- Notable: the heavy win was Phase 1's deletion volume (~1M lines removed) done safely via an import-closure invariant.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | ~5 | 4 | First milestone: purge → promote → localize → certify; introduced certification-as-code + independent audit |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | 119 | n/a (targeted unit + UAT) | 0 (net-negative deps: −666 packages) |

### Top Lessons (Verified Across Milestones)

1. Verify against the current tree; re-fingerprint after any external change.
2. Guards must be wired into CI to stay honest.