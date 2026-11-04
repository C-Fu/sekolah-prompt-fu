---
last_mapped_commit: 69a23c44b9723179eb3cc5677b666a2f9617dd78
last_mapped_at: 2026-11-04
---
# Testing Patterns

**Analysis Date:** 2026-11-04

## Test Framework

**Runner:**
- Vitest 4.0.15 (`vitest`)
- Config: `vitest.config.ts`
- Setup: `vitest.setup.ts`

**Assertion Library & Environment:**
- Vitest built-in assertions (`expect`, `describe`, `it`, `vi`)
- `@testing-library/react` and `@testing-library/jest-dom` for DOM matchers
- JSDOM environment configured for React component tests

**Run Commands:**
```bash
npm run test           # Run all tests once (vitest run)
npm run test:watch     # Watch mode for active development
npm run test:coverage  # Run test suite with coverage report
npm run test:ui        # Open visual Vitest UI
```

## Test File Organization

**Location:**
- Centralized under `src/__tests__/` structured by architectural layer:
  - `src/__tests__/api/` - Tests for API route handlers and endpoints
  - `src/__tests__/app/` - Tests for App router pages and metadata
  - `src/__tests__/components/` - Unit tests for React components
  - `src/__tests__/hooks/` - Tests for custom React hooks
  - `src/__tests__/lib/` - Tests for library utilities and business logic

**Naming:**
- Unit tests: `*.test.ts`
- Component tests: `*.test.tsx`

## Test Structure

**Suite Organization Example:**
```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyButton } from "@/components/prompts/copy-button";

describe("CopyButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("copies content to clipboard on click", async () => {
    const user = userEvent.setup();
    // Render and assert
  });
});
```

## Mocking

**Framework:**
- Vitest `vi.mock()` and `vi.fn()`

**What to Mock:**
- Database operations (`@/lib/db`)
- External network requests (fetch, OpenAI SDK, S3 client)
- Next.js navigation hooks (`next/navigation` -> `useRouter`, `usePathname`, `useSearchParams`)
- Auth sessions (`next-auth` -> `auth()`, `useSession()`)

**What NOT to Mock:**
- Pure helper functions (`@/lib/utils`, `@/lib/slug`, `@/lib/format`)
- Zod schema validations

## Fixtures and Factories

**Test Data:**
- Reusable test fixtures located in `src/__tests__/lib/` and adjacent test helpers
- Typical fixtures include mock users, mock prompts, mock teams, and mock sessions

---

*Testing analysis: 2026-11-04*
