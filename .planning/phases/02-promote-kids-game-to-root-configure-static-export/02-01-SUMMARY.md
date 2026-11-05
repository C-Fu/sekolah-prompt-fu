---
phase: 02-promote-kids-game-to-root-configure-static-export
plan: 01
subsystem: infra
tags: [nextjs, static-export, github-pages, next-intl, mdx, basePath, routing]

requires:
  - phase: 01-purge
    provides: kids-only src/app tree, deterministic i18n request config, rebranded metadata
provides:
  - Kids game served at application root (/, /map, /level/[slug]) with no /kids prefix
  - Self-contained static export (out/) configured via output:'export'
  - Bundled, base-path-aware background music asset
  - GitHub Pages deploy workflow
affects: [03-ms-localization, 04-verification]

actuals:
  tokens: 7700
  tasks: 3
  commits: 3

tech-stack:
  added: []
  patterns:
    - "Root layout merge: preserve html/body + rebranded metadata, wrap children in kids chrome (LevelProvider → MusicProvider → LocaleDirection, Schoolbell font, pixel clouds, KidsHeader, <main>)"
    - "Static export with trailingSlash:true so GitHub Pages serves dir/index.html clean URLs"
    - "Asset URLs derived from NEXT_PUBLIC_BASE_PATH (empty by default) for project-site sub-path hosting"

key-files:
  created:
    - .github/workflows/deploy.yml
  modified:
    - next.config.ts
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/app/map/page.tsx
    - src/app/level/[slug]/page.tsx
    - src/components/kids/layout/background-music.tsx
    - src/app/not-found.tsx
    - src/app/error.tsx
    - src/components/kids/layout/kids-header.tsx
    - src/components/kids/layout/settings-modal.tsx
    - src/components/kids/layout/kids-home-content.tsx
    - src/components/kids/layout/level-content-wrapper.tsx
    - src/components/kids/elements/level-complete.tsx
    - src/components/kids/elements/level-slides.tsx
    - src/components/kids/elements/progress-map.tsx
    - src/lib/kids/level-content.ts
    - src/__tests__/lib/seo.test.ts
    - src/__tests__/kids/level-locale.test.tsx
    - .gitignore

key-decisions:
  - "Relocate (not redirect) the kids routes: output:'export' disables Next redirects, so / must be a real page"
  - "Merge kids chrome into the root layout rather than nesting a second layout, since a route group was not introduced"
  - "Add trailingSlash:true so the export emits out/map/index.html and out/level/<slug>/index.html, which GitHub Pages serves as clean URLs"
  - "Drive basePath/assetPrefix and the music URL from NEXT_PUBLIC_BASE_PATH (empty by default) so local npm run build works and Pages sub-path hosting resolves"
  - "Remove the export-incompatible experimental.serverActions and the now-unnecessary images.remotePatterns"

requirements-completed: [FR-1, FR-4, NFR-2]

coverage:
  - id: D1
    description: "Kids game served at application root: /, /map, /level/[slug] (19 static levels), no /kids references"
    requirement: FR-1
    verification:
      - kind: automated_ui
        ref: "grep -rn '/kids' src/ → none; node structure check for src/app/{page,map/page,level/[slug]/page,layout}.tsx + generateStaticParams"
        status: pass
      - kind: unit
        ref: "vitest: src/__tests__/kids/level-locale.test.tsx, src/__tests__/lib/seo.test.ts (89 tests passed)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Self-contained static export in out/ with bundled music and no remote asset dependency"
    requirement: FR-4
    verification:
      - kind: integration
        ref: "npm run build → out/index.html, out/map/index.html, out/level/*/index.html, out/kids-music.mp3; no raw.githubusercontent.com across out/"
        status: pass
    human_judgment: false
  - id: D3
    description: "GitHub Pages deploy workflow (deploy.yml) with least-privilege perms, Pages artifact upload and deploy"
    requirement: FR-4
    verification:
      - kind: other
        ref: "node check: deploy.yml contains deploy-pages + upload-pages-artifact; .gitignore matches ^\\s*out/?\\s*$; ci.yml untouched"
        status: pass
    human_judgment: true
    rationale: "Workflow correctness on the actual GitHub Pages runner (OIDC, environment, base path) can only be confirmed by a real push to main; local static checks do not exercise the runner."

