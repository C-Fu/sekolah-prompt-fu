# Feature Landscape — v1.3 Kid-Friendly UX, Game Feel & Visual Polish

**Domain:** Incremental UX/UI refinement for a bilingual, static, kid-focused learning game  
**Project:** Sekolah Prompt-Fu  
**Researched:** 2026-11-09  
**Scope:** Refine the existing title, Earth map, 3D planetary hub/cartography, and lesson flows. Preserve the pixel-art/planetary identity, routes, current curriculum, BM/EN behavior, local progress and static-export architecture.

## Executive Recommendation

Treat v1.3 as a focused **orientation → interaction → finish** milestone, not a redesign. The central student need is knowing “where am I, what can I do next, and what happened when I acted?” Establish a consistent journey vocabulary across title, map, planet selection and lesson screens; make one recommended action obvious without removing the existing choice to explore; then apply a small, coherent feedback language to meaningful actions and completion. Refine the screens that currently read as separate products (pixel-art title/map/lesson controls versus glass/cyan telemetry HUD) while retaining their functional identity and planetary accents.

Prioritize phone/touch constraints: generous targets, unclipped bilingual copy, visible focus, a usable narrow-screen planetary HUD and reduced-motion-aware feedback. Work with existing Tailwind/CSS, React components, localStorage, translations and Three.js. No new framework, server, account system or game mechanic is needed. The strongest opportunity is clarifying and refining existing affordances: BM/EN toggle, 3-step intro, direct Earth-map and solar-system routes, stars/completion counter, section navigation, planet feature selection, world backgrounds and celebration/rocket feedback already exist. Avoid parallel onboarding or progression systems.

Desk research supports predictable navigation and clear, readable cues, while the codebase reveals mobile-hidden header navigation, small section indicators, dense planet metadata and differing visual treatments. These are audit targets, not presumed defects in every viewport. The main recommendation is to improve discoverability, consistency and responsive usability before adding new flourish.

**Evidence confidence:** High for project scope and inspected implementation (PROJECT.md and source components); medium for UX/accessibility recommendations (W3C standards/guidance, web.dev and game-accessibility checklist); applied game-feel/UI concepts are design practice, not empirical proof. No child usability testing was conducted.

## Table Stakes

These directly serve the confirmed milestone goals: clearer journey, purposeful feedback, visual consistency and accessible responsive UI. Complexity: **Low** = localized style/copy/state; **Medium** = shared component behavior or a cross-screen pattern; **High** = broader state/layout integration and extensive bilingual/device verification.

