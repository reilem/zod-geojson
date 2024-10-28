import { describe, expect, it } from "@jest/globals";
import { ZodError } from "zod";
import {
    geoJsonPolygon2D,
    geoJsonPolygon2DWithHole,
    geoJsonPolygon2DWithHoleAndBbox,
    geoJsonPolygon3D,
    geoJsonPolygon4D,
} from "../../examples/geometry/polygon";
import {
    GeoJSON2DPolygon,
    GeoJSON2DPolygonSchema,
    GeoJSON3DPolygon,
    GeoJSON3DPolygonSchema,
    GeoJSONPolygon,
    GeoJSONPolygonSchema,
} from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONPolygonTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([GeoJSONPolygonSchema], value);
}

function passGeoJSON2DPolygonTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([GeoJSONPolygonSchema, GeoJSON2DPolygonSchema], value);
}

function passGeoJSON3DPolygonTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([GeoJSONPolygonSchema, GeoJSON3DPolygonSchema], value);
}

function failGeoJSONPolygonTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest([GeoJSONPolygonSchema, GeoJSON2DPolygonSchema, GeoJSON3DPolygonSchema], value);
}

describe("GeoJSONPolygon", () => {
    it("allows a 2D polygon", () => {
        passGeoJSON2DPolygonTest(geoJsonPolygon2D);
    });
    it("allows a 3D polygon", () => {
        passGeoJSON3DPolygonTest(geoJsonPolygon3D);
    });
    it("allows a 4D polygon", () => {
        passGeoJSONPolygonTest(geoJsonPolygon4D);
    });
    it("allows a 2D polygon with a hole", () => {
        passGeoJSON2DPolygonTest(geoJsonPolygon2DWithHole);
    });
    it("allows a 2D polygon with bbox", () => {
        passGeoJSON2DPolygonTest({
            ...geoJsonPolygon2D,
            bbox: [0.0, 0.0, 1.0, 1.0],
        });
    });
    it("allows a 3D polygon with bbox", () => {
        passGeoJSON3DPolygonTest({
            ...geoJsonPolygon3D,
            bbox: [0.0, 0.0, 0.0, 1.0, 2.0, 2.0],
        });
    });
    it("allows a 2D polygon with a hole and bbox", () => {
        passGeoJSON2DPolygonTest(geoJsonPolygon2DWithHoleAndBbox);
    });
    it("allows a polygon and preserves extra keys", () => {
        passGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            extraKey: "extra",
        });
    });
    it("allows a polygon with empty coordinates", () => {
        passGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            coordinates: [],
        });
    });

    it("does not allow a 1D polygon", () => {
        failGeoJSONPolygonTest({ type: "Polygon", coordinates: [[[0.0], [1.0], [0.0], [0.0]]] });
    });
    it("does not allow a polygon without coordinates key", () => {
        failGeoJSONPolygonTest({ type: "Polygon" });
    });
    it("does not allow a polygon with the geometry key", () => {
        failGeoJSONPolygonTest({ ...geoJsonPolygon2D, geometry: {} });
    });
    it("does not allow a polygon with the properties key", () => {
        failGeoJSONPolygonTest({ ...geoJsonPolygon2D, properties: {} });
    });
    it("does not allow a polygon with the features key", () => {
        failGeoJSONPolygonTest({ ...geoJsonPolygon2D, features: [] });
    });
    it("does not allow a polygon with the geometries key", () => {
        failGeoJSONPolygonTest({ ...geoJsonPolygon2D, geometries: [] });
    });
    it("does not allow a polygon which is not linear ring", () => {
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            coordinates: [
                [
                    [0.0, 0.0],
                    [1.0, 0.0],
                    [1.0, 1.0],
                    [0.0, 1.0],
                ],
            ],
        });
    });
    it("does not allow a polygon with invalid coordinates", () => {
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            coordinates: [
                [0.0, 0.0],
                [1.0, 0.0],
                [0.0, 0.0],
            ],
        });
    });
    it("does not allow a polygon with less than 4 positions", () => {
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            coordinates: [
                [
                    [0.0, 0.0],
                    [1.0, 0.0],
                    [0.0, 0.0],
                ],
            ],
        });
    });
    it("does not allow a polygon with inconsistent position dimensions", () => {
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            coordinates: [
                [
                    [0.0, 0.0],
                    [1.0, 0.0],
                    [1.0, 1.0],
                    [0.0, 0.0],
                ],
                [
                    [0.0, 0.0, 0.0],
                    [1.0, 0.0, 0.0],
                    [1.0, 1.0, 0.0],
                    [0.0, 0.0, 0.0],
                ],
            ],
        });
    });
    it("does not allow a 2D polygon with a non-overlapping bbox", () => {
        // This bbox is completely outside and somewhere else from the expected bbox
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            bbox: [30, 10, 20, 100],
        });
    });
    it("does not allow a 2D polygon with an intersecting bbox", () => {
        // This bbox intersects with the expected bbox
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            bbox: [-0.5, -0.5, 0.5, 0.5],
        });
    });
    it("does not allow a 2D polygon with a circumscribed bbox", () => {
        // This bbox completely encompasses the expected bbox
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            bbox: [-1.0, -1.0, 2.0, 2.0],
        });
    });
    it("does not allow a 3D polygon with an inscribed bbox", () => {
        // This bbox is fully enclosed within the expected bbox
        failGeoJSONPolygonTest({
            ...geoJsonPolygon3D,
            bbox: [0.25, 0.25, 1.0, 1.25, 1.25, 1.0],
        });
    });
    it("does not allow a polygon with invalid bbox dimensions", () => {
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            bbox: [0.0, 0.0, 0.0, 1.0, 1.0, 0.0],
        });
    });
    it("does not allow a polygon with badly formatted bbox", () => {
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            bbox: ["hello"],
        });
    });

    describe("2D", () => {
        it("allows a 2D polygon", () => {
            expect(GeoJSON2DPolygonSchema.parse(geoJsonPolygon2D)).toEqual(geoJsonPolygon2D);
        });
        it("does not allow a 3D polygon", () => {
            expect(() => GeoJSON2DPolygonSchema.parse(geoJsonPolygon3D)).toThrow(ZodError);
        });
        it("does not allow a 4D polygon", () => {
            expect(() => GeoJSON2DPolygonSchema.parse(geoJsonPolygon4D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D polygon", () => {
            expect(GeoJSON3DPolygonSchema.parse(geoJsonPolygon3D)).toEqual(geoJsonPolygon3D);
        });
        it("does not allow a 2D polygon", () => {
            expect(() => GeoJSON3DPolygonSchema.parse(geoJsonPolygon2D)).toThrow(ZodError);
        });
        it("does not allow a 4D polygon", () => {
            expect(() => GeoJSON3DPolygonSchema.parse(geoJsonPolygon4D)).toThrow(ZodError);
        });
    });
});