duration: 18min
completed: 2026-11-05
status: complete
---

# Phase 2 Plan 1: Promote Kids Game to Root & Configure Static Export Summary

**Kids game promoted to the application root (/, /map, /level/[slug]), music bundled locally, and a self-contained GitHub Pages static export built and deployable via a new workflow.**

## Performance

- **Duration:** ~18 min
- **Started:** 2026-11-05T08:10:00Z
- **Completed:** 2026-11-05T08:2x:00Z
- **Tasks:** 3
- **Files modified:** 21 (2 renames, 1 new workflow, 18 edits)

## Accomplishments
- The kids game is now the app root: `/` renders the kids home, `/map` the world map, and `/level/[slug]` each of the 19 levels as static HTML; the `src/app/kids` tree is gone and zero `/kids` URL links remain in `src/`.
- Single merged root layout preserves the rebranded metadata and the exact kids visual chrome (Schoolbell font, gradient sky, animated pixel clouds, `KidsHeader`, `LevelProvider`/`MusicProvider`/`LocaleDirection`, `<main>` wrapper).
- `next.config.ts` produces a self-contained static export (`output: 'export'`, `images.unoptimized`, `trailingSlash: true`, base-path-aware `basePath`/`assetPrefix`) with no server runtime.
- Background music loads the bundled `/kids-music.mp3` (base-path-aware); the remote `raw.githubusercontent.com` source is gone.
- `.github/workflows/deploy.yml` builds and deploys `out/` to GitHub Pages with least-privilege permissions and a `github-pages` environment; `ci.yml` is untouched.

## Task Commits

Each task was committed atomically:

1. **Task 1: Promote the kids routes to the application root** - `fa945d10` (feat)
2. **Task 2: Bundle the music asset and enable the static export** - `bde85115` (feat)
3. **Task 3: Add the GitHub Pages deployment workflow and verify the static bundle** - `bf449d63` (ci)

**Plan metadata:** `_pending_` (docs: complete plan)

## Files Created/Modified
- `src/app/page.tsx` (renamed from `src/app/kids/page.tsx`) - kids home at `/`; metadata path `/`
- `src/app/map/page.tsx` (renamed) - world map at `/map`; metadata path `/map`
- `src/app/level/[slug]/page.tsx` (renamed) - level route at `/level/[slug]` with `generateStaticParams` for all 19 slugs
- `src/app/layout.tsx` - merged root layout: rebranded metadata + kids chrome
- `src/app/kids/layout.tsx` - deleted (chrome merged into root layout)
- `src/app/not-found.tsx`, `src/app/error.tsx` - `/kids` links → `/` and `/map`
- `src/components/kids/layout/kids-header.tsx`, `settings-modal.tsx`, `kids-home-content.tsx`, `level-content-wrapper.tsx` - internal links rewritten
- `src/components/kids/elements/level-complete.tsx`, `level-slides.tsx`, `progress-map.tsx` - level/map links rewritten
- `src/components/kids/layout/background-music.tsx` - `getMusicUrl()` base-path-aware bundled asset
- `next.config.ts` - static export config
- `.github/workflows/deploy.yml` - GitHub Pages deploy pipeline
- `.gitignore` - `out/` entry normalized so the plan's verify matches
- `src/lib/kids/level-content.ts` - stale `/kids/level/[slug]` doc comment corrected
- `src/__tests__/lib/seo.test.ts`, `src/__tests__/kids/level-locale.test.tsx` - expectations updated to root-relative paths

