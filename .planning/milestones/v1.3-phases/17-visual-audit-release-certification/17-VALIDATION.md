---
phase: "17"
slug: "visual-audit-release-certification"
status: draft
created: "2026-11-16"
---

# Phase 17 — Validation Strategy

> Validation criteria and verification gates for Phase 17 (VIS-01, VIS-02).

## Automated Validation Gates

1. **Visual Hierarchy & Interaction Consistency (VIS-01):**
   - Verify all primary action controls expose minimum 44px hitboxes.
   - Verify consistent two-tone focus outline on focus-visible elements.
   - Verify spacing, typography, and card tokens across core screens.

2. **Brand & Delivery Certification (VIS-02):**
   - Verify full TypeScript typecheck (`tsc --noEmit`).
   - Verify all Vitest test suites pass (31+ suites).
   - Verify Next.js static production export (`npm run build`).
   - Verify full project certification runner (`npm run verify`).

## Automated Commands
```bash
npm test -- src/__tests__/kids/visual-audit.test.tsx
npm run build
npm run verify
```
