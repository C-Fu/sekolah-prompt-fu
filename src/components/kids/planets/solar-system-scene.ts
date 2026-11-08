import * as THREE from 'three';
import { withBasePath } from '@/lib/seo';
import { PLANET_WORLDS, type PlanetId } from '@/lib/kids/planets';

export interface PlanetOrbitConfig {
  id: PlanetId;
  radius: number;
  dist: number;
  tex: string;
  speed: number;
}

export interface SolarSystemSceneResult {
  scene: THREE.Scene;
  planetMeshes: THREE.Mesh[];
  updateOrbits: (delta: number) => void;
  dispose: () => void;
}

/**
 * Loads an equirectangular texture safely across browser and SSR/testing environments.
 */
function loadTextureSafe(path: string, trackedTextures: THREE.Texture[]): THREE.Texture | undefined {
  if (typeof document === 'undefined') return undefined;
  try {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(withBasePath(path));
    trackedTextures.push(texture);
    return texture;
  } catch {
    return undefined;
  }
}

/**
 * Creates a circular orbit line loop in the X-Z plane.
 */
function createOrbitTrack(radius: number): THREE.LineLoop {
  const segments = 128;
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({
    color: 0x475569,
    transparent: true,
    opacity: 0.35,
  });
  return new THREE.LineLoop(geo, mat);
}

/**
 * Builds the interactive 3D Solar System Overview scene (D-01).
 *
 * Features:
 * - Central luminous Sun with PointLight and soft AmbientLight
 * - 2000 starfield background particles in a spherical shell [120..350]
 * - 5 orbital tracks (Mercury, Venus, Earth, Mars, and Moon)
 * - 5 textured celestial bodies (Mercury, Venus, Earth with Moon pairing, Mars)
 * - T-10-03 bounded delta step in updateOrbits
 * - Complete GPU resource disposal
 */
