---
phase: 04-verification-testing-polish
reviewed: 2026-11-05T16:11:59Z
depth: standard
files_reviewed: 4
files_reviewed_list:
  - scripts/verify-project.js
  - .github/workflows/ci.yml
  - src/__tests__/scripts/verify-project.test.ts
  - src/__tests__/scripts/workflows.test.ts
findings:
  critical: 0
  warning: 2
  info: 0
  total: 2
status: issues_found
---

# Phase 4: Code Review Report

**Reviewed:** 2026-11-05T16:11:59Z  
**Depth:** standard  
**Files Reviewed:** 4  
**Status:** issues_found

## Summary

Reviewed only the incremental changes since `1b0f4f0`, with full-file context. The CI command now selects gates-only mode; a direct `npm run verify -- --gates-only` completed successfully, and the targeted tests passed. The default mode still fails on absent `out/`, as required. `deploy.yml` is byte-identical to `1af0d284`. Prior CR-01, WR-01, WR-02, and IN-01 are addressed in the implementation; prior IN-02 and IN-03 remain intentionally deferred and do not constitute new incremental defects. Two robustness/test-contract issues remain.

## Narrative Findings (AI reviewer)

## Warnings

### WR-01: Gates-only tests never prove that successful gates pass without `out/`

**Classification:** WARNING  
**File:** `src/__tests__/scripts/verify-project.test.ts:281-315,354-376`  
**Issue:** The three new gates-only behavior tests run against sandboxes where both gates fail and assert only that artifact errors are absent. The only new test using successful gate stubs catches *and ignores* any exception from the verifier, then checks only that `npm run build` was not invoked. Therefore a regression that always exits 1 on a clean checkout—even after both certified gates pass—would leave all these new tests green. This is the exact success case needed to prevent the previous always-red CI defect from returning; the workflow text test cannot verify the script's exit status either.

**Fix:** In the stubbed-gate test, remove the empty `catch`, assert exit code 0, assert the gates-only PASS verdict, and assert that neither artifact checks nor a build ran. Set up the sandbox without `out/` and have the `npm`/`npx` stubs record the exact two expected gate invocations.

### WR-02: A gate terminated by SIGTERM is falsely reported as a five-minute timeout

**Classification:** WARNING  
**File:** `scripts/verify-project.js:60-69`  
**Issue:** `err.signal === "SIGTERM"` unconditionally selects the `timed out after 300s` diagnostic. A gate can terminate on SIGTERM for another reason (for example an external process supervisor terminating `npm test`); even a prompt termination then claims that five minutes elapsed. This obscures the actual reason the certification gate failed. Node already supplies `err.code === "ETIMEDOUT"` for an `execSync` deadline, so the signal is not sufficient evidence of a timeout.

**Fix:** Identify timeouts by `err.code === "ETIMEDOUT"` only. For other failures include the actual `err.signal`, `err.status`, or `err.message` alongside captured output; add a test that differentiates a deliberately signaled gate from a timed-out one.

---

_Reviewed: 2026-11-05T16:11:59Z_  
_Reviewer: the agent (gsd-code-reviewer)_  
_Depth: standard_
