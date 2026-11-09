# Architecture Patterns

**Domain:** Static bilingual gamified learning experience for primary-school children; v1.3 is refinement of existing screens and interactions, not a platform rewrite  
**Project:** Sekolah Prompt-Fu  
**Researched:** 2026-11-09  
**Confidence:** HIGH for repository-specific boundaries and constraints; MEDIUM for external accessibility/reduced-motion guidance.

## Recommended Architecture

Keep the existing Next.js App Router, React client components, Three.js/WebGL planetary rendering, next-intl message bundles, and browser-local progress model. Treat v1.3 as a presentation/interaction layer built around the present routes and content contracts. The title, map, planetary hub/cartography, and lesson journey remain separate route-level experiences sharing small design/accessibility primitives; do not fuse them into a new global game-state system.

```text
Static App Router routes (/ , /map, /planets, /level/[slug])
  ├─ Title experience: KidsHomeContent ── Link navigation + analytics events
  ├─ Earth map: ProgressMap ──────────── level registry + progress read model
  ├─ Planetary hub: PlanetaryExplorer
  │    ├─ PlanetaryCanvas (Three.js lifecycle / visual scene)
  │    ├─ PlanetaryHud (semantic planet/feature controls and descriptions)
  │    └─ planet schema / route resolver
  └─ Lesson: LevelContentWrapper + LevelProvider + bilingual MDX
       └─ activity widgets → section completion → LevelComplete
                                          └─ progress store (localStorage)

Shared shell: KidsHeader, locale toggle, settings, planet background,
              design tokens, focus/touch/motion/audio feedback utilities
```

### Component Boundaries

| Component / layer | Responsibility | Communicates with | v1.3 boundary |
|---|---|---|---|
| App Router pages (`/`, `/map`, `/planets`, `/level/[slug]`) | Route composition, static metadata/export | Existing route-level experience components | Keep routes and route intent stable; no server-dependent state or route redesign. |
| `KidsHomeContent` | Intro step state, clear entry choices, title-screen CTA | `next-intl`, `Link`, existing analytics | Refine content hierarchy, step affordances, responsive sizing; keep navigation using real links. |
| `ProgressMap` + map-node/decorative subcomponents | Render Earth level path, map progress, level navigation | `levels.ts`, `progress.ts`, locale strings, route links | Make scrolling and each node discoverable/operable on touch and keyboard; expose progress textually as well as graphically. Keep level ordering/lock rules in domain helpers, not visual nodes. |
| `PlanetaryExplorer` | Own selected mode/planet/feature and route transition orchestration | Planet schema, canvas scene, HUD, router | Remain the sole owner of hub selection state; dispatch selected planet/feature as callbacks, not duplicated state in HUD and scene. |
| `PlanetaryCanvas` and scene builders | Own WebGL renderer/camera/controls/frame lifecycle, raycasts, resizing/disposal | Explorer callbacks and Three.js scene modules | Canvas is an enhancement, never the only route to a planet/action. Keep fallback on WebGL failure, responsive sizing, and complete teardown. |
| `PlanetaryHud` and planet selector | Semantic controls, labels, selected-feature details and mission action | Parent callbacks; localized planet schema | Use native button/link elements and clear selected state; keep all 5 planet choices and all 7 features operable without canvas pointer interactions. |
| Lesson content wrapper + `LevelProvider` | MDX stage rendering, section ordering/completion, in-lesson navigation | MDX widgets, section completion helpers, progress persistence | Retain existing section identity/navigation contracts. Feedback listens to successful completion/action boundaries rather than every render. |
| `LevelComplete` / celebration overlay | Confirm reward state, present stars/next steps, graduation transition | `completeLevel`, level registry, `RocketLaunchOverlay`, router | Preserve idempotent best-star progression; separate celebratory effects from durable completion and navigation. |
| `src/lib/kids/progress.ts` | Existing storage schema and pure-ish read/write domain helpers | Browser `localStorage`, map and lesson UI | Do not put storage reads in render or let component styling mutate stored progress. A store subscription is only warranted if a genuine same-tab stale-screen case is introduced. |
| Shared UI primitives/styles | Focus visibility, control sizing, pixel-panel/button variants, reduced-motion policy | Shared CSS and existing `cn` helpers | Centralize repeated tokens/interaction states; avoid generalizing one-off layout into a new design framework. |
| `messages/{en,ms}.json` | Source of localized labels, helper text, status text and accessibility copy | next-intl consumers | Any user-visible v1.3 addition must be present in both supported locales; do not introduce silent English-only fallback. |

