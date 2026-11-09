# Project Research Summary

**Project:** Sekolah Prompt-Fu (Learn Prompting for Kids), v1.3 refinement
**Domain:** Bilingual static educational game UX, accessibility, and interaction polish
**Researched:** 2026-11-09
**Confidence:** HIGH for repository constraints and architecture; MEDIUM for UX recommendations pending child/device validation

## Executive Summary

Sekolah Prompt-Fu is an existing bilingual (Bahasa Melayu/English), static-export Next.js learning game for primary-school students. This milestone should refine the shipped title → map/planet hub → lesson → completion journey, not redesign or expand it. Preserve the recognizable pixel-art rocket and planetary identity, current routes and curriculum, local progress, both entry paths, and GitHub Pages/no-backend deployment. The core UX objective is to make it easy for a child to tell where they are, what they can do next, and what happened after an action—with mobile/touch usability treated as a first-order constraint.

Keep the current Next.js/React/TypeScript/Tailwind, next-intl, Radix Slot, Three.js, and Vitest/Testing Library stack; research found no blocker that justifies a new dependency or architecture. Build a consistent, restrained control and status language around existing components, make recommended next actions clear without removing exploration, and provide semantic DOM alternatives for every meaningful WebGL action. Feedback should be quick and proportional, with the strongest celebration reserved for genuine completion and an equally understandable static outcome when motion or sound is unavailable.

The main risks are mobile layouts that hide or undersize controls, visual spectacle that competes with learning, inaccessible or blocking animation, and accidental regressions to bilingual content, local progress, or static export. Mitigate them by designing and testing narrow screens first, keeping one prominent action per screen, using localized semantic controls and redundant status cues, honoring reduced motion across CSS and Three.js, preserving storage/route contracts, and certifying the built export. Desk research does not establish child comprehension or formal WCAG conformance; validate those claims through targeted manual checks and, if feasible, a consent-appropriate child/educator walkthrough.

## Key Findings

### Recommended Stack

No stack changes or packages are recommended. Use the browser's layout, focus, pointer, media-query, and animation facilities plus the existing React/CSS/Three.js patterns. Keep browser-only APIs behind effects or event handlers so static prerendering remains deterministic; keep localized UI in the existing message bundles and progress in the existing localStorage contract.

**Core technologies:**
- **Next.js 16 App Router + static export:** retain existing routes and GitHub Pages behavior; no server-only features.
- **React 19 + TypeScript 5:** refine existing component boundaries and type new interaction state without adding a global state system.
- **Tailwind CSS 4 + existing global CSS:** reuse and consolidate a small set of visual/focus/motion tokens; CSS transitions and keyframes are enough.
- **Three.js 0.187:** retain the planetary scene as an enhancement, with semantic DOM controls authoritative and lifecycle/disposal intact.
- **next-intl 4 + existing BM/EN bundles:** all changed labels, status messages, and accessible names must be translated in both locales.
- **Vitest 2 + Testing Library 16:** extend current behavior tests; pair them with manual responsive, keyboard, reduced-motion, and visual checks.

No critical new version requirement was identified. Existing static-export, import-closure, vocabulary, typecheck, test, and `npm run verify` gates remain release requirements.

### Expected Features

Prioritize the existing journey and its affordances rather than creating a parallel tutorial or progression system. Keep Earth as the obvious learning start while retaining solar-system exploration as a clear alternative. When supported by the existing progress read model, make a returning learner's next incomplete lesson easy to resume.

**Must have (table stakes):**
- Clear current-location and primary next-action cues on title, map/planet hub, and lessons; preserve a meaningful back/return path and both existing entry routes (CLAR-01/03).
- Concise, concrete, fully localized BM/EN instructions and accessible names with flexible wrapping (CLAR-02).
- Mobile-first composition, unclipped copy/actions, comfortable touch targets (aim for 44–48 CSS px for primary controls where feasible), and usable map/planet/lesson controls at narrow and short-landscape sizes (A11Y-01/02).
- Native semantic links/buttons, logical keyboard order, visible focus, understandable selected/completed states, and non-color-only status (A11Y-03/04).
- Readable contrast on actual themed backgrounds; keep learning text readable rather than relying on pixel display typography for body copy (A11Y-04).
- Immediate, proportional visual response for meaningful selection, answer, progress, and completion states; motion/audio must not block or be the sole signal (FEEL-01/03).
- Reduced-motion behavior for decorative CSS and JS/Three.js animation, with success/progression still explicit and usable (FEEL-02/03).
- A compact shared hierarchy for type, spacing, panels, buttons and states that retains planetary accents and pixel-art identity (VIS-01/02).

