"use client";

/**
 * Client-side compiled level MDX selection (01-15).
 *
 * The retained `/level/[slug]` route no longer resolves the browser locale at
 * request time. The validated level slug is handed to this client module, which
 * selects a compiled MDX module from a statically analyzable, lazy import context
 * bounded by the supported locale inventory and the level registry.
 *
 * Selection rules:
 * - Locale and slug are validated against known inventories before any loader is
 *   invoked (threat T-01-14: bound module selection).
 * - A missing module for a requested (supported) locale falls back to English.
 * - Any other failure (missing English fallback, unexpected loader error) propagates
 *   rather than being swallowed.
 * - Locale-preference plumbing (persisted switch, ms translation) is 01-17, not here.
 *
 * The loader map is generated from the content directory inventory. Each entry is a
 * discrete lazy `import()` so the bundler can trace every module while keeping
 * per-level code splitting; the runtime selector only ever indexes the map with a
 * validated locale and slug.
 */

import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import { supportedLocales, defaultLocale } from "@/lib/i18n/config";
import { getLevelBySlug } from "@/lib/kids/levels";

/** A compiled MDX module default export. */
export type CompiledLevelContent = ComponentType<{ components?: MDXComponents }>;

/** Per-(locale, slug) lazy compiled-MDX loaders. */
const L_ar__1_1_meet_promi = () => import("@/content/kids/ar/1-1-meet-promi.mdx");
const L_ar__1_2_first_words = () => import("@/content/kids/ar/1-2-first-words.mdx");
const L_ar__1_3_being_clear = () => import("@/content/kids/ar/1-3-being-clear.mdx");
const L_ar__2_1_missing_details = () => import("@/content/kids/ar/2-1-missing-details.mdx");
const L_ar__2_2_who_and_what = () => import("@/content/kids/ar/2-2-who-and-what.mdx");
const L_ar__2_3_when_and_where = () => import("@/content/kids/ar/2-3-when-and-where.mdx");
const L_ar__2_4_detail_detective = () => import("@/content/kids/ar/2-4-detail-detective.mdx");
const L_ar__3_1_setting_the_scene = () => import("@/content/kids/ar/3-1-setting-the-scene.mdx");
const L_ar__3_2_show_dont_tell = () => import("@/content/kids/ar/3-2-show-dont-tell.mdx");
const L_ar__3_3_format_finder = () => import("@/content/kids/ar/3-3-format-finder.mdx");
const L_ar__3_4_context_champion = () => import("@/content/kids/ar/3-4-context-champion.mdx");
const L_ar__4_1_pretend_time = () => import("@/content/kids/ar/4-1-pretend-time.mdx");
const L_ar__4_2_story_starters = () => import("@/content/kids/ar/4-2-story-starters.mdx");
const L_ar__4_3_character_creator = () => import("@/content/kids/ar/4-3-character-creator.mdx");
const L_ar__4_4_world_builder = () => import("@/content/kids/ar/4-4-world-builder.mdx");
const L_ar__5_1_perfect_prompt = () => import("@/content/kids/ar/5-1-perfect-prompt.mdx");
const L_ar__5_2_fix_it_up = () => import("@/content/kids/ar/5-2-fix-it-up.mdx");
const L_ar__5_3_prompt_remix = () => import("@/content/kids/ar/5-3-prompt-remix.mdx");
const L_ar__5_4_graduation_day = () => import("@/content/kids/ar/5-4-graduation-day.mdx");
const L_az__1_1_meet_promi = () => import("@/content/kids/az/1-1-meet-promi.mdx");
const L_az__1_2_first_words = () => import("@/content/kids/az/1-2-first-words.mdx");
const L_az__1_3_being_clear = () => import("@/content/kids/az/1-3-being-clear.mdx");
const L_az__2_1_missing_details = () => import("@/content/kids/az/2-1-missing-details.mdx");
const L_az__2_2_who_and_what = () => import("@/content/kids/az/2-2-who-and-what.mdx");
const L_az__2_3_when_and_where = () => import("@/content/kids/az/2-3-when-and-where.mdx");
const L_az__2_4_detail_detective = () => import("@/content/kids/az/2-4-detail-detective.mdx");
const L_az__3_1_setting_the_scene = () => import("@/content/kids/az/3-1-setting-the-scene.mdx");
const L_az__3_2_show_dont_tell = () => import("@/content/kids/az/3-2-show-dont-tell.mdx");
const L_az__3_3_format_finder = () => import("@/content/kids/az/3-3-format-finder.mdx");
const L_az__3_4_context_champion = () => import("@/content/kids/az/3-4-context-champion.mdx");
const L_az__4_1_pretend_time = () => import("@/content/kids/az/4-1-pretend-time.mdx");
const L_az__4_2_story_starters = () => import("@/content/kids/az/4-2-story-starters.mdx");
const L_az__4_3_character_creator = () => import("@/content/kids/az/4-3-character-creator.mdx");
const L_az__4_4_world_builder = () => import("@/content/kids/az/4-4-world-builder.mdx");
const L_az__5_1_perfect_prompt = () => import("@/content/kids/az/5-1-perfect-prompt.mdx");
const L_az__5_2_fix_it_up = () => import("@/content/kids/az/5-2-fix-it-up.mdx");
const L_az__5_3_prompt_remix = () => import("@/content/kids/az/5-3-prompt-remix.mdx");
const L_az__5_4_graduation_day = () => import("@/content/kids/az/5-4-graduation-day.mdx");
const L_de__1_1_meet_promi = () => import("@/content/kids/de/1-1-meet-promi.mdx");
const L_de__1_2_first_words = () => import("@/content/kids/de/1-2-first-words.mdx");
const L_de__1_3_being_clear = () => import("@/content/kids/de/1-3-being-clear.mdx");
const L_de__2_1_missing_details = () => import("@/content/kids/de/2-1-missing-details.mdx");
const L_de__2_2_who_and_what = () => import("@/content/kids/de/2-2-who-and-what.mdx");
const L_de__2_3_when_and_where = () => import("@/content/kids/de/2-3-when-and-where.mdx");
const L_de__2_4_detail_detective = () => import("@/content/kids/de/2-4-detail-detective.mdx");
const L_de__3_1_setting_the_scene = () => import("@/content/kids/de/3-1-setting-the-scene.mdx");
const L_de__3_2_show_dont_tell = () => import("@/content/kids/de/3-2-show-dont-tell.mdx");
const L_de__3_3_format_finder = () => import("@/content/kids/de/3-3-format-finder.mdx");
const L_de__3_4_context_champion = () => import("@/content/kids/de/3-4-context-champion.mdx");
const L_de__4_1_pretend_time = () => import("@/content/kids/de/4-1-pretend-time.mdx");
const L_de__4_2_story_starters = () => import("@/content/kids/de/4-2-story-starters.mdx");
const L_de__4_3_character_creator = () => import("@/content/kids/de/4-3-character-creator.mdx");
const L_de__4_4_world_builder = () => import("@/content/kids/de/4-4-world-builder.mdx");
const L_de__5_1_perfect_prompt = () => import("@/content/kids/de/5-1-perfect-prompt.mdx");
const L_de__5_2_fix_it_up = () => import("@/content/kids/de/5-2-fix-it-up.mdx");
const L_de__5_3_prompt_remix = () => import("@/content/kids/de/5-3-prompt-remix.mdx");
const L_de__5_4_graduation_day = () => import("@/content/kids/de/5-4-graduation-day.mdx");
const L_el__1_1_meet_promi = () => import("@/content/kids/el/1-1-meet-promi.mdx");
const L_el__1_2_first_words = () => import("@/content/kids/el/1-2-first-words.mdx");
const L_el__1_3_being_clear = () => import("@/content/kids/el/1-3-being-clear.mdx");
const L_el__2_1_missing_details = () => import("@/content/kids/el/2-1-missing-details.mdx");
const L_el__2_2_who_and_what = () => import("@/content/kids/el/2-2-who-and-what.mdx");
const L_el__2_3_when_and_where = () => import("@/content/kids/el/2-3-when-and-where.mdx");
const L_el__2_4_detail_detective = () => import("@/content/kids/el/2-4-detail-detective.mdx");
const L_el__3_1_setting_the_scene = () => import("@/content/kids/el/3-1-setting-the-scene.mdx");
const L_el__3_2_show_dont_tell = () => import("@/content/kids/el/3-2-show-dont-tell.mdx");
const L_el__3_3_format_finder = () => import("@/content/kids/el/3-3-format-finder.mdx");
const L_el__3_4_context_champion = () => import("@/content/kids/el/3-4-context-champion.mdx");
const L_el__4_1_pretend_time = () => import("@/content/kids/el/4-1-pretend-time.mdx");
const L_el__4_2_story_starters = () => import("@/content/kids/el/4-2-story-starters.mdx");
const L_el__4_3_character_creator = () => import("@/content/kids/el/4-3-character-creator.mdx");
const L_el__4_4_world_builder = () => import("@/content/kids/el/4-4-world-builder.mdx");
const L_el__5_1_perfect_prompt = () => import("@/content/kids/el/5-1-perfect-prompt.mdx");
const L_el__5_2_fix_it_up = () => import("@/content/kids/el/5-2-fix-it-up.mdx");
const L_el__5_3_prompt_remix = () => import("@/content/kids/el/5-3-prompt-remix.mdx");
const L_el__5_4_graduation_day = () => import("@/content/kids/el/5-4-graduation-day.mdx");
const L_en__1_1_meet_promi = () => import("@/content/kids/en/1-1-meet-promi.mdx");
const L_en__1_2_first_words = () => import("@/content/kids/en/1-2-first-words.mdx");
const L_en__1_3_being_clear = () => import("@/content/kids/en/1-3-being-clear.mdx");
const L_en__2_1_missing_details = () => import("@/content/kids/en/2-1-missing-details.mdx");
const L_en__2_2_who_and_what = () => import("@/content/kids/en/2-2-who-and-what.mdx");
const L_en__2_3_when_and_where = () => import("@/content/kids/en/2-3-when-and-where.mdx");
const L_en__2_4_detail_detective = () => import("@/content/kids/en/2-4-detail-detective.mdx");
const L_en__3_1_setting_the_scene = () => import("@/content/kids/en/3-1-setting-the-scene.mdx");
const L_en__3_2_show_dont_tell = () => import("@/content/kids/en/3-2-show-dont-tell.mdx");
const L_en__3_3_format_finder = () => import("@/content/kids/en/3-3-format-finder.mdx");
const L_en__3_4_context_champion = () => import("@/content/kids/en/3-4-context-champion.mdx");
const L_en__4_1_pretend_time = () => import("@/content/kids/en/4-1-pretend-time.mdx");
const L_en__4_2_story_starters = () => import("@/content/kids/en/4-2-story-starters.mdx");
const L_en__4_3_character_creator = () => import("@/content/kids/en/4-3-character-creator.mdx");
const L_en__4_4_world_builder = () => import("@/content/kids/en/4-4-world-builder.mdx");
const L_en__5_1_perfect_prompt = () => import("@/content/kids/en/5-1-perfect-prompt.mdx");
const L_en__5_2_fix_it_up = () => import("@/content/kids/en/5-2-fix-it-up.mdx");
const L_en__5_3_prompt_remix = () => import("@/content/kids/en/5-3-prompt-remix.mdx");
const L_en__5_4_graduation_day = () => import("@/content/kids/en/5-4-graduation-day.mdx");
const L_es__1_1_meet_promi = () => import("@/content/kids/es/1-1-meet-promi.mdx");
const L_es__1_2_first_words = () => import("@/content/kids/es/1-2-first-words.mdx");
const L_es__1_3_being_clear = () => import("@/content/kids/es/1-3-being-clear.mdx");
const L_es__2_1_missing_details = () => import("@/content/kids/es/2-1-missing-details.mdx");
const L_es__2_2_who_and_what = () => import("@/content/kids/es/2-2-who-and-what.mdx");
const L_es__2_3_when_and_where = () => import("@/content/kids/es/2-3-when-and-where.mdx");
const L_es__2_4_detail_detective = () => import("@/content/kids/es/2-4-detail-detective.mdx");
const L_es__3_1_setting_the_scene = () => import("@/content/kids/es/3-1-setting-the-scene.mdx");
const L_es__3_2_show_dont_tell = () => import("@/content/kids/es/3-2-show-dont-tell.mdx");
const L_es__3_3_format_finder = () => import("@/content/kids/es/3-3-format-finder.mdx");
const L_es__3_4_context_champion = () => import("@/content/kids/es/3-4-context-champion.mdx");
const L_es__4_1_pretend_time = () => import("@/content/kids/es/4-1-pretend-time.mdx");
const L_es__4_2_story_starters = () => import("@/content/kids/es/4-2-story-starters.mdx");
const L_es__4_3_character_creator = () => import("@/content/kids/es/4-3-character-creator.mdx");
const L_es__4_4_world_builder = () => import("@/content/kids/es/4-4-world-builder.mdx");
const L_es__5_1_perfect_prompt = () => import("@/content/kids/es/5-1-perfect-prompt.mdx");
const L_es__5_2_fix_it_up = () => import("@/content/kids/es/5-2-fix-it-up.mdx");
const L_es__5_3_prompt_remix = () => import("@/content/kids/es/5-3-prompt-remix.mdx");
const L_es__5_4_graduation_day = () => import("@/content/kids/es/5-4-graduation-day.mdx");
const L_fa__1_1_meet_promi = () => import("@/content/kids/fa/1-1-meet-promi.mdx");
const L_fa__1_2_first_words = () => import("@/content/kids/fa/1-2-first-words.mdx");
const L_fa__1_3_being_clear = () => import("@/content/kids/fa/1-3-being-clear.mdx");
const L_fa__2_1_missing_details = () => import("@/content/kids/fa/2-1-missing-details.mdx");
const L_fa__2_2_who_and_what = () => import("@/content/kids/fa/2-2-who-and-what.mdx");
const L_fa__2_3_when_and_where = () => import("@/content/kids/fa/2-3-when-and-where.mdx");
const L_fa__2_4_detail_detective = () => import("@/content/kids/fa/2-4-detail-detective.mdx");
const L_fa__3_1_setting_the_scene = () => import("@/content/kids/fa/3-1-setting-the-scene.mdx");
const L_fa__3_2_show_dont_tell = () => import("@/content/kids/fa/3-2-show-dont-tell.mdx");
const L_fa__3_3_format_finder = () => import("@/content/kids/fa/3-3-format-finder.mdx");
const L_fa__3_4_context_champion = () => import("@/content/kids/fa/3-4-context-champion.mdx");
const L_fa__4_1_pretend_time = () => import("@/content/kids/fa/4-1-pretend-time.mdx");
const L_fa__4_2_story_starters = () => import("@/content/kids/fa/4-2-story-starters.mdx");
const L_fa__4_3_character_creator = () => import("@/content/kids/fa/4-3-character-creator.mdx");
const L_fa__4_4_world_builder = () => import("@/content/kids/fa/4-4-world-builder.mdx");
const L_fa__5_1_perfect_prompt = () => import("@/content/kids/fa/5-1-perfect-prompt.mdx");
const L_fa__5_2_fix_it_up = () => import("@/content/kids/fa/5-2-fix-it-up.mdx");
const L_fa__5_3_prompt_remix = () => import("@/content/kids/fa/5-3-prompt-remix.mdx");
const L_fa__5_4_graduation_day = () => import("@/content/kids/fa/5-4-graduation-day.mdx");
const L_fr__1_1_meet_promi = () => import("@/content/kids/fr/1-1-meet-promi.mdx");
const L_fr__1_2_first_words = () => import("@/content/kids/fr/1-2-first-words.mdx");
const L_fr__1_3_being_clear = () => import("@/content/kids/fr/1-3-being-clear.mdx");
const L_fr__2_1_missing_details = () => import("@/content/kids/fr/2-1-missing-details.mdx");
const L_fr__2_2_who_and_what = () => import("@/content/kids/fr/2-2-who-and-what.mdx");
const L_fr__2_3_when_and_where = () => import("@/content/kids/fr/2-3-when-and-where.mdx");
const L_fr__2_4_detail_detective = () => import("@/content/kids/fr/2-4-detail-detective.mdx");
const L_fr__3_1_setting_the_scene = () => import("@/content/kids/fr/3-1-setting-the-scene.mdx");
const L_fr__3_2_show_dont_tell = () => import("@/content/kids/fr/3-2-show-dont-tell.mdx");
const L_fr__3_3_format_finder = () => import("@/content/kids/fr/3-3-format-finder.mdx");
const L_fr__3_4_context_champion = () => import("@/content/kids/fr/3-4-context-champion.mdx");
const L_fr__4_1_pretend_time = () => import("@/content/kids/fr/4-1-pretend-time.mdx");
const L_fr__4_2_story_starters = () => import("@/content/kids/fr/4-2-story-starters.mdx");
const L_fr__4_3_character_creator = () => import("@/content/kids/fr/4-3-character-creator.mdx");
const L_fr__4_4_world_builder = () => import("@/content/kids/fr/4-4-world-builder.mdx");
const L_fr__5_1_perfect_prompt = () => import("@/content/kids/fr/5-1-perfect-prompt.mdx");
const L_fr__5_2_fix_it_up = () => import("@/content/kids/fr/5-2-fix-it-up.mdx");
const L_fr__5_3_prompt_remix = () => import("@/content/kids/fr/5-3-prompt-remix.mdx");
const L_fr__5_4_graduation_day = () => import("@/content/kids/fr/5-4-graduation-day.mdx");
const L_it__1_1_meet_promi = () => import("@/content/kids/it/1-1-meet-promi.mdx");
const L_it__1_2_first_words = () => import("@/content/kids/it/1-2-first-words.mdx");
const L_it__1_3_being_clear = () => import("@/content/kids/it/1-3-being-clear.mdx");
const L_it__2_1_missing_details = () => import("@/content/kids/it/2-1-missing-details.mdx");
const L_it__2_2_who_and_what = () => import("@/content/kids/it/2-2-who-and-what.mdx");
const L_it__2_3_when_and_where = () => import("@/content/kids/it/2-3-when-and-where.mdx");
const L_it__2_4_detail_detective = () => import("@/content/kids/it/2-4-detail-detective.mdx");
const L_it__3_1_setting_the_scene = () => import("@/content/kids/it/3-1-setting-the-scene.mdx");
const L_it__3_2_show_dont_tell = () => import("@/content/kids/it/3-2-show-dont-tell.mdx");
const L_it__3_3_format_finder = () => import("@/content/kids/it/3-3-format-finder.mdx");
const L_it__3_4_context_champion = () => import("@/content/kids/it/3-4-context-champion.mdx");
const L_it__4_1_pretend_time = () => import("@/content/kids/it/4-1-pretend-time.mdx");
const L_it__4_2_story_starters = () => import("@/content/kids/it/4-2-story-starters.mdx");
const L_it__4_3_character_creator = () => import("@/content/kids/it/4-3-character-creator.mdx");
const L_it__4_4_world_builder = () => import("@/content/kids/it/4-4-world-builder.mdx");
const L_it__5_1_perfect_prompt = () => import("@/content/kids/it/5-1-perfect-prompt.mdx");
const L_it__5_2_fix_it_up = () => import("@/content/kids/it/5-2-fix-it-up.mdx");
const L_it__5_3_prompt_remix = () => import("@/content/kids/it/5-3-prompt-remix.mdx");
const L_it__5_4_graduation_day = () => import("@/content/kids/it/5-4-graduation-day.mdx");
const L_ja__1_1_meet_promi = () => import("@/content/kids/ja/1-1-meet-promi.mdx");
const L_ja__1_2_first_words = () => import("@/content/kids/ja/1-2-first-words.mdx");
const L_ja__1_3_being_clear = () => import("@/content/kids/ja/1-3-being-clear.mdx");
const L_ja__2_1_missing_details = () => import("@/content/kids/ja/2-1-missing-details.mdx");
const L_ja__2_2_who_and_what = () => import("@/content/kids/ja/2-2-who-and-what.mdx");
const L_ja__2_3_when_and_where = () => import("@/content/kids/ja/2-3-when-and-where.mdx");
const L_ja__2_4_detail_detective = () => import("@/content/kids/ja/2-4-detail-detective.mdx");
const L_ja__3_1_setting_the_scene = () => import("@/content/kids/ja/3-1-setting-the-scene.mdx");
const L_ja__3_2_show_dont_tell = () => import("@/content/kids/ja/3-2-show-dont-tell.mdx");
const L_ja__3_3_format_finder = () => import("@/content/kids/ja/3-3-format-finder.mdx");
const L_ja__3_4_context_champion = () => import("@/content/kids/ja/3-4-context-champion.mdx");
const L_ja__4_1_pretend_time = () => import("@/content/kids/ja/4-1-pretend-time.mdx");
const L_ja__4_2_story_starters = () => import("@/content/kids/ja/4-2-story-starters.mdx");
const L_ja__4_3_character_creator = () => import("@/content/kids/ja/4-3-character-creator.mdx");
const L_ja__4_4_world_builder = () => import("@/content/kids/ja/4-4-world-builder.mdx");
const L_ja__5_1_perfect_prompt = () => import("@/content/kids/ja/5-1-perfect-prompt.mdx");
const L_ja__5_2_fix_it_up = () => import("@/content/kids/ja/5-2-fix-it-up.mdx");
const L_ja__5_3_prompt_remix = () => import("@/content/kids/ja/5-3-prompt-remix.mdx");
const L_ja__5_4_graduation_day = () => import("@/content/kids/ja/5-4-graduation-day.mdx");
const L_ko__1_1_meet_promi = () => import("@/content/kids/ko/1-1-meet-promi.mdx");
const L_ko__1_2_first_words = () => import("@/content/kids/ko/1-2-first-words.mdx");
const L_ko__1_3_being_clear = () => import("@/content/kids/ko/1-3-being-clear.mdx");
const L_ko__2_1_missing_details = () => import("@/content/kids/ko/2-1-missing-details.mdx");
const L_ko__2_2_who_and_what = () => import("@/content/kids/ko/2-2-who-and-what.mdx");
const L_ko__2_3_when_and_where = () => import("@/content/kids/ko/2-3-when-and-where.mdx");
const L_ko__2_4_detail_detective = () => import("@/content/kids/ko/2-4-detail-detective.mdx");
const L_ko__3_1_setting_the_scene = () => import("@/content/kids/ko/3-1-setting-the-scene.mdx");
const L_ko__3_2_show_dont_tell = () => import("@/content/kids/ko/3-2-show-dont-tell.mdx");
const L_ko__3_3_format_finder = () => import("@/content/kids/ko/3-3-format-finder.mdx");
const L_ko__3_4_context_champion = () => import("@/content/kids/ko/3-4-context-champion.mdx");
const L_ko__4_1_pretend_time = () => import("@/content/kids/ko/4-1-pretend-time.mdx");
const L_ko__4_2_story_starters = () => import("@/content/kids/ko/4-2-story-starters.mdx");
const L_ko__4_3_character_creator = () => import("@/content/kids/ko/4-3-character-creator.mdx");
const L_ko__4_4_world_builder = () => import("@/content/kids/ko/4-4-world-builder.mdx");
const L_ko__5_1_perfect_prompt = () => import("@/content/kids/ko/5-1-perfect-prompt.mdx");
const L_ko__5_2_fix_it_up = () => import("@/content/kids/ko/5-2-fix-it-up.mdx");
const L_ko__5_3_prompt_remix = () => import("@/content/kids/ko/5-3-prompt-remix.mdx");
const L_ko__5_4_graduation_day = () => import("@/content/kids/ko/5-4-graduation-day.mdx");
const L_nl__1_1_meet_promi = () => import("@/content/kids/nl/1-1-meet-promi.mdx");
const L_nl__1_2_first_words = () => import("@/content/kids/nl/1-2-first-words.mdx");
const L_nl__1_3_being_clear = () => import("@/content/kids/nl/1-3-being-clear.mdx");
const L_nl__2_1_missing_details = () => import("@/content/kids/nl/2-1-missing-details.mdx");
const L_nl__2_2_who_and_what = () => import("@/content/kids/nl/2-2-who-and-what.mdx");
const L_nl__2_3_when_and_where = () => import("@/content/kids/nl/2-3-when-and-where.mdx");
const L_nl__2_4_detail_detective = () => import("@/content/kids/nl/2-4-detail-detective.mdx");
const L_nl__3_1_setting_the_scene = () => import("@/content/kids/nl/3-1-setting-the-scene.mdx");
const L_nl__3_2_show_dont_tell = () => import("@/content/kids/nl/3-2-show-dont-tell.mdx");
const L_nl__3_3_format_finder = () => import("@/content/kids/nl/3-3-format-finder.mdx");
const L_nl__3_4_context_champion = () => import("@/content/kids/nl/3-4-context-champion.mdx");
const L_nl__4_1_pretend_time = () => import("@/content/kids/nl/4-1-pretend-time.mdx");
const L_nl__4_2_story_starters = () => import("@/content/kids/nl/4-2-story-starters.mdx");
const L_nl__4_3_character_creator = () => import("@/content/kids/nl/4-3-character-creator.mdx");
const L_nl__4_4_world_builder = () => import("@/content/kids/nl/4-4-world-builder.mdx");
const L_nl__5_1_perfect_prompt = () => import("@/content/kids/nl/5-1-perfect-prompt.mdx");
const L_nl__5_2_fix_it_up = () => import("@/content/kids/nl/5-2-fix-it-up.mdx");
const L_nl__5_3_prompt_remix = () => import("@/content/kids/nl/5-3-prompt-remix.mdx");
const L_nl__5_4_graduation_day = () => import("@/content/kids/nl/5-4-graduation-day.mdx");
const L_pt__1_1_meet_promi = () => import("@/content/kids/pt/1-1-meet-promi.mdx");
const L_pt__1_2_first_words = () => import("@/content/kids/pt/1-2-first-words.mdx");
const L_pt__1_3_being_clear = () => import("@/content/kids/pt/1-3-being-clear.mdx");
const L_pt__2_1_missing_details = () => import("@/content/kids/pt/2-1-missing-details.mdx");
const L_pt__2_2_who_and_what = () => import("@/content/kids/pt/2-2-who-and-what.mdx");
const L_pt__2_3_when_and_where = () => import("@/content/kids/pt/2-3-when-and-where.mdx");
const L_pt__2_4_detail_detective = () => import("@/content/kids/pt/2-4-detail-detective.mdx");
const L_pt__3_1_setting_the_scene = () => import("@/content/kids/pt/3-1-setting-the-scene.mdx");
const L_pt__3_2_show_dont_tell = () => import("@/content/kids/pt/3-2-show-dont-tell.mdx");
const L_pt__3_3_format_finder = () => import("@/content/kids/pt/3-3-format-finder.mdx");
const L_pt__3_4_context_champion = () => import("@/content/kids/pt/3-4-context-champion.mdx");
const L_pt__4_1_pretend_time = () => import("@/content/kids/pt/4-1-pretend-time.mdx");
const L_pt__4_2_story_starters = () => import("@/content/kids/pt/4-2-story-starters.mdx");
const L_pt__4_3_character_creator = () => import("@/content/kids/pt/4-3-character-creator.mdx");
const L_pt__4_4_world_builder = () => import("@/content/kids/pt/4-4-world-builder.mdx");
const L_pt__5_1_perfect_prompt = () => import("@/content/kids/pt/5-1-perfect-prompt.mdx");
const L_pt__5_2_fix_it_up = () => import("@/content/kids/pt/5-2-fix-it-up.mdx");
const L_pt__5_3_prompt_remix = () => import("@/content/kids/pt/5-3-prompt-remix.mdx");
const L_pt__5_4_graduation_day = () => import("@/content/kids/pt/5-4-graduation-day.mdx");
const L_ru__1_1_meet_promi = () => import("@/content/kids/ru/1-1-meet-promi.mdx");
const L_ru__1_2_first_words = () => import("@/content/kids/ru/1-2-first-words.mdx");
const L_ru__1_3_being_clear = () => import("@/content/kids/ru/1-3-being-clear.mdx");
const L_ru__2_1_missing_details = () => import("@/content/kids/ru/2-1-missing-details.mdx");
const L_ru__2_2_who_and_what = () => import("@/content/kids/ru/2-2-who-and-what.mdx");
const L_ru__2_3_when_and_where = () => import("@/content/kids/ru/2-3-when-and-where.mdx");
const L_ru__2_4_detail_detective = () => import("@/content/kids/ru/2-4-detail-detective.mdx");
const L_ru__3_1_setting_the_scene = () => import("@/content/kids/ru/3-1-setting-the-scene.mdx");
const L_ru__3_2_show_dont_tell = () => import("@/content/kids/ru/3-2-show-dont-tell.mdx");
const L_ru__3_3_format_finder = () => import("@/content/kids/ru/3-3-format-finder.mdx");
const L_ru__3_4_context_champion = () => import("@/content/kids/ru/3-4-context-champion.mdx");
const L_ru__4_1_pretend_time = () => import("@/content/kids/ru/4-1-pretend-time.mdx");
const L_ru__4_2_story_starters = () => import("@/content/kids/ru/4-2-story-starters.mdx");
const L_ru__4_3_character_creator = () => import("@/content/kids/ru/4-3-character-creator.mdx");
const L_ru__4_4_world_builder = () => import("@/content/kids/ru/4-4-world-builder.mdx");
const L_ru__5_1_perfect_prompt = () => import("@/content/kids/ru/5-1-perfect-prompt.mdx");
const L_ru__5_2_fix_it_up = () => import("@/content/kids/ru/5-2-fix-it-up.mdx");
const L_ru__5_3_prompt_remix = () => import("@/content/kids/ru/5-3-prompt-remix.mdx");
const L_ru__5_4_graduation_day = () => import("@/content/kids/ru/5-4-graduation-day.mdx");
const L_tr__1_1_meet_promi = () => import("@/content/kids/tr/1-1-meet-promi.mdx");
const L_tr__1_2_first_words = () => import("@/content/kids/tr/1-2-first-words.mdx");
const L_tr__1_3_being_clear = () => import("@/content/kids/tr/1-3-being-clear.mdx");
const L_tr__2_1_missing_details = () => import("@/content/kids/tr/2-1-missing-details.mdx");
const L_tr__2_2_who_and_what = () => import("@/content/kids/tr/2-2-who-and-what.mdx");
const L_tr__2_3_when_and_where = () => import("@/content/kids/tr/2-3-when-and-where.mdx");
const L_tr__2_4_detail_detective = () => import("@/content/kids/tr/2-4-detail-detective.mdx");
const L_tr__3_1_setting_the_scene = () => import("@/content/kids/tr/3-1-setting-the-scene.mdx");
const L_tr__3_2_show_dont_tell = () => import("@/content/kids/tr/3-2-show-dont-tell.mdx");
const L_tr__3_3_format_finder = () => import("@/content/kids/tr/3-3-format-finder.mdx");
const L_tr__3_4_context_champion = () => import("@/content/kids/tr/3-4-context-champion.mdx");
const L_tr__4_1_pretend_time = () => import("@/content/kids/tr/4-1-pretend-time.mdx");
const L_tr__4_2_story_starters = () => import("@/content/kids/tr/4-2-story-starters.mdx");
const L_tr__4_3_character_creator = () => import("@/content/kids/tr/4-3-character-creator.mdx");
const L_tr__4_4_world_builder = () => import("@/content/kids/tr/4-4-world-builder.mdx");
const L_tr__5_1_perfect_prompt = () => import("@/content/kids/tr/5-1-perfect-prompt.mdx");
const L_tr__5_2_fix_it_up = () => import("@/content/kids/tr/5-2-fix-it-up.mdx");
const L_tr__5_3_prompt_remix = () => import("@/content/kids/tr/5-3-prompt-remix.mdx");
const L_tr__5_4_graduation_day = () => import("@/content/kids/tr/5-4-graduation-day.mdx");
const L_zh__1_1_meet_promi = () => import("@/content/kids/zh/1-1-meet-promi.mdx");
const L_zh__1_2_first_words = () => import("@/content/kids/zh/1-2-first-words.mdx");
const L_zh__1_3_being_clear = () => import("@/content/kids/zh/1-3-being-clear.mdx");
const L_zh__2_1_missing_details = () => import("@/content/kids/zh/2-1-missing-details.mdx");
const L_zh__2_2_who_and_what = () => import("@/content/kids/zh/2-2-who-and-what.mdx");
const L_zh__2_3_when_and_where = () => import("@/content/kids/zh/2-3-when-and-where.mdx");
const L_zh__2_4_detail_detective = () => import("@/content/kids/zh/2-4-detail-detective.mdx");
const L_zh__3_1_setting_the_scene = () => import("@/content/kids/zh/3-1-setting-the-scene.mdx");
const L_zh__3_2_show_dont_tell = () => import("@/content/kids/zh/3-2-show-dont-tell.mdx");
const L_zh__3_3_format_finder = () => import("@/content/kids/zh/3-3-format-finder.mdx");
const L_zh__3_4_context_champion = () => import("@/content/kids/zh/3-4-context-champion.mdx");
const L_zh__4_1_pretend_time = () => import("@/content/kids/zh/4-1-pretend-time.mdx");
const L_zh__4_2_story_starters = () => import("@/content/kids/zh/4-2-story-starters.mdx");
const L_zh__4_3_character_creator = () => import("@/content/kids/zh/4-3-character-creator.mdx");
const L_zh__4_4_world_builder = () => import("@/content/kids/zh/4-4-world-builder.mdx");
const L_zh__5_1_perfect_prompt = () => import("@/content/kids/zh/5-1-perfect-prompt.mdx");
const L_zh__5_2_fix_it_up = () => import("@/content/kids/zh/5-2-fix-it-up.mdx");
const L_zh__5_3_prompt_remix = () => import("@/content/kids/zh/5-3-prompt-remix.mdx");
const L_zh__5_4_graduation_day = () => import("@/content/kids/zh/5-4-graduation-day.mdx");
const L_ms__1_1_meet_promi = () => import("@/content/kids/ms/1-1-meet-promi.mdx");
const L_ms__1_2_first_words = () => import("@/content/kids/ms/1-2-first-words.mdx");
const L_ms__1_3_being_clear = () => import("@/content/kids/ms/1-3-being-clear.mdx");
const L_ms__2_1_missing_details = () => import("@/content/kids/ms/2-1-missing-details.mdx");
const L_ms__2_2_who_and_what = () => import("@/content/kids/ms/2-2-who-and-what.mdx");
const L_ms__2_3_when_and_where = () => import("@/content/kids/ms/2-3-when-and-where.mdx");
const L_ms__2_4_detail_detective = () => import("@/content/kids/ms/2-4-detail-detective.mdx");
const L_ms__3_1_setting_the_scene = () => import("@/content/kids/ms/3-1-setting-the-scene.mdx");
const L_ms__3_2_show_dont_tell = () => import("@/content/kids/ms/3-2-show-dont-tell.mdx");
const L_ms__3_3_format_finder = () => import("@/content/kids/ms/3-3-format-finder.mdx");

