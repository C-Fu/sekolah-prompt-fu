---
phase: 04
review: 04-REVIEW.md
titles: json
findings:
  - id: WR-01
    severity: warning
    disposition: open
    title: "Gates-only tests never prove that successful gates pass without `out/`"
  - id: WR-02
    severity: warning
    disposition: open
    title: "A gate terminated by SIGTERM is falsely reported as a five-minute timeout"
  - id: CR-01
    severity: critical
    disposition: open
    title: "CI `Run verification script` step can never pass — verify runs against a frozen, never-built `out/`"
  - id: IN-01
    severity: info
    disposition: open
    title: "Absent `out/` short-circuits before the aggregated verdict, hiding failed gates from the summary block"
  - id: IN-02
    severity: info
    disposition: open
    title: "`out/` presence is checked but not that it is a directory or freshly built"
  - id: IN-03
    severity: info
    disposition: open
    title: "Gate ordering runs `npm test` even when `tsc` already failed"
open: 6
total: 6
recorded: 2026-11-05T16:16:10.145Z
---

# Phase 04: Code Review Disposition

| Finding | Severity | Disposition | Source |
|---------|----------|-------------|--------|
| WR-01 | warning | open | - |
| WR-02 | warning | open | - |
| CR-01 | critical | open | - (not in the current review) |
| IN-01 | info | open | - (not in the current review) |
| IN-02 | info | open | - (not in the current review) |
| IN-03 | info | open | - (not in the current review) |

Dispositions: `open` (recorded, not yet triaged), `fixed`, `skipped`, `deferred`.
Set `deferred` by hand and put the reason in the Source cell; both are preserved. A `|` in the reason is kept as prose and escaped on the next run.
Re-running the gate keeps every row it can. A row the current review no longer reports is kept and its Source cell flagged, so a finding does not leave this record silently. ONE exception: when a finding id is REUSED by a different finding, the earlier decision cannot keep a row -- the id is taken -- and it is dropped. A RECORDED decision (anything but `open`) is named on the console when that happens; a row still at `open` is replaced silently, because `open` records no decision to lose.
