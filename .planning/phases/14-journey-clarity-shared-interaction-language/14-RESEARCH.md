# Phase 14: Journey Clarity & Shared Interaction Language - Research

**Researched:** 2026-11-09  
**Domain:** Bilingual client-side journey/navigation UX in Next.js  
**Confidence:** HIGH for current in-repo integration points and locked scope; MEDIUM for UX outcomes, which have not been validated with children.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Keep the existing Start Earth and Explore Planets destinations at equal visual weight; neither is a recommended/primary path.
- **D-02:** Give each destination a direct action label (for example, “Start learning” and “Explore planets”) plus one short explanation. Do not rely on color or icon alone to distinguish them.
- **D-03:** Shorten the current three-step welcome flow to two steps: a welcome screen and a destination-choice screen.
- **D-04:** Fold the “what you learn” message into one concise sentence on the welcome screen. Keep the final screen focused on the two destination cards.
- **D-05:** Retain explicit labeled Back/Next controls between the two welcome steps and a clear step indicator; no swipe-only navigation.
- **D-06:** Use visible text labels as well as icons for Home, Earth map, and planetary hub navigation on both desktop and mobile.
- **D-07:** Show local context in lessons through the current level and section; do not add a global breadcrumb trail.
- **D-08:** Return actions are context-aware: lessons return to their originating map or planetary hub; planetary feature/cartography view returns to solar-system orbit; Home returns to the title screen.
- **D-09:** Preserve saved progress when navigating between these destinations.
- **D-10:** Keep the lesson’s primary Next/Continue action in the existing fixed footer. When it is unavailable because an activity is incomplete, leave the action visible and show a short localized explanation.
- **D-11:** Make lesson section progress explicit with the section title and its position (for example, “Step 2 of 7”), instead of relying on dots alone.
- **D-12:** Provide one short, dismissible tip on first visit to each of the map and planetary screens. Dismissing a tip is per-screen; the tip’s exact placement is open to the planner after inspecting layouts.

### the agent's Discretion
- Exact concise BM/EN wording, provided translations remain natural, complete, and action-led.
- Visual placement and styling of the per-screen tips after inspecting the actual viewport layouts; tips must not obscure primary controls.
- Reuse or refinement of existing components/styles where it preserves the locked behavior and established pixel-art/planetary identity.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within Phase 14 scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CLAR-01 | “A child can identify the primary next action on the title, map/planet hub, and lesson screens without relying on unlabeled icons alone.” [VERIFIED: .planning/REQUIREMENTS.md:9-13] | Existing home cards, map portal, planet selector/HUD mission action, and lesson footer are natural owners; add labels and tests at those boundaries. |
| CLAR-02 | “Navigation labels and instructions use concise, concrete language in both Bahasa Melayu and English, with no silent locale fallback.” [VERIFIED: .planning/REQUIREMENTS.md:9-13] | Add/adjust user-facing keys in both canonical BM/EN bundles and assert both locale renders; avoid hardcoded strings and catch key-fallback text. |
| CLAR-03 | “A child can understand the current location and return to the appropriate previous hub from core screens without losing saved progress.” [VERIFIED: .planning/REQUIREMENTS.md:9-13] | Inspect route provenance, lesson completion/return links, planetary orbit state and existing progress stores; test route transitions with saved local data. |
</phase_requirements>

## Summary

Phase 14 is a refinement of existing client-side routes and components, not a new navigation system. The current app already has title destination cards, a shared header, Earth map, planetary explorer/HUD, a context provider for lesson sections, and localStorage progress. Preserve `/`, `/map`, `/planets`, and `/level/[slug]`, BM/EN, static export, and the existing progress schema. [VERIFIED: .planning/PROJECT.md:6-7,26-34; .planning/ROADMAP.md:11-29; src/app/level/[slug]/page.tsx:11-44; src/app/map/page.tsx:11-16; src/app/planets/page.tsx:18-23]

Plan the work around actual owners: `KidsHomeContent` for the two-step choice flow; `KidsHeader`, `ProgressMap`, `PlanetaryExplorer` and `PlanetaryHud` for location/navigation cues; `LevelContentWrapper`/`NavigationFooter` and the `Section` registry for lesson context, completion messaging and explicit section position. A key gap is that lesson entry context is not currently passed into the level route, while several return/completion actions hard-code `/map`; those must be addressed deliberately to satisfy context-aware return without destabilizing route or progress behavior. [VERIFIED: src/components/kids/layout/kids-home-content.tsx:10-16,174-254; src/components/kids/layout/kids-header.tsx:83-114,141-171; src/components/kids/planets/planetary-explorer.tsx:82-112; src/components/kids/layout/level-content-wrapper.tsx:141-223,252-354; src/components/kids/elements/level-slides.tsx:25-40,69-83; src/components/kids/elements/level-complete.tsx:110-160]