const loaders: Record<string, Record<string, () => Promise<{ default: CompiledLevelContent }>>> = {
  ar: {
    "1-1-meet-promi": L_ar__1_1_meet_promi,
    "1-2-first-words": L_ar__1_2_first_words,
    "1-3-being-clear": L_ar__1_3_being_clear,
    "2-1-missing-details": L_ar__2_1_missing_details,
    "2-2-who-and-what": L_ar__2_2_who_and_what,
    "2-3-when-and-where": L_ar__2_3_when_and_where,
    "2-4-detail-detective": L_ar__2_4_detail_detective,
    "3-1-setting-the-scene": L_ar__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_ar__3_2_show_dont_tell,
    "3-3-format-finder": L_ar__3_3_format_finder,
    "3-4-context-champion": L_ar__3_4_context_champion,
    "4-1-pretend-time": L_ar__4_1_pretend_time,
    "4-2-story-starters": L_ar__4_2_story_starters,
    "4-3-character-creator": L_ar__4_3_character_creator,
    "4-4-world-builder": L_ar__4_4_world_builder,
    "5-1-perfect-prompt": L_ar__5_1_perfect_prompt,
    "5-2-fix-it-up": L_ar__5_2_fix_it_up,
    "5-3-prompt-remix": L_ar__5_3_prompt_remix,
    "5-4-graduation-day": L_ar__5_4_graduation_day,
  },
  az: {
    "1-1-meet-promi": L_az__1_1_meet_promi,
    "1-2-first-words": L_az__1_2_first_words,
    "1-3-being-clear": L_az__1_3_being_clear,
    "2-1-missing-details": L_az__2_1_missing_details,
    "2-2-who-and-what": L_az__2_2_who_and_what,
    "2-3-when-and-where": L_az__2_3_when_and_where,
    "2-4-detail-detective": L_az__2_4_detail_detective,
    "3-1-setting-the-scene": L_az__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_az__3_2_show_dont_tell,
    "3-3-format-finder": L_az__3_3_format_finder,
    "3-4-context-champion": L_az__3_4_context_champion,
    "4-1-pretend-time": L_az__4_1_pretend_time,
    "4-2-story-starters": L_az__4_2_story_starters,
    "4-3-character-creator": L_az__4_3_character_creator,
    "4-4-world-builder": L_az__4_4_world_builder,
    "5-1-perfect-prompt": L_az__5_1_perfect_prompt,
    "5-2-fix-it-up": L_az__5_2_fix_it_up,
    "5-3-prompt-remix": L_az__5_3_prompt_remix,
    "5-4-graduation-day": L_az__5_4_graduation_day,
  },
  de: {
    "1-1-meet-promi": L_de__1_1_meet_promi,
    "1-2-first-words": L_de__1_2_first_words,
    "1-3-being-clear": L_de__1_3_being_clear,
    "2-1-missing-details": L_de__2_1_missing_details,
    "2-2-who-and-what": L_de__2_2_who_and_what,
    "2-3-when-and-where": L_de__2_3_when_and_where,
    "2-4-detail-detective": L_de__2_4_detail_detective,
    "3-1-setting-the-scene": L_de__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_de__3_2_show_dont_tell,
    "3-3-format-finder": L_de__3_3_format_finder,
    "3-4-context-champion": L_de__3_4_context_champion,
    "4-1-pretend-time": L_de__4_1_pretend_time,
    "4-2-story-starters": L_de__4_2_story_starters,
    "4-3-character-creator": L_de__4_3_character_creator,
    "4-4-world-builder": L_de__4_4_world_builder,
    "5-1-perfect-prompt": L_de__5_1_perfect_prompt,
    "5-2-fix-it-up": L_de__5_2_fix_it_up,
    "5-3-prompt-remix": L_de__5_3_prompt_remix,
    "5-4-graduation-day": L_de__5_4_graduation_day,
  },
  el: {
    "1-1-meet-promi": L_el__1_1_meet_promi,
    "1-2-first-words": L_el__1_2_first_words,
    "1-3-being-clear": L_el__1_3_being_clear,
    "2-1-missing-details": L_el__2_1_missing_details,
    "2-2-who-and-what": L_el__2_2_who_and_what,
    "2-3-when-and-where": L_el__2_3_when_and_where,
    "2-4-detail-detective": L_el__2_4_detail_detective,
    "3-1-setting-the-scene": L_el__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_el__3_2_show_dont_tell,
    "3-3-format-finder": L_el__3_3_format_finder,
    "3-4-context-champion": L_el__3_4_context_champion,
    "4-1-pretend-time": L_el__4_1_pretend_time,
    "4-2-story-starters": L_el__4_2_story_starters,
    "4-3-character-creator": L_el__4_3_character_creator,
    "4-4-world-builder": L_el__4_4_world_builder,
    "5-1-perfect-prompt": L_el__5_1_perfect_prompt,
    "5-2-fix-it-up": L_el__5_2_fix_it_up,
    "5-3-prompt-remix": L_el__5_3_prompt_remix,
    "5-4-graduation-day": L_el__5_4_graduation_day,
  },
  en: {
    "1-1-meet-promi": L_en__1_1_meet_promi,
    "1-2-first-words": L_en__1_2_first_words,
    "1-3-being-clear": L_en__1_3_being_clear,
    "2-1-missing-details": L_en__2_1_missing_details,
    "2-2-who-and-what": L_en__2_2_who_and_what,
    "2-3-when-and-where": L_en__2_3_when_and_where,
    "2-4-detail-detective": L_en__2_4_detail_detective,
    "3-1-setting-the-scene": L_en__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_en__3_2_show_dont_tell,
    "3-3-format-finder": L_en__3_3_format_finder,
    "3-4-context-champion": L_en__3_4_context_champion,
    "4-1-pretend-time": L_en__4_1_pretend_time,
    "4-2-story-starters": L_en__4_2_story_starters,
    "4-3-character-creator": L_en__4_3_character_creator,
    "4-4-world-builder": L_en__4_4_world_builder,
    "5-1-perfect-prompt": L_en__5_1_perfect_prompt,
    "5-2-fix-it-up": L_en__5_2_fix_it_up,
    "5-3-prompt-remix": L_en__5_3_prompt_remix,
    "5-4-graduation-day": L_en__5_4_graduation_day,
  },
  es: {
    "1-1-meet-promi": L_es__1_1_meet_promi,
    "1-2-first-words": L_es__1_2_first_words,
    "1-3-being-clear": L_es__1_3_being_clear,
    "2-1-missing-details": L_es__2_1_missing_details,
    "2-2-who-and-what": L_es__2_2_who_and_what,
    "2-3-when-and-where": L_es__2_3_when_and_where,
    "2-4-detail-detective": L_es__2_4_detail_detective,
    "3-1-setting-the-scene": L_es__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_es__3_2_show_dont_tell,
    "3-3-format-finder": L_es__3_3_format_finder,
    "3-4-context-champion": L_es__3_4_context_champion,
    "4-1-pretend-time": L_es__4_1_pretend_time,
    "4-2-story-starters": L_es__4_2_story_starters,
    "4-3-character-creator": L_es__4_3_character_creator,
    "4-4-world-builder": L_es__4_4_world_builder,
    "5-1-perfect-prompt": L_es__5_1_perfect_prompt,
    "5-2-fix-it-up": L_es__5_2_fix_it_up,
    "5-3-prompt-remix": L_es__5_3_prompt_remix,
    "5-4-graduation-day": L_es__5_4_graduation_day,
  },
  fa: {
    "1-1-meet-promi": L_fa__1_1_meet_promi,
    "1-2-first-words": L_fa__1_2_first_words,
    "1-3-being-clear": L_fa__1_3_being_clear,
    "2-1-missing-details": L_fa__2_1_missing_details,
    "2-2-who-and-what": L_fa__2_2_who_and_what,
    "2-3-when-and-where": L_fa__2_3_when_and_where,
    "2-4-detail-detective": L_fa__2_4_detail_detective,
    "3-1-setting-the-scene": L_fa__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_fa__3_2_show_dont_tell,
    "3-3-format-finder": L_fa__3_3_format_finder,
    "3-4-context-champion": L_fa__3_4_context_champion,
    "4-1-pretend-time": L_fa__4_1_pretend_time,
    "4-2-story-starters": L_fa__4_2_story_starters,
    "4-3-character-creator": L_fa__4_3_character_creator,
    "4-4-world-builder": L_fa__4_4_world_builder,
    "5-1-perfect-prompt": L_fa__5_1_perfect_prompt,
    "5-2-fix-it-up": L_fa__5_2_fix_it_up,
    "5-3-prompt-remix": L_fa__5_3_prompt_remix,
    "5-4-graduation-day": L_fa__5_4_graduation_day,
  },
  fr: {
    "1-1-meet-promi": L_fr__1_1_meet_promi,
    "1-2-first-words": L_fr__1_2_first_words,
    "1-3-being-clear": L_fr__1_3_being_clear,
    "2-1-missing-details": L_fr__2_1_missing_details,
    "2-2-who-and-what": L_fr__2_2_who_and_what,
    "2-3-when-and-where": L_fr__2_3_when_and_where,
    "2-4-detail-detective": L_fr__2_4_detail_detective,
    "3-1-setting-the-scene": L_fr__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_fr__3_2_show_dont_tell,
    "3-3-format-finder": L_fr__3_3_format_finder,
    "3-4-context-champion": L_fr__3_4_context_champion,
    "4-1-pretend-time": L_fr__4_1_pretend_time,
    "4-2-story-starters": L_fr__4_2_story_starters,
    "4-3-character-creator": L_fr__4_3_character_creator,
    "4-4-world-builder": L_fr__4_4_world_builder,
    "5-1-perfect-prompt": L_fr__5_1_perfect_prompt,
    "5-2-fix-it-up": L_fr__5_2_fix_it_up,
    "5-3-prompt-remix": L_fr__5_3_prompt_remix,
    "5-4-graduation-day": L_fr__5_4_graduation_day,
  },
  it: {
    "1-1-meet-promi": L_it__1_1_meet_promi,
    "1-2-first-words": L_it__1_2_first_words,
    "1-3-being-clear": L_it__1_3_being_clear,
    "2-1-missing-details": L_it__2_1_missing_details,
    "2-2-who-and-what": L_it__2_2_who_and_what,
    "2-3-when-and-where": L_it__2_3_when_and_where,
    "2-4-detail-detective": L_it__2_4_detail_detective,
    "3-1-setting-the-scene": L_it__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_it__3_2_show_dont_tell,
    "3-3-format-finder": L_it__3_3_format_finder,
    "3-4-context-champion": L_it__3_4_context_champion,
    "4-1-pretend-time": L_it__4_1_pretend_time,
    "4-2-story-starters": L_it__4_2_story_starters,
    "4-3-character-creator": L_it__4_3_character_creator,
    "4-4-world-builder": L_it__4_4_world_builder,
    "5-1-perfect-prompt": L_it__5_1_perfect_prompt,
    "5-2-fix-it-up": L_it__5_2_fix_it_up,
    "5-3-prompt-remix": L_it__5_3_prompt_remix,
    "5-4-graduation-day": L_it__5_4_graduation_day,
  },
  ja: {
    "1-1-meet-promi": L_ja__1_1_meet_promi,
    "1-2-first-words": L_ja__1_2_first_words,
    "1-3-being-clear": L_ja__1_3_being_clear,
    "2-1-missing-details": L_ja__2_1_missing_details,
    "2-2-who-and-what": L_ja__2_2_who_and_what,
    "2-3-when-and-where": L_ja__2_3_when_and_where,
    "2-4-detail-detective": L_ja__2_4_detail_detective,
    "3-1-setting-the-scene": L_ja__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_ja__3_2_show_dont_tell,
    "3-3-format-finder": L_ja__3_3_format_finder,
    "3-4-context-champion": L_ja__3_4_context_champion,
    "4-1-pretend-time": L_ja__4_1_pretend_time,
    "4-2-story-starters": L_ja__4_2_story_starters,
    "4-3-character-creator": L_ja__4_3_character_creator,
    "4-4-world-builder": L_ja__4_4_world_builder,
    "5-1-perfect-prompt": L_ja__5_1_perfect_prompt,
    "5-2-fix-it-up": L_ja__5_2_fix_it_up,
    "5-3-prompt-remix": L_ja__5_3_prompt_remix,
    "5-4-graduation-day": L_ja__5_4_graduation_day,
  },
  ko: {
    "1-1-meet-promi": L_ko__1_1_meet_promi,
    "1-2-first-words": L_ko__1_2_first_words,
    "1-3-being-clear": L_ko__1_3_being_clear,
    "2-1-missing-details": L_ko__2_1_missing_details,
    "2-2-who-and-what": L_ko__2_2_who_and_what,
    "2-3-when-and-where": L_ko__2_3_when_and_where,
    "2-4-detail-detective": L_ko__2_4_detail_detective,
    "3-1-setting-the-scene": L_ko__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_ko__3_2_show_dont_tell,
    "3-3-format-finder": L_ko__3_3_format_finder,
    "3-4-context-champion": L_ko__3_4_context_champion,
    "4-1-pretend-time": L_ko__4_1_pretend_time,
    "4-2-story-starters": L_ko__4_2_story_starters,
    "4-3-character-creator": L_ko__4_3_character_creator,
    "4-4-world-builder": L_ko__4_4_world_builder,
    "5-1-perfect-prompt": L_ko__5_1_perfect_prompt,
    "5-2-fix-it-up": L_ko__5_2_fix_it_up,
    "5-3-prompt-remix": L_ko__5_3_prompt_remix,
    "5-4-graduation-day": L_ko__5_4_graduation_day,
  },
  nl: {
    "1-1-meet-promi": L_nl__1_1_meet_promi,
    "1-2-first-words": L_nl__1_2_first_words,
    "1-3-being-clear": L_nl__1_3_being_clear,
    "2-1-missing-details": L_nl__2_1_missing_details,
    "2-2-who-and-what": L_nl__2_2_who_and_what,
    "2-3-when-and-where": L_nl__2_3_when_and_where,
    "2-4-detail-detective": L_nl__2_4_detail_detective,
    "3-1-setting-the-scene": L_nl__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_nl__3_2_show_dont_tell,
    "3-3-format-finder": L_nl__3_3_format_finder,
    "3-4-context-champion": L_nl__3_4_context_champion,
    "4-1-pretend-time": L_nl__4_1_pretend_time,
    "4-2-story-starters": L_nl__4_2_story_starters,
    "4-3-character-creator": L_nl__4_3_character_creator,
    "4-4-world-builder": L_nl__4_4_world_builder,
    "5-1-perfect-prompt": L_nl__5_1_perfect_prompt,
    "5-2-fix-it-up": L_nl__5_2_fix_it_up,
    "5-3-prompt-remix": L_nl__5_3_prompt_remix,
    "5-4-graduation-day": L_nl__5_4_graduation_day,
  },
  pt: {
    "1-1-meet-promi": L_pt__1_1_meet_promi,
    "1-2-first-words": L_pt__1_2_first_words,
    "1-3-being-clear": L_pt__1_3_being_clear,
    "2-1-missing-details": L_pt__2_1_missing_details,
    "2-2-who-and-what": L_pt__2_2_who_and_what,
    "2-3-when-and-where": L_pt__2_3_when_and_where,
    "2-4-detail-detective": L_pt__2_4_detail_detective,
    "3-1-setting-the-scene": L_pt__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_pt__3_2_show_dont_tell,
    "3-3-format-finder": L_pt__3_3_format_finder,
    "3-4-context-champion": L_pt__3_4_context_champion,
    "4-1-pretend-time": L_pt__4_1_pretend_time,
    "4-2-story-starters": L_pt__4_2_story_starters,
    "4-3-character-creator": L_pt__4_3_character_creator,
    "4-4-world-builder": L_pt__4_4_world_builder,
    "5-1-perfect-prompt": L_pt__5_1_perfect_prompt,
    "5-2-fix-it-up": L_pt__5_2_fix_it_up,
    "5-3-prompt-remix": L_pt__5_3_prompt_remix,
    "5-4-graduation-day": L_pt__5_4_graduation_day,
  },
  ru: {
    "1-1-meet-promi": L_ru__1_1_meet_promi,
    "1-2-first-words": L_ru__1_2_first_words,
    "1-3-being-clear": L_ru__1_3_being_clear,
    "2-1-missing-details": L_ru__2_1_missing_details,
    "2-2-who-and-what": L_ru__2_2_who_and_what,
    "2-3-when-and-where": L_ru__2_3_when_and_where,
    "2-4-detail-detective": L_ru__2_4_detail_detective,
    "3-1-setting-the-scene": L_ru__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_ru__3_2_show_dont_tell,
    "3-3-format-finder": L_ru__3_3_format_finder,
    "3-4-context-champion": L_ru__3_4_context_champion,
    "4-1-pretend-time": L_ru__4_1_pretend_time,
    "4-2-story-starters": L_ru__4_2_story_starters,
    "4-3-character-creator": L_ru__4_3_character_creator,
    "4-4-world-builder": L_ru__4_4_world_builder,
    "5-1-perfect-prompt": L_ru__5_1_perfect_prompt,
    "5-2-fix-it-up": L_ru__5_2_fix_it_up,
    "5-3-prompt-remix": L_ru__5_3_prompt_remix,
    "5-4-graduation-day": L_ru__5_4_graduation_day,
  },
  tr: {
    "1-1-meet-promi": L_tr__1_1_meet_promi,
    "1-2-first-words": L_tr__1_2_first_words,
    "1-3-being-clear": L_tr__1_3_being_clear,
    "2-1-missing-details": L_tr__2_1_missing_details,
    "2-2-who-and-what": L_tr__2_2_who_and_what,
    "2-3-when-and-where": L_tr__2_3_when_and_where,
    "2-4-detail-detective": L_tr__2_4_detail_detective,
    "3-1-setting-the-scene": L_tr__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_tr__3_2_show_dont_tell,
    "3-3-format-finder": L_tr__3_3_format_finder,
    "3-4-context-champion": L_tr__3_4_context_champion,
    "4-1-pretend-time": L_tr__4_1_pretend_time,
    "4-2-story-starters": L_tr__4_2_story_starters,
    "4-3-character-creator": L_tr__4_3_character_creator,
    "4-4-world-builder": L_tr__4_4_world_builder,
    "5-1-perfect-prompt": L_tr__5_1_perfect_prompt,
    "5-2-fix-it-up": L_tr__5_2_fix_it_up,
    "5-3-prompt-remix": L_tr__5_3_prompt_remix,
    "5-4-graduation-day": L_tr__5_4_graduation_day,
  },
  zh: {
    "1-1-meet-promi": L_zh__1_1_meet_promi,
    "1-2-first-words": L_zh__1_2_first_words,
    "1-3-being-clear": L_zh__1_3_being_clear,
    "2-1-missing-details": L_zh__2_1_missing_details,
    "2-2-who-and-what": L_zh__2_2_who_and_what,
    "2-3-when-and-where": L_zh__2_3_when_and_where,
    "2-4-detail-detective": L_zh__2_4_detail_detective,
    "3-1-setting-the-scene": L_zh__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_zh__3_2_show_dont_tell,
    "3-3-format-finder": L_zh__3_3_format_finder,
    "3-4-context-champion": L_zh__3_4_context_champion,
    "4-1-pretend-time": L_zh__4_1_pretend_time,
    "4-2-story-starters": L_zh__4_2_story_starters,
    "4-3-character-creator": L_zh__4_3_character_creator,
    "4-4-world-builder": L_zh__4_4_world_builder,
    "5-1-perfect-prompt": L_zh__5_1_perfect_prompt,
    "5-2-fix-it-up": L_zh__5_2_fix_it_up,
    "5-3-prompt-remix": L_zh__5_3_prompt_remix,
    "5-4-graduation-day": L_zh__5_4_graduation_day,
  },
  ms: {
    "1-1-meet-promi": L_ms__1_1_meet_promi,
    "1-2-first-words": L_ms__1_2_first_words,
    "1-3-being-clear": L_ms__1_3_being_clear,
    "2-1-missing-details": L_ms__2_1_missing_details,
    "2-2-who-and-what": L_ms__2_2_who_and_what,
    "2-3-when-and-where": L_ms__2_3_when_and_where,
    "2-4-detail-detective": L_ms__2_4_detail_detective,
    "3-1-setting-the-scene": L_ms__3_1_setting_the_scene,
    "3-2-show-dont-tell": L_ms__3_2_show_dont_tell,
    "3-3-format-finder": L_ms__3_3_format_finder,
  },
};

