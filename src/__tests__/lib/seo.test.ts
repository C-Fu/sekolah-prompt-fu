import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("@/../prompts.config", () => ({
  default: { branding: { name: "Sekolah Prompt-Fu" } },
}));

import {
  absoluteUrl,
  buildPageMetadata,
  getBaseUrl,
  NOINDEX_ROBOTS,
  SITE_NAME,
  toMetaDescription,
  withBasePath,
} from "@/lib/seo";

describe("SITE_NAME", () => {
  it("derives from the branding config", () => {
    expect(SITE_NAME).toBe("Sekolah Prompt-Fu");
  });
});

describe("getBaseUrl", () => {
  const originalUrl = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalUrl;
  });

  it("uses NEXT_PUBLIC_SITE_URL without a trailing slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/";
    expect(getBaseUrl()).toBe("https://example.com");
  });

  it("falls back to https://sekolah-prompt-fu.example", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getBaseUrl()).toBe("https://sekolah-prompt-fu.example");
  });
});

describe("NOINDEX_ROBOTS", () => {
  it("keeps pages out of the index while following links", () => {
    expect(NOINDEX_ROBOTS).toMatchObject({ index: false, follow: true });
  });
});

describe("absoluteUrl", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://sekolah-prompt-fu.example";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("prefixes paths with the site origin", () => {
    expect(absoluteUrl("/map")).toBe("https://sekolah-prompt-fu.example/map");
  });

  it("adds a missing leading slash", () => {
    expect(absoluteUrl("map")).toBe("https://sekolah-prompt-fu.example/map");
  });

  it("returns absolute URLs unchanged", () => {
    expect(absoluteUrl("https://github.com/f")).toBe("https://github.com/f");
  });
});

describe("withBasePath", () => {
  const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH;

  afterEach(() => {
    if (originalBasePath === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath;
  });

  it("returns the path unchanged when no base path is configured", () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    expect(withBasePath("/favicon/favicon.svg")).toBe("/favicon/favicon.svg");
  });

  it("prefixes a root-absolute path with the configured base path", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/sekolah-prompt-fu";
    expect(withBasePath("/favicon/favicon.svg")).toBe(
      "/sekolah-prompt-fu/favicon/favicon.svg"
    );
  });

  it("normalises a trailing slash on the base path", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/sekolah-prompt-fu/";
    expect(withBasePath("/manifest.webmanifest")).toBe(
      "/sekolah-prompt-fu/manifest.webmanifest"
    );
  });

  it("is idempotent for a path already carrying the base path", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/sekolah-prompt-fu";
    expect(withBasePath("/sekolah-prompt-fu/favicon/favicon.ico")).toBe(
      "/sekolah-prompt-fu/favicon/favicon.ico"
    );
  });

  it("leaves absolute URLs untouched", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/sekolah-prompt-fu";
    expect(withBasePath("https://example.com/x.png")).toBe("https://example.com/x.png");
  });
});

describe("toMetaDescription", () => {
  it("collapses whitespace and line breaks", () => {
    expect(toMetaDescription("Learn to\n\n  talk to AI.")).toBe("Learn to talk to AI.");
  });

  it("replaces prompt variables with their names", () => {
    expect(toMetaDescription("Write a poem about ${topic} in ${style:haiku} form")).toBe(
      "Write a poem about topic in style form"
    );
  });

  it("strips markdown syntax and keeps link text", () => {
    expect(toMetaDescription("# Title\n**Bold** see [the docs](https://example.com) ![img](a.png)")).toBe(
      "Title Bold see the docs"
    );
  });

  it("keeps short text as-is", () => {
    expect(toMetaDescription("A short description.")).toBe("A short description.");
  });

  it("cuts long text on a word boundary with an ellipsis", () => {
    const text = "word ".repeat(60);
    const result = toMetaDescription(text, 50);
    expect(result.length).toBeLessThanOrEqual(50);
    expect(result.endsWith("word…")).toBe(true);
  });

  it("stays fast on very long unterminated markup", () => {
    const start = performance.now();
    toMetaDescription("[".repeat(1_000_000));
    toMetaDescription("${".repeat(500_000));
    expect(performance.now() - start).toBeLessThan(1000);
  });

  it("does not leave trailing punctuation before the ellipsis", () => {
    const result = toMetaDescription("First sentence here, second sentence goes on and on", 24);
    expect(result).toBe("First sentence here…");
  });
});

describe("buildPageMetadata", () => {
  it("sets a self-referencing canonical and matching social tags", () => {
    const metadata = buildPageMetadata({
      title: "Learn to Talk to AI",
      description: "A playful way for kids to learn how to talk to AI.",
      path: "/",
    });

    expect(metadata.title).toBe("Learn to Talk to AI");
    expect(metadata.alternates?.canonical).toBe("/");
    expect(metadata.openGraph).toMatchObject({
      url: "/",
      title: "Learn to Talk to AI | Sekolah Prompt-Fu",
      description: "A playful way for kids to learn how to talk to AI.",
    });
    expect(metadata.twitter).toMatchObject({ title: "Learn to Talk to AI | Sekolah Prompt-Fu" });
    expect(metadata.robots).toBeUndefined();
  });

  it("supports absolute titles", () => {
    const metadata = buildPageMetadata({
      title: "Peromfu's Prompt School",
      description: "Kids learn to talk to AI",
      path: "/",
      absoluteTitle: true,
    });

    expect(metadata.title).toEqual({ absolute: "Peromfu's Prompt School" });
    expect(metadata.openGraph).toMatchObject({ title: "Peromfu's Prompt School" });
  });

  it("keeps the canonical on noindex pages", () => {
    const metadata = buildPageMetadata({
      title: "Map",
      description: "World map",
      path: "/map",
      noindex: true,
    });

    expect(metadata.robots).toMatchObject({ index: false, follow: true });
    expect(metadata.alternates?.canonical).toBe("/map");
  });

  it("points the canonical and social URL at a preferred URL", () => {
    const metadata = buildPageMetadata({
      title: "Map",
      description: "World map",
      path: "/map?world=1",
      canonical: "/map",
      noindex: true,
    });

    expect(metadata.alternates?.canonical).toBe("/map");
    expect(metadata.openGraph).toMatchObject({ url: "/map" });
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });

  it("leaves images to the route when requested", () => {
    const metadata = buildPageMetadata({
      title: "Level",
      description: "A level",
      path: "/level/1-1-meet-peromfu",
      image: "route",
    });

    expect(metadata.openGraph).not.toHaveProperty("images");
    expect(metadata.twitter).not.toHaveProperty("images");
  });
});