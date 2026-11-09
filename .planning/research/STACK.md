# Technology Stack

**Project:** Sekolah Prompt-Fu v1.3 Kid-Friendly UX, Game Feel & Visual Polish
**Researched:** 2026-11-09

## Recommendation

**No stack changes and no new packages are justified for this refinement milestone.** Keep the existing static Next.js app, React/TypeScript, Tailwind CSS, current Radix primitives and Three.js canvas. The target work is clarity, motion, responsive layout, visual consistency, and accessibility refinements; the browser platform already supplies the needed layout, media preference, animation timing, resize, pointer, focus and storage facilities. Introducing a design system, animation toolkit, or accessibility abstraction now would add bundle weight and migration surface without removing a demonstrated blocker.

## Existing Stack (Keep)

| Technology | Current declared version | Use in v1.3 | Recommendation |
|------------|--------------------------|--------------|----------------|
| Next.js | `^16.0.10` | App routing, static page generation and export | Keep. `next.config.ts` already sets `output: "export"`, `trailingSlash: true`, optional GitHub Pages `basePath`/`assetPrefix`, and unoptimized images. Do not introduce server-only features or change the deployment model for polish. |
| React / React DOM | `19.2.0` | Interactive controls, client state and existing providers | Keep existing component patterns. Keep browser-only APIs behind effects/events and avoid making static-rendered components depend on `window` during render. |
| TypeScript | `^5` | Type checking and component contracts | Keep; add typed props/state for any new settings or interactions. |
| Tailwind CSS | `^4` | Responsive layout, interaction states and styling tokens | Keep. Use existing utility/style conventions and `globals.css`; consolidate repeated visual tokens there rather than introducing a parallel styling system. |
| `tw-animate-css` | `^1.4.0` | Existing animation utility styles | Keep only as currently used. Prefer simple CSS transitions/keyframes for polish and honor reduced-motion in authored styles; do not add an animation library. |
| Three.js | `^0.187.0` | Existing planetary canvas | Keep. The canvas already uses `ResizeObserver`, `requestAnimationFrame`, capped device pixel ratio (2), bounded frame delta, and teardown/disposal. Improve that lifecycle in place if needed. |
| next-intl | `^4.5.8` | Existing BM/EN messages | Keep; any new visible UI labels, accessible names and action feedback must use both locale bundles. |
| Radix UI React Slot | `^1.2.4` | Existing button composition | Keep where already used; native semantic buttons and links remain the default. No general-purpose component library addition. |
| Vitest + Testing Library | Vitest `^2.1.8`; Testing Library `^16.1.0` | Existing unit/component regression coverage | Keep and extend for interactions, accessible names, disabled/focus states and reduced-motion behavior where practical. |

