# Roadmap: Sekolah Prompt-Fu (Learn Prompting for Kids)

## Milestones
- **v1.0** Kids Prompting Game Standalone & GitHub Pages (Shipped 2026-11-07)
- **v1.1** Rebrand, Tech Debt, & KSSR Tahun 1 Integration (Active)

---

## Milestone v1.1: Rebrand, Tech Debt, & KSSR Tahun 1 Integration

### Phase 05: Tech Debt Cleanup, Rebranding & CI Guards
**Goal:** Replace legacy prompts.chat social preview images with Sekolah Prompt-Fu branding, fix and wire dormant import closure and vocabulary guards into CI, consolidate locale definitions, and eliminate dead code.
- **Plans:**
  - `05-01-PLAN.md`: Rebrand Open Graph assets (`public/og.png`, `src/app/opengraph-image.png`) & scrub residual prompts.chat docs.
  - `05-02-PLAN.md`: Repair `check-kids-import-closure.js`, wire guards into `package.json` & `ci.yml`.
  - `05-03-PLAN.md`: Unify locale registries, clean `public/sounds/`, `eslint.config.mjs`, `vitest.setup.ts`, update `HANDOFF.md`.
- **Requirements Covered:** BRAND-01, BRAND-02, GUARD-01, GUARD-02, I18N-01, CLEAN-01, CLEAN-02

### Phase 06: Header BM/EN Quick Toggle
**Goal:** Add a prominent, kid-friendly "BM | EN" pill toggle directly on the header beside Music and Settings for instant language switching with active state feedback.
- **Plans:**
  - `06-01-PLAN.md`: Implement and test the bilingual quick toggle component in `KidsHeader`.
- **Requirements Covered:** UI-01

### Phase 07: KSSR & KBAT Standard 1 Prompt-Learning Architecture
**Goal:** Research Malaysian Year 1 KSSR Semakan DSKP across BM, English, Math, Science, and Moral, establishing how prompt engineering concepts map onto Standard 1 learning standards.
- **Plans:**
  - `07-01-PLAN.md`: Research DSKP standards, define prompt-learning pedagogy for Year 1, specify level themes and widget mechanics.
- **Requirements Covered:** KSSR-01

### Phase 08: Pilot KSSR Standard 1 Prompt-Learning Levels
**Goal:** Author and integrate initial Standard 1 prompt-learning interactive levels across key subjects in both Bahasa Melayu and English.
- **Plans:**
  - `08-01-PLAN.md`: Author BM and English level MDX content for pilot KSSR levels.
  - `08-02-PLAN.md`: Wire levels into level registry, map/navigation, and verify zero fallback with test suite.
- **Requirements Covered:** KSSR-02, KSSR-03, NFR-1, NFR-2, NFR-3, NFR-4
