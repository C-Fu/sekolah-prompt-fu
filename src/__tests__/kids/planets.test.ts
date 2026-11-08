import { describe, it, expect } from "vitest";
import {
  PLANET_WORLDS,
  latLonToVector3,
  getPlanetWorld,
  getAllPlanetFeatures,
  getFeatureBySlug,
  getFeaturesByPlanet,
  type PlanetId,
  type SubjectId,
} from "@/lib/kids/planets";

describe("Planetary Schema & Cartography", () => {
  describe("PLANET_WORLDS Subject Alignment (D-01)", () => {
    it("contains exactly 5 worlds with correct IDs and subject mappings", () => {
      expect(PLANET_WORLDS).toHaveLength(5);

      const expectedPlanets: Array<{
        id: PlanetId;
        subjectId: SubjectId;
        celestialBody: string;
        celestialBodyMs: string;
      }> = [
        {
          id: "earth-prompting",
          subjectId: "prompting",
          celestialBody: "Earth",
          celestialBodyMs: "Bumi",
        },
        {
          id: "moon-bm",
          subjectId: "bm",
          celestialBody: "Moon",
          celestialBodyMs: "Bulan",
        },
        {
          id: "mars-english",
          subjectId: "english",
          celestialBody: "Mars",
          celestialBodyMs: "Marikh",
        },
        {
          id: "venus-matematik",
          subjectId: "matematik",
          celestialBody: "Venus",
          celestialBodyMs: "Zuhrah",
        },
        {
          id: "mercury-moral",
          subjectId: "moral",
          celestialBody: "Mercury",
          celestialBodyMs: "Utarid",
        },
      ];

      for (const expected of expectedPlanets) {
        const planet = PLANET_WORLDS.find((p) => p.id === expected.id);
        expect(planet, `Planet with id ${expected.id} should exist`).toBeDefined();
        expect(planet?.subjectId).toBe(expected.subjectId);
        expect(planet?.celestialBody).toBe(expected.celestialBody);
        expect(planet?.celestialBodyMs).toBe(expected.celestialBodyMs);
      }
    });

    it("has unique planet IDs and valid order sequences (1 to 5)", () => {
      const ids = PLANET_WORLDS.map((p) => p.id);
      expect(new Set(ids).size).toBe(5);

      const orders = PLANET_WORLDS.map((p) => p.order);
      expect(orders.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("Geological Features and Year Mapping (D-03)", () => {
    it("defines exactly 7 features for each of the 5 planets (35 features total)", () => {
      let totalFeatures = 0;

      for (const planet of PLANET_WORLDS) {
        expect(planet.features, `Planet ${planet.id} must have 7 features`).toHaveLength(7);
        totalFeatures += planet.features.length;

        // Verify feature numbers 1 to 7
        const numbers = planet.features.map((f) => f.featureNumber);
        expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7]);

        // Verify years: features 1-6 map to year 1-6, feature 7 is year 6 boss
        for (let i = 0; i < 6; i++) {
          expect(planet.features[i].year).toBe(i + 1);
          expect(planet.features[i].isFinalBoss).toBe(false);
        }

        const feature7 = planet.features[6];
        expect(feature7.year).toBe(6);
        expect(feature7.isFinalBoss).toBe(true);
        expect(feature7.featureNumber).toBe(7);
      }

      expect(totalFeatures).toBe(35);
    });

    it("ensures feature slugs are unique within each planet and non-empty", () => {
      for (const planet of PLANET_WORLDS) {
        const slugs = planet.features.map((f) => f.id);
        expect(new Set(slugs).size).toBe(7);

        for (const feature of planet.features) {
          expect(feature.id).toMatch(/^[a-z0-9-]+$/);
        }
      }
    });
  });

  describe("Bilingual Metadata & Coordinate Validation (D-02, D-05)", () => {
    it("contains valid coordinate limits for all 35 features", () => {
      for (const planet of PLANET_WORLDS) {
        for (const feature of planet.features) {
          const { lat, lon } = feature.coordinates;
          expect(lat, `Feature ${feature.id} lat should be in [-90, 90]`).toBeGreaterThanOrEqual(-90);
          expect(lat, `Feature ${feature.id} lat should be in [-90, 90]`).toBeLessThanOrEqual(90);
          expect(lon, `Feature ${feature.id} lon should be in [-180, 180]`).toBeGreaterThanOrEqual(-180);
          expect(lon, `Feature ${feature.id} lon should be in [-180, 180]`).toBeLessThanOrEqual(180);
        }
      }
    });

    it("contains non-empty bilingual fields for all 35 features", () => {
      for (const planet of PLANET_WORLDS) {
        for (const feature of planet.features) {
          expect(feature.name.trim().length, `Feature ${feature.id} name should not be empty`).toBeGreaterThan(0);
          expect(feature.nameMs.trim().length, `Feature ${feature.id} nameMs should not be empty`).toBeGreaterThan(0);
          expect(feature.badge.trim().length, `Feature ${feature.id} badge should not be empty`).toBeGreaterThan(0);
          expect(feature.badgeMs.trim().length, `Feature ${feature.id} badgeMs should not be empty`).toBeGreaterThan(0);
          expect(feature.description.trim().length, `Feature ${feature.id} description should not be empty`).toBeGreaterThan(0);
          expect(feature.descriptionMs.trim().length, `Feature ${feature.id} descriptionMs should not be empty`).toBeGreaterThan(0);
          expect(feature.geologicalProfile.trim().length, `Feature ${feature.id} geologicalProfile should not be empty`).toBeGreaterThan(0);
          expect(feature.geologicalProfileMs.trim().length, `Feature ${feature.id} geologicalProfileMs should not be empty`).toBeGreaterThan(0);
        }
      }
    });

    it("contains valid planet theme and accent colors per D-02", () => {
      const colorRegex = /^#[0-9A-Fa-f]{6}$/;
      for (const planet of PLANET_WORLDS) {
        expect(planet.themeColor).toMatch(colorRegex);
        expect(planet.accentColor).toMatch(colorRegex);
        expect(planet.tagline.trim().length).toBeGreaterThan(0);
        expect(planet.taglineMs.trim().length).toBeGreaterThan(0);
      }
    });
  });

  describe("latLonToVector3 Cartographic Math", () => {
    it("converts North Pole (90, 0) to (0, R, 0)", () => {
      const v = latLonToVector3(90, 0, 1.0);
      expect(v.x).toBeCloseTo(0, 5);
      expect(v.y).toBeCloseTo(1.0, 5);
      expect(v.z).toBeCloseTo(0, 5);
    });

    it("converts South Pole (-90, 0) to (0, -R, 0)", () => {
      const v = latLonToVector3(-90, 0, 1.0);
      expect(v.x).toBeCloseTo(0, 5);
      expect(v.y).toBeCloseTo(-1.0, 5);
      expect(v.z).toBeCloseTo(0, 5);
    });

    it("converts Equator prime meridian (0, 0) to point with magnitude R", () => {
      const v = latLonToVector3(0, 0, 2.5);
      const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
      expect(mag).toBeCloseTo(2.5, 5);
      expect(v.y).toBeCloseTo(0, 5);
    });

    it("maintains accurate magnitude R across arbitrary coordinates", () => {
      const testCases = [
        { lat: 45, lon: 45, r: 1.0 },
        { lat: -30, lon: 120, r: 3.5 },
        { lat: 18.65, lon: -133.8, r: 10 },
        { lat: -62, lon: 20, r: 0.5 },
      ];

      for (const { lat, lon, r } of testCases) {
        const v = latLonToVector3(lat, lon, r);
        const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        expect(mag).toBeCloseTo(r, 5);
      }
    });
  });

  describe("Query and Lookup Helpers", () => {
    it("getPlanetWorld returns correct planet or undefined", () => {
      const moon = getPlanetWorld("moon-bm");
      expect(moon).toBeDefined();
      expect(moon?.celestialBody).toBe("Moon");
      expect(moon?.subjectId).toBe("bm");

      const unknown = getPlanetWorld("unknown-planet");
      expect(unknown).toBeUndefined();
    });

    it("getAllPlanetFeatures returns exactly 35 features", () => {
      const allFeatures = getAllPlanetFeatures();
      expect(allFeatures).toHaveLength(35);
    });

    it("getFeatureBySlug retrieves the exact feature across planets", () => {
      const feature = getFeatureBySlug("moon-bm", "oceanus-procellarum");
      expect(feature).toBeDefined();
      expect(feature?.name).toContain("Oceanus Procellarum");
      expect(feature?.year).toBe(1);

      const nonExistent = getFeatureBySlug("moon-bm", "non-existent-feature");
      expect(nonExistent).toBeUndefined();

      const wrongPlanet = getFeatureBySlug("mars-english", "oceanus-procellarum");
      expect(wrongPlanet).toBeUndefined();
    });

    it("getFeaturesByPlanet returns 7 features for a valid planet", () => {
      const earthFeatures = getFeaturesByPlanet("earth-prompting");
      expect(earthFeatures).toHaveLength(7);
      expect(earthFeatures[6].isFinalBoss).toBe(true);

      const emptyFeatures = getFeaturesByPlanet("invalid-planet");
      expect(emptyFeatures).toEqual([]);
    });
  });
});
