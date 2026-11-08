'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  PLANET_WORLDS,
  getPlanetWorld,
  type Planet,
  type PlanetId,
  type PlanetFeature,
} from '@/lib/kids/planets';
import type { ExplorerMode } from './planetary-types';
import { PlanetaryCanvas } from './planetary-canvas';
import { PlanetaryHud } from './planetary-hud';
import { buildSolarSystemScene, type SolarSystemSceneResult } from './solar-system-scene';
import {
  buildPlanetCartographyScene,
  type PlanetCartographyScene,
} from './planet-cartography-scene';
import {
  setupDragFilter,
  raycastSolarSystem,
} from './planetary-interaction';

export interface PlanetaryExplorerProps {
  initialMode?: ExplorerMode;
  initialPlanetId?: PlanetId | null;
  initialFeatureIndex?: number;
  onLaunchMission?: (planet: Planet, feature: PlanetFeature) => void;
  className?: string;
}

/**
 * Root Planetary Explorer Orchestrator Component (D-01, D-03, D-04).
 *
 * Coordinates:
 * - Solar System Overview mode with central Sun, revolving planet orbits, and planet selector bar
 * - Deep Planet Cartography mode with 3D spherical cartography, boundary rings, and glassmorphic HUD
 * - Smooth two-level navigation flow (Solar System ↔ Planet Cartography)
 * - Symmetrical dual hotspot selection (3D pin mesh raycasting + HUD sidebar buttons)
 * - Rigorous SSR hydration guard and WebGL disposal cleanup between scene transitions
 */
