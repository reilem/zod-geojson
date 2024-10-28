import { singleGeoJsonGeometryCollection2D } from "../../examples/geometry/geometry_collection";
import { geoJsonPoint2D } from "../../examples/geometry/point";
import { GeoJSON2DGeometry, GeoJSON3DGeometry, GeoJSONGeometry, GeoJSONGeometrySchema } from "../../src";
import { describe, expect, it } from "@jest/globals";

describe("GeoJSONGeometry", () => {
    it("allows a valid simple geometry", () => {
        expect(GeoJSONGeometrySchema.parse(geoJsonPoint2D)).toEqual(geoJsonPoint2D);
    });

    it("allows a valid geometry collection", () => {
        expect(GeoJSONGeometrySchema.parse(singleGeoJsonGeometryCollection2D)).toEqual(
            singleGeoJsonGeometryCollection2D,
        );
    });
});

/**
 * Invalid GeoJSON Geometry to test types
 */
export const invalidGeoJsonGeometry: GeoJSONGeometry = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
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
};
export const invalidGeoJsonGeometryAsCollection: GeoJSONGeometry = {
    type: "GeometryCollection",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0, 0.0],
    geometries: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: {},
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
    otherKey: "allowed",
};

/**
 * Invalid 2D GeoJSON Geometry to test types
 */
export const invalidGeoJsonGeometry2DPositionTooSmall: GeoJSON2DGeometry = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0, 0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: {},
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
    otherKey: "allowed",
};
export const invalidGeoJsonGeometry2DPositionTooBig: GeoJSON2DGeometry = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0, 0.0, 0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0, 0.0, 0.0],
};
export const invalidGeoJsonGeometry2DAsCollection: GeoJSON2DGeometry = {
    type: "GeometryCollection",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0, 0.0],
    geometries: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: {},
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
    otherKey: "allowed",
};

/**
 * Invalid 3D GeoJSON Geometry to test types
 */
export const invalidGeoJsonGeometry3DPositionTooSmall: GeoJSON3DGeometry = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0, 0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0, 0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: {},
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
    otherKey: "allowed",
};
export const invalidGeoJsonGeometry3DPositionTooBig: GeoJSON3DGeometry = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0, 0.0, 0.0, 0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0, 0.0, 0.0],
};
export const invalidGeoJsonGeometry3DAsCollection: GeoJSON3DGeometry = {
    type: "GeometryCollection",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0, 0.0, 0.0],
    geometries: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: {},
    // @ts-expect-error -- THIS SHOULD FAIL
    geometry: {},
    otherKey: "allowed",
};
