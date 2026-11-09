# Phase 14: Journey Clarity & Shared Interaction Language - Pattern Map

**Mapped:** 2026-11-09  
**Files analyzed:** 19 likely existing/new file targets (including locale bundles and test targets)  
**Analogs found:** 19 / 19 (new helper/component behaviors have adjacent in-repo analogs, but no exact tip or lesson-origin implementation exists)

> Scope is inferred from `14-CONTEXT.md`, `14-RESEARCH.md`, and `14-UI-SPEC.md`; it is not a final implementation file list. Paths marked **conditional** depend on the planner's choice of explicit section-title/origin/tip abstractions. All named source analogs below were verified with `git ls-files` as tracked files.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/components/kids/layout/kids-home-content.tsx` | component | event-driven navigation / local UI state | same file; `src/__tests__/kids/home-navigation.test.tsx` | exact |
| `src/components/kids/layout/kids-header.tsx` | component | request-response navigation / local menu state | same file; `src/__tests__/kids/header-navigation.test.tsx` | exact |
| `src/components/kids/elements/progress-map.tsx` | component | CRUD/read progress + event-driven navigation | same file; `src/__tests__/kids/header-navigation.test.tsx` | exact |
| `src/components/kids/planets/planetary-explorer.tsx` | component | event-driven mode/selection + request-response navigation | same file; `src/__tests__/kids/planetary-explorer.test.tsx` | exact |
| `src/components/kids/planets/planetary-hud.tsx` | component | event-driven actions + request-response navigation | same file; `src/__tests__/kids/planetary-hud.test.tsx` | exact |
| `src/components/kids/layout/level-content-wrapper.tsx` | component | event-driven section state + request-response navigation | same file; `src/__tests__/kids/level-locale.test.tsx` | exact |
| `src/components/kids/elements/level-slides.tsx` | component | transform/section metadata + event-driven navigation | `src/components/kids/providers/level-context.tsx`; same component | role-match |
| `src/components/kids/elements/level-complete.tsx` | component | CRUD progress + request-response navigation | same file; `src/__tests__/kids/level-complete.test.tsx` | exact |
| `src/lib/kids/lesson-origin.ts` (conditional new helper) | utility | transform / route resolution | `src/lib/kids/planets.ts` (`resolveMissionRoute`) | role-match |
| `src/lib/kids/journey-preferences.ts` or equivalent (conditional new utility) | utility | CRUD / browser-storage I/O | `src/lib/kids/progress.ts` | role-match; no current tip store |
| Small reusable dismissible-tip component (conditional; path TBD) | component | event-driven local state + preference I/O | `src/components/kids/layout/settings-modal.tsx`; `src/components/kids/layout/background-music.tsx` | role-match |
| `messages/en.json` | config | static localized-data transform | same file, `kids.home/navigation/map/planets/level` namespaces | exact |
| `messages/ms.json` | config | static localized-data transform | same file, matching English namespaces | exact |
| `src/content/kids/en/*.mdx` (conditional if section names are authored) | model/content | transform | same locale MDX; `src/components/kids/elements/level-slides.tsx` Section registry | role-match |
| `src/content/kids/ms/*.mdx` (conditional if section names are authored) | model/content | transform | same locale MDX; `src/components/kids/elements/level-slides.tsx` Section registry | role-match |
| `src/__tests__/kids/home-navigation.test.tsx` | test | event-driven UI | same file | exact |
| `src/__tests__/kids/header-navigation.test.tsx` | test | request-response navigation | same file | exact |
| `src/__tests__/kids/planetary-explorer.test.tsx` / `planetary-hud.test.tsx` | test | event-driven UI + navigation | same files | exact |
| `src/__tests__/kids/level-locale.test.tsx` / `level-complete.test.tsx` | test | section-state/navigation + progress | same files | exact |
| New origin/tip preference/component tests (conditional) | test | route resolution or storage I/O | `src/__tests__/kids/planetary-explorer.test.tsx`, `level-locale.test.tsx`, `planetary-hud.test.tsx` | role-match |

Files in the test rows are coverage targets, not necessarily all distinct new files. Do not add a route/page or change the existing public lesson route for this phase.

## Pattern Assignments

### `src/components/kids/layout/kids-home-content.tsx` (component, event-driven navigation / local UI state)

**Analog:** `src/components/kids/layout/kids-home-content.tsx` (self-pattern), tested by `src/__tests__/kids/home-navigation.test.tsx`.

