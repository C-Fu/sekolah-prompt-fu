---
phase: 01-purge-non-kids-code-dependencies
plan: 02
subsystem: ui
tags: [next-intl, app-router, layout, providers, i18n, kids, auth-removal]

requires:
  - plan: 01-01
    provides: recorded human approval for auth/session retirement
  - plan: 01-14
    provides: audited, locally runnable next/eslint/tsc/vitest executables
provides:
  - auth-free-root-shell
  - request-independent-intl-config
  - kids-translation-provider
affects: [01-15, 01-16, 01-17]

actuals:
  tokens: 2710
  tasks: 1
  commits: 1

tech-stack:
  added: []
  patterns:
    - "Server root layout resolves locale/messages and passes them to a single client NextIntlClientProvider wrapper"
    - "i18n request config is deterministic (bundled default-locale messages), never reading cookies/headers at request time"
    - "Untrusted locale candidates validated against supportedLocales before any message import path is built"

key-files:
  created: []
  modified:
    - src/app/layout.tsx
    - src/components/providers/index.tsx
    - src/i18n/request.ts

key-decisions:
  - "Reduced the shared Providers wrapper to NextIntlClientProvider only; SessionProvider, ThemeProvider/ThemeStyles and BrandingProvider were removed as retired non-kids shell"
  - "Kept locale/messages as explicit Providers props (now sourced from next-intl/server rather than request-time headers) so 01-17 can switch them together with a persisted preference"
  - "request.ts pinned to the deterministic supported default locale with locale validated against supportedLocales, satisfying the threat-model mitigate disposition"

patterns-established:
  - "Kids-compatible shell: html/body + fonts + globals.css + intl provider, no header/footer/ads/analytics/pathname branching"

requirements-completed: [NFR-1, FR-1, FR-2]

coverage:
  - id: D1
    description: "/kids renders through a root layout that no longer inspects incoming headers or requires a session provider"
    requirement: NFR-1
    verification:
      - kind: automated
        ref: "grep -n 'next/headers|next-auth|SessionProvider' src/app/layout.tsx src/components/providers/index.tsx (no matches)"
        status: pass
      - kind: automated
        ref: "npm run lint -- --quiet"
        status: pass
      - kind: automated
        ref: "npm test -- src/__tests__/hooks/use-mobile.test.ts"
        status: pass
    human_judgment: false
  - id: D2
    description: "Kids translations remain available to the game without request-time cookie/header lookup"
    requirement: FR-1
    verification:
      - kind: automated
        ref: "node -e require('./messages/en.json').kids (namespace present; kids.home.title resolves)"
        status: pass
      - kind: automated
        ref: "npx tsc --noEmit (no errors in the three modified files)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Existing /kids/map and /kids/level/[slug] remain reachable; no root promotion or static export performed"
    requirement: FR-2
    verification: []
    human_judgment: true
    rationale: "Route reachability and the deliberate deferral of root promotion / static export to Phase 2 require interactive confirmation; no automated test asserts the absence of a promotion this plan intentionally did not perform."

duration: 6min
completed: 2026-11-04
status: complete
---

# Phase 1 Plan 2: Kids Entry Shell Summary

**Kids entry now renders through an auth-free, request-independent root shell: header/footer/ads/analytics/pathname branching and the SessionProvider/theme/branding wrappers are gone, and the intl request config ships bundled default-locale messages with no cookie/header lookup.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-11-04T23:37:00Z
- **Completed:** 2026-11-04T23:43:00Z
- **Tasks:** 1
- **Files modified:** 3

## Accomplishments
- Root layout reduced to a kids-compatible `html`/`body` shell retaining `globals.css`, all four font variables, RTL handling and the `NextIntlClientProvider`; `next/headers` pathname branching, ads meta, analytics and the header/footer/banners/LocaleDetector marketing chrome removed.
- Shared `Providers` wrapper cut to `NextIntlClientProvider` (+ `Toaster`); `SessionProvider`, `ThemeProvider`/`ThemeStyles` and `BrandingProvider` removed.
- `src/i18n/request.ts` made deterministic: bundled default-locale messages with no `next/headers` cookie/header reads, locale validated against `supportedLocales`, fallback `onError`/`getMessageFallback` behavior preserved.
- `locale`/`messages` retained as explicit `Providers` props for 01-17 to switch together with a persisted preference.

## Task Commits

Each task was committed atomically:

1. **Task 1: Render the existing kids entry through an auth-free, request-independent shell** - `5bae3a25` (refactor)

**Plan metadata:** (pending — committed with this SUMMARY)

## Files Created/Modified
- `src/app/layout.tsx` - Kids-compatible root shell; removed header/footer/ads/analytics/pathname branch and config-driven theme computation.
- `src/components/providers/index.tsx` - Single `NextIntlClientProvider` wrapper; dropped session/theme/branding wrappers.
- `src/i18n/request.ts` - Deterministic bundled-message request config without `next/headers`; locale validated against `supportedLocales`.

## Decisions Made
- Reduced `Providers` to the intl provider only, treating the session/theme/branding wrappers as retired non-kids shell (consistent with 01-01 approval).
- Kept `locale`/`messages` as explicit props rather than collapsing them, so client locale selection (01-15 through 01-17) can attach without another shell rewrite.
- Validated the locale candidate against `supportedLocales` before building any message import path, implementing the plan's threat-model `mitigate` disposition for the "browser preference → rendered messages" boundary.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. Local lint (`npm run lint -- --quiet`) and the specified vitest file both pass; `npx tsc --noEmit` reports no errors in the three modified files.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- The request-independent, auth-free kids shell is in place; `providers/index.tsx` exposes only the intl context, so 01-15 through 01-17 can layer MDX, section locks and locale/progress wiring on top.
- `/kids` remains the entry (root page retained; no root promotion) and `/kids/map` + `/kids/level/[slug]` are untouched.
- No root-game route, static export or `next.config.ts` change was made — those remain Phase 2 ownership.

## Self-Check: PASSED

- `src/app/layout.tsx`, `src/components/providers/index.tsx`, `src/i18n/request.ts` exist and reflect the intended changes.
- Commit `5bae3a25` is an ancestor of HEAD.
- `npm run lint -- --quiet` → exit 0; `npm test -- src/__tests__/hooks/use-mobile.test.ts` → 14/14 passed.