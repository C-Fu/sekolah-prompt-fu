---
phase: "3"
slug: "bahasa-melayu-ms-localization"
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-11-05"
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^2.1.8 + @testing-library/react ^16.1.0 (jsdom ^25) |
| **Config file** | `vitest.config.ts` (+ `vitest.setup.ts`) |
| **Quick run command** | `npx vitest run src/__tests__/kids/level-locale.test.tsx src/__tests__/kids/settings-locale.test.tsx` |
| **Full suite command** | `npm run test` (baseline: 89/89 pass) |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run` (fast subset or full) — target < 30s
- **After every plan wave:** Run `npx tsc --noEmit && npm run lint && npm run test && node scripts/check-translations.js`
- **Before `/gsd-verify-work`:** Full suite green + `npm run build` succeeds + `out/` contains ms level routes
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 1 | FR-3a | — | N/A | unit/integration | `npx vitest run src/__tests__/kids/settings-locale.test.tsx` | ❌ W0 | ⬜ pending |
| 3-02-01 | 02 | 1 | FR-3b | — | N/A | static check | `node scripts/check-translations.js` | ✓ (ms.json ❌ W0) | ⬜ pending |
| 3-02-02 | 02 | 1 | FR-3b | — | N/A | unit | `npx vitest run src/__tests__/kids/level-locale.test.tsx` | ❌ W0 | ⬜ pending |
| 3-03-01 | 03 | 2 | FR-3c | — | N/A | unit | `npx vitest run src/__tests__/kids/level-locale.test.tsx` | ❌ W0 | ⬜ pending |
| 3-03-02 | 03 | 2 | FR-3d | — | N/A | unit | `npx vitest run src/__tests__/kids/level-locale.test.tsx` | ❌ W0 | ⬜ pending |
| 3-04-01 | 04 | 3 | FR-3e | — | N/A | build | `npm run build` | ✓ (invoked) | ⬜ pending |
| 3-04-02 | 04 | 3 | NFR-2 | — | N/A | gate | `npx tsc --noEmit && npm run lint && npm run test` | ✓ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/kids/level-locale.test.tsx` — add `ms` selection + message-bundle cases (covers FR-3c, FR-3d)
- [ ] `src/__tests__/kids/settings-locale.test.tsx` — add `ms` button activation case (covers FR-3a)
- [ ] `messages/ms.json` — the parity check (`scripts/check-translations.js`) needs the file to exist (FR-3b)
- [ ] Framework install: none — existing infrastructure covers the rest

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Translation naturalness / kid-appropriate register | FR-3b, FR-3c | Machine checks verify key parity, not linguistic quality | Read `messages/ms.json` and 2–3 localized MDX levels; confirm Bahasa Melayu reads naturally for young learners and terminology is consistent |

*All other phase behaviors have automated verification.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending