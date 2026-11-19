"use client";

import React, { useMemo } from "react";
import { useLevelSlug } from "@/components/kids/providers/level-context";
import { getLevelBySlug } from "@/lib/kids/levels";

export type PlanetTheme =
  | "earth"
  | "moon"
  | "mars"
  | "venus"
  | "mercury"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

export interface PlanetThemeStyle {
  id: PlanetTheme;
  background: string;
  accentColor: string;
}

export const PLANET_THEMES: Record<PlanetTheme, PlanetThemeStyle> = {
  earth: {
    id: "earth",
    background: "linear-gradient(180deg, #4A90D9 0%, #87CEEB 30%, #98D8F0 60%, #B8E8F8 100%)",
    accentColor: "#3B82F6",
  },
  moon: {
    id: "moon",
    background: "linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
    accentColor: "#38BDF8",
  },
  mars: {
    id: "mars",
    background: "linear-gradient(180deg, #450A0A 0%, #7F1D1D 50%, #2A0808 100%)",
    accentColor: "#F97316",
  },
  venus: {
    id: "venus",
    background: "linear-gradient(180deg, #78350F 0%, #D97706 50%, #451A03 100%)",
    accentColor: "#FBBF24",
  },
  mercury: {
    id: "mercury",
    background: "linear-gradient(180deg, #1E1B4B 0%, #3B0764 50%, #0F0E2A 100%)",
    accentColor: "#A855F7",
  },
  jupiter: {
    id: "jupiter",
    background: "linear-gradient(180deg, #451A03 0%, #B45309 50%, #1E0A00 100%)",
    accentColor: "#F59E0B",
  },
  saturn: {
    id: "saturn",
    background: "linear-gradient(180deg, #3A2E05 0%, #A16207 50%, #1A1402 100%)",
    accentColor: "#EAB308",
  },
  uranus: {
    id: "uranus",
    background: "linear-gradient(180deg, #083344 0%, #0E7490 50%, #031822 100%)",
    accentColor: "#06B6D4",
  },
  neptune: {
    id: "neptune",
    background: "linear-gradient(180deg, #172554 0%, #1D4ED8 50%, #08112C 100%)",
    accentColor: "#3B82F6",
  },
};

/**
 * Maps a level slug to its planetary theme.
 * Defaults strictly to 'earth' if slug is unknown or unassigned.
 */
export function getThemeForLevelSlug(slug?: string): PlanetTheme {
  if (!slug) return "earth";

  // Slug-based deterministic matching (also resilient to alignment or level registry)
  if (slug.startsWith("6-") || slug.includes("-bm-")) {
    return "moon";
  }
  if (slug.startsWith("7-") || slug.includes("-english-") || slug.startsWith("marikh-")) {
    return "mars";
  }
  if (slug.startsWith("8-") || slug.includes("-matematik-") || slug.startsWith("zuhrah-")) {
    return "venus";
  }
  if (slug.startsWith("9-") || slug.includes("-moral-") || slug.startsWith("utarid-")) {
    return "mercury";
  }
  if (
    slug.startsWith("10-") ||
    slug.includes("-sains-") ||
    slug.startsWith("musytari-") ||
    slug.startsWith("jupiter-")
  ) {
    return "jupiter";
  }
  if (
    slug.startsWith("11-") ||
    slug.includes("-sejarah-") ||
    slug.startsWith("zuhal-") ||
    slug.startsWith("saturn-")
  ) {
    return "saturn";
  }
  if (slug.startsWith("12-") || slug.includes("-rbt-") || slug.startsWith("uranus-")) {
    return "uranus";
  }
  if (
    slug.startsWith("13-") ||
    slug.includes("-psv-") ||
    slug.startsWith("neptun-") ||
    slug.startsWith("neptune-")
  ) {
    return "neptune";
  }

  // Also query registered level if available
  const level = getLevelBySlug(slug);
  if (level) {
    if (level.world <= 5) return "earth";
    if (level.world === 6) return "moon";
    if (level.world === 7) return "mars";
    if (level.world === 8) return "venus";
    if (level.world === 9) return "mercury";
    if (level.world === 10) return "jupiter";
    if (level.world === 11) return "saturn";
    if (level.world === 12) return "uranus";
    if (level.world === 13) return "neptune";
  }

  return "earth";
}

