/**
 * Lesson Origin Tracking Contract
 *
 * Enforces a closed allowlist of hub origins:
 * - "map" -> "/map"
 * - "planets" -> "/planets"
 *
 * Security / Robustness:
 * - Direct or invalid inputs (e.g. unknown values, external URLs, hostile payloads)
 *   always deterministically resolve to "map" and destination "/map".
 * - Never returns a caller-controlled URL.
 * - Static export / SSR friendly.
 */

export type LessonOrigin = "map" | "planets";

export const DEFAULT_LESSON_ORIGIN: LessonOrigin = "map";

export const ORIGIN_ROUTES: Record<LessonOrigin, string> = {
  map: "/map",
  planets: "/planets",
};

/**
 * Parses and validates a raw origin string.
 * Returns "map" or "planets". Any unrecognized, empty, or URL-shaped value resolves to "map".
 */
export function parseLessonOrigin(raw: string | null | undefined): LessonOrigin {
  if (!raw) return DEFAULT_LESSON_ORIGIN;
  const normalized = raw.trim().toLowerCase();
  if (normalized === "planets") {
    return "planets";
  }
  return "map";
}

/**
 * Resolves the safe internal return route for an origin.
 */
export function resolveOriginRoute(origin: LessonOrigin | string | null | undefined): string {
  const valid = parseLessonOrigin(origin);
  return ORIGIN_ROUTES[valid];
}

/**
 * Constructs a lesson path with the allowlisted origin query parameter.
 * Preserves the exact /level/{slug} pathname.
 */
export function buildLessonUrl(slug: string, origin: LessonOrigin = "map"): string {
  const safeOrigin = parseLessonOrigin(origin);
  return `/level/${slug}?origin=${safeOrigin}`;
}

/**
 * Appends origin query param to an already existing lesson route.
 */
export function attachOriginToRoute(route: string, origin: LessonOrigin = "map"): string {
  const safeOrigin = parseLessonOrigin(origin);
  const separator = route.includes("?") ? "&" : "?";
  return `${route}${separator}origin=${safeOrigin}`;
}