## Decisions Made
- Relocate the kids routes to root rather than redirect, because `output: 'export'` disables Next redirects and `/` must be a real page.
- Merge the kids layout chrome into the existing root layout instead of introducing a route group — keeps a single html/body/metadata shell and avoids a nested layout.
- Added `trailingSlash: true` so the export emits directory `index.html` files (`out/map/index.html`, `out/level/<slug>/index.html`), which is what GitHub Pages serves as clean URLs and what the plan's verify asserts.
- Base path is opt-in via `NEXT_PUBLIC_BASE_PATH` (empty by default), so plain local `npm run build` stays navigable while the Pages workflow sets the repo sub-path.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added `trailingSlash: true` for directory-index output**
- **Found during:** Task 2 (static export build)
- **Issue:** Next.js 16 default output emitted `out/map.html` and `out/level/<slug>.html` (plus payload-only directories), so `out/map/index.html` and `out/level/<slug>/index.html` required by the plan's verify and by GitHub Pages directory-index serving were absent.
- **Fix:** Set `trailingSlash: true` in `next.config.ts` so every route emits `dir/index.html`.
- **Files modified:** next.config.ts
- **Verification:** `npm run build` then asserted `out/map/index.html` and all 19 `out/level/<slug>/index.html` exist.
- **Committed in:** bde85115 (Task 2 commit)

**2. [Rule 3 - Blocking] Corrected `.gitignore` `out/` entry to satisfy the plan's verify**
- **Found during:** Task 3 (workflow verification)
- **Issue:** `.gitignore` carried `\/out\/` (leading slash) but the plan's verify regex `^\s*out\/?\s*$` requires an `out` line without a leading slash, so the check failed with exit 3.
- **Fix:** Changed the entry to `out/` (functionally equivalent for a root `out/`); confirmed `git check-ignore out` still matches and no build output is staged.
- **Files modified:** .gitignore
- **Verification:** verify node check passes; `git status --short` shows no `out/` files.
- **Committed in:** bf449d63 (Task 3 commit)

**3. [Rule 3 - Blocking] Fixed a test import of the moved route**
- **Found during:** Task 1 (link rewrite)
- **Issue:** `src/__tests__/kids/level-locale.test.tsx` imported `generateStaticParams` from `@/app/kids/level/[slug]/page`, which no longer exists after relocation.
- **Fix:** Updated the import to `@/app/level/[slug]/page`.
- **Files modified:** src/__tests__/kids/level-locale.test.tsx
- **Verification:** Full vitest suite (89 tests) passes.
- **Committed in:** fa945d10 (Task 1 commit)

---

**Total deviations:** 3 auto-fixed (3 blocking)
**Impact on plan:** All three were necessary to satisfy the plan's own verification/acceptance criteria and to keep the moved test suite green. No scope creep — no new dependencies, no Phase 3/4 work.

## Issues Encountered
- Next.js 16 prints a benign `ENVIRONMENT_FALLBACK` next-intl message during static generation; `src/i18n/request.ts` already swallows it in `onError`, and it does not fail the build.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: ci-supply-chain | .github/workflows/deploy.yml | New CI deploy workflow introduces third-party action dependencies at the Pages trust boundary. Mitigated per T-02-02: official `actions/*` pinned to major versions, least-privilege permissions (`contents: read`, `pages: write`, `id-token: write`), and only the built `out/` artifact is deployed. |

## User Setup Required
None — no external service configuration required. The Pages project must have GitHub Pages enabled with "GitHub Actions" as the source (repository setting), which is a one-time dashboard toggle outside plan scope.

## Next Phase Readiness
- The app is a root-served, self-contained static export; Phase 3 (`ms` localization) can add `messages/ms.json`, the `ms` locale config and `src/content/kids/ms/*` without touching routing.
- Build toolchain verified here: `npm run lint`, `npm test` (89 passing), `npx tsc --noEmit`, `npm run build` (static `out/`).
- No blockers. Confirming the workflow on a real push to `main` is deferred to the deploy run itself (see D3).

## Self-Check: PASSED

- Commits verified: fa945d10, bde85115, bf449d63 all ancestors of HEAD.
- Artifacts verified: `out/index.html`, `out/map/index.html`, `out/kids-music.mp3`, all 19 `out/level/<slug>/index.html`.
- No `/kids` URL references remain in `src/`; no `raw.githubusercontent.com` in `src/` or `out/`.

---
*Phase: 02-promote-kids-game-to-root-configure-static-export*
*Completed: 2026-11-05*