**Should have (differentiators):**
- A conditional “Continue learning” recommendation derived from existing local progress, with explore as the secondary choice; define first-use, all-complete, and stale-storage behavior before adding it.
- Brief, localized Peromfu orientation/success cues or contextual hints only where an observed affordance needs explanation; keep them dismissible, concise, and non-blocking.
- A labeled, tappable/list alternative to 3D discovery so planet and feature selection does not depend on orbit, drag, or WebGL.
- More legible available/started/completed/capstone status using the existing curriculum/progress rules; do not introduce new locks or gates.
- Optional “saved on this device” reassurance if persistence messaging is touched; do not imply cloud sync.

**Defer (v2+ or out of scope):**
- Rebrand, route/curriculum redesign, new worlds/lessons/subjects, mandatory long onboarding, or parent dashboard.
- XP, streaks, inventory, leaderboards, penalties, or other new progression economy.
- Accounts, cloud saves, multiplayer, live LLM/API calls, server/database features.
- Large/frequent shake, flashing, autoplay sound, persistent particles, or animation packages.
- In-app text-size controls unless future user testing establishes a need beyond browser zoom (A11Y-05 is deferred).
- Claims of formal WCAG conformance based only on desk research or automated checks.

### Architecture Approach

Keep the current App Router routes and route-level experiences separate, sharing only small visual/accessibility primitives where repetition warrants them. Preserve one owner for each ephemeral selection/lesson state and keep the existing progress domain as the sole durable authority. Treat browser storage/media preferences as client boundaries, preserve stable static markup, and keep all user-facing additions in the canonical locale bundles. Feedback consumes successful semantic state transitions; it must not duplicate domain writes or make effects the source of progress. The planetary canvas remains a visual enhancement with equivalent semantic controls and usable behavior if WebGL fails.

**Major components:**
1. **Title (`KidsHomeContent`) and shared shell (`KidsHeader`, settings):** explain the start/explore choices, location, locale, and consistent primary/secondary control hierarchy.
2. **Earth map (`ProgressMap` and map nodes):** derive progress from existing level/progress helpers; keep scrolling, node selection, state, and return navigation discoverable by touch and keyboard.
3. **Planetary experience (`PlanetaryExplorer`, `PlanetaryCanvas`, `PlanetaryHud`):** explorer owns mode/selection; canvas handles rendering and lifecycle; localized HTML selectors/actions remain the reliable interaction path.
4. **Lesson and completion (`LevelProvider`, MDX widgets, `LevelComplete`/rocket overlay):** retain section/completion contracts and existing idempotent progress writes; attach feedback only to successful actions.
5. **Shared styles, locale messages, and progress helpers:** centralize small repeated tokens/motion policy, keep `messages/en` and `messages/ms` in sync, and avoid a new design framework or duplicated state store.

### Critical Pitfalls

1. **Desktop-first polish breaks the phone learning path** — compose narrow-first; maintain large separated targets, reachable actions, natural scrolling, map discoverability, and portrait/landscape/zoom checks.
2. **Spectacle and density obscure the next action** — keep a stable journey vocabulary, one visually dominant primary action, concise instructions, and exploration as a secondary choice; validate with actual learners if possible.
3. **Feedback traps or blocks learners** — make routine feedback additive and non-blocking; keep continue/retry usable; ensure any necessary dialog has complete focus/exit behavior and never delay durable progress until animation ends.
4. **Theme, sound, or motion becomes the only source of information** — test contrast on real composited planetary surfaces; use text/icon/shape in addition to color; honor reduced motion in both CSS and Three.js; retain sound-independent static outcomes.
5. **Refinement regresses brand, bilingual behavior, saved progress, or static export** — preserve identity/routes/storage contracts, avoid browser APIs during render, test saved-state reload and both locales, and inspect fresh `out/` output with the existing verification gates.

## Implications for Roadmap

Plan a small refinement sequence with explicit cross-screen acceptance; do not make this a simultaneous redesign. The following are roadmap starting points, not a mandate for a particular phase count.

