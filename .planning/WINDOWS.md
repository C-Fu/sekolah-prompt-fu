---
schema_version: 1
open_count: 1
waived_count: 0
fixed_count: 0
total_count: 1
last_updated: 2026-11-04T17:50:24.810Z
---

# Broken Windows Ledger

> Cross-phase defect register. With `workflow.windows_enforce` enabled, `/gsd-ship` blocks while `open_count > 0`.
> Waive with `gsd-tools windows waive <id> "<reason>"` (reason required).
> Mark fixed with `gsd-tools windows fixed <id>`.

| id | phase | kind | file | line | description | status | reason | recorded_at | resolved_at |
|----|-------|------|------|------|-------------|--------|--------|-------------|-------------|
| 1 | 01 | unrun-verify | src/__tests__/lib/seo.test.ts |  | seo.test.ts imports removed community helpers and NEXTAUTH_URL; test repair owned by 01-13 | open |  | 2026-11-04T17:50:24.810Z |  |

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
  }
]
````