/**
 * Invalid GeoJSON Polygon to test types
 */
export const invalidGeoJsonPolygonRingTooSmall: GeoJSONPolygon = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    coordinates: [
        // @ts-expect-error -- THIS SHOULD FAIL
        [
            [0.0, 0.0],
            [1.0, 0.0],
            [0.0, 0.0],
        ],
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometries: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: {},
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
    otherKey: "allowed",
};
export const invalidGeoJsonPolygonPositionsTooSmall: GeoJSONPolygon = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [[[0.0], [1.0], [0.0], [0.0]]],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0, 0.0],
};

/**
 * Invalid 2D GeoJSON Polygon to test types
 */
export const invalidGeoJsonPolygon2DRingTooSmall: GeoJSON2DPolygon = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    coordinates: [
        // @ts-expect-error -- THIS SHOULD FAIL
        [
            [0.0, 0.0],
            [1.0, 0.0],
            [0.0, 0.0],
        ],
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometries: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: {},
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
    otherKey: "allowed",
};
export const invalidGeoJsonPolygon2DPositionsTooSmall: GeoJSON2DPolygon = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [[[0.0], [1.0], [0.0], [0.0]]],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0, 0.0],
};
export const invalidGeoJsonPolygon2DPositionsTooBig: GeoJSON2DPolygon = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    coordinates: [
        [
            // @ts-expect-error -- THIS SHOULD FAIL
            [0.0, 0.0, 0.0],
            // @ts-expect-error -- THIS SHOULD FAIL
            [1.0, 0.0, 0.0],
            // @ts-expect-error -- THIS SHOULD FAIL
            [0.0, 0.0, 0.0],
            // @ts-expect-error -- THIS SHOULD FAIL
            [0.0, 0.0, 0.0],
        ],
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0, 0.0, 0.0],
};

/**
 * Invalid 3D GeoJSON Polygon to test types
 */
export const invalidGeoJsonPolygon3DRingTooSmall: GeoJSON3DPolygon = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    coordinates: [
        // @ts-expect-error -- THIS SHOULD FAIL
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.0, 0.0, 0.0],
        ],
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometries: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: {},
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
    otherKey: "allowed",
};
export const invalidGeoJsonPolygon3DPositionsTooSmall: GeoJSON3DPolygon = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    coordinates: [
        [
            // @ts-expect-error -- THIS SHOULD FAIL
            [0.0, 0.0],
            // @ts-expect-error -- THIS SHOULD FAIL
            [1.0, 0.0],
            // @ts-expect-error -- THIS SHOULD FAIL
            [0.0, 0.0],
            // @ts-expect-error -- THIS SHOULD FAIL
            [0.0, 0.0],
        ],
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0, 0.0],
};
export const invalidGeoJsonPolygon3DPositionsTooBig: GeoJSON3DPolygon = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    coordinates: [
        [
            // @ts-expect-error -- THIS SHOULD FAIL
            [0.0, 0.0, 0.0, 0.0],
            // @ts-expect-error -- THIS SHOULD FAIL
            [1.0, 0.0, 0.0, 0.0],
            // @ts-expect-error -- THIS SHOULD FAIL
            [0.0, 0.0, 0.0, 0.0],
            // @ts-expect-error -- THIS SHOULD FAIL
            [0.0, 0.0, 0.0, 0.0],
        ],
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0, 0.0, 0.0],
};
