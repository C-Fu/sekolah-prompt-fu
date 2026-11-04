---
last_mapped_commit: 69a23c44b9723179eb3cc5677b666a2f9617dd78
last_mapped_at: 2026-11-04
---
<!-- refreshed: 2026-11-04 -->
# Architecture

**Analysis Date:** 2026-11-04

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                     │
├──────────────────┬──────────────────┬───────────────────────┤
│ App Pages (RSC)  │ Client Islands   │ Route Handlers (API)  │
│  `src/app/*`     │ `src/components` │   `src/app/api/*`     │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business & Service Layer                 │
│         `src/lib/*` (auth, plugins, mcp, ai, connectors)    │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                 Data Access & Storage Layer                 │
│         Prisma Client (`src/lib/db.ts`) / PostgreSQL / S3   │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| App Router | Handles server-rendered pages, metadata, layouts, and route handlers | `src/app/` |
| UI Components | Presentational primitives and compound widgets built on Radix UI | `src/components/ui/` |
| Feature Components | Domain components (prompts, bots, teams, comments, admin, settings) | `src/components/` |
| Auth Core | NextAuth session orchestration and provider registration | `src/lib/auth/index.ts` |
| Database Singleton | Prisma Client instantiation and connection handling | `src/lib/db.ts` |
| Plugin System | Pluggable auth providers and media storage strategies | `src/lib/plugins/` |
| MCP Engine | Model Context Protocol endpoints exposing prompts to external LLMs | `src/app/api/mcp/` |
| Config Engine | Main application branding, features, and i18n switches | `prompts.config.ts` |

## Pattern Overview

**Overall:** Next.js 16 App Router Architecture with React Server Components by default, Server Actions / Route Handlers for mutations, and a Pluggable Provider pattern for auth/storage.

**Key Characteristics:**
- **Server Components by Default:** Pages (`src/app/**/page.tsx`) perform direct database queries via Prisma or server helper libraries without unnecessary client overhead.
- **Pluggable Architecture:** Authentication methods (credentials, Google, GitHub, Azure) and storage engines (URL, S3) are abstracted behind extensible interfaces in `src/lib/plugins/`.
- **Internationalization (i18n):** User-facing content is localized across 11+ languages via `next-intl`, reading from `messages/{locale}.json`.
- **MCP Integration:** First-class support for AI tools using the Model Context Protocol SDK.

## Layers

**Presentation Layer:**
- Purpose: Render accessible, localized UI and handle user input
- Location: `src/app/` and `src/components/`
- Contains: React Server Components, Client Components (`"use client"`), Radix primitives
- Depends on: `src/lib/`, `prompts.config.ts`, `next-intl`

**Domain / Service Layer:**
- Purpose: Business logic, rate-limiting, similarity search, prompt formatting, validation
- Location: `src/lib/`
- Contains: Pure functions, Zod validation schemas, adapter bridges
- Depends on: Prisma client, external SDKs (OpenAI, AWS S3)

**Data Persistence Layer:**
- Purpose: Database schemas, migrations, seed data, and connection management
- Location: `prisma/` and `src/lib/db.ts`
- Contains: `schema.prisma`, SQL migration files, seeding scripts
- Used by: Service layer and Server Components

## Data Flow

### Primary Request Path (Viewing Prompts)

1. User requests prompt list / prompt detail (`src/app/page.tsx` or `src/app/prompts/[slug]/page.tsx`)
2. Server component executes query via Prisma singleton (`src/lib/db.ts` / `src/lib/prompt-list.ts`)
3. Data is formatted with locale-aware strings (`next-intl`)
4. React Server Component renders HTML with interactive islands (`src/components/prompts/`) streamed to client

### Secondary Flow (Prompt Creation / Change Request)

1. Client submits form (`src/components/prompts/prompt-form.tsx`) to API route (`src/app/api/prompts/route.ts`)
2. Route handler verifies session (`src/lib/auth/index.ts`) and validates payload with Zod schema
3. Rate limits are verified (`src/lib/rate-limit.ts`)
4. Record written to PostgreSQL via Prisma transaction
5. Webhook event triggered if configured (`src/lib/webhook.ts`) and JSON returned

**State Management:**
- Server-side state: PostgreSQL through Prisma ORM
- Client-side UI state: React Hook Form, standard React hooks (`useState`, `useContext`)
- Theme & settings state: `next-themes` and local storage

## Key Abstractions

**Auth Providers:**
- Purpose: Uniform interface across credentials and OAuth services
- Location: `src/lib/plugins/auth/`
- Pattern: Provider Strategy

**Storage Adapters:**
- Purpose: Abstraction for local URL vs AWS S3 file persistence
- Location: `src/lib/plugins/storage/`
- Pattern: Adapter Pattern

**MCP Handlers:**
- Purpose: Uniform handling of MCP resource and tool calls
- Location: `src/app/api/mcp/`
- Pattern: Remote Procedure Call / Command Pattern

## Entry Points

**Web Application:**
- Location: `src/app/layout.tsx`
- Triggers: HTTP web requests
- Responsibilities: Global layout, providers (Theme, Auth, i18n, Toast), analytics injection

**API Endpoints:**
- Location: `src/app/api/**/route.ts`
- Triggers: REST calls, webhook invocations, MCP client queries

## Architectural Constraints

- **Single-threaded Event Loop:** Standard Node.js asynchronous model; database connection pooling configured via Prisma parameters.
- **Global State:** Minimal global state; database client cached in `globalThis` (`src/lib/db.ts`) to avoid connection exhaustion during Next.js hot reloads.
- **Strict Typing:** All data access and API boundaries enforce TypeScript types and Zod schemas.

---

*Architecture analysis: 2026-11-04*
