import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import { ZodError } from "zod";
import {
    geoJsonLineString2D,
    geoJsonLineString2DWithBbox,
    geoJsonLineString3D,
    geoJsonLineString3DWithBbox,
} from "../../examples/geometry/line_string";
import {
    GeoJSON2DLineString,
    GeoJSON2DLineStringSchema,
    GeoJSON3DLineString,
    GeoJSON3DLineStringSchema,
    GeoJSONLineString,
    GeoJSONLineStringSchema,
} from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

export const geoJsonLineString4D = {
    ...geoJsonLineString2D,
    coordinates: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
    ],
};

function passGeoJSON2DLineStringTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([GeoJSONLineStringSchema, GeoJSON2DLineStringSchema], value);
}

function passGeoJSON3DLineStringTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([GeoJSONLineStringSchema, GeoJSON3DLineStringSchema], value);
}

function failGeoJSONLineStringTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(
        [GeoJSONLineStringSchema, GeoJSON2DLineStringSchema, GeoJSON3DLineStringSchema],
        value,
    );
}

describe("GeoJSONLineString", () => {
    it("allows a 2D line string", () => {
        passGeoJSON2DLineStringTest(geoJsonLineString2D);
    });
    it("allows a 3D line string", () => {
        passGeoJSON3DLineStringTest(geoJsonLineString3D);
    });
    it("allows 2D line string with valid bbox", () => {
        passGeoJSON2DLineStringTest(geoJsonLineString2DWithBbox);
    });
    it("allows 3D line string with valid bbox", () => {
        passGeoJSON3DLineStringTest(geoJsonLineString3DWithBbox);
    });
    it("allows a line string and preserves extra keys", () => {
        const geoJsonLineStringWithExtraKeys = {
            ...geoJsonLineString2D,
            extraKey: "extra",
        };
        passGeoJSON2DLineStringTest(geoJsonLineStringWithExtraKeys);
    });

    it("does not allow a 1D line string", () => {
        failGeoJSONLineStringTest({ type: "LineString", coordinates: [[0.0], [1.0]] });
    });
    it("does not allow a 4D line string", () => {
        failGeoJSONLineStringTest(geoJsonLineString4D);
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
        it("does not allow a 5D line string", () => {
            expect(() => GeoJSON2DLineStringSchema.parse(geoJsonLineString4D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D line string", () => {
            expect(GeoJSON3DLineStringSchema.parse(geoJsonLineString3D)).toEqual(geoJsonLineString3D);
        });
        it("does not allow a 2D line string", () => {
            expect(() => GeoJSON3DLineStringSchema.parse(geoJsonLineString2D)).toThrow(ZodError);
        });
        it("does not allow a 5D line string", () => {
            expect(() => GeoJSON3DLineStringSchema.parse(geoJsonLineString4D)).toThrow(ZodError);
        });
    });
});

/**
 * Invalid GeoJSON MultiPoint to test types
 */
export const invalidGeoJsonLineStringTooFewPositions: GeoJSONLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [[1.0, 0.0]],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0],
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
export const invalidGeoJsonLineStringPositionTooSmall: GeoJSONLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [[1.0, 0.0], [0.0]],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0],
};
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonLineStringPositionTooBig: GeoJSONLineString = geoJsonLineString4D;

/**
 * Invalid 2D GeoJSON LineString to test types
 */
export const invalidGeoJsonLineString2DTooFewPositions: GeoJSON2DLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [[1.0, 0.0]],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0],
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
export const invalidGeoJsonLineString2DPositionTooSmall: GeoJSON2DLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [[1.0, 0.0], [0.0]],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 0.0],
};
export const invalidGeoJsonLineString2DPositionTooBig: GeoJSON2DLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    coordinates: [
        [1.0, 0.0],
        // @ts-expect-error -- THIS SHOULD FAIL
        [0.0, 0.0, 0.0],
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 2.0, 0.0],
};

/**
 * Invalid 3D GeoJSON LineString to test types
 */
export const invalidGeoJsonLineString3DTooFewPositions: GeoJSON3DLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [[1.0, 2.0, 0.0]],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0],
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
export const invalidGeoJsonLineString3DPositionTooSmall: GeoJSON3DLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    coordinates: [
        [1.0, 2.0, 0.0],
        // @ts-expect-error -- THIS SHOULD FAIL
        [1.0, 2.0],
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 2.0],
};
export const invalidGeoJsonLineString3DPositionTooBig: GeoJSON3DLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    coordinates: [
        [1.0, 2.0, 0.0],
        // @ts-expect-error -- THIS SHOULD FAIL
        [1.0, 2.0, 0.0, 0.0],
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 2.0, 3.0],
};

/**
 * Test that types match with @types/geojson
 */
export const lineString1: GeoJSONTypes.LineString = geoJsonLineString2D;
export const lineString2: GeoJSONTypes.LineString = geoJsonLineString3D;
export const lineString3: GeoJSONTypes.LineString = geoJsonLineString2DWithBbox;
export const lineString4: GeoJSONTypes.LineString = geoJsonLineString2DWithBbox as GeoJSONLineString;
