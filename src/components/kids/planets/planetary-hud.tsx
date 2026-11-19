'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import type { Planet, PlanetFeature } from '@/lib/kids/planets';

export interface PlanetaryHudProps {
  planet: Planet;
  activeFeature?: PlanetFeature;
  onSelectFeature: (feature: PlanetFeature, index: number) => void;
  onBackToOrbit: () => void;
  onLaunchMission: (feature: PlanetFeature) => void;
  className?: string;
}

/**
 * Glassmorphic Telemetry HUD overlay for 3D Planetary Cartography (D-01, D-03, D-04, D-06, D-15, THREE-03).
 *
 * Features:
 * - Return to Orbit navigation header with >=44x44px touch targets
 * - Celestial body & subject title telemetry badge
 * - Scrollable province sidebar with zero-region fallback, >=44px buttons, and active status
 * - Unclamped, scroll-safe telemetry card with 2x2 telemetry grid
 * - Explanatory status reason when a feature has no mission instead of dead button
 * - Full bilingual localization in Bahasa Melayu and English
 */
export function PlanetaryHud({
  planet,
  activeFeature,
  onSelectFeature,
  onBackToOrbit,
  onLaunchMission,
  className = '',
}: PlanetaryHudProps) {
  const t = useTranslations('kids.planets');
  const locale = useLocale();
  const isMs = locale === 'ms';

  const planetTitle = isMs ? planet.subjectTitleMs : planet.subjectTitle;
  const celestialName = isMs ? planet.celestialBodyMs : planet.celestialBody;
  const featureName = activeFeature ? (isMs ? activeFeature.nameMs : activeFeature.name) : '';
  const featureBadge = activeFeature ? (isMs ? activeFeature.badgeMs : activeFeature.badge) : '';
  const featureDesc = activeFeature ? (isMs ? activeFeature.descriptionMs : activeFeature.description) : '';
  const featureGeo = activeFeature ? (isMs ? activeFeature.geologicalProfileMs : activeFeature.geologicalProfile) : '';

  const lat = activeFeature?.coordinates?.lat ?? 0;
  const lon = activeFeature?.coordinates?.lon ?? 0;
  const coordDisplay = `${lat}°N, ${lon}°E`;
  const elevationDisplay = activeFeature?.coordinates?.elevation || '—';
  const hasMission = activeFeature ? activeFeature.hasMission !== false : false;

  return (
    <div
      data-testid="planetary-hud-root"
      className={`absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3 sm:p-5 pb-16 sm:pb-8 overflow-hidden ${className}`}
    >
      {/* Top Header */}
      <header className="flex justify-between items-center pointer-events-auto gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={onBackToOrbit}
          aria-label={t('backToOrbit')}
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-slate-900/90 backdrop-blur-xl border border-white/10 hover:border-cyan-400 text-xs font-mono text-cyan-300 transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer active:scale-95"
        >
          <span aria-hidden="true" className="text-sm leading-none">←</span>
          <span className="font-semibold">{t('backToOrbit')}</span>
        </button>

        <div className="flex items-center gap-2">
          {planet.id === 'earth-prompting' && (
            <Link
              href="/map"
              data-testid="hud-to-earth-map-btn"
              aria-label={isMs ? 'Ke Peta Bumi' : 'To Earth Map'}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] min-w-[44px] rounded-xl bg-emerald-950/85 border border-emerald-500/40 hover:border-emerald-400 text-xs font-mono text-emerald-300 transition-all shadow-lg hover:shadow-emerald-500/20 cursor-pointer active:scale-95"
            >
              <span aria-hidden="true" className="text-sm">🗺️</span>
              <span className="font-semibold hidden sm:inline">{isMs ? 'Ke Peta Bumi' : 'To Earth Map'}</span>
            </Link>
          )}

          <div className="px-3 sm:px-4 py-1.5 sm:py-2 min-h-[44px] rounded-xl bg-slate-900/90 backdrop-blur-xl border border-white/10 flex items-center gap-2 sm:gap-2.5 shadow-lg">
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: planet.accentColor }}
              aria-hidden="true"
            />
            <span className="text-[11px] sm:text-xs font-bold font-mono uppercase tracking-wider text-white">
              {celestialName}{" // "}{planetTitle}
            </span>
          </div>
        </div>
      </header>

      {/* Main Bottom Section: Province Sidebar & Selected Telemetry Card */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-end justify-between pointer-events-auto w-full min-h-0 max-h-[calc(100vh-160px)] sm:max-h-[calc(100vh-120px)]">
        {/* Province Sidebar (geological features) */}
        <div
          data-testid="province-sidebar"
          className="w-full md:w-80 min-h-0 max-h-40 sm:max-h-52 md:max-h-80 overflow-y-auto p-2 sm:p-2.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl space-y-1 sm:space-y-1.5 shrink-0"
        >
          <div className="px-2 py-1 flex items-center justify-between border-b border-white/10 mb-1">
            <h2 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              {t('regionChooserHeading')}
            </h2>
          </div>
          {planet.features.length === 0 ? (
            <div data-testid="empty-regions-notice" className="p-3 text-center">
              <p className="text-xs font-bold text-amber-300">{t('emptyRegionsHeading')}</p>
              <p className="text-[11px] text-slate-300 mt-1">{t('emptyRegionsBody')}</p>
            </div>
          ) : (
            planet.features.map((feat, idx) => {
              const isActive = activeFeature && feat.id === activeFeature.id;
              const featNum = String(feat.featureNumber).padStart(2, '0');
              const localizedFeatName = isMs ? feat.nameMs : feat.name;
              const badgeLabel = feat.isFinalBoss
                ? t('capstoneBadge')
                : t('yearBadge', { year: feat.year });

              return (
                <button
                  key={feat.id}
                  type="button"
                  onClick={() => onSelectFeature(feat, idx)}
                  data-testid={`feature-button-${feat.id}`}
                  aria-pressed={isActive}
                  className={`w-full min-h-[44px] text-left p-2 sm:p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 border cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-white/20 border-2 border-cyan-400 text-white font-semibold shadow-md ring-1 ring-cyan-400/40'
                      : 'bg-white/5 border border-transparent text-slate-300 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold shrink-0">
                      {featNum}
                    </span>
                    <span className="break-words font-medium">{localizedFeatName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isActive && (
                      <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-0.5 whitespace-nowrap">
                        ✓ {t('selectedMarker')}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap ${
                        feat.isFinalBoss
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {badgeLabel}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Selected Telemetry Card */}
        <div
          data-testid="telemetry-card"
          className="w-full md:max-w-lg min-h-0 max-h-56 sm:max-h-72 md:max-h-[380px] p-3 sm:p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl text-white flex flex-col justify-between overflow-hidden"
        >
          {planet.subjectId === 'astronomy' || planet.features.length === 0 ? (
            <div data-testid="coming-soon-card" className="p-4 text-center my-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold tracking-wide">
                <span>🚀</span>
                <span>{t('comingSoonTitle')}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {t('comingSoonDesc')}
              </p>
              {planet.primaryFact && (
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-left">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-cyan-300 block mb-0.5">
                    {t('comingSoonFactHeading')}
                  </span>
                  <p className="text-[11px] sm:text-xs text-slate-300 italic leading-relaxed">
                    &ldquo;{isMs ? planet.primaryFactMs : planet.primaryFact}&rdquo;
                  </p>
                </div>
              )}
            </div>
          ) : planet.features.length === 0 || !activeFeature ? (
            <div data-testid="empty-feature-card" className="p-4 text-center my-auto">
              <h2 className="text-sm sm:text-base font-bold text-amber-300">
                {t('emptyRegionsHeading')}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {t('emptyRegionsBody')}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-y-auto pr-1 space-y-2 sm:space-y-2.5 min-h-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold tracking-wide text-white break-words">
                      {featureName}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-cyan-300 font-mono mt-0.5 break-words">
                      {featureBadge}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0 whitespace-nowrap ${
                      activeFeature.isFinalBoss
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 font-bold'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                    }`}
                  >
                    {activeFeature.isFinalBoss
                      ? t('capstoneBadge')
                      : t('yearBadge', { year: activeFeature.year })}
                  </span>
                </div>

                {/* 2x2 Telemetry Grid (unclamped) */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono bg-white/5 p-2 rounded-xl border border-white/10">
                  <div>
                    <span className="text-slate-400 block text-[8px] sm:text-[9px] uppercase tracking-wider">
                      {t('telemetry.coordinates')}
                    </span>
                    <span className="text-slate-200 font-medium">
                      {coordDisplay}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] sm:text-[9px] uppercase tracking-wider">
                      {t('telemetry.elevation')}
                    </span>
                    <span className="text-slate-200 font-medium break-words block">
                      {elevationDisplay}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] sm:text-[9px] uppercase tracking-wider">
                      {t('telemetry.geology')}
                    </span>
                    <span className="text-slate-200 break-words block">
                      {featureGeo}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[8px] sm:text-[9px] uppercase tracking-wider">
                      {t('telemetry.objective')}
                    </span>
                    <span className="text-slate-200 break-words block">
                      {featureBadge}
                    </span>
                  </div>
                </div>

                {/* Description Paragraph (unclamped) */}
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-light break-words">
                  {featureDesc}
                </p>
              </div>

              {/* Start Mission Action or Missing Mission Reason */}
              {hasMission ? (
                <button
                  type="button"
                  onClick={() => onLaunchMission(activeFeature)}
                  className="w-full min-h-[44px] mt-2 py-2 sm:py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 transition-all shadow-lg hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] shrink-0"
                  style={{ backgroundColor: activeFeature.accentColor || planet.accentColor }}
                >
                  <span aria-hidden="true">🚀</span>
                  <span>{t('launchMission')}</span>
                </button>
              ) : (
                <div
                  data-testid="no-mission-reason"
                  role="status"
                  className="w-full min-h-[44px] mt-2 py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs text-center font-mono flex items-center justify-center gap-2 shrink-0"
                >
                  <span aria-hidden="true">ℹ️</span>
                  <span>{t('noMissionReason')}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
