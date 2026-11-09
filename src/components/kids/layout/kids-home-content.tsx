"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { analyticsKids } from "@/lib/analytics";
import { PixelRobot, PixelStar, PixelRocket } from "@/components/kids/elements/pixel-art";

export function KidsHomeContent() {
  const t = useTranslations("kids");
  const [step, setStep] = useState(0);
  const totalSteps = 2;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="h-full flex flex-col">
      {/* Main content area */}
      <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center p-4">
        <div className="w-full max-w-2xl my-auto">
          {/* Step 0: Welcome + Learning Promise (D-03, D-04) */}
          {step === 0 && (
            <div className="text-center animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffffff] border-2 border-[#DAA520] pixel-border-sm text-[#8B4513] text-lg mb-4">
                <PixelStar filled className="w-4 h-4" />
                {t("home.badge")}
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-[#2C1810] pixel-text-shadow">
                {t("home.title")}
              </h1>

              {/* Learning Promise */}
              <p className="text-2xl md:text-3xl font-bold text-[#16A34A] mb-6">
                {t("home.promise")}
              </p>

              <div className="pixel-panel p-4 md:p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                  <div className="shrink-0">
                    <PixelRobot className="w-16 h-20" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-2xl md:text-3xl font-bold text-[#2C1810] mb-2">
                      {t("home.peromfuIntro.greeting")}
                    </p>
                    <p className="text-xl md:text-2xl text-[#5D4037]">
                      {t("home.peromfuIntro.message")}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-base md:text-lg text-[#8B7355]">
                {t("home.ageNote")}
              </p>
            </div>
          )}

          {/* Step 1: Destination Choices (D-01, D-02) */}
          {step === 1 && (
            <div className="text-center animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2C1810] pixel-text-shadow">
                {t("home.readyTitle")}
              </h2>

              <p className="text-xl md:text-2xl text-[#5D4037] mb-8">
                {t("home.readyMessage")}
              </p>

              {/* Dual entry cards per D-01, D-02: Equal weight, direct action labels, concise explanations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto mb-6">
                {/* Earth: Foundational Prompting */}
                <Link
                  href="/map"
                  onClick={() => analyticsKids.startGame()}
                  className="pixel-panel pixel-panel-green p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ffffff] border-2 border-[#16A34A] pixel-border-sm text-[#16A34A] font-bold text-xs uppercase tracking-wide">
                        <PixelStar filled className="w-3.5 h-3.5" />
                        {t("home.earthFoundationalBadge")}
                      </span>
                      <PixelPlayIcon className="w-5 h-5 text-[#16A34A] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="font-bold text-2xl text-[#2C1810] mb-2">
                      {t("home.earthAction")}
                    </h3>
                    <p className="text-base text-[#5D4037] leading-relaxed">
                      {t("home.earthExplanation")}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t-2 border-[#16A34A]/20 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#16A34A] uppercase">
                      {t("home.earthAction")}
                    </span>
                    <span className="text-xs text-[#5D4037] font-semibold">5 Worlds</span>
                  </div>
                </Link>

                {/* Solar System: 3D Subject Explorations */}
                <Link
                  href="/planets"
                  onClick={() => analyticsKids.exploreSolarSystem()}
                  className="pixel-panel pixel-panel-blue p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ffffff] border-2 border-[#2563EB] pixel-border-sm text-[#2563EB] font-bold text-xs uppercase tracking-wide">
                        <PixelStar filled className="w-3.5 h-3.5" />
                        {t("home.cosmosBadge")}
                      </span>
                      <PixelRocket className="w-4 h-6 text-[#2563EB] group-hover:-translate-y-1 transition-transform" />
                    </div>
                    <h3 className="font-bold text-2xl text-[#2C1810] mb-2">
                      {t("home.planetsAction")}
                    </h3>
                    <p className="text-base text-[#5D4037] leading-relaxed">
                      {t("home.planetsExplanation")}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t-2 border-[#2563EB]/20 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#2563EB] uppercase">
                      {t("home.planetsAction")}
                    </span>
                    <span className="text-xs text-[#5D4037] font-semibold">5 Planets</span>
                  </div>
                </Link>
              </div>

              <p className="mt-4 text-base text-[#8B7355]">
                {t("home.ageNote")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation footer - pixel art style */}
      <div className="shrink-0 bg-[#2C1810] border-t-4 border-[#8B4513]">
        <div className="container py-3 flex flex-col gap-3 sm:gap-0">
          <div className="flex items-center justify-between">
            {/* Back button (absent/disabled on step 0 without layout shift) */}
            {step > 0 ? (
              <button
                onClick={prevStep}
                className="pixel-btn px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg"
              >
                <span className="flex items-center gap-1">
                  <PixelArrowLeft />
                  {t("navigation.back")}
                </span>
              </button>
            ) : (
              <div className="w-[100px] sm:w-[120px]" aria-hidden="true" />
            )}

            {/* Visible localized step indicator per D-05 & UI-SPEC */}
            <div className="text-center font-bold text-base sm:text-lg text-[#FEF3C7] pixel-text-shadow">
              {step === 0 ? t("home.step1Of2") : t("home.step2Of2")}
            </div>

            {/* Next button on step 0 only; on step 1 child directly chooses one of the two destination cards */}
            {step < totalSteps - 1 ? (
              <button
                onClick={nextStep}
                className="pixel-btn pixel-btn-green px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg"
              >
                <span className="flex items-center gap-1">
                  {t("navigation.next")}
                  <PixelArrowRight />
                </span>
              </button>
            ) : (
              <div className="w-[100px] sm:w-[120px]" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Pixel art icons
function PixelPlayIcon({ className }: { className?: string } = {}) {
  return (
    <svg viewBox="0 0 12 12" className={cn("w-4 h-4", className)} style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="1" width="2" height="10" fill="currentColor" />
      <rect x="4" y="3" width="2" height="6" fill="currentColor" />
      <rect x="6" y="4" width="2" height="4" fill="currentColor" />
      <rect x="8" y="5" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

function PixelArrowLeft() {
  return (
    <svg viewBox="0 0 12 12" className="w-4 h-4" style={{ imageRendering: "pixelated" }}>
      <rect x="4" y="5" width="6" height="2" fill="currentColor" />
      <rect x="2" y="5" width="2" height="2" fill="currentColor" />
      <rect x="4" y="3" width="2" height="2" fill="currentColor" />
      <rect x="4" y="7" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

function PixelArrowRight() {
  return (
    <svg viewBox="0 0 12 12" className="w-4 h-4" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="5" width="6" height="2" fill="currentColor" />
      <rect x="8" y="5" width="2" height="2" fill="currentColor" />
      <rect x="6" y="3" width="2" height="2" fill="currentColor" />
      <rect x="6" y="7" width="2" height="2" fill="currentColor" />
    </svg>
  );
}