## Patterns to Follow

### 1. Semantic controls are the interaction API; WebGL is visual presentation

The WebGL planet and terrain meshes cannot be assumed to map to independently exposed accessible DOM controls. Provide a parallel, visible semantic control for every meaningful action: planet selector buttons, feature buttons, “return to orbit,” and “launch mission.” The project already has the best starting point: the planet pills and `PlanetaryHud` feature list are HTML controls paired with pointer raycasting. Preserve this symmetry and ensure the canvas is not required to discover or activate a route. For non-visual/decorative canvas content, avoid presenting misleading keyboard focus; describe the purpose of the scene and its controls in nearby DOM content.

Keyboard behavior should come from native links/buttons where possible (Tab/Shift+Tab, Enter, Space for buttons), with a clear `:focus-visible` treatment and logical order. Do not create a custom roving-tabindex/keyboard navigation model unless the controls are deliberately implemented as a composite widget. Touch and pointer use the same action callbacks; never make hover the sole source of explanation/state. Label the currently selected planet/feature using accessible selected/current state, and provide concise localized status updates for important mode/selection changes if visual context otherwise moves without an understandable announcement.

### 2. Keep one authoritative state owner per interaction

Keep local ephemeral UI state near its owner: intro step in `KidsHomeContent`; mode, selected planet, and feature index in `PlanetaryExplorer`; lesson section cursor in `LevelProvider`. The HUD and canvas send intent to `PlanetaryExplorer`; they do not each maintain independent selected state. The progress domain remains the durable authority for completed levels/stars/unlocks, and consumers derive map indicators from it. Avoid adding a global state library or a second copy of progress in presentation components.

```text
User activates semantic control / raycast hit
  → owner callback (Explorer or lesson activity)
  → one state transition or domain command
  → resulting UI and optional short feedback

Successful lesson completion
  → completeLevel(slug, stars) → existing localStorage contract
  → LevelComplete/map derive completion and stars from store
```

For feedback sequencing, use an explicit event/state transition such as `selected`, `section-completed`, `level-completed`, or `mission-launched`. Sound, brief visual confirmation, vibration if already supported and appropriate, and motion should be optional consumers of this semantic event—not hidden side effects duplicated across nodes and containers. Keep effects idempotent: rerendering or React Strict Mode remount should not award stars twice or replay long celebrations as if a new accomplishment occurred.

### 3. Treat persisted browser data as a client-side synchronization boundary

The project’s static-export contract includes build-time prerendering of Client Components. `window`, `localStorage`, WebGL, and media-query APIs therefore remain guarded to browser-only execution (typically effects or user event handlers). Match the existing map approach: render a stable initial/loading state and then hydrate progress client-side, rather than reading localStorage during render and risking build failures or hydration mismatch. Keep writes attached to intentional completion/reset events. Progress remains local to this browser; no server, account, database, or cross-device sync is part of v1.3.

If a local preference subscription is added for reduced motion, sound, or another shared setting, expose it through a narrowly scoped hook/provider and clean up its `MediaQueryList`/storage listeners. Do not build an event bus for effects that can be expressed by the initiating component’s callback and local state.

### 4. Motion and feedback have a common accessible policy

Define a central CSS reduced-motion override in existing global styles for decorative transitions/animations, including title-step slides, hover scaling, bouncing characters, celebration particles, animated progress fills, and planet HUD pulses. For JavaScript/Three.js motion, observe `prefers-reduced-motion` in the canvas/explorer boundary and stop or reduce nonessential orbital auto-motion and cinematic transitions while retaining static scene rendering and user-driven selection. Effects that attach listeners or animation resources must remove them on cleanup. Preserve the information conveyed by the animation (e.g. stars earned, level complete, selected item) in persistent text/icon/state, not motion alone.

