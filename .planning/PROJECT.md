# Project: Prompts.chat Kids (Learn Prompting for Kids)

## Vision & Objective
Transform the repository from a heavy social prompt-sharing platform into a lightweight, standalone, gamified interactive learning application for kids to learn prompt engineering ("Learn Prompting for Kids").

The entire codebase will be stripped of server-side dependencies (PostgreSQL, Prisma, NextAuth, OpenAI backend, large community prompt datasets) and configured to build as a 100% static site export capable of deploying directly to **GitHub Pages**.

In addition, full support for **Bahasa Melayu (`ms`)** will be added alongside existing languages, including all 19 interactive MDX game levels.

## Key Decisions

1. **Static-First Architecture (GitHub Pages Ready):**
   - Use Next.js `output: 'export'` with `images: { unoptimized: true }`.
   - Client-side persistence using `localStorage` for level progress, stars, volume, and section completion.
   - Zero database or server runtime dependencies.

2. **Purge Non-Kids Code:**
   - Remove Prisma schema, migrations, and seed scripts.
   - Remove non-kids routes: `(auth)`, `admin`, `prompts`, `bots`, `categories`, `collection`, `book`, `tags`, etc.
   - Remove heavyweight root assets: `prompts.csv` (~10MB) and `PROMPTS.md` (~10MB).
   - Remove unused npm dependencies (`@prisma/client`, `prisma`, `next-auth`, `@aws-sdk/client-s3`, `@modelcontextprotocol/sdk`, `bcryptjs`, etc.).

3. **Promote Kids Game to Root Experience:**
   - The root URL (`/`) will directly serve the Kids Prompting Game experience.
   - Retain audio, pixel art cloud animations, interactive quiz/drag-and-drop widgets, and level maps.

4. **Bahasa Melayu (`ms`) Localization:**
   - Register `ms` in supported locales.
   - Provide `messages/ms.json` with complete translations for all kids components, UI elements, navigation, and badges.
   - Localize all 17 level MDX files into `src/content/kids/ms/`.

## Requirements

### Validated
- ✓ Repository purged to a kids-only surface: Prisma/NextAuth/non-kids routes and component families removed, npm lockfile cut from 1,492 → 826 packages, community prompt datasets deleted — v1.0
- ✓ 19 gamified interactive prompting levels with interactive widgets (`src/content/kids/en/*.mdx`); client-side progress (`localStorage`), audio/background-music engine, and pixel-art UI retained — v1.0 (19 registered slugs; the "17" figure in the vision prose is stale)
- ✓ Kids game promoted to the root experience (`/`, `/map`, `/level/[slug]`) as a 100% static `out/` export with a GitHub Pages deploy workflow and locally-bundled music — v1.0
- ✓ Bahasa Melayu (`ms`) locale fully selectable, with a complete 212-key UI message bundle (`messages/ms.json`) and all 19 interactive MDX levels localized under `src/content/kids/ms/`; no silent English fallback — v1.0
- ✓ NFR-2 certified end-to-end via a committed, rerunnable verification script (`scripts/verify-project.js` / `npm run verify`) and a CI job enforcing the same gate set (`--gates-only`, bounded gate timeout) — v1.0
- ✓ Onboarding handoff (`.planning/HANDOFF.md`) documenting architecture, gate commands, deploy process, and known non-blocking advisories — v1.0
- ✓ Milestone audit: 6/6 requirements satisfied, 4/4 phases verified, 6/6 cross-phase integrations wired, 5/5 E2E flows complete — no critical blockers (`tech_debt` only) — v1.0

### Active
- (none yet — next milestone requirements defined via `/gsd-new-milestone`)

### Out of Scope
- Backend database / server-side user accounts (progress is browser-local).
- Live LLM calls via secret server keys (game relies on pre-programmed interactive feedback and simulations).

## Context

Shipped **v1.0** on 2026-11-07 (Phases 1-4; 27 plans, 51 tasks). Stack: Next.js (App Router, `output: 'export'`), TypeScript, next-intl (en + ms), Vitest, GitHub Actions → GitHub Pages. Test suite is 119/119; `npm run verify` re-certifies tsc + Vitest + `out/` inspection.

**Known technical debt (non-blocking, carried into v1.1):**
- `scripts/check-kids-import-closure.js` entry-point list still targets removed `src/app/kids/*` paths → exits 2 after the Phase-2 root promotion (WARNING, dormant).
- `scripts/check-ms-vocabulary.js` is committed and self-failing but not wired into any npm script or CI workflow (WR-02).
- Locale-list drift: `settings-modal.tsx` hard-codes a third locale list that drifts from `supportedLocales` (`he` absent); duplicated locale literal arrays across `prompts.config.ts` and `src/lib/i18n/config.ts` (WR-04/IN-03).
- Doc/test-count drift: `HANDOFF.md` still cites 94/94 tests and an unflagged `npm run verify` (current: 119/119, `--gates-only` in CI).
- Residual non-kids media in `public/`; vestigial empty `public/sounds/`; stale `prisma/**` ignore in `eslint.config.mjs`; unused `next/headers` test stub in `vitest.setup.ts`.

See `.planning/v1-MILESTONE-AUDIT.md` for the full aggregated list (~15 items, 1 WARNING).

---
*Last updated: 2026-11-07 after v1.0 milestone*
