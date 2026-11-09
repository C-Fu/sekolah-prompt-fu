# Phase 15: Mobile-First Responsive Accessibility - Research

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

### Small-screen layout
- **D-01:** On narrow phones, present the title's two equal-priority destination cards stacked full width, with both labels and short explanations visible. Do not hide one behind a swipe.
- **D-02:** On short screens, keep the lesson's compact, labeled Back/Continue footer visible as agreed in Phase 14. Scroll activity content above it, reserving enough space so the footer never obscures answers or controls.
- **D-03:** In planetary cartography, keep return and planet selection reachable while the details/actions panel can scroll instead of clipping or covering its own controls.
- **D-04:** Preserve complete BM and EN labels: wrap and allow cards and buttons to grow vertically rather than truncate long translated copy.

### Planet navigation without canvas gestures
- **D-05:** Use the existing named planet strip as the complete keyboard/touch alternative to selecting planets on the 3D canvas; dragging or clicking the scene remains optional.
- **D-06:** Provide a text-labeled region selector alongside 3D region pins. Its choices must reach the same region details and mission actions as pointer selection.
- **D-07:** When choosing a planet or region, retain keyboard focus on the chooser; place the newly relevant details/action next in logical reading order and announce the selected name/status. Avoid jumping focus into the canvas or directly to the action.
- **D-08:** If WebGL is missing, unavailable, or slow, the text path must still support planet selection, named regions, descriptions, and mission links; do not redirect learners to a different journey.

### Lesson activities and feedback
- **D-09:** For drag/drop learning tasks, support a select-item-then-select-destination interaction usable by keyboard and touch; dragging may remain an optional shortcut to the same task.
- **D-10:** A wrong placement leaves the item available for another attempt, with a short explanatory text message; do not reset all progress or silently auto-correct.
- **D-11:** Preserve Phase 14's visible Next action and adjacent reason when an activity is incomplete. Keyboard users must be able to reach/read the reason for the lock, without offering misleading access to locked sections.
- **D-12:** After an answer, keep focus at the answer and show/announce a brief nearby success or retry status. Do not rely on a visual-only state or shift focus to a result panel after each response.

### Readable controls
- **D-13:** Give primary actions generous touch areas by default, even when the visible icon or label is compact; do not make hit areas tight to save space.
- **D-14:** Use a strong, high-contrast two-tone focus outline recognizable on bright and dark planetary backgrounds, not only a theme-colored glow or underline.
- **D-15:** Put essential instructional text on sufficiently opaque readable surfaces/scrims where planetary art would compromise legibility; retain the art around the content rather than dimming the entire scene.
- **D-16:** Express selection and disabled states through short visible words plus distinguishable icon/shape/border treatments, not color or sound alone.

### the agent's Discretion
- Exact CSS breakpoints, component structure, panel scrolling mechanics, touch dimensions, and accessible status announcement technique, provided the behavior above and Phase 15 success criteria hold.
- Localized phrasing of concise status messages and reasons, while preserving complete natural BM/EN translations.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within Phase 15 scope. Existing deferred A11Y-05 (in-app text-size setting) remains outside this phase.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| A11Y-01 | Core screens and lesson interactions remain usable at narrow mobile and desktop viewport sizes without clipped controls or unintended horizontal overflow. [VERIFIED: .planning/REQUIREMENTS.md:23-23] | Reflow and nested-scroll audit; real-browser viewport checks. |
| A11Y-02 | Primary interactive targets are comfortably touch-friendly, and interactive controls expose clear hover, pressed, disabled, and keyboard-focus states where applicable. [VERIFIED: .planning/REQUIREMENTS.md:24-24] | Target-size and focus recommendations; CSS/interaction audit. |
| A11Y-03 | Core navigation and lesson interactions can be completed using a keyboard, with a visible focus indicator and logical focus order. [VERIFIED: .planning/REQUIREMENTS.md:25-25] | Native controls, equivalent selection, focus preservation and keyboard journey checks. |
| A11Y-04 | Text and controls remain legible against themed backgrounds, and essential status is not conveyed by color, sound, or motion alone. [VERIFIED: .planning/REQUIREMENTS.md:26-26] | Contrast on opaque surfaces; visible translated status and live announcements. |
</phase_requirements>

**Researched:** 2026-11-09  
**Domain:** Responsive browser layout, input equivalence, WCAG-informed interaction and static client UI  
**Confidence:** HIGH for source/standards analysis; MEDIUM for unrendered layout outcomes.

