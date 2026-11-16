# Phase 16: Technical Research & Architecture

**Phase:** 16 - Proportional, Reduced-Motion-Safe Game Feel
**Requirements:** FEEL-01, FEEL-02, FEEL-03

## 1. Domain & Problem Analysis
Sekolah Prompt-Fu is a client-side gamified web application for children learning prompt engineering. In prior phases, functional components, layouts, responsive scaling, and navigation clarity were implemented. However:
1. **Interactive feedback timing and non-blocking interactions:** Many lesson activities (e.g. `MagicWords`, `DragDropPrompt`, `StepByStep`, `PromptDoctor`, `ExampleMatcher`) trigger animations or state transitions, but need consistent immediate tactile cues (e.g. active micro-press <= 100ms, distinct success/error icons + text).
2. **Reduced-Motion compliance:** `src/app/globals.css` and individual components contain CSS keyframe animations (`.animate-bounce`, `.animate-float`, `.animate-pulse`, `.animate-rocket-liftoff`, `.animate-rocket-thrust`). None currently check `prefers-reduced-motion` at the global stylesheet or component level.
3. **Completion overlays and timers:** `RocketLaunchOverlay` uses hard-coded 3-second `setTimeout` countdowns and delays before redirecting. When `prefers-reduced-motion: reduce` is active or when a child desires fast progression, this blocks input. A visible Skip/Proceed button and instant bypass under reduced motion are needed.
4. **Confetti & particles:** `LevelComplete` mounts 15 bouncing confetti DOM nodes with arbitrary delays. Under reduced motion, confetti should be disabled or rendered statically, and must never block interactive buttons (`Next`, `Return to Map`).
5. **Multi-sensory redundancy (non-color-alone):** Feedback borders (e.g. emerald vs rose) must be accompanied by explicit icons (`Check` vs `RotateCcw`) and bilingual text announcements (`aria-live="polite"`).

## 2. Standard Stack & Architectural Patterns
- **Tailwind CSS v4 & `tw-animate-css`:**
  - Leverage `@media (prefers-reduced-motion: reduce)` in `src/app/globals.css` to globally clamp or disable animations, transitions, and transforms (`animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important;`).
  - Provide utility classes / motion-safe variants (e.g., `motion-safe:animate-...`, `motion-reduce:transform-none`).
- **React Hook for Reduced Motion:**
  - Create or use a lightweight `useReducedMotion()` hook relying on `window.matchMedia('(prefers-reduced-motion: reduce)')` with SSR-safe initial value (false).
  - Use in interactive celebration components (`RocketLaunchOverlay`, `LevelComplete`, `PixelArt`) to avoid starting timers or rendering heavy particle trees when reduced motion is preferred.
- **Audio Guardrails:**
  - Ensure all audio events in `background-music.tsx` or new sound triggers gracefully catch `.play()` rejections without unhandled promise errors or UI freezes.
  - Keep sound purely auxiliary; all gameplay critical feedback is visual + text.

## 3. Validation Architecture & Test Strategy
- Unit & integration tests via Vitest / React Testing Library:
  - Mock `window.matchMedia` for `prefers-reduced-motion: reduce`.
  - Verify `RocketLaunchOverlay` offers an immediate Skip action and skips countdown under reduced motion.
  - Verify `LevelComplete` allows immediate navigation without waiting for confetti timer.
  - Verify lesson feedback components display distinct icons and accessible text cues alongside color.
  - Verify static export (`npm run build`) and lint/tests (`npm test`) pass cleanly.
