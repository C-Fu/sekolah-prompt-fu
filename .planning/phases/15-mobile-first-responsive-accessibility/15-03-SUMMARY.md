---
phase: 15-mobile-first-responsive-accessibility
plan: 03
subsystem: kids-ui
tags: [planets, accessibility, responsive, webgl-fallback, telemetry-hud, touch-targets, i18n]
status: complete
requires:
  - phase: 15-mobile-first-responsive-accessibility
    plan: 01
provides:
  - resilient planetary text journey unaffected by missing, slow, or errored WebGL (D-05, D-08)
  - zero-region and partial-feature fallback states in telemetry HUD and province sidebar (E3 empty, E3 partial)
  - unclamped, scroll-safe telemetry card details and >=44x44px touch targets on all HUD controls (D-03, D-04, D-06, D-15)
affects:
  - PlanetaryCanvas WebGL error notification
  - PlanetaryExplorer fallback messaging and route guarding
  - PlanetaryHud responsive layout, scrolling and touch hitboxes
tech-stack:
  added: []
  patterns:
    - WebGL error handling callback without blocking text controls
    - Non-destructive empty and partial region state fallbacks
    - Unclamped text wrapping with min-h-0 containment in cartography overlay
    - Touch-comfortable minimum 44x44px CSS hitbox targets
key-files:
  created: []
  modified:
    - src/components/kids/planets/planetary-canvas.tsx
    - src/components/kids/planets/planetary-explorer.tsx
    - src/components/kids/planets/planetary-hud.tsx
    - src/lib/kids/planets.ts
    - src/__tests__/kids/planetary-canvas.test.tsx
    - src/__tests__/kids/planetary-explorer.test.tsx
    - src/__tests__/kids/planetary-hud.test.tsx
decisions:
  - D-05/D-08: Text planetary navigation remains independent of WebGL scene; errors trigger bilingual guidance while retaining full planet and region selector functionality.
  - D-03/D-04/D-15: Province sidebar and telemetry card replace line-clamp and fixed height clipping with min-h-0, in-flow scrollable details, and >=44x44px targets.
  - E3 empty/partial: Empty regions show localized guidance; features lacking a mission display explanatory status rather than a dead or missing action.
metrics:
  duration: 15m
  completed_date: "2026-11-10"
actuals:
  tokens: 12400
  tasks: 2
  commits: 2
  plan_head_before: 51030a97
  plan_head_after: 60c50219
---

# Plan 15-03 Summary: Resilient Planet Text Journey & Short-Screen Cartography

## Overview
Expanded planetary explorer and cartography HUD to gracefully handle missing, delayed, or failing WebGL renderers, empty region sets, partial features without missions, and compact screen layouts without clipping or dead actions.

## Key Changes
1. **WebGL Resilience & Error Callback (Task 1)**:
   - Added optional `onError` callback to `PlanetaryCanvas` to notify `PlanetaryExplorer` when WebGL context or renderer throws.
   - Preserved all text controls, planet pills, and region selectors regardless of renderer failure or delay.
   - Displayed bilingual localized notice informing kids that 3D is unavailable and text buttons can be used.
2. **Zero/Partial Region States & Short Cartography (Task 2)**:
   - Replaced fixed max-height constraints and `line-clamp-*` classes in `PlanetaryHud` with `min-h-0`, independent scrolling, and full text wrapping.
   - Sized all interactive buttons (`onBackToOrbit`, Earth map link, province feature buttons, and mission CTA) to minimum 44×44px touch hitboxes.
   - Handled zero-region planets with localized empty state notices in both the province sidebar and telemetry card.
   - Added `hasMission` field to `PlanetFeature`; when `hasMission === false`, a localized status reason is displayed and mission launch is cleanly disabled.
3. **Automated Verification**:
   - Expanded unit tests in `planetary-canvas.test.tsx`, `planetary-explorer.test.tsx`, and `planetary-hud.test.tsx` to 32 passing tests verifying empty states, partial mission states, and WebGL failure handling across English and Bahasa Melayu.
