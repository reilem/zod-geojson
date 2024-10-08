import { describe, expect, it } from "@jest/globals";
import { ZodError } from "zod";
import {
    geoJsonLineString2D,
    geoJsonLineString2DWithBbox,
    geoJsonLineString3D,
    geoJsonLineString3DWithBbox,
} from "../../examples/geometry/line_string";
import { GeoJSON2DLineStringSchema, GeoJSON3DLineStringSchema, GeoJSONLineStringSchema } from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONLineStringTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(GeoJSONLineStringSchema, value);
}

function failGeoJSONLineStringTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(GeoJSONLineStringSchema, value);
}

describe("GeoJSONLineString", () => {
    it("allows a 2D line string", () => {
        passGeoJSONLineStringTest(geoJsonLineString2D);
    });
    it("allows a 3D line string", () => {
        passGeoJSONLineStringTest(geoJsonLineString3D);
    });
    it("allows 2D line string with valid bbox", () => {
        passGeoJSONLineStringTest(geoJsonLineString2DWithBbox);
    });
    it("allows 3D line string with valid bbox", () => {
        passGeoJSONLineStringTest(geoJsonLineString3DWithBbox);
    });
    it("allows a line string and preserves extra keys", () => {
        const geoJsonLineStringWithExtraKeys = {
            ...geoJsonLineString2D,
            extraKey: "extra",
        };
        passGeoJSONLineStringTest(geoJsonLineStringWithExtraKeys);
    });

    it("does not allow a 1D line string", () => {
        failGeoJSONLineStringTest({ type: "LineString", coordinates: [[0.0], [1.0]] });
    });
    it("does not allow a line string with empty coordinates", () => {
        failGeoJSONLineStringTest({ type: "LineString", coordinates: [] });
    });
    it("does not allow a line string without coordinates key", () => {
        failGeoJSONLineStringTest({ type: "LineString" });
    });
    it("does not allow a line string with the geometry key", () => {
        failGeoJSONLineStringTest({ ...geoJsonLineString2D, geometry: {} });
    });
    it("does not allow a line string with the properties key", () => {
        failGeoJSONLineStringTest({ ...geoJsonLineString2D, properties: {} });
    });
    it("does not allow a line string with the features key", () => {
        failGeoJSONLineStringTest({ ...geoJsonLineString2D, features: [] });
    });
    it("does not allow a line string with the geometries key", () => {
        failGeoJSONLineStringTest({ ...geoJsonLineString2D, geometries: [] });
    });
    it("does not allow line string with invalid coordinates", () => {
        failGeoJSONLineStringTest({
            ...geoJsonLineString2D,
            coordinates: [2.0],
        });
    });
    it("does not allow line string with insufficient coordinates", () => {
        failGeoJSONLineStringTest({
            ...geoJsonLineString2D,
            coordinates: [[1.0, 2.0, 3.0]],
        });
    });
    it("does not allow line string with inconsistent position dimensions", () => {
        failGeoJSONLineStringTest({
            ...geoJsonLineString2D,
            coordinates: [
                [0, 0],
                [1, 2, 3],
                [4, 5, 6, 7],
            ],
        });
    });
    it("does not allow a 2D line string with a non-overlapping bbox", () => {
        // This bbox is completely outside and somewhere else from the expected bbox
        failGeoJSONLineStringTest({
            ...geoJsonLineString2D,
            bbox: [30, 10, 20, 100],
        });
    });
    it("does not allow a 2D line string with an intersecting bbox", () => {
        // This bbox intersects with the expected bbox
        failGeoJSONLineStringTest({
            ...geoJsonLineString2D,
            bbox: [0.0, 1.0, 2.0, 3.0],
        });
    });
    it("does not allow a 2D line string with a circumscribed bbox", () => {
        // This bbox completely encompasses the expected bbox
        failGeoJSONLineStringTest({
            ...geoJsonLineString2D,
            bbox: [0.0, 1.0, 4.0, 5.0],
        });
    });
    it("does not allow a 3D line string with an inscribed bbox", () => {
        // This bbox is fully enclosed within the expected bbox
        failGeoJSONLineStringTest({
            ...geoJsonLineString3D,
            bbox: [5.0, 3.0, 1.0, 15.0, 8.0, 1.5],
        });
    });
    it("does not allow line string with invalid bbox dimensions", () => {
        failGeoJSONLineStringTest({
            ...geoJsonLineString2D,
            bbox: [1.0, 2.0, 0.0, 3.0, 4.0, 0.0],
        });
    });
    it("does not allow line string with badly formatted bbox", () => {
        failGeoJSONLineStringTest({
            ...geoJsonLineString2D,
            bbox: ["badformat"],
        });
    });

    describe("2D", () => {
        it("allows a 2D line string", () => {
            expect(GeoJSON2DLineStringSchema.parse(geoJsonLineString2D)).toEqual(geoJsonLineString2D);
        });
        it("does not allow a 3D line string", () => {
            expect(() => GeoJSON2DLineStringSchema.parse(geoJsonLineString3D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D line string", () => {
            expect(GeoJSON3DLineStringSchema.parse(geoJsonLineString3D)).toEqual(geoJsonLineString3D);
        });
        it("does not allow a 2D line string", () => {
            expect(() => GeoJSON3DLineStringSchema.parse(geoJsonLineString2D)).toThrow(ZodError);
        });
    });
});
