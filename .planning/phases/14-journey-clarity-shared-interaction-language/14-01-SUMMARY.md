# Plan 14-01 Summary: Welcome Screen Choice Clarity

## Overview
Implemented the complete two-step welcome sequence and equal-prominence destination cards in `KidsHomeContent` per decisions D-01 through D-05 and the UI-SPEC copywriting contract.

## Key Changes
- **Two-Step Welcome Flow**: Replaced the previous 3-step carousel with a streamlined 2-step journey (`totalSteps = 2`).
- **Step 1 (Welcome & Learning Promise)**: Presented the concise localized learning promise ("Learn to write clear prompts through games, stories, and missions." / "Belajar menulis prompt yang jelas melalui permainan, cerita dan misi.") alongside Peromfu the robot. Step 1 has Next but no Back button.
- **Step 2 (Equal Destinations)**: Presented exactly two destination cards side-by-side (`/map` and `/planets`), both with identical visual emphasis and clear localized direct action verbs ("Start learning" / "Mula belajar" and "Explore planets" / "Terokai planet") and single-sentence explanations. Removed any third Start CTA. Step 2 has Back to return to Step 1.
- **Localization Parity**: Added full EN and MS strings under `kids.home` (`promise`, `step1Of2`, `step2Of2`, `earthAction`, `earthExplanation`, `planetsAction`, `planetsExplanation`).
- **Regression Protection**: Updated `src/__tests__/kids/home-navigation.test.tsx` to verify step flow, routes, equal-weight links, analytics tracking, and full Bahasa Melayu copy.

## Verification
- `npm test -- src/__tests__/kids/home-navigation.test.tsx` passed with 5 test cases covering both locales and all navigation paths.