**Imports and translation pattern** (source lines 1-8):
```tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { analyticsKids } from "@/lib/analytics";
```

**State/navigation pattern** (lines 10-16, 112-116, 139-143):
```tsx
const t = useTranslations("kids");
const [step, setStep] = useState(0);
const totalSteps = 3;
const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1));
const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

<Link href="/map" onClick={() => analyticsKids.startGame()} ...>
...
</Link>
<Link href="/planets" onClick={() => analyticsKids.exploreSolarSystem()} ...>
...
</Link>
```

Change the existing step count/conditional panels and footer in place. Keep internal destinations as semantic `Link`s and local step changes as buttons; keep both cards co-primary. The live current final step has a redundant `/map` footer CTA at lines 223-232, which conflicts with the UI contract (two destinations only). The step dots at lines 194-209 and 236-251 currently have English-only aria labels; use localized, visible step text as the primary progress indication per spec.

**Test pattern:** `src/__tests__/kids/home-navigation.test.tsx` lines 1-52 mocks `next/link` as anchors and `next-intl` with deterministic messages; lines 59-76 advances via visible Next and asserts both hrefs; lines 89-105 spies on analytics. Update its assumptions (currently clicks Next twice and expects old card text) and add locale parity via real bundle imports or a direct bundle assertion; current mock hides missing translation keys by returning the key string.

---

### `src/components/kids/layout/kids-header.tsx` (component, request-response navigation / local menu state)

**Analog:** `src/components/kids/layout/kids-header.tsx` (self-pattern); `src/__tests__/kids/header-navigation.test.tsx`.

**Auth/guard:** Not applicable (static client UI; no auth boundary).

**Navigation and menu pattern** (source lines 83-114, 116-123, 141-171):
```tsx
<div className="hidden sm:flex items-center gap-2">
  ...
  <Link href="/map" className="pixel-btn pixel-btn-green ...">
    <PixelMapIcon />
  </Link>
  <Link href="/planets" ... title={t("header.planets")} aria-label={t("header.planets")}>
    <PixelRocket className="w-4 h-4" />
  </Link>
</div>
...
{menuOpen && <div ...>
  <Link href="/" onClick={() => setMenuOpen(false)}>{...}{t("header.home")}</Link>
  <Link href="/map" onClick={() => setMenuOpen(false)}>{...}{t("level.map")}</Link>
  <Link href="/planets" onClick={() => setMenuOpen(false)}>{...}{t("header.planets")}</Link>
</div>}
```

Maintain visible BM/EN labels next to desktop icons and text links in the mobile menu; `title`/`aria-label` alone do not satisfy the visible-text requirement. The live component has two `/` destinations in each nav context (logo plus “main site” link); consolidate rather than add another duplicate. Existing mobile menu uses a hardcoded `aria-label="Menu"` at line 121; move the name to translations and reflect open/close state.

**Test pattern:** `src/__tests__/kids/header-navigation.test.tsx` lines 54-89 opens mobile menu, selects route links by href and checks text. Extend it to assert visible desktop link text too, verify exactly one Home item in the nav group, and use both locales. The current mock at lines 20-34 is fixed-English and has no locale switching, so replace/extend rather than trust it for CLAR-02.

---

### `src/components/kids/elements/progress-map.tsx` (component, progress read + event-driven navigation)

**Analog:** `src/components/kids/elements/progress-map.tsx` (self-pattern); `src/lib/kids/progress.ts` for persisted progress read contract.

**Imports/progress lifecycle** (source lines 1-10, 28-38):
```tsx
"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getProgress, isLevelUnlocked, type KidsProgress } from "@/lib/kids/progress";

export function ProgressMap() {
  const t = useTranslations("kids");
  const [progress, setProgress] = useState<KidsProgress | null>(null);
  useEffect(() => {
    setProgress(getProgress());
    analyticsKids.viewMap();
  }, []);
```

**Existing route entry point** (lines 534-542):
```tsx
return (
  <Link href={`/level/${level.slug}`} className="group cursor-pointer">
    {nodeContent}
  </Link>
);
```

Keep map-specific cue placement in the map composition: the portal occupies the top center (lines 63-80), map scroll buttons overlay the sides (82-100), and the scroll surface/nodes are interactive (102-202, 481-542). Follow UI-SPEC placement below the heading/intro or another unobstructed inline region, not over the portal or nodes. An origin contract must be passed from this link via an allowlisted value while leaving the canonical `/level/${slug}` path intact. Preserve the existing progress read/render path; navigation itself should not mutate `kids-progress`.

