---
phase: 01-purge-non-kids-code-dependencies
plan: 07
subsystem: dependencies
tags: [npm, lockfile, pruning, ci, env, kids, nfr-1, package-legitimacy]

# Dependency graph
requires:
  - phase: 01-purge-non-kids-code-dependencies
    plan: 14
    provides: pinned-pre-pruning-baseline
    note: Immutable SHA 2c6e5cfcd8b30f2fc2688312fb2dac60ad61b348 and local next/eslint/tsc/vitest binaries
  - phase: 01-purge-non-kids-code-dependencies
    plan: 13
    provides: kids-only-config-and-removed-generators
provides:
  - lean-npm-manifest-and-lockfile
  - kids-only-ci-workflow
  - sanitized-env-example
  - dataset-and-legacy-asset-removal
affects: [02-*, 04-*]

# Actuals (#2632) — same estimateTokens scale (chars/4 over realized diff)
actuals:
  tokens: 185000
  tasks: 3
  commits: 3

# Tech tracking
tech-stack:
  added: []
  removed: [prisma, "@prisma/client", "@auth/prisma-adapter", next-auth, "@aws-sdk/client-s3", "@modelcontextprotocol/sdk", bcryptjs, "@types/bcryptjs", d3, "@types/d3", "@sentry/nextjs", "@monaco-editor/react", react-hook-form, "@hookform/resolvers", react-markdown, cmdk, date-fns, jszip, openai, pino, sharp, yaml, "@clack/prompts", puppeteer, tsx]
  patterns:
    - "Baseline-anchored lockfile audit: every retained locked entry compared against an immutable pre-pruning SHA, never against post-commit HEAD"

key-files:
  created: []
  modified:
    - package.json
    - package-lock.json
    - .github/workflows/ci.yml
    - .env.example
  deleted:
    - prompts.csv
    - PROMPTS.md
    - public/book-pdf/
    - public/bots/
    - public/sponsors/
    - .github/workflows/docker-publish.yml
    - .github/workflows/reset-credits.yml
    - .github/workflows/update-contributors.yml

key-decisions:
  - "Keep all 19 implemented kids levels even though REQUIREMENTS.md prose says 17 — the source of truth (src/lib/kids/levels.ts) defines 19 (1-1 … 5-4) and every one has an en MDX file; dropping two would destroy shipped content"
  - "Owner-approved divergence from the immutable baseline: @testing-library/dom 10.4.1 -> 10.4.2 (registry-published 2026-09-13, integrity verified) and six npm-11-materialized bundled nested entries of the unchanged, optional @tailwindcss/oxide-wasm32-wasi@4.1.18"
  - "Normal `next build` only; / root promotion and output:'export' static export are explicitly deferred to Phase 2"
  - "Residual non-declared legacy assets (animation*.mp4, book-cover*.jpg, logo-animated.svg, promi-animated.svg, mcp*.svg, context7.svg, deepwiki.svg) left in place — outside the plan's named deletion set"

patterns-established:
  - "Prune-then-regenerate: reduce package.json to retained imports, then `npm install --package-lock-only --ignore-scripts --no-audit`, then diff the lock against the pinned baseline before any install"

requirements-completed: [NFR-1, FR-1, FR-2]

# Coverage metadata (#1602)
coverage:
  - id: D1
    description: "Prompt datasets (prompts.csv, PROMPTS.md) and legacy published assets/jobs (public/book-pdf, public/bots, public/sponsors; docker-publish, reset-credits, update-contributors workflows) removed; CI and .env.example sanitized; kids media retained"
    requirement: NFR-1
    verification:
      - kind: automated
        ref: "node -e file-existence gate (task 1 <verify><automated>)"
        status: pass
    human_judgment: false
  - id: D2
    description: "package.json/package-lock.json pruned to a kids-only dependency set with no Prisma/NextAuth/S3/MCP/bcrypt direct deps and no DB lifecycle hooks"
    requirement: NFR-1
    verification:
      - kind: automated
        ref: "node -e baseline-comparison gate vs 2c6e5cfc… (task 2 <verify><automated>); pass with the two owner-waived categories proven to be the only diffs"
        status: pass
    human_judgment: false
  - id: D3
    description: "Lock audit gate human-waived for the two owner-approved baseline divergences"
    requirement: NFR-1
    verification: []
    human_judgment: true
    rationale: "A changed retained transitive (integrity-relevant) and added package entries require human sign-off by the plan's own Package Legitimacy Audit rule; owner approved both categories explicitly."
  - id: D4
    description: "Mandatory quality gates pass on the pruned tree: lint, unit tests, TypeScript check, normal Next build; src/app is kids-only; no live next-auth/@prisma/client/next/headers references; all 19 kids levels and media intact"
    requirement: NFR-2
    verification:
      - kind: automated
        ref: "npm run lint (exit 0); npm test (89/89 passing); npx --no-install tsc --noEmit (exit 0); npm run build (exit 0, 25 static pages, 19 level routes)"
        status: pass
    human_judgment: false