export function PlanetaryExplorer({
  initialMode = 'solar-system',
  initialPlanetId = null,
  initialFeatureIndex = 0,
  onLaunchMission,
  className = '',
}: PlanetaryExplorerProps) {
  const t = useTranslations('kids.planets');
  const locale = useLocale();
  const isMs = locale === 'ms';

  // Navigation and selection state
  const [mode, setMode] = useState<ExplorerMode>(initialMode);
  const [activePlanetId, setActivePlanetId] = useState<PlanetId | null>(initialPlanetId);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(initialFeatureIndex);

  // SSR-safe client mount guard per D-04
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // 3D scene instance references
  const solarSystemRef = useRef<SolarSystemSceneResult | null>(null);
  const cartographyRef = useRef<PlanetCartographyScene | null>(null);
  const elapsedTimeRef = useRef<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Resolve active planet world object
  const activePlanet: Planet =
    (activePlanetId ? getPlanetWorld(activePlanetId) : undefined) || PLANET_WORLDS[0];

  const activeFeature: PlanetFeature =
    activePlanet.features[activeFeatureIndex] || activePlanet.features[0];

  // Transition from Solar System into Planet Cartography
  const handleSelectPlanet = useCallback((planetId: PlanetId) => {
    setActivePlanetId(planetId);
    setActiveFeatureIndex(0);
    setMode('planet-cartography');
  }, []);

  // Return to Solar System Overview mode (D-01)
  const handleBackToOrbit = useCallback(() => {
    setMode('solar-system');
    setActivePlanetId(null);
    setActiveFeatureIndex(0);
  }, []);

  // Symmetrical dual feature selection (HUD sidebar or 3D pin raycast) (D-03)
  const handleSelectFeature = useCallback((feature: PlanetFeature, index: number) => {
    setActiveFeatureIndex(index);
    cartographyRef.current?.focusFeature(index);
  }, []);

  // Launch mission callback bridge
  const handleLaunchMission = useCallback(
    (feature: PlanetFeature) => {
      if (onLaunchMission) {
        onLaunchMission(activePlanet, feature);
      } else {
        // Fallback default: log or emit event for downstream Phase 11 gameplay
        if (typeof window !== 'undefined') {
          console.info(`[PlanetaryExplorer] Launch mission: ${activePlanet.id} / ${feature.id}`);
        }
      }
    },
    [activePlanet, onLaunchMission]
  );

  // SSR hydration fallback: render dark placeholder without executing Three.js or DOM refs
  if (!isMounted) {
    return (
      <div
        data-testid="planetary-explorer-loading"
        className={`relative w-full h-full bg-slate-950 flex items-center justify-center ${className}`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-cyan-300">
            {isMs ? 'Memuatkan Sistem Suria...' : 'Loading Solar System...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="planetary-explorer-root"
      className={`relative w-full h-full overflow-hidden bg-slate-950 ${className}`}
    >
      {mode === 'solar-system' ? (
        <PlanetaryCanvas
          key="solar-system-canvas"
          mode="solar-system"
          onInit={(ctx) => {
            // Set cinematic perspective for solar system overview
            ctx.camera.position.set(0, 22, 32);
            ctx.camera.lookAt(0, 0, 0);
            ctx.controls.target.set(0, 0, 0);
            ctx.controls.maxDistance = 65;
            ctx.controls.minDistance = 8;
            ctx.controls.update();

            const solarSystem = buildSolarSystemScene();
            ctx.scene.add(solarSystem.scene);
            solarSystemRef.current = solarSystem;

            // Setup pointer click filter for raycast selection
            const cleanupDrag = setupDragFilter(ctx.container, (e) => {
              if ((e.target as HTMLElement)?.tagName !== 'CANVAS') return;
              const hitPlanetId = raycastSolarSystem(
                e,
                ctx.camera,
                solarSystem.planetMeshes,
                ctx.container
              );
              if (hitPlanetId) {
                handleSelectPlanet(hitPlanetId as PlanetId);
              }
            });

            return () => {
              cleanupDrag();
              solarSystemRef.current = null;
              solarSystem.dispose();
              ctx.scene.remove(solarSystem.scene);
            };
          }}
          onRenderFrame={(_ctx, delta) => {
            solarSystemRef.current?.updateOrbits(delta);
          }}
          className="w-full h-full"
        >
          {/* Top Left Navigation Link to World Map */}
          <div className="absolute top-4 left-4 z-20 pointer-events-auto">
            <Link
              href="/map"
              data-testid="back-to-map-link"
              aria-label={isMs ? 'Kembali ke Peta Dunia' : 'Return to World Map'}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/85 backdrop-blur-xl border border-white/10 hover:border-cyan-400 text-xs font-mono text-cyan-300 transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer active:scale-95"
            >
              <span aria-hidden="true" className="text-sm leading-none">←</span>
              <span className="font-semibold">{isMs ? 'Peta Dunia' : 'World Map'}</span>
            </Link>
          </div>

          {/* Top Center Glassmorphic Header Banner */}
          <header
            data-testid="solar-system-header"
            className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-auto px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/10 shadow-2xl max-w-[90vw] sm:max-w-md mx-auto"
          >
            <h1 className="text-base sm:text-lg font-bold tracking-wide text-white">
              {t('title')}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 font-light">
              {t('subtitle')}
            </p>
          </header>

          {/* Bottom Quick-Switch Planet Selector Bar */}
          <nav
            data-testid="planet-selector-bar"
            aria-label={t('hubTitle')}
            className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto max-w-[96vw]"
          >
            {PLANET_WORLDS.map((planet) => {
              const displayName = isMs ? planet.celestialBodyMs : planet.celestialBody;
              const subjectName = isMs ? planet.subjectTitleMs : planet.subjectTitle;
              const accent = planet.accentColor || planet.themeColor;

              return (
                <button
                  key={planet.id}
                  type="button"
                  onClick={() => handleSelectPlanet(planet.id)}
                  data-testid={`planet-pill-${planet.id}`}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 border bg-white/5 border-white/10 text-slate-200 hover:bg-white/15 hover:border-cyan-400 hover:text-white cursor-pointer active:scale-95 shadow-md"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: accent }}
                    aria-hidden="true"
                  />
                  <span className="font-semibold">{displayName}</span>
                  <span className="hidden sm:inline text-[10px] text-slate-400 font-mono">
                    ({subjectName})
                  </span>
                </button>
              );
            })}
          </nav>
        </PlanetaryCanvas>
      ) : (
        <PlanetaryCanvas
          key={`cartography-canvas-${activePlanet.id}`}
          mode="planet-cartography"
          planetId={activePlanet.id}
          onInit={(ctx) => {
            // Position camera for globe inspection
            ctx.camera.position.set(0, 0, 16);
            ctx.camera.lookAt(0, 0, 0);
            ctx.controls.target.set(0, 0, 0);
            ctx.controls.maxDistance = 28;
            ctx.controls.minDistance = 6.5;
            ctx.controls.update();

            const cartography = buildPlanetCartographyScene(activePlanet, ctx.camera, ctx.controls);
            ctx.scene.add(cartography.scene);
            cartographyRef.current = cartography;

            // Automatically glide camera to selected initial feature (D-01)
            cartography.focusFeature(activeFeatureIndex);

            // Setup pointer click filter for 3D pin selection
            const cleanupDrag = setupDragFilter(ctx.container, (e) => {
              if ((e.target as HTMLElement)?.tagName !== 'CANVAS') return;
              const hitIndex = cartography.raycastFeaturePins(e, ctx.container);
              if (hitIndex !== null && hitIndex >= 0 && hitIndex < activePlanet.features.length) {
                handleSelectFeature(activePlanet.features[hitIndex], hitIndex);
              }
            });

            return () => {
              cleanupDrag();
              cartographyRef.current = null;
              cartography.dispose();
              ctx.scene.remove(cartography.scene);
            };
          }}
          onRenderFrame={(_ctx, delta) => {
            elapsedTimeRef.current += delta;
            cartographyRef.current?.updateScene(delta, elapsedTimeRef.current);
          }}
          className="w-full h-full"
        >
          {/* Glassmorphic Telemetry HUD Overlay */}
          <PlanetaryHud
            planet={activePlanet}
            activeFeature={activeFeature}
            onSelectFeature={handleSelectFeature}
            onBackToOrbit={handleBackToOrbit}
            onLaunchMission={handleLaunchMission}
          />
        </PlanetaryCanvas>
      )}
    </div>
  );
}

export default PlanetaryExplorer;