Feedback layers should be tiered: quick input acknowledgment on ordinary controls; stronger but brief confirmation on lesson/section progress; largest celebration reserved for level completion/capstone. Keep all meaningful content and next-step controls available when animation is removed, and do not make audio necessary to understand success. Respect the existing audio preference behavior and test sound-disabled paths.

### 5. Responsive layout is a change of composition, not just smaller desktop UI

Start with the narrow viewport and touch interaction. Keep title copy/buttons unclipped at 320–375 CSS px, reserve visible space for primary actions, and ensure long BM/EN labels wrap without covering content. For the map, horizontal scrolling is a valid spatial metaphor, but users need a visible cue, reachable nodes, useful initial position, and accessible scroll controls on mobile as well as desktop. Maintain pointer/touch gesture distinction in the 3D hub so dragging the scene does not accidentally select a planet; equivalent button selection should remain available. For the HUD, ensure its feature list and mission action remain reachable at short landscape heights, not only phone portrait. Avoid fixed overlay placement that blocks scene controls or browser safe areas.

## Data and Event Flow

1. **Build/static route:** Next.js statically emits the existing page routes, messages, and lesson bundles. Initial markup must not depend on browser-only storage or WebGL availability.
2. **Client initialization:** Existing client components mount, load the progress read model or initialize the canvas in effects, and display a stable fallback until ready. WebGL context failure should leave DOM alternatives usable.
3. **Navigation:** Native links move between title, map, planet hub, and lessons. Planet feature mission resolution continues through `resolveMissionRoute`; do not infer lesson routes in pixel-map components.
4. **Lesson interaction:** Widgets update their local interaction state and existing identity-aware section-completion contract. Completing a lesson calls the existing progress command once; display feedback only after the domain transition succeeds.
5. **Progress display:** Map nodes, title resume affordance (if refined), and lesson completion UI read existing `KidsProgress`. They do not become alternate writers of stars or unlocks. A confirmed reset retains existing clear-all behavior and explicit user confirmation.
6. **Locale:** All UI labels/status copy resolve through supported `en`/`ms` bundles and the canonical locale config. Existing locale-specific interaction-state invalidation remains owned by current locale behavior, not visual polish code.

## Accessibility and Input Contract

- All primary actions are native semantic anchors/buttons with meaningful localized accessible names, visible keyboard focus, and a predictable focus order.
- Planet and feature selection is achievable through both visual scene input and equivalent HTML controls; maintain parity in available choices and selected state.
- Touch does not depend on hover. Controls have comfortable hit areas, adequate separation, and support browser zoom/reflow; no gesture is the sole means to access an action.
- Convey locked/completed/current state through text, icon/shape, or label in addition to color. Keep progress and reward feedback legible at small widths.
- Provide reduced-motion behavior for CSS and JS/Three.js animation. Test OS preference changes and preserve an understandable static outcome.
- Keep nonessential sound optional and respect mute/volume controls. Provide visual/text status independent of sound.
- Treat the 3D rendering as an enhancement with a useful DOM-based alternative; canvas loading/error should not strand route navigation.

## Verification Strategy

Use the existing test stack and certification gates; avoid adding a new testing framework for this refinement. Current repository evidence includes Vitest/Testing Library tests for home navigation, map/planet behavior, locale, rocket launch, planetary canvas/HUD, and progress completion; the package scripts include `npm test`, TypeScript checking, closure/vocabulary guards, and `npm run verify` for generated static routes/assets.

