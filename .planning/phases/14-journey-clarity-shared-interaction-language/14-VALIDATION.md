---
phase: "14"
slug: "journey-clarity-shared-interaction-language"
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-11-09"
---

# Phase 14 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 2.1.8 and React Testing Library 16.1.0 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm test -- <focused test paths>` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~16 seconds focused baseline; confirm after changes |

---

## Sampling Rate

- **After every task commit:** Run the focused affected Vitest file(s)
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Run `npm run build` then `npm run verify`
- **Max feedback latency:** 30 seconds focused; full-suite runtime to be measured

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 14-01-01 | 01 | 1 | CLAR-01, CLAR-02 | — | Both welcome choices are visibly labeled and localized | component | `npm test -- src/__tests__/kids/home-navigation.test.tsx` | ✅ extend | ⬜ pending |
| 14-01-02 | 01 | 1 | CLAR-01, CLAR-02 | — | Shared and hub navigation has visible text labels in BM and EN | component | `npm test -- src/__tests__/kids/header-navigation.test.tsx src/__tests__/kids/planetary-hud.test.tsx` | ✅ extend | ⬜ pending |
| 14-02-01 | 02 | 2 | CLAR-03 | — | Map and planetary lesson origins resolve only to allowlisted return hubs; saved progress remains intact | component/integration | `npm test -- src/__tests__/kids/planetary-explorer.test.tsx src/__tests__/kids/level-locale.test.tsx` | ✅ extend | ⬜ pending |
| 14-02-02 | 02 | 2 | CLAR-01, CLAR-02 | — | Lesson footer shows translated section title/position and visible incomplete guidance | component | `npm test -- src/__tests__/kids/level-locale.test.tsx` | ✅ extend | ⬜ pending |
| 14-03-01 | 03 | 3 | CLAR-01, CLAR-02 | — | Map and planetary first-visit tips dismiss independently and render in both locales | component | `npm test -- src/__tests__/kids/` | ❌ add tip tests | ⬜ pending |

---

## Wave 0 Requirements

- [ ] Add lesson-origin routing assertions for Earth map, planetary hub, direct entry, invalid context, completion and missing-content return paths.
- [ ] Add map and planetary tip first-visit, independent dismissal, persistence and storage-failure tests.
- [ ] Extend BM/EN assertions for new title, nav, tip, section-title/position and disabled-next copy.
- [ ] Extend lesson title coverage so every rendered section has an explicit localized title source.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual clarity and non-obstructive tips across title, Earth map, planetary hub/cartography and lesson | CLAR-01 | Child-facing hierarchy and overlay fit require viewport review | Build static export; inspect BM and EN at desktop and narrow viewport; verify both destination cards have equal prominence and tips do not cover controls. |
| Progress survives navigation and reload | CLAR-03 | Validate real browser storage behavior across route transitions | Complete a lesson section, navigate to the originating hub, reload, and confirm saved stars/completion remain unchanged. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s focused
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
