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

## Phase 3: Bahasa Melayu (`ms`) Localization
**Goal:** Bahasa Melayu (`ms`) is a fully selectable locale backed by a complete UI message bundle and 19 localized interactive MDX levels, with no silent English fallback.
**Requirements:** FR-3
**Plans:** 4 plans
Plans:
- [ ] 03-01-PLAN.md — Register `ms` in all five registries + author complete `messages/ms.json` + tracer level 1-1 + Wave 0 tests
- [ ] 03-02-PLAN.md — Author ms levels 1-2…3-3 (9 files) + register them
- [ ] 03-03-PLAN.md — Author ms levels 3-4…5-4 (9 files) + register them (completes all 19)
- [ ] 03-04-PLAN.md — All-19-slug ms resolution test + phase gate (tsc/lint/tests/parity + static build)

- Add `ms` locale to `i18n` configurations and language switcher.
- Create `messages/ms.json` containing complete translations for the game interface.
- Localize all interactive MDX level files (19 registered slugs; requirements prose "17" is stale) under `src/content/kids/ms/`.
- Ensure level progression and interactive components work seamlessly in Bahasa Melayu.

## Phase 4: Verification, Testing & Polish
- Run TypeScript type checks (`npx tsc --noEmit`).
- Verify unit tests and test suites.
- Execute full static build (`npm run build`) and verify generated `out/` folder assets.
- Create onboarding summary and handoff.
