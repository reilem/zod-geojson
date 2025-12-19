import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import { multiLineString as turfMultiLineString } from "@turf/helpers";
import { ZodError } from "zod/v4";
import { geoJsonLineString2D, geoJsonLineString3D } from "../../examples/geometry/line_string";
import {
    multiGeoJsonMultiLineString2D,
    multiGeoJsonMultiLineString2DWithBBox,
    singleGeoJsonMultiLineString2D,
    singleGeoJsonMultiLineString2DWithBBox,
    singleGeoJsonMultiLineString3D,
    singleGeoJsonMultiLineString3DWithBBox,
} from "../../examples/geometry/multi_line_string";
import {
    GeoJSON2DMultiLineString,
    GeoJSON2DMultiLineStringSchema,
    GeoJSON3DMultiLineString,
    GeoJSON3DMultiLineStringSchema,
    GeoJSONMultiLineString,
    GeoJSONMultiLineStringSchema,
} from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";
import { geoJsonLineString4D } from "./line_string.test";

export const singleGeoJsonMultiLineString4D = {
    type: "MultiLineString" as const,
    coordinates: [geoJsonLineString4D.coordinates],
};

function passGeoJSONMultiLineStringTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(
        [GeoJSONMultiLineStringSchema, GeoJSON2DMultiLineStringSchema, GeoJSON3DMultiLineStringSchema],
        value,
    );
}

function passGeoJSON2DMultiLineStringTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([GeoJSONMultiLineStringSchema, GeoJSON2DMultiLineStringSchema], value);
}

function passGeoJSON3DMultiLineStringTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([GeoJSONMultiLineStringSchema, GeoJSON3DMultiLineStringSchema], value);
}

function failGeoJSONMultiLineStringTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(
        [GeoJSONMultiLineStringSchema, GeoJSON2DMultiLineStringSchema, GeoJSON3DMultiLineStringSchema],
        value,
    );
}

describe("GeoJSONMultiLineString", () => {
    it("allows a 2D multi-line string with one line", () => {
        passGeoJSON2DMultiLineStringTest(singleGeoJsonMultiLineString2D);
    });
    it("allows a 2D multi-line string with multiple lines", () => {
        passGeoJSON2DMultiLineStringTest(multiGeoJsonMultiLineString2D);
    });
    it("allows a 3D multi-line string", () => {
        passGeoJSON3DMultiLineStringTest(singleGeoJsonMultiLineString3D);
    });
    it("allows a 2D multi-line string with one line and bbox", () => {
        passGeoJSON2DMultiLineStringTest(singleGeoJsonMultiLineString2DWithBBox);
    });
    it("allows a 2D multi-line string with multiples and with bbox", () => {
        passGeoJSON2DMultiLineStringTest(multiGeoJsonMultiLineString2DWithBBox);
    });
    it("allows a 3D multi-line string with bbox", () => {
        passGeoJSON3DMultiLineStringTest(singleGeoJsonMultiLineString3DWithBBox);
    });
    it("allows a multi-line string and preserves extra keys", () => {
        passGeoJSON2DMultiLineStringTest({
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
    it("does not allow a 4D multi-line string", () => {
        failGeoJSONMultiLineStringTest(singleGeoJsonMultiLineString4D);
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
        it("does not allow a 4D multi-line string", () => {
            expect(() => GeoJSON2DMultiLineStringSchema.parse(singleGeoJsonMultiLineString4D)).toThrow(ZodError);
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
        it("does not allow a 4D multi-line string", () => {
            expect(() => GeoJSON3DMultiLineStringSchema.parse(singleGeoJsonMultiLineString4D)).toThrow(ZodError);
        });
    });

    describe("turf.js", () => {
        it("validates 2D multi-line string from turf.js", () => {
            const multiLineString = turfMultiLineString([
                [
                    [0, 0],
                    [1, 1],
                ],
                [
                    [2, 2],
                    [3, 3],
                ],
            ]).geometry;
            expect(GeoJSONMultiLineStringSchema.parse(multiLineString)).toEqual(multiLineString);
        });

        it("validates 3D multi-line string from turf.js", () => {
            const multiLineString = turfMultiLineString([
                [
                    [0, 0, 0],
                    [1, 1, 1],
                ],
                [
                    [2, 2, 2],
                    [3, 3, 3],
                ],
            ]).geometry;
            expect(GeoJSONMultiLineStringSchema.parse(multiLineString)).toEqual(multiLineString);
        });
    });
});

/**
 * Invalid GeoJSON MultiPoint to test types
 */
export const invalidGeoJsonMultiLineString: GeoJSONMultiLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    coordinates: [
        [
            [1.0, 0.0],
            [1.0, 0.0],
        ],
        // @ts-expect-error -- THIS SHOULD FAIL
        ["[0.0, 0.0]"],
    ],
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

/**
 * Invalid 2D GeoJSON MultiLineString to test types
 */
export const invalidGeoJsonMultiLineString2D: GeoJSON2DMultiLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [["[1.0, 0.0]"]],
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
export const invalidGeoJsonMultiLineString2DPositionTooSmall: GeoJSON2DMultiLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [[[1.0, 0.0], [0.0]]],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 0.0],
};
export const invalidGeoJsonMultiLineString2DPositionTooBig: GeoJSON2DMultiLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    coordinates: [
        [
            [1.0, 0.0],
            // @ts-expect-error -- THIS SHOULD FAIL
            [0.0, 0.0, 0.0],
        ],
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 2.0, 0.0],
};

/**
 * Invalid 3D GeoJSON MultiLineString to test types
 */
export const invalidGeoJsonMultiLineString3D: GeoJSON3DMultiLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [["[1.0, 2.0, 0.0]"]],
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
export const invalidGeoJsonMultiLineString3DPositionTooSmall: GeoJSON3DMultiLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    coordinates: [
        [
            [1.0, 2.0, 0.0],
            // @ts-expect-error -- THIS SHOULD FAIL
            [1.0, 2.0],
        ],
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 2.0],
};
export const invalidGeoJsonMultiLineString3DPositionTooBig: GeoJSON3DMultiLineString = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    coordinates: [
        [
            [1.0, 2.0, 0.0],
            // @ts-expect-error -- THIS SHOULD FAIL
            [1.0, 2.0, 0.0, 0.0],
        ],
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 2.0, 3.0],
};

/**
 * Test that types match with @types/geojson
 */
export const multiLineString1: GeoJSONTypes.MultiLineString = multiGeoJsonMultiLineString2D;
export const multiLineString2: GeoJSONTypes.MultiLineString = singleGeoJsonMultiLineString3D;
export const multiLineString3: GeoJSONTypes.MultiLineString = singleGeoJsonMultiLineString2DWithBBox;
export const multiLineString4: GeoJSONTypes.MultiLineString =
    singleGeoJsonMultiLineString2DWithBBox as GeoJSONMultiLineString;

/**
 * Test that @types/geojson matches our types
 */
export const multiLineString5: GeoJSONMultiLineString = multiLineString1;

/**
 * Test that turf.js matches our types
 */
export const multiLineString6: GeoJSONMultiLineString = turfMultiLineString([
    [
        [0, 0],
        [1, 1],
    ],
    [
        [2, 2],
        [3, 3],
    ],
]).geometry;
export const multiLineString7: GeoJSONMultiLineString = turfMultiLineString([
    [
        [0, 0, 0],
        [1, 1, 1],
    ],
    [
        [2, 2, 2],
        [3, 3, 3],
    ],
]).geometry;