| Feature | Why Expected | Complexity | Dependencies / Acceptance Direction |
|---|---|---:|---|
| **Clear “you are here / next step” cues** across title, map, planet/cartography and lesson | Learners benefit from predictable, scannable navigation. The home already offers two entry paths but does not resolve which is recommended; returning progress can be made more actionable. | Medium | Reuse current level/progress/planet data. Keep Earth as the starting path and 3D exploration as an explicit alternative. Show current world/year/lesson and a primary next action with label plus icon/state, not color alone. Preserve route semantics and verify BM/EN copy. |
| **Consistent navigation/control placement** | Title, map/lesson and planetary HUD have different visual and control vocabularies. Stable back/next/location patterns reduce relearning and help students resume. | Medium | Align with existing KidsHeader, map, PlanetaryHud and LevelSlides. Standardize action hierarchy, labels, active/disabled states and focus treatment. Keep useful planetary telemetry; do not force every view into an identical layout. |
| **Touch-friendly target sizes and spacing** for header, lesson pager/dots, map pins and planet features | WCAG 2.2 AA SC 2.5.8 defines 24×24 CSS px or a spacing exception; W3C says larger targets improve ease and refers to 44×44 enhanced targets for important controls. web.dev recommends about 48 device-independent px and ~8px separation for touch. For a child-first mobile experience, aim for roughly 44–48px for primary controls where feasible, rather than treating the AA floor as ideal. | Medium | Audit actual hit bounds, not only icon artwork. Enlarge transparent padding to preserve pixel-art appearance. Dense map pins need an equivalent list/card target. Test coarse-pointer devices and short viewports. |
| **Responsive mobile-first hierarchy and no clipped critical content** | Phones are a target; planet HUD has compact max-height regions, and narrow screens plus translated labels can hide important information. | High | Use fluid containers and deliberate portrait/landscape behavior; allow scroll instead of cropping. Keep launch/next actions reachable. Check 320px/360px widths, tablet, desktop, zoom/text growth and both locales across title, map, planets, cartography and a representative lesson. Do not force all metadata over the 3D scene. |
| **Legible type, contrast and redundant state cues** | Pixel styling is part of the brand, but small labels and color-only active/completed cues can be hard to interpret. WCAG 2.2 SC 1.4.3 specifies 4.5:1 normal text and 3:1 large text. Game accessibility guidance also recommends readable defaults, high contrast and not conveying essential meaning by color alone. | Medium | Check real color pairs, including translucent HUD/backdrops, small metadata and disabled states. Use display/pixel styling for short headings, readable body text for learning. Pair accent colors with icon, label, border, shape or progress semantics. Test over multiple planetary backgrounds. |
| **Keyboard and assistive-technology semantics** for menu, modal, lesson progress and selections | Touch-first must not become touch-only. Native controls, understandable names, focus visibility and predictable menu/modal behavior support keyboard and assistive technology users. | Medium | Preserve semantic links/buttons. Verify visible focus, menu expanded state and Escape handling, modal naming/focus behavior, accessible names for icon buttons, and current/selected semantics for section/planet controls. Ensure 3D orbit is not the only route; expose selectable labeled alternatives. |
| **Bilingual resilient layout and labels** | BM/EN is a validated core capability; longer strings must not clip controls or radically relocate repeated navigation. | Medium | Keep next-intl messages as source of truth and localize all refined/new labels and accessible names. Allow flexible wrapping and check the longest BM/EN content on mobile menus, map/planet features and lesson actions. No silent English fallback. |
| **Proportional interaction feedback** | Meaningful actions should acknowledge success and progress without competing with lesson comprehension. | Medium | Establish shared **small / medium / major** tiers. Small: pressed/tap state, optionally quiet tick. Medium: eased selection or short completion highlight. Major: star/rocket celebration only for lesson/world graduation. Use a few compatible cues per action (visual state + short ease + optional sound), return quickly to rest and keep input responsive. Avoid routine screen shake and frequent flashes. |
| **Reduced-motion and static feedback equivalent** | Added motion can distract or trigger discomfort. W3C WCAG SC 2.3.3 is AAA, but the guidance is directly relevant: interaction-triggered nonessential motion can be disabled or reduced using system preference. | Medium | Honor prefers-reduced-motion in CSS/JS; suppress or shorten nonessential transitions and ambient movement while retaining completion/status as a static highlight, icon and text. Add an explicit setting only if OS preference does not cover the app's motion needs. |
| **Consistent visual system and interaction states** | Visual consistency clarifies what is interactive and repairs the gap between the pixel-art shell and telemetry HUD without replacing the brand. | Medium | Normalize a compact set of tokens/patterns: pixel border depth, spacing, type scale, button sizes/states, focus ring, panels and progress. Keep a stable baseline with restrained planetary accents. Verify default, hover, pressed, focus, disabled, selected, completed and error states. |
| **Feedback tied to existing progress state** | Learners need reassurance that an action changed progress and that local completion persists. Stars and completed count already exist; duplicating them risks confusion. | Low–Medium | Use current local progress model; visibly and accessibly react to completion, avoid competing score/currency, and verify reload behavior and first-load hydration. No new streaks, penalties or save system. |

## Differentiators

Good additions after the table stakes pass. Select sparingly; delight must not become another mandatory system.

| Feature | Value Proposition | Complexity | Dependencies / Notes |
|---|---|---:|---|
| **Resume-aware “Continue learning” recommendation** | Returning students can resume the next incomplete Earth lesson/current curriculum destination without remembering whether they entered via map, planets or lesson. | Medium | Existing localStorage completion and ordering. Show continue plus secondary explore. Define zero-progress, all-complete and stale-storage behavior. Preserve direct routes. |
| **One Peromfu orientation/success cue** | A short character message can clarify the next action, a map marker or why an answer worked, strengthening the existing identity. | Medium | Reuse artwork and localized content. Keep concise, dismissible and non-blocking; never make instructions speech-only or overlay every screen. Avoid new curriculum authoring. |
| **Meaningful map/planet progress states** | Available, started, completed and capstone states can help learners understand the 5-world / 7-region structure. | Medium–High | Requires authoritative existing curriculum and progress rules. Use redundant visual cues; do not add unconfirmed access gates or locked routes where content is presently reachable. |
| **Touch/list alternative to 3D discovery** | Labeled planet and region cards complement orbit/drag, helping touch and keyboard users discover that objects can be selected. | Medium | Existing planetary data and scene. Expose equivalent selectable controls and brief instructions; avoid a second navigation taxonomy. |
| **Reduced animation / hide ambient movement setting** | Families may need stronger control than OS defaults while others enjoy the space atmosphere. | Medium | Reuse settings and client preferences only if system reduced-motion is insufficient. Persist preference; verify it. Do not add a settings panel for a single redundant toggle without a clear need. |
| **Gentle contextual hint instead of mandatory walkthrough** | Just-in-time guidance can teach selection, orbit or lesson paging without lengthening the title intro. | Medium | Dismissible and replayable. Existing affordances first; follow game accessibility guidance to provide contextual help without compulsory onboarding. |
| **“Saved on this device” reassurance** | Clarifies the local-only persistence model for families and avoids implying cloud sync. | Low | Existing localStorage; localized, accurate copy. Optional if persistence copy is being revisited, not a new save UI. |