**Primary recommendation:** Keep existing components and semantic links/buttons, put all new/changed UI copy in both BM/EN bundles, define a small explicit and allowlisted lesson-origin contract (including direct-entry fallback), and add focused interaction/localization tests before running the project verification gate. No new package or server capability is indicated. [VERIFIED: .planning/ROADMAP.md:11; .planning/PROJECT.md:6-7,26-34; src/components/kids/layout/level-content-wrapper.tsx:5-6; package.json:7-21]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Welcome and destination choice | Browser / Client | — | The existing welcome flow is local React state; the two existing destinations are links. [VERIFIED: src/components/kids/layout/kids-home-content.tsx:1-16,109-163] |
| Shared Home / Earth map / Planets navigation | Browser / Client | — | Shared header is rendered in the root shell; map/planet-specific controls belong to their route components. [VERIFIED: src/app/layout.tsx:96-113; src/components/kids/layout/kids-header.tsx:83-114] |
| Planet selection and feature/orbit return | Browser / Client | — | Explorer state owns mode and active planet/feature; HUD actions call its callbacks. [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:58-100; src/components/kids/planets/planetary-hud.tsx:8-15] |
| Lesson section position and continue gating | Browser / Client | — | Level wrapper reads section ordering/completion and renders its fixed-footer navigation; provider maintains current section and identity registry. [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:54-60,141-223; src/components/kids/providers/level-context.tsx:52-70,312-335] |
| Saved progress | Browser / Client | Browser storage | Existing progress helpers read/write localStorage; keep navigation independent of writes/reset. [VERIFIED: src/lib/kids/progress.ts:5-22,53-73,199-209] |
| Localized messages | Browser / Client | Build-time message bundles | `next-intl` messages are loaded from locale JSON and changed atomically by the provider. [VERIFIED: src/i18n/request.ts:16-34; src/components/providers/index.tsx:53-64,113-135] |

## Standard Stack

### Core

| Library / mechanism | Current repo version | Purpose | Why use it |
|---------------------|----------------------|---------|-------------|
| Next.js App Router | Declared `"next": "^16.0.10"` | Retain existing static routes and internal links. [VERIFIED: package.json:23-40] | Existing app routes use static params and configured export; no new route needed. [VERIFIED: src/app/level/[slug]/page.tsx:11-15; next.config.ts:19-37] |
| React / TypeScript | Declared `"react": "19.2.0"`, `"react-dom": "19.2.0"`, `"typescript": "^5"` | Local UI state, typed route-origin helper/props, component changes. [VERIFIED: package.json:35-36,61] | Existing components and provider already own ephemeral navigation/section state. [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:58-61; src/components/kids/providers/level-context.tsx:106-118] |
| next-intl | Declared `"next-intl": "^4.5.8"` | BM/EN labels, tips, explanations, and step/section copy. [VERIFIED: package.json:32-34] | Existing components use `useTranslations`; existing message bundles include `kids` namespaces. [VERIFIED: src/components/kids/layout/kids-home-content.tsx:4-12; messages/en.json:58-114; messages/ms.json:58-114] |
| Vitest + Testing Library | Declared `"vitest": "^2.1.8"`, `"@testing-library/react": "^16.1.0"`, `"@testing-library/user-event": "^14.5.2"` | Component and route behavior tests. [VERIFIED: package.json:42-62] | Current tests already cover title/header, planetary interactions and lesson locale/section locking. [VERIFIED: src/__tests__/kids/home-navigation.test.tsx:54-107; src/__tests__/kids/header-navigation.test.tsx:54-100; src/__tests__/kids/planetary-explorer.test.tsx:86-246; src/__tests__/kids/level-locale.test.tsx:300-392] |

### Supporting

| Mechanism | Purpose | Guidance |
|-----------|---------|----------|
| Native `Link` and `button` | Navigation vs local actions | Keep destinations as links and state changes/dismissals as buttons; that matches existing component conventions. [VERIFIED: .planning/codebase/CONVENTIONS.md:65-77; src/components/kids/layout/kids-home-content.tsx:109-163] |
| `localStorage` progress contract | Preserve completion/stars while moving between screens | Use existing `kids-progress` only for learning progress; if persisting tip dismissal, use a separate, clearly scoped preference and do not clear/mutate progress on navigation. [VERIFIED: src/lib/kids/progress.ts:5-22,53-73,199-209] |
| Tailwind and `cn()` | Reuse established visual composition | Maintain pixel-art/planet identity; test long translated labels and narrow layouts as Phase 15 is downstream. [VERIFIED: .planning/codebase/CONVENTIONS.md:26-36; .planning/ROADMAP.md:33-43] |

### Alternatives Considered

| Avoid | Use instead | Tradeoff |
|-------|-------------|----------|
| New router/state dependency or onboarding/tutorial framework | Existing Next links, React state and current providers | Avoids competing ownership and new dependency/static-export risk; no repo evidence requires an additional abstraction. [VERIFIED: .planning/ROADMAP.md:11; .planning/research/SUMMARY.md:20,61-70] |
| Browser-history-only `router.back()` for lesson return | Explicit originating-hub state with a safe direct-entry default | History may be absent or point outside the desired hub on a directly opened static route; an explicit contract is more deterministic. The current map and planetary mission paths differ. [VERIFIED: src/components/kids/elements/progress-map.tsx:534-542; src/components/kids/planets/planetary-explorer.tsx:102-112; src/lib/kids/planets.ts:969-990] |
| Arbitrary return URL query string | Narrow allowlisted origin enum/resolver | Avoids untrusted redirect destinations; current mission resolver already returns hardcoded internal paths. [VERIFIED: src/lib/kids/planets.ts:969-990] |

