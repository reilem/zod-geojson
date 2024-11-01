import { describe, expect, it } from "@jest/globals";
import { ZodError } from "zod";
import {
    geoJsonMultiPoint2D,
    geoJsonMultiPoint2DWithBbox,
    geoJsonMultiPoint3D,
    geoJsonMultiPoint3DWithBbox,
} from "../../examples/geometry/multi_point";
import { geoJsonPoint2D, geoJsonPoint3D } from "../../examples/geometry/point";
import {
    GeoJSON2DMultiPoint,
    GeoJSON2DMultiPointSchema,
    GeoJSON3DMultiPoint,
    GeoJSON3DMultiPointSchema,
    GeoJSONMultiPoint,
    GeoJSONMultiPointSchema,
} from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";
import { geoJsonPoint4D } from "./point.test";

export const geoJsonMultiPoint4D = {
    type: "MultiPoint",
    coordinates: [geoJsonPoint4D.coordinates],
};

function passGeoJSONMultiPointTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([GeoJSONMultiPointSchema], value);
}

function passGeoJSON2DMultiPointTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([GeoJSONMultiPointSchema, GeoJSON2DMultiPointSchema], value);
}

function passGeoJSON3DMultiPointTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([GeoJSONMultiPointSchema, GeoJSON3DMultiPointSchema], value);
}

function failGeoJSONMultiPointTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(
        [GeoJSONMultiPointSchema, GeoJSON2DMultiPointSchema, GeoJSON3DMultiPointSchema],
        value,
    );
}