## Anti-Features / Deferred Items

| Deferred Item | Why Avoid in v1.3 | Instead |
|---|---|---|
| Full visual rebrand, remove pixel art/planetary world or rewrite core routes | Contradicts explicit identity and scope constraints; discards v1.2 flows. | Refine hierarchy, shared tokens and states within existing style. |
| New progression economy (XP, streaks, inventory, leaderboards, daily rewards, failure penalties) | Adds state/product rules and distracts from prompt learning and UX goals. | Improve communication of current stars and completion. |
| Accounts, cloud saves, multiplayer or paid live AI | Explicitly out of scope and incompatible with static-first/no-server constraints. | Keep local persistence and precomputed interactions. |
| New curriculum/levels or assessment redesign | v1.3 is refinement, not pedagogy/content expansion; raises bilingual and regression burden. | Improve presentation of existing lessons and subjects. |
| High-intensity shake, frequent flashing, persistent particles or autoplay sound | Can be noisy, inaccessible and disproportionate to learning interactions. | Brief tiered feedback; static/reduced-motion alternative; reserve a bigger flourish for graduation. |
| Make orbit/drag or precise map pins the only way to choose | Gesture precision and hover dependence reduce mobile/keyboard access. | Keep map and 3D as expressive affordances, with labeled card/list alternatives. |
| Mandatory long onboarding, age gate or parent dashboard | Not established by the milestone; creates new friction and data/surface scope. | Maintain one obvious start path and concise explanation; revisit only if user testing identifies a need. |
| New UI or animation dependency | Existing React/Tailwind/CSS/Three.js stack is sufficient; extra library risks bundle/static closure without solving a stated need. | Add reusable CSS/component patterns and keep `npm run verify`/closure checks green. |
| Formal WCAG conformance claim based on desk research | A source review and automated checks cannot establish full conformance, especially for 3D content or child usability. | State concrete accessibility checks and open testing gaps honestly. |

## Feature Dependencies

```text
Existing local progress + curriculum order
  → Current/continue recommendation and map progress state
  → World → region/year → lesson-section location cues
  → Clear next action and return/back destinations

Shared button, panel, typography and status tokens
  → Consistent title/map/lesson/planet controls
  → Auditable focus, selected, disabled and completed states
  → Cross-screen visual polish

Responsive layout + flexible bilingual sizing
  → Touch target audit
  → Usable narrow-screen planetary HUD and lesson navigation
  → BM/EN, zoom, width and orientation verification

Discrete action/completion events
  → Small/medium/major feedback tiers
  → Reduced-motion and static equivalent
  → Additional persisted preferences only if needed

Planet/feature data + accessible list alternative
  → Discovery without drag-only interaction
  → Selection → details → mission launch route preserved
```

## MVP Recommendation

Prioritize:

1. **Journey clarity:** show current location, one recommended start/continue action and an explicit explore alternative. Keep `/map` and `/planets`; base recommendations only on verified client progress.
2. **Responsive/accessibility baseline:** touch-friendly controls; labeled keyboard-reachable selections; contrast and non-color-only status; scrollable rather than clipped bilingual layouts; reduced-motion-safe transitions. Start with header/menu, map and lesson navigation, then the planetary HUD.
3. **Consistent refinement and feedback:** shared pixel/planet tokens and states; restrained feedback on selection, section completion and graduation with static/reduced-motion equivalents.

Defer new worlds/lessons, score systems, sync/accounts, expanded onboarding, animation packages and ambitious 3D cinematics. Start with title → map → lesson, then verify the planetary path as its own responsive surface.

## Roadmap Implications

Recommended dependency-aware order for planning:

