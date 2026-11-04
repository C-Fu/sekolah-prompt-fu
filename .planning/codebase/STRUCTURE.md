---
last_mapped_commit: 69a23c44b9723179eb3cc5677b666a2f9617dd78
last_mapped_at: 2026-11-04
---
# Codebase Structure

**Analysis Date:** 2026-11-04

## Directory Layout

```
sekolah-prompt/
├── .github/                # CI/CD workflows and GitHub issue templates
├── .planning/              # GSD project plans and codebase documentation
├── docker/                 # Container configuration and Dockerfile
├── messages/               # Localization strings (en.json, tr.json, es.json, etc.)
├── prisma/                 # Database schema, migrations, and seed scripts
├── public/                 # Static assets (favicons, logos, icons)
├── scripts/                # Utility scripts (PDF generator, data migrations, setup)
├── src/
│   ├── __tests__/          # Unit and component test suites
│   ├── app/                # Next.js App Router (pages and API route handlers)
│   ├── components/         # React components grouped by feature/domain
│   │   ├── admin/          # Admin dashboard UI
│   │   ├── auth/           # Login, registration, OAuth buttons
│   │   ├── book/           # Educational interactive prompt book components
│   │   ├── bots/           # Bot listings and team graphs
│   │   ├── layout/         # Header, footer, navigation
│   │   ├── prompts/        # Prompt cards, lists, detail views, forms
│   │   └── ui/             # Radix / shadcn/ui reusable primitives
│   ├── content/            # MDX content files for tutorials and guides
│   ├── hooks/              # Custom React hooks (debounce, mobile, etc.)
│   ├── i18n/               # next-intl configuration and routing utilities
│   └── lib/                # Shared utilities, services, db client, plugins
├── tests/                  # Legacy or standalone test files
├── compose.yml             # Docker compose configuration
├── package.json            # Dependencies and npm scripts
├── prompts.config.ts       # Application branding, theme, and feature switches
└── vitest.config.ts        # Vitest testing framework configuration
```

## Directory Purposes

**`src/app/`:**
- Purpose: Application routes and server entry points
- Contains: `page.tsx`, `layout.tsx`, `route.ts`, route groups like `(auth)`
- Key files: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/api/`

**`src/components/`:**
- Purpose: Reusable React presentation and interactive components
- Contains: Client and server components organized by domain
- Key files: `src/components/ui/`, `src/components/layout/header.tsx`

**`src/lib/`:**
- Purpose: Core backend and frontend business utilities
- Contains: Auth configuration, Prisma client singleton, plugin adapters, helpers
- Key files: `src/lib/db.ts`, `src/lib/auth/index.ts`, `src/lib/utils.ts`

**`prisma/`:**
- Purpose: Database schema definitions and migration history
- Contains: `schema.prisma`, `migrations/`, `seed.ts`
- Key files: `prisma/schema.prisma`

**`messages/`:**
- Purpose: Internationalization translation catalogs
- Contains: JSON files per locale (`en.json`, `es.json`, etc.)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML layout with providers
- `src/app/page.tsx`: Homepage prompt catalog and discovery
- `src/app/api/mcp/route.ts`: Model Context Protocol server entry point

**Configuration:**
- `prompts.config.ts`: Application branding, theme colors, active auth providers, feature flags
- `next.config.ts`: Next.js build options, redirects, MDX compilation
- `prisma/schema.prisma`: Database relational model

**Core Logic:**
- `src/lib/auth/index.ts`: NextAuth authentication setup
- `src/lib/db.ts`: Database client instantiation
- `src/lib/plugins/`: Pluggable authentication and storage logic

**Testing:**
- `vitest.config.ts`: Test environment configuration
- `vitest.setup.ts`: Test setup and polyfills
- `src/__tests__/`: Unit and component test suites

## Naming Conventions

**Files:**
- Components: `kebab-case.tsx` (e.g. `prompt-card.tsx`, `copy-button.tsx`)
- Utilities & Libraries: `kebab-case.ts` (e.g. `prompt-list.ts`, `rate-limit.ts`)
- Test files: `[name].test.ts` or `[name].test.tsx` adjacent or under `src/__tests__/`

**Directories:**
- Route folders: `kebab-case` or Next.js route segments (e.g. `(auth)`, `[username]`)
- Feature components: `kebab-case` (e.g. `components/action-buttons/`)

## Where to Add New Code

**New Feature Page:**
- Route: `src/app/{feature}/page.tsx`
- Translations: Add keys in `messages/*.json`
- Tests: `src/__tests__/app/{feature}.test.ts`

**New UI Component:**
- Base UI primitive: `src/components/ui/{component}.tsx`
- Feature component: `src/components/{feature}/{component}.tsx`
- Tests: `src/__tests__/components/{component}.test.tsx`

**New API Endpoint:**
- Route handler: `src/app/api/{feature}/route.ts`
- Tests: `src/__tests__/api/{feature}.test.ts`

**New Service / Helper:**
- Implementation: `src/lib/{utility}.ts`
- Tests: `src/__tests__/lib/{utility}.test.ts`

## Special Directories

**`.planning/`:**
- Purpose: GSD workflow artifacts, project specifications, and codebase maps
- Generated: Managed by GSD agents
- Committed: Yes

**`prisma/migrations/`:**
- Purpose: Versioned SQL migrations for schema changes
- Generated: Yes (via `npm run db:migrate`)
- Committed: Yes

---

*Structure analysis: 2026-11-04*
