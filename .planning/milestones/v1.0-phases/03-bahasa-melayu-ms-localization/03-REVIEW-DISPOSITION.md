---
phase: 03
review: 03-REVIEW.md
titles: json
findings:
  - id: CR-01
    severity: critical
    disposition: fixed
    title: "Guard silently skips untracked `ms` MDX files (git-path enumeration is incomplete)"
  - id: CR-02
    severity: critical
    disposition: fixed
    title: "1-1 `aiThinking` check is a whole-file substring search, not scoped to the `aiThinking` prop"
  - id: WR-01
    severity: warning
    disposition: fixed
    title: "`The cat sat` residual rule is case-sensitive, contradicting its documented case-insensitive contract"
  - id: WR-02
    severity: warning
    disposition: fixed
    title: "The \"persistent guard\" is not invoked by any CI job or npm script"
  - id: IN-01
    severity: info
    disposition: fixed
    title: "`messages/ms.json` was modified despite the \"unmodified\" contract"
  - id: IN-02
    severity: info
    disposition: fixed
    title: "Redundant `eslint-disable` lead comment"
  - id: WR-03
    severity: warning
    disposition: resolved
    title: "`ms` 1-1 WordPredictor explanation is incoherent after translation (English-idiom puzzle relabelled in Malay)"
  - id: WR-04
    severity: warning
    disposition: open
    title: "`settings-modal.tsx` hard-codes a locale list that has already drifted from the source of truth"
  - id: IN-03
    severity: info
    disposition: open
    title: "`prompts.config.ts` / `config.ts` locale arrays are duplicated literal lists"
open: 2
total: 9
recorded: 2026-11-05T11:35:00.000Z
---

# Phase 03: Code Review Disposition

| Finding | Severity | Disposition | Source |
|---------|----------|-------------|--------|
| CR-01 | critical | fixed | Hardened guard: on-disk walk is now the source of truth, unioned with `git ls-files` (commit e818c3bb) |
| CR-02 | critical | fixed | 1-1 check now scoped to the `aiThinking` attribute value, not a whole-file substring (e818c3bb) |
| WR-01 | warning | fixed | Added `/i` flag to the `The cat sat` residual rule (e818c3bb) |
| WR-02 | warning | fixed | Wired into pipeline: `npm run lint:ms` + CI step (e818c3bb) |
| IN-01 | info | fixed | Accepted risk: the one-line `ms.json` value edit is the deliberate 03-05 World-4 name reconciliation; 212 keys preserved |
| IN-02 | info | fixed | Dropped the inert eslint-disable (e818c3bb) |
| WR-03 | warning | resolved | Historical: the 1-1 explanation issue; fixed by 03-06 and verified (not in the current review) |
| WR-04 | warning | open | Out of scope for Phase 3 (D-02); settings-modal locale-list drift remains a separate follow-up |
| IN-03 | info | open | Pre-existing: duplicated locale literal arrays in `prompts.config.ts` / `config.ts` |

Dispositions: `open` (recorded, not yet triaged), `fixed`, `skipped`, `deferred`.
Set `deferred` by hand and put the reason in the Source cell; both are preserved. A `|` in the reason is kept as prose and escaped on the next run.
Re-running the gate keeps every row it can. A row the current review no longer reports is kept and its Source cell flagged, so a finding does not leave this record silently. ONE exception: when a finding id is REUSED by a different finding, the earlier decision cannot keep a row — the id is taken — and it is dropped. A RECORDED decision (anything but `open`) is named on the console when that happens; a row still at `open` is replaced silently, because `open` records no decision to lose.