### Phase 1: Shared interaction language and journey clarity
**Rationale:** Decide location, primary action, return path, control hierarchy, and reusable states before applying motion or screen-specific polish. This resolves the central “where am I / what next?” problem and establishes visual/accessibility foundations.
**Delivers:** Brief flow inventory and preserved brand anchors; shared type/spacing/button/focus/status conventions; clearer title and map entry/resume/explore hierarchy; localized labels and tested back/continue behavior. A resume CTA is conditional on authoritative existing progress only.
**Addresses:** CLAR-01, CLAR-02, CLAR-03, VIS-01/02; foundational portions of A11Y-02/03.
**Avoids:** Competing title actions, rebrand drift, new progression state, unlabeled icons, and accidental route/progress changes.

### Phase 2: Mobile-first responsive and accessible core screens
**Rationale:** Mobile is an explicit priority, and shared patterns should be proven on DOM-first surfaces before tackling canvas-specific complexity. Verify translated content and target bounds, not just desktop screenshots or icon size.
**Delivers:** Narrow-phone-first title, map, and lesson-control layouts; touch target/spacing improvements; keyboard/focus and redundant progress states; flexible BM/EN text; then a planetary hub/HUD pass with labeled selector/list alternatives, reachable mission controls, and WebGL fallback parity. Include short landscape, zoom, and scroll behavior.
**Uses:** Existing Tailwind/CSS, semantic native controls, next-intl, `ProgressMap`, `PlanetaryHud` and existing canvas callback/lifecycle boundaries.
**Addresses:** A11Y-01 through A11Y-04, CLAR-02/03, and VIS-01.
**Avoids:** Tiny pins/dots, hover/drag-only operation, clipped BM strings, color-only states, hidden map controls, fixed HUDs that obscure actions, and making WebGL the sole navigation surface.

### Phase 3: Proportional game feel and reduced-motion-safe feedback
**Rationale:** Add feedback only after action/state semantics and reachable controls are clear; otherwise animation can conceal rather than clarify behavior.
**Delivers:** Small/medium/major feedback tiers for successful selection, answer/progress, and meaningful completion; quick visual acknowledgments and optional restrained sound; system reduced-motion handling across authored CSS and relevant JS/Three.js motion; immediate static equivalents and non-blocking completion/rocket behavior.
**Uses:** Existing CSS and `requestAnimationFrame` lifecycle; existing audio preference and completion/progress events; no animation package or new durable game mechanics.
**Addresses:** FEEL-01 through FEEL-03; supports CLAR-01 and A11Y-04.
**Avoids:** Animation-only success, excessive announcements, repeated large celebrations, focus/input traps, double completion, and waiting on CSS animation events to advance.

### Phase 4: Cross-screen visual audit and release certification
**Rationale:** Shared refinement can still diverge across themed surfaces and can regress routes, localization, or saved data; finish with a concrete matrix rather than accepting a polished single screenshot.
**Delivers:** Before/after review at mobile and desktop for title, `/map`, `/planets`, representative lessons and completion; BM/EN, keyboard, touch, reduced-motion, muted, WebGL-unavailable, saved-progress/reload, 320/375px, landscape and zoom checks; tests and fresh static export certification.
**Addresses:** VIS-01/02 and all v1.3 requirements as integrated acceptance.
**Avoids:** Theme-specific contrast failures, unintended horizontal overflow, altered progress semantics, missing lesson routes/assets, locale gaps, and unsupported accessibility/conformance claims.

### Phase Ordering Rationale

- Establish a coherent location/action/state vocabulary before responsive implementation or feedback, so polish reinforces a known journey rather than adding competing signals.
- Start mobile/accessibility validation on title/map/lesson DOM controls, then apply proven patterns to the more complex Three.js HUD; keep the canvas callback boundary and semantic controls authoritative.
- Tie feedback to successful domain transitions and existing progress state; completion must persist independently of animation and remain idempotent on rerender/replay.
- Keep the final visual and technical audit separate enough to catch cross-route/locale regressions, while adding focused tests alongside each changed interaction.
- Preserve all current routes, curriculum and static deployment constraints throughout; no phase needs a server, state-library migration, or new dependency.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (planetary hub/mobile accessibility):** inspect actual HUD/map behavior at narrow portrait and short landscape sizes; test touch-vs-drag selection, focus order, WebGL fallback, and translated labels. Desk research cannot settle the correct composition.
- **Phase 3 (motion and completion/rocket flow):** verify the current animation-driven transitions and modal semantics in the implementation; specifically ensure removing/skipping animation cannot strand progression or cause duplicate launch/completion.
- **Phase 4 (acceptance/validation):** decide whether a child/educator walkthrough is feasible and appropriate, and specify the viewport/device/browser matrix. Formal conformance scope has not been set.

