---
phase: 02-promote-kids-game-to-root-configure-static-export
verified: 2026-11-05T09:10:00Z
status: passed
score: 8/8 must-haves verified
covered_files: [".github/workflows/deploy.yml", ".gitignore", ".planning/phases/02-promote-kids-game-to-root-configure-static-export/02-01-PLAN.md", ".planning/phases/02-promote-kids-game-to-root-configure-static-export/02-01-SUMMARY.md", "next.config.ts", "src/__tests__/kids/level-locale.test.tsx", "src/__tests__/lib/seo.test.ts", "src/app/error.tsx", "src/app/layout.tsx", "src/app/level/[slug]/page.tsx", "src/app/map/page.tsx", "src/app/not-found.tsx", "src/app/page.tsx", "src/components/kids/elements/level-complete.tsx", "src/components/kids/elements/level-slides.tsx", "src/components/kids/elements/progress-map.tsx", "src/components/kids/layout/background-music.tsx", "src/components/kids/layout/kids-header.tsx", "src/components/kids/layout/kids-home-content.tsx", "src/components/kids/layout/level-content-wrapper.tsx", "src/components/kids/layout/settings-modal.tsx", "src/lib/kids/level-content.ts"]
covered_digest: "v4:sha256:accb5a27079be8ff4d819cef60cad0b145decec21eb0adbe83abca674ecd457d"
behavior_unverified: 0
overrides_applied: 0
---

# Phase 2: Promote Kids Game to Root & Configure Static Export — Verification Report

**Phase Goal:** Promote the kids game to the application root and produce a self-contained static export deployable to GitHub Pages.
**Verified:** 2026-11-05T09:10:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Verdict

**PASS.** All 8 deliverables independently reproduced in the codebase and in the emitted `out/` static bundle. The four quality gates pass (`lint` 0 errors, `test` 89/89, `tsc --noEmit` 0, `next build` emits a self-contained static export). Two non-blocking concerns are recorded below as informational rather than gaps: (a) three plain `<a href="/">` anchors in `kids-header.tsx` are not base-path-aware and would navigate to the Pages origin root when hosted under a repo sub-path, and (b) a GitHub Pages 404-fallback nuance for deep client routes. Neither prevents the phase goal — the game is at the root, builds statically, and deploys — but they are worth the deploy run / Phase 4 catching.

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Kids game is the root: `/` renders kids home, `/map` the map, `/level/[slug]` the 19 levels | ✓ VERIFIED | `src/app/page.tsx` → `<KidsHomeContent/>`; `src/app/map/page.tsx` → `<ProgressMap/>`; `src/app/level/[slug]/page.tsx` → `<LevelContentWrapper/>` + `generateStaticParams`. No `src/app/kids/` tree. |
| 2 | No route-level `/kids` link/href/router.push/path remains anywhere in `src/` | ✓ VERIFIED | `grep -rn '/kids' src/` returns only import paths (`@/components/kids`, `@/lib/kids`), i18n namespace strings (`useTranslations("kids")`), analytics `category: "kids"`, and the asset path `${basePath}/kids-music.mp3`. Zero route URLs. Emitted HTML contains 0 `/kids` links. |
| 3 | Root layout merges kids chrome with rebranded root metadata | ✓ VERIFIED | `src/app/layout.tsx` keeps html/body + "Sekolah Prompt-Fu" metadata and wraps children in `Providers → LevelProvider → MusicProvider → LocaleDirection` with `Schoolbell` font, gradient sky, 6 pixel clouds, `<KidsHeader/>`, `<main>`. |
| 4 | `next.config.ts` has `output:"export"`, `images.unoptimized:true`, basePath/assetPrefix from `NEXT_PUBLIC_BASE_PATH` (empty default) | ✓ VERIFIED | `output: "export"` (L23), `images: { unoptimized: true }` (L44-46), `basePath`/`assetPrefix` = `process.env.NEXT_PUBLIC_BASE_PATH || ""` (L17,33-34); `trailingSlash: true` added for directory-index output. |
| 5 | `background-music.tsx` loads bundled `/kids-music.mp3` base-path-aware, no `raw.githubusercontent.com` | ✓ VERIFIED | `getMusicUrl()` (L16-19) inlines the env var at build; basePath build chunk contains `let e="/sekolah-prompt".replace(...)→"${e}/kids-music.mp3"`. `grep raw.githubusercontent.com` = 0 in `src/` and `out/`. |
| 6 | `deploy.yml` exists with upload-pages-artifact + deploy-pages, correct perms/environment; `ci.yml` still lint+test; `out/` gitignored | ✓ VERIFIED | `deploy.yml`: `permissions: contents:read/pages:write/id-token:write`, `concurrency: pages`, `configure-pages`, `upload-pages-artifact@v3 path:./out`, `deploy-pages@v4` with `github-pages` environment. `ci.yml` runs `npm run lint` + `npm test`. `.gitignore` L18 `out/`; `git check-ignore out` matches; 0 tracked files. |
| 7 | Reproduced build emits `out/index.html`, `out/map/index.html`, `out/404.html`, all 19 `out/level/<slug>/index.html`, `out/kids-music.mp3` | ✓ VERIFIED | Ran `npm run build`: 25/25 static pages. `out/index.html` ✓, `out/map/index.html` ✓, `out/404.html` ✓, `out/level/*/index.html` = 19 ✓, `out/kids-music.mp3` = 2 757 694 bytes ✓. |
| 8 | 19 level slugs in `levels.ts` each have an emitted page AND an `src/content/kids/en/<slug>.mdx` | ✓ VERIFIED | Programmatic cross-check: `levels.ts` level-pattern slugs (`/^\d-\d-/`) = 19; `out/level/` dirs = 19; `src/content/kids/en/*.mdx` = 19; zero missing/extra in each direction. (24 total slugs in the file = 19 levels + 5 world slugs, which correctly do NOT get `/level/` pages.) |