1. **Journey and shared control language** — inventory the flow and define location/next-action hierarchy plus reusable button, progress and selected states. Establishes what visuals need to reinforce.
2. **Phone-first responsive/accessibility pass** — apply shared patterns to title/header, map and lesson navigation, then planetary explorer/cartography; check targets, focus, contrast, locale expansion and content overflow. The 3D HUD needs focused narrow-screen testing.
3. **Proportional feedback and visual finish** — map existing actions to feedback tiers; honor reduced-motion and audio mute; align typography, spacing and component states. Avoid introducing new game mechanics.
4. **Regression and child-focused walkthrough** — verify local progress and BM/EN, inspect static export/routes, test device sizes and (if available) observe children/educators through start → choose → lesson → completion. Iterate on observed confusion rather than adding features.

The ordering is intentional: resolve the journey and interaction states before animating them; validate shared responsive components before final polish. Static export, import closure, vocabulary checks and existing `npm run verify` remain release gates. No proposed table-stakes feature requires a server or domain-model rewrite.

## Verification Checklist for Implementation

- **Journey:** Can a first-time learner identify a recommended start and explore option? Can a returning learner resume? At every screen, can they identify where they are and how to go back/forward?
- **Touch/responsive:** Test 320px/360px widths, tablet, desktop, portrait/landscape, coarse pointer and browser zoom/text enlargement. Aim for 44–48px primary targets with spacing; no essential content clipped or hidden by an overlay/safe-area edge.
- **Keyboard/accessibility:** Tab/Enter/Space reaches core actions; focus stays visible; menu and modal close predictably; progress and selection are semantically represented; 3D orbit has an equivalent selection route; no essential status relies on color alone.
- **Visual:** Verify text contrast against real surfaces and changing planet backdrops, plus consistent buttons/panels and all states. Check both locales, not only flat component captures.
- **Motion/feedback:** Meaningful actions acknowledge without delaying input; tier intensity is proportional; large effects are rare; system reduced-motion produces a static equivalent; audio is not required to understand results.
- **Regression:** Check first load, completed progress, reload, locale switching, all 23 lessons, `/`, `/map`, `/planets`, assets and static output. Add no runtime/server dependency.
- **Qualitative:** Automated tests cannot tell whether primary pupils understand labels or find the game overwhelming. A short moderated child/teacher walkthrough is valuable; record unresolved issues rather than overstating validation.

## Sources and Confidence

- **High, project-specific:** `.planning/PROJECT.md` (milestone and constraints); inspected `kids-home-content.tsx`, `kids-header.tsx`, `settings-modal.tsx`, `planetary-hud.tsx`, `level-slides.tsx`, `globals.css`, existing progress/planet modules and `package.json`. Statements about present app behavior are source-code observations.
- **Medium, accessibility baseline:** W3C, [WCAG 2.2 Understanding SC 2.5.8: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), updated 2026-11-02. Sets 24×24 CSS px or spacing exception; notes larger targets improve ease and points to 44×44 enhanced target for important controls.
- **Medium, practical touch guidance:** web.dev, [Accessible tap targets](https://web.dev/articles/accessible-tap-targets). Recommends approximately 48 device-independent px and ~8px separation; suggests detecting coarse input capability rather than guessing from viewport width. The fetched article extract did not show publication date; this is usability guidance, not WCAG's normative minimum.
- **Medium, motion:** W3C, [WCAG 2.2 Understanding SC 2.3.3: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), updated 2025-09-16. AAA criterion; guidance supports disabling interaction-triggered nonessential motion or respecting the OS preference.
- **Medium, cognitive accessibility:** W3C, [Cognitive Accessibility at W3C](https://www.w3.org/WAI/cognitive/), updated 2024-04-25. Summarizes WCAG-relevant navigability, readable content, predictability and informative supplemental guidance. It distinguishes standards from non-normative Content Usable material.
- **Medium, contrast:** W3C, [WCAG 2.2 Understanding SC 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), updated 2026-10-04; 4.5:1 for normal text and 3:1 for large text.
- **Medium, game checklist (not a conformance standard):** [Game Accessibility Guidelines — Full list](https://gameaccessibilityguidelines.com/full-list/), accessed 2026-11-09. Helpful checklist for readable defaults, clear language, user-paced text, high contrast, redundant visual cues, touch controls and contextual help.
- **Applied design concepts, not web API authority:** requested Impeccable concepts favor preserving incumbent identity during refinement; game-feel favors brief, eased, importance-tiered feedback that returns to rest; game-ui-ux favors responsive layouts, explicit focus and stable screen flow. These are adapted as principles for this Next.js browser app, not literal Godot/Unity implementation instructions.
