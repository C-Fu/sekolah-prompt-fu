"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { getTotalStars, getCompletedLevelsCount } from "@/lib/kids/progress";
import { getTotalLevels, getLevelBySlug } from "@/lib/kids/levels";
import { PixelStar, PixelRobot, PixelRocket } from "@/components/kids/elements/pixel-art";
import { MusicButton } from "./background-music";
import { SettingsButton } from "./settings-modal";
import { LanguageToggle } from "./language-toggle";
import { useLevelSlug } from "@/components/kids/providers/level-context";

export function KidsHeader() {
  const t = useTranslations("kids");
  const [stars, setStars] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const total = getTotalLevels();
  
  // Get current level from context (will be empty if not in a level)
  const levelSlug = useLevelSlug();
  const currentLevel = levelSlug ? getLevelBySlug(levelSlug) : null;
  const levelNumber = currentLevel ? `${currentLevel.world}.${currentLevel.levelNumber}` : null;

  useEffect(() => {
    try {
      setStars(getTotalStars());
      setCompleted(getCompletedLevelsCount());
    } catch {
      setStars(0);
      setCompleted(0);
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Keyboard navigation: Escape key dismisses mobile menu and restores focus (D-13)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    if (menuOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="shrink-0 z-50 w-full bg-[#2C1810] border-b-4 border-[#8B4513]">
      <div className="container flex min-h-[56px] items-center justify-between px-2 sm:px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 min-h-[44px] min-w-[44px] shrink-0">
          <PixelRobot className="w-8 h-10 animate-peromfu-idle" />
          <span className="text-[#FFD700] font-bold text-2xl pixel-text-shadow hidden md:block">
            {t("header.title")}
          </span>
        </Link>

        {/* Stats & Nav */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Current level indicator */}
          {levelNumber && (
            <div className="hidden md:flex items-center gap-1 px-3 h-8 bg-[#FFD700] border-2 border-[#DAA520] pixel-border-sm">
              <span className="text-[#8B4513] text-sm font-bold">
                {t("level.levelLabel", { number: levelNumber })}
              </span>
            </div>
          )}

          {/* Stars counter */}
          <div className="flex items-center gap-1 px-2 sm:px-3 h-8 bg-[#4A3728] border-2 border-[#8B4513] pixel-border-sm">
            <PixelStar filled className="w-4 h-4" />
            <span className="text-white text-sm">{stars}</span>
          </div>

          {/* Progress (3/23) - visible on mobile and desktop */}
          <div className="flex items-center gap-1 px-2 sm:px-3 h-8 bg-[#4A3728] border-2 border-[#8B4513] pixel-border-sm">
            <span className="text-[#22C55E] text-xs sm:text-sm font-mono font-bold">{completed}/{total}</span>
          </div>

          {/* Language Toggle - visible on mobile and desktop */}
          <div className="flex items-center">
            <LanguageToggle />
          </div>

          {/* Nav buttons - desktop: visible BM/EN text alongside familiar icons (D-06, no duplicate Home) */}
          <div className="hidden lg:flex items-center gap-2">
            <MusicButton />
            <SettingsButton />
            <Link 
              href="/" 
              className="pixel-btn px-3 py-1.5 text-sm min-h-[44px] flex items-center gap-1.5"
            >
              <PixelHomeIcon />
              <span>{t("header.home")}</span>
            </Link>
            <Link 
              href="/map" 
              className="pixel-btn pixel-btn-green px-3 py-1.5 text-sm min-h-[44px] flex items-center gap-1.5"
            >
              <PixelMapIcon />
              <span>{t("header.map")}</span>
            </Link>
            <Link 
              href="/planets" 
              className="pixel-btn pixel-btn-blue px-3 py-1.5 text-sm min-h-[44px] flex items-center gap-1.5"
              title={t("header.planets")}
              aria-label={t("header.planets")}
            >
              <PixelRocket className="w-4 h-4" />
              <span>{t("header.planets")}</span>
            </Link>
          </div>

          {/* Mobile menu button with localized accessible name and min 44px hitbox */}
          <div className="lg:hidden relative" ref={menuRef}>
            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="pixel-btn px-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={menuOpen ? t("header.closeMenu") : t("header.openMenu")}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <PixelMenuIcon />
            </button>

            {/* Mobile dropdown menu: visible labels and no duplicate Home link */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#2C1810] border-4 border-[#8B4513] rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 flex flex-col gap-2">
                  {/* Progress - mobile only */}
                  <div className="flex items-center justify-center gap-1 px-3 py-2 bg-[#4A3728] border-2 border-[#8B4513] pixel-border-sm">
                    <span className="text-[#22C55E] text-sm">{completed}/{total}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <LanguageToggle />
                    <MusicButton />
                    <SettingsButton />
                  </div>
                  
                  <Link 
                    href="/" 
                    className="pixel-btn px-3 py-2 text-sm min-h-[44px] flex items-center justify-center gap-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <PixelHomeIcon />
                    <span>{t("header.home")}</span>
                  </Link>
                  <Link 
                    href="/map" 
                    className="pixel-btn pixel-btn-green px-3 py-2 text-sm min-h-[44px] flex items-center justify-center gap-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <PixelMapIcon />
                    <span>{t("header.map")}</span>
                  </Link>
                  <Link 
                    href="/planets" 
                    className="pixel-btn pixel-btn-blue px-3 py-2 text-sm min-h-[44px] flex items-center justify-center gap-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <PixelRocket className="w-4 h-4" />
                    <span>{t("header.planets")}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Pixel art home icon
function PixelHomeIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" style={{ imageRendering: "pixelated" }}>
      <rect x="7" y="1" width="2" height="2" fill="currentColor" />
      <rect x="5" y="3" width="6" height="2" fill="currentColor" />
      <rect x="3" y="5" width="10" height="2" fill="currentColor" />
      <rect x="2" y="7" width="12" height="2" fill="currentColor" />
      <rect x="3" y="9" width="10" height="6" fill="currentColor" />
      <rect x="6" y="11" width="4" height="4" fill="#2C1810" />
    </svg>
  );
}

// Pixel art pin/location icon
function PixelMapIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" style={{ imageRendering: "pixelated" }}>
      {/* Pin head - circle */}
      <rect x="5" y="1" width="6" height="2" fill="currentColor" />
      <rect x="4" y="2" width="8" height="2" fill="currentColor" />
      <rect x="3" y="3" width="10" height="4" fill="currentColor" />
      <rect x="4" y="7" width="8" height="2" fill="currentColor" />
      <rect x="5" y="9" width="6" height="2" fill="currentColor" />
      {/* Pin point */}
      <rect x="6" y="11" width="4" height="2" fill="currentColor" />
      <rect x="7" y="13" width="2" height="2" fill="currentColor" />
      {/* Inner highlight */}
      <rect x="5" y="4" width="2" height="2" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

// Pixel art hamburger menu icon
function PixelMenuIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-5 h-5" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="3" width="12" height="2" fill="currentColor" />
      <rect x="2" y="7" width="12" height="2" fill="currentColor" />
      <rect x="2" y="11" width="12" height="2" fill="currentColor" />
    </svg>
  );
}
