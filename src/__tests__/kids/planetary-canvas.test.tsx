import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fs from 'fs';
import path from 'path';

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
    })),
  };
});

import { PlanetaryCanvas } from '@/components/kids/planets/planetary-canvas';

describe('Planetary Textures & Assets (D-02)', () => {
  const planetsDir = path.resolve(process.cwd(), 'public/images/planets');
  const requiredTextures = [
    'earth.jpg',
    'earth_clouds.jpg',
    'moon.jpg',
    'mars.jpg',
    'mercury.jpg',
    'venus_surface.jpg',
    'sun.jpg',
  ];

  it('all 7 NASA planetary equirectangular textures exist in public/images/planets/', () => {
    expect(fs.existsSync(planetsDir)).toBe(true);

    for (const file of requiredTextures) {
      const filePath = path.join(planetsDir, file);
      expect(fs.existsSync(filePath), `Texture ${file} must exist`).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(10000); // Must be a real non-empty image (> 10 KB)
    }
  });

  it('total combined texture footprint is strictly under 800 KB per D-02', () => {
    let totalBytes = 0;
    for (const file of requiredTextures) {
      const stat = fs.statSync(path.join(planetsDir, file));
      totalBytes += stat.size;
    }

    const maxBudgetBytes = 800 * 1024; // 819,200 bytes
    expect(totalBytes).toBeLessThan(maxBudgetBytes);
    // Also verify against 800,000 decimal bytes
    expect(totalBytes).toBeLessThan(800000);
  });

  it('includes authentic ATTRIBUTION.md with CC-BY-4.0 and NASA/Solar System Scope credits', () => {
    const attrPath = path.join(planetsDir, 'ATTRIBUTION.md');
    expect(fs.existsSync(attrPath)).toBe(true);
    const content = fs.readFileSync(attrPath, 'utf-8');

    expect(content).toContain('CC-BY-4.0');
    expect(content).toContain('Solar System Scope');
    expect(content).toContain('NASA');
    expect(content).toContain('USGS');
  });
});

describe('PlanetaryCanvas Component (D-04)', () => {
  beforeEach(() => {
    // Mock ResizeObserver for jsdom
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

  it('renders a container div without crashing in a client test environment', () => {
    const { container } = render(
      <PlanetaryCanvas mode="solar-system" />
    );

    const canvasContainer = screen.getByTestId('planetary-canvas-container');
    expect(canvasContainer).toBeDefined();
    expect(container).toContainElement(canvasContainer);
  });

  it('renders nested children and applies custom className', () => {
    render(
      <PlanetaryCanvas mode="solar-system" className="custom-test-canvas">
        <div data-testid="test-overlay">Telemetry HUD Overlay</div>
      </PlanetaryCanvas>
    );

    const canvasContainer = screen.getByTestId('planetary-canvas-container');
    expect(canvasContainer.className).toContain('custom-test-canvas');
    expect(screen.getByTestId('test-overlay')).toBeDefined();
    expect(screen.getByText('Telemetry HUD Overlay')).toBeDefined();
  });

  it('unmounts cleanly without throwing memory or disposal errors', () => {
    const { unmount } = render(
      <PlanetaryCanvas mode="planet-cartography" planetId="mars-english" />
    );

    expect(() => {
      unmount();
    }).not.toThrow();
  });

  it('invokes onInit and onRenderFrame callbacks if provided', () => {
    const onInit = vi.fn();
    const onRenderFrame = vi.fn();

    render(
      <PlanetaryCanvas
        mode="solar-system"
        onInit={onInit}
        onRenderFrame={onRenderFrame}
      />
    );

    expect(onInit).toHaveBeenCalled();
    const ctx = onInit.mock.calls[0][0];
    expect(ctx.scene).toBeDefined();
    expect(ctx.camera).toBeDefined();
    expect(ctx.renderer).toBeDefined();
    expect(ctx.controls).toBeDefined();
  });
});
