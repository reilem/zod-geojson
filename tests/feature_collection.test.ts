import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import z, { ZodError } from "zod/v4";
import { geoJsonFeaturePoint2D, geoJsonFeaturePoint3D } from "../examples/feature";
import {
    multiGeoJsonFeatureCollection2D,
    multiGeoJsonFeatureCollectionWithBbox2D,
    singleGeoJsonFeatureCollection2D,
    singleGeoJsonFeatureCollection3D,
} from "../examples/feature_collection";
import {
    GeoJSON2DFeatureCollection,
    GeoJSON2DFeatureCollectionSchema,
    GeoJSON3DFeatureCollection,
    GeoJSON3DFeatureCollectionSchema,
    GeoJSONFeatureCollection,
    GeoJSONFeatureCollectionGenericSchema,
    GeoJSONFeatureCollectionSchema,
    GeoJSONPositionSchema,
} from "../src";
import { failGeoJSONSchemaTest, passGeoJSONSchemaTest } from "./_helpers";
import { geoJsonFeaturePoint4D } from "./feature.test";

export const singleGeoJsonFeatureCollection4D = {
    type: "FeatureCollection",
    features: [geoJsonFeaturePoint4D],
};

function passGeoJSONFeatureCollectionSchemaTest(object: unknown) {
    passGeoJSONSchemaTest(
        [GeoJSONFeatureCollectionSchema, GeoJSON2DFeatureCollectionSchema, GeoJSON3DFeatureCollectionSchema],
        object,
    );
}

function passGeoJSON2DFeatureCollectionSchemaTest(object: unknown) {
    passGeoJSONSchemaTest([GeoJSONFeatureCollectionSchema, GeoJSON2DFeatureCollectionSchema], object);
}

function passGeoJSON3DFeatureCollectionSchemaTest(object: unknown) {
    passGeoJSONSchemaTest([GeoJSONFeatureCollectionSchema, GeoJSON3DFeatureCollectionSchema], object);
}

function failGeoJSONFeatureCollectionSchemaTest(object: unknown) {
    failGeoJSONSchemaTest(
        [GeoJSONFeatureCollectionSchema, GeoJSON2DFeatureCollectionSchema, GeoJSON3DFeatureCollectionSchema],
        object,
    );
}

