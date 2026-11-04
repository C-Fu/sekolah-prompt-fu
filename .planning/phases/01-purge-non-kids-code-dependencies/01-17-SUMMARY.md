---
phase: 01-purge-non-kids-code-dependencies
plan: 17
subsystem: ui
tags: [next, next-intl, i18n, mdx, react-context, kids, progress, vitest, tdd]

requires:
  - plan: 01-02
    provides: request-independent kids shell with a single NextIntlClientProvider and locale/messages as explicit props
  - plan: 01-15
    provides: client compiled-MDX selection + ordered Section registry (loadLevelContent, useSectionIdentity)
  - plan: 01-16
    provides: identity-bound interactive completion (Section-scoped requirement/completion writes)
provides:
  - validated-persisted-client-locale-preference
  - atomic-locale-messages-compiled-mdx-switch
  - locale-incompatible-interaction-invalidation
  - progress-preserving-reset-semantics
affects: []

actuals:
  tokens: 10814
  tasks: 2
  commits: 4
  plan_head_before: 2ea2fc8d1c246ace06638161508e4c886d1c1584
  plan_head_after: d09c1f564309f647de40e3c3e21c2896f2c5a56a

tech-stack:
  added: []
  patterns:
    - "Validated persisted client locale preference: localStorage key validated against supportedLocales before any bounded message import is indexed; no cookie/request-time lookup"
    - "Atomic locale switch: the shared Providers owns the single locale/messages pair and switches both together with the compiled MDX (also keyed by that locale), so same-slug Spanish selection updates UI + MDX + direction with no navigation"
    - "Hydration contract: deterministic default locale renders first; a saved preference is restored after mount and is NOT treated as a user change (its own completions/drafts are preserved)"
    - "Locale-transition invalidation: a genuine user change to a different locale clears useId component drafts and index-based Section completions across all slugs (never kids-progress/sound/locale) and fails closed on storage denial"
    - "Direction follows the client provider locale via a LocaleDirection child; the kids server layout no longer calls getLocale()"

key-files:
  created:
    - src/components/kids/layout/locale-direction.tsx
    - src/__tests__/kids/settings-locale.test.tsx
    - .planning/phases/01-purge-non-kids-code-dependencies/.tdd/01-17-task1-red.txt
    - .planning/phases/01-purge-non-kids-code-dependencies/.tdd/01-17-task2-red.txt
  modified:
    - src/lib/i18n/client.ts
    - src/lib/kids/progress.ts
    - src/components/providers/index.tsx
    - src/app/kids/layout.tsx
    - src/components/kids/layout/settings-modal.tsx
    - src/__tests__/kids/level-locale.test.tsx

key-decisions:
  - "Replaced the cookie + hard-reload setLocale with a validated localStorage-persisted preference signal; the old setLocale/getLocaleClient remain as deprecated thin shims so out-of-scope non-kids callers still type-check"
  - "The shared Providers owns the single locale/messages pair and switches them atomically only after the matching bounded message bundle loads; the initial render always uses the deterministic default (matching hydration) and restores a saved preference after mount without invalidation"
  - "Only a genuine user-initiated change from the already-restored effective locale to a different locale invalidates locale-incompatible useId drafts and index-based Section completions; repeated selection of the effective locale and initial restoration are no-ops"
  - "invalidateLocaleIncompatibleInteractions() returns success/failure (unlike the swallowing progress helpers) so the switch fails closed: storage denial retains the current effective locale rather than activating translated MDX with stale completion keys"
  - "clearAllProgress now removes kids-section-completion alongside kids-progress and kids-component-state, and is owned exclusively by the confirmed reset (removed from handleLanguageChange)"
  - "Kids layout direction moved to a client LocaleDirection child reading useLocale; getLocale was removed from the kids server layout (no request-time locale read)"

requirements-completed: [NFR-1, FR-1, FR-2]

