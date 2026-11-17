# Phase 17: Visual Audit & Release Certification - Context

**Phase Goal:** The title, map/planet hub, lessons, and completion experience feel like one polished Sekolah Prompt-Fu product, and the release preserves its established identity and delivery behavior.

## Requirements
- **VIS-01**: Title, map/planet hub, and lesson screens use a consistent hierarchy for typography, spacing, interactive controls, and card treatments while retaining distinct planetary themes.
- **VIS-02**: Polish preserves the existing pixel-art/planetary brand, core routes and learning flows, bilingual behavior, and static-export architecture.

## Scope & Guidelines
1. **Visual Consistency (VIS-01):**
   - Audit and confirm unified spacing scale (4px multiples), typography hierarchy (Schoolbell + Courier), and 44px minimum touch targets across all core routes.
   - Confirm card treatments share clear borders and paddings while keeping unique atmospheric colors for Earth and planetary environments.
2. **Release Certification (VIS-02):**
   - Validate full static build export (`out/` artifact generation).
   - Ensure complete bilingual coverage (English and Bahasa Melayu) across all lesson MDX and UI text without missing keys or silent fallbacks.
   - Ensure the NFR-2 certification suite (`npm run verify`) and all 31 Vitest test files execute with zero regressions.
   - Verify keyboard navigability, focus rings, and reduced-motion compliance are preserved across the entire app.
