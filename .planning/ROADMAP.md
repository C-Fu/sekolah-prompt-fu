# Roadmap: Kids Prompting Game Standalone & GitHub Pages

## Phase 1: Purge Non-Kids Code & Dependencies ✅ Complete (verified)
- Remove unused server code, Prisma ORM, database migrations, and NextAuth providers.
- Delete non-kids app routes and components (`src/app/(auth)`, `src/app/admin`, `src/app/prompts`, etc.).
- Delete large legacy prompt datasets (`prompts.csv`, `PROMPTS.md`).
- Clean up `package.json` dependencies and prune unused node packages.

## Phase 2: Promote Kids Game to Root & Configure Static Export 🚧 In progress (02-01 complete)
- Move `src/app/kids/*` routes to root (`src/app/`) or configure root entry point. ✅ done (02-01)
- Configure `next.config.ts` for static export (`output: 'export'`) and unoptimized images. ✅ done (02-01)
- Verify client components handle static generation without SSR mismatches. ✅ done (02-01; 89 tests pass, static build emits out/)
- Add GitHub Pages CI/CD workflow (`.github/workflows/deploy.yml`). ✅ done (02-01)

## Phase 3: Bahasa Melayu (`ms`) Localization ✅ Complete (verified)
**Goal:** Bahasa Melayu (`ms`) is a fully selectable locale backed by a complete UI message bundle and 19 localized interactive MDX levels, with no silent English fallback.
**Requirements:** FR-3
**Plans:** 6/6 plans complete (5 executed; 2 gap closures done)
Plans:
**Wave 1**
- [x] 03-01-PLAN.md — Register `ms` in all five registries + author complete `messages/ms.json` + tracer level 1-1 + Wave 0 tests

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 03-02-PLAN.md — Author ms levels 1-2…3-3 (9 files) + register them

**Wave 3** *(blocked on Wave 2 completion)*
- [x] 03-03-PLAN.md — Author ms levels 3-4…5-4 (9 files) + register them (completes all 19)

**Wave 4** *(blocked on Wave 3 completion)*
- [x] 03-04-PLAN.md — All-19-slug ms resolution test + phase gate (tsc/lint/tests/parity + static build)

**Wave 5 — gap closure** *(from UAT G-03-5)*
- [x] 03-05-PLAN.md — Reconcile `ms` World 4/5 names: `Gaung Penciptaan` + `Gunung Pakar` everywhere (bundle + lessons), removing the English "Master"

**Wave 6 — gap closure** *(from UAT G-03-4 + G-03-6)*
- [x] 03-06-PLAN.md — Normalize `ms` vocabulary (`bodil`→`lawak`, `bedtime`→`sebelum tidur`, `level`→`tahap`, `superhero`→`adiwira`) + re-ground 1-1 WordPredictor in Malay + commit persistent `scripts/check-ms-vocabulary.js` guard

**Cross-cutting constraints:**
- Each of the nine ms levels in this plan resolves via loadLevelContent('ms', slug) to effectiveLocale 'ms' with a Component distinct from en's for that slug.
- Every authored ms level ends in a LevelComplete with the matching real registry slug, so the map link renders.
- Every interactive MDX prop value AND all Panel/heading prose is in Bahasa Melayu (no half-localized English props).

- Add `ms` locale to `i18n` configurations and language switcher.
- Create `messages/ms.json` containing complete translations for the game interface.
- Localize all interactive MDX level files (19 registered slugs; requirements prose "17" is stale) under `src/content/kids/ms/`.
- Ensure level progression and interactive components work seamlessly in Bahasa Melayu.

## Phase 4: Verification, Testing & Polish
**Goal:** NFR-2 is certified end-to-end — a committed, rerunnable verification script re-runs `npx tsc --noEmit` and the Vitest suite and inspects the built `out/` export, CI enforces the same gate set, and an onboarding handoff (`HANDOFF.md`) documents architecture, gates, deploy, and known non-blocking advisories.
**Requirements:** NFR-2, FR-1, FR-4
**Plans:** 2/2 plans executed
Plans:
**Wave 1** *(parallel — no shared files)*
- [x] 04-01-PLAN.md — Tracer: `scripts/verify-project.js` certification script + `npm run verify` + `ci.yml` hardening (tsc step + verify step); `deploy.yml` untouched. Covers D-01…D-04, D-10…D-13; NFR-2/FR-1/FR-4.
- [x] 04-02-PLAN.md — `.planning/HANDOFF.md` (architecture recap, gate commands, deploy process, WR-04/IN-03 advisories) + NFR-2 certification notes in REQUIREMENTS/STATE/PROJECT. Covers D-05…D-09; NFR-2.

**Cross-cutting constraints:**
- Certified gate set is exactly `npx tsc --noEmit` + `npm test` + `npm run build`/`out/` inspection; do NOT add lint/`lint:mdx`/guards to the NFR-2 claim (D-02).
- `npm run verify` does NOT run the build — the build stays solely in `deploy.yml` (D-12).
- `deploy.yml` is NOT modified (D-13).
- WR-04 / IN-03 are handed off as known non-blocking advisories, not fixed (D-07/D-08).
