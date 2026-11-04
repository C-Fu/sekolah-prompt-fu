---
last_mapped_commit: 69a23c44b9723179eb3cc5677b666a2f9617dd78
last_mapped_at: 2026-11-04
---
# Coding Conventions

**Analysis Date:** 2026-11-04

## Naming Patterns

**Files:**
- Component files: `kebab-case.tsx` (e.g. `src/components/prompts/prompt-card.tsx`)
- Utility files: `kebab-case.ts` (e.g. `src/lib/variable-detection.ts`)
- App Router pages: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`
- Tests: `[name].test.ts` or `[name].test.tsx`

**Functions & Variables:**
- Standard functions: `camelCase` (e.g. `getUserData()`, `buildActionPrompt()`)
- Component functions: `PascalCase` (e.g. `PromptCard()`, `InjectedActionButton()`)
- Constants: `UPPER_SNAKE_CASE` for immutable static configurations

**Types & Interfaces:**
- `PascalCase` for type aliases and interfaces (e.g. `PromptWithAuthor`, `AppConfig`)
- Prefer `interface` for object structures and `type` for unions/intersections

## Code Style

**Formatting & Linting:**
- ESLint 9 with flat config (`eslint.config.mjs`)
- Tailwind CSS class sorting and utility functions
- Class concatenation helper: `cn()` from `@/lib/utils`

**TypeScript:**
- Strict mode enabled (`tsconfig.json`)
- Explicit type annotations over implicit `any`
- Path alias: `@/*` pointing to `./src/*`

## Import Organization

**Order:**
1. React & Next.js core imports (`react`, `next/navigation`, `next-intl`)
2. Third-party libraries (`@radix-ui/*`, `lucide-react`, `zod`, `sonner`)
3. Internal library and config imports (`@/lib/db`, `@/lib/utils`, `prompts.config`)
4. UI components (`@/components/ui/*`)
5. Feature components and local styles

**Path Aliases:**
- Use `@/` for all imports from `src/` (e.g. `@/components/ui/button`, `@/lib/db`)

## Error Handling

**Patterns:**
- Try/catch blocks in API routes returning structured JSON responses:
  ```typescript
  try {
    // operations
  } catch (error) {
    console.error("Operation failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
  ```
- Domain database error wrappers in `src/lib/db-errors.ts`
- Next.js boundary handlers in `src/app/error.tsx` and `src/app/global-error.tsx`

## Internationalization (i18n)

**Guidelines:**
- All user-facing strings must use `next-intl` (never hardcode user text)
- In Client Components: `const t = useTranslations("namespace");`
- In Server Components: `const t = await getTranslations("namespace");`
- Maintain string keys consistently across all files in `messages/*.json`

## Function & Component Design

**React Server Components First:**
- Default to Server Components unless browser events (`onClick`), hooks (`useState`, `useEffect`), or browser APIs are required
- Add `"use client"` only at the leaf component level where interactivity is needed

**Forms & Validation:**
- Use `react-hook-form` paired with `zod` schemas via `@hookform/resolvers/zod`

---

*Convention analysis: 2026-11-04*