| Layer | Verification | Important cases |
|---|---|---|
| Domain/state helpers | Vitest unit tests | Existing progress schema unchanged; best-star-only updates remain idempotent; unlock order and route mapping unchanged; reduced-motion preference changes no durable progress. |
| UI behavior | Testing Library + user-event | Title steps and CTAs by keyboard; map controls and nodes via keyboard/touch-oriented click paths; planet pills, HUD feature list, back and mission actions; focus order and selected state; both `en` and `ms` labels. |
| Browser APIs / lifecycle | Component tests with mocks plus targeted browser smoke tests | localStorage unavailable/empty/corrupt fallback; `matchMedia` reduce/normal and listener cleanup; Three.js initialization failure and cleanup; no duplicate completion/feedback on rerender or Strict Mode. |
| Responsive/manual acceptance | Browser at narrow portrait, tablet, desktop, and short landscape; touch and keyboard passes | No clipped translated text or CTA; map can be explored without desktop-only arrows; no accidental planet selection after drag; all HUD actions reachable; safe-area/scroll behavior. |
| Accessibility | Automated DOM assertions plus manual keyboard and screen-reader spot checks | Native roles/names, focus-visible, logical order, status announcement only when useful, non-color status, static reduced-motion state, WebGL alternatives. Automated tests cannot establish the whole usability of the 3D experience. |
| Release/export | `npm run lint`, `npm test`, `npx tsc --noEmit`, `npm run check:closure`, `npm run check:vocab`, `npm run build`, then `npm run verify` against the built `out/` artifact | Root, `/map`, `/planets`, every registered lesson route and bundled media remain in export; no accidental runtime/server requirement or bilingual content gap. Follow current `verify` contract: build first for artifact inspection. |

Add tests alongside each interaction change, extending the existing named feature tests instead of replacing them with snapshot-only coverage. Mock WebGL in JSDOM as current planetary tests already do; reserve real device/WebGL checks for a concise manual acceptance pass. For visual polish, define concrete screenshots/viewports and behavioral assertions per screen so color/motion adjustments cannot conceal broken navigation.

## Safe Build Order

1. **Baseline and invariants:** Run current tests and build/verify; record current entry paths, progress-store behavior, supported locales, and WebGL fallback. Establish mobile/desktop screenshots and keyboard walkthrough before changing styles.
2. **Shared foundations:** Specify the reusable interaction tokens (type scale, spacing, focus treatment, minimum control hit area), CSS reduced-motion policy, and bilingual status-copy requirements. Avoid refactoring the app shell broadly; make small shared primitives only where repeated behavior demands it.
3. **Title and map clarity:** Refine the lowest-risk DOM-only screens and responsive map operation while retaining routes, Earth-level ordering and progression. Add behavior/accessibility regression tests during implementation. These clarify the path into the more complex 3D hub.
4. **Planet hub/HUD:** Improve responsive layout and make the existing semantic selector/list the reliable primary control path. Preserve the scene callback boundary, raycast drag filter, static mounting guard, and scene resource disposal. Then add reduced-motion handling to the auto-animation/frame behavior.
5. **Lesson and reward feedback:** Reuse the identity-aware lesson completion and current progress commands. Add proportional feedback at successful interaction boundaries and make it independent of sound/motion. Verify repeat visits/upgrades do not double-award or relaunch stale celebrations.
6. **Cross-screen audit and certification:** Check keyboard, touch, BM/EN, reduced motion, short landscape, sound-off, and WebGL-unavailable cases; then execute all existing static-export/quality guards against a fresh build.

This sequence deliberately front-loads shared tokens/accessibility decisions before per-screen visual changes and keeps canvas-sensitive work after simpler routes. Avoid a wholesale simultaneous redesign: it complicates regressions across navigation, localization, and progress without reducing technical risk.

## Anti-Patterns to Avoid

### Making the canvas the only accessible or reliable navigation surface
**What:** A planet/feature can only be selected by clicking a 3D mesh, or keyboard/touch controls select something different from the visible mesh.  
**Why bad:** WebGL contents are not equivalent to normal focusable DOM controls, and drag gestures are poor substitutes for direct selection.  
**Instead:** Keep the current HTML planet pills and HUD list authoritative, and connect raycast hits to their same parent callbacks. Provide a clear fallback when WebGL fails.

### Duplicating progress or selection state in decorative components
**What:** Pixel nodes, HUD buttons, and scene meshes each maintain their own completion/selection values or write localStorage independently.  
**Why bad:** UI diverges, localization/route changes become inconsistent, and completion effects can fire multiple times.  
**Instead:** One owner per ephemeral interaction; existing progress helper is the single durable progress command/read source.

### Reading browser state during render or adding server assumptions
**What:** Direct `localStorage`, `window.matchMedia`, or WebGL reads occur in render/build paths; introducing an API, database, or server-only functionality to coordinate cosmetic preferences.  
**Why bad:** Client components are prerendered for static export; browser-only globals can break build or create hydration mismatch, while server requirements break the product deployment contract.  
**Instead:** Guard browser integration at effect/event boundaries and preserve static-friendly initial markup and local persistence.

