import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import enMessages from '@/../messages/en.json';
import msMessages from '@/../messages/ms.json';
import { PLANET_WORLDS, type Planet, type PlanetFeature } from '@/lib/kids/planets';

// Dynamic locale mock supporting 'en' and 'ms'
const intlState = vi.hoisted(() => ({
  locale: 'en',
}));

vi.mock('next-intl', () => {
  return {
    useLocale: () => intlState.locale,
    useTranslations: (namespace?: string) => {
      const messages = (intlState.locale === 'ms' ? msMessages : enMessages) as Record<string, unknown>;
      return (key: string, values?: Record<string, unknown>) => {
        const fullKey = namespace ? `${namespace}.${key}` : key;
        const keys = fullKey.split('.');
        let val: unknown = messages;
        for (const k of keys) {
          if (val && typeof val === 'object') {
            val = (val as Record<string, unknown>)[k];
          } else {
            val = undefined;
            break;
          }
        }
        if (typeof val === 'string') {
          if (values) {
            return Object.entries(values).reduce(
              (acc, [vKey, vVal]) => acc.replace(`{${vKey}}`, String(vVal)),
              val
            );
          }
          return val;
        }
        return key;
      };
    },
  };
});

import { PlanetaryHud } from '@/components/kids/planets/planetary-hud';

describe('PlanetaryHud Component (THREE-03)', () => {
  const planet: Planet = PLANET_WORLDS.find((p) => p.id === 'mars-english') || PLANET_WORLDS[0];
  const activeFeature: PlanetFeature = planet.features[0];

  beforeEach(() => {
    intlState.locale = 'en';
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders Return to Orbit button and triggers onBackToOrbit when clicked', () => {
    const handleBack = vi.fn();
    const handleSelect = vi.fn();
    const handleLaunch = vi.fn();

    render(
      <PlanetaryHud
        planet={planet}
        activeFeature={activeFeature}
        onSelectFeature={handleSelect}
        onBackToOrbit={handleBack}
        onLaunchMission={handleLaunch}
      />
    );

    const backButton = screen.getByRole('button', { name: /return to orbit/i });
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('renders all 7 feature buttons with correct Tahun badges and names', () => {
    const handleBack = vi.fn();
    const handleSelect = vi.fn();
    const handleLaunch = vi.fn();

    render(
      <PlanetaryHud
        planet={planet}
        activeFeature={activeFeature}
        onSelectFeature={handleSelect}
        onBackToOrbit={handleBack}
        onLaunchMission={handleLaunch}
      />
    );

    expect(planet.features).toHaveLength(7);

    // Each feature button should be rendered
    planet.features.forEach((feat, idx) => {
      const btn = screen.getByTestId(`feature-button-${feat.id}`);
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveTextContent(feat.name);

      if (feat.isFinalBoss) {
        expect(btn).toHaveTextContent('Capstone Boss');
      } else {
        expect(btn).toHaveTextContent(`Tahun ${feat.year}`);
      }
    });
  });

  it('triggers onSelectFeature with the expected feature object and index when clicked', () => {
    const handleBack = vi.fn();
    const handleSelect = vi.fn();
    const handleLaunch = vi.fn();

    render(
      <PlanetaryHud
        planet={planet}
        activeFeature={activeFeature}
        onSelectFeature={handleSelect}
        onBackToOrbit={handleBack}
        onLaunchMission={handleLaunch}
      />
    );

    // Click feature 3
    const targetIdx = 2;
    const targetFeat = planet.features[targetIdx];
    const btn = screen.getByTestId(`feature-button-${targetFeat.id}`);

    fireEvent.click(btn);
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(targetFeat, targetIdx);
  });

  it('displays authentic coordinates and elevation in the telemetry card', () => {
    const handleBack = vi.fn();
    const handleSelect = vi.fn();
    const handleLaunch = vi.fn();

    render(
      <PlanetaryHud
        planet={planet}
        activeFeature={activeFeature}
        onSelectFeature={handleSelect}
        onBackToOrbit={handleBack}
        onLaunchMission={handleLaunch}
      />
    );

    const telemetryCard = screen.getByTestId('telemetry-card');
    expect(telemetryCard).toBeInTheDocument();

    // Check coordinates and elevation
    const expectedCoords = `${activeFeature.coordinates.lat}°N, ${activeFeature.coordinates.lon}°E`;
    expect(telemetryCard).toHaveTextContent(expectedCoords);
    expect(telemetryCard).toHaveTextContent(activeFeature.coordinates.elevation || '—');
    expect(telemetryCard).toHaveTextContent(activeFeature.description);
    expect(telemetryCard).toHaveTextContent(activeFeature.badge);
  });

  it('triggers onLaunchMission when clicking Start Mission', () => {
    const handleBack = vi.fn();
    const handleSelect = vi.fn();
    const handleLaunch = vi.fn();

    render(
      <PlanetaryHud
        planet={planet}
        activeFeature={activeFeature}
        onSelectFeature={handleSelect}
        onBackToOrbit={handleBack}
        onLaunchMission={handleLaunch}
      />
    );

    const launchButton = screen.getByRole('button', { name: /start mission/i });
    expect(launchButton).toBeInTheDocument();

    fireEvent.click(launchButton);
    expect(handleLaunch).toHaveBeenCalledTimes(1);
    expect(handleLaunch).toHaveBeenCalledWith(activeFeature);
  });

  it('renders bilingual content in Bahasa Melayu under ms locale', () => {
    intlState.locale = 'ms';

    const handleBack = vi.fn();
    const handleSelect = vi.fn();
    const handleLaunch = vi.fn();

    render(
      <PlanetaryHud
        planet={planet}
        activeFeature={activeFeature}
        onSelectFeature={handleSelect}
        onBackToOrbit={handleBack}
        onLaunchMission={handleLaunch}
      />
    );

    // Malay header and back button
    expect(screen.getByRole('button', { name: /kembali ke orbit/i })).toBeInTheDocument();
    const celestialElements = screen.getAllByText(new RegExp(`${planet.celestialBodyMs}`, 'i'));
    expect(celestialElements.length).toBeGreaterThanOrEqual(1);

    // Malay feature name and badge in telemetry card
    const telemetryCard = screen.getByTestId('telemetry-card');
    expect(telemetryCard).toHaveTextContent(activeFeature.nameMs);
    expect(telemetryCard).toHaveTextContent(activeFeature.badgeMs);

    // Capstone boss feature button displays 'Cabaran Unggul'
    const finalBoss = planet.features.find((f) => f.isFinalBoss);
    if (finalBoss) {
      const bossBtn = screen.getByTestId(`feature-button-${finalBoss.id}`);
      expect(bossBtn).toHaveTextContent('Cabaran Unggul');
    }

    // Malay Start Mission button
    expect(screen.getByRole('button', { name: /mula misi/i })).toBeInTheDocument();
  });
});
