---
phase: "04"
slug: "verification-testing-polish"
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: "2026-11-05"
---

# Phase 4 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| CI runner → repo working tree | `ci.yml` executes repo-controlled scripts; no untrusted external input crosses here | repo source, static config |
| verification script → local filesystem (`out/`, `src/lib/kids/levels.ts`) | read-only inspection of repo-owned build artifacts; no network, no untrusted input | build artifacts (public) |
| handoff doc → future owner (human/agent) | Documentation only; no untrusted input crosses here | public lifecycle documentation |
| state-doc edits → repo tree | Markdown edits to `.planning/*.md`; repo-controlled content | planning status |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-04-01 | Tampering | `scripts/verify-project.js` `execSync` gate invocation | low | accept | Commands are static string literals (`npx tsc --noEmit`, `npm test`); no interpolation of external input, so no command-injection surface. | closed |
| T-04-02 | Repudiation | `npm run verify` PASS verdict | low | mitigate | Script fails loudly (non-zero exit) on absent `out/` or an empty derived level-slug set (`scripts/verify-project.js:100-106`, `:123-129`). | closed |
| T-04-03 | Information Disclosure | `.github/workflows/ci.yml` new steps | low | accept | Added steps run only `npx tsc --noEmit` and `npm run verify`; no secrets read or printed. | closed |
| T-04-04 | Repudiation | `.planning/HANDOFF.md` gate commands section | low | mitigate | Doc names the exact certified commands and points at `npm run verify` as the rerunnable source of truth (`.planning/HANDOFF.md:28-48`). | closed |
| T-04-05 | Information Disclosure | `.planning/HANDOFF.md` | low | accept | Doc contains no secrets, tokens, or credentials. Public repo lifecycle doc. | closed |
| T-04-06 | Tampering | REQUIREMENTS.md / STATE.md / PROJECT.md NFR-2 status | low | mitigate | NFR-2 flip gated on the certified gates actually passing; evidence recorded in `.planning/REQUIREMENTS.md:30-34`. | closed |
| T-04-SC | Tampering | npm/pip/cargo installs | high | accept | Phase 4 installs NO packages — verify script is Node-stdlib-only; `ci.yml` reuses the existing `npm ci` on the locked lockfile. | closed |

*Status: open · closed · open — below high threshold (non-blocking)*
*Severity: critical > high > medium > low — only open threats at or above workflow.security_block_on count toward threats_open*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-04-01 | T-04-01 | The verify script trusts the repo's own npm/npx toolchain, exactly as the pre-existing `scripts/check-ms-vocabulary.js` guard does; commands are static literals with no external-input interpolation. | Phase 4 plan approval | 2026-11-05 |
| AR-04-02 | T-04-03 | The two new `ci.yml` steps read/print no secrets; CI already installs deps and runs the suite on the same runner. | Phase 4 plan approval | 2026-11-05 |
| AR-04-03 | T-04-05 | HANDOFF.md recaps architecture, commands, deploy steps, and advisory findings only; contains no credentials. | Phase 4 plan approval | 2026-11-05 |
| AR-04-04 | T-04-SC | No package installs occur this phase; verify script is Node-stdlib-only and `ci.yml` reuses the locked lockfile via `npm ci`. | Phase 4 plan approval | 2026-11-05 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-11-05 | 7 | 7 | 0 | gsd-security-auditor (verify:post hook) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-11-05