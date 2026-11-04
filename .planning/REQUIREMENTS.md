# Requirements: Kids Prompting Game Standalone & GitHub Pages

## Functional Requirements

- **FR-1: Kids Game as Primary Experience**
  - The application root (`/`) must directly launch the Kids Prompting Game.
  - The level map, world selection, and 17 game levels must function seamlessly without route conflicts.

- **FR-2: Pure Client-Side Persistence**
  - All player progress (stars, completed levels, unlocked worlds, sound settings) must persist via `localStorage`.
  - No server session or user database required to play.

- **FR-3: Bahasa Melayu Localization (`ms`)**
  - Add `ms` (Bahasa Melayu) to the available language selector.
  - Translate all UI strings in `messages/ms.json` (navigation, instructions, quiz prompts, badges, world titles).
  - Translate all 17 MDX levels into `src/content/kids/ms/` with accurate terminology adapted for young learners.

- **FR-4: GitHub Pages Static Deployment**
  - Project must produce a static HTML/JS/CSS bundle (`out/`) via `npm run build`.
  - Provide an automated GitHub Actions deployment workflow for GitHub Pages.

## Non-Functional & Codebase Requirements

- **NFR-1: Repository Pruning & Cleanliness**
  - Delete unused database schema, migrations, and seed files (`prisma/`).
  - Delete non-kids routes (`src/app/(auth)`, `src/app/admin`, `src/app/prompts`, `src/app/bots`, etc.).
  - Delete unused dependencies from `package.json` (`@prisma/client`, `prisma`, `next-auth`, `@aws-sdk/client-s3`, `@modelcontextprotocol/sdk`, `bcryptjs`, etc.).
  - Delete massive community prompt files (`prompts.csv`, `PROMPTS.md`).

- **NFR-2: Quality & Type Safety**
  - TypeScript types must pass check (`npx tsc --noEmit`).
  - Next.js static build must succeed (`npm run build`).
  - Unit tests for kids components/utils must pass.
