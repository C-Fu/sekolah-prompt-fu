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
| 14-01-01 | 01 | 1 | CLAR-01, CLAR-02 | T-14-01 | Exactly two welcome steps; equal visible /map and /planets choices with complete BM/EN copy | component | `npm test -- src/__tests__/kids/home-navigation.test.tsx` | ✅ extend | ⬜ pending |
| 14-01-02 | 01 | 1 | CLAR-01, CLAR-02 | T-14-01 | Back/Next boundary states and both locale bundles remain complete with no third step | component | `npm test -- src/__tests__/kids/home-navigation.test.tsx` | ✅ extend | ⬜ pending |
| 14-02-01 | 02 | 2 | CLAR-01, CLAR-02 | T-14-02 | Shared desktop/mobile nav has visible localized labels and unchanged internal routes | component | `npm test -- src/__tests__/kids/header-navigation.test.tsx` | ✅ extend | ⬜ pending |
| 14-02-02 | 02 | 2 | CLAR-01, CLAR-02 | T-14-02 | Earth map and planetary controls expose labeled locations/actions and resilient media states | component | `npm test -- src/__tests__/kids/planetary-hud.test.tsx src/__tests__/kids/planetary-explorer.test.tsx` | ✅ extend | ⬜ pending |
| 14-03-01 | 03 | 3 | CLAR-01, CLAR-02 | T-14-03 | Map and planet tips dismiss independently, persist separately, localize, and fail safely | component/storage | `npm test -- src/__tests__/kids/journey-tips.test.tsx` | ❌ create in 14-03-01 | ⬜ pending |
| 14-03-02 | 03 | 3 | CLAR-01, CLAR-02 | T-14-03 | Tips are correctly localized, non-obstructive, and do not mutate learning progress | component/storage | `npm test -- src/__tests__/kids/journey-tips.test.tsx` | ❌ create in 14-03-01 | ⬜ pending |
| 14-04-01 | 04 | 4 | CLAR-03 | T-14-04 | Only map/planets enum resolves; direct/invalid/query-hostile values fall back to /map | unit | `npm test -- src/__tests__/kids/lesson-origin.test.ts` | ❌ add | ⬜ pending |
| 14-04-02 | 04 | 4 | CLAR-03 | T-14-04 | Both hubs add only allowlisted origin while preserving lesson pathname and progress | component/integration | `npm test -- src/__tests__/kids/lesson-origin.test.ts src/__tests__/kids/planetary-explorer.test.tsx` | ✅ extend | ⬜ pending |
| 14-05-01 | 05 | 5 | CLAR-03 | T-14-05 | Footer/error/unavailable returns respect origin and direct/invalid fallback in both locales | component | `npm test -- src/__tests__/kids/level-locale.test.tsx` | ✅ extend | ⬜ pending |
| 14-05-02 | 05 | 5 | CLAR-03 | T-14-05 | Completion return and next-lesson progression retain origin; navigation preserves saved stars | component/integration | `npm test -- src/__tests__/kids/level-complete.test.tsx` | ✅ extend | ⬜ pending |
| 14-06-01 | 06 | 1 | CLAR-01, CLAR-02 | T-14-06 | All world 1 sections have specific ordered BM/EN title sources | unit/content | `npm test -- src/__tests__/kids/section-titles.test.ts` | ❌ create in 14-06-01 | ⬜ pending |
| 14-06-02 | 06 | 1 | CLAR-01, CLAR-02 | T-14-06 | World 1–3 title source is complete, ordered, locale-specific, and has no fallback | unit/content | `npm test -- src/__tests__/kids/section-titles.test.ts` | ❌ create in 14-06-01 | ⬜ pending |
| 14-07-01 | 07 | 1 | CLAR-02 | T-14-07 | Typography specimen includes all named candidates/locales/viewports and has no remote font or app imports | artifact/content | `node .planning/phases/14-journey-clarity-shared-interaction-language/validate-typography-comparison.mjs --specimen` | ❌ create in 14-07-01 | ⬜ pending |
| 14-07-02 | 07 | 1 | CLAR-02 | T-14-07 | Report records asset, glyph/punctuation, narrow/wide, fallback/static-export and evidence/approval status; narrow/wide screenshots exist; appearance review is not child-reading evidence | artifact/content + visual review | `node .planning/phases/14-journey-clarity-shared-interaction-language/validate-typography-comparison.mjs --complete` | ❌ create in 14-07-01 | ⬜ pending |
| 14-08-01 | 08 | 2 | CLAR-01, CLAR-02 | T-14-08 | World 4–5 lesson sections have complete specific BM/EN title coverage and parity | unit/content | `npm test -- src/__tests__/kids/section-titles.test.ts` | ❌ absent at HEAD; created by 14-06 | ⬜ pending |
| 14-08-02 | 08 | 2 | CLAR-01, CLAR-02 | T-14-08 | All 23 lessons have complete ordered titles in BM/EN with invalid-selector coverage | unit/content | `npm test -- src/__tests__/kids/section-titles.test.ts` | ❌ absent at HEAD; created by 14-06 | ⬜ pending |
| 14-09-01 | 09 | 6 | CLAR-01, CLAR-02 | T-14-09 | Rendered lesson identity, active localized section title, and ordinal follow index/locale | component | `npm test -- src/__tests__/kids/level-locale.test.tsx` | ✅ extend | ⬜ pending |
| 14-09-02 | 09 | 6 | CLAR-01, CLAR-02 | T-14-09 | Locked Next stays visible with bilingual reason; existing completion gate enables it | component | `npm test -- src/__tests__/kids/level-locale.test.tsx` | ✅ extend | ⬜ pending |

---

## Test Scaffolds Included in Planned Tasks

- [ ] Plan 04 Task 1 creates origin-parser assertions and Task 2 adds hub-entry assertions; Plan 05 extends footer/error/unavailable/completion and cross-lesson return assertions.
- [ ] Plan 03 Task 1 creates first-visit, independent dismissal, persistence, malformed/storage-failure and progress-isolation tests; Task 2 adds locale/integration assertions.
- [ ] Plans 01–03 and 05/09 extend BM/EN assertions for title, nav, tip, return, section-title/position, and disabled-next copy.
- [ ] Plan 06 Task 1 creates the section-title corpus test; its second task and Plan 08 extend coverage until all 23 lesson slugs and each rendered section have explicit localized title sources. Plan 08 depends on Plan 06, so it consumes that created test file.
- [ ] Plan 07 creates the executable content-aware artifact validator; `--specimen` checks candidate/local-only/BM-EN/viewport/specimen and required report sections, while `--complete` checks mandatory asset, glyph/punctuation, narrow/wide, fallback/static-export, evidence status/source, font outcome, explicit approval/approver fields, both viewport screenshots, and contradiction-free Schoolbell retention. Its human appearance review records glyph/wrapping observations only and is not child-reading evidence.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual clarity and non-obstructive tips across title, Earth map, planetary hub/cartography and lesson | CLAR-01 | Child-facing hierarchy and overlay fit require viewport review | Build static export; inspect BM and EN at desktop and narrow viewport; verify both destination cards have equal prominence and tips do not cover controls. |
| Progress survives navigation and reload | CLAR-03 | Validate real browser storage behavior across route transitions | Complete a lesson section, navigate to the originating hub, reload, and confirm saved stars/completion remain unchanged. |

---

## Validation Sign-Off

- [ ] All tasks have an `<automated>` verify; tests/scaffolds are created by their own planned tasks or available through declared plan dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] No task depends on an unplanned Wave 0 test scaffold; created test files are provided by listed tasks and explicit plan dependencies
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s focused
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
