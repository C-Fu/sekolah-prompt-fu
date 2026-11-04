# Roadmap: Kids Prompting Game Standalone & GitHub Pages

## Phase 1: Purge Non-Kids Code & Dependencies
- Remove unused server code, Prisma ORM, database migrations, and NextAuth providers.
- Delete non-kids app routes and components (`src/app/(auth)`, `src/app/admin`, `src/app/prompts`, etc.).
- Delete large legacy prompt datasets (`prompts.csv`, `PROMPTS.md`).
- Clean up `package.json` dependencies and prune unused node packages.

## Phase 2: Promote Kids Game to Root & Configure Static Export
- Move `src/app/kids/*` routes to root (`src/app/`) or configure root entry point.
- Configure `next.config.ts` for static export (`output: 'export'`) and unoptimized images.
- Verify client components handle static generation without SSR mismatches.
- Add GitHub Pages CI/CD workflow (`.github/workflows/deploy.yml`).

## Phase 3: Bahasa Melayu (`ms`) Localization
- Add `ms` locale to `i18n` configurations and language switcher.
- Create `messages/ms.json` containing complete translations for the game interface.
- Localize all 17 interactive MDX level files under `src/content/kids/ms/`.
- Ensure level progression and interactive components work seamlessly in Bahasa Melayu.

## Phase 4: Verification, Testing & Polish
- Run TypeScript type checks (`npx tsc --noEmit`).
- Verify unit tests and test suites.
- Execute full static build (`npm run build`) and verify generated `out/` folder assets.
- Create onboarding summary and handoff.