# Metrics
duration: 2h 0min
completed: 2026-11-04
status: complete
plan_head_before: 2efe61535b1ae4a30d86b00db3a761e43f485b6a
plan_head_after: 42d235c6fbae5fcc5b1e61b7e0c9da6542ea49ff
---

# Phase 1 Plan 07: Purge Non-Kids Code & Dependencies Summary

**Pruned the npm manifest/lockfile to a kids-only surface (1492 -> 826 locked packages), deleted community prompt datasets and legacy published/job assets, dropped DATABASE_URL from CI, and passed all four mandatory gates while preserving all 19 kids levels; the single mandated lock-audit divergence was human-waived.**

## Performance

- **Duration:** ~2h 0min
- **Started:** 2026-11-05T02:55:26+08:00
- **Completed:** 2026-11-04T22:56:56Z (UTC) / 2026-11-05 (~06:48 +08:00)
- **Tasks:** 3 (2 committed; task 3 is verification + this SUMMARY)
- **Files modified:** 85 (per `git diff --stat 2efe6153..HEAD`), incl. 4 edited and ~81 deletions

## Accomplishments

- **Datasets/jobs/assets removed (task 1):** `prompts.csv`, `PROMPTS.md`, `public/book-pdf/` (40 files), `public/bots/` (11), `public/sponsors/` (30), and the `docker-publish`, `reset-credits`, `update-contributors` workflows. CI env `DATABASE_URL` dropped while `lint` + `test` jobs retained. `.env.example` sanitized to the only key retained source reads (`NEXT_PUBLIC_SITE_URL`, `src/lib/seo.ts:33`). Kids media (`public/kids-music.mp3`, `public/sounds/**`, `public/favicon/**`, `public/og.png`, root kids graphics) deliberately kept.
- **Dependency pruning (task 2):** `scripts.build` `prisma generate && next build` -> `next build`; removed `postinstall`, the `prisma` seed block, every `db:*` script, and `setup`/`generate:examples`/`book:pdf*` scripts whose targets were deleted in 01-13. Removed every direct package with zero retained imports (Prisma, NextAuth, `@auth/prisma-adapter`, S3 SDK, MCP SDK, bcryptjs, Sentry, Monaco, d3, jszip, openai, pino, react-markdown, react-hook-form, cmdk, date-fns, yaml, sharp, puppeteer, tsx, `@clack/prompts`, unused `@radix-ui/*`), keeping Next/React, next-intl, MDX, kids UI and Vitest tooling. Lockfile regenerated with `npm install --package-lock-only --ignore-scripts --no-audit` (no install, no additions): **1492 -> 826 packages**, root sections match the manifest.
- **Final gates (task 3):** lint exit 0 (54 warnings, 0 errors), `npm test` 89/89 passing, `tsc --noEmit` exit 0, `next build` exit 0 (25 static pages; routes `/_not-found`, `/kids`, `/kids/map`, `/kids/level/[slug]` ×19, opengraph/twitter images; no `/` root). `src/app` contains no non-kids page/route (only kids routes + shared `layout.tsx`/`error.tsx`/`global-error.tsx`/`not-found.tsx`). No live `next-auth`/`@prisma/client`/`next/headers`/`from 'prisma'` references in retained source/scripts/CI; no orphan imports of deleted modules. All 19 kids level slugs in `src/lib/kids/levels.ts` exist with matching en MDX; public kids media intact.

## Task Commits

1. **Task 1: Drop prompt datasets, import jobs and unused published assets** - `4d6f1e98` (chore)
2. **Task 2: Reconcile npm dependencies and lifecycle scripts without adding packages** - `6757c777` (chore)

**Plan metadata:** _(this SUMMARY + state docs)_ (docs)

## Files Created/Modified

- `package.json` - build -> `next build`; DB/lifecycle scripts removed; dependency set pruned to kids-only
- `package-lock.json` - regenerated (1492 -> 826 packages); root sections match manifest
- `.github/workflows/ci.yml` - dropped `env.DATABASE_URL`; kept lint + test
- `.env.example` - reduced to `NEXT_PUBLIC_SITE_URL` with a rationale header
- `prompts.csv`, `PROMPTS.md`, `public/book-pdf/`, `public/bots/`, `public/sponsors/` - deleted
- `.github/workflows/{docker-publish,reset-credits,update-contributors}.yml` - deleted

