import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import { ZodError } from "zod/v4";
import {
    multiGeoJsonGeometryCollection2D,
    multiGeoJsonGeometryCollection2DWithBbox,
    multiGeoJsonGeometryCollection3D,
    multiGeoJsonGeometryCollection3DWithBbox,
    singleGeoJsonGeometryCollection2D,
    singleGeoJsonGeometryCollection2DWithBbox,
} from "../../examples/geometry/geometry_collection";
import { geoJsonLineString3D } from "../../examples/geometry/line_string";
import { geoJsonMultiPoint2D } from "../../examples/geometry/multi_point";
import { geoJsonPoint2D } from "../../examples/geometry/point";
import {
    GeoJSON2DGeometryCollection,
    GeoJSON2DGeometryCollectionSchema,
    GeoJSON3DGeometryCollection,
    GeoJSON3DGeometryCollectionSchema,
    GeoJSONGeometryCollection,
    GeoJSONGeometryCollectionSchema,
} from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";
import { geoJsonPoint4D } from "./point.test";

export const singleGeoJsonGeometryCollection4D = {
    type: "GeometryCollection",
    geometries: [geoJsonPoint4D],
};

function passGeoJSONGeometryCollectionTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(
        [GeoJSONGeometryCollectionSchema, GeoJSON2DGeometryCollectionSchema, GeoJSON3DGeometryCollectionSchema],
        value,
    );
}

function passGeoJSON2DGeometryCollectionTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([GeoJSONGeometryCollectionSchema, GeoJSON2DGeometryCollectionSchema], value);
}

function passGeoJSON3DGeometryCollectionTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([GeoJSONGeometryCollectionSchema, GeoJSON3DGeometryCollectionSchema], value);
}

function failGeoJSONGeometryCollectionTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(
        [GeoJSONGeometryCollectionSchema, GeoJSON2DGeometryCollectionSchema, GeoJSON3DGeometryCollectionSchema],
        value,
    );
}

describe("GeoJSONGeometryCollection", () => {
    it("allows a geometry collection with one 2D geometry", () => {
        passGeoJSON2DGeometryCollectionTest(singleGeoJsonGeometryCollection2D);
    });
    it("allows a geometry collection with multiple 2D geometries", () => {
        passGeoJSON2DGeometryCollectionTest(multiGeoJsonGeometryCollection2D);
    });
    it("allows a geometry collection with multiple 3D geometries", () => {
        passGeoJSON3DGeometryCollectionTest(multiGeoJsonGeometryCollection3D);
    });

    it("allows a geometry collection with one 2D geometry and valid bbox", () => {
        passGeoJSON2DGeometryCollectionTest(singleGeoJsonGeometryCollection2DWithBbox);
    });
    it("allows a geometry collection with multiple 2D geometries and valid bbox", () => {
        passGeoJSON2DGeometryCollectionTest(multiGeoJsonGeometryCollection2DWithBbox);
    });
    it("allows a geometry collection with multiple 3D geometries and valid bbox", () => {
        passGeoJSON3DGeometryCollectionTest(multiGeoJsonGeometryCollection3DWithBbox);
    });
    it("allows a geometry collection and preserves extra keys", () => {
        passGeoJSON2DGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            extraKey: "extra",
        });
    });
    it("allows a geometry collection with empty geometries", () => {
        passGeoJSONGeometryCollectionTest({ type: "GeometryCollection", geometries: [] });
    });

    it("does not allow a geometry collection with a 1D geometry", () => {
        failGeoJSONGeometryCollectionTest({
            type: "GeometryCollection",
            geometries: [{ type: "Point", coordinates: [0.0] }],
        });
    });
    it("does not allow a geometry collection with a 4D geometry", () => {
        failGeoJSONGeometryCollectionTest(singleGeoJsonGeometryCollection4D);
    });
    it("does not allow a geometry collection without geometries key", () => {
        failGeoJSONGeometryCollectionTest({ type: "GeometryCollection" });
    });
    it("does not allow a geometry collection with the coordinates key", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            coordinates: [],
        });
    });
    it("does not allow a geometry collection with the features key", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            features: [],
        });
    });
    it("does not allow a geometry collection with the geometry key", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            geometry: {},
        });
    });
    it("does not allow a geometry collection with the properties key", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            properties: {},
        });
    });
    it("does not allow a geometry collection with geometries with invalid types", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            geometries: [
                geoJsonPoint2D,
                {
                    type: "BadType",
                    coordinates: [0.0, 0.0],
                },
            ],
        });
    });
    it("does not allow a geometry collection with geometries with inconsistent position dimensions", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            geometries: [
                {
                    type: "MultiPoint",
                    coordinates: [
                        [0.0, 5.0],
                        [2.0, -2.0, 0.0],
                    ],
                },
            ],
        });
    });
    it("does not allow a geometry collection with geometries with inconsistent position dimensions across geometries", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            geometries: [geoJsonMultiPoint2D, geoJsonLineString3D],
        });
    });
    it("does not allow a geometry collection with geometries with inconsistent position dimensions across geometry collections", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            geometries: [singleGeoJsonGeometryCollection2D, multiGeoJsonGeometryCollection3D],
        });
    });
    it("does not allow a geometry collection with geometries with invalid coordinates", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            geometries: [
                {
                    type: "LineString",
                    coordinates: [0.0, 10.0, -2.0],
                },
            ],
        });
    });
    it("does not allow a geometry collection with geometries with incorrect bbox", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            bbox: [-30, 10, -20, 100],
        });
    });
    it("does not allow a geometry collection with geometries with invalid bbox dimensions", () => {
        failGeoJSONGeometryCollectionTest({
            ...multiGeoJsonGeometryCollection2D,
            bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 0.0],
        });
    });
    it("does not allow a geometry collection with geometries with badly formatted bbox", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            bbox: ["bbox cannot contain strings"],
        });
    });

    describe("2D", () => {
        it("allows a 2D geometry collection", () => {
            expect(GeoJSON2DGeometryCollectionSchema.parse(multiGeoJsonGeometryCollection2D)).toEqual(
                multiGeoJsonGeometryCollection2D,
            );
        });
        it("does not allow a 3D geometry collection", () => {
            expect(() => GeoJSON2DGeometryCollectionSchema.parse(multiGeoJsonGeometryCollection3D)).toThrow(ZodError);
        });
        it("does not allow a 6D geometry collection", () => {
            expect(() => GeoJSON2DGeometryCollectionSchema.parse(singleGeoJsonGeometryCollection4D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D geometry collection", () => {
            expect(GeoJSON3DGeometryCollectionSchema.parse(multiGeoJsonGeometryCollection3D)).toEqual(
                multiGeoJsonGeometryCollection3D,
            );
        });
        it("does not allow a 2D geometry collection", () => {
            expect(() => GeoJSON3DGeometryCollectionSchema.parse(multiGeoJsonGeometryCollection2D)).toThrow(ZodError);
        });
        it("does not allow a 6D geometry collection", () => {
            expect(() => GeoJSON3DGeometryCollectionSchema.parse(singleGeoJsonGeometryCollection4D)).toThrow(ZodError);
        });
    });
});

