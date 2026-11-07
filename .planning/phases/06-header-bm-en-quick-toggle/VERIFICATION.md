# Phase 06 Verification: Header BM/EN Quick Toggle

## Summary
- **Status:** PASS
- **Phase Goal:** Add a prominent, kid-friendly "BM | EN" pill toggle directly on the header beside Music and Settings for instant language switching with active state feedback.

## Verification Checklist
1. **Component implementation:**
   - `LanguageToggle` component cleanly separated and styled with pixel art borders and theme colors.
   - Highlights "BM" when `locale === 'ms'`, highlights "EN" when `locale === 'en'`.
   - Single-click switching directly updates messages and MDX locale.
2. **Integration:**
   - Desktop header displays `[ BM | EN ]` beside Music & Settings buttons.
   - Mobile dropdown also includes `[ BM | EN ]`.
3. **Tests & Gates:**
   - 5 new tests in `src/__tests__/kids/language-toggle.test.tsx`.
   - Full Vitest suite: 129/129 passed.
   - Closure check: 386 modules passed.
   - NFR-2 Gate verify: PASS.
