import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  generateBoundaryPoints,
  easeOutCubic,
  normalizeAngle,
} from '@/components/kids/planets/planetary-math';

describe('planetary-math utilities', () => {
  describe('generateBoundaryPoints', () => {
    it('outputs expected segment count + 1 closing loop point', () => {
      const segments = 84;
      const sphereRadius = 5.0;
      const points = generateBoundaryPoints(18.5, -133.5, 12, sphereRadius, segments);

      expect(points).toHaveLength(segments + 1);
      expect(points[0]).toBeInstanceOf(THREE.Vector3);
    });

    it('places all boundary points at radius equal to sphereRadius + 0.015', () => {
      const sphereRadius = 3.5;
      const expectedRadius = sphereRadius + 0.015;
      const points = generateBoundaryPoints(25.0, 45.0, 10, sphereRadius, 60);

      for (const p of points) {
        expect(Number.isFinite(p.x)).toBe(true);
        expect(Number.isFinite(p.y)).toBe(true);
        expect(Number.isFinite(p.z)).toBe(true);
        const radius = p.length();
        expect(radius).toBeCloseTo(expectedRadius, 4);
      }
    });

    it('maintains mathematical stability at extreme North Pole (lat 90)', () => {
      const sphereRadius = 2.0;
      const expectedRadius = sphereRadius + 0.015;
      const points = generateBoundaryPoints(90, 0, 15, sphereRadius, 40);

      expect(points).toHaveLength(41);
      for (const p of points) {
        expect(Number.isNaN(p.x)).toBe(false);
        expect(Number.isNaN(p.y)).toBe(false);
        expect(Number.isNaN(p.z)).toBe(false);
        expect(p.length()).toBeCloseTo(expectedRadius, 4);
      }
    });

    it('maintains mathematical stability at extreme South Pole (lat -90)', () => {
      const sphereRadius = 2.0;
      const expectedRadius = sphereRadius + 0.015;
      const points = generateBoundaryPoints(-90, 0, 15, sphereRadius, 40);

      expect(points).toHaveLength(41);
      for (const p of points) {
        expect(Number.isNaN(p.x)).toBe(false);
        expect(Number.isNaN(p.y)).toBe(false);
        expect(Number.isNaN(p.z)).toBe(false);
        expect(p.length()).toBeCloseTo(expectedRadius, 4);
      }
    });

    it('closes the loop (first point close to last point)', () => {
      const points = generateBoundaryPoints(0, 0, 20, 4.0, 64);
      const first = points[0];
      const last = points[points.length - 1];

      expect(first.distanceTo(last)).toBeCloseTo(0, 4);
    });
  });

  describe('easeOutCubic', () => {
    it('returns exact boundary values at t=0 and t=1', () => {
      expect(easeOutCubic(0)).toBe(0);
      expect(easeOutCubic(1)).toBe(1);
    });

    it('clamps values outside [0, 1]', () => {
      expect(easeOutCubic(-0.5)).toBe(0);
      expect(easeOutCubic(1.5)).toBe(1);
    });

    it('exhibits strictly concave ease-out curve (fast start, gradual deceleration)', () => {
      const mid = easeOutCubic(0.5);
      // For easeOutCubic: 1 - (1 - 0.5)^3 = 1 - 0.125 = 0.875 > 0.5
      expect(mid).toBe(0.875);

      // Verify monotonic increase
      const step1 = easeOutCubic(0.25);
      const step2 = easeOutCubic(0.5);
      const step3 = easeOutCubic(0.75);

      expect(step1).toBeGreaterThan(0);
      expect(step2).toBeGreaterThan(step1);
      expect(step3).toBeGreaterThan(step2);
      expect(step3).toBeLessThan(1);

      // Verify decreasing first differences (deceleration)
      const diff1 = step2 - step1;
      const diff2 = step3 - step2;
      expect(diff1).toBeGreaterThan(diff2);
    });
  });

  describe('normalizeAngle', () => {
    it('preserves angles already within [0, 2*PI)', () => {
      expect(normalizeAngle(0)).toBe(0);
      expect(normalizeAngle(Math.PI)).toBeCloseTo(Math.PI, 6);
      expect(normalizeAngle(1.5 * Math.PI)).toBeCloseTo(1.5 * Math.PI, 6);
    });

    it('wraps 2*PI to 0', () => {
      expect(normalizeAngle(2 * Math.PI)).toBeCloseTo(0, 6);
    });

    it('normalizes negative angles into positive equivalent [0, 2*PI)', () => {
      expect(normalizeAngle(-Math.PI / 2)).toBeCloseTo(1.5 * Math.PI, 6);
      expect(normalizeAngle(-Math.PI)).toBeCloseTo(Math.PI, 6);
      expect(normalizeAngle(-2 * Math.PI)).toBeCloseTo(0, 6);
    });

    it('wraps angles greater than 2*PI', () => {
      expect(normalizeAngle(2.5 * Math.PI)).toBeCloseTo(0.5 * Math.PI, 6);
      expect(normalizeAngle(5 * Math.PI)).toBeCloseTo(Math.PI, 6);
    });
  });
});