describe("GeoJSONFeatureCollection", () => {
    it("allows a feature collection with one feature", () => {
        passGeoJSON3DFeatureCollectionSchemaTest(singleGeoJsonFeatureCollection3D);
    });
    it("allows a feature collection with multiple features", () => {
        passGeoJSON2DFeatureCollectionSchemaTest(multiGeoJsonFeatureCollection2D);
    });
    it("allows a feature collection and preserves extra keys", () => {
        passGeoJSON2DFeatureCollectionSchemaTest({
            ...singleGeoJsonFeatureCollection2D,
            color: "#00FF00",
        });
    });
    it("allows a feature collection with multiple features and bbox", () => {
        passGeoJSON2DFeatureCollectionSchemaTest(multiGeoJsonFeatureCollectionWithBbox2D);
    });
    it("allows a feature collection with empty features array", () => {
        passGeoJSONFeatureCollectionSchemaTest({ ...singleGeoJsonFeatureCollection2D, features: [] });
    });

    it("does not allow a feature collection with a 1D feature", () => {
        failGeoJSONFeatureCollectionSchemaTest({});
    });
    it("does not allow a feature collection with a 4D feature", () => {
        failGeoJSONFeatureCollectionSchemaTest(singleGeoJsonFeatureCollection4D);
    });
    it("does not allow a feature collection without features key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ type: "FeatureCollection" });
    });
    it("does not allow a feature collection with the coordinates key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ ...singleGeoJsonFeatureCollection2D, coordinates: [] });
    });
    it("does not allow a feature collection with the geometry key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ ...singleGeoJsonFeatureCollection2D, geometry: {} });
    });
    it("does not allow a feature collection with the properties key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ ...singleGeoJsonFeatureCollection2D, properties: {} });
    });
    it("does not allow a feature collection with the geometries key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ ...singleGeoJsonFeatureCollection2D, geometries: [] });
    });
    it("does not allow a feature collection with inconsistent position dimensions across features", () => {
        failGeoJSONFeatureCollectionSchemaTest({
            ...multiGeoJsonFeatureCollection2D,
            features: [geoJsonFeaturePoint2D, geoJsonFeaturePoint3D],
        });
    });
    it("does not allow a feature with a geometry with incorrect bbox", () => {
        failGeoJSONFeatureCollectionSchemaTest({
            ...multiGeoJsonFeatureCollection2D,
            bbox: [40, 40, 80, 80],
        });
    });
    it("does not allow a feature with a geometry with invalid bbox dimensions", () => {
        failGeoJSONFeatureCollectionSchemaTest({
            ...multiGeoJsonFeatureCollection2D,
            bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 0.0],
        });
    });
    it("does not allow a feature with a geometry with badly formatted bbox", () => {
        failGeoJSONFeatureCollectionSchemaTest({
            ...multiGeoJsonFeatureCollection2D,
            bbox: ["bbox must not contain strings"],
        });
    });

    describe("2D", () => {
        it("allows a 2D feature collection", () => {
            expect(GeoJSON2DFeatureCollectionSchema.parse(singleGeoJsonFeatureCollection2D)).toEqual(
                singleGeoJsonFeatureCollection2D,
            );
        });
        it("does not allow a 3D feature collection", () => {
            expect(() => GeoJSON2DFeatureCollectionSchema.parse(singleGeoJsonFeatureCollection3D)).toThrow(ZodError);
        });
        it("does not allow a 4D feature collection", () => {
            expect(() => GeoJSON2DFeatureCollectionSchema.parse(singleGeoJsonFeatureCollection4D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D feature collection", () => {
            expect(GeoJSON3DFeatureCollectionSchema.parse(singleGeoJsonFeatureCollection3D)).toEqual(
                singleGeoJsonFeatureCollection3D,
            );
        });
        it("does not allow a 2D feature collection", () => {
            expect(() => GeoJSON3DFeatureCollectionSchema.parse(singleGeoJsonFeatureCollection2D)).toThrow(ZodError);
        });
        it("does not allow a 4D feature collection", () => {
            expect(() => GeoJSON3DFeatureCollectionSchema.parse(singleGeoJsonFeatureCollection4D)).toThrow(ZodError);
        });
    });

    describe("Custom properties", () => {
        const GeoJSONFeatureCollectionWithCustomProperties = GeoJSONFeatureCollectionGenericSchema(
            GeoJSONPositionSchema,
            z.object({ name: z.string() }),
        );

        it("allows feature collection with custom properties", () => {
            const featureCollection = {
                type: "FeatureCollection",
                features: [
                    {
                        ...geoJsonFeaturePoint2D,
                        properties: { name: "A name" },
                    },
                ],
            };
            expect(GeoJSONFeatureCollectionWithCustomProperties.parse(featureCollection)).toEqual(featureCollection);
        });

        it("does not allow feature collection with missing custom properties", () => {
            const featureCollection = {
                type: "FeatureCollection",
                features: [
                    {
                        ...geoJsonFeaturePoint2D,
                        properties: { wrongKey: "A name" },
                    },
                ],
            };
            expect(() => GeoJSONFeatureCollectionWithCustomProperties.parse(featureCollection)).toThrow(ZodError);
        });
    });
});

/**
 * Invalid GeoJSON Feature Collection to test types
 */
export const invalidGeoJsonFeatureCollection: GeoJSONFeatureCollection = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    features: [
        {
            // @ts-expect-error -- THIS SHOULD FAIL
            type: "Foo",
            geometry: {
                // @ts-expect-error -- THIS SHOULD FAIL
                type: "Bar",
                // @ts-expect-error -- THIS SHOULD FAIL
                coordinates: [1.0],
                // @ts-expect-error -- THIS SHOULD FAIL
                bbox: [0.0],
                // @ts-expect-error -- THIS SHOULD FAIL
                features: [],
                // @ts-expect-error -- THIS SHOULD FAIL
                properties: {},
                // @ts-expect-error -- THIS SHOULD FAIL
                geometry: {},
                otherKey: "allowed",
            },
            // @ts-expect-error -- THIS SHOULD FAIL
            features: [],
            // @ts-expect-error -- THIS SHOULD FAIL
            coordinates: [],
            // @ts-expect-error -- THIS SHOULD FAIL
            geometries: {},
            otherKey: "allowed",
        },
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometries: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: {},
    otherKey: "allowed",
};
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonFeatureCollectionPositionsTooBig: GeoJSONFeatureCollection =
    singleGeoJsonFeatureCollection4D;

