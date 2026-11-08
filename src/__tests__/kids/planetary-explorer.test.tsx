import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import enMessages from '@/../messages/en.json';
import msMessages from '@/../messages/ms.json';
import { PLANET_WORLDS } from '@/lib/kids/planets';

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

// Mock next/navigation useRouter
const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock Three.js WebGLRenderer and OrbitControls for Node/JSDOM testing environment per D-04
vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal<typeof import('three')>();
  class MockWebGLRenderer {
    domElement = document.createElement('canvas');
    setSize = vi.fn();
    setPixelRatio = vi.fn();
    render = vi.fn();
    dispose = vi.fn();
  }
  return {
    ...actual,
    WebGLRenderer: MockWebGLRenderer,
  };
});

vi.mock('three/examples/jsm/controls/OrbitControls.js', () => {
  return {
    OrbitControls: vi.fn().mockImplementation(() => ({
      enableDamping: true,
      dampingFactor: 0.05,
      update: vi.fn(),
      dispose: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      target: { set: vi.fn() },
    })),
  };
});

import { PlanetaryExplorer } from '@/components/kids/planets/planetary-explorer';
import PlanetsPage, { metadata } from '@/app/planets/page';

describe('PlanetaryExplorer Integration (THREE-04, D-01, D-03)', () => {
  beforeEach(() => {
    intlState.locale = 'en';
    global.ResizeObserver = class ResizeObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    };
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders in Solar System mode by default with header and 5 planet pills', () => {
    render(<PlanetaryExplorer />);

    // Container and header banner
    expect(screen.getByTestId('planetary-explorer-root')).toBeInTheDocument();
    expect(screen.getByTestId('solar-system-header')).toBeInTheDocument();
    expect(screen.getByText('Solar System Explorer')).toBeInTheDocument();

    // Map return link
    expect(screen.getByTestId('back-to-map-link')).toBeInTheDocument();

    // Bottom selector bar with all 5 planet pills
    const selectorBar = screen.getByTestId('planet-selector-bar');
    expect(selectorBar).toBeInTheDocument();

    PLANET_WORLDS.forEach((world) => {
      const pill = screen.getByTestId(`planet-pill-${world.id}`);
      expect(pill).toBeInTheDocument();
      expect(pill).toHaveTextContent(world.celestialBody);
    });

    // Cartography HUD should not be mounted initially
    expect(screen.queryByTestId('planetary-hud-root')).toBeNull();
  });

  it('transitions into Planet Cartography mode and displays HUD when a planet pill is clicked', () => {
    render(<PlanetaryExplorer />);

    // Click Mars pill
    const marsPill = screen.getByTestId('planet-pill-mars-english');
    fireEvent.click(marsPill);

    // Solar system header should no longer be visible
    expect(screen.queryByTestId('solar-system-header')).toBeNull();

    // Planetary HUD overlay should be mounted
    const hud = screen.getByTestId('planetary-hud-root');
    expect(hud).toBeInTheDocument();

    // Active world should be Mars with English subject
    const marsWorld = PLANET_WORLDS.find((p) => p.id === 'mars-english')!;
    expect(screen.getByText(new RegExp(`${marsWorld.celestialBody} //`, 'i'))).toBeInTheDocument();

    // Telemetry card should display first feature by default
    const telemetryCard = screen.getByTestId('telemetry-card');
    expect(telemetryCard).toBeInTheDocument();
    expect(telemetryCard).toHaveTextContent(marsWorld.features[0].name);

    // Sidebar should display all 7 features of Mars
    expect(screen.getByTestId('province-sidebar')).toBeInTheDocument();
    marsWorld.features.forEach((feat) => {
      expect(screen.getByTestId(`feature-button-${feat.id}`)).toBeInTheDocument();
    });
  });

  it('returns to Solar System mode when clicking Return to Orbit in the cartography HUD', () => {
    render(
      <PlanetaryExplorer
        initialMode="planet-cartography"
        initialPlanetId="mars-english"
      />
    );

    // Initially in cartography mode
    expect(screen.getByTestId('planetary-hud-root')).toBeInTheDocument();

    // Click Return to Orbit button
    const backBtn = screen.getByRole('button', { name: /return to orbit/i });
    fireEvent.click(backBtn);

    // Should transition back to Solar System Overview mode
    expect(screen.queryByTestId('planetary-hud-root')).toBeNull();
    expect(screen.getByTestId('solar-system-header')).toBeInTheDocument();
    expect(screen.getByTestId('planet-selector-bar')).toBeInTheDocument();
  });

  it('updates active feature state symmetrically when selecting a feature button in the HUD', () => {
    render(
      <PlanetaryExplorer
        initialMode="planet-cartography"
        initialPlanetId="mars-english"
      />
    );

    const marsWorld = PLANET_WORLDS.find((p) => p.id === 'mars-english')!;
    const targetFeat = marsWorld.features[2]; // Feature 3 (index 2)

    // Click feature button in sidebar
    const featBtn = screen.getByTestId(`feature-button-${targetFeat.id}`);
    fireEvent.click(featBtn);

    // Telemetry card should update to show target feature name and badge
    const telemetryCard = screen.getByTestId('telemetry-card');
    expect(telemetryCard).toHaveTextContent(targetFeat.name);
    expect(telemetryCard).toHaveTextContent(targetFeat.badge);
    expect(telemetryCard).toHaveTextContent(`${targetFeat.coordinates.lat}°N, ${targetFeat.coordinates.lon}°E`);
  });

  it('triggers onLaunchMission with the active planet and feature when Start Mission is clicked', () => {
    const handleLaunch = vi.fn();
    render(
      <PlanetaryExplorer
        initialMode="planet-cartography"
        initialPlanetId="mars-english"
        onLaunchMission={handleLaunch}
      />
    );

    const marsWorld = PLANET_WORLDS.find((p) => p.id === 'mars-english')!;
    const activeFeat = marsWorld.features[0];

    const launchBtn = screen.getByRole('button', { name: /start mission/i });
    fireEvent.click(launchBtn);

    expect(handleLaunch).toHaveBeenCalledTimes(1);
    expect(handleLaunch).toHaveBeenCalledWith(marsWorld, activeFeat);
  });

  it('routes to the corresponding subject lesson when onLaunchMission is not provided (default router)', () => {
    pushMock.mockClear();
    render(
      <PlanetaryExplorer
        initialMode="planet-cartography"
        initialPlanetId="moon-bm"
      />
    );

    const launchBtn = screen.getByRole('button', { name: /start mission/i });
    fireEvent.click(launchBtn);

    expect(pushMock).toHaveBeenCalledWith('/level/6-1-bm-kucing-peromfu');
  });

  it('renders quick action link to Earth Map in HUD when inspecting Earth', () => {
    render(
      <PlanetaryExplorer
        initialMode="planet-cartography"
        initialPlanetId="earth-prompting"
      />
    );

    const earthMapBtn = screen.getByTestId('hud-to-earth-map-btn');
    expect(earthMapBtn).toBeInTheDocument();
    expect(earthMapBtn).toHaveAttribute('href', '/map');
  });
});

describe('Standalone /planets Page Route (D-04, THREE-04)', () => {
  it('exports valid metadata for static export indexing', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toEqual({ absolute: 'Solar System Explorer | Sekolah Prompt-Fu' });
    expect(metadata.description).toContain('Explore planetary worlds');
    expect(metadata.alternates?.canonical).toBe('/planets');
  });

  it('renders fullscreen main wrapper containing PlanetaryExplorer', () => {
    const { container } = render(<PlanetsPage />);
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main?.className).toContain('w-full h-full overflow-hidden bg-slate-950');
    expect(screen.getByTestId('planetary-explorer-root')).toBeInTheDocument();
  });
});