export function buildSolarSystemScene(): SolarSystemSceneResult {
  const scene = new THREE.Scene();
  const trackedTextures: THREE.Texture[] = [];
  const planetMeshes: THREE.Mesh[] = [];

  // 1. Central Glowing Sun
  const sunGeo = new THREE.SphereGeometry(2.2, 32, 32);
  const sunTex = loadTextureSafe('/images/planets/sun.jpg', trackedTextures);
  const sunMat = new THREE.MeshBasicMaterial({
    map: sunTex,
    color: sunTex ? 0xffffff : 0xfdb813,
  });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.name = 'sun';
  scene.add(sunMesh);

  // Sunlight radiation (PointLight) and celestial ambient fill
  const sunLight = new THREE.PointLight(0xfff7ed, 2.5, 100);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambientLight);

  // 2. Starfield background particles
  const starCount = 2000;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 120 + Math.random() * (350 - 120);

    const sinPhi = Math.sin(phi);
    starPositions[i * 3] = r * sinPhi * Math.cos(theta);
    starPositions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.8,
    sizeAttenuation: true,
  });
  const starfield = new THREE.Points(starGeo, starMat);
  starfield.name = 'starfield';
  scene.add(starfield);

  // 3. Planet configurations
  const primaryConfigs: PlanetOrbitConfig[] = [
    { id: 'mercury-moral', radius: 0.45, dist: 6.0, tex: 'mercury.jpg', speed: 1.2 },
    { id: 'venus-matematik', radius: 0.75, dist: 9.5, tex: 'venus_surface.jpg', speed: 0.9 },
    { id: 'earth-prompting', radius: 0.85, dist: 14.5, tex: 'earth.jpg', speed: 0.7 },
    { id: 'mars-english', radius: 0.60, dist: 20.0, tex: 'mars.jpg', speed: 0.5 },
  ];

  // Map to store world metadata for theme colors
  const worldMap = new Map(PLANET_WORLDS.map((w) => [w.id, w]));

  // Primary planets loop (Mercury, Venus, Mars created directly; Earth created with Moon pairing)
  let earthMesh: THREE.Mesh | null = null;
  let earthGroup: THREE.Group | null = null;
  let moonMesh: THREE.Mesh | null = null;
  let moonGroup: THREE.Group | null = null;

  primaryConfigs.forEach((cfg, index) => {
    // Add planetary orbit track
    const orbitTrack = createOrbitTrack(cfg.dist);
    orbitTrack.name = `orbit-${cfg.id}`;
    scene.add(orbitTrack);

    const world = worldMap.get(cfg.id);
    const pGeo = new THREE.SphereGeometry(cfg.radius, 32, 24);
    const pTex = loadTextureSafe(`/images/planets/${cfg.tex}`, trackedTextures);
    const pMat = new THREE.MeshStandardMaterial({
      map: pTex,
      color: pTex ? 0xffffff : new THREE.Color(world?.themeColor || 0xffffff),
      roughness: 0.8,
    });
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.name = `planet-${cfg.id}`;

    // Initial staggered angle for visual harmony
    const initialAngle = index * (Math.PI * 0.55);
    pMesh.userData = {
      planetId: cfg.id,
      dist: cfg.dist,
      speed: cfg.speed,
      angle: initialAngle,
    };

    if (cfg.id === 'earth-prompting') {
      // Earth system with orbiting Moon (D-01)
      earthGroup = new THREE.Group();
      earthGroup.name = 'group-earth-system';
      earthGroup.position.set(
        Math.cos(initialAngle) * cfg.dist,
        0,
        Math.sin(initialAngle) * cfg.dist
      );

      earthMesh = pMesh;
      earthMesh.position.set(0, 0, 0);
      earthGroup.add(earthMesh);

      // Moon orbit track around Earth (dist 1.8)
      const moonDist = 1.8;
      const moonOrbitTrack = createOrbitTrack(moonDist);
      moonOrbitTrack.name = 'orbit-moon-bm';
      earthGroup.add(moonOrbitTrack);

      // Moon mesh
      const moonWorld = worldMap.get('moon-bm');
      const moonGeo = new THREE.SphereGeometry(0.28, 24, 18);
      const moonTex = loadTextureSafe('/images/planets/moon.jpg', trackedTextures);
      const moonMat = new THREE.MeshStandardMaterial({
        map: moonTex,
        color: moonTex ? 0xffffff : new THREE.Color(moonWorld?.themeColor || 0x94a3b8),
        roughness: 0.8,
      });
      moonMesh = new THREE.Mesh(moonGeo, moonMat);
      moonMesh.name = 'planet-moon-bm';

      const moonInitialAngle = 0;
      moonMesh.userData = {
        planetId: 'moon-bm',
        dist: moonDist,
        distFromEarth: moonDist,
        speed: 2.5,
        angle: moonInitialAngle,
      };
      moonMesh.position.set(
        Math.cos(moonInitialAngle) * moonDist,
        0,
        Math.sin(moonInitialAngle) * moonDist
      );

      moonGroup = new THREE.Group();
      moonGroup.name = 'group-moon';
      moonGroup.add(moonMesh);
      earthGroup.add(moonGroup);

      scene.add(earthGroup);

      planetMeshes.push(earthMesh);
      planetMeshes.push(moonMesh);
    } else {
      // Standard planetary mesh placed directly in scene
      pMesh.position.set(
        Math.cos(initialAngle) * cfg.dist,
        0,
        Math.sin(initialAngle) * cfg.dist
      );
      scene.add(pMesh);
      planetMeshes.push(pMesh);
    }
  });

  // Ensure world matrices are computed immediately
  scene.updateMatrixWorld(true);

  /**
   * Orbital step animation loop.
   * T-10-03: Cap delta time (maximum 0.1s step) to prevent physics explosion or infinite animation stalls.
   */
  const updateOrbits = (delta: number) => {
    const dt = Math.min(Math.max(0, delta), 0.1);

    // Slowly rotate the Sun
    sunMesh.rotation.y += 0.2 * dt;

    // Update primary planetary orbits
    planetMeshes.forEach((mesh) => {
      const data = mesh.userData;
      if (!data || typeof data.speed !== 'number') return;

      if (data.planetId === 'earth-prompting') {
        data.angle = (data.angle + data.speed * dt * 0.4) % (Math.PI * 2);
        if (earthGroup) {
          earthGroup.position.x = Math.cos(data.angle) * data.dist;
          earthGroup.position.z = Math.sin(data.angle) * data.dist;
        }
        mesh.rotation.y += 0.8 * dt;
      } else if (data.planetId === 'moon-bm') {
        data.angle = (data.angle + data.speed * dt * 0.4) % (Math.PI * 2);
        mesh.position.x = Math.cos(data.angle) * data.dist;
        mesh.position.z = Math.sin(data.angle) * data.dist;
        mesh.rotation.y += 0.5 * dt;
      } else {
        data.angle = (data.angle + data.speed * dt * 0.4) % (Math.PI * 2);
        mesh.position.x = Math.cos(data.angle) * data.dist;
        mesh.position.z = Math.sin(data.angle) * data.dist;
        mesh.rotation.y += 0.8 * dt;
      }
    });

    scene.updateMatrixWorld(true);
  };

  /**
   * Cleans up all geometries, materials, and textures to prevent WebGL memory leaks.
   */
  const dispose = () => {
    trackedTextures.forEach((tex) => tex.dispose());
    trackedTextures.length = 0;

    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat) => {
            if ('map' in mat && mat.map instanceof THREE.Texture) {
              mat.map.dispose();
            }
            mat.dispose();
          });
        } else if (obj.material) {
          const mat = obj.material as THREE.Material & { map?: THREE.Texture };
          if (mat.map instanceof THREE.Texture) {
            mat.map.dispose();
          }
          mat.dispose();
        }
      }
    });

    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
  };

  return {
    scene,
    planetMeshes,
    updateOrbits,
    dispose,
  };
}
