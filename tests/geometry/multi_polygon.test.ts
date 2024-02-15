import { describe, it } from "vitest";
import { GeoJSONMultiPolygon, GeoJSONMultiPolygonSchema } from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONMultiPolygonTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(GeoJSONMultiPolygonSchema, value);
}

function failGeoJSONMultiPolygonTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(GeoJSONMultiPolygonSchema, value);
}

describe("GeoJSONMultiPolygon", () => {
    const singleGeoJsonMultiPolygon2D: GeoJSONMultiPolygon = {
        type: "MultiPolygon",
        coordinates: [
            [
                [
                    [0.0, 1.0],
                    [2.0, 2.0],
                    [0.0, 2.0],
                    [0.0, 1.0],
                ],
            ],
        ],
    };
    const multiGeoJsonMultiPolygon2D: GeoJSONMultiPolygon = {
        type: "MultiPolygon",
        coordinates: [
            [
                [
                    [0.0, 1.0],
                    [2.0, 2.0],
                    [0.0, 2.0],
                    [0.0, 1.0],
                ],
            ],
            [
                [
                    [5.0, 5.0],
                    [7.5, 7.5],
                    [5.0, 7.5],
                    [5.0, 5.0],
                ],
            ],
        ],
    };
    const singleGeoJsonMultiPolygon3D: GeoJSONMultiPolygon = {
        type: "MultiPolygon",
        coordinates: [
            [
                [
                    [0.0, 1.0, 0.0],
                    [2.0, 2.0, 1.0],
                    [0.0, 2.0, 1.0],
                    [0.0, 1.0, 0.0],
                ],
            ],
        ],
    };

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
        passGeoJSONMultiPolygonTest({
            ...singleGeoJsonMultiPolygon2D,
            bbox: [0.0, 1.0, 2.0, 2.0],
        });
    });
    it("allows a 2D multi-polygon with multiple polygons and bbox", () => {
        passGeoJSONMultiPolygonTest({
            ...multiGeoJsonMultiPolygon2D,
            bbox: [0.0, 1.0, 7.5, 7.5],
        });
    });
    it("allows a 3D multi-polygon with one polygon and bbox", () => {
        passGeoJSONMultiPolygonTest({
            ...singleGeoJsonMultiPolygon3D,
            bbox: [0.0, 1.0, 0.0, 2.0, 2.0, 1.0],
        });
    });
    it("allows a multi-polygon and preserves extra keys", () => {
        passGeoJSONMultiPolygonTest({
            ...singleGeoJsonMultiPolygon2D,
            extraKey: "extra",
        });
    });

    it("does not allow a multi-polygon without coordinates", () => {
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
            coordinates: [
                [
                    [
                        [0.0, 1.0],
                        [2.0, 2.0],
                        [0.0, 2.0],
                        [0.0, 1.0],
                    ],
                ],
                [
                    [
                        [5.0, 5.0],
                        [7.5, 7.5, 0.0],
                        [5.0, 7.5],
                        [5.0, 5.0],
                    ],
                ],
            ],
        });
    });
    it("does not allow a multi-polygon with incorrect bbox", () => {
        failGeoJSONMultiPolygonTest({
            ...singleGeoJsonMultiPolygon2D,
            bbox: [30, 10, 20, 100],
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
});
