---
last_mapped_commit: 69a23c44b9723179eb3cc5677b666a2f9617dd78
last_mapped_at: 2026-11-04
---
# Technology Stack

**Analysis Date:** 2026-11-04

## Languages

**Primary:**
- TypeScript 5.9.x - Frontend and backend application code (`src/**/*.ts`, `src/**/*.tsx`)

**Secondary:**
- JavaScript (Node.js) - Build scripts and tooling (`scripts/*.js`, `eslint.config.mjs`)
- SQL / Prisma Schema - Data models and database migrations (`prisma/schema.prisma`, `prisma/migrations/*`)
- MDX - Interactive documentation and educational guides (`src/content/**/*.mdx`, `mdx-components.tsx`)

## Runtime

**Environment:**
- Node.js >= 20.x (tested on v24.15.0)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.0.10 (App Router, Turbopack compatible) - Full-stack React framework
- React 19.2.0 & React DOM 19.2.0 - Core UI rendering engine

**UI & Styling:**
- Tailwind CSS 4 (`@tailwindcss/postcss`, `postcss.config.mjs`) - Utility-first styling
- Radix UI Primitives (`@radix-ui/react-*`) - Unstyled, accessible UI components
- shadcn/ui pattern (`components.json`, `src/components/ui/`) - Reusable UI component library
- Lucide React (`lucide-react`) - Icon system
- Sonner (`sonner`) - Toast notification system

**Data & Forms:**
- Prisma ORM 6.19.0 (`@prisma/client`, `prisma`) - Database ORM & migrations
- React Hook Form 7.68.0 (`react-hook-form`) - Form state management
- Zod 4.1.13 (`zod`, `@hookform/resolvers`) - Schema validation

**Internationalization:**
- next-intl 4.5.8 (`next-intl`) - App Router i18n support with 11+ locales (`messages/*.json`)

**Testing:**
- Vitest 4.0.15 (`vitest`, `vitest.config.ts`, `vitest.setup.ts`) - Unit and component test runner
- Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`) - UI testing utilities

**Build/Dev:**
- TypeScript compiler (`tsc`)
- ESLint 9 (`eslint`, `eslint.config.mjs`)

## Key Dependencies

**Critical:**
- `next-auth` 5.0.0-beta.30 (`@auth/prisma-adapter`) - Authentication engine with pluggable providers
- `@prisma/client` 6.19.0 - Database layer for PostgreSQL
- `@modelcontextprotocol/sdk` 1.24.3 - Model Context Protocol (MCP) server integration (`src/app/api/mcp/`)
- `openai` 6.10.0 - Semantic search embeddings and AI prompt generation

**Infrastructure & Utilities:**
- `@aws-sdk/client-s3` 3.948.0 - Optional cloud media storage
- `@sentry/nextjs` 10.32.1 - Application monitoring and error tracking
- `pino` 10.1.0 - Structured server-side logging
- `bcryptjs` 3.0.3 - Password hashing for credential auth
- `d3` 7.9.0 - Graph visualization (bots, teams, pairing graphs)
- `sharp` 0.33.5 - Image processing and optimization

## Configuration

**Environment:**
- Configured via `.env` / `.env.example`
- Critical variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- Optional feature variables: `OPENAI_API_KEY`, `SENTRY_DSN`, `S3_BUCKET`, `AUTH_GITHUB_ID`, `AUTH_GOOGLE_ID`, etc.

**Build:**
- Next.js configuration: `next.config.ts`
- Prisma config: `prisma.config.ts`
- Application configuration: `prompts.config.ts` (branding, themes, feature flags, plugins)
- TypeScript configuration: `tsconfig.json`

## Platform Requirements

**Development:**
- Node.js >= 20.0.0
- PostgreSQL database instance
- npm

**Production:**
- Vercel, Docker (`compose.yml`, `docker/Dockerfile`), or self-hosted Node.js server

---

*Stack analysis: 2026-11-04*
