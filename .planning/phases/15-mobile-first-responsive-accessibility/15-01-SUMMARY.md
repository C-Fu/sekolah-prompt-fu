---
phase: 15-mobile-first-responsive-accessibility
plan: 01
subsystem: kids-planets
tags: [accessibility, a11y, threejs, planetary-explorer, i18n]
dependency_graph:
  requires: []
  provides: [text-only-planet-navigation, persistent-chooser, polite-status-announcer]
  affects:
    - src/components/kids/planets/planetary-explorer.tsx
    - src/components/kids/planets/planetary-hud.tsx
    - messages/en.json
    - messages/ms.json
tech_stack:
  added: []
  patterns: [persistent-dom-chooser, aria-live-status-announcer, semantic-aria-pressed, d-16-multimodal-selection]
key_files:
  created: []
  modified:
    - src/components/kids/planets/planetary-explorer.tsx
    - src/components/kids/planets/planetary-hud.tsx
    - messages/en.json
    - messages/ms.json
    - src/__tests__/kids/planetary-explorer.test.tsx
decisions:
  - "Persistent chooser outside canvas: Moved PLANET_WORLDS chooser outside conditional keyed PlanetaryCanvas to prevent focus drop and support text-only operation when WebGL does not initialize (D-05, D-08)."
  - "Multimodal selection indicators: Region and planet buttons expose aria-pressed, visible check/word markers ('Selected' / 'Dipilih'), and 2px border per D-16."
  - "Polite status announcements: Added persistent role=status, aria-live=polite, aria-atomic=true region that reflects planet and region selection in EN and BM without stealing keyboard focus (D-07)."
status: complete
actuals:
  tokens: 8109
  tasks: 2
  commits: 2
  plan_head_before: "d8724490b8c9e7a45d256dc2c167454373b8ec1b"
  plan_head_after: "38830ef8c76c27900b33ae94b2a440f496693496"
---

# Phase 15 Plan 01: Text-Only Planet Navigation Tracer Summary

**One-liner:** Delivered persistent text-only planet strip, named region selector, visible polite live announcements, and mission routing without requiring WebGL initialization.

## Plan Summary

### Objective
Prove one production-quality planet strip → named region → mission journey without WebGL initialization, with selection announcements and preserved route origin.

### Implemented Capabilities
1. **Persistent Planet Chooser Outside Keyed Canvas (D-05, D-08):**
   - Moved `<nav data-testid="planet-selector-bar">` outside the conditional keyed `PlanetaryCanvas` so it stays mounted and preserves `document.activeElement` across mode switches between overview and cartography.
   - Positioned cleanly at `bottom-6 sm:bottom-8` in solar system overview and `top-16 sm:top-18` in planet cartography without unmounting or resetting focus.

2. **Ordered Region Chooser & Telemetry Controls (D-06, D-07):**
   - `PlanetaryHud`'s province sidebar renders feature buttons in logical DOM reading order following the planet chooser and preceding telemetry descriptions and the "Start Mission" action.
   - Added section heading (`t('regionChooserHeading')`) identifying the region selector.

3. **Multimodal Selection State (D-16):**
   - Added semantic `aria-pressed` to both planet pills and feature buttons.
   - Added visible checkmark and status label (`✓ Selected` in English, `✓ Dipilih` in Bahasa Melayu) plus high-contrast 2px border and ring styling, avoiding reliance on color or sound alone.

4. **Persistent Accessible Live Status Announcer (D-07):**
   - Added persistent `<div data-testid="planetary-status-announcer" role="status" aria-live="polite" aria-atomic="true">`.
   - Announces planet selection (`Selected: {name}. Choose a region.` / `Dipilih: {name}. Pilih kawasan.`) and region selection (`Selected: {region}. Read the details, then start a mission.` / `Dipilih: {region}. Baca butiran, kemudian mula misi.`) without stealing focus.

5. **Parallel Localized Messages:**
   - Extended `messages/en.json` and `messages/ms.json` with all phase-needed keys for planet selection, region selection, empty states, WebGL guidance, item/destination prompts, success/retry feedback, and section-dot labels.

## Verification

- Automated test suite:
  - `src/__tests__/kids/planetary-hud.test.tsx` (6 tests passing)
  - `src/__tests__/kids/planetary-explorer.test.tsx` (12 tests passing)
  - Full test suite: 271/271 tests passing across 26 test files.
- Verified absence of WebGL dependency: keyboard tab and programmatic selection work end-to-end even when WebGL `onInit` is never executed.
- Verified route resolution preserves `?origin=planets` allowlist contract.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all UI components are wired to authentic data from `PLANET_WORLDS`, messages use localized bundles, and mission routing strictly resolves through `resolveMissionRoute`.

## Self-Check: PASSED

- FOUND: `src/components/kids/planets/planetary-explorer.tsx`
- FOUND: `src/components/kids/planets/planetary-hud.tsx`
- FOUND: `messages/en.json`
- FOUND: `messages/ms.json`
- FOUND: `src/__tests__/kids/planetary-explorer.test.tsx`
- FOUND commit `c5dca19b`: `feat(15-01): support end-to-end text-only planet to region to mission navigation`
- FOUND commit `38830ef8`: `test(15-01): verify choice stability across repeated selections and orbit returns`