export function isSupportedLocale(locale: string): boolean {
  return supportedLocales.includes(locale);
}

/**
 * Resolve the compiled MDX component for a level slug in the requested locale.
 *
 * - Returns `null` when the slug is not part of the level registry.
 * - Falls back to English only when the requested (supported) locale module is absent.
 * - Propagates unexpected loader failures (never silently returns null).
 */
export async function loadLevelContent(
  locale: string,
  slug: string
): Promise<{ Component: CompiledLevelContent; effectiveLocale: string } | null> {
  if (!getLevelBySlug(slug)) {
    return null;
  }

  const requestedLocale = isSupportedLocale(locale) ? locale : defaultLocale;

  const requested = await loadFromLocale(requestedLocale, slug);
  if (requested) {
    return { Component: requested, effectiveLocale: requestedLocale };
  }

  // Only the absence of the locale module triggers the English fallback.
  if (requestedLocale !== defaultLocale) {
    const fallback = await loadFromLocale(defaultLocale, slug);
    if (fallback) {
      return { Component: fallback, effectiveLocale: defaultLocale };
    }
  }

  // English module is missing for a known slug: a real failure, not a fallback case.
  throw new Error(
    `No compiled MDX content for level "${slug}" (locale "${requestedLocale}")`
  );
}

async function loadFromLocale(
  locale: string,
  slug: string
): Promise<CompiledLevelContent | null> {
  const localeLoaders = loaders[locale];
  if (!localeLoaders) return null;
  const loader = localeLoaders[slug];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