/**
 * Pixel art cloud component for Earth daytime sky.
 */
function PixelCloudBg({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 32 16"
      className={className}
      style={{ imageRendering: "pixelated", ...style }}
      aria-hidden="true"
    >
      <rect x="8" y="8" width="16" height="8" fill="white" />
      <rect x="4" y="12" width="8" height="4" fill="white" />
      <rect x="20" y="12" width="8" height="4" fill="white" />
      <rect x="12" y="4" width="8" height="4" fill="white" />
      <rect x="6" y="8" width="4" height="4" fill="white" />
      <rect x="22" y="8" width="4" height="4" fill="white" />
    </svg>
  );
}

/**
 * Celestial background client component.
 * Renders dynamically based on active level slug from LevelContext.
 */
export function PlanetBackground() {
  const levelSlug = useLevelSlug();
  const activeTheme = useMemo(() => getThemeForLevelSlug(levelSlug), [levelSlug]);
  const themeStyle = PLANET_THEMES[activeTheme];

  return (
    <div
      data-testid="planet-background"
      data-active-theme={activeTheme}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-700"
      aria-hidden="true"
    >
      {/* Base Gradient Atmosphere */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: themeStyle.background }}
      />

      {/* Earth Theme: Drifting Pixel Clouds */}
      {activeTheme === "earth" && (
        <div className="absolute inset-0 overflow-hidden">
          <PixelCloudBg
            className="absolute w-24 h-12 opacity-90 animate-cloud-slow"
            style={{ top: "8%", left: 0, animationDelay: "0s" }}
          />
          <PixelCloudBg
            className="absolute w-32 h-16 opacity-80 animate-cloud-medium"
            style={{ top: "15%", left: 0, animationDelay: "-10s" }}
          />
          <PixelCloudBg
            className="absolute w-20 h-10 opacity-85 animate-cloud-fast"
            style={{ top: "5%", left: 0, animationDelay: "-5s" }}
          />
          <PixelCloudBg
            className="absolute w-28 h-14 opacity-75 animate-cloud-slow"
            style={{ top: "22%", left: 0, animationDelay: "-20s" }}
          />
          <PixelCloudBg
            className="absolute w-16 h-8 opacity-70 animate-cloud-medium"
            style={{ top: "12%", left: 0, animationDelay: "-15s" }}
          />
          <PixelCloudBg
            className="absolute w-36 h-18 opacity-60 animate-cloud-fast"
            style={{ top: "28%", left: 0, animationDelay: "-8s" }}
          />
        </div>
      )}

      {/* Moon Theme: Deep slate with silver crater glow & white stars */}
      {activeTheme === "moon" && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle silver radial glow from bottom right */}
          <div
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle, #E2E8F0 0%, rgba(226, 232, 240, 0) 70%)",
            }}
          />
          {/* Twinkling white stars */}
          <div
            className="absolute top-[10%] left-[15%] w-1.5 h-1.5 bg-[#E2E8F0] rounded-full animate-pulse"
            style={{ animationDuration: "2s" }}
          />
          <div
            className="absolute top-[25%] left-[75%] w-2 h-2 bg-[#E2E8F0] rounded-full animate-pulse"
            style={{ animationDuration: "3s", animationDelay: "0.7s" }}
          />
          <div
            className="absolute top-[18%] left-[40%] w-1 h-1 bg-[#CBD5E1] rounded-full animate-pulse"
            style={{ animationDuration: "2.5s", animationDelay: "1.2s" }}
          />
          <div
            className="absolute top-[35%] left-[20%] w-2 h-2 bg-white rounded-full animate-pulse"
            style={{ animationDuration: "3.5s", animationDelay: "0.3s" }}
          />
          <div
            className="absolute top-[45%] left-[85%] w-1.5 h-1.5 bg-[#E2E8F0] rounded-full animate-pulse"
            style={{ animationDuration: "2.8s", animationDelay: "1.5s" }}
          />
          <div
            className="absolute top-[60%] left-[30%] w-1 h-1 bg-white rounded-full animate-pulse"
            style={{ animationDuration: "4s", animationDelay: "0.5s" }}
          />
          <div
            className="absolute top-[75%] left-[65%] w-2 h-2 bg-[#CBD5E1] rounded-full animate-pulse"
            style={{ animationDuration: "3.2s", animationDelay: "1s" }}
          />
        </div>
      )}

      {/* Mars Theme: Rust-red atmosphere, warm amber stars, Martian dust haze */}
      {activeTheme === "mars" && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Warm Martian dust haze */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background: "radial-gradient(ellipse at center bottom, #B91C1C 0%, transparent 75%)",
            }}
          />
          {/* Amber stars */}
          <div
            className="absolute top-[12%] left-[20%] w-2 h-2 bg-[#FBBF24] rounded-full animate-pulse"
            style={{ animationDuration: "2.4s" }}
          />
          <div
            className="absolute top-[22%] left-[80%] w-1.5 h-1.5 bg-[#FDE68A] rounded-full animate-pulse"
            style={{ animationDuration: "3.1s", animationDelay: "0.8s" }}
          />
          <div
            className="absolute top-[30%] left-[50%] w-2.5 h-2.5 bg-[#F59E0B] rounded-full animate-pulse"
            style={{ animationDuration: "2.7s", animationDelay: "1.4s" }}
          />
          <div
            className="absolute top-[50%] left-[15%] w-1.5 h-1.5 bg-[#FBBF24] rounded-full animate-pulse"
            style={{ animationDuration: "3.3s", animationDelay: "0.4s" }}
          />
          <div
            className="absolute top-[68%] left-[70%] w-2 h-2 bg-[#FDE68A] rounded-full animate-pulse"
            style={{ animationDuration: "2.9s", animationDelay: "1.1s" }}
          />
        </div>
      )}

      {/* Venus Theme: Dense sulfuric golden glow & golden stars */}
      {activeTheme === "venus" && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Golden nebula glow */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: "radial-gradient(circle at 50% 30%, #FBBF24 0%, transparent 70%)",
            }}
          />
          {/* Golden star points */}
          <div
            className="absolute top-[15%] left-[25%] w-2 h-2 bg-[#FDE68A] rounded-full animate-pulse"
            style={{ animationDuration: "2s" }}
          />
          <div
            className="absolute top-[28%] left-[70%] w-2.5 h-2.5 bg-[#FEF08A] rounded-full animate-pulse"
            style={{ animationDuration: "2.8s", animationDelay: "0.6s" }}
          />
          <div
            className="absolute top-[42%] left-[45%] w-1.5 h-1.5 bg-[#FDE68A] rounded-full animate-pulse"
            style={{ animationDuration: "3.2s", animationDelay: "1.3s" }}
          />
          <div
            className="absolute top-[65%] left-[80%] w-2 h-2 bg-[#FEF08A] rounded-full animate-pulse"
            style={{ animationDuration: "2.5s", animationDelay: "0.9s" }}
          />
          <div
            className="absolute top-[75%] left-[18%] w-1.5 h-1.5 bg-[#FDE68A] rounded-full animate-pulse"
            style={{ animationDuration: "3.5s", animationDelay: "1.7s" }}
          />
        </div>
      )}

      {/* Mercury Theme: Violet dusk & ultra-bright violet cosmic points */}
      {activeTheme === "mercury" && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Deep violet cosmic dust haze */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: "radial-gradient(circle at top center, #C084FC 0%, transparent 65%)",
            }}
          />
          {/* Ultra-bright violet cosmic star points */}
          <div
            className="absolute top-[10%] left-[30%] w-2 h-2 bg-[#C084FC] rounded-full animate-pulse"
            style={{ animationDuration: "1.8s" }}
          />
          <div
            className="absolute top-[20%] left-[85%] w-2.5 h-2.5 bg-[#E879F9] rounded-full animate-pulse"
            style={{ animationDuration: "2.6s", animationDelay: "0.5s" }}
          />
          <div
            className="absolute top-[38%] left-[15%] w-1.5 h-1.5 bg-[#C084FC] rounded-full animate-pulse"
            style={{ animationDuration: "2.2s", animationDelay: "1.1s" }}
          />
          <div
            className="absolute top-[55%] left-[60%] w-2 h-2 bg-[#DDD6FE] rounded-full animate-pulse"
            style={{ animationDuration: "3.0s", animationDelay: "0.7s" }}
          />
          <div
            className="absolute top-[72%] left-[25%] w-2 h-2 bg-[#C084FC] rounded-full animate-pulse"
            style={{ animationDuration: "2.4s", animationDelay: "1.5s" }}
          />
          <div
            className="absolute top-[80%] left-[75%] w-1.5 h-1.5 bg-[#E879F9] rounded-full animate-pulse"
            style={{ animationDuration: "3.2s", animationDelay: "0.3s" }}
          />
        </div>
      )}

      {/* Jupiter Theme: Amber swirling storm bands atmosphere */}
      {activeTheme === "jupiter" && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Bespoke atmospheric radial overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 120%, rgba(217, 119, 6, 0.35) 0%, rgba(180, 83, 9, 0.15) 50%, transparent 80%)",
            }}
          />
          {/* Swirling storm cloud layers */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background:
                "radial-gradient(ellipse at 30% 60%, rgba(245, 158, 11, 0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(180, 83, 9, 0.3) 0%, transparent 60%)",
            }}
          />
          {/* Amber & bronze celestial particles */}
          <div
            className="absolute top-[12%] left-[20%] w-2 h-2 bg-[#FDE68A] rounded-full animate-pulse"
            style={{ animationDuration: "2.1s" }}
          />
          <div
            className="absolute top-[24%] left-[75%] w-2.5 h-2.5 bg-[#F59E0B] rounded-full animate-pulse"
            style={{ animationDuration: "2.8s", animationDelay: "0.4s" }}
          />
          <div
            className="absolute top-[38%] left-[40%] w-1.5 h-1.5 bg-[#D97706] rounded-full animate-pulse"
            style={{ animationDuration: "2.3s", animationDelay: "1.2s" }}
          />
          <div
            className="absolute top-[52%] left-[15%] w-2 h-2 bg-[#FDE68A] rounded-full animate-pulse"
            style={{ animationDuration: "3.4s", animationDelay: "0.7s" }}
          />
          <div
            className="absolute top-[68%] left-[82%] w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse"
            style={{ animationDuration: "2.6s", animationDelay: "1.5s" }}
          />
          <div
            className="absolute top-[82%] left-[35%] w-1.5 h-1.5 bg-[#FDE68A] rounded-full animate-pulse"
            style={{ animationDuration: "3.0s", animationDelay: "0.9s" }}
          />
        </div>
      )}

      {/* Saturn Theme: Golden Ochre antique ring haze */}
      {activeTheme === "saturn" && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Bespoke antique ring haze overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 115%, rgba(234, 179, 8, 0.3) 0%, rgba(161, 98, 7, 0.15) 55%, transparent 80%)",
            }}
          />
          {/* Luminous ring band accent */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, transparent 40%, rgba(234, 179, 8, 0.25) 50%, transparent 60%)",
            }}
          />
          {/* Golden star & ring particles */}
          <div
            className="absolute top-[14%] left-[18%] w-2 h-2 bg-[#FEF08A] rounded-full animate-pulse"
            style={{ animationDuration: "2.2s" }}
          />
          <div
            className="absolute top-[26%] left-[82%] w-2.5 h-2.5 bg-[#EAB308] rounded-full animate-pulse"
            style={{ animationDuration: "3.1s", animationDelay: "0.5s" }}
          />
          <div
            className="absolute top-[42%] left-[30%] w-1.5 h-1.5 bg-[#CA8A04] rounded-full animate-pulse"
            style={{ animationDuration: "2.5s", animationDelay: "1.0s" }}
          />
          <div
            className="absolute top-[58%] left-[68%] w-2 h-2 bg-[#FEF08A] rounded-full animate-pulse"
            style={{ animationDuration: "3.3s", animationDelay: "0.3s" }}
          />
          <div
            className="absolute top-[76%] left-[22%] w-2 h-2 bg-[#EAB308] rounded-full animate-pulse"
            style={{ animationDuration: "2.7s", animationDelay: "1.4s" }}
          />
          <div
            className="absolute top-[85%] left-[60%] w-1.5 h-1.5 bg-[#FEF08A] rounded-full animate-pulse"
            style={{ animationDuration: "3.0s", animationDelay: "0.8s" }}
          />
        </div>
      )}

      {/* Uranus Theme: Cyan / Blueprint Teal methane glow */}
      {activeTheme === "uranus" && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Bespoke methane glow radial overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 110%, rgba(6, 182, 212, 0.3) 0%, rgba(14, 116, 144, 0.15) 50%, transparent 80%)",
            }}
          />
          {/* Methane frost glow layer */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 20%, rgba(34, 211, 238, 0.25) 0%, transparent 70%)",
            }}
          />
          {/* Cyan crystalline particles */}
          <div
            className="absolute top-[10%] left-[22%] w-2 h-2 bg-[#A5F3FC] rounded-full animate-pulse"
            style={{ animationDuration: "2.0s" }}
          />
          <div
            className="absolute top-[22%] left-[78%] w-2.5 h-2.5 bg-[#06B6D4] rounded-full animate-pulse"
            style={{ animationDuration: "2.9s", animationDelay: "0.6s" }}
          />
          <div
            className="absolute top-[36%] left-[45%] w-1.5 h-1.5 bg-[#22D3EE] rounded-full animate-pulse"
            style={{ animationDuration: "2.4s", animationDelay: "1.3s" }}
          />
          <div
            className="absolute top-[54%] left-[12%] w-2 h-2 bg-[#A5F3FC] rounded-full animate-pulse"
            style={{ animationDuration: "3.2s", animationDelay: "0.4s" }}
          />
          <div
            className="absolute top-[70%] left-[80%] w-2 h-2 bg-[#0891B2] rounded-full animate-pulse"
            style={{ animationDuration: "2.8s", animationDelay: "1.1s" }}
          />
          <div
            className="absolute top-[84%] left-[30%] w-1.5 h-1.5 bg-[#A5F3FC] rounded-full animate-pulse"
            style={{ animationDuration: "3.5s", animationDelay: "0.2s" }}
          />
        </div>
      )}

      {/* Neptune Theme: Royal Azure deep cosmic ocean abyss */}
      {activeTheme === "neptune" && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Bespoke deep cosmic ocean abyss overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 115%, rgba(37, 99, 235, 0.35) 0%, rgba(29, 78, 216, 0.15) 55%, transparent 80%)",
            }}
          />
          {/* Deep abyss vortex glow */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 65%)",
            }}
          />
          {/* Royal Azure ocean particles */}
          <div
            className="absolute top-[12%] left-[25%] w-2 h-2 bg-[#BFDBFE] rounded-full animate-pulse"
            style={{ animationDuration: "1.9s" }}
          />
          <div
            className="absolute top-[25%] left-[80%] w-2.5 h-2.5 bg-[#60A5FA] rounded-full animate-pulse"
            style={{ animationDuration: "2.7s", animationDelay: "0.5s" }}
          />
          <div
            className="absolute top-[40%] left-[20%] w-1.5 h-1.5 bg-[#93C5FD] rounded-full animate-pulse"
            style={{ animationDuration: "2.3s", animationDelay: "1.1s" }}
          />
          <div
            className="absolute top-[56%] left-[65%] w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"
            style={{ animationDuration: "3.1s", animationDelay: "0.7s" }}
          />
          <div
            className="absolute top-[74%] left-[32%] w-2 h-2 bg-[#BFDBFE] rounded-full animate-pulse"
            style={{ animationDuration: "2.5s", animationDelay: "1.6s" }}
          />
          <div
            className="absolute top-[86%] left-[72%] w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse"
            style={{ animationDuration: "3.3s", animationDelay: "0.3s" }}
          />
        </div>
      )}
    </div>
  );
}
