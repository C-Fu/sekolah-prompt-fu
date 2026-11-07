---
phase: "03"
slug: "bahasa-melayu-ms-localization"
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: "2026-11-05"
---

# Phase 03 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| settings modal (client) → locale switch | A fixed `locale.code` from a hardcoded button passes into `handleLanguageChange` → `setUserLocale` | locale code (non-sensitive, bounded enum) |
| persisted localStorage → message/MDX selection | `kids-locale-preference` is untrusted input validated against `supportedLocales` before any import map is indexed | locale preference string (untrusted, validated) |
| query param `slug` + provider locale → MDX import map | validated slug/locale index a bounded, statically-analyzable import map | route slug + locale (untrusted, validated) |
| build-time MDX compile → static bundle | authored MDX compiled and bundled; no runtime untrusted input | authored content (in-repo, trusted) |
| (none new — 03-05 / 03-06) | Static in-repo string-value edits; no untrusted input crosses any boundary | lesson strings (in-repo, trusted) |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-03-01 | Tampering | `client.ts messageLoaders` / `level-content.ts loaders` | high | mitigate | `ms` added ONLY as literal static `import("@/../messages/ms.json")` / `import("@/content/kids/ms/<slug>.mdx")` entries; no locale-interpolated path; runtime indexing gated by `isSupportedLocale`/`resolveSupportedLocale` (`client.ts:50-56`, `84`, `143`) | closed |
| T-03-02 | Tampering | `messages/ms.json` message keys | medium | mitigate | Static in-repo JSON module (`client.ts:46`), never `fetch()`ed; no prototype-pollution surface from untrusted input | closed |
| T-03-03 | Tampering | `src/content/kids/ms/*.mdx` | medium | mitigate | MDX compiled at build; content-only authoring — grep confirms no `<script>`/`dangerouslySetInnerHTML`/`eval(` under `src/content/kids/ms/` | closed |
| T-03-04 | Information Disclosure | `getMessageFallback` (`src/i18n/request.ts:46-48`) | low | mitigate | Exact 212-leaf-key parity with `en.json`; `scripts/check-translations.js` reports "All translation files are complete!" and the verifier independently re-confirmed 212 keys | closed |
| T-03-05 | Tampering | level-content.ts ms loader keys | high | mitigate | Every key is a literal static import (19 entries, `level-content.ts:338-356`); no path built from the locale string; map bounded/static (T-01-14) | closed |
| T-03-06 | Tampering | authored ms MDX content | medium | mitigate | Build-compiled MDX, content-only authoring; no raw `<script>` tags (verified by grep) | closed |
| T-03-07 | Tampering | level-content.ts ms loader keys | high | mitigate | Every new key a literal static import; never a locale-interpolated path; map bounded/static | closed |
| T-03-08 | Tampering | authored ms MDX content | medium | mitigate | Build-compiled MDX, content-only authoring; no raw `<script>` tags | closed |
| T-03-09 | Tampering | corpus-wide ms resolution | high | mitigate | `level-locale.test.tsx:97-106` asserts `effectiveLocale === "ms"` for every one of the 19 registered slugs — no locale value indexes outside the bounded static map (regression guard for T-01-14/T-01-16) | closed |
| T-03-10 | Information Disclosure | incomplete ms bundle reaching production | low | mitigate | Self-failing ms/en leaf-key parity assertion + full test suite (94/94) run before the build gate; verifier re-confirmed 212 keys | closed |
| T-03-05-01 | Tampering | `messages/ms.json` value edit | low | accept | Static in-repo bundled JSON literal; one string value changed, no key-shape change, no untrusted JSON parsed — documented accepted risk (no new attack surface) | closed |
| T-03-06-01 | Tampering | `src/content/kids/ms/*.mdx` content edits | low | accept | Static tracked build-time-bundled MDX; string-value edits inside existing props; no new props/components/eval — documented accepted risk | closed |
| T-03-06-02 | Tampering | Scope leakage into non-`ms` locales or `messages/ms.json` | medium | mitigate | `git diff --name-only dc078191 3621c8e0` shows no `messages/ms.json` and no `src/content/kids/en/**` changes; only the nine `ms` MDX files were edited | closed |
| T-03-SC | Tampering | npm/pip/cargo installs | high | accept | Phase 3 installs NO packages (pure authoring + registry wiring on the locked dependency set); no install step executes — documented accepted risk | closed |
| T-03-05-SC | Tampering | npm/pip/cargo installs | high | accept | No package installs in 03-05 (pure value edit to existing tracked files) — documented accepted risk | closed |
| T-03-06-SC | Tampering | npm/pip/cargo installs | high | accept | No package installs in 03-06 (pure content edit to existing tracked files) — documented accepted risk | closed |

*Status: open · closed · open — below high threshold (non-blocking)*
*Severity: critical > high > medium > low — only open threats at or above workflow.security_block_on (`high`) count toward threats_open*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-03-01 | T-03-05-01 | Static in-repo bundled JSON string-value edit; no new attack surface | Phase 03 plan (03-05) | 2026-11-05 |
| AR-03-02 | T-03-06-01 | Static tracked build-time MDX content-string edit; no new props/components/eval | Phase 03 plan (03-06) | 2026-11-05 |
| AR-03-03 | T-03-SC, T-03-05-SC, T-03-06-SC | No package installs occur in Phase 03; package-legitimacy gate has no input | Phase 03 plans | 2026-11-05 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-11-05 | 15 | 15 | 0 | gsd-secure-phase (orchestrator, L1 grep-depth) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-11-05