**Score:** 8/8 truths verified (0 present, behavior-unverified)

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `src/app/page.tsx` | Kids home at `/` | ✓ VERIFIED | Renders `<KidsHomeContent/>`; metadata path `/` |
| `src/app/map/page.tsx` | World map at `/map` | ✓ VERIFIED | Renders `<ProgressMap/>`; metadata path `/map` |
| `src/app/level/[slug]/page.tsx` | 19 static level routes | ✓ VERIFIED | `generateStaticParams` over `getAllLevels()` (19) |
| `src/app/layout.tsx` | Merged root shell + kids chrome | ✓ VERIFIED | Rebranded metadata + full kids chrome |
| `next.config.ts` | Static-export config | ✓ VERIFIED | export + unoptimized + basePath/assetPrefix + trailingSlash |
| `src/components/kids/layout/background-music.tsx` | Bundled base-path-aware audio | ✓ VERIFIED | `getMusicUrl()`; no remote host |
| `.github/workflows/deploy.yml` | Pages deploy pipeline | ✓ VERIFIED | build → upload artifact → deploy; least-privilege |
| `out/index.html`, `out/map/index.html`, `out/404.html`, `out/level/<slug>/index.html` ×19, `out/kids-music.mp3` | Static bundle | ✓ VERIFIED | All present after reproduced build |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| kids home (`/`) | retained level registry | `getAllLevels()` | ✓ WIRED | `level/[slug]` `generateStaticParams` emits 19 routes from `src/lib/kids/levels.ts` |
| `next.config.ts` output:export + basePath | internal `<Link>` links | `next/link` basePath prefixing | ✓ WIRED | basePath build emitted `/sekolah-prompt/map/` for `<Link href="/map">` |
| `next.config.ts` basePath | music asset | `NEXT_PUBLIC_BASE_PATH` inlined in client chunk | ✓ WIRED | basePath build chunk → `/sekolah-prompt/kids-music.mp3` |
| `next.config.ts` basePath | plain `<a href>` anchors | — | ⚠️ PARTIAL | 3 × `<a href="/">` in `kids-header.tsx` stay `/` under basePath (see Concern 1) |
| level page | compiled MDX content | client lazy import map | ✓ WIRED | All 19 MDX chunks emitted in `out/_next/static/chunks/`; level HTML contains real section content |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| `src/app/level/[slug]/page.tsx` | level metadata/content | `getLevelBySlug` (real registry) + client MDX lazy import | Yes — 39 KB HTML, "Meet Promi", 19 emitted MDX chunks | ✓ FLOWING |
| `src/app/map/page.tsx` | world/level list | `ProgressMap` → `worlds` registry | Yes | ✓ FLOWING |
| `src/app/page.tsx` | home content | `<KidsHomeContent/>` (real component) | Yes | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| Static build emits self-contained export | `npm run build` | 25/25 static pages, `out/` = 19 MB, no server runtime | ✓ PASS |
| Lint | `npm run lint` | 0 errors, 48 warnings | ✓ PASS |
| Tests | `npm test` | 5 files, 89/89 passed | ✓ PASS |
| Type check | `npx --no-install tsc --noEmit` | exit 0 | ✓ PASS |
| 19 slugs ↔ pages ↔ MDX | node cross-check | all 3 sets = 19, zero missing/extra | ✓ PASS |
| Emitted HTML has no `/kids` links | `grep` over `out/*.html` | 0 matches | ✓ PASS |
| No remote asset dependency | `grep raw.githubusercontent.com` + remote-URL scan | 0 in `src/`; only `metadataBase` example URLs + pixabay attribution hrefs in HTML | ✓ PASS |

### Probe Execution

