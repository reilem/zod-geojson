import { describe, expect, it } from "@jest/globals";
import { ZodError } from "zod";
import { geoJsonFeaturePolygon2D } from "../examples/feature";
import { multiGeoJsonFeatureCollection2D } from "../examples/feature_collection";
import { geoJsonPoint3D } from "../examples/geometry/point";
import { GeoJSON2DSchema, GeoJSON3DSchema, GeoJSONSchema } from "../src";

describe("GeoJSONSchema", () => {
    it("allows a basic geometry", () => {
        expect(GeoJSONSchema.parse(geoJsonPoint3D)).toEqual(geoJsonPoint3D);
    });
    it("allows a basic feature", () => {
        expect(GeoJSONSchema.parse(geoJsonFeaturePolygon2D)).toEqual(geoJsonFeaturePolygon2D);
    });
    it("allows a basic feature collection", () => {
        expect(GeoJSONSchema.parse(multiGeoJsonFeatureCollection2D)).toEqual(multiGeoJsonFeatureCollection2D);
    });

    it("does not allow a geojson with invalid type", () => {
        expect(() => GeoJSONSchema.parse({ type: "SkippityBoop" })).toThrow(ZodError);
    });

    describe("2D", () => {
        it("allows a 2D geojson", () => {
            expect(GeoJSON2DSchema.parse(geoJsonFeaturePolygon2D)).toEqual(geoJsonFeaturePolygon2D);
        });
        it("does not allow a 3D geojson", () => {
            expect(() => GeoJSON2DSchema.parse(geoJsonPoint3D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D geojson", () => {
            expect(GeoJSON3DSchema.parse(geoJsonPoint3D)).toEqual(geoJsonPoint3D);
        });
        it("does not allow a 2D geojson", () => {
            expect(() => GeoJSON3DSchema.parse(geoJsonFeaturePolygon2D)).toThrow(ZodError);
        });
    });
});