**Tip state guidance:** There is no existing dismissible-tip pattern in the kids screens. If localStorage persistence is chosen, follow the effect-after-mount style above to avoid hydration mismatch and use a separate preference key/store (not `kids-progress`).

**Test pattern:** Header test lines 92-100 currently verifies portal link `/planets`, while level-entry behavior is not covered in this file. Add map-node href/origin assertion and one-screen dismissal/revisit coverage in a focused map/tip test; assert the stored progress payload remains unchanged.

---

### `src/components/kids/planets/planetary-explorer.tsx` and `planetary-hud.tsx` (components, event-driven mode + route navigation)

**Analogs:** `src/components/kids/planets/planetary-explorer.tsx`, `src/components/kids/planets/planetary-hud.tsx`; tests `src/__tests__/kids/planetary-explorer.test.tsx` and `planetary-hud.test.tsx`.

**Explorer imports/state and route callback** (`planetary-explorer.tsx` lines 1-18, 53-61, 82-113):
```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
...
const [mode, setMode] = useState<ExplorerMode>(initialMode);
const [activePlanetId, setActivePlanetId] = useState<PlanetId | null>(initialPlanetId);
...
const handleBackToOrbit = useCallback(() => {
  setMode('solar-system');
  setActivePlanetId(null);
  setActiveFeatureIndex(0);
}, []);
...
const destRoute = resolveMissionRoute(activePlanet.id, feature);
router.push(destRoute);
```

Keep the feature/cartography → orbit return as this component's local state transition; keep HUD controls callback-driven. Carry planet-origin context only as an allowlisted mission-origin signal; never pass arbitrary URL strings. Current mission push at lines 102-112 calls `resolveMissionRoute` without origin context, so origin must be attached at the route boundary without breaking the existing level resolver.

**HUD action/localization pattern** (`planetary-hud.tsx` lines 3-15, 36-46, 57-79):
```tsx
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
...
const t = useTranslations('kids.planets');
const locale = useLocale();
const isMs = locale === 'ms';
...
<button type="button" onClick={onBackToOrbit} aria-label={t('backToOrbit')}>
  <span>{t('backToOrbit')}</span>
</button>
<Link href="/map" ...>
  ...
</Link>
```

For new wording prefer `useTranslations` and both JSON bundles: current HUD has hand-authored `isMs` label branches at lines 37-45 and 70-79, which are legacy examples, not the preferred new-copy pattern. Maintain existing distinct dark/glass HUD styling and locate a new hint away from the header return/map links, planetary selector, and pinned mission button (HUD lines 57-93, 212-221). Treat orbit/cartography as one `/planets` screen for dismissal state per UI-SPEC.

**Test pattern:** `planetary-explorer.test.tsx` lines 8-43 loads the actual EN/MS JSON into a mutable locale-aware `useTranslations` mock; lines 156-175 tests orbit mode return; lines 219-245 tests mission `router.push` and the Earth-map link. `planetary-hud.test.tsx` lines 187-223 checks rendered Malay labels. Extend with origin-param assertions, labels, tip dismissal, and cross-mode persistence; avoid adding UI string assertions against fallback-to-key values alone.

---

### `src/components/kids/layout/level-content-wrapper.tsx` (component, section-state navigation / async content transform)

**Analog:** `src/components/kids/layout/level-content-wrapper.tsx` (self-pattern); `src/components/kids/providers/level-context.tsx`; test `src/__tests__/kids/level-locale.test.tsx`.

**Localized async load and state/error handling** (source lines 54-59, 87-115, 171-185):
```tsx
const t = useTranslations("kids");
const tCommon = useTranslations("common");
const locale = useLocale();
const { currentSection, setCurrentSection, totalSections } = useSectionNavigation();
...
loader
  .then((load) => load(locale, levelSlug))
  .then((result) => {
    if (cancelled) return;
    if (!result) { setState({ status: "absent" }); return; }
    setState({ status: "ready", Component: result.Component });
  })
  .catch(() => { if (!cancelled) setState({ status: "error" }); });
...
if (state.status === "loading") return <p role="status">{tCommon("loading")}</p>;
if (state.status === "absent" || state.status === "error") {
  return <ComingSoon label={t("level.comingSoon")} backLabel={t("level.backToMap")} />;
}
```

Use the existing validated-slug/client-locale load and explicit load-state approach. Replace hardcoded map-only destinations in absent/error, footer-completion and completion screen coherently using the same resolved origin; UI-SPEC explicitly selects `/map` when absent/invalid, and translated `{hub}` copy must receive a localized allowlisted label, never a supplied URL.

