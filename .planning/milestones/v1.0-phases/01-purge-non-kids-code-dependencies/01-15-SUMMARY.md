---
phase: 01-purge-non-kids-code-dependencies
plan: 15
subsystem: ui
tags: [next, mdx, react-context, kids, level-registry, i18n, vitest, tdd]

requires:
  - plan: 01-02
    provides: auth-free, request-independent kids shell with a single NextIntlClientProvider
  - plan: 01-14
    provides: audited, locally runnable next/eslint/tsc/vitest executables
provides:
  - client-compiled-mdx-selection
  - ordered-section-identity-registry
  - identity-scoped-navigation-lock-api
  - useSectionIdentity-consumer-contract
affects: [01-16, 01-17]

actuals:
  tokens: 50000
  tasks: 2
  commits: 2

tech-stack:
  added: []
  patterns:
    - "Client compiled-MDX selection: a statically analyzable, lazy per-(locale,slug) import map bounded by supportedLocales + getLevelBySlug; English fallback only when the locale module is absent; other failures propagate"
    - "Mounted Section identity registry: every Section stays mounted, owns a stable identity object, registers its DOM element in a layout effect, and the provider resolves identities to ordered indexes from real document order after commit"
    - "Fail-closed identity locking: navigation locking reads identity-scoped requirements only; the legacy numeric context signatures stay callable but route requirements to the containing Section identity and cannot unlock via a cursor write"
    - "Section-scoped context (useSectionIdentity) giving interactive descendants their resolved containing index without a request-time locale read"

key-files:
  created:
    - src/lib/kids/level-content.ts
    - src/__tests__/kids/level-locale.test.tsx
  modified:
    - src/app/kids/level/[slug]/page.tsx
    - src/components/kids/layout/level-content-wrapper.tsx
    - src/components/kids/elements/level-slides.tsx
    - src/components/kids/providers/level-context.tsx
    - vitest.config.ts

key-decisions:
  - "Removed request-time getLocale from the level page; the server passes only a validated slug and the client selects compiled MDX (locale comes from the intl provider only)"
  - "Replaced the unbounded template-literal dynamic import with a discrete lazy import map generated from the content inventory, keeping per-level code splitting while remaining statically analyzable and bounded"
  - "Kept the legacy numeric context signatures callable but routed registerSectionRequirement through the containing Section identity, so a mounted interactive Section locks fail-closed instead of unlocking on a cursor write"
  - "Made the identity registry referentially stable (refs + a version counter) so Section layout effects do not churn the registry identity and loop"
  - "Keyed the MDX subtree by locale/slug and reset the transient registry on level change (skipping the initial mount) so remounts get fresh identities without wiping mount-era registrations"
  - "Added a vitest MDX transform plugin (test infrastructure) so the compiled-MDX suite exercises real .mdx modules, and a loadContent injection seam on the wrapper for controlled-content tests"

patterns-established:
  - "Kids level content: validated slug → bounded client MDX selection → useMDXComponents Section → ordered mounted registry"
  - "Section identity: Section-scoped context exposes resolved index; interactive consumers register/complete by identity (01-16 migrates the nine consumers onto it)"

requirements-completed: [NFR-1, FR-1, FR-2]

coverage:
  - id: D1
    description: "The retained /kids/level/[slug] route selects compiled MDX on the client from a validated slug + provider locale, with all 19 static slugs and locale-independent metadata"
    requirement: FR-1
    verification:
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#keeps all 19 registered slugs in generateStaticParams"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#resolves a compiled MDX component for a valid locale and slug"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#falls back to English when the requested locale module is absent"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#returns null for a slug outside the registry without attempting an import"
        status: pass
    human_judgment: false
  - id: D2
    description: "Mounted compiled MDX Sections expose one ordered navigation dot each, a Section-scoped resolved index, and identity-based navigation/requirement interfaces"
    requirement: NFR-1
    verification:
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#renders one dot per real compiled Section in document order"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#resolves a Section-scoped descendant index only after commit"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#keeps visited Sections mounted so their state survives back navigation"
        status: pass
    human_judgment: false
  - id: D3
    description: "Navigation fails closed for mounted interactive Sections whose scoped requirement is not yet complete; the final Section shows the map link; empty levels show comingSoon"
    requirement: FR-2
    verification:
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#routes a legacy requirement to the containing Section identity, not the cursor"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#locks Next while the active Section has an unresolved requirement"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#fails closed on real compiled MDX: a plain Section advances, an interactive one locks"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#shows the map link on the final Section instead of Next"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#shows the comingSoon panel when the level has no Sections"
        status: pass
      - kind: automated
        ref: "npm run lint -- --quiet"
        status: pass
    human_judgment: false

duration: 33min
completed: 2026-11-05
status: complete
---

# Phase 1 Plan 15: Compiled MDX Selection & Ordered Section Registry Summary

**The retained `/kids/level/[slug]` route now selects compiled locale MDX on the client from a validated slug and drives navigation from an ordered, identity-scoped Section registry that fails closed on mounted interactive Sections.**

## Performance

- **Duration:** 33 min
- **Started:** 2026-11-04T15:47:40Z
- **Completed:** 2026-11-05T00:20:18Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Client compiled-MDX selection in `src/lib/kids/level-content.ts`: a single,
  statically analyzable lazy import map bounded by `supportedLocales` + `getLevelBySlug`
  (304 discrete `import()` loaders, generated from the content inventory). English
  fallback fires only when the requested (supported) locale module is absent; unexpected
  failures propagate. No request-time locale read.
