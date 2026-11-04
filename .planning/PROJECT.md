# Project: Prompts.chat Kids (Learn Prompting for Kids)

## Vision & Objective
Transform the repository from a heavy social prompt-sharing platform into a lightweight, standalone, gamified interactive learning application for kids to learn prompt engineering ("Learn Prompting for Kids").

The entire codebase will be stripped of server-side dependencies (PostgreSQL, Prisma, NextAuth, OpenAI backend, large community prompt datasets) and configured to build as a 100% static site export capable of deploying directly to **GitHub Pages**.

In addition, full support for **Bahasa Melayu (`ms`)** will be added alongside existing languages, including all 17 interactive MDX game levels.

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
- ✓ 17 gamified interactive prompting levels with interactive widgets (`src/content/kids/en/*.mdx`)
- ✓ Client-side progress tracking via `localStorage` (`src/lib/kids/progress.ts`)
- ✓ Audio effects and background music engine (`src/components/kids/layout/background-music.tsx`)
- ✓ Pixel-art themed game UI and responsive map

### Active
- [ ] Remove all non-kids routes, components, and server-side code (Prisma, NextAuth, API routes).
- [ ] Delete `prompts.csv` and `PROMPTS.md` to trim repo size.
- [ ] Clean up `package.json` dependencies to keep only Next.js static site requirements.
- [ ] Promote Kids game to root page (`/`).
- [ ] Configure `next.config.ts` for static export (`output: 'export'`, `images: { unoptimized: true }`).
- [ ] Add GitHub Actions deploy workflow for GitHub Pages (`.github/workflows/deploy.yml`).
- [ ] Add Bahasa Melayu (`ms`) language support:
  - Add `ms` to locale configurations.
  - Create `messages/ms.json`.
  - Create 17 localized level MDX files under `src/content/kids/ms/`.
- [ ] Verify test suite and static build pass cleanly.

### Out of Scope
- Backend database / server-side user accounts (progress will be browser-local).
- Live LLM calls via secret server keys (game relies on pre-programmed interactive feedback and simulations).
