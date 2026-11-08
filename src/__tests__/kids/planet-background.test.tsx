import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import {
  PlanetBackground,
  getThemeForLevelSlug,
  PLANET_THEMES,
} from "@/components/kids/layout/planet-background";
import { LevelProvider } from "@/components/kids/providers/level-context";

describe("PlanetBackground and getThemeForLevelSlug (THEME-01, D-01)", () => {
  afterEach(() => {
    cleanup();
  });

  describe("getThemeForLevelSlug resolution logic", () => {
    it("returns 'earth' when slug is undefined or empty", () => {
      expect(getThemeForLevelSlug()).toBe("earth");
      expect(getThemeForLevelSlug("")).toBe("earth");
    });

    it("returns 'earth' for Earth academy levels (Worlds 1-5)", () => {
      expect(getThemeForLevelSlug("1-1-meet-peromfu")).toBe("earth");
      expect(getThemeForLevelSlug("2-4-detail-detective")).toBe("earth");
      expect(getThemeForLevelSlug("3-2-show-dont-tell")).toBe("earth");
      expect(getThemeForLevelSlug("4-3-character-creator")).toBe("earth");
      expect(getThemeForLevelSlug("5-4-graduation-day")).toBe("earth");
    });

    it("returns 'moon' for Moon BM World 6 levels", () => {
      expect(getThemeForLevelSlug("6-1-bm-kucing-peromfu")).toBe("moon");
    });

    it("returns 'mars' for Mars English World 7 levels", () => {
      expect(getThemeForLevelSlug("7-1-english-colorful-toys")).toBe("mars");
      expect(getThemeForLevelSlug("marikh-english")).toBe("mars");
    });

    it("returns 'venus' for Venus Math World 8 levels", () => {
      expect(getThemeForLevelSlug("8-1-matematik-tambah-bintang")).toBe("venus");
      expect(getThemeForLevelSlug("zuhrah-matematik")).toBe("venus");
    });

    it("returns 'mercury' for Mercury Moral World 9 levels", () => {
      expect(getThemeForLevelSlug("9-1-moral-sahabat-prihatin")).toBe("mercury");
      expect(getThemeForLevelSlug("utarid-moral")).toBe("mercury");
    });

    it("falls back to 'earth' strictly on unknown or untrusted slugs", () => {
      expect(getThemeForLevelSlug("unknown-slug")).toBe("earth");
      expect(getThemeForLevelSlug("malicious<script>alert(1)</script>")).toBe("earth");
    });
  });

  describe("PlanetBackground rendering and themes", () => {
    it("renders default Earth theme with pixel clouds when no level slug is active", () => {
      render(
        <LevelProvider>
          <PlanetBackground />
        </LevelProvider>
      );

      const bg = screen.getByTestId("planet-background");
      expect(bg).toBeInTheDocument();
      expect(bg).toHaveAttribute("data-active-theme", "earth");
      expect(bg).toHaveAttribute("aria-hidden", "true");
      // Contains SVG clouds in DOM
      expect(bg.querySelector("svg")).toBeInTheDocument();
    });

    it("renders Earth theme for 1-1-meet-peromfu", () => {
      render(
        <LevelProvider levelSlug="1-1-meet-peromfu">
          <PlanetBackground />
        </LevelProvider>
      );

      const bg = screen.getByTestId("planet-background");
      expect(bg).toHaveAttribute("data-active-theme", "earth");
      expect(bg.querySelector("svg")).toBeInTheDocument();
    });

    it("renders Moon celestial slate theme for 6-1-bm-kucing-peromfu", () => {
      render(
        <LevelProvider levelSlug="6-1-bm-kucing-peromfu">
          <PlanetBackground />
        </LevelProvider>
      );

      const bg = screen.getByTestId("planet-background");
      expect(bg).toHaveAttribute("data-active-theme", "moon");
      // Cloud SVGs should NOT be present in Moon theme
      expect(bg.querySelector("svg")).not.toBeInTheDocument();
    });

    it("renders Mars rust-red atmosphere theme for 7-1-english-colorful-toys", () => {
      render(
        <LevelProvider levelSlug="7-1-english-colorful-toys">
          <PlanetBackground />
        </LevelProvider>
      );

      const bg = screen.getByTestId("planet-background");
      expect(bg).toHaveAttribute("data-active-theme", "mars");
      expect(bg.querySelector("svg")).not.toBeInTheDocument();
    });

    it("renders Venus sulfuric amber theme for 8-1-matematik-tambah-bintang", () => {
      render(
        <LevelProvider levelSlug="8-1-matematik-tambah-bintang">
          <PlanetBackground />
        </LevelProvider>
      );

      const bg = screen.getByTestId("planet-background");
      expect(bg).toHaveAttribute("data-active-theme", "venus");
      expect(bg.querySelector("svg")).not.toBeInTheDocument();
    });

    it("renders Mercury violet dusk theme for 9-1-moral-sahabat-prihatin", () => {
      render(
        <LevelProvider levelSlug="9-1-moral-sahabat-prihatin">
          <PlanetBackground />
        </LevelProvider>
      );

      const bg = screen.getByTestId("planet-background");
      expect(bg).toHaveAttribute("data-active-theme", "mercury");
      expect(bg.querySelector("svg")).not.toBeInTheDocument();
    });
  });

  describe("PLANET_THEMES constants", () => {
    it("defines valid color gradients and accent colors for all 5 planetary themes", () => {
      const themes = ["earth", "moon", "mars", "venus", "mercury"] as const;
      for (const t of themes) {
        expect(PLANET_THEMES[t]).toBeDefined();
        expect(PLANET_THEMES[t].background).toContain("linear-gradient");
        expect(PLANET_THEMES[t].accentColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    });
  });
});