## Decisions Made

- **19 levels, not 17.** REQUIREMENTS.md FR-1/FR-3 prose says 17, but `src/lib/kids/levels.ts` defines 19 (5 worlds, 3+4+4+4+4) and every slug has an en MDX file. Preserved all 19 to avoid destroying shipped content; the prose count is treated as an understatement to reconcile in a later phase.
- **Two lockfile divergences accepted as benign (owner-approved, Option 2):** see Deviations.
- **Normal build only.** `/` root promotion and `output:'export'` static export are Phase 2 (FR-1 root, FR-4); NFR-2 milestone-level certification is Phase 4. This plan claims neither.
- **Residual legacy assets left in place.** `public/animation*.mp4`, `public/book-cover*.jpg`, `public/logo-animated.svg`, `public/promi{,-animated}.svg`, `public/mcp{,-dark}.svg`, `public/context7.svg`, `public/deepwiki.svg` are not in the plan's named deletion set; removed nothing outside the declared `<files>` except as noted in Deviations.

## Deviations from Plan

### Owner-Approved Baseline Divergence (human-waived gate)

**1. [Rule 4 - Architectural/lockfile decision] Lock audit gate human-waived for two owner-approved categories**

- **Found during:** Task 2 (baseline-comparison `<verify><automated>` exited 4)
- **Issue:** Regenerating `package-lock.json` with `npm install --package-lock-only --ignore-scripts --no-audit` (npm 11.12.1) produced two classes of diff against the immutable pre-pruning baseline SHA `2c6e5cfcd8b30f2fc2688312fb2dac60ad61b348`:
  - **(a) One changed retained transitive:** `node_modules/@testing-library/dom` `10.4.1` -> `10.4.2` (resolved URL and integrity both changed). `10.4.2` is a genuinely published version (npm registry `time`: 2026-09-13, i.e. after the 01-14 baseline) with a registry-matching `sha512` integrity; `node_modules` still holds `10.4.1` from the 01-14 provisioning. `@testing-library/dom` is an unpinned transitive of the retained `@testing-library/react@16.3.1`.
  - **(b) Six added nested entries:** `@emnapi/core@1.7.1`, `@emnapi/runtime@1.7.1`, `@emnapi/wasi-threads@1.1.0`, `@napi-rs/wasm-runtime@1.1.0`, `@tybys/wasm-util@0.10.1`, `tslib@2.8.1`, all under `node_modules/@tailwindcss/oxide-wasm32-wasi/node_modules/`. These are the `bundleDependencies` of the **retained, version-identical** `@tailwindcss/oxide-wasm32-wasi@4.1.18` (`optional: true`, `dev: true`, `cpu: wasm32` — never installed here). npm 11 materializes them as explicit entries; the baseline lock (older npm) did not. They carry no `resolved`/`integrity` because they are bundled inside the package tarball. The top-level copies of these packages remain byte-identical to the baseline.
- **Why it required a human:** the plan's task-2/task-3 `<action>` and `<fails_when>` state that **any** added entry or changed version/host/integrity must STOP for blocking human legitimacy approval rather than be self-cleared — including benign cases. Exit 4 is the designed trigger.
- **Resolution:** Owner recorded **Option 2 — accept both deltas as benign** (registry integrity verified for (a); (b) is optional/non-installed bundled materialization of an unchanged package). The owner granted explicit approval for BOTH categories relative to SHA `2c6e5cfc…`.
- **Verification:** An owner-waiver-aware re-run of the plan's exact gate waived only `node_modules/@testing-library/dom` and entries under `node_modules/@tailwindcss/oxide-wasm32-wasi/node_modules/`, and confirmed **0 unexpected added entries, 0 unexpected changed entries, 0 unexpected untrusted host/integrity entries** (672 intentional removals). The verbatim gate still exits 4 solely due to these two waived categories; it remains a hard failure on any OTHER unexpected entry.
- **Files modified:** `package.json`, `package-lock.json`
- **Committed in:** `6757c777` (Task 2 commit body records the approved divergence and the baseline SHA)

### Test Flake Reproduced and Resolved (no code change)

**2. [Rule 1 - Bug/manifestation] `npm test` first parallel run timed out; flake, not a regression**

