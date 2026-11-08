"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PixelRocket } from "./pixel-art";

export interface RocketLaunchOverlayProps {
  isOpen: boolean;
  onClose?: () => void;
  destination?: string;
  autoRedirect?: boolean;
}

export function RocketLaunchOverlay({
  isOpen,
  onClose,
  destination = "/planets",
  autoRedirect = true,
}: RocketLaunchOverlayProps) {
  const router = useRouter();
  const t = useTranslations("kids");

  // Countdown state: 3, 2, 1, 0 (BLAST OFF!)
  const [countdown, setCountdown] = useState(3);
  const [isBlastingOff, setIsBlastingOff] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      setIsBlastingOff(false);
      return;
    }

    if (countdown === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsBlastingOff(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [isOpen, countdown]);

  useEffect(() => {
    if (!isOpen || !isBlastingOff) return;

    const navTimer = setTimeout(() => {
      if (autoRedirect) {
        router.push(destination);
      }
    }, 1000);

    return () => clearTimeout(navTimer);
  }, [isOpen, isBlastingOff, autoRedirect, destination, router]);

  if (!isOpen) return null;

  const handleSkip = () => {
    onClose?.();
    router.push(destination);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Rocket Launch Sequence"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-[#0B0F19] text-white overflow-hidden select-none"
    >
      {/* Retro Starfield Background */}
      <div className="absolute inset-0 pointer-events-none opacity-80" aria-hidden="true">
        {/* Pixel Stars */}
        <div className="absolute top-[12%] left-[18%] w-1.5 h-1.5 bg-yellow-200 animate-pulse" />
        <div className="absolute top-[28%] left-[82%] w-2 h-2 bg-white animate-pulse" />
        <div className="absolute top-[45%] left-[10%] w-1.5 h-1.5 bg-cyan-200 animate-pulse" />
        <div className="absolute top-[68%] left-[75%] w-2 h-2 bg-yellow-300 animate-pulse" />
        <div className="absolute top-[22%] left-[60%] w-1 h-1 bg-white" />
        <div className="absolute top-[80%] left-[30%] w-1.5 h-1.5 bg-cyan-300 animate-pulse" />
        <div className="absolute top-[15%] left-[40%] w-2 h-2 bg-purple-300 animate-pulse" />
        <div className="absolute top-[55%] left-[90%] w-1 h-1 bg-white" />
      </div>

      {/* Top Banner & Destination Header */}
      <div className="relative z-10 text-center mt-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-wider text-yellow-400 pixel-text-shadow">
          {t("rocketLaunch.heading")}
        </h2>
        <p className="text-base sm:text-lg text-slate-300 mt-2 max-w-md mx-auto">
          {t("rocketLaunch.subheading")}
        </p>
      </div>

      {/* Centerpiece: Rocket & Thrusters & Plume */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        {/* Countdown display */}
        <div className="mb-6 h-16 flex items-center justify-center">
          {countdown > 0 ? (
            <div
              key={countdown}
              data-testid="rocket-countdown"
              className="text-6xl sm:text-7xl font-extrabold text-white pixel-text-shadow tracking-widest animate-bounce"
            >
              {typeof t("rocketLaunch.countdown", { count: countdown }) === "string" &&
              t("rocketLaunch.countdown", { count: countdown }) !== "rocketLaunch.countdown"
                ? t("rocketLaunch.countdown", { count: countdown })
                : `${countdown}...`}
            </div>
          ) : (
            <div
              data-testid="rocket-blastoff"
              className="text-5xl sm:text-6xl font-extrabold text-emerald-400 pixel-text-shadow tracking-wider animate-pulse"
            >
              {t("rocketLaunch.blastOff") !== "rocketLaunch.blastOff"
                ? t("rocketLaunch.blastOff")
                : "BLAST OFF!"}
            </div>
          )}
        </div>

        {/* Rocket Sprite */}
        <div
          className={`relative transition-transform duration-1000 ${
            isBlastingOff ? "animate-rocket-liftoff" : "animate-bounce"
          }`}
        >
          <PixelRocket className="w-24 h-36 sm:w-32 sm:h-48" thrusting={true} />

          {/* Launch smoke puffs */}
          {isBlastingOff && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-slate-300 opacity-70 animate-ping" />
              <div className="w-12 h-12 rounded-full bg-slate-100 opacity-80 animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-slate-400 opacity-60 animate-ping" />
            </div>
          )}
        </div>
      </div>

      {/* Footer controls: Skip button */}
      <div className="relative z-10 mb-4">
        <button
          type="button"
          onClick={handleSkip}
          className="pixel-btn pixel-btn-amber px-6 py-2.5 text-base sm:text-lg font-bold"
        >
          {t("rocketLaunch.skip")}
        </button>
      </div>
    </div>
  );
}
