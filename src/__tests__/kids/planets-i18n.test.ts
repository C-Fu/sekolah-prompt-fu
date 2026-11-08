import { describe, it, expect } from "vitest";
import enMessages from "../../../messages/en.json";
import msMessages from "../../../messages/ms.json";
import { PLANET_WORLDS, PlanetId } from "@/lib/kids/planets";

describe("Planetary i18n Dictionary Parity (`kids.planets`)", () => {
  it("defines kids.planets namespace in both messages/en.json and messages/ms.json", () => {
    expect(enMessages).toHaveProperty("kids.planets");
    expect(msMessages).toHaveProperty("kids.planets");
    expect(typeof (enMessages as any).kids.planets).toBe("object");
    expect(typeof (msMessages as any).kids.planets).toBe("object");
  });

  it("mirrors top-level keys symmetrically between en and ms under kids.planets", () => {
    const enPlanets = (enMessages as any).kids.planets;
    const msPlanets = (msMessages as any).kids.planets;

    const expectedKeys = [
      "title",
      "subtitle",
      "hubTitle",
      "explorePlanet",
      "viewCartography",
      "yearBadge",
      "capstoneBadge",
      "backToOrbit",
      "launchMission",
      "lockedFeature",
      "telemetry",
      "worlds",
    ];

    expectedKeys.forEach((key) => {
      expect(enPlanets, `en.json missing kids.planets.${key}`).toHaveProperty(key);
      expect(msPlanets, `ms.json missing kids.planets.${key}`).toHaveProperty(key);
    });

    // Check key symmetry
    expect(Object.keys(enPlanets).sort()).toEqual(Object.keys(msPlanets).sort());
  });

  it("has matching telemetry keys under kids.planets.telemetry", () => {
    const enTelemetry = (enMessages as any).kids.planets.telemetry;
    const msTelemetry = (msMessages as any).kids.planets.telemetry;

    const expectedTelemetryKeys = [
      "coordinates",
      "elevation",
      "geology",
      "objective",
    ];

    expectedTelemetryKeys.forEach((key) => {
      expect(enTelemetry, `en.json missing telemetry.${key}`).toHaveProperty(key);
      expect(msTelemetry, `ms.json missing telemetry.${key}`).toHaveProperty(key);
      expect(typeof enTelemetry[key]).toBe("string");
      expect(typeof msTelemetry[key]).toBe("string");
      expect(enTelemetry[key].trim().length).toBeGreaterThan(0);
      expect(msTelemetry[key].trim().length).toBeGreaterThan(0);
    });

    expect(Object.keys(enTelemetry).sort()).toEqual(Object.keys(msTelemetry).sort());
  });

  it("contains all 5 planetary worlds with non-empty localized title and tagline in en and ms", () => {
    const enWorlds = (enMessages as any).kids.planets.worlds;
    const msWorlds = (msMessages as any).kids.planets.worlds;

    const expectedWorldIds: PlanetId[] = [
      "earth-prompting",
      "moon-bm",
      "mars-english",
      "venus-matematik",
      "mercury-moral",
    ];

    // Assert every world in PLANET_WORLDS exists in both dictionaries
    expect(PLANET_WORLDS.map((w) => w.id).sort()).toEqual(expectedWorldIds.sort());

    expectedWorldIds.forEach((worldId) => {
      expect(enWorlds, `en.json missing kids.planets.worlds.${worldId}`).toHaveProperty(worldId);
      expect(msWorlds, `ms.json missing kids.planets.worlds.${worldId}`).toHaveProperty(worldId);

      const enWorld = enWorlds[worldId];
      const msWorld = msWorlds[worldId];

      expect(enWorld).toHaveProperty("title");
      expect(enWorld).toHaveProperty("tagline");
      expect(msWorld).toHaveProperty("title");
      expect(msWorld).toHaveProperty("tagline");

      expect(typeof enWorld.title).toBe("string");
      expect(typeof enWorld.tagline).toBe("string");
      expect(typeof msWorld.title).toBe("string");
      expect(typeof msWorld.tagline).toBe("string");

      expect(enWorld.title.trim().length).toBeGreaterThan(0);
      expect(enWorld.tagline.trim().length).toBeGreaterThan(0);
      expect(msWorld.title.trim().length).toBeGreaterThan(0);
      expect(msWorld.tagline.trim().length).toBeGreaterThan(0);
    });

    expect(Object.keys(enWorlds).sort()).toEqual(Object.keys(msWorlds).sort());
  });

  it("uses authentic Malay names for planetary bodies in ms.json", () => {
    const msWorlds = (msMessages as any).kids.planets.worlds;

    expect(msWorlds["earth-prompting"].title).toContain("Bumi");
    expect(msWorlds["moon-bm"].title).toContain("Bulan");
    expect(msWorlds["mars-english"].title).toContain("Marikh");
    expect(msWorlds["venus-matematik"].title).toContain("Zuhrah");
    expect(msWorlds["mercury-moral"].title).toContain("Utarid");

    // Ensure no untranslated English body names in ms titles
    expect(msWorlds["earth-prompting"].title).not.toContain("Earth");
    expect(msWorlds["moon-bm"].title).not.toContain("Moon");
    expect(msWorlds["mars-english"].title).not.toContain("Mars");
    expect(msWorlds["venus-matematik"].title).not.toContain("Venus");
    expect(msWorlds["mercury-moral"].title).not.toContain("Mercury");
  });
});