- **Found during:** Task 3 (`npm test` exited 1 on the first run — 4 failed / 85 passed, failures all ~50s timeouts in the two MDX-heavy test files)
- **Issue:** The default parallel vitest run starved 4 CPUs while compiling real MDX in concurrent jsdom workers, tripping per-test timeouts (`level-locale.test.tsx`, `settings-locale.test.tsx`). The same files pass in isolation and under `--no-file-parallelism`.
- **Reproduction / fix:** Reproduced as a resource-contention timeout, then re-ran: `npm test` passed **89/89** on the next two runs (14–15s), and `npx vitest run --no-file-parallelism` passed 89/89 (20.5s). No source change was needed; the failure is not attributable to the Task 2 dependency pruning.
- **Files modified:** none
- **Verification:** `npm test` 89/89 ×2 subsequent runs; single-threaded run 89/89.

---

**Total deviations:** 1 owner-approved lockfile divergence (human-waived gate) + 1 reproduced test flake (no code change).
**Impact on plan:** No scope creep. The pruning intent is fully met; the only manifest/lock deltas are the two owner-approved categories, and no new direct dependency was added.

## Issues Encountered

- **NPM non-idempotence during regeneration:** the first `--package-lock-only` run differed from subsequent runs only by `devOptional: true` -> `dev: true` metadata flags; the lockfile converges to a stable idempotent form after a warm second run (used for all audits). No version/resolved/integrity effect.
- **`ENVIRONMENT_FALLBACK` log line during `next build`:** printed while collecting page data; build still completed exit 0 with all 25 static pages generated. Informational, not a failure.

## Deferred Items (out of declared scope)

- `eslint.config.mjs` still contains a now-stale `globalIgnores` entry `"prisma/**"` (the `prisma/` dir was deleted). Cosmetic; not in this plan's `<files>`.
- `README.md`, `CONTRIBUTING.md`/`.github/PULL_REQUEST_TEMPLATE.md`, `AGENTS.md` reference `prompts.csv`/`PROMPTS.md`. These are marketing/contribution docs, not operational references that affect build/lint/test; left untouched as out of the declared file set.
- Residual non-declared legacy assets in `public/` (`animation*.mp4`, `book-cover*.jpg`, `logo-animated.svg`, `promi{,-animated}.svg`, `mcp{,-dark}.svg`, `context7.svg`, `deepwiki.svg`) remain — outside the plan's named deletion list.

## Kids Level Inventory (19 — requirements prose says 17)

`src/lib/kids/levels.ts` defines **19** levels across 5 worlds; all 19 have `src/content/kids/en/<slug>.mdx`:

1-1-meet-promi, 1-2-first-words, 1-3-being-clear, 2-1-missing-details, 2-2-who-and-what, 2-3-when-and-where, 2-4-detail-detective, 3-1-setting-the-scene, 3-2-show-dont-tell, 3-3-format-finder, 3-4-context-champion, 4-1-pretend-time, 4-2-story-starters, 4-3-character-creator, 4-4-world-builder, 5-1-perfect-prompt, 5-2-fix-it-up, 5-3-prompt-remix, 5-4-graduation-day.

## Phase Handoff (not claimed here)

- **`/` root promotion of the kids game** (FR-1 root) → Phase 2. `src/app` deliberately has no root `page.tsx`; the game stays at `/kids`.
- **Static export / GitHub Pages** (`output: 'export'`, `out/` — FR-4) → Phase 2. `next.config.ts` has no `output` key; the build above is a normal Next build, never static export.
- **NFR-2 milestone-level certification** (final static build + type/test sign-off) → Phase 4. This plan's lint/test/tsc/normal-build results are an interim gate only.

## Next Phase Readiness

- Repository is clean enough for Phase 2: manifest/lock consistent, CI kids-only, `.env.example` minimal, app tree kids-only, all 19 levels + media intact, all four mandatory gates green.
- Baseline audit is reproducible from SHA `2c6e5cfcd8b30f2fc2688312fb2dac60ad61b348`; the only permitted divergences are the two owner-approved categories.

---
*Phase: 01-purge-non-kids-code-dependencies*
*Completed: 2026-11-04*

## Self-Check: PASSED

- Task 1 `<verify><automated>`: PASS (datasets/jobs/assets absent; kids media + en MDX present).
- Task 2 `<verify><automated>`: verbatim exits 4 solely for the two owner-waived categories; waiver-aware audit proves 0 other unexpected added/changed/untrusted entries.
- Task 3 gate: four binaries present; `npm run lint` exit 0; `npm test` 89/89; `npx --no-install tsc --noEmit` exit 0; `npm run build` exit 0. 19 kids slugs + en MDX + media verified; `src/app` kids-only; no live server-dep references.
- Commits: `4d6f1e98` (task 1), `6757c777` (task 2) — both an ancestor of HEAD.
- `plan_head_before: 2efe6153…` (base for the commit count), measured commits: 3 (2 task + 1 docs). Metadata commit base `42d235c6`.