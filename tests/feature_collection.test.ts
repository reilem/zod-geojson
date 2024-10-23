import { describe, expect, it } from "@jest/globals";
import { ZodError } from "zod";
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
    GeoJSONFeatureCollectionSchema,
} from "../src";

function passGeoJSONFeatureCollectionSchemaTest(object: unknown) {
    expect(GeoJSONFeatureCollectionSchema.parse(object)).toEqual(object);
}
function failGeoJSONFeatureCollectionSchemaTest(object: unknown) {
    expect(() => GeoJSONFeatureCollectionSchema.parse(object)).toThrow(ZodError);
}

describe("GeoJSONFeatureCollection", () => {
    it("allows a feature collection with one feature", () => {
        passGeoJSONFeatureCollectionSchemaTest(singleGeoJsonFeatureCollection2D);
    });
    it("allows a feature collection with multiple features", () => {
        passGeoJSONFeatureCollectionSchemaTest(multiGeoJsonFeatureCollection2D);
    });
    it("allows a feature collection and preserves extra keys", () => {
        passGeoJSONFeatureCollectionSchemaTest({
            ...singleGeoJsonFeatureCollection2D,
            color: "#00FF00",
        });
    });
    it("allows a feature collection with multiple features and bbox", () => {
        passGeoJSONFeatureCollectionSchemaTest(multiGeoJsonFeatureCollectionWithBbox2D);
    });
    it("allows a feature collection with empty features array", () => {
        passGeoJSONFeatureCollectionSchemaTest({ ...singleGeoJsonFeatureCollection2D, features: [] });
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
