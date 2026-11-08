import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';
import { buildSolarSystemScene } from '@/components/kids/planets/solar-system-scene';
import {
  setupDragFilter,
  raycastObjects,
  raycastSolarSystem,
} from '@/components/kids/planets/planetary-interaction';

describe('Solar System Overview Scene (solar-system-scene.ts)', () => {
  it('buildSolarSystemScene creates exactly 5 interactive celestial meshes matching PLANET_WORLDS IDs', () => {
    const { scene, planetMeshes } = buildSolarSystemScene();

    expect(planetMeshes).toHaveLength(5);

    const planetIds = planetMeshes.map((m) => m.userData.planetId);
    expect(planetIds).toContain('mercury-moral');
    expect(planetIds).toContain('venus-matematik');
    expect(planetIds).toContain('earth-prompting');
    expect(planetIds).toContain('moon-bm');
    expect(planetIds).toContain('mars-english');

    // Central Sun verification
    const sunMesh = scene.getObjectByName('sun') as THREE.Mesh;
    expect(sunMesh).toBeDefined();
    expect(sunMesh.isMesh).toBe(true);

    // Sun PointLight and AmbientLight verification
    const pointLight = scene.children.find((obj) => obj instanceof THREE.PointLight) as THREE.PointLight;
    expect(pointLight).toBeDefined();
    expect(pointLight.intensity).toBeCloseTo(2.5);

    const ambientLight = scene.children.find((obj) => obj instanceof THREE.AmbientLight) as THREE.AmbientLight;
    expect(ambientLight).toBeDefined();
    expect(ambientLight.intensity).toBeCloseTo(0.25);

    // Starfield particle verification (2000 points)
    const starfield = scene.getObjectByName('starfield') as THREE.Points;
    expect(starfield).toBeDefined();
    expect(starfield.isPoints).toBe(true);
    const starPositions = starfield.geometry.getAttribute('position');
    expect(starPositions.count).toBe(2000);

    // 5 Orbital tracks verification (Mercury, Venus, Earth, Mars, and Moon)
    const orbitTracks: THREE.LineLoop[] = [];
    scene.traverse((obj) => {
      if (obj instanceof THREE.LineLoop) {
        orbitTracks.push(obj);
      }
    });
    expect(orbitTracks).toHaveLength(5);
  });

  it('orbital distances follow ascending radial order (Mercury dist < Venus dist < Earth dist < Mars dist)', () => {
    const { planetMeshes } = buildSolarSystemScene();

    const mercury = planetMeshes.find((m) => m.userData.planetId === 'mercury-moral');
    const venus = planetMeshes.find((m) => m.userData.planetId === 'venus-matematik');
    const earth = planetMeshes.find((m) => m.userData.planetId === 'earth-prompting');
    const mars = planetMeshes.find((m) => m.userData.planetId === 'mars-english');
    const moon = planetMeshes.find((m) => m.userData.planetId === 'moon-bm');

    expect(mercury).toBeDefined();
    expect(venus).toBeDefined();
    expect(earth).toBeDefined();
    expect(mars).toBeDefined();
    expect(moon).toBeDefined();

    const distMercury = mercury!.userData.dist;
    const distVenus = venus!.userData.dist;
    const distEarth = earth!.userData.dist;
    const distMars = mars!.userData.dist;

    expect(distMercury).toBeLessThan(distVenus);
    expect(distVenus).toBeLessThan(distEarth);
    expect(distEarth).toBeLessThan(distMars);

    // Specific expected orbital distances
    expect(distMercury).toBe(6.0);
    expect(distVenus).toBe(9.5);
    expect(distEarth).toBe(14.5);
    expect(distMars).toBe(20.0);
    expect(moon!.userData.dist).toBe(1.8);
  });

  it('updateOrbits modifies positions based on delta without producing NaN or out-of-bounds coordinates', () => {
    const { planetMeshes, updateOrbits } = buildSolarSystemScene();

    const getPositions = () =>
      planetMeshes.map((m) => {
        const v = new THREE.Vector3();
        m.getWorldPosition(v);
        return { x: v.x, y: v.y, z: v.z, rotY: m.rotation.y };
      });

    const initialPositions = getPositions();

    // Verify initial positions have no NaN
    initialPositions.forEach((pos) => {
      expect(Number.isFinite(pos.x)).toBe(true);
      expect(Number.isFinite(pos.y)).toBe(true);
      expect(Number.isFinite(pos.z)).toBe(true);
    });

    // Step animation by delta = 0.05
    updateOrbits(0.05);

    const updatedPositions = getPositions();

    // Positions should have shifted and Y rotation incremented
    updatedPositions.forEach((pos, idx) => {
      expect(Number.isFinite(pos.x)).toBe(true);
      expect(Number.isFinite(pos.y)).toBe(true);
      expect(Number.isFinite(pos.z)).toBe(true);
      expect(pos.rotY).toBeGreaterThan(initialPositions[idx].rotY);
    });

    // T-10-03: Delta capping test - passing extreme delta does not cause physics explosion or NaN
    updateOrbits(10.0); // should cap at 0.1s
    const cappedPositions = getPositions();
    cappedPositions.forEach((pos) => {
      expect(Number.isFinite(pos.x)).toBe(true);
      expect(Number.isFinite(pos.y)).toBe(true);
      expect(Number.isFinite(pos.z)).toBe(true);
    });
  });

  it('dispose() cleans up meshes and materials without memory retention', () => {
    const { scene, planetMeshes, dispose } = buildSolarSystemScene();

    const sampleMesh = planetMeshes[0];
    const geomDisposeSpy = vi.spyOn(sampleMesh.geometry, 'dispose');
    const matDisposeSpy = vi.spyOn(sampleMesh.material as THREE.Material, 'dispose');

    dispose();

    expect(geomDisposeSpy).toHaveBeenCalled();
    expect(matDisposeSpy).toHaveBeenCalled();
    expect(scene.children).toHaveLength(0);
  });
});

