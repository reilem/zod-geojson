import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { geoJsonPoint3D } from "../examples/geometry/point";
import { GeoJSONFeature, GeoJSONFeatureCollection, GeoJSONSchema } from "../src";

describe("GeoJSONSchema", () => {
    const feature: GeoJSONFeature = {
        type: "Feature",
        properties: {},
        geometry: geoJsonPoint3D,
    };
    const featureCollection: GeoJSONFeatureCollection = {
        type: "FeatureCollection",
        features: [feature],
    };

    it("allows a basic geometry", () => {
        expect(GeoJSONSchema.parse(geoJsonPoint3D)).toEqual(geoJsonPoint3D);
    });
    it("allows a basic feature", () => {
        expect(GeoJSONSchema.parse(feature)).toEqual(feature);
    });
    it("allows a basic feature collection", () => {
        expect(GeoJSONSchema.parse(featureCollection)).toEqual(featureCollection);
    });

    it("does not allow a geojson with invalid type", () => {
        expect(() => GeoJSONSchema.parse({ type: "SkippityBoop" })).toThrow(ZodError);
    });
});
