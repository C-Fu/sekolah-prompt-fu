# 01-06 Deferred Items (out of scope — reported, not fixed)

`01-06` retired the approved Prisma/NextAuth server trees. The deletions intentionally
orphaned importers that other plans own. This file records them so nothing is lost; per
plan scope, **none were modified here**.

## Owned by 01-12 (non-kids `src/lib` utilities)

These retained `src/lib/**` modules still import the now-deleted `@/lib/db`, `@/lib/auth`
or `@prisma/client`. They are non-kids utilities whose pruning is 01-12's mandate, not
01-06's:

- `src/lib/ai/embeddings.ts`, `src/lib/ai/improve-prompt.ts`, `src/lib/ai/prompt-builder-tools.ts`
- `src/lib/bots/{index,pairings,team-api,team-changes,teams,upsert}.ts`
- `src/lib/listing-pagination.ts`
- `src/lib/mcp/{auth,prompts,resources,shared}.ts`, `src/lib/mcp/tools/{bots,prompts,skills}.ts`
- `src/lib/prompt-access.ts`, `src/lib/prompt-list.ts`, `src/lib/prompt-write.ts`
- `src/lib/related-content.ts`, `src/lib/webhook.ts`

## Owned by 01-13 (stale tests)

60 test files under `src/__tests__/**` still `import`/`vi.mock` the deleted modules
(`@/lib/db`, `@/lib/auth`, `@/lib/admin-auth`, `@/lib/plugins/**`, `@prisma/client`,
`@/lib/auth/provider-metadata`). They are legacy-auth/database tests. The full set:

- `src/__tests__/api/` (35 files: admin-*, bot-*, comments, health, prompts, reports, search, user-*, versions, vote, register, pin, collection, leaderboard, improve-prompt, mcp-*)
- `src/__tests__/app/` (3: bot-page-slug-redirect, listing-layouts, prompts-list-metadata)
- `src/__tests__/components/` (4: discovery-prompts, featured-teams, injected-action-button, spacefast-widget)
- `src/__tests__/lib/` (18: action-buttons, bot-*, connector-registry, prompt-access, related-content, webhook, auth/provider-metadata, plugins/auth/{github,oauth,oidc}, plugins/widgets)

## Owned by 01-12/01-07 (tooling/config)

- `package.json` still contains Prisma-coupled scripts (`build`, `postinstall`, `db:*`,
  `db:setup`) that invoke `prisma`; and `scripts/{convert-pairings-to-teams,seed-skills}.ts`
  import `@prisma/client`. Config/scripts pruning is 01-12's/01-13's/01-07's scope.

## Why not fixed here

01-06 is a bounded removal-only plan (`files_modified` lists only the DB/auth trees).
Touching these would exceed the declared `<files>` set and collide with 01-12/01-13/01-07.
The retained kids closure stays intact (verified by `scripts/check-kids-import-closure.js`,
exit 0); full-project `tsc`/`vitest` remain out of scope until 01-13 removes the stale tests.