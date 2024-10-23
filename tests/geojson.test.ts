import { describe, expect, it } from "@jest/globals";
import { ZodError } from "zod";
import { geoJsonFeaturePolygon2D } from "../examples/feature";
import { multiGeoJsonFeatureCollection2D } from "../examples/feature_collection";
import { geoJsonPoint3D } from "../examples/geometry/point";
import { GeoJSON, GeoJSON2D, GeoJSON2DSchema, GeoJSON3D, GeoJSON3DSchema, GeoJSONSchema } from "../src";

describe("GeoJSONSchema", () => {
    it("allows a basic geometry", () => {
        expect(GeoJSONSchema.parse(geoJsonPoint3D)).toEqual(geoJsonPoint3D);
    });
    it("allows a basic feature", () => {
        expect(GeoJSONSchema.parse(geoJsonFeaturePolygon2D)).toEqual(geoJsonFeaturePolygon2D);
    });
    it("allows a basic feature collection", () => {
        expect(GeoJSONSchema.parse(multiGeoJsonFeatureCollection2D)).toEqual(multiGeoJsonFeatureCollection2D);
    });

    it("does not allow a geojson with invalid type", () => {
        expect(() => GeoJSONSchema.parse({ type: "SkippityBoop" })).toThrow(ZodError);
    });

    describe("2D", () => {
        it("allows a 2D geojson", () => {
            expect(GeoJSON2DSchema.parse(geoJsonFeaturePolygon2D)).toEqual(geoJsonFeaturePolygon2D);
        });
        it("does not allow a 3D geojson", () => {
            expect(() => GeoJSON2DSchema.parse(geoJsonPoint3D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D geojson", () => {
            expect(GeoJSON3DSchema.parse(geoJsonPoint3D)).toEqual(geoJsonPoint3D);
        });
        it("does not allow a 2D geojson", () => {
            expect(() => GeoJSON3DSchema.parse(geoJsonFeaturePolygon2D)).toThrow(ZodError);
        });
    });
});

/**
 * Invalid GeoJSON to test types
 */
export const invalidGeoJsonPoint: GeoJSON = {
    type: "Point",
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
export const invalidGeoJsonGeometryCollection: GeoJSON = {
    type: "GeometryCollection",
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
export const invalidGeoJsonFeature: GeoJSON = {
    type: "Feature",
    geometry: {
        // @ts-expect-error -- THIS SHOULD FAIL
        type: "Foo",
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
    bbox: [1.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometries: {},
    otherKey: "allowed",
};
export const invalidGeoJsonFeatureCollection: GeoJSON = {
    type: "FeatureCollection",
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
 * Invalid 2D GeoJSON to test types
 */
export const invalidGeoJson2DPoint: GeoJSON2D = {
    type: "Point",
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
export const invalidGeoJson2DGeometryCollection: GeoJSON2D = {
    type: "GeometryCollection",
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
export const invalidGeoJson2DFeature: GeoJSON2D = {
    type: "Feature",
    geometry: {
        // @ts-expect-error -- THIS SHOULD FAIL
        type: "Foo",
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
    bbox: [1.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometries: {},
    otherKey: "allowed",
};
export const invalidGeoJson2DFeatureCollection: GeoJSON2D = {
    type: "FeatureCollection",
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
 * Invalid 3D GeoJSON to test types
 */
export const invalidGeoJson3DPoint: GeoJSON3D = {
    type: "Point",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0, 0.0],
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
export const invalidGeoJson3DGeometryCollection: GeoJSON3D = {
    type: "GeometryCollection",
    geometries: [
        {
            // @ts-expect-error -- THIS SHOULD FAIL
            type: "Foo",
            // @ts-expect-error -- THIS SHOULD FAIL
            coordinates: [1.0, 0.0],
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
export const invalidGeoJson3DFeature: GeoJSON3D = {
    type: "Feature",
    geometry: {
        // @ts-expect-error -- THIS SHOULD FAIL
        type: "Foo",
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
    bbox: [1.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometries: {},
    otherKey: "allowed",
};
export const invalidGeoJson3DFeatureCollection: GeoJSON3D = {
    type: "FeatureCollection",
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