**Installation:** None. This phase needs no new package; use the installed project stack. [VERIFIED: .planning/ROADMAP.md:11; .planning/research/SUMMARY.md:20]

## Architecture Patterns

### Current user journey and data flow

```text
Title (KidsHomeContent)
  ├── /map ──> ProgressMap ──> /level/[slug] ──> LevelContentWrapper / MDX sections
  │                                              ├── completion/progress → localStorage
  │                                              └── return / next action → hub
  └── /planets ──> PlanetaryExplorer (solar-system mode)
                       ├── select planet → cartography mode / PlanetaryHud
                       ├── orbit return → solar-system mode
                       └── launch mission → /level/[slug] ──> lesson / completion

Shared root shell: KidsHeader + locale/settings providers + PlanetBackground
Localization: next-intl provider ← messages/{locale}.json
```

Current route/component data flow is visible in route pages, root layout and callbacks; the diagram's “return hub” is the desired Phase 14 behavior and must be made explicit for lesson origins rather than assumed from browser history. [VERIFIED: src/app/layout.tsx:96-113; src/app/map/page.tsx:11-16; src/app/planets/page.tsx:18-23; src/app/level/[slug]/page.tsx:32-44; src/components/kids/planets/planetary-explorer.tsx:82-112]

### Likely project touch points

| Capability | Likely files | Planning notes |
|-----------|--------------|----------------|
| Two-step welcome and equivalent Earth/Planets actions | `src/components/kids/layout/kids-home-content.tsx`; `messages/en.json`; `messages/ms.json` | It currently has three steps, two choice cards only on the last step, and a redundant final `/map` CTA; update navigation and tests without elevating either card. [VERIFIED: src/components/kids/layout/kids-home-content.tsx:10-16,92-169,174-253] |
| Named global navigation | `src/components/kids/layout/kids-header.tsx`; `messages/en.json`; `messages/ms.json`; header tests | Desktop links are icon-only for Home/map/Planets; mobile menu has text. The component also has two different links to `/` (logo and “main site”); resolve the duplication rather than introduce more competing controls. [VERIFIED: src/components/kids/layout/kids-header.tsx:45-54,83-114,141-171] |
| Map and first-visit cue | `src/components/kids/elements/progress-map.tsx`; likely a small client-side dismissible-tip primitive; `messages/*.json` | Existing top-centered portal overlays map and existing controls include desktop-only scroll buttons. Inspect rendered layout before selecting tip placement. [VERIFIED: src/components/kids/elements/progress-map.tsx:61-107,204-235] |
| Planet/orbit/cartography navigation and first-visit cue | `src/components/kids/planets/planetary-explorer.tsx`; `src/components/kids/planets/planetary-hud.tsx`; `messages/*.json` | Explorer owns `mode`/selection; HUD's back action changes mode; Earth map is a separate link. Retain this split. [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:58-100,132-238,239-290; src/components/kids/planets/planetary-hud.tsx:52-93] |
| Lesson origin and return | `src/components/kids/elements/progress-map.tsx`; `src/components/kids/planets/planetary-explorer.tsx`; `src/components/kids/layout/level-content-wrapper.tsx`; `src/components/kids/elements/level-complete.tsx`; route/origin helper if warranted | Map links currently use the level path directly, planet launches use `resolveMissionRoute`, footer completion and “coming soon” point to map, and completion also links to map. Keep origin policy consistent across footer, errors/coming-soon, and completion. [VERIFIED: src/components/kids/elements/progress-map.tsx:534-542; src/components/kids/planets/planetary-explorer.tsx:102-112; src/components/kids/layout/level-content-wrapper.tsx:182-185,197-223,331-339,401-415; src/components/kids/elements/level-complete.tsx:123-150] |
| Lesson level/section context and explicit progress | `src/components/kids/layout/level-content-wrapper.tsx`; `src/components/kids/elements/level-slides.tsx`; lesson MDX content or a section-title source; BM/EN messages | Footer already owns current index and total; the Section component currently accepts only `children`, and MDX headings are uneven (some sections begin with a panel/widget, not a heading). Plan a reliable title source, not dots-only relabeling. [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:141-169,252-399; src/components/kids/elements/level-slides.tsx:25-40; src/content/kids/en/1-1-meet-peromfu.mdx:1-17,19-35] |
| Tests | `src/__tests__/kids/home-navigation.test.tsx`; `header-navigation.test.tsx`; `planetary-hud.test.tsx`; `planetary-explorer.test.tsx`; `level-locale.test.tsx`; possibly new tip/origin tests | Reuse real-bundle locale test approach where possible; current home test mocks only English strings, while planetary tests import both bundle JSON files. [VERIFIED: src/__tests__/kids/home-navigation.test.tsx:20-52; src/__tests__/kids/planetary-hud.test.tsx:4-42; src/__tests__/kids/level-locale.test.tsx:300-392] |

### Pattern 1: Deterministic lesson-origin routing

