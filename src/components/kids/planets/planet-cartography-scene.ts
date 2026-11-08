import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { withBasePath } from '@/lib/seo';
import { latLonToVector3, type Planet } from '@/lib/kids/planets';
import { generateBoundaryPoints, easeOutCubic } from './planetary-math';

export interface PlanetCartographyScene {
  scene: THREE.Scene;
  pinMeshes: THREE.Mesh[];
  focusFeature: (featureIndex: number, onComplete?: () => void) => void;
  updateScene: (delta: number, elapsed: number) => void;
  dispose: () => void;
  raycastFeaturePins: (event: PointerEvent | MouseEvent, container: HTMLElement) => number | null;
}

/**
 * Resolves the equirectangular texture asset path for a given celestial body.
 */
export function getPlanetTexturePath(planet: Planet): string {
  switch (planet.id) {
    case 'earth-prompting':
      return '/images/planets/earth.jpg';
    case 'moon-bm':
      return '/images/planets/moon.jpg';
    case 'mars-english':
      return '/images/planets/mars.jpg';
    case 'mercury-moral':
      return '/images/planets/mercury.jpg';
    case 'venus-matematik':
      return '/images/planets/venus_surface.jpg';
    default: {
      const lower = planet.celestialBody.toLowerCase();
      if (lower.includes('earth')) return '/images/planets/earth.jpg';
      if (lower.includes('moon')) return '/images/planets/moon.jpg';
      if (lower.includes('mars')) return '/images/planets/mars.jpg';
      if (lower.includes('mercury')) return '/images/planets/mercury.jpg';
      if (lower.includes('venus')) return '/images/planets/venus_surface.jpg';
      return '/images/planets/earth.jpg';
    }
  }
}

/**
 * Constructs the deep 3D Planet Cartography scene (D-01, D-03).
 *
 * Features:
 * - 4.8 radius sphere with equirectangular NASA texture (and secondary cloud layer for Earth)
 * - Atmospheric rim glow ShaderMaterial with additive blending
 * - 7 geological boundary rings elevated at 4.815 to prevent Z-fighting
 * - 7 pulsing beacon pin meshes elevated at 4.825
 * - Smooth cubic ease-out camera glide lerp focusing on selected features
 * - Pointer raycasting for pin selection
 * - Full GPU resource disposal
 */