## Summary

Refine the existing client components rather than change routing or install an accessibility framework. The title already uses a single-column mobile grid and has two destination links; its remaining issues are short-height behavior, compact header/footer crowding and translated wrapping. The Earth map is intentionally horizontally navigable artwork; confine horizontal movement to the map, not the overall document, and provide usable named destinations. [VERIFIED: src/components/kids/layout/kids-home-content.tsx:62-138] [VERIFIED: src/components/kids/elements/progress-map.tsx:30-61] [VERIFIED: src/components/kids/elements/progress-map.tsx:113-121] [CITED: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html]

Most important integration risk: planetary scene creation catches a WebGL renderer failure, but selection UI is currently rendered inside canvas children and the planet chooser is unmounted on entry to cartography; the cartography panels truncate labels and clip actions on short screens. Keep a persistent text navigation path and state in `PlanetaryExplorer` independent of renderer success, and make chooser → details → mission a predictable reading order. The existing region selector already uses buttons; preserve its selected feature behavior while fixing reachability and announcements. [VERIFIED: src/components/kids/planets/planetary-canvas.tsx:74-86] [VERIFIED: src/components/kids/planets/planetary-canvas.tsx:174-182] [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:60-104] [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:217-301] [VERIFIED: src/components/kids/planets/planetary-hud.tsx:95-147]

For lessons, implement the locked two-step select/place path in `MagicWords` and `DragDropPrompt`, retain optional drag, and preserve progress identity/completion contracts. Check other answer components for focus-loss after replacing selected/submit controls, translated feedback and narrow content. Use jsdom tests for semantics/state, but require rendered-browser checks for clipping, target size, contrast and focus visibility; no browser binary was detected locally. [VERIFIED: src/components/kids/elements/magic-words.tsx:128-179] [VERIFIED: src/components/kids/elements/drag-drop-prompt.tsx:191-238] [VERIFIED: vitest.config.ts:30-38]

