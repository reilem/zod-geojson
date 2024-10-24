import { describe, expect, it } from "@jest/globals";
import { ZodError } from "zod";
import {
    multiGeoJsonMultiPolygon2D,
    multiGeoJsonMultiPolygon2DWithBbox,
    singleGeoJsonMultiPolygon2D,
    singleGeoJsonMultiPolygon2DWithBbox,
    singleGeoJsonMultiPolygon3D,
    singleGeoJsonMultiPolygon3DWithBbox,
} from "../../examples/geometry/multi_polygon";
import { geoJsonPolygon2D, geoJsonPolygon3D } from "../../examples/geometry/polygon";
import { GeoJSON2DMultiPolygonSchema, GeoJSON3DMultiPolygonSchema, GeoJSONMultiPolygonSchema } from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONMultiPolygonTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(GeoJSONMultiPolygonSchema, value);
}

function failGeoJSONMultiPolygonTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(GeoJSONMultiPolygonSchema, value);
}

describe("GeoJSONMultiPolygon", () => {
    it("allows a 2D multi-polygon with one polygon", () => {
        passGeoJSONMultiPolygonTest(singleGeoJsonMultiPolygon2D);
    });
    it("allows a 2D multi-polygon with multiple polygons", () => {
        passGeoJSONMultiPolygonTest(multiGeoJsonMultiPolygon2D);
    });
    it("allows a 3D multi-polygon with one polygon", () => {
        passGeoJSONMultiPolygonTest(singleGeoJsonMultiPolygon3D);
    });
    it("allows a 2D multi-polygon with one polygon and bbox", () => {
        passGeoJSONMultiPolygonTest(singleGeoJsonMultiPolygon2DWithBbox);
    });
    it("allows a 2D multi-polygon with multiple polygons and bbox", () => {
        passGeoJSONMultiPolygonTest(multiGeoJsonMultiPolygon2DWithBbox);
    });
    it("allows a 3D multi-polygon with one polygon and bbox", () => {
        passGeoJSONMultiPolygonTest(singleGeoJsonMultiPolygon3DWithBbox);
    });
    it("allows a multi-polygon and preserves extra keys", () => {
        passGeoJSONMultiPolygonTest({
            ...singleGeoJsonMultiPolygon2D,
            extraKey: "extra",
        });
    });
    it("allows a multi-polygon with empty coordinates", () => {
        passGeoJSONMultiPolygonTest({ type: "MultiPolygon", coordinates: [] });
    });

    it("does not allow a 1D multi-polygon", () => {
        failGeoJSONMultiPolygonTest({ type: "MultiPolygon", coordinates: [[[[0.0], [1.0], [0.0], [0.0]]]] });
    });
    it("does not allow a multi-polygon without coordinates key", () => {
        failGeoJSONMultiPolygonTest({ type: "MultiPolygon" });
    });
    it("does not allow a multi-polygon with the geometry key", () => {
        failGeoJSONMultiPolygonTest({ ...singleGeoJsonMultiPolygon2D, geometry: {} });
    });
    it("does not allow a multi-polygon with the properties key", () => {
        failGeoJSONMultiPolygonTest({ ...singleGeoJsonMultiPolygon2D, properties: {} });
    });
    it("does not allow a multi-polygon with the features key", () => {
        failGeoJSONMultiPolygonTest({ ...singleGeoJsonMultiPolygon2D, features: [] });
    });
    it("does not allow a multi-polygon with the geometries key", () => {
        failGeoJSONMultiPolygonTest({ ...singleGeoJsonMultiPolygon2D, geometries: [] });
    });
    it("does not allow a multi-polygon with a polygon that is not linear ring", () => {
        failGeoJSONMultiPolygonTest({
            ...singleGeoJsonMultiPolygon2D,
            coordinates: [
                [
                    [
                        [0.0, 1.0],
                        [2.0, 2.0],
                        [0.0, 2.0],
                        [-1.0, 1.0],
                    ],
                ],
            ],
        });
    });
    it("does not allow a multi-polygon with a polygon with less than 4 positions", () => {
        failGeoJSONMultiPolygonTest({
            ...singleGeoJsonMultiPolygon2D,
            coordinates: [
                [
                    [
                        [0.0, 1.0],
                        [2.0, 2.0],
                        [0.0, 1.0],
                    ],
                ],
            ],
        });
    });
    it("does not allow a multi-polygon with invalid coordinates", () => {
        failGeoJSONMultiPolygonTest({
            ...singleGeoJsonMultiPolygon2D,
            coordinates: [
                // Not nested deep enough
                [
                    [0.0, 1.0],
                    [2.0, 2.0],
                    [0.0, 2.0],
                    [0.0, 1.0],
                ],
            ],
        });
    });
    it("does not allow a multi-polygon with inconsistent position dimensions", () => {
        failGeoJSONMultiPolygonTest({
            ...singleGeoJsonMultiPolygon2D,
            coordinates: [
                [
                    [
                        [0.0, 1.0],
                        [2.0, 2.0],
                        [0.0, 2.0, 0.0],
                        [0.0, 1.0],
                    ],
                ],
            ],
        });
    });
    it("does not allow a multi-polygon with inconsistent position dimensions across polygons", () => {
        failGeoJSONMultiPolygonTest({
            ...singleGeoJsonMultiPolygon2D,
            coordinates: [geoJsonPolygon2D, geoJsonPolygon3D],
        });
    });
    it("does not allow a 2D multi-polygon with a non-overlapping bbox", () => {
        // This bbox is completely outside and somewhere else from the expected bbox
        failGeoJSONMultiPolygonTest({
            ...multiGeoJsonMultiPolygon2D,
            bbox: [30, 10, 20, 100],
        });
    });
    it("does not allow a 2D multi-polygon with an intersecting bbox", () => {
        // This bbox intersects with the expected bbox
        failGeoJSONMultiPolygonTest({
            ...multiGeoJsonMultiPolygon2D,
            bbox: [-1.0, -1.0, 9.0, 9.0],
        });
    });
    it("does not allow a 2D multi-polygon with a circumscribed bbox", () => {
        // This bbox completely encompasses the expected bbox
        failGeoJSONMultiPolygonTest({
            ...multiGeoJsonMultiPolygon2D,
            bbox: [-1.0, -1.0, 11.0, 11.0],
        });
    });
    it("does not allow a 3D multi-polygon with an inscribed bbox", () => {
        // This bbox is fully enclosed within the expected bbox
        failGeoJSONMultiPolygonTest({
            ...singleGeoJsonMultiPolygon3D,
            bbox: [0.25, 0.5, 1.0, 0.75, 1.0, 1.5],
        });
    });
    it("does not allow a multi-polygon with invalid bbox dimensions", () => {
        failGeoJSONMultiPolygonTest({
            ...singleGeoJsonMultiPolygon2D,
            bbox: [0.0, 1.0, 0.0, 2.0, 2.0, 0.0],
        });
    });
    it("does not allow a multi-polygon with badly formatted bbox", () => {
        failGeoJSONMultiPolygonTest({
            ...singleGeoJsonMultiPolygon2D,
            bbox: ["hello"],
        });
    });

    describe("2D", () => {
        it("allows a 2D multi-polygon", () => {
            expect(GeoJSON2DMultiPolygonSchema.parse(singleGeoJsonMultiPolygon2D)).toEqual(singleGeoJsonMultiPolygon2D);
        });
        it("does not allow a 3D multi-polygon", () => {
            expect(() => GeoJSON2DMultiPolygonSchema.parse(singleGeoJsonMultiPolygon3D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D multi-polygon", () => {
            expect(GeoJSON3DMultiPolygonSchema.parse(singleGeoJsonMultiPolygon3D)).toEqual(singleGeoJsonMultiPolygon3D);
        });
        it("does not allow a 2D multi-polygon", () => {
            expect(() => GeoJSON3DMultiPolygonSchema.parse(singleGeoJsonMultiPolygon2D)).toThrow(ZodError);
        });
    });
});