**What:** Define a narrow origin value for map vs planetary hub, pass it from each existing lesson-entry point, and use one resolver to choose the return link. Treat absent/invalid origin as a documented safe default (planner decision), preserve the public path `/level/[slug]`, and never accept an arbitrary destination URL. Include both standard footer return and exceptional/complete states. [VERIFIED: src/components/kids/elements/progress-map.tsx:534-542; src/components/kids/planets/planetary-explorer.tsx:102-112; src/components/kids/elements/level-complete.tsx:123-150]

**When to use:** Any lesson can be entered from more than one hub. Map nodes currently go to levels; planetary mission launches can route subject-specific levels. [VERIFIED: src/components/kids/elements/progress-map.tsx:538-542; src/lib/kids/planets.ts:973-990]

**Example behavior contract (illustrative, not code):**

| Entry context | Lesson return action |
|---------------|----------------------|
| Earth map node | “Earth map” → `/map` |
| Planet feature mission | Planetary hub → `/planets` (optionally restore selected planet only if explicitly scoped and tested) |
| Direct lesson URL or malformed context | Safe default selected by planner; must be deterministic |

The exact query/state mechanism and whether planet selection is restored are open design choices; do not imply they already exist. [ASSUMED]

### Pattern 2: Derive lesson position from the existing Section registry

**What:** Use `currentSection`, ordered section identity and `totalSections` already exposed to `LevelContentWrapper`; pair ordinal text with an explicit, localized title. Keep existing section completion and navigation gating as the authority. [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:54-60,141-169; src/components/kids/providers/level-context.tsx:52-70,312-335]

**When to use:** Lesson footer and current section context. [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:202-223,252-354]

**Caution:** The current `SectionProps` definition is only `children: ReactNode`, and the first two sections in the sampled English lesson start with panels without headings; deriving a universally present title from a heading is not presently guaranteed. A typed title prop/content metadata or another explicit fallback strategy must be planned, with BM/EN parity across lesson MDX. [VERIFIED: src/components/kids/elements/level-slides.tsx:25-40; src/content/kids/en/1-1-meet-peromfu.mdx:1-17; src/content/kids/ms/1-1-meet-peromfu.mdx:1-17]

### Pattern 3: Localized, individually dismissible tips

**What:** Keep one tip per map/planetary screen, text-based and dismissible; maintain separate per-screen dismissed state. Keep preference state separate from progress state. [VERIFIED: .planning/phases/14-journey-clarity-shared-interaction-language/14-CONTEXT.md:29-37; src/lib/kids/progress.ts:5-22,199-209]

**When to use:** First visit to `/map` and `/planets`, per D-12. [VERIFIED: .planning/phases/14-journey-clarity-shared-interaction-language/14-CONTEXT.md:29-37]

**Open decision:** Clarify whether “first visit” means once per browser/device across reloads or once per route mount/session. Existing inspected kid UI has localStorage for progress and music preferences but no existing tip-dismissal convention. Use a separate namespaced preference only after selecting its lifetime; do not tie it to progress reset unless explicitly intended. [VERIFIED: src/lib/kids/progress.ts:5-22,134-141,189-209; src/components/kids/layout/background-music.tsx:73-74,108-113] [ASSUMED]

### Anti-Patterns to Avoid

- **Color/icon-only navigation:** desktop shared header currently renders icon controls without visible labels; add labels on desktop and mobile, not just aria labels/tooltips. [VERIFIED: src/components/kids/layout/kids-header.tsx:83-106]
- **One fixed map return for every lesson:** this fails the locked originating-hub behavior for planetary-origin lessons and can also leave completion/empty-content states inconsistent. [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:182-185,401-415; src/components/kids/elements/level-complete.tsx:123-150]
- **Changing persistence while adding navigation:** navigation should not reset or rewrite saved progress; the progress helpers own durable completion/stars. [VERIFIED: src/lib/kids/progress.ts:53-99,199-209]
- **Hardcoded BM/EN copy in UI components:** put UI copy in locale bundles and test message availability. Existing planetary component has hand-coded locale branches for navigation labels, which are not the preferred new pattern. [VERIFIED: .planning/phases/14-journey-clarity-shared-interaction-language/14-CONTEXT.md:73-79; src/components/kids/planets/planetary-hud.tsx:37-45,70-79; src/components/kids/planets/planetary-explorer.tsx:53-56,180-190]
- **Section ordinal without title, or assuming every section has a heading:** current sections can lack headings; title provenance must be explicit. [VERIFIED: src/components/kids/elements/level-slides.tsx:25-40; src/content/kids/en/1-1-meet-peromfu.mdx:1-17]
- **Using tooltip/title as the sole disabled explanation:** locked decision asks for a visible localized explanation; current Next button only uses a `title` attribute while disabled. [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:312-329]
- **Putting tips over primary controls:** inspect screen geometry and preserve access to map portal / orbit / launch controls; this is explicitly a layout constraint. [VERIFIED: .planning/phases/14-journey-clarity-shared-interaction-language/14-CONTEXT.md:29-37; src/components/kids/elements/progress-map.tsx:61-80; src/components/kids/planets/planetary-hud.tsx:57-93,212-221]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Client route transitions | Custom history/router | Existing Next `Link`/`useRouter` plus a narrowly scoped origin resolver | Preserves the app's route ownership and static-export model. [VERIFIED: src/components/kids/planets/planetary-explorer.tsx:3-6,102-112; next.config.ts:19-37] |
| Durable progress tracking | New navigation-specific progress store or schema | Existing `src/lib/kids/progress.ts` contract | It already owns the `kids-progress` key and completion/stars writes. [VERIFIED: src/lib/kids/progress.ts:5-22,53-99] |
| Localization/fallback logic | Inline language conditionals or custom translation fallback | `useTranslations("kids")` and locale JSON bundles; test BM and EN keys explicitly | Existing user-facing UI convention; missing-key display currently resolves to namespace/key text, making parity testable. [VERIFIED: .planning/codebase/CONVENTIONS.md:65-71; src/i18n/request.ts:35-48] |
| Lesson step cursor | Separate section count/current-index state | Existing `LevelProvider` registry and wrapper navigation context | Section identity order is already centrally computed and exposed. [VERIFIED: src/components/kids/providers/level-context.tsx:52-70,197-228,312-335] |
| Static app server persistence | API/database/account layer | Bundled message JSON, localStorage preferences/progress, existing static routes | Product has explicit static export and no server runtime requirement. [VERIFIED: .planning/PROJECT.md:6-7,26-34; next.config.ts:19-37] |

