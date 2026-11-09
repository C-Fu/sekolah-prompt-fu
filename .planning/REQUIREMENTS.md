# Requirements: Sekolah Prompt-Fu

**Defined:** 2026-11-09  
**Milestone:** v1.3 — Kid-Friendly UX, Game Feel & Visual Polish  
**Core Value:** A lightweight, standalone, gamified kids app for learning prompt engineering — pure client-side, 100% static (GitHub Pages), with full Bahasa Melayu support and KSSR/KBAT alignment.

## v1.3 Requirements

### Journey Clarity

- [ ] **CLAR-01**: A child can identify the primary next action on the title, map/planet hub, and lesson screens without relying on unlabeled icons alone.
- [ ] **CLAR-02**: Navigation labels and instructions use concise, concrete language in both Bahasa Melayu and English, with no silent locale fallback.
- [ ] **CLAR-03**: A child can understand the current location and return to the appropriate previous hub from core screens without losing saved progress.

### Game Feel

- [ ] **FEEL-01**: Meaningful selections, lesson answers, progress changes, and completion events provide immediate visual feedback that distinguishes success, error, and neutral states.
- [ ] **FEEL-02**: High-value progress and completion moments use short, purposeful motion/audio feedback that is proportional, does not block input, and respects reduced-motion preferences.
- [ ] **FEEL-03**: Interaction feedback remains understandable when animation or sound is unavailable or disabled and does not rely on color alone.

### Responsive & Accessible UI

- [ ] **A11Y-01**: Core screens and lesson interactions remain usable at narrow mobile and desktop viewport sizes without clipped controls or unintended horizontal overflow.
- [ ] **A11Y-02**: Primary interactive targets are comfortably touch-friendly, and interactive controls expose clear hover, pressed, disabled, and keyboard-focus states where applicable.
- [ ] **A11Y-03**: Core navigation and lesson interactions can be completed using a keyboard, with a visible focus indicator and logical focus order.
- [ ] **A11Y-04**: Text and controls remain legible against themed backgrounds, and essential status is not conveyed by color, sound, or motion alone.

### Visual Consistency

- [ ] **VIS-01**: Title, map/planet hub, and lesson screens use a consistent hierarchy for typography, spacing, interactive controls, and card treatments while retaining distinct planetary themes.
- [ ] **VIS-02**: Polish preserves the existing pixel-art/planetary brand, core routes and learning flows, bilingual behavior, and static-export architecture.

## Deferred Requirements

- **CLAR-04**: Validate the revised journey through structured usability sessions with primary-school students and educators, subject to participant access and appropriate consent.
- **A11Y-05**: Provide an in-app text-size adjustment beyond browser zoom, if future usability testing identifies a need.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Replacing the established art direction or redesigning the product from scratch | This milestone is a refinement of the shipped identity, not a rebrand. |
| Adding new subjects, planets, or lesson curriculum | The agreed goal is experience polish; new curriculum would broaden scope and require separate content design. |
| Backend accounts, multiplayer, or live LLM/API gameplay | Conflicts with the static-first, client-side product constraints and is unrelated to the polish objective. |
| Large disruptive motion, routine screen shake, or mandatory audio | Can distract or exclude users; feedback must remain proportional and accessible. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLAR-01 | Pending roadmap | Pending |
| CLAR-02 | Pending roadmap | Pending |
| CLAR-03 | Pending roadmap | Pending |
| FEEL-01 | Pending roadmap | Pending |
| FEEL-02 | Pending roadmap | Pending |
| FEEL-03 | Pending roadmap | Pending |
| A11Y-01 | Pending roadmap | Pending |
| A11Y-02 | Pending roadmap | Pending |
| A11Y-03 | Pending roadmap | Pending |
| A11Y-04 | Pending roadmap | Pending |
| VIS-01 | Pending roadmap | Pending |
| VIS-02 | Pending roadmap | Pending |

**Coverage:**
- v1.3 requirements: 12 total
- Mapped to phases: 0
- Unmapped: 12 (roadmap pending)

---
*Requirements defined: 2026-11-09*  
*Last updated: 2026-11-09 after milestone v1.3 scope confirmation*
