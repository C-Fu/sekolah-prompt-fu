---
phase: "15"
slug: "mobile-first-responsive-accessibility"
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-11-09"
---

# Phase 15 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. This is a plan-time strategy, not evidence of implementation or browser sign-off.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Existing Vitest 2 + jsdom + Testing Library for semantics; required Chrome desktop rendered acceptance (user confirmed Chrome desktop and Playwright available to them, not locally installed or already run) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm test -- src/__tests__/kids/home-navigation.test.tsx src/__tests__/kids/header-navigation.test.tsx src/__tests__/kids/planetary-explorer.test.tsx src/__tests__/kids/planetary-hud.test.tsx` (existing tests; add new targeted lesson tests during execution) |
| **Full suite command** | `npm run verify -- --gates-only`; static-export gate: `npm run build && npm run verify` (verify does not build) |
| **Estimated runtime** | Measure during execution; do not infer from jsdom-only runs that visual checks passed |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- <changed kids test file(s)>`; run the quick command above when navigation/planetary paths change.
- **After every plan wave:** Run `npm run verify -- --gates-only` and a rendered viewport review after layout waves.
- **Before `/gsd-verify-work`:** Run `npm run build && npm run verify` plus the required Chrome desktop BM/EN keyboard/touch matrix; missing/failed rendered evidence prevents Phase 15 sign-off even with green automation.
- **Max feedback latency:** Target under 60 seconds for focused tests; capture actual runtime during execution.

---

## Per-Task Verification Map

Plan/task IDs and waves will be assigned by the planner; executor must update this map without claiming tests exist before they are written.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD (title/map reflow) | TBD | TBD | A11Y-01, A11Y-02 | — | Preserve navigation and saved progress | DOM + browser | `npm test -- src/__tests__/kids/home-navigation.test.tsx src/__tests__/kids/header-navigation.test.tsx` | ✅ existing tests; visual checkpoint pending | ⬜ pending |
| TBD (planetary text path) | TBD | TBD | A11Y-01, A11Y-03 | TBD | Use existing route resolver, no arbitrary selected-text URL | DOM + browser | `npm test -- src/__tests__/kids/planetary-explorer.test.tsx src/__tests__/kids/planetary-hud.test.tsx` | ✅ partial; new fallback assertions pending | ⬜ pending |
| TBD (lesson selection and feedback) | TBD | TBD | A11Y-02, A11Y-03, A11Y-04 | TBD | Preserve scoped completion and retry | integration + browser | `npm test -- src/__tests__/kids/level-locale.test.tsx` | ✅ partial; new activity assertions pending | ⬜ pending |
| TBD (static export and visual sign-off) | TBD | TBD | A11Y-01, A11Y-02, A11Y-04 | — | No new backend | build + browser | `npm run build && npm run verify` | ✅ scripts; rendered checkpoint pending | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky. This map is seeded from research and must be reconciled with final PLAN.md tasks.*

---

## Wave 0 Requirements

- [ ] Add keyboard/touch item-then-destination assertions for `MagicWords` and `DragDropPrompt`, covering wrong placement, retry, duplicate words, saved state and scoped completion.
- [ ] Extend planetary integration assertions for absent/delayed WebGL, focus, BM/EN region names, detail and mission parity.
- [ ] Extend lesson footer/feedback tests for locked reason, non-bypass and visible/announced status.
- [ ] Execute the blocking Chrome desktop rendered gate in Plan 15-09 (trusted Playwright runner if accessible, otherwise user-run Chrome responsive emulation with returned evidence); do not install a browser dependency without audit or treat jsdom as visual evidence. User-confirmed availability is not evidence.

Existing infrastructure covers test running; these are coverage gaps rather than requests to install a framework.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|-------------------|
| No clipped controls/page overflow; local map scroll; short footer clearance with BM and EN | A11Y-01 | jsdom does not render geometry | In Chrome desktop at 320×568, 375×667, 667×375, 1280×800 and 200% zoom inspect title, map, planetary/cartography, section footer and every modified lesson family named below in both locales. Record route, viewport, Chrome version, measurements, screenshots/observations and failures. |
| Comfort-sized targets and visible focus, pressed, hover and disabled states | A11Y-02 | Requires computed hit rectangles and rendered state | Measure ≥44×44 CSS px primary target rectangles and local overflow; Tab and pointer/touch through all screens and nine lesson families, inspect focus visibility and occlusion on actual art. |
| Full keyboard/touch journeys without WebGL or drag | A11Y-03 | Browser input and canvas failure need realistic interaction | Disable/fail WebGL; navigate planet → region → mission and traverse each named modified lesson family with Tab/Enter/Space and touch (native or emulated); check focus, status, retry and locked Next. |
| Contrast and non-color/non-motion meaning against themed artwork | A11Y-04 | Requires rendered foreground/background inspection | Check effective colors on actual image/scrim backgrounds for ≥4.5:1 normal text, ≥3:1 large text and interactive focus/boundaries; inspect BM/EN instruction/status, errors and progress without color/sound/motion cues across all named families. |

**Required rendered family census (one actual lesson URL/section per family, every locale/viewport above):** MagicWords (`magic-words.tsx`), DragDropPrompt (`drag-drop-prompt.tsx`), PromptParts (`prompt-parts.tsx`), ExampleMatcher (`example-matcher.tsx`), WordPredictor (`word-predictor.tsx`), PromptVsMistake (`prompt-vs-mistake.tsx`), PromptDoctor (`prompt-doctor.tsx`), PromptLab (`prompt-lab.tsx`) and StepByStep (`step-by-step.tsx`). Record initial/answer/result states, focus, nearby translated status, contrast, hit rectangles and overflow for each. Preserve the 34 E1–E5 UI-state considerations; inspect relevant empty/loading/error/partial/overflow/long-text examples on title, map, planet, lesson and footer. No family may be represented by another family's measurements.

If the executor cannot access a trusted Playwright runner or Chrome, hand off app URL and matrix for the user's confirmed Chrome desktop; record rows as **unverified** and pause/ escalate until evidence arrives. Failed rows require correction and rerun. Neither status permits Task 15-09-2 or Phase 15 sign-off; the Plan 15-09 blocking-human checkpoint requires explicit corroboration, never auto-approval. No formal WCAG certification is implied.

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency measured against target
- [ ] Passing Chrome rendered evidence captured across both locales, all five viewport conditions, all nine lesson families and other phase surfaces; no failed/unverified row remains
- [ ] Blocking-human verification gate in 15-09 explicitly approved on that evidence
- [ ] `nyquist_compliant: true` set in frontmatter only after validation

**Approval:** pending
