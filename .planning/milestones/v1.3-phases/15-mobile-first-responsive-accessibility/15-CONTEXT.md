# Phase 15: Mobile-First Responsive Accessibility - Context

**Gathered:** 2026-11-09  
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the existing title, Earth map, planetary hub/cartography, and lesson activities usable and readable on narrow and wide screens with touch and keyboard. Preserve Phase 14's named navigation and footer guidance, the existing journeys and curriculum, bilingual copy, planetary/pixel-art identity, saved progress, and static export. This phase addresses A11Y-01 through A11Y-04; new curriculum, rebranding, and Phase 16's motion/audio polish are not part of it.

</domain>

<decisions>
## Implementation Decisions

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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Scope and earlier locked decisions
- `.planning/PROJECT.md` — static bilingual kids product, planetary identity, scope constraints.
- `.planning/REQUIREMENTS.md` — A11Y-01 through A11Y-04, plus Phase 16/17 boundaries and deferred A11Y-05.
- `.planning/ROADMAP.md` — Phase 15 goal and four success criteria.
- `.planning/phases/14-journey-clarity-shared-interaction-language/14-CONTEXT.md` — equally weighted title choices, named destinations, contextual return, fixed lesson footer and locked-next guidance.
- `.planning/research/SUMMARY.md` — v1.3 mobile-first and preservation research; validate against current source.

### Current UI and integration points
- `src/components/kids/layout/kids-home-content.tsx` — title choice cards.
- `src/components/kids/layout/kids-header.tsx` — shared navigation and mobile menu.
- `src/components/kids/elements/progress-map.tsx` — Earth map and scrollable map controls.
- `src/components/kids/planets/planetary-explorer.tsx` — canvas scene, planet strip and selection.
- `src/components/kids/planets/planetary-hud.tsx` — return controls and details panel.
- `src/components/kids/planets/planetary-canvas.tsx` — 3D pointer-dependent scene.
- `src/components/kids/layout/level-content-wrapper.tsx` — lesson footer, section flow and completion gating.
- `src/components/kids/elements/drag-drop-prompt.tsx` — exercise needing equivalent non-drag input.
- `.planning/codebase/CONVENTIONS.md` — i18n and styling conventions (map is dated; check source).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `KidsHomeContent` contains two existing destination cards; adapt their responsive layout rather than adding a new route.
- `KidsHeader` owns navigation, language toggle and a mobile menu; preserve Phase 14's visible labels.
- `PlanetaryExplorer` already has a horizontally scrollable named planet strip; extend the same navigation path to region selection rather than making the canvas mandatory.
- `PlanetaryHud` owns cartography controls and details; its current height/overflow constraints warrant a short-screen check.
- `LevelContentWrapper` owns the fixed footer, section progress and lock guidance; keep these semantics while ensuring activities remain scrollable and keyboard reachable.

### Established Patterns
- The current app is a static Next.js export with client-side progress; accessibility refinements must not introduce a backend dependency.
- User-facing strings live in the BM/EN `next-intl` message bundles. Use semantic links/buttons and existing component conventions instead of gesture-only navigation.
- Existing styles mix Tailwind utility classes with themed backgrounds and overlays; codebase maps are older than the kids-only product and should not be treated as a current file inventory.

### Integration Points
- Exercise components under `src/components/kids/elements/` should be audited for pointer-only behaviors, hit area, focus order, feedback and translated text wrapping; apply equivalent behavior where relevant, not only to `drag-drop-prompt.tsx`.
- Planet strip, region pins, details and mission routing must share selection state and remain functional when the WebGL scene cannot render.
- Verify title, map, planetary hub and lesson flows on narrow phones, short landscape, desktop and both languages, including focus order, overflow and readable panels.

</code_context>

<specifics>
## Specific Ideas

- Preserve the existing title's two equally important paths, but stack their cards on phones.
- For a non-drag activity: select an item, select a destination, read a brief success/retry message, and try another destination after a mistake.
- For planetary navigation: planet strip → named region selector → region details → mission, with the 3D scene optional rather than essential.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 15 scope. Existing deferred A11Y-05 (in-app text-size setting) remains outside this phase.

</deferred>

---

*Phase: 15-Mobile-First Responsive Accessibility*  
*Context gathered: 2026-11-09*
