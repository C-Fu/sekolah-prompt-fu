---
phase: "16"
slug: "proportional-reduced-motion-safe-game-feel"
status: draft
created: "2026-11-16"
---

# Phase 16 — Validation Strategy

> Validation criteria and test architecture for Phase 16 (FEEL-01, FEEL-02, FEEL-03).

## Automated Test Suites

1. **Reduced Motion & Global Animation Control:**
   - Verify `@media (prefers-reduced-motion: reduce)` rules disable or neutralize heavy animations.
   - Verify `useReducedMotion()` hook responds correctly to media query changes and matches SSR default.

2. **Immediate & Non-Blocking Feedback:**
   - Verify interactive buttons and lesson options provide immediate visual/state feedback upon selection.
   - Verify error/retry states retain input operability without artificial delays.
   - Verify answers announce status via `aria-live` or accessible text badges.

3. **Celebration & Rocket Launch Non-Blocking Flow:**
   - Verify `RocketLaunchOverlay` renders an immediate "Skip" button.
   - Verify under `prefers-reduced-motion: reduce`, the countdown is bypassed or static graduation card is shown immediately.
   - Verify `LevelComplete` confetti does not block clicks on Next / Return to Map buttons.

4. **Multi-Sensory Parity (Non-Color Alone):**
   - Verify all feedback states display shape/icon + text label + color.
   - Verify muting audio or unhandled audio playback does not block lesson completion.

## Verification Commands
```bash
npm test -- src/__tests__/kids/game-feel.test.tsx
npm run build
npm run verify
```