**Fixed footer/lock pattern** (lines 141-169, 202-220, footer 252-340):
```tsx
const isFirstSection = currentSection === 0;
const isLastSection = hasSections && currentSection === totalSections - 1;
const currentComplete = useCurrentSectionComplete(currentSection);
...
<NavigationFooter
  totalSections={totalSections}
  currentSection={currentSection}
  currentComplete={currentComplete}
  ...
  labels={{ back: t("navigation.back"), next: t("navigation.next"),
    map: t("level.map"), completeFirst: t("navigation.completeFirst") }}
/>
...
<button onClick={onNext} disabled={!currentComplete} title={!currentComplete ? labels.completeFirst : undefined}>
  {labels.next}
</button>
```

Keep current section registry as authority for order and completion; retain Next visibly rendered while incomplete. The current disabled rationale only appears in `title` at lines 312-329; add visible inline text adjacent to the button. Add localized section title and `currentSection + 1` of `totalSections` in wrapper/footer context; do not infer that every section has an H2. `Section` currently has only `children` props (see `level-slides.tsx` lines 25-40), and initial EN/MS MDX sections start with `<Panel>` and have no heading. Coordinate an explicit title source/fallback with Section metadata and both content locales.

**Testing pattern:** `level-locale.test.tsx` lines 288-323 supplies a controlled compiled component with `loadContent` to test lock gating; lines 325-392 test zero-sections and final-link behavior; lines 394-430 tests real MDX. For titles, visible lock copy, origin variants and fallbacks, prefer controlled sections plus direct EN/MS renders. Keep async assertions in `waitFor` after registry commit.

---

### `src/components/kids/elements/level-slides.tsx` and conditional `src/content/kids/{en,ms}/*.mdx` (component/content, section metadata transform)

**Analogs:** `src/components/kids/elements/level-slides.tsx` and `src/components/kids/providers/level-context.tsx` lines 52-70, 312-335; `src/content/kids/en/1-1-meet-peromfu.mdx` and Malay equivalent.

**Section identity registration pattern** (`level-slides.tsx` lines 25-49, 51-65):
```tsx
interface SectionProps { children: ReactNode; }
export function Section({ children }: SectionProps) {
  const registry = useSectionRegistry();
  const { currentSection } = useSectionNavigation();
  const [identity] = useState(() => registry.createIdentity());
  const elementRef = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    registry.registerSection(identity, elementRef.current);
    return () => registry.unregisterSection(identity);
  }, [identity, registry]);
  const index = registry.resolveIndex(identity);
```

If section labels are authored as `Section` props, extend this existing MDX registry boundary with a typed, locale-specific title rather than collecting arbitrary DOM headings. Preserve identity/order behavior and add explicit fallback text per UI-SPEC. The sample EN and MS lesson starts with unlabeled `<Section><Panel ...>` (each locale file lines 1-5 and 7-11), confirming title cannot be scraped reliably. Estimate bilingual content edits before adding MDX metadata widely.

**Testing pattern:** `level-locale.test.tsx` lines 203-227 checks real compiled section count and order; controlled components are shown at lines 291-310 and 347-370. Extend fixture components with title props and assert registry ordinal/title remain aligned across locale switch. Include an absent-title fallback case.

---

### `src/components/kids/elements/level-complete.tsx` (component, progress CRUD + request-response navigation)

**Analog:** `src/components/kids/elements/level-complete.tsx` (self-pattern), tests `src/__tests__/kids/level-complete.test.tsx` and `level-locale.test.tsx`.

**Progress write/error-free effect** (source lines 32-51):
```tsx
useEffect(() => {
  const existingProgress = getLevelProgress(levelSlug);
  const existingStars = existingProgress?.stars || 0;
  if (stars > existingStars) {
    completeLevel(levelSlug, stars);
    setShowConfetti(true);
  }
  setSavedStars(Math.max(stars, existingStars));
  const timer = setTimeout(() => setShowConfetti(false), 3000);
  return () => clearTimeout(timer);
}, [levelSlug, stars]);
```

**Current fixed return actions** (lines 123-150):
```tsx
<Link href={`/level/${next.slug}`}>...</Link>
...
<Link href="/map" className="pixel-btn pixel-btn-amber ...">
  {t("levelComplete.backToMap")}
</Link>
```