export function buildPlanetCartographyScene(
  planet: Planet,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls
): PlanetCartographyScene {
  const scene = new THREE.Scene();
  const textureLoader = new THREE.TextureLoader();

  // 1. Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
  sunLight.position.set(35, 15, 25);
  scene.add(sunLight);

  const accentColorHex = planet.accentColor || '#38bdf8';
  const rimLight = new THREE.DirectionalLight(new THREE.Color(accentColorHex), 0.55);
  rimLight.position.set(-30, -10, -25);
  scene.add(rimLight);

  // 2. Planet Group (holds globe, boundaries, and pins for synchronized rotation)
  const planetGroup = new THREE.Group();
  scene.add(planetGroup);

  // Base Globe Mesh
  const sphereRadius = 4.8;
  const globeGeo = new THREE.SphereGeometry(sphereRadius, 128, 64);
  const texturePath = getPlanetTexturePath(planet);
  const globeTexture = textureLoader.load(withBasePath(texturePath));
  const globeMat = new THREE.MeshStandardMaterial({
    map: globeTexture,
    roughness: 0.85,
    metalness: 0.08,
  });
  const globeMesh = new THREE.Mesh(globeGeo, globeMat);
  planetGroup.add(globeMesh);

  // Earth Cloud Layer (if planet is Earth)
  let cloudsMesh: THREE.Mesh | null = null;
  const isEarth = planet.id === 'earth-prompting' || planet.celestialBody.toLowerCase().includes('earth');
  if (isEarth) {
    const cloudsGeo = new THREE.SphereGeometry(4.83, 64, 32);
    const cloudsTexture = textureLoader.load(withBasePath('/images/planets/earth_clouds.jpg'));
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    planetGroup.add(cloudsMesh);
  }

  // 3. Atmospheric Rim Glow Shader
  const atmosphereGeo = new THREE.SphereGeometry(sphereRadius * 1.045, 64, 32);
  const atmosphereMat = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(accentColorHex) },
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
        gl_FragColor = vec4(glowColor, 1.0) * intensity * 1.35;
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });
  const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  scene.add(atmosphereMesh);

  // 4. Boundary Rings & Hotspot Beacon Pins
  const boundariesGroup = new THREE.Group();
  planetGroup.add(boundariesGroup);

  const pinMeshes: THREE.Mesh[] = [];
  const boundaryLines: THREE.LineLoop[] = [];

  planet.features.forEach((feat, idx) => {
    const lat = feat.coordinates.lat;
    const lon = feat.coordinates.lon;
    const radiusDeg = feat.coordinates.radiusDeg ?? 10.0;
    const featColorHex = feat.accentColor || accentColorHex;
    const threeColor = new THREE.Color(featColorHex);

    // Boundary LineLoop (elevated at sphereRadius + 0.015 = 4.815 by generateBoundaryPoints)
    const boundaryPoints = generateBoundaryPoints(lat, lon, radiusDeg, sphereRadius, 84);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(boundaryPoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: threeColor,
      transparent: true,
      opacity: 0.85,
    });
    const lineLoop = new THREE.LineLoop(lineGeo, lineMat);
    boundariesGroup.add(lineLoop);
    boundaryLines.push(lineLoop);

    // Beacon Pin Mesh (elevated at 4.825 above the boundary ring)
    const pinGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const pinMat = new THREE.MeshStandardMaterial({
      color: threeColor,
      emissive: threeColor,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      metalness: 0.2,
    });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    const pinPos = latLonToVector3(lat, lon, 4.825);
    pinMesh.position.set(pinPos.x, pinPos.y, pinPos.z);
    pinMesh.userData = { featureIndex: idx, featureId: feat.id };
    boundariesGroup.add(pinMesh);
    pinMeshes.push(pinMesh);
  });

  // 5. Camera Glide State
  let activeFeatureIndex = -1;
  let isGliding = false;
  let glideProgress = 0;
  const startCamPos = new THREE.Vector3();
  const targetCamPos = new THREE.Vector3();
  let currentOnComplete: (() => void) | undefined;

  const onControlsStart = () => {
    if (isGliding) {
      isGliding = false;
      controls.removeEventListener('start', onControlsStart);
    }
  };

  function focusFeature(featureIndex: number, onComplete?: () => void) {
    if (featureIndex < 0 || featureIndex >= planet.features.length) {
      activeFeatureIndex = -1;
      isGliding = false;
      controls.removeEventListener('start', onControlsStart);
      return;
    }

    activeFeatureIndex = featureIndex;
    currentOnComplete = onComplete;
    const feat = planet.features[featureIndex];

    // Compute surface position in local sphere space
    const surfacePos = latLonToVector3(feat.coordinates.lat, feat.coordinates.lon, sphereRadius);
    const localVec = new THREE.Vector3(surfacePos.x, surfacePos.y, surfacePos.z);

    // Transform into world coordinates using planetGroup
    planetGroup.updateMatrixWorld(true);
    const worldPos = localVec.clone().applyMatrix4(planetGroup.matrixWorld);

    // Determine zoom distance based on feature radius
    const radiusDeg = feat.coordinates.radiusDeg ?? 10.0;
    const zoomDistance = radiusDeg > 18 ? 14.0 : (radiusDeg < 8 ? 9.5 : 11.5);

    targetCamPos.copy(worldPos).normalize().multiplyScalar(zoomDistance);
    startCamPos.copy(camera.position);

    glideProgress = 0;
    isGliding = true;

    // Halt gliding immediately if user touches or drags the globe
    controls.removeEventListener('start', onControlsStart);
    controls.addEventListener('start', onControlsStart);

    // Highlight selected boundary ring opacity
    boundaryLines.forEach((line, idx) => {
      const mat = line.material as THREE.LineBasicMaterial;
      mat.opacity = idx === featureIndex ? 1.0 : 0.4;
    });
  }

  // 6. Scene Animation Update
  function updateScene(delta: number, elapsed: number) {
    // Pulse beacon pin meshes
    const pulseScale = 1 + Math.sin(elapsed * 4) * 0.18;
    for (const pin of pinMeshes) {
      pin.scale.set(pulseScale, pulseScale, pulseScale);
    }

    // Step camera glide interpolation
    if (isGliding) {
      glideProgress += delta / 1.2; // ~1.2s smooth ease-out lerp
      if (glideProgress >= 1.0) {
        glideProgress = 1.0;
        isGliding = false;
        controls.removeEventListener('start', onControlsStart);
        currentOnComplete?.();
      }
      const t = easeOutCubic(glideProgress);
      camera.position.lerpVectors(startCamPos, targetCamPos, t);
      controls.target.set(0, 0, 0);
      controls.update();
    } else if (activeFeatureIndex === -1) {
      // Gentle idle globe rotation
      planetGroup.rotation.y += 0.02 * delta;
    }

    // Gentle Earth cloud rotation
    if (cloudsMesh) {
      cloudsMesh.rotation.y += 0.025 * delta;
    }
  }

  // 7. Raycasting Helper
  function raycastFeaturePins(
    event: PointerEvent | MouseEvent,
    container: HTMLElement
  ): number | null {
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersects = raycaster.intersectObjects(pinMeshes, false);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (hit.userData && typeof hit.userData.featureIndex === 'number') {
        return hit.userData.featureIndex;
      }
    }

    return null;
  }

  // 8. Disposal & GPU Cleanup
  function dispose() {
    controls.removeEventListener('start', onControlsStart);

    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.LineLoop) {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat) => {
            if ('map' in mat && mat.map) (mat.map as THREE.Texture).dispose();
            mat.dispose();
          });
        } else if (obj.material) {
          const mat = obj.material as THREE.Material & { map?: THREE.Texture };
          if (mat.map) mat.map.dispose();
          mat.dispose();
        }
      }
    });

    globeTexture.dispose();
  }

  return {
    scene,
    pinMeshes,
    focusFeature,
    updateScene,
    dispose,
    raycastFeaturePins,
  };
}
