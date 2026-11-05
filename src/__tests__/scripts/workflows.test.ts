/**
 * Behavioral tests for the CI/deploy workflow *contracts* this phase asserts:
 * FR-4 (GitHub Pages static deployment) and the D-10/D-11/D-12/D-13 CI claims.
 *
 * These read the workflow YAML as text and assert the structural behaviors the
 * phase's plans require — so a silent regression (e.g. someone adds a build step
 * to ci.yml, or reorders deploy.yml's upload before the build) fails here rather
 * than only in a live CI run.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const read = (rel: string) =>
  fs.readFileSync(path.join(REPO_ROOT, rel), "utf8");

describe("FR-4: GitHub Pages deploy workflow (.github/workflows/deploy.yml)", () => {
  const deploy = read(".github/workflows/deploy.yml");

  it("builds the static export with `npm run build` and uploads `./out`", () => {
    expect(deploy).toMatch(/run:\s*npm run build/);
    expect(deploy).toMatch(/actions\/upload-pages-artifact@/);
    expect(deploy).toMatch(/path:\s*\.?\/out/);
  });

  it("derives the GitHub Pages base path from the repository name", () => {
    expect(deploy).toMatch(/NEXT_PUBLIC_BASE_PATH/);
    expect(deploy).toMatch(/github\.event\.repository\.name/);
  });

  it("deploys via the pages action under the github-pages environment with least-privilege perms", () => {
    expect(deploy).toMatch(/actions\/deploy-pages@/);
    expect(deploy).toMatch(/environment:/);
    expect(deploy).toMatch(/name:\s*github-pages/);
    expect(deploy).toMatch(/pages:\s*write/);
    expect(deploy).toMatch(/id-token:\s*write/);
    expect(deploy).toMatch(/contents:\s*read/);
  });

  it("orders the upload AFTER the build (artifact cannot be uploaded before it exists)", () => {
    const buildIdx = deploy.indexOf("npm run build");
    const uploadIdx = deploy.indexOf("upload-pages-artifact");
    expect(buildIdx).toBeGreaterThan(-1);
    expect(uploadIdx).toBeGreaterThan(-1);
    expect(uploadIdx).toBeGreaterThan(buildIdx);
  });
});

describe("CI workflow (.github/workflows/ci.yml) — D-10/D-11/D-12", () => {
  const ci = read(".github/workflows/ci.yml");

  it("runs npx tsc --noEmit and npm run verify as steps", () => {
    expect(ci).toMatch(/run:\s*npx tsc --noEmit/);
    expect(ci).toMatch(/run:\s*npm run verify/);
  });

  it("does not build (D-12: the build stays solely in deploy.yml)", () => {
    expect(ci).not.toMatch(/npm run build/);
  });

  it("keeps the pre-existing lint / lint:ms / test steps", () => {
    expect(ci).toMatch(/run:\s*npm run lint/);
    expect(ci).toMatch(/run:\s*npm run lint:ms/);
    expect(ci).toMatch(/run:\s*npm test/);
  });

  it("orders the verification step after the test step (D-11: CI and local share gates)", () => {
    const testIdx = ci.indexOf("Run tests");
    const verifyIdx = ci.indexOf("Run verification script");
    expect(testIdx).toBeGreaterThan(-1);
    expect(verifyIdx).toBeGreaterThan(-1);
    expect(verifyIdx).toBeGreaterThan(testIdx);
  });
});