- The level page dropped `getLocale`, kept all 19 `generateStaticParams` slugs and
  locale-independent `generateMetadata`, and now passes the validated slug (no opaque
  server-rendered MDX children) to the wrapper.
- `Section` (in `level-slides.tsx`) owns a stable identity, registers its DOM element in
  a layout effect, provides `SectionScopeContext` to descendants, and stays mounted
  (hidden + `inert`) when inactive — so visited state survives back navigation.
- `level-context.tsx` gained an ordered identity registry: register/unregister, ordered
  index resolution from real document order after commit, requirement registration by
  identity, and an identity-scoped completion write that refuses unresolved identities.
  The legacy numeric signatures stay callable but route requirements to the containing
  Section identity — a cursor write cannot unlock a mounted interactive Section.
- The wrapper renders the compiled MDX through `useMDXComponents` (keyed by locale/slug),
  shows a translated loading state (no wrong-locale MDX), retains `comingSoon` for zero
  Sections, and drives Next/dots from the ordered registry (final Section shows the map
  link).

## Task Commits

Each task was committed atomically:

| Task | Commit | Type | Description |
|------|--------|------|-------------|
| 1 | `ae280140` | feat | Select compiled level MDX on the client with a validated slug |
| 2 | `87df669e` | feat | Index mounted MDX Sections with identity-based lock state |

**Plan metadata:** committed with this SUMMARY.

## Deviations from Plan

### Auto-added Missing Critical Functionality

**1. [Rule 2 - Missing Critical] Added a vitest MDX transform plugin**
- **Found during:** Task 1 (locale/slug selection tests)
- **Issue:** The plan's `<verify>` command runs `npm test -- src/__tests__/kids/level-locale.test.tsx`, and Task 2 requires testing *real compiled MDX*. Vitest had no `.mdx` transform, so the suite could not import content modules at all — the declared verification could not run.
- **Fix:** Added a minimal inline Vite plugin in `vitest.config.ts` that compiles `.mdx` with `@mdx-js/mdx` (`outputFormat: "program"`, `react/jsx-runtime`) — the same output shape as the Next build.
- **Files modified:** `vitest.config.ts`
- **Verification:** Existing suites (`hooks`, `connector-badge`, `seo`) still pass; compiled-MDX tests import real `.mdx` content.
- **Committed in:** `ae280140` (Task 1 commit)

**2. [Rule 2 - Missing Critical] Added a `loadContent` injection seam to the wrapper**
- **Found during:** Task 2 (controlled-content tests)
- **Issue:** Testing comingSoon / final-map-link / fail-closed lock against controlled Section trees required a deterministic component, but `vi.doMock` + dynamic `import` produced a second `level-context` module instance (two React contexts), so statically-imported `Section` could not see the provider.
- **Fix:** Added an optional `loadContent?: typeof loadLevelContent` prop to `LevelContentWrapper` (production callers omit it; default path unchanged). Kept it in a ref so inline test functions cannot re-trigger the selection effect.
- **Files modified:** `src/components/kids/layout/level-content-wrapper.tsx`
- **Verification:** Controlled-content tests pass; the real-path integration test (real en 1-1 MDX) also passes.
- **Committed in:** `87df669e` (Task 2 commit)

---

**Total deviations:** 2 auto-added (both Rule 2, required to make the plan's declared
verification executable and deterministic). No scope creep — no consumer migration
(01-16), no locale switch (01-17), no route/package deletion, no root promotion.

## Issues Encountered

- **Registry reset wiped mount-era registrations:** the provider's level-change reset
  effect ran on the initial mount and cleared Sections that registered in their own
  mount-era layout effects, leaving `totalSections` at 0. Fixed by skipping the reset on
  the first mount (`didMountRef`), so it only fires on genuine level changes.
- **Registry identity churn → infinite update loop:** `Section`'s layout effect depended
  on the registry object, which changed identity whenever volatile callbacks changed,
  re-running register/unregister each commit. Fixed by making the registry referentially
  stable (all callbacks read refs + a version counter; the registry object is memoized on
  stable callbacks).
- **Section-scoped index not reactive:** the resolved index was not re-rendered into
  descendants. Fixed by exposing `index` on `SectionScopeValue` and memoizing the scope
  value on it.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None. All wired paths resolve real data; the `loadContent` prop defaults to the real
bounded selector and is only overridden in tests.

## Next Phase Readiness

- `useSectionIdentity()` and identity-based requirement/completion APIs are exported and
  stable for 01-16 to migrate the nine interactive consumers
  (`word-predictor`, `prompt-vs-mistake`, `drag-drop-prompt`, `example-matcher`,
  `magic-words`, `prompt-doctor`, `prompt-lab`, `prompt-parts`, `step-by-step`).
- Until 01-16 migrates them, interactive Sections are **locked fail-closed** (Next
  disabled) rather than unlocked by a cursor write — the intended interim behavior.
- Locale preference plumbing (persisted switch, `ms` translation, locale-incompatible
  section-completion/draft clearing) remains 01-17 ownership; 01-15 performs no
  request-time locale read.
- `/kids/level/[slug]` remains reachable with all 19 slugs; no route was deleted and no
  package was removed.
- No root promotion or static export was performed (Phase 2 ownership).

## Self-Check: PASSED

- `src/lib/kids/level-content.ts`, `src/__tests__/kids/level-locale.test.tsx` exist.
- Commits `ae280140` and `87df669e` are ancestors of HEAD.
- `npm test -- src/__tests__/kids/level-locale.test.tsx` → 15/15 passed.
- `npm run lint -- --quiet` → exit 0.
- `npx tsc --noEmit` reports no errors in the modified/created files.