### Animation-only feedback and unbounded ambient motion
**What:** Stars, selection, or completion is communicated only by bouncing/confetti/sound, or the 3D planets continuously spin regardless of preference and context.  
**Why bad:** Feedback becomes unavailable to reduced-motion users or mute users and may distract from learning.  
**Instead:** Persist visible semantic state/text; use short, tiered effects; suppress nonessential motion while keeping content and actions present.

### Desktop-only affordances or a “shrink desktop” mobile layout
**What:** Hide map scroll controls on touch devices without a discovery cue, force tiny HUD copy into fixed-height overlays, or rely on hover animation to reveal action.  
**Why bad:** The core journey becomes ambiguous or unusable at narrow widths and mobile/landscape sizes.  
**Instead:** Build around viewport constraints and touch first; keep the map scrollable/discoverable and primary actions visible and reachable.

## Scalability Considerations

This is a static, client-side educational app, so scale means route/content growth, performance, accessibility and maintainability—not concurrent server traffic. Keep these proportional:

| Concern | Current footprint | If worlds/lessons/UI grow |
|---|---|---|
| Route/content count | Existing route registry and bilingual MDX are static build inputs. | Keep lesson metadata/schema canonical; test generated route completeness and locale symmetry rather than adding runtime content service. |
| Progress reads | Small localStorage record read by map/lesson UI. | If multiple mounted views need live same-tab sync, encapsulate storage access behind a small external-store/subscription API; do not preemptively add global state infrastructure. Preserve schema migration discipline. |
| Planet rendering | Five worlds and compact feature sets, with manually constructed scene assets. | Maintain schema-driven DOM controls and defer/non-render offscreen or inactive scene assets if measured cost warrants; profile on low-end mobile before adding complex effects. |
| Localization | Supported `ms`/`en` message catalogs and locale-authored content. | Keep user-facing text in canonical messages/data and add parity/vocabulary checks for each increment; avoid growing hand-written locale branches in components. |
| Animation | Few focused transitions and a single scene frame loop. | Centralize motion preference and test animation budget; stop inactive decorative simulation work rather than layering independent loops/timers. |

## Sources

- Project source of truth: `.planning/PROJECT.md` (v1.3 goal and constraints; read 2026-11-09).
- Repository inspection: `package.json`; `src/app/{page,map/page,planets/page,level/[slug]/page}.tsx`; `src/components/kids/{layout/kids-home-content,elements/progress-map,planets/planetary-explorer,planets/planetary-canvas,planets/planetary-hud,elements/level-complete,providers/level-context}.tsx`; `src/lib/kids/{progress,levels,planets}.ts`; current Vitest feature tests and `scripts/verify-project.js` (inspected 2026-11-09).
- Next.js, “How to create a static export of your application” (updated 2026-08-09): https://nextjs.org/docs/app/guides/static-exports — **MEDIUM** confidence (official docs, version-consistent; confirms static output and browser-API guard requirements).
- React, “Synchronizing with Effects”: https://react.dev/learn/synchronizing-with-effects — **MEDIUM** confidence (official documentation; effects are for external synchronization and require dependencies/cleanup where applicable).
- W3C WAI, Canvas accessibility use cases: https://www.w3.org/WAI/PF/HTML/wiki/Canvas_Accessibility_Use_Cases — **MEDIUM** confidence (W3C task-force use-case material; supports semantic/fallback controls for canvas interaction).
- W3C WAI, “Understanding SC 2.3.3 Animation from Interactions”: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions and techniques C39/SCR40: https://www.w3.org/WAI/WCAG22/Techniques/css/C39 and https://www.w3.org/WAI/WCAG22/Techniques/client-side-script/SCR40 — **MEDIUM** confidence (official WCAG guidance; reduced motion needed for nonessential interaction-triggered animation; SC 2.3.3 is Level AAA).

Research caveat: the W3C canvas accessibility search also surfaced older working-group/wiki material, so this document uses it only for the narrow architectural conclusion to provide equivalent DOM controls, not to claim a specific current conformance technique. WCAG conformance scope/target level was not supplied; validate specific acceptance criteria during phase planning.
