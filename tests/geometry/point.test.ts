import { describe, expect, it } from "@jest/globals";
import { ZodError } from "zod";
import {
    geoJsonPoint2D,
    geoJsonPoint2DWithBbox,
    geoJsonPoint3D,
    geoJsonPoint3DWithBbox,
} from "../../examples/geometry/point";
import {
    GeoJSON2DPoint,
    GeoJSON2DPointSchema,
    GeoJSON3DPoint,
    GeoJSON3DPointSchema,
    GeoJSONPoint,
    GeoJSONPointSchema,
} from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

export const geoJsonPoint4D = {
    ...geoJsonPoint2D,
    coordinates: [1.0, 2.0, 3.0, 4.0],
};

function passGeoJSON2DPointTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([GeoJSONPointSchema, GeoJSON2DPointSchema], value);
}

function passGeoJSON3DPointTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([GeoJSONPointSchema, GeoJSON3DPointSchema], value);
}

function failGeoJSONPointTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest([GeoJSONPointSchema, GeoJSON2DPointSchema, GeoJSON3DPointSchema], value);
}

describe("GeoJSONPoint", () => {
    it("allows a 2D point", () => {
        passGeoJSON2DPointTest(geoJsonPoint2D);
    });
    it("allows a 3D point", () => {
        passGeoJSON3DPointTest(geoJsonPoint3D);
    });
    it("allows a 2D point with valid bbox", () => {
        passGeoJSON2DPointTest(geoJsonPoint2DWithBbox);
    });
    it("allows a 3D point with valid bbox", () => {
        passGeoJSON3DPointTest(geoJsonPoint3DWithBbox);
    });
    it("allows a point and preserves extra keys", () => {
        const geoJsonPointWithExtraKeys = {
            ...geoJsonPoint2D,
            extraKey: "extra",
        };
        passGeoJSON2DPointTest(geoJsonPointWithExtraKeys);
    });

    it("does not allow a 1D point", () => {
        failGeoJSONPointTest({ type: "Point", coordinates: [1.0] });
    });
    it("does not allow a 4D point", () => {
        failGeoJSONPointTest(geoJsonPoint4D);
    });
    it("does not allow a point with empty coordinates", () => {
        failGeoJSONPointTest({ type: "Point", coordinates: [] });
    });
    it("does not allow a point without coordinates key", () => {
        failGeoJSONPointTest({ type: "Point" });
    });
    it("does not allow a point with the geometry key", () => {
        failGeoJSONPointTest({ ...geoJsonPoint2D, geometry: {} });
    });
    it("does not allow a point with the properties key", () => {
        failGeoJSONPointTest({ ...geoJsonPoint2D, properties: {} });
    });
    it("does not allow a point with the features key", () => {
        failGeoJSONPointTest({ ...geoJsonPoint2D, features: [] });
    });
    it("does not allow a point with the geometries key", () => {
        failGeoJSONPointTest({ ...geoJsonPoint2D, geometries: [] });
    });
    it("does not allow a 2D point with a non-overlapping bbox", () => {
        // This bbox is completely outside and somewhere else from the expected bbox
        failGeoJSONPointTest({
            ...geoJsonPoint2D,
            bbox: [30, 10, 20, 100],
        });
    });
    it("does not allow a 2D point with an intersecting bbox", () => {
        // This bbox intersects with the expected bbox
        failGeoJSONPointTest({
            ...geoJsonPoint2D,
            bbox: [1.0, 1.0, 2.0, 2.0],
        });
    });
    it("does not allow a 3D point with a circumscribed bbox", () => {
        // This bbox completely encompasses the expected bbox
        failGeoJSONPointTest({
            ...geoJsonPoint3D,
            bbox: [0.0, 1.0, 9.0, 2.0, 3.0, 11.0],
        });
    });
    it("does not allow a point with invalid bbox dimensions", () => {
        failGeoJSONPointTest({
            ...geoJsonPoint2D,
            bbox: [1.0, 2.0, 0.0, 1.0, 2.0, 0.0],
        });
    });
    it("does not allow a point with badly formatted bbox", () => {
        failGeoJSONPointTest({
            ...geoJsonPoint2D,
            bbox: ["hello"],
        });
    });
    it("does not allow a point with invalid coordinates", () => {
        failGeoJSONPointTest({
            ...geoJsonPoint2D,
            coordinates: ["3ght45y34", 39284],
        });
    });
    it("does not allow a point with empty coordinates", () => {
        failGeoJSONPointTest({
            ...geoJsonPoint2D,
            coordinates: [],
        });
    });

    describe("2D", () => {
        it("allows a 2D point", () => {
            expect(GeoJSON2DPointSchema.parse(geoJsonPoint2D)).toEqual(geoJsonPoint2D);
        });
        it("does not allow a 3D point", () => {
            expect(() => GeoJSON2DPointSchema.parse(geoJsonPoint3D)).toThrow(ZodError);
        });
        it("does not allow a 4D point", () => {
            expect(() => GeoJSON2DPointSchema.parse(geoJsonPoint4D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D point", () => {
            expect(GeoJSON3DPointSchema.parse(geoJsonPoint3D)).toEqual(geoJsonPoint3D);
        });
        it("does not allow a 2D point", () => {
            expect(() => GeoJSON3DPointSchema.parse(geoJsonPoint2D)).toThrow(ZodError);
        });
        it("does not allow a 4D point", () => {
            expect(() => GeoJSON3DPointSchema.parse(geoJsonPoint4D)).toThrow(ZodError);
        });
    });
});

/**
 * Invalid GeoJSON Point to test types
 */
export const invalidGeoJsonPoint: GeoJSONPoint = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 2.0],
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
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonPointPositionsTooBig: GeoJSONPoint = geoJsonPoint4D;

/**
 * Invalid 2D GeoJSON Points to test types
 */
export const invalidGeoJsonPoint2DPositionTooSmall: GeoJSON2DPoint = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 0.0, 0.0],
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
export const invalidGeoJsonPoint2DPositionTooBig: GeoJSON2DPoint = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0, 2.0, 3.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 0.0, 0.0],
};

/**
 * Invalid 3D GeoJSON Point to test types
 */
export const invalidGeoJsonPoint3DPositionTooSmall: GeoJSON3DPoint = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0, 2.0],
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
export const invalidGeoJsonPoint3DPositionTooBig: GeoJSON3DPoint = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0, 2.0, 0.0, 0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 2.0],
};