coverage:
  - id: D1
    description: "A validated, persisted client locale preference switches UI messages and compiled MDX together on the same slug without navigation or a request-time locale read"
    requirement: FR-1
    verification:
      - kind: unit
        ref: "src/__tests__/kids/settings-locale.test.tsx#switches UI messages and compiled MDX together without navigation, retaining stars/levels/sound"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#renders ten en Sections but seven es Sections for the same slug as the locale changes"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#shows the English fallback MDX for a supported locale with no translated module"
        status: pass
      - kind: automated
        ref: "npm run lint -- --quiet"
        status: pass
    human_judgment: false
  - id: D2
    description: "A genuine user locale change invalidates locale-incompatible useId drafts and index-based Section completions (fail closed on storage denial) while retaining kids-progress and sound; initial restoration does not invalidate"
    requirement: FR-2
    verification:
      - kind: unit
        ref: "src/__tests__/kids/settings-locale.test.tsx#invalidates index-based Section completions and useId drafts before the es MDX mounts"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/settings-locale.test.tsx#keeps fresh es Sections locked until solved; the old en completion cannot unlock them"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/settings-locale.test.tsx#restores a saved es preference after default hydration without wiping newly earned es completions"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#treats repeated selection of the already-effective locale as a no-op"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#fails closed and retains the current locale when invalidation is denied"
        status: pass
    human_judgment: false
  - id: D3
    description: "Confirmed reset clears all three kids stores (kids-progress, kids-component-state, kids-section-completion); cancel and language selection never clear level progress or sound"
    requirement: FR-2
    verification:
      - kind: unit
        ref: "src/__tests__/kids/settings-locale.test.tsx#confirming the reset removes kids-progress, kids-component-state and kids-section-completion"
        status: pass
      - kind: unit
        ref: "src/__tests__/kids/settings-locale.test.tsx#cancelling the reset confirmation retains all three kids stores"
        status: pass
      - kind: automated
        ref: "npm run lint -- --quiet"
        status: pass
    human_judgment: false

duration: 19 min
completed: 2026-11-04
status: complete
---

# Phase 1 Plan 17: Client Locale Switch & Progress-Preserving Settings Summary

**Kids language selection now switches UI messages, compiled MDX and layout direction together through a validated localStorage-persisted client preference (no request-time lookup), invalidates only locale-incompatible puzzle drafts/Section indexes for a genuine change, and clears all three kids stores only on confirmed reset.**

## Performance

- **Duration:** 19 min
- **Started:** 2026-11-04T16:59:44Z
- **Completed:** 2026-11-04T17:19:08Z
- **Tasks:** 2
- **Files modified:** 8 (6 source/test under `src/` + 2 TDD records)

## Task Commits

Each task was committed atomically following RED → GREEN:

| Task | Commit | Type | Description |
|------|--------|------|-------------|
| 1 RED | `e9ac1427` | test | add failing locale-preference and compiled-MDX switch tests |
| 1 GREEN | `439a423c` | feat | switch kids messages and compiled MDX through a persisted client locale |
| 2 RED | `ce092b9b` | test | add failing SettingsButton locale-switch and reset tests |
| 2 GREEN | `d09c1f56` | feat | preserve level progress on language change and reset all stores on confirm |

**Plan metadata:** committed with this SUMMARY.

## Accomplishments

- **Client locale preference signal (`src/lib/i18n/client.ts`)** — replaced the cookie +
  `window.location.reload` switcher with: a `LOCALE_PREFERENCE_KEY` localStorage preference
  validated against `supportedLocales` (`readPersistedLocale`/`writePersistedLocale`), a
  bounded per-supported-locale message import map (`loadMessages`), and a
  `transitionLocale(target, currentEffective)` orchestrator. `transitionLocale` is a no-op
  for a repeated selection of the effective locale, invalidates + persists for a genuine
  change, and fails closed (retaining the current locale) when invalidation is denied
  (threat T-01-16). The old `setLocale`/`getLocaleClient` remain as deprecated thin shims so
  out-of-scope non-kids callers still type-check.
- **Atomic provider (`src/components/providers/index.tsx`)** — the shared `Providers` now
  owns the single `locale`/`messages` pair. It hydrates the deterministic default from its
  props (matching server markup), then restores a saved preference after mount *without*
  invalidation, and exposes `useLocalePreference()` / `setUserLocale()` which run the
  validated transition before committing the new locale+messages.
