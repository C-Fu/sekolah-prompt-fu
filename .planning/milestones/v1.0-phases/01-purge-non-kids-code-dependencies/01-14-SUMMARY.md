---
phase: 01-purge-non-kids-code-dependencies
plan: 14
subsystem: tooling
tags: [baseline, dependency-audit, provisioning]
requires:
  - 01-01-PLAN.md
provides:
  - pinned-pre-pruning-baseline
  - local-dev-executables
affects:
  - 01-02
  - 01-07
key-files:
  - package.json
  - package-lock.json
metrics:
  tasks: 2
  commits: 0
---

# 01-14 SUMMARY: Baseline Dependency Audit and Provisioning

## Immutable pre-pruning baseline (REQUIRED for 01-07)

| Field | Value |
|-------|-------|
| Baseline commit SHA | `2c6e5cfcd8b30f2fc2688312fb2dac60ad61b348` |
| `package.json` blob | `316c943d11db85e07e7c5d5c8c62cc3ddeb87ba0` |
| `package-lock.json` blob | `77a8eb3064bcb77b816493882dc33adf2416491a` |

01-07 MUST audit its pruned manifest/lockfile against this recorded SHA — never against `HEAD`, which will contain 01-07's own committed changes.

## Audit results (task 1)

- Baseline is an ancestor of HEAD; working tree and index package files byte-match the pinned revision.
- `lockfileVersion: 3`; root `dependencies`/`devDependencies` equal the manifest's.
- 1491 non-root locked packages: 0 with a non-`registry.npmjs.org` host, 0 missing `sha512`/`sha1` integrity.
- No unexpected package name/resolution surfaced.

## Provisioning (task 2)

- Node `v24.15.0`, npm `11.12.1`.
- `node_modules` was absent; ran `npm ci --ignore-scripts --no-audit --no-fund --include=dev` against the reviewed lockfile (1316 packages installed).
- `package.json` and `package-lock.json` remain byte-identical to the pinned baseline.
- Local executables confirmed present and runnable: `next` v16.1.0, `eslint` v9.39.2, `tsc` 5.9.3, `vitest` 2.1.9.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Baseline audit | (none) | Audit-only; no tracked file changed. |
| Provisioning | (none) | `node_modules` is gitignored; no tracked file changed. |

## Deviations

None. No dependency was added and no tracked package file was mutated.

## Self-Check: PASSED

- Audit ran before any install; no npm test ran before provisioning.
- Only locked, integrity-verified, registry-hosted packages were installed.
- 01-02 and later plans can now run their npm lint/test commands in this working tree.