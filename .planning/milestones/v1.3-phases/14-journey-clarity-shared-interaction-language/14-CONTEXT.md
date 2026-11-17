# Phase 14: Journey Clarity & Shared Interaction Language - Context

**Gathered:** 2026-11-09  
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the existing title → Earth map / planetary hub → lesson journey clearer for primary-school learners. This phase covers the title welcome choices, named location and return cues, and next-step guidance in existing screens. It does not add new curriculum, routes, progression mechanics, or a replacement tutorial system.

</domain>

<decisions>
## Implementation Decisions

### Title choices
- **D-01:** Keep the existing Start Earth and Explore Planets destinations at equal visual weight; neither is a recommended/primary path.
- **D-02:** Give each destination a direct action label (for example, “Start learning” and “Explore planets”) plus one short explanation. Do not rely on color or icon alone to distinguish them.
- **D-03:** Shorten the current three-step welcome flow to two steps: a welcome screen and a destination-choice screen.
- **D-04:** Fold the “what you learn” message into one concise sentence on the welcome screen. Keep the final screen focused on the two destination cards.
- **D-05:** Retain explicit labeled Back/Next controls between the two welcome steps and a clear step indicator; no swipe-only navigation.

### Where am I?
- **D-06:** Use visible text labels as well as icons for Home, Earth map, and planetary hub navigation on both desktop and mobile.
- **D-07:** Show local context in lessons through the current level and section; do not add a global breadcrumb trail.
- **D-08:** Return actions are context-aware: lessons return to their originating map or planetary hub; planetary feature/cartography view returns to solar-system orbit; Home returns to the title screen.
- **D-09:** Preserve saved progress when navigating between these destinations.

### Next-step cues
- **D-10:** Keep the lesson’s primary Next/Continue action in the existing fixed footer. When it is unavailable because an activity is incomplete, leave the action visible and show a short localized explanation.
- **D-11:** Make lesson section progress explicit with the section title and its position (for example, “Step 2 of 7”), instead of relying on dots alone.
- **D-12:** Provide one short, dismissible tip on first visit to each of the map and planetary screens. Dismissing a tip is per-screen; the tip’s exact placement is open to the planner after inspecting layouts.

### the agent's Discretion
- Exact concise BM/EN wording, provided translations remain natural, complete, and action-led.
- Visual placement and styling of the per-screen tips after inspecting the actual viewport layouts; tips must not obscure primary controls.
- Reuse or refinement of existing components/styles where it preserves the locked behavior and established pixel-art/planetary identity.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product scope and acceptance
- `.planning/PROJECT.md` — product vision, current milestone, validated constraints, and active goals.
- `.planning/REQUIREMENTS.md` — CLAR-01 through CLAR-03 acceptance requirements and milestone boundaries.
- `.planning/ROADMAP.md` — Phase 14 goal, requirements, and success criteria.
- `.planning/research/SUMMARY.md` — v1.3 research, mobile-first guidance, and preservation constraints.

### Existing UI and patterns
- `.planning/codebase/CONVENTIONS.md` — localization, naming, and React component conventions.
- `.planning/codebase/STRUCTURE.md` — project organization and component locations (some inventory is dated; verify against source).
- `src/components/kids/layout/kids-home-content.tsx` — current three-step welcome and dual destination cards.
- `src/components/kids/layout/kids-header.tsx` — current desktop icon navigation and mobile menu.
- `src/components/kids/elements/progress-map.tsx` — Earth map, planet link, and progress UI.
- `src/components/kids/planets/planetary-hud.tsx` — planetary feature return/map controls and mission action.
- `src/components/kids/planets/planetary-explorer.tsx` — solar-system/cartography state and mission routing.
- `src/components/kids/layout/level-content-wrapper.tsx` — lesson section state and navigation footer.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `KidsHomeContent` already implements a three-step welcome flow and the two destination cards; it can be reduced and relabeled without introducing a new onboarding system.
- `KidsHeader` owns the shared top navigation, locale switch, progress counters, and mobile dropdown.
- `ProgressMap` already has a labeled planetary destination banner and progress display.
- `PlanetaryHud` already exposes return-to-orbit and Earth-map controls; `PlanetaryExplorer` owns the corresponding selection/mode state.
- `LevelContentWrapper` owns section position, completion gating, and the fixed lesson navigation footer.
- Existing `next-intl` message bundles and locale validation are the established source for user-facing strings.

### Established Patterns
- User-facing strings use `useTranslations("kids")` / existing localized namespaces; do not add hardcoded English or Malay UI copy.
- Navigation is implemented with Next `Link`; interactive actions use semantic buttons.
- The app preserves static-export compatibility and client-side local progress; no backend or new durable progress schema is needed for this phase.
- The codebase uses Tailwind classes, `cn()` for conditional class composition, and colocated/test-suite component tests.

### Integration Points
- Title flow changes in `KidsHomeContent` must keep `/map` and `/planets` as the two existing destinations.
- Named Home/Earth map/Planets navigation touches `KidsHeader`, map and planetary UI, and must not make duplicate or contradictory navigation controls.
- Context-aware lesson return behavior must be checked against the actual route entry points and existing completion flow before implementation; preserve progress semantics.
- Section title/position and locked-next explanation belong at the boundary between `LevelContentWrapper` and its `NavigationFooter`.
- Per-screen tips need localized strings and a clear persistence/lifetime decision consistent with existing client-side settings; confirm existing settings/storage conventions during planning.

</code_context>

<specifics>
## Specific Ideas

- Title: two short steps — concise welcome/learning promise, then two equally prominent labeled choices.
- Navigation labels: “Home”, “Earth map”, and “Planets” should be understandable without interpreting an icon.
- Lessons: the fixed footer remains the place to find Next/Continue; explicitly tell learners why it is unavailable until they finish the activity.
- Section position should include both the current section title and ordinal progress.
- Map and planetary tips should be short, shown on first visit, and dismissible independently for each screen.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 14 scope.

</deferred>

---

*Phase: 14-Journey Clarity & Shared Interaction Language*  
*Context gathered: 2026-11-09*
