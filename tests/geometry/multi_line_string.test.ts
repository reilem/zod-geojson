import { describe, expect, it } from "@jest/globals";
import { ZodError } from "zod";
import { geoJsonLineString2D, geoJsonLineString3D } from "../../examples/geometry/line_string";
import {
    multiGeoJsonMultiLineString2D,
    multiGeoJsonMultiLineString2DWithBbox,
    singleGeoJsonMultiLineString2D,
    singleGeoJsonMultiLineString2DWithBbox,
    singleGeoJsonMultiLineString3D,
    singleGeoJsonMultiLineString3DWithBbox,
} from "../../examples/geometry/multi_line_string";
import {
    GeoJSON2DMultiLineStringSchema,
    GeoJSON3DMultiLineStringSchema,
    GeoJSONMultiLineStringSchema,
} from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONMultiLineStringTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(GeoJSONMultiLineStringSchema, value);
}

function failGeoJSONMultiLineStringTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(GeoJSONMultiLineStringSchema, value);
}

describe("GeoJSONMultiLineString", () => {
    it("allows a 2D multi-line string with one line", () => {
        passGeoJSONMultiLineStringTest(singleGeoJsonMultiLineString2D);
    });
    it("allows a 2D multi-line string with multiple lines", () => {
        passGeoJSONMultiLineStringTest(multiGeoJsonMultiLineString2D);
    });
    it("allows a 3D multi-line string", () => {
        passGeoJSONMultiLineStringTest(singleGeoJsonMultiLineString3D);
    });
    it("allows a 2D multi-line string with one line and bbox", () => {
        passGeoJSONMultiLineStringTest(singleGeoJsonMultiLineString2DWithBbox);
    });
    it("allows a 2D multi-line string with multiples and with bbox", () => {
        passGeoJSONMultiLineStringTest(multiGeoJsonMultiLineString2DWithBbox);
    });
    it("allows a 3D multi-line string with bbox", () => {
        passGeoJSONMultiLineStringTest(singleGeoJsonMultiLineString3DWithBbox);
    });
    it("allows a multi-line string and preserves extra keys", () => {
        passGeoJSONMultiLineStringTest({
            ...singleGeoJsonMultiLineString2D,
            extraKey: "extra",
        });
    });
    it("allows a multi-line string with empty coordinates", () => {
        passGeoJSONMultiLineStringTest({ type: "MultiLineString", coordinates: [] });
    });

    it("does not allow a 1D multi-line string", () => {
        failGeoJSONMultiLineStringTest({ type: "MultiLineString", coordinates: [[[0.0], [1.0]]] });
    });
    it("does not allow a multi-line string without coordinates key", () => {
        failGeoJSONMultiLineStringTest({ type: "MultiLineString" });
    });
    it("does not allow a multi-line string with the geometry key", () => {
        failGeoJSONMultiLineStringTest({ ...singleGeoJsonMultiLineString2D, geometry: {} });
    });
    it("does not allow a multi-line string with the properties key", () => {
        failGeoJSONMultiLineStringTest({ ...singleGeoJsonMultiLineString2D, properties: {} });
    });
    it("does not allow a multi-line string with the features key", () => {
        failGeoJSONMultiLineStringTest({ ...singleGeoJsonMultiLineString2D, features: [] });
    });
    it("does not allow a multi-line string with the geometries key", () => {
        failGeoJSONMultiLineStringTest({ ...singleGeoJsonMultiLineString2D, geometries: [] });
    });
    it("does not allow a multi-line string with invalid coordinates", () => {
        failGeoJSONMultiLineStringTest({
            type: "MultiLineString",
            coordinates: [
                // Not nested deep enough
                [0.0, 0.0],
                [10.0, 10.0],
            ],
        });
    });
    it("does not allow a multi-line string with inconsistent position dimensions", () => {
        failGeoJSONMultiLineStringTest({
            ...singleGeoJsonMultiLineString2D,
            coordinates: [
                [
                    [0.0, 0.0],
                    [10.0, 10.0, 0.0],
                ],
            ],
        });
    });
    it("does not allow a multi-line string with inconsistent position dimensions across lines", () => {
        failGeoJSONMultiLineStringTest({
            ...singleGeoJsonMultiLineString2D,
            coordinates: [geoJsonLineString2D, geoJsonLineString3D],
        });
    });
    it("does not allow a 2D multi-line string with a non-overlapping bbox", () => {
        // This bbox is completely outside and somewhere else from the expected bbox
        failGeoJSONMultiLineStringTest({
            ...multiGeoJsonMultiLineString2D,
            bbox: [40, 40, 80, 80],
        });
    });
    it("does not allow a 2D multi-line string with an intersecting bbox", () => {
        // This bbox intersects with the expected bbox
        failGeoJSONMultiLineStringTest({
            ...multiGeoJsonMultiLineString2D,
            bbox: [0.0, 1.0, 25.0, 25.0],
        });
    });
    it("does not allow a 2D multi-line string with a circumscribed bbox", () => {
        // This bbox completely encompasses the expected bbox
        failGeoJSONMultiLineStringTest({
            ...multiGeoJsonMultiLineString2D,
            bbox: [0.0, 1.0, 31.0, 31.0],
        });
    });
    it("does not allow a 3D multi-line string with an inscribed bbox", () => {
        // This bbox is fully enclosed within the expected bbox
        failGeoJSONMultiLineStringTest({
            ...singleGeoJsonMultiLineString3D,
            bbox: [5.0, 3.0, 1.0, 15.0, 8.0, 1.5],
        });
    });
    it("does not allow a multi-line string with invalid bbox dimensions", () => {
        failGeoJSONMultiLineStringTest({
            ...singleGeoJsonMultiLineString2D,
            bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 0.0],
        });
    });
    it("does not allow a multi-line string with badly formatted bbox", () => {
        failGeoJSONMultiLineStringTest({
            ...singleGeoJsonMultiLineString2D,
            bbox: ["hello"],
        });
    });

    describe("2D", () => {
        it("allows a 2D multi-line string", () => {
            expect(GeoJSON2DMultiLineStringSchema.parse(singleGeoJsonMultiLineString2D)).toEqual(
                singleGeoJsonMultiLineString2D,
            );
        });
        it("does not allow a 3D multi-line string", () => {
            expect(() => GeoJSON2DMultiLineStringSchema.parse(singleGeoJsonMultiLineString3D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D multi-line string", () => {
            expect(GeoJSON3DMultiLineStringSchema.parse(singleGeoJsonMultiLineString3D)).toEqual(
                singleGeoJsonMultiLineString3D,
            );
        });
        it("does not allow a 2D multi-line string", () => {
            expect(() => GeoJSON3DMultiLineStringSchema.parse(singleGeoJsonMultiLineString2D)).toThrow(ZodError);
        });
    });
});
