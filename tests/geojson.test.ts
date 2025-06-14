import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import { ZodError } from "zod/v4";
import { geoJsonFeatureGeometryCollection3D, geoJsonFeaturePolygon2D } from "../examples/feature";
import { multiGeoJsonFeatureCollection2D } from "../examples/feature_collection";
import { geoJsonPoint3D } from "../examples/geometry/point";
import {
    GeoJSON,
    GeoJSON2D,
    GeoJSON2DGeometry,
    GeoJSON2DSchema,
    GeoJSON3D,
    GeoJSON3DGeometry,
    GeoJSON3DSchema,
    GeoJSONGeometry,
    GeoJSONSchema,
} from "../src";
import { singleGeoJsonFeatureCollection4D } from "./feature_collection.test";
import { singleGeoJsonGeometryCollection4D } from "./geometry/geometry_collection.test";
import { geoJsonPoint4D } from "./geometry/point.test";

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
        expect(() => GeoJSONSchema.parse({ type: "Foo" })).toThrow(ZodError);
    });

    describe("2D", () => {
        it("allows a 2D geojson", () => {
            expect(GeoJSON2DSchema.parse(geoJsonFeaturePolygon2D)).toEqual(geoJsonFeaturePolygon2D);
        });
        it("does not allow a 3D geojson", () => {
            expect(() => GeoJSON2DSchema.parse(geoJsonPoint3D)).toThrow(ZodError);
        });
        it("does not allow a 4D geojson", () => {
            expect(() => GeoJSON2DSchema.parse(singleGeoJsonGeometryCollection4D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D geojson", () => {
            expect(GeoJSON3DSchema.parse(geoJsonPoint3D)).toEqual(geoJsonPoint3D);
        });
        it("does not allow a 2D geojson", () => {
            expect(() => GeoJSON3DSchema.parse(geoJsonFeaturePolygon2D)).toThrow(ZodError);
        });
        it("does not allow a 4D geojson", () => {
            expect(() => GeoJSON3DSchema.parse(singleGeoJsonFeatureCollection4D)).toThrow(ZodError);
        });
    });
});

/**
 * Invalid GeoJSON to test types
 */
const testGeometry: GeoJSONGeometry = { type: "Point", coordinates: [0.0, 0.0] };
export const invalidGeoJsonPoint: GeoJSON = {
    type: "Point",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 2.0],
};
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonPointProperties: GeoJSON = {
    type: "Point",
    coordinates: [0.0, 0.0],
    properties: {},
    geometry: testGeometry,
    features: [],
    geometries: [],
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
};
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonPositionsTooBig: GeoJSON = geoJsonPoint4D;

/**
 * Invalid 2D GeoJSON to test types
 */
const testGeometry2D: GeoJSON2DGeometry = { type: "Point", coordinates: [0.0, 0.0] };
export const invalidGeoJson2DPoint: GeoJSON2D = {
    type: "Point",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 2.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
};
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJson2DPointProperties: GeoJSON2D = {
    type: "Point",
    coordinates: [0.0, 0.0],
    properties: {},
    geometry: testGeometry2D,
    features: [],
    geometries: [],
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
    geometry: {},
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
    geometries: {},
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
    geometry: {},
};

/**
 * Invalid 3D GeoJSON to test types
 */
const testGeometry3D: GeoJSON3DGeometry = { type: "Point", coordinates: [0.0, 0.0, 0.0] };
export const invalidGeoJson3DPoint: GeoJSON3D = {
    type: "Point",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0, 0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 2.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
};
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJson3DPointProperties: GeoJSON3D = {
    type: "Point",
    coordinates: [0.0, 0.0, 0.0],
    properties: {},
    geometry: testGeometry3D,
    features: [],
    geometries: [],
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
    geometry: {},
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
    geometries: {},
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
    geometry: {},
};

/**
 * Test that types match with @types/geojson
 */
export const geoJson1: GeoJSONTypes.GeoJSON = geoJsonPoint3D;
// @ts-expect-error -- THIS IS A BUG IN THE TYPES https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71066
export const geoJson2: GeoJSONTypes.GeoJSON = geoJsonPoint3D as GeoJSON;
// @ts-expect-error -- THIS IS A BUG IN THE TYPES https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71066
export const geoJson2: GeoJSONTypes.GeoJSON = geoJsonFeaturePolygon2D;
// @ts-expect-error -- THIS IS A BUG IN THE TYPES https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71066
export const geoJson3: GeoJSONTypes.GeoJSON = geoJsonFeatureGeometryCollection3D;