**Primary recommendation:** Implement responsive containment + persistent text alternatives + native button-based select/place in the existing client components, then verify both languages on actual narrow/short/wide viewports. [CITED: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html] [CITED: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Title, map and lesson reflow | Browser / Client | CDN / Static | CSS layout and scroll contain user-visible content; deployment remains static. [VERIFIED: next.config.ts:19-23] |
| Planet/region navigation without WebGL | Browser / Client | — | Selection and routing already live in the client orchestrator, not the renderer. [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:60-117] |
| Activity answer, retry and announcements | Browser / Client | Database / Storage (browser-local) | Lesson component updates local saved state and section completion. [VERIFIED: src/components/kids/elements/magic-words.tsx:95-104] [VERIFIED: src/components/kids/elements/magic-words.tsx:169-184] |
| Static export assurance | CDN / Static | Browser / Client | Build emits static pages, then client interactivity hydrates. [CITED: https://nextjs.org/docs/app/guides/static-exports] |

## Standard Stack

### Core (already installed; no new dependencies)

| Library/tool | Existing manifest constraint | Purpose | Why standard here |
|--------------|------------------------------|---------|-------------------|
| Next.js | `"next": "^16.0.10"` [VERIFIED: package.json:32-33] | Static routing/rendering | Existing export uses `output: "export"` [VERIFIED: next.config.ts:19-23]; keep it. |
| React / React DOM | `"react": "19.2.0", "react-dom": "19.2.0"` [VERIFIED: package.json:35-36] | Client state/UI | Existing selectors and lessons use state/hooks. [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:60-76] |
| next-intl | `"next-intl": "^4.5.8"` [VERIFIED: package.json:32-36] | BM/EN messages | Existing components use `useTranslations`, `useLocale`. [VERIFIED: src/components/kids/planets/planetary-hud.tsx:3-44] |
| Tailwind CSS | `"tailwindcss": "^4"` [VERIFIED: package.json:59-62] | Responsive classes | Existing responsive layouts already use utilities. [VERIFIED: src/components/kids/layout/kids-home-content.tsx:73-79] |
| Three.js | `"three": "^0.187.0"` [VERIFIED: package.json:38-40] | Optional visual planetary scene | Keep only as enhancement; text selection cannot require it. [VERIFIED: src/components/kids/planets/planetary-canvas.tsx:74-86] |

### Supporting (already installed)

| Tool | Existing manifest constraint | Purpose |
|------|------------------------------|---------|
| Vitest + jsdom | `"vitest": "^2.1.8", "jsdom": "^25.0.1"` [VERIFIED: package.json:57-62] | Keyboard/state/markup regression tests; configured with `environment: "jsdom"`. [VERIFIED: vitest.config.ts:30-38] |
| Testing Library | `"@testing-library/react": "^16.1.0", "@testing-library/user-event": "^14.5.2"` [VERIFIED: package.json:44-47] | Role-oriented input tests. [VERIFIED: src/__tests__/kids/planetary-explorer.test.tsx:1-6] |

**Installation:** None. This phase adds no external packages; the package legitimacy gate is not triggered. Do not mistake manifest ranges for freshly registry-verified latest releases. [VERIFIED: package.json:23-62]

## Architecture Patterns

### System Architecture Diagram

```text
Keyboard / touch / pointer ─→ native links & buttons (title/map/planet/lesson)
                                    │
                                    ├─→ planet chooser ─→ selected planet/region state ─→ details ─→ mission route
                                    │                         │
                                    │                         └─→ optional WebGL render/pins (failure does not stop text path)
                                    └─→ selected activity item ─→ destination button ─→ validate
                                                                                      ├─ correct → persisted progress
                                                                                      └─ wrong → local retry message, item retained
                                                ↓
                                 BM/EN visible text + polite status; focus stays on chooser/answer
```

This data flow follows the existing planet orchestrator and lesson component state boundaries. [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:60-117] [VERIFIED: src/components/kids/elements/magic-words.tsx:95-110] [CITED: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html]

### Component Responsibilities

| Area | Recommended responsibility |
|------|----------------------------|
| `KidsHomeContent`, `KidsHeader` | Preserve named destinations, allow label wrapping, avoid header/footer collisions at narrow widths and short heights. [VERIFIED: src/components/kids/layout/kids-home-content.tsx:73-138] [VERIFIED: src/components/kids/layout/kids-header.tsx:45-165] |
| `ProgressMap` | Keep wide pixel-art map inside its own scroll area; make level navigation/labels and scroll controls operable/readable. [VERIFIED: src/components/kids/elements/progress-map.tsx:91-121] [VERIFIED: src/components/kids/elements/progress-map.tsx:487-545] |
| `PlanetaryExplorer`, `PlanetaryHud`, `PlanetaryCanvas` | Orchestrator owns selected planet/region and always-available text path; HUD owns ordered selector/details/action; canvas owns optional drawing and disposal only. [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:60-117] [VERIFIED: src/components/kids/planets/planetary-canvas.tsx:136-182] |
| `LevelContentWrapper` and activity components | Footer owns locked progression; activities own local answer/feedback, scoped section completion and saved state. [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:159-183] [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:216-272] |
| Message bundles and shared CSS | Translate newly visible status and button labels in both languages; apply repeatable light/dark focus treatment and readable panels. [VERIFIED: src/components/kids/layout/kids-home-content.tsx:10-11] [VERIFIED: src/app/globals.css:118-129] |

### Pattern 1: Text path is primary, scene optional

Keep the planet chooser mounted across overview/cartography (or ensure focus is preserved on a persistent equivalent), then place named region controls before details and mission in DOM order. Do not conditionally remove the only chooser when `mode` changes; do not depend on `onInit` to produce buttons. `PlanetaryCanvas` currently returns after renderer failure, leaving children rendered, but this does not prove all journeys remain accessible on slow/failed WebGL. [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:141-143] [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:217-301] [VERIFIED: src/components/kids/planets/planetary-canvas.tsx:74-86] [VERIFIED: src/components/kids/planets/planetary-canvas.tsx:174-182]

### Pattern 2: Selection and status separate from focus

Use native buttons for selectable answers/regions, persistent selected-state semantics and visible text, and a nearby polite status region that is present before updates. Keep focus on the selected control after a same-context update; if an element must be removed, deliberately preserve a stable replacement. Use `aria-describedby` for an adjacent lock explanation on a **focusable, non-activating** `aria-disabled` Next button, or make the explanation separately keyboard reachable while keeping locked sections inaccessible. Test actual keyboard tab order rather than treating `title` on a disabled button as discoverable. [CITED: https://www.w3.org/WAI/ARIA/apg/patterns/button/] [CITED: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html] [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:363-389]

### Pattern 3: Scrolling layers follow reading order

Retain a non-overlaid lesson footer with `flex-1 min-h-0 overflow-y-auto` activity region, but test short landscape and zoom where footer height expands; use `scroll-padding`/adequate in-flow space if a focused control is obscured. Allow cartography details and chooser to scroll without a parent `overflow-hidden` cutting off the mission button. A map can remain a locally scrollable two-dimensional graphic; its text labels and surrounding navigation still need to reflow. [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:216-251] [VERIFIED: src/components/kids/planets/planetary-hud.tsx:53-56] [VERIFIED: src/components/kids/planets/planetary-hud.tsx:95-147] [CITED: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html] [CITED: https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html]

### Anti-Patterns to Avoid

- Shrinking labels or hiding explanations to fit a fixed panel: current HUD uses `truncate`, `line-clamp-1`, `line-clamp-2` and capped heights; remove these from essential details. [VERIFIED: src/components/kids/planets/planetary-hud.tsx:95-147] [VERIFIED: src/components/kids/planets/planetary-hud.tsx:170-209]
- Gesture-only interaction or automatically placing into the first empty slot: `MagicWords` has a clickable word, but the destination is not a native control and is selected implicitly. [VERIFIED: src/components/kids/elements/magic-words.tsx:143-167] [VERIFIED: src/components/kids/elements/magic-words.tsx:205-222] [CITED: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html]
- Forcing focus into results or canvas after every answer: feedback should be nearby and programmatically announced, not steal focus. [CITED: https://www.w3.org/WAI/ARIA/apg/patterns/button/] [CITED: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html]

## Don't Hand-Roll

| Problem | Don't build | Use instead | Why |
|---------|-------------|-------------|-----|
| Keyboard activation of selectable controls | Clickable `<span>`/`<div>` with custom keydown emulation | Native `<button>` and `<a>` | Built-in Enter/Space button operation and accessible labels. [CITED: https://www.w3.org/WAI/ARIA/apg/patterns/button/] |
| Spoken transient feedback | Global document focus jumps or bespoke announcer bus | Visible nearby `role="status"` with concise updates | Assistive technologies can announce status without moving focus. [CITED: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html] |
| Gesture alternative | Custom drag-only canvas or reorder library | Existing selection state plus native button item/destination operations | One-finger non-drag alternative and keyboard path are both required by locked decisions. [CITED: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html] |
| Responsive browser scrolling | JS measuring every panel on resize | Flex/grid and local overflow with browser scrolling | Reflow guidance favors in-flow sections and local scrolling where justified. [CITED: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html] |

## Common Pitfalls

1. **Renderer failure hides an incomplete path.** Failure handler returning early is not a user-facing fallback. Check no-canvas and delayed-canvas states for planet, region, detail and mission equivalence. [VERIFIED: src/components/kids/planets/planetary-canvas.tsx:74-86] [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:141-301]
2. **Focusable chooser disappears on mode switch.** Solar-system selector is only in the overview branch; after activation its node unmounts. Keep persistent equivalent and test `document.activeElement`. [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:141-143] [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:217-251]
3. **Small footer dots and disabled lock explanation.** Section dots have `"w-4 h-4 border-2 transition-all"`, `aria-label={`Go to section ${i + 1}${!canNavigate ? " (locked)" : ""}`}`; the latter is hardcoded English, and the lock Next button uses native `disabled` plus `title`, so keyboard access to the reason needs explicit design. [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:438-456] [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:363-389]
4. **Wrong answer consumes the item or focus.** `MagicWords` currently places any selected word into the first empty blank and marks section complete when blanks are filled, regardless of correctness. Preserve existing curriculum intent, but do not lock away a wrong word before a retry; test duplicated words by stable identity rather than string alone. [VERIFIED: src/components/kids/elements/magic-words.tsx:118-159] [VERIFIED: src/components/kids/elements/magic-words.tsx:169-179]
5. **Reorder controls technically exist but miss the agreed interaction.** `DragDropPrompt` has arrow buttons with `"w-10 h-8"`, yet no select-item-then-select-destination path; the first/last positions disable an arrow and each row's drag handler prevents mouse default. Plan a stable button path, clear selection/answer statuses and a non-resetting retry. [VERIFIED: src/components/kids/elements/drag-drop-prompt.tsx:277-339] [VERIFIED: src/components/kids/elements/drag-drop-prompt.tsx:224-238]
6. **Cut-off content is not fixed by `overflow-hidden`.** HUD details currently have `"max-h-52 sm:max-h-72 md:max-h-[340px]"`, with `"line-clamp-2"` for descriptions; make action reachable and long BM/EN copy fully available. [VERIFIED: src/components/kids/planets/planetary-hud.tsx:142-147] [VERIFIED: src/components/kids/planets/planetary-hud.tsx:206-220]
7. **A 24px minimum is mistaken for a comfortable primary action.** WCAG 2.2 Target Size (Minimum) is 24×24 CSS px with exceptions; 44×44 belongs to Enhanced. Aim for at least 44×44 CSS px on important controls as a project recommendation, not a claim that 44 is Level AA mandatory. [CITED: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html]
8. **jsdom treated as a visual acceptance test.** Vitest runs in jsdom, so asserting utility class names cannot demonstrate real wrapping, scroll access, contrast or focus visibility; inspect rendered browser/device at representative sizes and 200% zoom. [VERIFIED: vitest.config.ts:30-38] [CITED: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html]

## Code Examples

These are standards-derived **illustrative patterns, not a drop-in patch**; new message keys and component identifiers are deliberately omitted until both locale bundles are edited. [CITED: https://www.w3.org/WAI/ARIA/apg/patterns/button/] [CITED: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html]

```tsx
// Native control retains focus; label and status text come from existing translations.
<button type="button" aria-pressed={selected} onClick={selectItem}>
  {visibleLabel}
</button>
<p role="status" aria-atomic="true">{localizedFeedback}</p>
```

```css
/* Suggested visual treatment; verify against actual light/dark panels and clipping. */
.kids-focus:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
  box-shadow: 0 0 0 6px #171717;
}
```

W3C describes two-color focus indication for variable backgrounds; these specific CSS colors are a recommendation requiring rendered contrast inspection, not a certified conformance result. [CITED: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html]

## State of the Art

| Old assumption | Current guidance | Impact |
|----------------|------------------|--------|
| Any keyboard arrow controls automatically cover drag accessibility | Single-pointer non-drag equivalent is separately required; keyboard alone may not suffice | Make select-item/destination work on touch and keyboard. [CITED: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html] |
| Hide truncated labels to save HUD space | Reflow text and permit local scrolling | Keep named places/descriptions/actions discoverable. [CITED: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html] |
| Only visual color change needed on selection | Announce meaningful status without taking focus | Use visible words, selection semantics and status text. [CITED: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html] |

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|-------|---------|---------------|
| A1 | [ASSUMED] Targeting 44×44 CSS px for important controls is the best project comfort threshold; it is advisory, not mandated by A11Y-02 or WCAG AA. | Pitfalls | Smaller/larger design guidance may be preferred by project owner. |
| A2 | [ASSUMED] A compact in-flow lesson footer can remain visible at *every* short-height/zoom setting without a separate footer scroll region. | Architecture | Short landscape/zoom may require an additional adaptive layout; test before locking. |
| A3 | [ASSUMED] Real-browser/device manual checkpoint will be available during implementation despite no browser executable detected here. | Validation | Cannot fully validate A11Y-01/02/04 visually without one. |

## Open Questions

1. **Which actual device/browser will serve as the rendered acceptance checkpoint?** No local Chromium/Playwright executable appeared in `command -v` probes. Assign a manual/device run or provision a trusted browser runner; do not treat jsdom as proof of layout.
2. **How should selection focus survive transition into cartography?** Keep a chooser mounted across modes; decide exact markup while preserving Phase 14 labels, and test no-WebGL and slow-WebGL cases. [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:141-301]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node | Build/tests | ✓ | v24.15.0 (shell probe); manifest says `"node": "24.x"` [VERIFIED: package.json:64-66] | — |
| npm | Build/tests | ✓ | 11.12.1 (shell probe) | — |
| local Vitest / Next binaries | Existing test and static build | ✓ | Manifest constraints above; executables present in `node_modules/.bin` (shell probe) | — |
| Browser / Playwright CLI | Rendered mobile, zoom, contrast, focus checks | ✗ in command lookup | — | Human browser/device checkpoint; provision trusted runner only if needed. |
| WebGL | Optional visualization | Not probed in this shell | — | Text chooser → detail → mission path. [VERIFIED: src/components/kids/planets/planetary-canvas.tsx:74-86] |

**Missing dependencies with no fallback:** None for code and tests. Visual acceptance needs an actual browser/device; do not mark complete on jsdom-only evidence. [VERIFIED: vitest.config.ts:30-38]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Existing Vitest (`"vitest": "^2.1.8"`) + jsdom (`"jsdom": "^25.0.1"`) + Testing Library. [VERIFIED: package.json:44-62] |
| Config | `vitest.config.ts` [VERIFIED: vitest.config.ts:30-56] |
| Quick run | `npm test -- --run src/__tests__/kids/planetary-explorer.test.tsx src/__tests__/kids/planetary-hud.test.tsx src/__tests__/kids/home-navigation.test.tsx` (existing tests) [VERIFIED: package.json:7-20] |
| Full suite | `npm run verify -- --gates-only`; for export gate `npm run build && npm run verify` (verify does **not** build). [VERIFIED: scripts/verify-project.js:11-26] [VERIFIED: scripts/verify-project.js:115-123] |

### Phase Requirements → Test Map

| Req ID | Behavior | Type | Automated command / manual step | File exists? |
|--------|----------|------|---------------------------------|--------------|
| A11Y-01 | No clipped footer, chooser, map controls or lesson answers across narrow/short/desktop BM+EN | Rendered browser manual; markup regression | Browser/device matrix 320×568, 375×667, 667×375, 1280×800 and 200% zoom (suggested sampling, not compliance proof); `npm test -- --run src/__tests__/kids/home-navigation.test.tsx` [VERIFIED: src/__tests__/kids/home-navigation.test.tsx:39-87] | Existing semantic test ✅; rendered checkpoint ❌ |
| A11Y-02 | Target hit areas and hover/pressed/disabled/focus styles | Browser manual + DOM tests | Measure computed rectangles in browser; keyboard Tab through header, map, HUD and lesson; `npm test -- --run src/__tests__/kids/header-navigation.test.tsx` [VERIFIED: src/components/kids/layout/kids-header.tsx:83-165] | Existing navigation test ✅; rendered checkpoint ❌ |
| A11Y-03 | Planet → region → mission without WebGL, focus retained; lesson item → destination and lock explained | Integration | `npm test -- --run src/__tests__/kids/planetary-explorer.test.tsx src/__tests__/kids/planetary-hud.test.tsx src/__tests__/kids/planetary-canvas.test.tsx`; add new lesson/keyboard tests (Wave 0). [VERIFIED: src/__tests__/kids/planetary-explorer.test.tsx:126-197] | Partial ✅; new tests ❌ |
| A11Y-04 | Full translated text, visible+announced feedback; contrast on actual rendered backgrounds | DOM + browser manual | New unit tests for BM/EN messages and role/status + manual computed foreground/background contrast on image/scrim (Wave 0). [CITED: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html] | Partial ✅; new tests ❌ |

### Sampling Rate
- **Per task commit:** targeted `npm test -- --run <changed test file>`; tests should assert role/name, focus and state, not CSS geometry. [VERIFIED: package.json:12-15] [VERIFIED: vitest.config.ts:30-38]
- **Per wave merge:** `npm run verify -- --gates-only` and a manual viewport review after layout waves; run `npm run build && npm run verify` at export gate. [VERIFIED: scripts/verify-project.js:11-26]
- **Phase gate:** Full tests + static export + keyboard/touch/browser matrix for title, map, planetary hub/cartography and representative lesson in BM and EN; record any unverified device/assistive-technology coverage explicitly. [VERIFIED: .planning/REQUIREMENTS.md:21-26]

### Wave 0 Gaps
- [ ] Add keyboard/touch item-then-destination tests for `MagicWords` and `DragDropPrompt` (new tests alongside existing kids tests); include wrong placement retry, duplicate words, saved-state preservation and scoped completion. [VERIFIED: src/components/kids/elements/magic-words.tsx:25-29] [VERIFIED: src/components/kids/elements/drag-drop-prompt.tsx:18-22]
- [ ] Extend planetary integration tests for non-WebGL / delayed-WebGL text navigation, chooser focus, BM/EN region names, details and mission parity. [VERIFIED: src/__tests__/kids/planetary-explorer.test.tsx:126-246]
- [ ] Extend footer tests for readable locked reason and no bypass of locked sections, plus status-role tests for answer interactions. [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:162-183] [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:363-389]
- [ ] Arrange rendered browser/device checkpoint; adding a browser test package is **not** recommended by default and would require package legitimacy verification before installing. [ASSUMED]

## Security Domain

Security enforcement was not explicitly disabled (`workflow` contains only `"_auto_chain_active": false` [VERIFIED: .planning/config.json:6-8]). The V2–V6 labels below are the phase research template's **legacy category shorthand**, not a claim to use the OWASP ASVS 5.0.0 chapter numbering: the current official standard is ASVS 5.0.0, whose identifiers are versioned chapter.section.requirement. This is a client-side accessibility refinement; do not imply a formal ASVS verification. [CITED: https://owasp.org/www-project-application-security-verification-standard/] [VERIFIED: next.config.ts:19-23]

### Applicable ASVS Categories

| ASVS Category | Applies? | Standard control |
|---------------|----------|------------------|
| V2 Authentication | No new authentication flow | Keep existing static scope; no backend. [VERIFIED: next.config.ts:19-23] |
| V3 Session Management | No new session flow | No session additions. [VERIFIED: next.config.ts:19-23] |
| V4 Access Control | Yes, in-app navigation gating (not an auth boundary) | Keep existing fail-closed section completion and disabled unavailable sections; avoid misleading unlock. [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:159-183] [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:284-298] |
| V5 Input Validation | Yes, local placement/route inputs | Validate item/destination against provided activity choices; preserve existing mission route resolver. [VERIFIED: src/components/kids/elements/magic-words.tsx:106-110] [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:105-117] |
| V6 Cryptography | No new crypto | Do not invent cryptography for client UI state. [VERIFIED: src/components/kids/elements/magic-words.tsx:95-104] |

### Known Threat Patterns

| Pattern | STRIDE | Mitigation |
|---------|--------|------------|
| Forged client-side lesson completion | Tampering | Progress gating is a learning UX contract, not server-authoritative access control; preserve existing scope identity and avoid declaring it secure authorization. [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:275-298] |
| Untrusted arbitrary route constructed from selected text | Tampering | Continue routing via existing planet/feature resolver rather than interpolating displayed label into a URL. [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:105-117] |

## Sources

### Primary (HIGH confidence, official sources and opened repository definitions)
- W3C WCAG Understanding: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html (updated 2026-10-04); https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html (updated 2026-11-02); https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html (updated 2026-08-10); https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html (updated 2026-06-15); https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html (updated 2026-10-04); https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html (updated 2026-10-04); https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html (updated 2026-10-04). [CITED: https://www.w3.org/WAI/WCAG22/Understanding/]
- W3C WAI-ARIA APG button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/ (checked 2026-11-09). [CITED: https://www.w3.org/WAI/ARIA/apg/patterns/button/]
- Next.js static export guide: https://nextjs.org/docs/app/guides/static-exports (updated 2026-08-09). [CITED: https://nextjs.org/docs/app/guides/static-exports]
- OWASP ASVS current standard/version and reference format: https://owasp.org/www-project-application-security-verification-standard/ (checked 2026-11-09). [CITED: https://owasp.org/www-project-application-security-verification-standard/]
- Current checked repository sources: `package.json`, `next.config.ts`, `vitest.config.ts`, core kids layout/planet/lesson components and integration tests (opened in this session). [VERIFIED: package.json:7-66] [VERIFIED: next.config.ts:19-46] [VERIFIED: vitest.config.ts:30-56]

## Metadata

**Confidence breakdown:** Standard stack HIGH (opened installed manifest; no new package/version recommendation); architecture HIGH (opened component owners and official W3C/Next docs); pitfalls HIGH for source-confirmed behavior, MEDIUM for rendered consequences until browser/device check. Documentation confidence seam for `websearch --verified` returned MEDIUM; official pages fetched directly support `[CITED]` claims.  
**Research date:** 2026-11-09  
**Valid until:** 2026-12-09 for stable standards and repo snapshot; recheck after component changes.  
**Project constraints:** No `./AGENTS.md` or project skills in `.claude/skills/`/`.agents/skills/` was present in the checked workspace; no `## Project Constraints (from AGENTS.md)` section is applicable. Agent skills query returned empty; graphify status reported disabled.  
**Dependency gate:** No new packages installed or recommended; package legitimacy audit not applicable.
