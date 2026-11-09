# Domain Pitfalls

**Domain:** Polishing a bilingual, static-export primary-school learning game/web app
**Researched:** 2026-11-09
**Overall confidence:** MEDIUM

This guidance is scoped to v1.3: improve the existing title, planetary hub, map, and lesson journey while preserving Sekolah Prompt-Fu's established pixel-art/celestial identity, five-world curriculum, flows, local progress, and GitHub Pages deployment. Accessibility and localization findings are cross-checked against W3C guidance; project-specific risks are grounded in the current architecture and existing verification contract.

## Critical Pitfalls

Mistakes that can make the game unusable, lose learner work, or force a visual/technical rewrite.

### Pitfall 1: Desktop-first polish breaks the small-screen learning path
**What goes wrong:** A desktop composition is compressed onto a phone: title actions fall below the fold, planet cards become tiny, map pins are hard to tap, lesson controls compete with content, or fixed overlays hide the active task. Small children often use touch devices and may have less precise motor control than adults.
**Why it happens:** Polishing screenshots at one viewport rewards detail and density; hover states, mouse precision, and wide layouts are mistaken for universal interaction patterns.
**Consequences:** Learners miss navigation or feedback, make accidental selections, or abandon lessons. Horizontal scrolling and tiny targets can undermine the whole learning journey even when desktop looks finished.
**Prevention:** Design and test a narrow-phone layout first, then expand. Keep one prominent next action per screen, let lesson content scroll naturally, place sticky controls only where they do not cover content, and use large separated touch targets (aim for roughly 44 CSS px where practical; WCAG 2.2 AA's target-size criterion is 24x24 CSS px with exceptions). Ensure planet selection and map navigation have tap/click alternatives to drag/orbit gestures. Test portrait and landscape, browser zoom/text enlargement, and the smallest supported viewport.
**Detection:** At phone width, clipped labels, overlapping HUD, controls below an obscuring bottom bar, pin clusters that cannot be selected, forced horizontal scrolling, or functionality available only on hover/drag.

### Pitfall 2: Adding spectacle increases cognitive load and obscures the next step
**What goes wrong:** More cards, stats, glow, lore, animated decorations, simultaneous calls to action, and dense instructions make the game feel busy rather than clearer. Students cannot tell where they are, what is interactive, or what to do next.
**Why it happens:** Visual polish is measured as added detail, while the audience needs predictable structure, concrete instructions, and an obvious learning action.
**Consequences:** Learners spend attention decoding the interface instead of practicing prompt skills; navigation errors and adult assistance rise.
**Prevention:** Preserve a stable screen hierarchy and navigation vocabulary across title → world/region → lesson → completion. Keep one primary action visually dominant; separate optional exploration from required progression; chunk lesson instructions into short steps; label progress in learner-friendly terms; use icons only with text labels when meaning is not obvious. Give immediate, specific recovery guidance instead of only saying “wrong.” Avoid changing control location or meaning between worlds.
**Detection:** Children repeatedly ask what to tap, mistake decoration for controls, overlook the next action, or need to remember instructions from a prior screen. Use brief observation with representative learners rather than equating stakeholder preference with comprehension.

### Pitfall 3: Feedback and celebration block input or trap the learner
**What goes wrong:** Success toasts, reward modals, countdowns, confetti, or animated transitions intercept pointer/touch input, steal focus, prevent retry/continue, or disappear before a child can read them. A long celebratory sequence can feel rewarding once and obstructive on every later replay.
**Why it happens:** Feedback is implemented as an overlay/timer rather than an additive response to the learner's action; duration and input behavior are not tested with children or assistive technology.
**Consequences:** Double taps cause duplicate actions, keyboard focus becomes lost or hidden, learners cannot proceed at their own pace, and lesson progression feels unreliable.
**Prevention:** Make feedback non-blocking by default. Preserve the action's immediate state change and keep Continue/Retry available and operable; if a dialog is genuinely necessary, provide correct dialog semantics, move focus into it, contain/restore focus appropriately, and offer a clear dismissal route. Do not auto-dismiss essential directions or completion details. Prevent repeat submissions while an action is processing without freezing unrelated controls. Announce meaningful state changes accessibly, but avoid announcing every decorative update.
**Detection:** Taps appear ignored during animation, focus lands behind a modal, keyboard users cannot reach the next action, feedback vanishes before reading, or progress only saves after a celebratory animation finishes.

### Pitfall 4: Visual theme is allowed to defeat readability and interaction contrast
**What goes wrong:** Text and controls placed over planet textures, stars, gradients, translucent glass panels, or accent-colored lesson backgrounds lose contrast as the background changes. Pixel fonts, outlines, shadows, and glows may look branded but do not guarantee legibility.
**Why it happens:** Contrast is judged from one screenshot or against a guessed background color, although textured and translucent backdrops vary spatially and by viewport.
**Consequences:** Instructions, progress, focus indicators, and controls become hard to perceive, especially for low vision, glare, or small displays.
**Prevention:** Put essential text on stable opaque or sufficiently solid surfaces; test actual rendered foreground/background pairs for each planet and both locales. Meet WCAG contrast minimums as a baseline (4.5:1 for normal text; 3:1 for large text and relevant non-text UI components/focus indicators). Do not convey selected, locked, or completed state through color alone. Keep visible focus distinct from decorative glow and ensure themed focus rings work on both light and dark backgrounds.
**Detection:** A contrast checker run on the actual composited UI fails, or text/focus becomes difficult to see when a different texture, planet, or state is selected.

### Pitfall 5: Motion and sound become mandatory to understand or complete play
**What goes wrong:** A rocket launch, zoom, shake, parallax, flashing reward, or sound effect is required to notice a state change; continuous animation cannot be paused; music/effects start loudly or lack an obvious mute control. Animation can also induce discomfort or distract from reading.
**Why it happens:** “Game feel” is treated as more movement/audio rather than timely, proportional feedback, and tests run only with sound on and default motion settings.
**Consequences:** Motion-sensitive learners experience nausea or distraction; deaf/hard-of-hearing learners miss feedback; audio-sensitive learners cannot comfortably use the app; reduced-motion settings still receive JS/WebGL movement.
**Prevention:** Keep learning information and success state available without sound or animation. Respect `prefers-reduced-motion` in CSS and JavaScript/Three.js transitions, use a quick static alternative for celebratory sequences, and avoid flashing. Provide persistent, understandable volume/mute controls and remember the learner's choice; never autoplay sound as the only cue. Keep effects short, tied to meaningful action, and non-blocking. Treat reduced motion and muted audio as core test configurations, not edge cases.
**Detection:** A learner must hear/see an effect to know an answer registered; effects restart unexpectedly; reduced-motion preference only affects CSS while canvas/JS continues animating; or volume control is inaccessible or reset on navigation.

### Pitfall 6: A polish refactor regresses static export or saved progress
**What goes wrong:** Browser-only state is read during prerender/hydration, new server-dependent features are introduced, dynamic lesson routes stop being emitted, or a storage-key/schema change silently resets stars/section completion/settings. A progress badge may render from a stale snapshot after client navigation.
**Why it happens:** UI work is assumed to be presentation-only even when components touch localStorage, route generation, hydration boundaries, or shared progress models. Next.js static export prerenders Client Components; `window` and `localStorage` are unavailable during server rendering, and server-dependent features are not supported in export mode.
**Consequences:** GitHub Pages builds fail or ship missing routes/assets; users see hydration errors or lose accumulated learning progress; local development may pass while exported output is broken.
**Prevention:** Preserve the existing static-first boundary and localStorage keys/data contract unless migration is explicit and tested. Gate browser APIs to client execution and keep server-rendered initial markup deterministic. For progress writes, preserve existing semantics and test malformed/empty storage, existing saved records, reload, route changes, and locale switching. Run the repository's full `npm run verify` after changes; inspect generated `out/` routes and static assets, not just dev mode. Avoid adding APIs, redirects, or runtime requirements that need a server.
**Detection:** `next build` or export inspection fails, routes such as `/`, `/map`, `/planets`, or a level slug are missing, console reports hydration mismatch, or a pre-existing localStorage fixture loses stars/completion after polish.

### Pitfall 7: “Refresh” replaces the product's incumbent identity and proven flows
**What goes wrong:** A visual overhaul erases the pixel-art rocket, celestial worlds, established palette, title entry paths, lesson structure, or recognizable language toggle in pursuit of a fashionable generic game/dashboard style.
**Why it happens:** A redesign is easier to communicate through novel screens than by tightening existing hierarchy and feedback; there is no visual baseline or explicit non-regression review.
**Consequences:** Returning learners lose recognition and orientation; existing progression and world logic become inconsistent; polish scope expands into a costly rebrand instead of serving the milestone goal.
**Prevention:** Treat the v1.2 identity and flows as constraints, not incidental implementation details. Inventory the title, `/map`, `/planets`, lesson and completion screens before edits; record elements that must remain recognizable; improve contrast, spacing, consistency, and feedback in place. Use purposeful motion around existing actions rather than replacing them. Review before/after screens in both locales and preserve both title entry paths and the Earth's starting-world learning route.
**Detection:** A returning learner cannot identify the app or find the previous route, world mappings drift from the curriculum, or a polish task requires deleting/replacing rather than improving established behavior without a product decision.

## Moderate Pitfalls

### Pitfall 1: Malay/English strings are squeezed into fixed game chrome
**What goes wrong:** Buttons, HUDs, planet labels, lesson headers, and completion messages clip, overlap, or become too small in one locale. Hard-coded line breaks and text baked into art make a layout impossible to adapt.
**Prevention:** Keep text separate from decorative artwork; use content-sized controls, wrapping and flexible height/width; test actual Bahasa Melayu and English across all target screens at phone widths. Include long-label/pseudo-expanded fixtures in UI tests, and ensure changing locale does not alter the learner's route or progress. Avoid constructing sentences by concatenating translated fragments. Don't “solve” overflow by shrinking important text or truncating an action label.

### Pitfall 2: Focus order and keyboard/touch navigation are sacrificed for custom controls
**What goes wrong:** Canvas planet selection, clickable-looking divs, animated map pins, custom dialogs, or hidden controls cannot be reached or understood without a mouse. Focus indicators are removed or obscured by HUD overlays, and route changes leave focus at the top of the page.
**Prevention:** Use semantic buttons/links for actions, preserve logical DOM order, visible focus, keyboard activation, and a non-drag alternative to orbit/pan. Ensure controls remain reachable at narrow widths and focus is not covered by sticky UI. For meaningful route transitions, provide an understandable heading/landmark and verify focus behavior with keyboard-only navigation.

### Pitfall 3: Theming and animation are optimized at the cost of performance
**What goes wrong:** Large textures, many particles, blur/backdrop filters, simultaneous Three.js scenes, or perpetual animation make low-end phones hot, slow, or unresponsive. An elegant transition can delay lesson content and feedback.
**Prevention:** Keep effects proportional and avoid running decorative animation when offscreen or unnecessary; profile real mobile devices, respect reduced motion, and ensure a non-WebGL/failure state still communicates navigation. Preserve the established bundled asset budget/attribution and check static bundle output after asset changes.

### Pitfall 4: Navigation states and progress indicators are visually ambiguous
**What goes wrong:** Locked, available, in-progress, completed, selected, and mastered regions are communicated only by subtle color, tiny stars, or unexplained symbols. Learners cannot distinguish “not yet available” from “tap did not work.”
**Prevention:** Pair visual state with concise text or accessible labels; give locked items a short explanation; keep a consistent state vocabulary between map, planet hub, and lessons. Do not display progress that updates optimistically and then disappears when the persistence write fails.

### Pitfall 5: Sound and animation preferences do not survive navigation or refresh
**What goes wrong:** The learner mutes audio or chooses reduced effects on one screen, then the next route restarts loud audio or full-screen motion; system reduced-motion preference and an in-app choice conflict unpredictably.
**Prevention:** Define precedence once (system preference should be honored; any in-app control should be explicit and persistent), share the setting across title/map/hub/lesson, and verify a route transition plus reload. Avoid creating a new preference store if one already exists.

### Pitfall 6: A visual pass changes lesson controls without regression coverage
**What goes wrong:** Section completion, widgets, retries, stars, locale-specific MDX rendering, or lesson-complete navigation is accidentally broken while changing button, card, or transition components.
**Prevention:** Preserve the minimum seven-stage and completion behavior where applicable; exercise representative interactive widgets and section completion in both locales. Keep existing route/content tests and add focused regression assertions for any changed shared component. Treat a clean visual screenshot as insufficient evidence of functional correctness.

## Minor Pitfalls

### Pitfall 1: Novel iconography or abbreviated game language is not self-explanatory
**What goes wrong:** Rocket, beacon, star, lock, or “XP” icons have no clear meaning for younger learners; decorative labels use idioms or culturally unfamiliar jokes.
**Prevention:** Use plain bilingual labels for non-obvious concepts, concrete short instructions, and familiar action words. Keep sound, color, and iconography supplementary to text.

### Pitfall 2: Celebration is inconsistent with the importance of the action
**What goes wrong:** Every tiny click triggers a large sound/animation, while meaningful mastery or completion gets no clear acknowledgment. Repetition turns rewards into noise.
**Prevention:** Reserve prominent celebration for meaningful milestones, use restrained confirmation for small actions, and keep reward language specific to the demonstrated learning behavior.

### Pitfall 3: Tiny viewport or enlarged-text edge cases go unreviewed
**What goes wrong:** A layout works at common phone dimensions but fails at 320 CSS px, browser zoom, or user text-spacing settings.
**Prevention:** Include narrow-width, zoom/reflow, and increased text-spacing checks in the visual QA matrix. Avoid fixed heights on text containers and ensure scrolling remains available.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Shared design tokens and visual system | Rebrand drift, themed-background contrast regressions | Audit current palette/type/brand anchors first; define contrast-safe surfaces and focus tokens that work across all five planetary themes. |
| Title screen | Too many competing entry actions; identity disappears; buttons wrap in BM | Keep both `/map` and `/planets` entry paths clear, retain recognizable rocket/celestial identity, test bilingual action labels on phone. |
| Planetary hub / Three.js explorer | Orbit/drag is the only way to interact; motion overload; WebGL-heavy mobile experience | Provide tappable semantic planet choices and reduced-motion behavior; profile mobile; keep world/subject and region selection understandable without 3D manipulation. |
| Map and region navigation | Small beacon targets; state relies on color; selection is confusing for touch and keyboard | Enlarge and space targets, provide text/accessibility labels and selected/locked explanations, support keyboard access and direct tap selection. |
| Lesson screens and interactive widgets | Feedback overlay blocks the task; lesson chrome competes with instructions; completion or retry state breaks | Keep instructions chunked and controls stable; make feedback non-blocking; test keyboard/touch and both locale variants through complete/retry flows. |
| Game-feel and transitions | Rocket/countdown animation blocks progress or ignores reduced motion | Preserve meaning and destination while shortening/skipping motion; allow immediate continuation where safe; verify reduced-motion and muted configurations. |
| Shared component refactor | Static export, localStorage progress, or locale switching regresses | Keep SSR deterministic, retain storage contracts, test reload/route/locale changes with saved state, and run `npm run verify` plus exported-route inspection. |

## Sources

- W3C, [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) — **MEDIUM** (authoritative; key criteria consulted for contrast, focus, target size, and accessibility expectations).
- W3C WAI, [Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/) — **MEDIUM** (authoritative design guidance on clear instructions, predictable behavior, and avoiding/recovering from mistakes).
- W3C WAI, [Understanding SC 2.3.3: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) and [Technique C39: prefers-reduced-motion](https://www.w3.org/WAI/WCAG22/Techniques/css/C39) — **MEDIUM** (authoritative guidance and technique; reduced-motion support is relevant even though 2.3.3 itself is AAA).
- W3C Internationalization, [Text size in translation](https://www.w3.org/International/articles/article-text-size) and [Internationalization Quick Tips for the Web](https://www.w3.org/International/quicktips/) — **MEDIUM** (authoritative guidance on flexible layout, text expansion, and keeping content separate from presentation).
- Next.js, [Guides: Static Exports](https://nextjs.org/docs/app/guides/static-exports) — **MEDIUM** (official docs; confirms static-export constraints and browser API timing for prerendered Client Components).
- Project source of truth: `.planning/PROJECT.md`, `package.json`, and existing `src/lib/kids/progress.ts` / verification scripts — project-specific baseline for static export, localStorage progress, bilingual locales, routes, and regression gates.