**Key insight:** Most phase work is correcting language and integration between existing UI boundaries. Adding a new subsystem would increase state divergence and risk violating the locked “preserve routes, local progress, bilingual behavior, static export” constraints without enabling required behavior. [VERIFIED: .planning/phases/14-journey-clarity-shared-interaction-language/14-CONTEXT.md:7-10,75-88; .planning/ROADMAP.md:11]

## Common Pitfalls

### Pitfall 1: Planetary-origin lessons return to Earth map
**What goes wrong:** A learner launched from a planet hub gets sent to `/map` by the ordinary footer, missing-content state or completion CTA. [VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:182-185,401-415; src/components/kids/elements/level-complete.tsx:123-150]
**Why it happens:** `ProgressMap` links to level routes without origin metadata, and completion/return links are currently fixed. Planet mission routing already resolves a lesson route but does not carry hub origin. [VERIFIED: src/components/kids/elements/progress-map.tsx:534-542; src/components/kids/planets/planetary-explorer.tsx:102-112]
**How to avoid:** Define and pass allowlisted origin context from each entry point; exercise map origin, planet origin, direct link, invalid origin, coming-soon and completion. Choose how to preserve selected planet as a separate explicit decision.
**Warning signs:** New footer conditionals infer origin from `document.referrer`, browser history, or lesson slug without a tested product rule. [ASSUMED]

### Pitfall 2: Lesson “title” has no reliable source
**What goes wrong:** Step indicator can show “Step n of m” but omit or misname the current section, especially when sections have no heading or translations differ. [VERIFIED: src/components/kids/elements/level-slides.tsx:25-40; src/content/kids/en/1-1-meet-peromfu.mdx:1-17]
**Why it happens:** Existing section registry tracks order and identity, not title; `Section` props only accept children. [VERIFIED: src/components/kids/elements/level-slides.tsx:25-40; src/components/kids/providers/level-context.tsx:29-36,52-70]
**How to avoid:** Decide one explicit title source that can be authored/validated in both content locales and maps to registered order; do not read arbitrary DOM headings without a well-defined empty-title fallback. [ASSUMED]
**Warning signs:** Empty section names, English title shown in BM, or title mapping shifts after locale switch.

### Pitfall 3: “Both locales” copy is only superficially localized
**What goes wrong:** BM path displays hardcoded English, raw translation keys, or partial instruction strings. [VERIFIED: src/i18n/request.ts:35-48; src/components/kids/layout/kids-home-content.tsx:159-161]
**Why it happens:** Some components hand-branch on `useLocale`; some message-mocked tests return key on omissions; generic translation script checks every JSON catalog but is not an automatic build/test gate. [VERIFIED: src/components/kids/planets/planetary-hud.tsx:37-45; src/__tests__/kids/planetary-hud.test.tsx:13-42; scripts/check-translations.js:13-24,32-50; package.json:7-21]
**How to avoid:** For this scope test the two canonical bundles specifically, assert non-empty BM/EN copy and render the changed screens in both locales. Do not treat a key fallback as valid translated text.
**Warning signs:** Rendered text contains `kids.navigation.*` / `kids.home.*`, `3D Space`, or mixed-language labels. [ASSUMED]

### Pitfall 4: Dismissed tips disappear on one render but return after revisit
**What goes wrong:** First-visit tip contract is inconsistent across map and planets or resets during route switching/reload.
**Why it happens:** No established tip-preference store exists in inspected components; persistence lifetime has not been locked. [VERIFIED: source inspection of `src/components/kids/layout/`, `src/components/kids/elements/progress-map.tsx`, `src/components/kids/planets/`; [ASSUMED] on required lifetime]
**How to avoid:** Decide device/session lifetime and storage failure behavior before implementation; keep map and planets dismissal independent; persist preference separately from learning progress.
**Warning signs:** Both tips share one boolean, dismissal resets stars/section progress, or SSR/client hydration differs because storage is read during render. [ASSUMED]

