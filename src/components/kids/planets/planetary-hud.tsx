'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import type { Planet, PlanetFeature } from '@/lib/kids/planets';

export interface PlanetaryHudProps {
  planet: Planet;
  activeFeature: PlanetFeature;
  onSelectFeature: (feature: PlanetFeature, index: number) => void;
  onBackToOrbit: () => void;
  onLaunchMission: (feature: PlanetFeature) => void;
  className?: string;
}

/**
 * Glassmorphic Telemetry HUD overlay for 3D Planetary Cartography (D-01, D-03, THREE-03).
 *
 * Features:
 * - Return to Orbit navigation header
 * - Celestial body & subject title telemetry badge
 * - 7-province scrollable sidebar with Tahun 1-6 and Capstone Boss badges
 * - Rich 2x2 telemetry grid (coordinates, elevation, geology, learning objective)
 * - Full bilingual localization in Bahasa Melayu and English
 * - High-contrast mission launch action button
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
  const featureName = isMs ? activeFeature.nameMs : activeFeature.name;
  const featureBadge = isMs ? activeFeature.badgeMs : activeFeature.badge;
  const featureDesc = isMs ? activeFeature.descriptionMs : activeFeature.description;
  const featureGeo = isMs ? activeFeature.geologicalProfileMs : activeFeature.geologicalProfile;

  const lat = activeFeature.coordinates.lat;
  const lon = activeFeature.coordinates.lon;
  const coordDisplay = `${lat}°N, ${lon}°E`;
  const elevationDisplay = activeFeature.coordinates.elevation || '—';

  return (
    <div
      data-testid="planetary-hud-root"
      className={`absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 sm:p-6 overflow-hidden ${className}`}
    >
      {/* Top Header */}
      <header className="flex justify-between items-center pointer-events-auto gap-3">
        <button
          type="button"
          onClick={onBackToOrbit}
          aria-label={t('backToOrbit')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/85 backdrop-blur-xl border border-white/10 hover:border-cyan-400 text-xs font-mono text-cyan-300 transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer active:scale-95"
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 hover:border-emerald-400 text-xs font-mono text-emerald-300 transition-all shadow-lg hover:shadow-emerald-500/20 cursor-pointer active:scale-95"
            >
              <span aria-hidden="true" className="text-sm">🗺️</span>
              <span className="font-semibold hidden sm:inline">{isMs ? 'Ke Peta Bumi' : 'To Earth Map'}</span>
            </Link>
          )}

          <div className="px-4 py-2 rounded-xl bg-slate-900/85 backdrop-blur-xl border border-white/10 flex items-center gap-2.5 shadow-lg">
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: planet.accentColor }}
              aria-hidden="true"
            />
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-white">
              {celestialName}{" // "}{planetTitle}
            </span>
          </div>
        </div>
      </header>

      {/* Main Bottom Section: Province Sidebar & Selected Telemetry Card */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end justify-between pointer-events-auto w-full max-h-[75vh] md:max-h-none overflow-y-auto md:overflow-visible">
        {/* Province Sidebar (7 geological features) */}
        <div
          data-testid="province-sidebar"
          className="w-full md:w-80 max-h-48 md:max-h-80 overflow-y-auto p-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/10 shadow-2xl space-y-1.5"
        >
          {planet.features.map((feat, idx) => {
            const isActive = feat.id === activeFeature.id;
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
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 border cursor-pointer ${
                  isActive
                    ? 'bg-white/15 border-cyan-400 text-white font-semibold shadow-md ring-1 ring-cyan-400/40'
                    : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold shrink-0">
                    {featNum}
                  </span>
                  <span className="truncate">{localizedFeatName}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 ${
                    feat.isFinalBoss
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {badgeLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Telemetry Card */}
        <div
          data-testid="telemetry-card"
          className="w-full md:max-w-lg p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/15 shadow-2xl text-white space-y-3.5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold tracking-wide text-white">
                {featureName}
              </h2>
              <p className="text-xs text-cyan-300 font-mono mt-0.5">
                {featureBadge}
              </p>
            </div>
            <span
              className={`text-[10px] font-mono px-2.5 py-1 rounded-full shrink-0 ${
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

          {/* 2x2 Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-[11px] font-mono bg-white/5 p-3 rounded-xl border border-white/10">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider">
                {t('telemetry.coordinates')}
              </span>
              <span className="text-slate-200 font-medium">
                {coordDisplay}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider">
                {t('telemetry.elevation')}
              </span>
              <span className="text-slate-200 font-medium truncate block">
                {elevationDisplay}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider">
                {t('telemetry.geology')}
              </span>
              <span className="text-slate-200 line-clamp-2">
                {featureGeo}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider">
                {t('telemetry.objective')}
              </span>
              <span className="text-slate-200 line-clamp-2">
                {featureBadge}
              </span>
            </div>
          </div>

          {/* Description Paragraph */}
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            {featureDesc}
          </p>

          {/* Start Mission Action Button */}
          <button
            type="button"
            onClick={() => onLaunchMission(activeFeature)}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 transition-all shadow-lg hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            style={{ backgroundColor: activeFeature.accentColor || planet.accentColor }}
          >
            <span aria-hidden="true">🚀</span>
            <span>{t('launchMission')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