Accept the same validated origin contract as the wrapper and use localized hub text/action on every completion/return state. Preserve `completeLevel` behavior and do not clear or rewrite saved progress on the return transition. Keep next-level progression semantics independently intact.

**Test pattern:** `level-complete.test.tsx` lines 33-66 mocks progress, levels and analytics; lines 73-100 asserts ordinary and capstone action states. Update mock translation keys and verify map/planet return routes with each origin, including direct-route default. Existing completion tests currently assert “Back to Map” only and should no longer encode map-only behavior.

---

### Conditional helpers: lesson origin and journey preference storage (utility, route transform / browser-storage I/O)

**Origin analog:** `src/lib/kids/planets.ts` `resolveMissionRoute` (research cites lines 969-990); live integration caller `planetary-explorer.tsx` lines 102-112. Follow a small closed union (`map | planets`) and resolve it to hardcoded internal paths, just as mission resolution returns strict internal routes. Validate missing/unknown query input to the specified `/map` default. Do not add a generic `returnTo` URL or trust a route string from query state. Keep public route `/level/[slug]`.

**Preference analog:** `src/lib/kids/progress.ts` lines 53-73:
```ts
export function getProgress(): KidsProgress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    return migrateLegacySlugs(JSON.parse(stored) as KidsProgress);
  } catch {
    return defaultProgress;
  }
}
export function saveProgress(progress: KidsProgress): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
  catch { console.error("Failed to save progress"); }
}
```

Use a separate namespaced preference/key for map and planets dismissals, validate storage shape, and fail gracefully when unavailable. UI-SPEC recommends per-browser/device persistence across reloads; storage failure should leave the tip usable/shown again. Never reuse `kids-progress` or couple hint dismissal to `clearAllProgress` without an explicit product decision. Existing `background-music.tsx` lines 5-6, 71-84 provides named preference-key and effect-after-mount precedent, though it does not catch storage errors and is therefore not a storage error-handling template.

**Testing:** add unit tests for origin allowlist/default and storage first-visit/dismissal independence, malformed value, and thrown localStorage access. Existing progress tests/components do not establish a hint preference convention; no exact analog exists.

---

### `messages/en.json` and `messages/ms.json` (config, static localized-data transform)

**Analog:** the existing parallel `kids` message namespace in these tracked files, especially `home`, `header`, `navigation`, `map`, `planets`, and `level`.

**Existing key parity** (`messages/en.json` / `messages/ms.json` lines 59-105):
```json
"header": { "home": "Home", "map": "Map", "planets": "Solar System" },
"navigation": {
  "back": "Back",
  "next": "Next",
  "completeFirst": "Complete the activity first to continue"
}
```

Add new or revised strings to both canonical bundles, keeping matching nested keys. UI-SPEC gives finalized copy for welcome promise, two step labels, equal card actions/descriptions, Home/Earth map/Planets labels, map/planets tips, dismiss action, visible lock explanation, error/unavailable labels and menu trigger. The home component currently mixes a fallback `t("header.planets") || "3D Space"` (line 160); remove fallback-style new copy and cover key presence in both locales. Render changed routes in EN and BM; strings resembling raw keys are invalid translations.

**Locale parity check:** `src/__tests__/kids/planetary-hud.test.tsx` lines 4-42 loads both JSONs, resolves namespaced keys and mutable locale; lines 187-223 asserts Malay output. Reuse that robust resolver or direct assertions on required keys.

---

## Shared Patterns

### Localization and user copy
**Sources:** `src/components/kids/layout/kids-home-content.tsx` lines 3-6; `messages/en.json`, `messages/ms.json`; locale test idiom `src/__tests__/kids/planetary-hud.test.tsx` lines 4-42.  
**Apply to:** all changed components and preference-tip component. Use `useTranslations("kids")` (or existing scoped namespace), preserve exact paired keys in both bundles, avoid hardcoded BM/EN UI and avoid silent English fallback. Planet data's existing locale branches are legacy data handling, not a model for new interface copy.

### Navigation boundaries and safe lesson return
**Sources:** map entry `progress-map.tsx` lines 534-542; planetary route callback `planetary-explorer.tsx` lines 102-113; safe route helper precedent `src/lib/kids/planets.ts` `resolveMissionRoute`; route boundary `src/app/level/[slug]/page.tsx` lines 32-44.  
**Apply to:** map/planet entry, wrapper loading/coming-soon/final footer, completion links. Route transitions use Next `Link` or `router.push`; local mode/tip changes use semantic buttons. Propagate only a narrow validated origin and use deterministic map fallback; do not use `document.referrer`, arbitrary redirects, or browser-history-only return.

