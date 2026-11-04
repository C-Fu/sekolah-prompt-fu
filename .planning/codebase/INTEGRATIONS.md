---
last_mapped_commit: 69a23c44b9723179eb3cc5677b666a2f9617dd78
last_mapped_at: 2026-11-04
---
# External Integrations

**Analysis Date:** 2026-11-04

## APIs & External Services

**AI & LLM Services:**
- OpenAI API - Semantic search embeddings and AI prompt generation/improvement
  - SDK/Client: `openai` (`src/lib/ai/`)
  - Auth: `OPENAI_API_KEY`
- Hugging Face Data Studio - Dataset integration (`src/lib/hf-data-studio.ts`)

**Model Context Protocol (MCP):**
- MCP Server implementation allowing external AI clients (Claude Desktop, etc.) to query prompts and bots
  - SDK/Client: `@modelcontextprotocol/sdk` (`src/app/api/mcp/`)
  - Auth: `API_KEY` / Bearer token via `src/lib/api-key.ts`

## Data Storage

**Databases:**
- PostgreSQL
  - Connection: `DATABASE_URL` (and optional `DIRECT_URL` for migration/pooler bypass)
  - Client: Prisma ORM 6.19.0 (`@prisma/client`, singleton in `src/lib/db.ts`)
  - Features: Soft-deletes, relational integrity, vector/embedding fields

**File Storage:**
- Pluggable storage architecture (`src/lib/plugins/storage/`)
  - URL-based default (`src/lib/plugins/storage/url.ts`)
  - S3 / DigitalOcean Spaces (`src/lib/plugins/storage/s3.ts`)
  - Auth: `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_ENDPOINT`

**Caching & Rate Limiting:**
- In-memory rate limiting with LRU / window sliding (`src/lib/rate-limit.ts`)
- Next.js server caching and ISR tags

## Authentication & Identity

**Auth Provider:**
- NextAuth.js v5 (beta) (`next-auth`) with Prisma adapter (`@auth/prisma-adapter`)
  - Core implementation: `src/lib/auth/index.ts`
  - Pluggable auth providers (`src/lib/plugins/auth/`):
    - Credentials (email & password with bcryptjs: `src/lib/plugins/auth/credentials.ts`)
    - GitHub OAuth (`AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`)
    - Google OAuth (`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`)
    - Microsoft Azure Entra ID (`AUTH_AZURE_AD_CLIENT_ID`, `AUTH_AZURE_AD_CLIENT_SECRET`, `AUTH_AZURE_AD_ISSUER`)
    - Apple Sign-In support

## Monitoring & Observability

**Error Tracking:**
- Sentry (`@sentry/nextjs`)
  - Client config: `src/instrumentation-client.ts`
  - Edge config: `sentry.edge.config.ts`
  - Server config: `sentry.server.config.ts`
  - Auth: `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`

**Logs:**
- Pino logger (`pino`) structured JSON logging

## CI/CD & Deployment

**Hosting:**
- Docker container support (`compose.yml`, `docker/Dockerfile`)
- Vercel App Router native deployment

**CI Pipeline:**
- GitHub Actions workflows in `.github/workflows/` (linting, tests, build checks)

## Environment Configuration

**Required env vars:**
- `DATABASE_URL` - PostgreSQL database connection string
- `NEXTAUTH_SECRET` - JWT signing / session encryption secret
- `NEXTAUTH_URL` - Canonical URL for authentication redirects

**Optional env vars:**
- `OPENAI_API_KEY` - Enables AI search and prompt improvements
- `S3_*` / `DO_SPACES_*` - S3-compatible media upload bucket
- `AUTH_*` - OAuth provider client secrets
- `SENTRY_DSN` - Application monitoring

## Webhooks & Callbacks

**Incoming:**
- OAuth redirect callbacks handled by NextAuth at `/api/auth/callback/[provider]`

**Outgoing:**
- Configurable webhook notifications on prompt creation or change approvals (`src/lib/webhook.ts`)

---

*Integration audit: 2026-11-04*