/**
 * Invalid GeoJSON GeometryCollection to test types
 */
export const invalidGeoJsonGeometryCollection: GeoJSONGeometryCollection = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    geometries: [
        {
            // @ts-expect-error -- THIS SHOULD FAIL
            type: "Foo",
            // @ts-expect-error -- THIS SHOULD FAIL
            coordinates: [1.0],
        },
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: {},
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
    otherKey: "allowed",
};
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonGeometryCollectionPositionsTooBig: GeoJSONGeometryCollection =
    singleGeoJsonGeometryCollection4D;

/**
 * Invalid 2D GeoJSON GeometryCollection to test types
 */
export const invalidGeoJsonGeometryCollection2DPositionTooSmall: GeoJSON2DGeometryCollection = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    geometries: [
        {
            // @ts-expect-error -- THIS SHOULD FAIL
            type: "Foo",
            // @ts-expect-error -- THIS SHOULD FAIL
            coordinates: [1.0],
        },
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: {},
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
    otherKey: "allowed",
};
export const invalidGeoJsonGeometryCollection2DPositionTooBig: GeoJSON2DGeometryCollection = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    geometries: [
        {
            // @ts-expect-error -- THIS SHOULD FAIL
            type: "Foo",
            // @ts-expect-error -- THIS SHOULD FAIL
            coordinates: [1.0, 0.0, 0.0],
        },
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 0.0, 0.0],
};

/**
 * Invalid 3D GeoJSON GeometryCollection to test types
 */
export const invalidGeoJsonGeometryCollection3DPositionTooSmall: GeoJSON3DGeometryCollection = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    geometries: [
        {
            // @ts-expect-error -- THIS SHOULD FAIL
            type: "Foo",
            // @ts-expect-error -- THIS SHOULD FAIL
            coordinates: [1.0, 0.0],
        },
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: {},
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
    otherKey: "allowed",
};
export const invalidGeoJsonGeometryCollection3DPositionTooBig: GeoJSON3DGeometryCollection = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    geometries: [
        {
            // @ts-expect-error -- THIS SHOULD FAIL
            type: "Foo",
            // @ts-expect-error -- THIS SHOULD FAIL
            coordinates: [1.0, 0.0, 0.0, 0.0],
        },
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 0.0, 0.0],
};

/**
 * Test that types match with @types/geojson
 */
export const geometryCollection1: GeoJSONTypes.GeometryCollection = multiGeoJsonGeometryCollection2D;
export const geometryCollection2: GeoJSONTypes.GeometryCollection = multiGeoJsonGeometryCollection3D;
export const geometryCollection3: GeoJSONTypes.GeometryCollection = singleGeoJsonGeometryCollection2DWithBbox;
export const geometryCollection4: GeoJSONTypes.GeometryCollection =
    singleGeoJsonGeometryCollection2DWithBbox as GeoJSONGeometryCollection;
