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

  it('routes to the corresponding subject lesson with planets origin when onLaunchMission is not provided (default router)', () => {
    pushMock.mockClear();
    render(
      <PlanetaryExplorer
        initialMode="planet-cartography"
        initialPlanetId="moon-bm"
      />
    );

    const launchBtn = screen.getByRole('button', { name: /start mission/i });
    fireEvent.click(launchBtn);

    expect(pushMock).toHaveBeenCalledWith('/level/6-1-bm-kucing-peromfu?origin=planets');
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

  it('supports end-to-end text-only planet -> region -> mission navigation without WebGL init (D-05, D-06, D-07, D-08, D-16)', () => {
    pushMock.mockClear();
    render(<PlanetaryExplorer />);

    // 1. Selector bar is mounted initially
    const marsPill = screen.getByTestId('planet-pill-mars-english');
    expect(marsPill).toBeInTheDocument();
    expect(marsPill).toHaveAttribute('aria-pressed', 'false');

    // Focus and click the Mars pill
    marsPill.focus();
    expect(document.activeElement).toBe(marsPill);
    fireEvent.click(marsPill);

    // Chooser remains mounted and focused
    expect(marsPill).toBeInTheDocument();
    expect(document.activeElement).toBe(marsPill);
    expect(marsPill).toHaveAttribute('aria-pressed', 'true');
    expect(marsPill).toHaveTextContent(/selected/i);

    // Persistent polite status announcer announces planet selection
    const status = screen.getByTestId('planetary-status-announcer');
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute('role', 'status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('aria-atomic', 'true');
    expect(status).toHaveTextContent('Selected: Mars. Choose a region.');

    // Planet selector bar remains present in cartography mode
    expect(screen.getByTestId('planet-selector-bar')).toBeInTheDocument();

    // 2. Choose a region from province sidebar (rendered after chooser in DOM)
    const marsWorld = PLANET_WORLDS.find((p) => p.id === 'mars-english')!;
    const targetFeat = marsWorld.features[1]; // Valles Marineris
    const featBtn = screen.getByTestId(`feature-button-${targetFeat.id}`);
    expect(featBtn).toBeInTheDocument();

    featBtn.focus();
    expect(document.activeElement).toBe(featBtn);
    fireEvent.click(featBtn);

    // Region button has aria-pressed and visible selected indicator, focus retained
    expect(document.activeElement).toBe(featBtn);
    expect(featBtn).toHaveAttribute('aria-pressed', 'true');
    expect(featBtn).toHaveTextContent(/selected/i);

    // Status announcer updates for region selection without shifting focus
    expect(status).toHaveTextContent(`Selected: ${targetFeat.name}. Read the details, then start a mission.`);

    // 3. Launch mission without canvas interaction
    const launchBtn = screen.getByRole('button', { name: /start mission/i });
    fireEvent.click(launchBtn);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/level/7-1-english-colorful-toys?origin=planets');
  });

  it('provides bilingual polite announcements and selected words in Bahasa Melayu (D-07, D-16)', () => {
    intlState.locale = 'ms';
    pushMock.mockClear();

    render(<PlanetaryExplorer />);

    const moonPill = screen.getByTestId('planet-pill-moon-bm');
    moonPill.focus();
    fireEvent.click(moonPill);

    expect(moonPill).toHaveAttribute('aria-pressed', 'true');
    expect(moonPill).toHaveTextContent(/dipilih/i);

    const status = screen.getByTestId('planetary-status-announcer');
    expect(status).toHaveTextContent('Dipilih: Bulan. Pilih kawasan.');

    const moonWorld = PLANET_WORLDS.find((p) => p.id === 'moon-bm')!;
    const firstFeat = moonWorld.features[0];
    const featBtn = screen.getByTestId(`feature-button-${firstFeat.id}`);

    featBtn.focus();
    fireEvent.click(featBtn);

    expect(featBtn).toHaveAttribute('aria-pressed', 'true');
    expect(featBtn).toHaveTextContent(/dipilih/i);
    expect(status).toHaveTextContent(new RegExp(`Dipilih: ${firstFeat.nameMs}\\. Baca butiran, kemudian mula misi\\.`, 'i'));

    const launchBtn = screen.getByRole('button', { name: /mula misi/i });
    fireEvent.click(launchBtn);

    expect(pushMock).toHaveBeenCalledWith('/level/6-1-bm-kucing-peromfu?origin=planets');
  });

  it('preserves focus and state across repeated chooser clicks, neighboring feature selections, and Return to Orbit (D-07, A11Y-03)', () => {
    pushMock.mockClear();
    render(<PlanetaryExplorer />);

    const marsPill = screen.getByTestId('planet-pill-mars-english');
    marsPill.focus();
    fireEvent.click(marsPill);

    // Initial Mars selection
    expect(document.activeElement).toBe(marsPill);
    expect(marsPill).toHaveAttribute('aria-pressed', 'true');
    const status = screen.getByTestId('planetary-status-announcer');
    expect(status).toHaveTextContent('Selected: Mars. Choose a region.');

    // Repeated click on the same planet pill
    fireEvent.click(marsPill);
    expect(document.activeElement).toBe(marsPill);
    expect(marsPill).toHaveAttribute('aria-pressed', 'true');
    expect(status).toHaveTextContent('Selected: Mars. Choose a region.');

    // Select neighboring features in quick succession
    const marsWorld = PLANET_WORLDS.find((p) => p.id === 'mars-english')!;
    const feat0 = marsWorld.features[0];
    const feat1 = marsWorld.features[1];
    const feat2 = marsWorld.features[2];

    const btn0 = screen.getByTestId(`feature-button-${feat0.id}`);
    const btn1 = screen.getByTestId(`feature-button-${feat1.id}`);
    const btn2 = screen.getByTestId(`feature-button-${feat2.id}`);

    // Click feat 0
    btn0.focus();
    fireEvent.click(btn0);
    expect(document.activeElement).toBe(btn0);
    expect(btn0).toHaveAttribute('aria-pressed', 'true');
    expect(btn1).toHaveAttribute('aria-pressed', 'false');

    // Click neighboring feat 1
    btn1.focus();
    fireEvent.click(btn1);
    expect(document.activeElement).toBe(btn1);
    expect(btn0).toHaveAttribute('aria-pressed', 'false');
    expect(btn1).toHaveAttribute('aria-pressed', 'true');
    expect(btn2).toHaveAttribute('aria-pressed', 'false');

    // Click neighboring feat 2
    btn2.focus();
    fireEvent.click(btn2);
    expect(document.activeElement).toBe(btn2);
    expect(btn1).toHaveAttribute('aria-pressed', 'false');
    expect(btn2).toHaveAttribute('aria-pressed', 'true');
    expect(status).toHaveTextContent(`Selected: ${feat2.name}. Read the details, then start a mission.`);

    // Launch mission from last selected feature (feat 2)
    const launchBtn = screen.getByRole('button', { name: /start mission/i });
    fireEvent.click(launchBtn);
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/level/7-1-english-colorful-toys?origin=planets');

    // Click Return to Orbit
    const backBtn = screen.getByRole('button', { name: /return to orbit/i });
    fireEvent.click(backBtn);

    // Verify back in Solar System mode
    expect(screen.getByTestId('solar-system-header')).toBeInTheDocument();
    expect(screen.getByTestId('back-to-map-link')).toBeInTheDocument();
    expect(screen.queryByTestId('planetary-hud-root')).toBeNull();

    // Verify all pills reset aria-pressed to false
    PLANET_WORLDS.forEach((world) => {
      expect(screen.getByTestId(`planet-pill-${world.id}`)).toHaveAttribute('aria-pressed', 'false');
    });

    // Select another planet from orbit
    pushMock.mockClear();
    const venusPill = screen.getByTestId('planet-pill-venus-matematik');
    venusPill.focus();
    fireEvent.click(venusPill);

    expect(document.activeElement).toBe(venusPill);
    expect(venusPill).toHaveAttribute('aria-pressed', 'true');
    expect(marsPill).toHaveAttribute('aria-pressed', 'false');
    expect(status).toHaveTextContent('Selected: Venus. Choose a region.');

    const venusWorld = PLANET_WORLDS.find((p) => p.id === 'venus-matematik')!;
    const venusFeat0 = venusWorld.features[0];
    const venusBtn0 = screen.getByTestId(`feature-button-${venusFeat0.id}`);
    venusBtn0.focus();
    fireEvent.click(venusBtn0);

    const venusLaunchBtn = screen.getByRole('button', { name: /start mission/i });
    fireEvent.click(venusLaunchBtn);
    expect(pushMock).toHaveBeenCalledWith('/level/8-1-matematik-tambah-bintang?origin=planets');
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