- **Direction without request-time locale (`src/app/kids/layout.tsx` +
  `locale-direction.tsx`)** — removed `getLocale()`/`RTL_LOCALES` from the kids server
  layout and wrapped its existing content in a client `LocaleDirection` child that reads
  `useLocale()` and applies `dir`, so direction follows the provider locale after hydration.
  All other server layout styling/providers were preserved.
- **Progress-preserving settings (`src/components/kids/layout/settings-modal.tsx`)** —
  `handleLanguageChange` now drives the provider switch and no longer calls
  `clearAllProgress` (stars/levels/unlocked worlds and sound are retained); a failed
  invalidation surfaces a translated alert instead of activating stale translated MDX.
  `clearAllProgress` is retained exclusively on the confirmed-reset path.
- **Invalidation helper (`src/lib/kids/progress.ts`)** —
  `invalidateLocaleIncompatibleInteractions()` clears `kids-component-state` and
  `kids-section-completion` across all slugs, never touching `kids-progress`, the
  music/sound preference or the locale preference, and returns success/failure instead of
  swallowing storage errors. `clearAllProgress` now also removes `SECTION_COMPLETION_KEY`.
- **Tests** — `level-locale.test.tsx` grew 25 → 34 (compiled-MDX locale switch en 10 vs es 7
  Sections, English fallback, bounded message bundle, persisted-preference validation, no-op
  same-locale, fail-closed invalidation); new `settings-locale.test.tsx` (6 tests) renders
  the real `Providers` and asserts the SETTINGS click path end-to-end against real
  localStorage: progress/sound retention through a switch, invalidation of en index 8 +
  `useId` drafts before es mounts, fresh es Section lock/unlock, saved-locale restoration
  preserving its own completions, cancel retention and confirmed full reset.

## Files Created/Modified

- `src/lib/i18n/client.ts` — validated persisted client preference, bounded message loader, transition orchestrator (created-from-scratch rewrite; deprecated shims kept).
- `src/lib/kids/progress.ts` — `invalidateLocaleIncompatibleInteractions()`; `clearAllProgress` extended to `SECTION_COMPLETION_KEY`.
- `src/components/providers/index.tsx` — locale/messages state owner + `useLocalePreference` context.
- `src/app/kids/layout.tsx` — no request-time locale; content wrapped in `LocaleDirection`.
- `src/components/kids/layout/locale-direction.tsx` — new client `dir` follower.
- `src/components/kids/layout/settings-modal.tsx` — progress-preserving language switch, invalidation-failure alert, reset-only `clearAllProgress`.
- `src/__tests__/kids/level-locale.test.tsx` — Task 1 tests (+9).
- `src/__tests__/kids/settings-locale.test.tsx` — new Task 2 suite (6 tests).

## Deviations from Plan

### Auto-added / Cross-task placement

**1. [Rule 2 - Missing Critical] `progress.ts` invalidation helper landed in Task 1's GREEN commit**
- **Found during:** Task 1 (implementing `transitionLocale`)
- **Issue:** Task 1's `<files>` declares `src/lib/i18n/client.ts`, but `transitionLocale`
  must call the locale-transition invalidation helper, which Task 2's `<files>` assign to
  `src/lib/kids/progress.ts`. Landing `client.ts` without the helper would leave a broken
  import mid-plan.
- **Fix:** Added `invalidateLocaleIncompatibleInteractions()` to `progress.ts` in Task 1's
  GREEN commit (`439a423c`) so the import resolves; Task 2 then only changed the settings
  consumer. No behavior outside the plan's two tasks was added.
- **Files modified:** `src/lib/kids/progress.ts`
- **Verification:** Both task `<verify>` suites + lint pass.
- **Committed in:** `439a423c` (Task 1 GREEN)

**2. [Rule 2 - Missing Critical] Kept deprecated `setLocale`/`getLocaleClient` shims**
- **Found during:** Task 1
- **Issue:** `src/lib/i18n/index.ts` re-exports `setLocale`/`getLocaleClient` and
  out-of-scope non-kids files (`components/layout/header.tsx`, `components/book/sidebar.tsx`,
  `components/prompts/language-switcher.tsx`) import `setLocale`. Deleting the export would
  break type-checking/lint outside the declared `<files>` set.
