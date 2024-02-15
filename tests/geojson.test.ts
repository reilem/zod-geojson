import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { geoJsonFeaturePolygon2D } from "../examples/feature";
import { multiGeoJsonFeatureCollection } from "../examples/feature_collection";
import { geoJsonPoint3D } from "../examples/geometry/point";
import { GeoJSONSchema } from "../src";

describe("GeoJSONSchema", () => {
    it("allows a basic geometry", () => {
        expect(GeoJSONSchema.parse(geoJsonPoint3D)).toEqual(geoJsonPoint3D);
    });
    it("allows a basic feature", () => {
        expect(GeoJSONSchema.parse(geoJsonFeaturePolygon2D)).toEqual(geoJsonFeaturePolygon2D);
    });
    it("allows a basic feature collection", () => {
        expect(GeoJSONSchema.parse(multiGeoJsonFeatureCollection)).toEqual(multiGeoJsonFeatureCollection);
    });

    it("does not allow a geojson with invalid type", () => {
        expect(() => GeoJSONSchema.parse({ type: "SkippityBoop" })).toThrow(ZodError);
    });
});