describe('Planetary Interaction & Raycasting (planetary-interaction.ts)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('setupDragFilter executes click callback when pointer movement is 2px in 150ms, and suppresses callback when movement is 25px in 400ms', () => {
    const element = document.createElement('div');
    const onClick = vi.fn();
    const cleanup = setupDragFilter(element, onClick);

    let currentTime = 1000;
    vi.spyOn(performance, 'now').mockImplementation(() => currentTime);

    // Scenario A: Valid click (dx=2px, dy=0px, duration=150ms)
    currentTime = 1000;
    const downEventA = new MouseEvent('pointerdown', { clientX: 100, clientY: 100 }) as PointerEvent;
    element.dispatchEvent(downEventA);

    currentTime = 1150; // +150ms
    const upEventA = new MouseEvent('pointerup', { clientX: 102, clientY: 100 }) as PointerEvent;
    element.dispatchEvent(upEventA);

    expect(onClick).toHaveBeenCalledTimes(1);

    // Scenario B: Panning / OrbitControls drag (dx=25px, dy=0px, duration=400ms)
    currentTime = 2000;
    const downEventB = new MouseEvent('pointerdown', { clientX: 100, clientY: 100 }) as PointerEvent;
    element.dispatchEvent(downEventB);

    currentTime = 2400; // +400ms
    const upEventB = new MouseEvent('pointerup', { clientX: 125, clientY: 100 }) as PointerEvent;
    element.dispatchEvent(upEventB);

    // Callback should NOT be called again
    expect(onClick).toHaveBeenCalledTimes(1);

    // Scenario C: Fast drag (dx=20px, dy=0px in 50ms) -> suppressed because distance >= 5px
    currentTime = 3000;
    element.dispatchEvent(new MouseEvent('pointerdown', { clientX: 100, clientY: 100 }) as PointerEvent);
    currentTime = 3050;
    element.dispatchEvent(new MouseEvent('pointerup', { clientX: 120, clientY: 100 }) as PointerEvent);
    expect(onClick).toHaveBeenCalledTimes(1);

    // Scenario D: Long hold (dx=1px, dy=1px in 500ms) -> suppressed because duration >= 300ms
    currentTime = 4000;
    element.dispatchEvent(new MouseEvent('pointerdown', { clientX: 100, clientY: 100 }) as PointerEvent);
    currentTime = 4500;
    element.dispatchEvent(new MouseEvent('pointerup', { clientX: 101, clientY: 101 }) as PointerEvent);
    expect(onClick).toHaveBeenCalledTimes(1);

    // Cleanup removes listeners
    cleanup();
    currentTime = 5000;
    element.dispatchEvent(new MouseEvent('pointerdown', { clientX: 100, clientY: 100 }) as PointerEvent);
    currentTime = 5100;
    element.dispatchEvent(new MouseEvent('pointerup', { clientX: 100, clientY: 100 }) as PointerEvent);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('raycastObjects guards against zero container dimensions and bounds-clamps NDC coordinates (T-10-04)', () => {
    const container = document.createElement('div');
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial());

    // Zero-width container test
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    const event = new MouseEvent('pointerup', { clientX: 50, clientY: 50 }) as PointerEvent;
    const result = raycastObjects(event, camera, [mesh], container);
    expect(result).toEqual([]);

    // Extreme coordinate clamping test
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    // ClientX far off to the right (9999) - should be clamped safely to NDC 1.0 without throwing
    const extremeEvent = new MouseEvent('pointerup', { clientX: 9999, clientY: -9999 }) as PointerEvent;
    expect(() => raycastObjects(extremeEvent, camera, [mesh], container)).not.toThrow();
  });

  it('raycastSolarSystem accurately identifies clicked celestial bodies via THREE.Raycaster', () => {
    const container = document.createElement('div');
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 400,
      height: 400,
      right: 400,
      bottom: 400,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld(true);

    // Target mesh placed right at the origin (center of camera view)
    const targetMesh = new THREE.Mesh(
      new THREE.SphereGeometry(2, 16, 16),
      new THREE.MeshBasicMaterial()
    );
    targetMesh.position.set(0, 0, 0);
    targetMesh.userData = { planetId: 'mars-english' };
    targetMesh.updateMatrixWorld(true);

    // Center click (clientX = 200, clientY = 200 in 400x400 container -> NDC 0,0)
    const centerEvent = new MouseEvent('pointerup', { clientX: 200, clientY: 200 }) as PointerEvent;
    const hitPlanet = raycastSolarSystem(centerEvent, camera, [targetMesh], container);
    expect(hitPlanet).toBe('mars-english');

    // Miss click (corner clientX = 10, clientY = 10)
    const missEvent = new MouseEvent('pointerup', { clientX: 10, clientY: 10 }) as PointerEvent;
    const missPlanet = raycastSolarSystem(missEvent, camera, [targetMesh], container);
    expect(missPlanet).toBeNull();
  });
});