### Pitfall 5: Two-step welcome still leaves misleading controls
**What goes wrong:** Obsolete third-step copy/features remain, title copy competes with two equal destination cards, or an extra Start button appears as a third primary choice.
**Why it happens:** Existing step index is hard-coded as three and last step includes its own `/map` CTA, with both destination cards. [VERIFIED: src/components/kids/layout/kids-home-content.tsx:12-16,92-169,212-233]
**How to avoid:** Make welcome/choice the only two screens; put concise learning promise on welcome, preserve explicit Back/Next + clear step indicator, and ensure card action labels + explanations are legible and equal-weight. [VERIFIED: .planning/phases/14-journey-clarity-shared-interaction-language/14-CONTEXT.md:16-21]

## Code Examples / Existing Contracts

### In-repo route and storage contracts (verbatim)

The current route entry points are `"/map"` and `"/planets"`, and level routes are `/level/${level.slug}`. The source of these exact values is: `[VERIFIED: src/components/kids/layout/kids-home-content.tsx:109-163]` excerpt: `href="/map"` and `href="/planets"`; `[VERIFIED: src/components/kids/elements/progress-map.tsx:534-542]` excerpt: ``<Link href={`/level/${level.slug}`} className="group cursor-pointer">``.

The progress key is `"kids-progress"`, verbatim from `[VERIFIED: src/lib/kids/progress.ts:5-17]`: `const STORAGE_KEY = "kids-progress";`. Do not reuse it for tip preferences. [VERIFIED: src/lib/kids/progress.ts:5-17]

The existing localized disabled cue is `"Complete the activity first to continue"` in English and `"Siapkan aktiviti ini dahulu untuk teruskan"` in Malay. These strings appear verbatim in `[VERIFIED: messages/en.json:101-105]` and `[VERIFIED: messages/ms.json:101-105]`; the current rendered use is a `title` attribute at `[VERIFIED: src/components/kids/layout/level-content-wrapper.tsx:312-329]`. The phase should keep/revise this wording as visible text, not rely on the title tooltip alone.

### Existing locale test idiom

`planetary-hud.test.tsx` imports `messages/en.json` and `messages/ms.json`, switches its test locale, resolves `kids.planets` keys, and checks the BM rendered action; use this pattern or an equivalent direct parity test for new strings. [VERIFIED: src/__tests__/kids/planetary-hud.test.tsx:4-42,187-223]

### Existing behavior test commands

Focused test files (the baseline invocation passed in this session):

```bash
npm test -- src/__tests__/kids/home-navigation.test.tsx src/__tests__/kids/header-navigation.test.tsx src/__tests__/kids/planetary-hud.test.tsx src/__tests__/kids/planetary-explorer.test.tsx src/__tests__/kids/level-locale.test.tsx
```

**Observed:** 5 files and 59 tests passed. The home link test emitted jsdom’s expected “Not implemented: navigation” stderr when mock anchors were clicked; the suite still passed. [VERIFIED: focused Vitest command run in this session]

## Validation Architecture

`workflow.nyquist_validation` is not explicitly set to false in `.planning/config.json`, so validation architecture applies. [VERIFIED: .planning/config.json:1-12]

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `^2.1.8`; React Testing Library `^16.1.0`. [VERIFIED: package.json:42-62] |
| Config file | `vitest.config.ts`, jsdom, setup file, `.test/.spec` include. [VERIFIED: vitest.config.ts:30-38] |
| Quick run command | `npm test -- <focused test paths>` (`npm test` invokes `vitest run`). [VERIFIED: package.json:7-16] |
| Full suite command | `npm test`. [VERIFIED: package.json:7-16] |
| Project gate | `npm run verify`; its script runs TypeScript and Vitest, and its default mode inspects the already built `out/` tree; build first for fresh export certification. [VERIFIED: package.json:7-21; scripts/verify-project.js:11-26] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CLAR-01 | Two welcome steps and equal labeled routes; desktop + mobile header exposes text; map/planet screens identify a clear action; lesson Next remains visible and has visible incomplete cue. | Component | `npm test -- src/__tests__/kids/home-navigation.test.tsx src/__tests__/kids/header-navigation.test.tsx src/__tests__/kids/planetary-hud.test.tsx src/__tests__/kids/level-locale.test.tsx` | ✅ Existing tests to extend; tip tests likely new. [VERIFIED: listed test files read and focused command passed] |
| CLAR-02 | Changed text exists and is natural/action-led in `en` and `ms`; all changed screens render translated labels without key fallback. | Component + message parity | `npm test -- src/__tests__/kids/planets-i18n.test.ts src/__tests__/kids/home-navigation.test.tsx src/__tests__/kids/planetary-hud.test.tsx` | ✅ Some existing i18n/locale tests; add coverage for new journey keys and welcome BM. [VERIFIED: src/__tests__/kids/planets-i18n.test.ts:35-69; src/__tests__/kids/planetary-hud.test.tsx:187-223] |
| CLAR-03 | Entry from map returns to `/map`; entry from planetary feature returns to `/planets`; orbit button returns to solar-system mode; navigation leaves saved progress intact. | Component/integration + storage | `npm test -- src/__tests__/kids/planetary-explorer.test.tsx src/__tests__/kids/level-locale.test.tsx` plus new origin/progress assertions | ✅ Planet orbit, mission route, footer lock and level completion tests exist; no observed route-origin persistence test. [VERIFIED: src/__tests__/kids/planetary-explorer.test.tsx:156-175,219-245; src/__tests__/kids/level-locale.test.tsx:344-392] |

