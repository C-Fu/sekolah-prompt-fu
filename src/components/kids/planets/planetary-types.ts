import * as THREE from 'three';
import type { PlanetId } from '@/lib/kids/planets';

export type ExplorerMode = 'solar-system' | 'planet-cartography';

export interface CameraGlideState {
  startPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  progress: number;
  isGliding: boolean;
}

export interface FeatureSelection {
  planetId: PlanetId;
  featureId: string;
  featureIndex: number;
}

export interface OrbitAnimationConfig {
  dist: number;
  speed: number;
  angle: number;
  mesh: THREE.Mesh;
}