- **Fix:** Kept both as `@deprecated` thin wrappers over the new persisted-preference
  functions (they persist a validated preference instead of reloading).
- **Files modified:** `src/lib/i18n/client.ts`
- **Verification:** `npm run lint -- --quiet` exit 0; `npx tsc --noEmit` reports no errors in
  the changed files.
- **Committed in:** `439a423c` (Task 1 GREEN)

**3. [Rule 2 - Missing Critical] Re-exported real `next-intl` in `settings-locale.test.tsx`**
- **Found during:** Task 2 (test harness)
- **Issue:** `vitest.setup.ts` globally mocks `next-intl` to only `useTranslations`/`useLocale`
  /`getTranslations`, so `NextIntlClientProvider` was undefined when rendering the real
  provider; sonner's `Toaster` also needs `window.matchMedia`, absent in jsdom.
- **Fix:** File-local `vi.mock("next-intl", ... importOriginal)` to get the real module, plus
  a minimal `window.matchMedia` stub. Test-only, no production impact.
- **Files modified:** `src/__tests__/kids/settings-locale.test.tsx`
- **Verification:** 6/6 settings-locale tests pass; 34/34 level-locale pass.
- **Committed in:** `ce092b9b` (Task 2 RED)

---

**Total deviations:** 3 auto-added (all Rule 2, required for a coherent intermediate state,
type-clean out-of-scope consumers, and an executable real-provider test). No scope creep: no
`ms` translation (Phase 3), no `mdx-components.tsx` cleanup (01-04), no route/package
deletion, no root promotion or static export (Phase 2).

## Issues Encountered

- **Global `next-intl` mock vs. real provider:** resolved by a file-local `importOriginal`
  re-export (deviation 3 above).
- **`AbstractIntlMessages` typing of JSON imports:** the bounded message map is typed as
  `{ default: unknown }` and cast at the single `loadMessages` boundary, avoiding the literal
  JSON→index-signature mismatch without weakening types elsewhere.
- **`gsd_run`/`gsd-tools` shell runner unavailable in this environment:** state mutations were
  performed through the GSD command hub (`query state.record-session`) plus a manual STATE.md
  edit for the session block and the 01-17 decision; `state.advance-plan` could not read a
  plan position (STATE.md has no `Current Plan: N of M` marker — a pre-existing format gap,
  unchanged from prior plans). `requirements.ready-ids` correctly reported 0/3 ready because
  NFR-1/FR-1/FR-2 are shared with sibling Phase-1 plans lacking SUMMARYs, so they were
  intentionally NOT marked complete (shared-ID gate #2388).

## Authentication Gates

None.

## Known Stubs

None. Every wired path resolves real data: the provider loads real bounded message bundles
and the wrapper selects real compiled MDX; the deprecated `setLocale`/`getLocaleClient`
shims are intentional backward-compatibility exports, not stubs.

## Threat Flags

None. This plan only strengthens the two registered mitigations — T-01-16 (validate locale
before indexing bounded message/MDX imports) and T-01-17 (invalidate index-keyed Section
completions and `useId` drafts before switching compiled MDX; fail closed). No new network,
auth, file-access or schema surface was introduced.

## Next Phase Readiness

- Kids game language selection updates UI + compiled MDX + direction together without
  navigation and without losing FR-2 level progress/sound; confirmed reset clears all three
  kids stores.
- Deferred as planned: `ms` translation (Phase 3), `mdx-components.tsx` cleanup (01-04), route
  and package deletion, root promotion / static export (Phase 2).
- No route was deleted, no package removed, no root promotion or static export performed.

## Self-Check: PASSED

- Created files exist: `src/components/kids/layout/locale-direction.tsx`,
  `src/__tests__/kids/settings-locale.test.tsx` (verified on disk).
- Commits `e9ac1427`, `439a423c`, `ce092b9b`, `d09c1f56` are ancestors of HEAD.
- `npm test -- src/__tests__/kids/settings-locale.test.tsx src/__tests__/kids/level-locale.test.tsx`
  → 40/40 passed.
- `npm run lint -- --quiet` → exit 0.
- `npx tsc --noEmit` reports no errors in the modified/created files (project-wide
  pre-existing type debt — Prisma client / legacy API tests — is unchanged).