### Sampling Rate
- **Per task:** focused affected test file(s), under 30 seconds for component scope. [VERIFIED: focused test command completed in 16.04s]
- **Per wave:** `npm test` plus TypeScript check/`npm run verify` appropriate to changed behavior. [VERIFIED: package.json:7-21; scripts/verify-project.js:11-26]
- **Phase gate:** Fresh `npm run build`, then `npm run verify` (or ensure verify's existing-export mode is run after build), plus manual BM/EN viewport review of title/map/planet/lesson and progress reload. Static export is configured as `output: "export"`. [VERIFIED: next.config.ts:19-37; scripts/verify-project.js:16-26]

### Wave 0 Gaps
- [ ] Add test coverage for map vs planet lesson-origin return including direct/invalid context and completion/coming-soon. [VERIFIED: inspected existing origin call sites and tests; no existing test observed]
- [ ] Add tests for first-visit/dismissal independence and chosen persistence lifetime for `/map` and `/planets`. [VERIFIED: source inspection found no tip store]
- [ ] Add explicit BM/EN title/section-position and visible locked-next cue tests; current section suite checks gating but not a localized visible explanation/title. [VERIFIED: src/__tests__/kids/level-locale.test.tsx:300-392]

**Runtime baseline:** `node --version` returned `v24.15.0`; `npm --version` returned `11.12.1`. [VERIFIED: shell probe in this session]

## Security Domain

No auth/session/cryptography feature is in scope; this is static client-side navigation and local preference/progress UI. [VERIFIED: .planning/PROJECT.md:6-7,26-34; .planning/ROADMAP.md:11]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | No authentication feature in this phase. [VERIFIED: .planning/PROJECT.md:6-7,26-34] |
| V3 Session Management | No | No server session/account behavior in this phase. [VERIFIED: .planning/PROJECT.md:6-7,26-34] |
| V4 Access Control | No (for this phase) | No privileged action or authorization boundary is being added. [VERIFIED: .planning/ROADMAP.md:11] |
| V5 Input Validation | Yes, narrow route context | Treat query/origin input as untrusted; accept only an explicit known enum and resolve to hardcoded internal destinations. Current mission helper is documented to return only strict hardcoded routes. [VERIFIED: src/lib/kids/planets.ts:969-990] |
| V6 Cryptography | No | Do not introduce tokens/secrets or cryptography for navigation context. [ASSUMED] |

### Known Threat Patterns for static client navigation

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Untrusted `returnTo` query leading to open redirect | Tampering / Elevation of privilege | Do not accept arbitrary URL; parse only allowlisted origin ID and map to hardcoded internal route. Existing `resolveMissionRoute` uses a switch to fixed internal routes. [VERIFIED: src/lib/kids/planets.ts:969-990] |
| Invalid/stale localStorage values break UI or wipe progress | Tampering | Keep tips state isolated from `kids-progress`; validate parsed preference shape and fail gracefully without clearing progress. Storage access catches errors in existing progress helpers. [VERIFIED: src/lib/kids/progress.ts:53-73,199-209] |

## Environment Availability

This phase is in-repository UI and client-side behavior using already installed dependencies; no external service, database or additional runtime dependency was identified. [VERIFIED: .planning/ROADMAP.md:11; package.json:23-62]

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Tests/build | ✓ | `v24.15.0` in this session | — [VERIFIED: shell probe in this session] |
| npm | Tests/build | ✓ | `11.12.1` in this session | — [VERIFIED: shell probe in this session] |
| npm dependencies | Test suite | ✓ | Installed `node_modules/`; focused suite executed | Reinstall from lockfile if absent. [VERIFIED: focused Vitest command passed] |

**Missing dependencies with no fallback:** None observed. [VERIFIED: phase scope + environment probe]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Lesson origin should be passed by an explicit allowlisted route/query context, with a safe direct-entry default; exact transport and fallback are planner decisions. | Pattern 1 | Incorrect choice may break static deep links or return a learner to an unexpected hub. |
| A2 | “First visit” tip dismissal likely needs persistence beyond one render; storage lifetime is not established by current code or user decision. | Pattern 3 / Pitfall 4 | Tip repeats unexpectedly or persists longer than desired; could create avoidable storage/consent behavior. |
| A3 | Section titles may need authored metadata/title prop because current registry does not expose them and not every section has a heading. | Pattern 2 / Pitfall 2 | Broad MDX edits could become disproportionate or title behavior inconsistent unless fallback is defined. |
| A4 | Direct lesson route with absent/invalid origin likely defaults to `/map`, but no explicit product decision is present. | Pattern 1 | Direct opens may return to a different hub than expected. |
| A5 | Map/planet navigation can preserve saved progress without a write because the current durable progress is localStorage-backed and independent of ephemeral hub mode. | Summary / Validation | Any implementation that remounts/resets provider or modifies storage may invalidate that assumption. |

## Open Questions

1. **How should lesson origin survive navigation while retaining the exact public lesson route?**
   - What we know: map entries directly link to `/level/${level.slug}`; planet launch resolves lesson routes; return/completion links currently target `/map`. [VERIFIED: src/components/kids/elements/progress-map.tsx:534-542; src/components/kids/planets/planetary-explorer.tsx:102-112; src/components/kids/elements/level-complete.tsx:123-150]
   - What's unclear: Query parameter vs session-scoped preference vs another explicit mechanism, invalid/direct-entry behavior, and whether return should restore a selected planet.
   - Recommendation: Lock an allowlisted origin enum and test direct URLs, malformed values, route reload, locale change, footer, completion and coming-soon before implementation.

2. **What is the source of each localized section title?**
   - What we know: section order/count are available, but Section only accepts children; at least the opening sampled sections have no visible heading. [VERIFIED: src/components/kids/elements/level-slides.tsx:25-40; src/components/kids/providers/level-context.tsx:52-70; src/content/kids/en/1-1-meet-peromfu.mdx:1-17]
   - What's unclear: Add title metadata to all lesson sections or infer a heading with fallback; extent of content edits across BM/EN.
   - Recommendation: Choose explicit metadata and consistency checks if title display is required for every step; estimate content updates before splitting tasks.

3. **What persistence lifetime counts as “first visit” for tips?**
   - What we know: dismissal is independent by screen; no tip-dismissal store was found in inspected UI. [VERIFIED: CONTEXT D-12 at 14-CONTEXT.md:29-37; inspected `src/components/kids/`]
   - What's unclear: session vs persistent device dismissal; behavior if localStorage is blocked; whether Settings reset also clears hints.
   - Recommendation: Specify lifetime and failure behavior, store separately from progress, and use separate keys/flags for map and planetary tips.

4. **Do per-screen tips persist only on `/map` and solar-system `/planets`, or also inside planet cartography?**
   - What we know: context says one tip on each “map and planetary screens”; `/planets` has solar-system and cartography modes. [VERIFIED: CONTEXT D-12 at 14-CONTEXT.md:29-37; src/components/kids/planets/planetary-explorer.tsx:58-61,132-290]
   - What's unclear: Whether cartography shares a planetary tip or has distinct first-visit state.
   - Recommendation: Treat `/planets` as one screen unless design review identifies a separate interaction needing its own cue; keep dismiss-per-screen semantics explicit. [ASSUMED]

## Sources

### Primary (HIGH confidence for project facts)
- `.planning/phases/14-journey-clarity-shared-interaction-language/14-CONTEXT.md` — locked behaviors, discretion, boundaries.
- `.planning/REQUIREMENTS.md`, `.planning/PROJECT.md`, `.planning/ROADMAP.md`, `.planning/STATE.md` — requirements, scope and preservation constraints.
- `src/components/kids/layout/kids-home-content.tsx`, `kids-header.tsx`, `progress-map.tsx`, `planetary-hud.tsx`, `planetary-explorer.tsx`, `level-content-wrapper.tsx`, `level-slides.tsx` — live UI and navigation owners.
- `src/app/layout.tsx`, `src/app/map/page.tsx`, `src/app/planets/page.tsx`, `src/app/level/[slug]/page.tsx` — live route/shell boundaries.
- `src/lib/kids/progress.ts`, `src/lib/kids/planets.ts`, `src/components/kids/providers/level-context.tsx` — persistence, mission routing and section context.
- `messages/en.json`, `messages/ms.json`, `src/i18n/request.ts`, `src/components/providers/index.tsx` — locale bundle/runtime behavior.
- `src/__tests__/kids/{home-navigation,header-navigation,planetary-hud,planetary-explorer,level-locale}.test.tsx` — current test approaches; five focused suites passed in this session.
- `package.json`, `vitest.config.ts`, `scripts/verify-project.js`, `next.config.ts` — validation and static-export configuration.

### Secondary (MEDIUM confidence)
- `.planning/research/SUMMARY.md` — milestone-level architecture and UX risks; cross-checked against the live source and phase decisions.
- `.planning/codebase/CONVENTIONS.md` — codebase conventions; cross-checked against current components and tests.

### Tertiary (LOW confidence)
- No external technology or UX claims were needed to establish implementation seams. Child comprehension and usability outcomes remain unvalidated; no formal conformance claim is made. [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH for no-new-dependency recommendation, grounded in repository config and current test pass.
- Architecture: HIGH for component, route, localization, progress and section-registry owners, read directly from source this session.
- Pitfalls: HIGH for observed fixed-map returns, missing visible labels, section-title gap and existing locale fallback mechanics; MEDIUM for user impact until child usability validation.

**Research date:** 2026-11-09  
**Valid until:** 2026-12-09 for stable codebase boundaries; re-check source if route or locale architecture changes before implementation.

## RESEARCH COMPLETE
