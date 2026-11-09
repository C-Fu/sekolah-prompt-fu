import { describe, it, expect } from "vitest";
import {
  parseLessonOrigin,
  resolveOriginRoute,
  buildLessonUrl,
  attachOriginToRoute,
  DEFAULT_LESSON_ORIGIN,
} from "@/lib/kids/lesson-origin";

describe("Lesson Origin Helper Contract (CLAR-03)", () => {
  it("parses valid map and planets values strictly", () => {
    expect(parseLessonOrigin("map")).toBe("map");
    expect(parseLessonOrigin("MAP")).toBe("map");
    expect(parseLessonOrigin("planets")).toBe("planets");
    expect(parseLessonOrigin("PLANETS")).toBe("planets");
  });

  it("deterministically falls back to map for empty, unknown, or hostile URL inputs", () => {
    expect(parseLessonOrigin(null)).toBe(DEFAULT_LESSON_ORIGIN);
    expect(parseLessonOrigin(undefined)).toBe(DEFAULT_LESSON_ORIGIN);
    expect(parseLessonOrigin("")).toBe(DEFAULT_LESSON_ORIGIN);
    expect(parseLessonOrigin("random-string")).toBe("map");
    expect(parseLessonOrigin("https://evil.com")).toBe("map");
    expect(parseLessonOrigin("/evil-path")).toBe("map");
    expect(parseLessonOrigin("javascript:alert(1)")).toBe("map");
  });

  it("resolves exact internal routes for allowlisted origins", () => {
    expect(resolveOriginRoute("map")).toBe("/map");
    expect(resolveOriginRoute("planets")).toBe("/planets");
    expect(resolveOriginRoute("invalid")).toBe("/map");
    expect(resolveOriginRoute(null)).toBe("/map");
  });

  it("builds lesson URLs preserving pathname and setting validated origin", () => {
    expect(buildLessonUrl("1-1-meet-peromfu", "map")).toBe("/level/1-1-meet-peromfu?origin=map");
    expect(buildLessonUrl("6-1-bm-kucing-peromfu", "planets")).toBe("/level/6-1-bm-kucing-peromfu?origin=planets");
    // Invalid falls back to map
    expect(buildLessonUrl("1-2-first-words", "attacker" as any)).toBe("/level/1-2-first-words?origin=map");
  });

  it("attaches origin to existing mission routes without breaking existing query parameters", () => {
    expect(attachOriginToRoute("/level/6-1-bm-kucing-peromfu", "planets")).toBe(
      "/level/6-1-bm-kucing-peromfu?origin=planets"
    );
    expect(attachOriginToRoute("/level/6-1-bm-kucing-peromfu?feature=1", "planets")).toBe(
      "/level/6-1-bm-kucing-peromfu?feature=1&origin=planets"
    );
  });
});