### Progress persistence isolation
**Sources:** `src/lib/kids/progress.ts` lines 5-22, 53-73, 199-209.  
**Apply to:** any route transition and tip preference. Saved stars/completions are `kids-progress`; route navigation must neither clear nor rewrite them. Preference keys for tips must be separately namespaced and must not piggyback on progress reset unless specifically decided.

### Lesson section cursor and completion gate
**Sources:** `src/components/kids/layout/level-content-wrapper.tsx` lines 141-169 and 252-340; `src/components/kids/providers/level-context.tsx` lines 52-70, 312-335.  
**Apply to:** title/ordinal display, dots, Next state. Use `currentSection`/`totalSections` from identity registry, maintain its fail-closed completion gate, and make the disabled rationale visible inline (not `title` only). Add explicit localized section-title provenance because current registry exposes ordering/identity but not names.

### Testing conventions
**Sources:** Vitest + Testing Library files `src/__tests__/kids/home-navigation.test.tsx`, `header-navigation.test.tsx`, `planetary-explorer.test.tsx`, `planetary-hud.test.tsx`, `level-locale.test.tsx`, `level-complete.test.tsx`.  
Use focused suite command:
```bash
npm test -- src/__tests__/kids/home-navigation.test.tsx src/__tests__/kids/header-navigation.test.tsx src/__tests__/kids/planetary-hud.test.tsx src/__tests__/kids/planetary-explorer.test.tsx src/__tests__/kids/level-locale.test.tsx src/__tests__/kids/level-complete.test.tsx
```
Planet suites exercise Next navigation and Three.js with mocks; lesson tests use injected controlled MDX loaders and `waitFor` around registration; home/header tests use lighter translation mocks. Prefer actual EN/MS bundle resolution for changed copy and tests over mock functions that silently echo an unknown key.

## No Exact Analog Found

| Behavior/File | Nearest pattern | Gap the planner should account for |
|---------------|-----------------|------------------------------------|
| Independent first-visit map/planet tips and persistence | `background-music.tsx` preference keys/effects + `settings-modal.tsx` local toggles | No existing dismissible, independently persisted tips; define lifetime, separate key, SSR-safe read/write failure behavior, and test both surfaces. |
| Allowlisted lesson-origin propagation | `resolveMissionRoute` + existing route entry Links | No origin currently travels from either hub to lesson; add explicit enum transport and map fallback consistently through wrapper and completion. |
| Localized title for every current section | `Section` identity registry + bilingual MDX | Registry carries index/identity only, and some sections have no headings; decide explicit authored metadata or another explicit localized source/fallback. |

## Source Freshness / Differences from Code Maps

- `.planning/codebase/STRUCTURE.md` and `CONVENTIONS.md` are dated 2026-11-04 and describe generic app layout. This phase's live owners are the nested `src/components/kids/{layout,elements,planets,providers}` structure; follow those tracked files and `@/` aliases rather than stale generic examples.
- Live `level-content-wrapper.tsx` and `level-context.tsx` include an ordered identity-based section registry and fail-closed interactive completion gate. Any older map suggesting a simple cursor/dot-only section tracker is stale; use the current registry.
- Current map lesson links and both lesson wrapper/completion return actions still point to `/map`; planetary mission routing resolves a lesson path but carries no originating-hub context. This is an observed gap, not implemented behavior.
- Current desktop header navigation is icon-only; mobile already has labels. Header duplicates `/` via logo and “main site”; avoid repeating either issue.
- UI copy is not fully following desired conventions yet: header has hardcoded menu accessibility name, planetary HUD/explorer have manually branched labels, and home uses an English fallback (`"3D Space"`). Treat these as legacy source discrepancies and move changed journey UI copy into paired bundles.
- Existing research says focused core tests passed, but no existing test verifies route origin, tip preference persistence, visible disabled explanation, or localized section titles. Add coverage rather than assuming requirements are covered by old tests.

## Metadata

**Analog search scope:** `src/components/kids/{layout,elements,planets,providers}`, `src/lib/kids`, `src/content/kids/{en,ms}`, `messages/{en,ms}.json`, `src/__tests__/kids`, and `.planning/codebase` maps.  
**Files scanned/read:** 18 live source/test analogs plus phase context/research/UI contract and codebase conventions/maps.  
**Tracked-source gate:** all named source analog paths were confirmed by `git ls-files`; no runtime mirror paths are referenced.  
**Pattern extraction date:** 2026-11-09