/**
 * Invalid 2D GeoJSON Feature Collection to test types
 */
export const invalidGeoJsonFeatureCollection2DPositionTooSmall: GeoJSON2DFeatureCollection = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    features: [
        {
            // @ts-expect-error -- THIS SHOULD FAIL
            type: "Foo",
            geometry: {
                // @ts-expect-error -- THIS SHOULD FAIL
                type: "Bar",
                // @ts-expect-error -- THIS SHOULD FAIL
                coordinates: [1.0],
                // @ts-expect-error -- THIS SHOULD FAIL
                bbox: [0.0],
                // @ts-expect-error -- THIS SHOULD FAIL
                features: [],
                // @ts-expect-error -- THIS SHOULD FAIL
                properties: {},
                // @ts-expect-error -- THIS SHOULD FAIL
                geometry: {},
                otherKey: "allowed",
            },
            // @ts-expect-error -- THIS SHOULD FAIL
            features: [],
            // @ts-expect-error -- THIS SHOULD FAIL
            coordinates: [],
            // @ts-expect-error -- THIS SHOULD FAIL
            geometries: {},
            otherKey: "allowed",
        },
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometries: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: {},
    otherKey: "allowed",
};
export const invalidGeoJsonFeatureCollection2DPositionTooBig: GeoJSON2DFeatureCollection = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    features: [
        {
            // @ts-expect-error -- THIS SHOULD FAIL
            type: "Foo",
            geometry: {
                // @ts-expect-error -- THIS SHOULD FAIL
                type: "Bar",
                // @ts-expect-error -- THIS SHOULD FAIL
                coordinates: [1.0, 0.0, 0.0],
            },
        },
    ],
};

/**
 * Invalid 3D GeoJSON Feature Collection to test types
 */
export const invalidGeoJsonFeatureCollection3DPositionTooSmall: GeoJSON3DFeatureCollection = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    features: [
        {
            // @ts-expect-error -- THIS SHOULD FAIL
            type: "Foo",
            geometry: {
                // @ts-expect-error -- THIS SHOULD FAIL
                type: "Bar",
                // @ts-expect-error -- THIS SHOULD FAIL
                coordinates: [1.0, 0.0],
                // @ts-expect-error -- THIS SHOULD FAIL
                bbox: [0.0],
                // @ts-expect-error -- THIS SHOULD FAIL
                features: [],
                // @ts-expect-error -- THIS SHOULD FAIL
                properties: {},
                // @ts-expect-error -- THIS SHOULD FAIL
                geometry: {},
                otherKey: "allowed",
            },
            // @ts-expect-error -- THIS SHOULD FAIL
            features: [],
            // @ts-expect-error -- THIS SHOULD FAIL
            coordinates: [],
            // @ts-expect-error -- THIS SHOULD FAIL
            geometries: {},
            otherKey: "allowed",
        },
    ],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometries: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: {},
    otherKey: "allowed",
};
export const invalidGeoJsonFeatureCollection3DPositionTooBig: GeoJSON3DFeatureCollection = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    features: [
        {
            // @ts-expect-error -- THIS SHOULD FAIL
            type: "Foo",
            geometry: {
                // @ts-expect-error -- THIS SHOULD FAIL
                type: "Bar",
                // @ts-expect-error -- THIS SHOULD FAIL
                coordinates: [1.0, 0.0, 0.0, 0.0],
            },
        },
    ],
};

/**
 * Test that types match with @types/geojson
 */
export const featureCollection1: GeoJSONTypes.FeatureCollection<GeoJSONTypes.Geometry | null> =
    singleGeoJsonFeatureCollection3D as GeoJSONFeatureCollection;
export const featureCollection2: GeoJSONTypes.FeatureCollection<GeoJSONTypes.Geometry | null> =
    singleGeoJsonFeatureCollection3D;
export const featureCollection3: GeoJSONTypes.FeatureCollection<GeoJSONTypes.Geometry | null> =
    multiGeoJsonFeatureCollectionWithBbox2D;
