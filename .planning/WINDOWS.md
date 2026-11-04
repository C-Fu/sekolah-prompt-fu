---
schema_version: 1
open_count: 4
waived_count: 0
fixed_count: 0
total_count: 4
last_updated: 2026-11-04T18:27:33.060Z
---

# Broken Windows Ledger

> Cross-phase defect register. With `workflow.windows_enforce` enabled, `/gsd-ship` blocks while `open_count > 0`.
> Waive with `gsd-tools windows waive <id> "<reason>"` (reason required).
> Mark fixed with `gsd-tools windows fixed <id>`.

| id | phase | kind | file | line | description | status | reason | recorded_at | resolved_at |
|----|-------|------|------|------|-------------|--------|--------|-------------|-------------|
| 1 | 01 | unrun-verify | src/__tests__/lib/seo.test.ts |  | seo.test.ts imports removed community helpers and NEXTAUTH_URL; test repair owned by 01-13 | open |  | 2026-11-04T17:50:24.810Z |  |
| 2 | 01 | deviation | src/__tests__/** |  | 60 stale tests still import/mock the 01-06-deleted db/auth/plugins modules — cleanup owned by 01-13 (reported in 01-06-deferred-items.md) | open |  | 2026-11-04T18:27:27.413Z |  |
| 3 | 01 | deviation | src/lib/bots/*.ts,src/lib/mcp/*.ts,src/lib/ai/*.ts,src/lib/prompt-*.ts,src/lib/related-content.ts,src/lib/webhook.ts,src/lib/listing-pagination.ts |  | 22 non-kids src/lib utilities still import the 01-06-deleted @/lib/db\|auth\|@prisma/client — pruning owned by 01-12 | open |  | 2026-11-04T18:27:32.802Z |  |
| 4 | 01 | deviation | package.json,scripts/convert-pairings-to-teams.ts,scripts/seed-skills.ts |  | Prisma-coupled scripts/config still reference prisma/@prisma/client after 01-06 deleted the schema — owned by 01-12/01-13/01-07 | open |  | 2026-11-04T18:27:33.060Z |  |

````json
[
  {
    "id": 1,
    "kind": "unrun-verify",
    "phase": "01",
    "file": "src/__tests__/lib/seo.test.ts",
    "line": null,
    "description": "seo.test.ts imports removed community helpers and NEXTAUTH_URL; test repair owned by 01-13",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-11-04T17:50:24.810Z",
    "resolved_at": null,
    "milestone": null
  },
  {
    "id": 2,
    "kind": "deviation",
    "phase": "01",
    "file": "src/__tests__/**",
    "line": null,
    "description": "60 stale tests still import/mock the 01-06-deleted db/auth/plugins modules — cleanup owned by 01-13 (reported in 01-06-deferred-items.md)",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-11-04T18:27:27.413Z",
    "resolved_at": null,
    "milestone": null
  },
  {
    "id": 3,
    "kind": "deviation",
    "phase": "01",
    "file": "src/lib/bots/*.ts,src/lib/mcp/*.ts,src/lib/ai/*.ts,src/lib/prompt-*.ts,src/lib/related-content.ts,src/lib/webhook.ts,src/lib/listing-pagination.ts",
    "line": null,
    "description": "22 non-kids src/lib utilities still import the 01-06-deleted @/lib/db|auth|@prisma/client — pruning owned by 01-12",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-11-04T18:27:32.802Z",
    "resolved_at": null,
    "milestone": null
  },
  {
    "id": 4,
    "kind": "deviation",
    "phase": "01",
    "file": "package.json,scripts/convert-pairings-to-teams.ts,scripts/seed-skills.ts",
    "line": null,
    "description": "Prisma-coupled scripts/config still reference prisma/@prisma/client after 01-06 deleted the schema — owned by 01-12/01-13/01-07",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-11-04T18:27:33.060Z",
    "resolved_at": null,
    "milestone": null
  }
]
````