Not applicable — the phase declares no probes and is not a migration/CLI-probe phase. Step 7b/7c: SKIPPED (no probe files; behavioral checks above cover the runnable surfaces).

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| FR-1 | 02-01 | Kids game as primary experience at `/` | ✓ SATISFIED | `/`, `/map`, `/level/[slug]` render the game; no `/kids` route; 19 levels static. |
| FR-4 | 02-01 | GitHub Pages static deployment | ✓ SATISFIED | `output:"export"` builds self-contained `out/`; `deploy.yml` uploads + deploys to Pages with correct perms/environment; `out/` gitignored. |
| NFR-2 | 02-01 | Quality & type safety | ◑ INTERIM (by design) | `tsc` 0, lint 0 errors, tests 89/89, static build emits `out/` — reproduced here. Final certification remains **Phase 4** per ROADMAP/REQUIREMENTS. |

No orphaned requirements: REQUIREMENTS.md maps only FR-1/FR-4/NFR-2 to Phase 2, all claimed by 02-01. FR-2 (client persistence) is already delivered and unaffected; FR-3 (`ms` localization) is explicitly Phase 3.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| — | — | TBD/FIXME/XXX in phase-modified files | — | None — scan clean |
| — | — | placeholder / "coming soon" / empty-return stubs | — | None in root/home/map/level files |

### Human Verification Required

None. All must-haves were reproducible programmatically in this environment (structure, config, emitted bundle, gates). The one item the plan itself flagged as `human_judgment: true` — the deploy workflow running on the actual Pages runner — is a **deployment-time** confirmation owned by the push to `main` / the phase's later deploy run, not a source-code correctness question, and it does not leave a must-have behavior unproven here. See Concern 2 for the specific deploy-time behavior to watch.

## Concerns (non-blocking, informational)

### Concern 1 — Plain `<a href>` anchors are not base-path-aware (FR-4 sub-path correctness)

When built with `NEXT_PUBLIC_BASE_PATH=/sekolah-prompt`, `next/link` and static assets are correctly prefixed (`/sekolah-prompt/map/`, `/sekolah-prompt/_next/...`, `/sekolah-prompt/kids-music.mp3`), **but** Next.js does not rewrite plain DOM anchors. Three sites in `src/components/kids/layout/kids-header.tsx` (lines 48, 82/95/127/143 — the logo + "Home" + "Main site" buttons) use `<a href="/">`, which stays `/` and would send a visitor to `https://<owner>.github.io/` instead of the project site root.

Impact: cosmetic navigation defect under GitHub Pages project-site hosting only; does not affect the build, the root page, or the game itself. The plan explicitly scoped the link rewrite to `/kids…` routes (Task 3 verify tolerates it), so this is **in-scope-clean but sub-path-imperfect**. Recommend converting these to `next/link` (or prefixing with the base path) — a small follow-up, not a blocker. `router.push("/map")` in `settings-modal.tsx` goes through the Next router and *is* basePath-aware at runtime, so it is not affected.

### Concern 2 — GitHub Pages 404 fallback for deep client routes

`output:"export"` + `trailingSlash:true` emits `out/404.html` and `out/404/index.html`. GitHub Pages serves `404.html` for unknown paths. All real game routes are pre-rendered as `dir/index.html`, so normal navigation works, but any client-only path (e.g. a typo or a future dynamic route) will hit the Pages 404 rather than the app's `not-found`. This is the expected static-export behavior for this architecture and matches the phase goal ("self-contained static export"); flag it for Phase 4 UAT rather than treat it as a Phase 2 gap.

### Note — remote (non-asset) references present in emitted HTML

`metadataBase`/canonical URLs default to `https://sekolah-prompt-fu.example` (`src/lib/seo.ts` fallback; the deploy workflow overrides via `NEXT_PUBLIC_SITE_URL`), and `settings-modal.tsx` contains two `pixabay.com` music-attribution links. Neither is a runtime asset dependency — the bundle is self-contained (no remote fonts, scripts, images, or audio) and fully navigable offline. No action required.

## Deferred Items

Items intentionally owned by later phases — not Phase 2 gaps.

| # | Item | Addressed In | Evidence |
|---|------|--------------|----------|
| 1 | `ms` (Bahasa Melayu) localization — messages, locale config, MDX translations | Phase 3 | ROADMAP Phase 3 goal; REQUIREMENTS FR-3 |
| 2 | Final NFR-2 certification (full type-check / test / build sign-off) | Phase 4 | ROADMAP Phase 4; REQUIREMENTS NFR-2 marked "final certification Phase 4" |
| 3 | Deployment-run confirmation on the real GitHub Pages runner | Phase 4 / deploy run | Plan 02-01 coverage D3 `human_judgment: true` rationale |

## Gaps Summary

No gaps. The phase goal is achieved and independently reproduced: the kids game is served at the application root, `next.config.ts` produces a self-contained static export, the music asset is bundled and base-path-aware with no remote host, and a least-privilege GitHub Pages deploy workflow is in place with `ci.yml` intact and `out/` ignored. All four quality gates pass and all 19 levels cross-check across registry, emitted pages, and MDX source. The two concerns above are informational polish (base-path-aware anchors; 404 fallback UX) and belong to the deploy run / Phase 4 UAT — they do not block proceeding to Phase 3.

---

_Verified: 2026-11-05T09:10:00Z_
_Verifier: the agent (gsd-verifier)_