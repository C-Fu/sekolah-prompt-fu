# Phase 16: Proportional, Reduced-Motion-Safe Game Feel - Context

**Phase Goal:** Meaningful selections, answers, progress changes, and completion give learners quick, satisfying feedback without blocking input or excluding learners who disable motion or sound.

## Requirements
- **FEEL-01**: Meaningful selections, lesson answers, progress changes, and completion events provide immediate visual feedback that distinguishes success, error, and neutral states.
- **FEEL-02**: High-value progress and completion moments use short, purposeful motion/audio feedback that is proportional, does not block input, and respects reduced-motion preferences.
- **FEEL-03**: Interaction feedback remains understandable when animation or sound is unavailable or disabled and does not rely on color alone.

## Locked Decisions & Guidelines
1. **Design System & UI Contract:** Built on `16-UI-SPEC.md` and Phase 14/15 foundations.
2. **Reduced Motion (`prefers-reduced-motion: reduce`):** 
   - No forced waits, infinite pulsing, bouncing, or sliding transforms when reduced motion is preferred.
   - Micro-transitions default to 0s or instantaneous opacity shifts.
   - RocketLaunchOverlay must provide an immediate bypass/skip or render as a static celebration card.
3. **Sound & Audio Fallback:**
   - Background music and audio cues must be strictly optional and non-blocking.
   - Autoplay denial, missing audio codecs, or muted preferences must never impede completion or progress.
   - Feedback must never depend on audio alone.
4. **Visual & Status Feedback:**
   - Feedback states must use shape/icon + text + color (never color alone).
   - Answer evaluations must be immediate, non-blocking, and polite (`aria-live="polite"`).
   - Retry affordances must remain active immediately without arbitrary countdown locks.
5. **Static Export & Zero Backend:** Pure client-side Next.js static export compliance must be maintained.
