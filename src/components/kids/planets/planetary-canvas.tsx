'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ExplorerMode } from './planetary-types';
import type { PlanetId } from '@/lib/kids/planets';

export interface PlanetaryCanvasContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  container: HTMLDivElement;
}

export interface PlanetaryCanvasProps {
  mode?: ExplorerMode;
  planetId?: PlanetId;
  onSelectPlanet?: (planetId: PlanetId) => void;
  onSelectFeature?: (featureIndex: number) => void;
  onInit?: (ctx: PlanetaryCanvasContext) => (() => void) | void;
  onRenderFrame?: (ctx: PlanetaryCanvasContext, delta: number) => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * SSR-safe dynamic Three.js canvas container.
 *
 * Encapsulates WebGLRenderer, PerspectiveCamera, OrbitControls, ResizeObserver,
 * and requestAnimationFrame render loop with complete GPU resource disposal upon unmount (D-04).
 */
export function PlanetaryCanvas({
  mode = 'solar-system',
  planetId,
  onInit,
  onRenderFrame,
  className = '',
  children,
}: PlanetaryCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onInitRef = useRef(onInit);
  const onRenderFrameRef = useRef(onRenderFrame);

  // Keep callback refs updated across re-renders
  useEffect(() => {
    onInitRef.current = onInit;
  }, [onInit]);

  useEffect(() => {
    onRenderFrameRef.current = onRenderFrame;
  }, [onRenderFrame]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const initialWidth = container.clientWidth || 800;
    const initialHeight = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(
      45,
      initialWidth / initialHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);

    // 2. WebGLRenderer with defensive creation for headless / test environments
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      // In SSR or environments without WebGL support, fail gracefully without crashing
      console.warn('PlanetaryCanvas: WebGL context creation failed or unavailable', err);
      return;
    }

    renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2));
    renderer.setSize(initialWidth, initialHeight);
    container.appendChild(renderer.domElement);

    // 3. OrbitControls with smooth damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 4. Responsive ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width === 0 || height === 0) continue;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    resizeObserver.observe(container);

    // Context for external scene hooks
    const ctx: PlanetaryCanvasContext = {
      scene,
      camera,
      renderer,
      controls,
      container,
    };

    const cleanupInit = onInitRef.current?.(ctx);

    // 5. requestAnimationFrame render loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      controls.update();
      onRenderFrameRef.current?.(ctx, delta);
      renderer.render(scene, camera);
    };
    animate();

    // 6. Rigorous GPU disposal upon unmount per D-04 and T-10-01
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      if (typeof cleanupInit === 'function') {
        cleanupInit();
      }

      controls.dispose();

      // Traverse scene to dispose geometries, materials, and textures
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
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

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mode, planetId]);

  return (
    <div
      ref={containerRef}
      data-testid="planetary-canvas-container"
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
