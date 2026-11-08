import * as THREE from 'three';
import { latLonToVector3 } from '@/lib/kids/planets';

/**
 * Generates an array of 3D vector points forming a closed spherical boundary ring
 * around a celestial landmark coordinate.
 *
 * Uses the spherical destination point formula with subtle fractal scarp jitter,
 * elevated slightly above the sphere surface to avoid Z-fighting.
 *
 * @param centerLat Center latitude in degrees [-90..90]
 * @param centerLon Center longitude in degrees [-180..180]
 * @param radiusDeg Visual radius in degrees along the spherical surface
 * @param sphereRadius Base sphere radius
 * @param segments Number of line segments (default 84)
 * @returns Array of (segments + 1) THREE.Vector3 points forming a closed loop
 */
export function generateBoundaryPoints(
  centerLat: number,
  centerLon: number,
  radiusDeg: number,
  sphereRadius: number,
  segments: number = 84
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const elevation = sphereRadius + 0.015; // Raised slightly to prevent Z-fighting per D-04/T-10-01
  const numSegments = Math.max(3, segments);

  const dRad = radiusDeg * (Math.PI / 180);
  const lat1 = centerLat * (Math.PI / 180);
  const lon1 = centerLon * (Math.PI / 180);

  const cosLat1 = Math.cos(lat1);
  const sinLat1 = Math.sin(lat1);

  for (let i = 0; i <= numSegments; i++) {
    const bearing = (i / numSegments) * Math.PI * 2;
    // Subtle fractal perturbation for natural geological scarp outline
    const jitter = 1 + (Math.sin(bearing * 6) * 0.04 + Math.cos(bearing * 9) * 0.03);
    const currentDist = dRad * jitter;

    let degLat: number;
    let degLon: number;

    if (Math.abs(cosLat1) < 1e-7) {
      // Polar coordinates stability handling
      degLat = centerLat > 0 ? 90 - (currentDist * 180 / Math.PI) : -90 + (currentDist * 180 / Math.PI);
      degLon = centerLon + (bearing * 180 / Math.PI);
    } else {
      const sinLat = sinLat1 * Math.cos(currentDist) + cosLat1 * Math.sin(currentDist) * Math.cos(bearing);
      const clampedSinLat = Math.max(-1, Math.min(1, sinLat));
      const lat2 = Math.asin(clampedSinLat);
      const y = Math.sin(bearing) * Math.sin(currentDist) * cosLat1;
      const x = Math.cos(currentDist) - sinLat1 * clampedSinLat;
      const lon2 = lon1 + Math.atan2(y, x);

      degLat = lat2 * (180 / Math.PI);
      degLon = lon2 * (180 / Math.PI);
    }

    const v = latLonToVector3(degLat, degLon, elevation);
    points.push(new THREE.Vector3(v.x, v.y, v.z));
  }

  return points;
}

/**
 * Standard cubic ease-out easing function.
 * Smoothly decelerates towards the end of camera glide transitions.
 *
 * @param t Progress value between 0 and 1
 * @returns Eased progress value between 0 and 1
 */
export function easeOutCubic(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - clamped, 3);
}

/**
 * Normalizes an angle in radians into the range [0, 2 * PI).
 *
 * @param angleRad Angle in radians
 * @returns Normalized angle in [0, 2 * PI)
 */
export function normalizeAngle(angleRad: number): number {
  const twoPi = Math.PI * 2;
  const rem = angleRad % twoPi;
  return rem < 0 ? rem + twoPi : (rem === 0 ? 0 : rem);
}
