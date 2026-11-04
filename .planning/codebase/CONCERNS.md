---
last_mapped_commit: 69a23c44b9723179eb3cc5677b666a2f9617dd78
last_mapped_at: 2026-11-04
---
# Codebase Concerns

**Analysis Date:** 2026-11-04

## Tech Debt

**Large Prompt Dataset Handling:**
- Issue: `prompts.csv` and `PROMPTS.md` in repository root are very large (>10MB each), which increases repo clone size and disk footprint.
- Files: `prompts.csv`, `PROMPTS.md`
- Impact: Potential Git performance overhead over time as more prompts are added.
- Fix approach: Consider keeping historical prompt dumps in releases or external object storage / git-lfs if file size exceeds limits.

**NextAuth Beta Version:**
- Issue: Project relies on `next-auth@5.0.0-beta.30`. While stable in App Router, beta APIs can experience breaking changes prior to general availability.
- Files: `src/lib/auth/index.ts`, `src/lib/plugins/auth/*.ts`
- Impact: Updating dependencies requires careful verification of NextAuth configuration syntax.
- Fix approach: Pin versions and audit upgrade notes when migrating to official 5.0 GA.

**Database Connection Pools on Serverless:**
- Issue: Direct Prisma client usage without external pooling proxies (like Prisma Accelerate or Supabase pooler) can risk hitting PostgreSQL maximum connection limits in serverless deploy targets.
- Files: `src/lib/db.ts`, `.env.example`
- Impact: Database errors (`too many clients`) under sudden traffic spikes.
- Fix approach: Ensure connection pooling query parameters (`connection_limit`, `pool_timeout`) or a connection pooler URL is configured in production.

## Known Bugs

- None actively blocking. Regular checks on translations via `node scripts/check-translations.js` should be maintained when introducing new UI features.

## Security Considerations

**API Key and Credential Leakage:**
- Sensitive credentials must strictly stay in `.env` and never be committed to git.
- `.env.example` provides the sanitized template.
- Rate limiting should be applied to public mutation routes (`/api/prompts`, `/api/improve-prompt`) to prevent resource exhaustion.

---

*Concerns analysis: 2026-11-04*