Phases with standard patterns (skip research-phase unless code inspection surfaces a blocker):
- **Phase 1 (shared controls/title/map clarity):** established semantic React controls, existing translations and CSS patterns; validate against current components and flow rather than researching new technology.
- **Static/export regression checks in Phase 4:** existing scripts and project contract already define the gate; run them against a fresh build.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Repository/package/config inspection confirms current versions and static-export constraints; no package additions are justified. External browser/WCAG references are official but agent source classifiers marked several LOW, so recommendations are corroborated by project patterns. |
| Features | HIGH for scope; MEDIUM for UX outcomes | Features map directly to PROJECT.md/REQUIREMENTS.md and inspected screens. Accessibility guidance is supported by W3C/web.dev/game-accessibility sources; there has been no child usability research. |
| Architecture | HIGH | Current route/component/state boundaries and tests were inspected; proposed refinement keeps these boundaries. External accessibility guidance is MEDIUM and does not prove conformance. |
| Pitfalls | MEDIUM | Project-specific risks are grounded in source and deployment contracts; generic child usability/performance impact is plausible but not validated through observation or device profiling. |

**Overall confidence:** HIGH for what to preserve and the safe technical approach; MEDIUM for whether the proposed interaction hierarchy is understood by the target age group until validated with children.

### Gaps to Address

- **Child comprehension is untested:** If participant access and appropriate consent are feasible, test whether primary-school learners can start, locate themselves, choose, resume, and understand success without adult prompting. This is deferred requirement CLAR-04; do not claim usability validation if it is not done.
- **No fixed viewport/device support matrix:** Planning should name representative real devices/browsers or emulation and explicitly include 320/375px widths, touch, landscape, zoom/text enlargement, and both BM/EN strings.
- **WCAG conformance target is unspecified:** Translate relevant criteria into concrete checks; do not claim full conformance based on this research. Manually verify contrast, keyboard/focus, modal behavior, and screen-reader status alongside automated tests.
- **Current modal/rocket and media preference behavior needs code-level confirmation:** Validate focus entry/exit, skip/reduced-motion progression, sound preference continuity, announcement frequency, and animation cleanup while planning/executing affected work.
- **Resume/progress edge cases:** If a continue recommendation is selected, define empty, all-complete, malformed/stale storage and route/locale switching behavior without changing existing local progress schema.
- **Mobile performance is not benchmarked:** Profile the existing Three.js experience on a modest mobile device before adding visual effects; do not infer performance solely from source-level lifecycle safeguards.

## Sources

### Primary (HIGH confidence)
- `.planning/PROJECT.md` and `.planning/REQUIREMENTS.md` — v1.3 goals, validated product constraints, explicit requirements, deferred/out-of-scope items.
- `.planning/research/STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, and `PITFALLS.md` — detailed stack, feature, boundary, risk, and verification research synthesized here.
- Repository files identified by the research: `package.json`, `next.config.ts`, `src/app/globals.css`, existing title/header/map/planetary HUD/canvas/lesson/rocket/progress components, locale messages, current tests, and `scripts/verify-project.js` — current implementation and static-export baseline.

### Secondary (MEDIUM confidence)
- Next.js static export guide: https://nextjs.org/docs/app/guides/static-exports — static route output and server/browser API constraints.
- React “Synchronizing with Effects”: https://react.dev/learn/synchronizing-with-effects — browser synchronization and lifecycle cleanup patterns.
- W3C WCAG 2.2 Understanding: target size, contrast, and animation from interactions: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html ; https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html ; https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html — normative criteria/guidance context; cited criteria are not a conformance declaration.
- W3C cognitive accessibility material: https://www.w3.org/WAI/cognitive/ and https://www.w3.org/TR/coga-usable/ — clear instructions, predictability, and recoverable interaction guidance.
- web.dev, “Accessible tap targets”: https://web.dev/articles/accessible-tap-targets — practical larger-target and spacing advice, used as guidance rather than a normative WCAG floor.
- Game Accessibility Guidelines, full list: https://gameaccessibilityguidelines.com/full-list/ — supplementary game-specific accessibility checklist, not a conformance standard.
- MDN `prefers-reduced-motion`, `requestAnimationFrame`, and `visibilitychange` documentation — native motion preference and animation lifecycle recommendations as referenced in STACK.md.

---
*Research completed: 2026-11-09*
*Ready for roadmap: yes*