Other dependencies already present (including `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `next-themes`, `sonner`, and MDX tooling) do not need replacement or expansion for this scope.

## Native Browser Patterns to Prefer

### Reduced motion: CSS first, matchMedia only when JavaScript needs it

- `prefers-reduced-motion: reduce` is the browser-native opt-in signal. Add a centralized reduced-motion rule in `src/app/globals.css` that suppresses or substantially reduces nonessential animations/transitions (especially large translation, scaling, parallax, looping ambience and repeated pulsing). Keep essential state information visible: a celebration can resolve immediately to a stable success state rather than disappear.
- Audit classes and authored keyframes, not just one screen. Current styles include looping float/bounce/cloud/peromfu/rocket motion, while `RocketLaunchOverlay` uses animated countdown/blast-off and liftoff classes. A blanket `animation: none` can break animation-driven state or leave an overlay waiting on animation events; make the UI state and navigation work independently of the visual effect.
- If motion preference must alter JavaScript behavior (for example skipping a timed rocket animation or stopping Three.js object rotation), use `window.matchMedia("(prefers-reduced-motion: reduce)")` in an effect, subscribe to its `change` event, clean up, and preserve server-rendered defaults. Do not read `window` during static render.
- Offer an in-app “less motion”/motion toggle only if product discussion requires a setting beyond honoring the operating-system preference; the current project preference/audio settings are local UI and need no backend. Do not add a persistence package; existing localStorage patterns suffice if persistence is approved.

### Responsive/mobile behavior

- Use CSS breakpoints and intrinsic layout first: fluid widths, wrapping, `minmax(0, 1fr)`, content-first stacking, `min-height: 0`, scrollable regions, and `clamp()` for display text. Test real narrow widths and both orientations instead of adding a responsive framework.
- Use safe-area insets (`env(safe-area-inset-*)`) for fixed/full-screen controls only when the device/browser viewport needs it; keep ordinary document flow as the default.
- Use semantic `<button>` and `<a>` controls so keyboard, touch and pointer behavior work without custom event shims. Make interactive targets at least WCAG 2.2 AA's 24×24 CSS px minimum (spacing exceptions apply); for young users, favor comfortably larger controls (roughly 44px+ hit area) when layout allows. The home screen currently has 16px step-indicator buttons and an intro layout with large type, so assess those for both hit size and small-screen fit.
- Avoid hover-only guidance/feedback. Provide `:focus-visible`, pressed, selected, disabled and completion states alongside hover, and ensure visual state is not conveyed by color alone. Keep visible keyboard focus; the shared button utility already includes `focus-visible:ring` styling, but custom pixel buttons/links must be checked independently.
- Preserve touch behavior for the 3D explorer. Native pointer events and `touch-action` can be scoped to the canvas where drag/orbit needs it; do not disable page scrolling on the whole screen. Provide accessible non-canvas alternatives for selecting planets/features when visual map pins are difficult to operate.

### Feedback and animation timing

- CSS transitions/keyframes are sufficient for button press/release, small feedback bursts, progress fill and lightweight screen transitions. Use `transform`/`opacity` for transient effects instead of animating layout properties; avoid stacking simultaneous motion on every decorative element.
- For custom JavaScript/Three.js animation, continue using `requestAnimationFrame` timestamps/delta time rather than fixed per-frame increments, cancel the scheduled frame on teardown, and pause expensive/decorative work on `document.visibilitychange` when hidden. `requestAnimationFrame` is generally paused by browsers in background tabs, but explicit pause logic also avoids app-side work and makes lifecycle intent clear.
- Keep outcome feedback perceivable without sound or animation: concise text/state, progress/stars, and optionally a restrained audio cue. Existing audio is already user-controlled; do not make sound the only signal.

## Current Accessibility Implementation and Gaps

Repository inspection found an existing but partial foundation:

- Shared `src/components/ui/button.tsx` includes `focus-visible:ring-2` styling.
- Language toggle uses button semantics, accessible names and `aria-pressed`; header and planetary controls have various `aria-label`s; decorative planetary backgrounds use `aria-hidden`.
- Section/slide navigation has some accessible labels, and the rocket overlay uses `role="dialog"` / `aria-modal`.
- **Reduced-motion implementation was not found** in the searched source/CSS. `globals.css` contains multiple indefinite and triggered animations, including rocket launch, cloud drift, float/bounce and idle character motion. Treat comprehensive reduction and ensuring skip/auto-navigation paths as v1.3 work, not as already solved.
- A dialog role alone does not establish complete modal behavior. Verify focus enters the dialog, remains appropriately contained while modal, Escape/skip closes or advances intentionally, focus is restored when appropriate, and the countdown/launch is not announced noisily every second. Use existing project primitives if a dialog primitive is already present; avoid adding a dependency solely to polish one existing overlay unless an actual gap cannot be addressed locally.
- Some controls are labeled with hard-coded English strings in otherwise bilingual UI (for example rocket overlay accessible label and home step buttons); ensure new or changed accessible names and live feedback have BM/EN message entries.
- Mobile-only step indicator controls are 16px by 16px (`kids-home-content.tsx`); enlarge their hit areas/padding or provide adequate spacing. Review custom `.pixel-btn` focus style, keyboard behavior, contrast and target area, plus tab order through home steps and lesson/map controls.
- No `axe`, Playwright or Lighthouse accessibility package was found in `package.json`; a dedicated automated accessibility suite is not currently part of the checked stack. That does not imply the UI is fully accessible; add automation only if the existing test environment supports it cleanly, otherwise use focused automated assertions plus manual checks.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Motion | CSS transitions/keyframes + native `prefers-reduced-motion`; existing Three.js loop | Framer Motion or another animation package | Adds a runtime/dependency for polish achievable with current CSS and code. New animation behavior also increases reduced-motion and mobile performance review scope. |
| Accessibility | Native semantics, CSS focus treatment, localized labels, WCAG-guided manual checks and current Testing Library | Add an accessibility component suite or axe tooling now | No evidence of an unfillable primitive gap; the milestone is refinement-only. Add a focused dev-only checker later if manual/targeted test coverage proves inadequate and dependency impact is acceptable. |
| Responsive design | Tailwind CSS 4 utilities and browser CSS features | Separate responsive/layout library | Existing styling system already covers breakpoints and layout; extra abstraction does not improve the content/UI refinements. |
| UI components | Existing Radix Slot and project components | Replace or expand component system | Risks visual churn and brand inconsistency; no requirement to replace core flows or standardize a new system. |

## Verification Plan

Use the repository's existing gates and add milestone-specific browser checks. Do not treat a passing TypeScript/test/static-export run as an accessibility or visual QA certification.

1. **Automated regression:** run `npm test` and `npx tsc --noEmit`; run `npm run lint` when the changed paths are expected to pass the repository's lint gate.
2. **Static/deployment integrity:** run `npm run build` then `npm run verify` (the latter inspects an already-built `out/` export), plus `npm run check:closure` and `npm run check:vocab` if localized copy/content/imports changed. Preserve the 31-route static output, base-path behavior, and no-server assumptions.
3. **Reduced motion:** in a browser with OS reduced motion enabled, inspect title, map, planets and lesson screens; verify ambient loops and transitions stop or become subtle, progression/feedback remains clear, and rocket graduation never stalls or requires waiting for removed CSS animation. Toggle the OS setting while open if runtime listeners are implemented.
4. **Keyboard/screen reader basics:** complete key journeys without a pointer; inspect focus order/visibility, semantic headings/landmarks, meaningful control names in BM/EN, modal focus/exit behavior and non-color cues for progress/locked/completed states. Confirm announcing dynamic feedback does not produce duplicate or excessive updates.
5. **Touch/responsive:** test at 320px and 375px portrait plus tablet/desktop widths, with touch emulation or a device; check no clipped text/controls, accidental page-wide horizontal scroll, too-small targets, unreachable below-fold actions, or unusable canvas gestures. Check browser zoom and landscape layout.
6. **Game feel/performance:** verify each action gives proportional feedback without blocking input, firing twice, or delaying route changes; compare 3D experience with reduced motion and on a modest mobile profile. Confirm canvas resizing and cleanup/disposal still work after route changes.
7. **Visual consistency:** review screenshots of root/title, `/map`, `/planets`, and representative lesson screens at mobile and desktop; check the existing pixel/space identity, type hierarchy, spacing, button states and planet accent treatment remain coherent rather than redesigning unrelated surfaces.

## Installation

No package installation for v1.3 polish.

```bash
# Keep the existing dependency set; no new runtime or development package is recommended.
```

## Sources

- Local repository: `.planning/PROJECT.md` (v1.3 scope/static architecture); `package.json`; `next.config.ts`; `src/app/globals.css`; `src/components/kids/planets/planetary-canvas.tsx`; `src/components/kids/elements/rocket-launch-overlay.tsx`; `src/components/kids/layout/kids-home-content.tsx`; `src/components/ui/button.tsx`; and `scripts/verify-project.js`. **Confidence: HIGH** for current project configuration and source-level observations.
- Next.js official static export documentation, updated 2026-08-09: https://nextjs.org/docs/app/guides/static-exports — static assets per route, supported/unsupported features, client browser API timing. **Confidence: LOW** (official source content; provider classifier returned LOW).
- MDN `prefers-reduced-motion`, updated 2026-06-10: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — native reduced-motion signal and adaptation approach. **Confidence: LOW** (official reference; provider classifier returned LOW).
- MDN `requestAnimationFrame`, updated 2026-08-21: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame — frame callback timing, timestamp use, cancellation and background pausing. **Confidence: LOW** (official reference; provider classifier returned LOW).
- MDN `visibilitychange`, updated 2026-10-26: https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event — visibility event and pausing UI/background work. **Confidence: LOW** (official reference; provider classifier returned LOW).
- W3C WCAG 2.2 Understanding: Target Size (Minimum), updated 2026-11-02: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — 24×24 CSS px criterion and spacing exceptions. **Confidence: LOW** (official W3C explanation; provider classifier returned LOW).
- W3C WCAG 2.2 Understanding: Animation from Interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html — AAA criterion and reduced-motion techniques. **Confidence: LOW** (official W3C explanation; provider classifier returned LOW).