describe("GeoJSONMultiPoint", () => {
    it("allows a 2D multi-point", () => {
        passGeoJSON2DMultiPointTest(geoJsonMultiPoint2D);
    });
    it("allows a 3D multi-point", () => {
        passGeoJSON3DMultiPointTest(geoJsonMultiPoint3D);
    });
    it("allows a 2D multi-point with a valid bbox", () => {
        passGeoJSON2DMultiPointTest(geoJsonMultiPoint2DWithBbox);
    });
    it("allows a 3D multi-point with valid bbox", () => {
        passGeoJSON3DMultiPointTest(geoJsonMultiPoint3DWithBbox);
    });
    it("allows a multi point and preserves extra keys", () => {
        passGeoJSONMultiPointTest({
            ...geoJsonMultiPoint2D,
            extraKey: "extra",
        });
    });
    it("allows a multi-point with empty coordinates", () => {
        passGeoJSONMultiPointTest({ type: "MultiPoint", coordinates: [] });
    });

    it("does not allow a 1D multi-point", () => {
        failGeoJSONMultiPointTest({ type: "MultiPoint", coordinates: [[0.0], [1.0]] });
    });
    it("does not allow a 4D multi-point", () => {
        failGeoJSONMultiPointTest(geoJsonMultiPoint4D);
    });
    it("does not allow a multi-point without coordinates key", () => {
        failGeoJSONMultiPointTest({ type: "MultiPoint" });
    });
    it("does not allow a multi-point with the geometry key", () => {
        failGeoJSONMultiPointTest({ ...geoJsonMultiPoint2D, geometry: {} });
    });
    it("does not allow a multi-point with the properties key", () => {
        failGeoJSONMultiPointTest({ ...geoJsonMultiPoint2D, properties: {} });
    });
    it("does not allow a multi-point with the features key", () => {
        failGeoJSONMultiPointTest({ ...geoJsonMultiPoint2D, features: [] });
    });
    it("does not allow a multi-point with the geometries key", () => {
        failGeoJSONMultiPointTest({ ...geoJsonMultiPoint2D, geometries: [] });
    });
    it("does not allow a multi-point with invalid coordinates", () => {
        const geoJsonMultiPointWithInvalidCoordinates = {
            ...geoJsonMultiPoint2D,
            coordinates: [
                // Too deeply nested
                [
                    [1.0, 2.0],
                    [3.0, 4.0],
                ],
            ],
        };
        failGeoJSONMultiPointTest(geoJsonMultiPointWithInvalidCoordinates);
    });
    it("does not allow multi-point with inconsistent position dimensions", () => {
        failGeoJSONMultiPointTest({
            ...geoJsonMultiPoint2D,
            coordinates: [geoJsonPoint2D, geoJsonPoint3D, [5.0, 6.0, 7.0, 8.0]],
        });
    });
    it("does not allow a 2D multi point with a non-overlapping bbox", () => {
        // This bbox is completely outside and somewhere else from the expected bbox
        failGeoJSONMultiPointTest({
            ...geoJsonMultiPoint2D,
            bbox: [30, 10, 20, 100],
        });
    });
    it("does not allow a 2D multi point with an intersecting bbox", () => {
        // This bbox intersects with the expected bbox
        failGeoJSONMultiPointTest({
            ...geoJsonMultiPoint2D,
            bbox: [-4.0, -3.0, 7.0, 3.0],
        });
    });
    it("does not allow a 2D multi point with a circumscribed bbox", () => {
        // This bbox completely encompasses the expected bbox
        failGeoJSONMultiPointTest({
            ...geoJsonMultiPoint2D,
            bbox: [-4.0, -3.0, 9.0, 5.0],
        });
    });
    it("does not allow a 3D multi point with an inscribed bbox", () => {
        // This bbox is fully enclosed within the expected bbox
        failGeoJSONMultiPointTest({
            ...geoJsonMultiPoint3D,
            bbox: [-2.0, -1.0, 1.0, 7.0, 3.0, 4.0],
        });
    });
    it("does not allow a multi-point with invalid bbox dimensions", () => {
        failGeoJSONMultiPointTest({
            ...geoJsonMultiPoint2D,
            bbox: [1.0, 2.0, 0.0, 1.0, 2.0, 0.0],
        });
    });
    it("does not allow a multi-point with badly formatted bbox", () => {
        failGeoJSONMultiPointTest({
            ...geoJsonMultiPoint2D,
            bbox: ["hello"],
        });
    });

    describe("2D", () => {
        it("allows a 2D multi-point", () => {
            expect(GeoJSON2DMultiPointSchema.parse(geoJsonMultiPoint2D)).toEqual(geoJsonMultiPoint2D);
        });
        it("does not allow a 3D multi-point", () => {
            expect(() => GeoJSON2DMultiPointSchema.parse(geoJsonMultiPoint3D)).toThrow(ZodError);
        });
        it("does not allow a 4D multi-point", () => {
            expect(() => GeoJSON2DMultiPointSchema.parse(geoJsonMultiPoint4D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D multi-point", () => {
            expect(GeoJSON3DMultiPointSchema.parse(geoJsonMultiPoint3D)).toEqual(geoJsonMultiPoint3D);
        });
        it("does not allow a 2D multi-point", () => {
            expect(() => GeoJSON3DMultiPointSchema.parse(geoJsonMultiPoint2D)).toThrow(ZodError);
        });
        it("does not allow a 4D multi-point", () => {
            expect(() => GeoJSON3DMultiPointSchema.parse(geoJsonMultiPoint4D)).toThrow(ZodError);
        });
    });
});

/**
 * Invalid GeoJSON MultiPoint to test types
 */
export const invalidGeoJsonMultiPoint: GeoJSONMultiPoint = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [[1.0]],
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
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonMultiPointPositionsTooBig: GeoJSONMultiPoint = geoJsonMultiPoint4D;

/**
 * Invalid 2D GeoJSON MultiPoint to test types
 */
export const invalidGeoJsonMultiPoint2DPositionTooSmall: GeoJSON2DMultiPoint = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [[1.0]],
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
export const invalidGeoJsonMultiPoint2DPositionTooBig: GeoJSON2DMultiPoint = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [[1.0, 2.0, 3.0]],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 2.0],
};

/**
 * Invalid 3D GeoJSON MultiPoint to test types
 */
export const invalidGeoJsonMultiPoint3DPositionTooSmall: GeoJSON3DMultiPoint = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [[1.0, 2.0]],
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
export const invalidGeoJsonMultiPoint3DPositionTooBig: GeoJSON3DMultiPoint = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [[1.0, 2.0, 0.0, 0.0]],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 2.0, 3.0],
};
