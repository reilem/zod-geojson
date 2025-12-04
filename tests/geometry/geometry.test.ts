import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import z from "zod/v4";
import { singleGeoJsonGeometryCollection2D } from "../../examples/geometry/geometry_collection";
import { geoJsonLineString3D } from "../../examples/geometry/line_string";
import { multiGeoJsonMultiLineString2D } from "../../examples/geometry/multi_line_string";
import { geoJsonMultiPoint2D } from "../../examples/geometry/multi_point";
import { singleGeoJsonMultiPolygon3D } from "../../examples/geometry/multi_polygon";
import { geoJsonPoint2D, geoJsonPoint3D } from "../../examples/geometry/point";
import { geoJsonPolygon3D } from "../../examples/geometry/polygon";
import {
    GeoJSON2DGeometry,
    GeoJSON3DGeometry,
    GeoJSONGeometry,
    GeoJSONGeometryCollection,
    GeoJSONGeometryGenericSchema,
} from "../../src";
import { passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONGeometryTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest([], value);
}

describe("GeoJSONGeometry", () => {
    it("allows a valid simple geometry", () => {
        passGeoJSONGeometryTest(geoJsonPoint2D);
    });

    it("allows a valid geometry collection", () => {
        passGeoJSONGeometryTest(singleGeoJsonGeometryCollection2D);
    });

    describe("Custom 4D position", () => {
        const GeoJSON4DPosition = z.tuple([z.number(), z.number(), z.number(), z.number()]);
        const GeoJSON4DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON4DPosition);

        it("allows a valid 4D geometry", () => {
            const geoJsonPoint4D = {
                type: "Point",
                coordinates: [1.0, 2.0, 3.0, 4.0],
            };
            expect(GeoJSON4DGeometrySchema.parse(geoJsonPoint4D)).toEqual(geoJsonPoint4D);
        });

        it("does not allow a 3D geometry", () => {
            expect(() => GeoJSON4DGeometrySchema.parse(geoJsonPoint3D)).toThrow(z.ZodError);
        });

        it("does not allow a 5D geometry", () => {
            const geoJsonPoint5D = {
                type: "Point",
                coordinates: [1.0, 2.0, 3.0, 4.0, 5.0],
            };
            expect(() => GeoJSON4DGeometrySchema.parse(geoJsonPoint5D)).toThrow(z.ZodError);
        });
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

/**
 * Test that types match with @types/geojson
 */
export const geometry1: GeoJSONTypes.Geometry = geoJsonPoint2D;
export const geometry2: GeoJSONTypes.Geometry = geoJsonLineString3D;
export const geometry3: GeoJSONTypes.Geometry = geoJsonMultiPoint2D;
export const geometry4: GeoJSONTypes.Geometry = geoJsonPolygon3D;
export const geometry5: GeoJSONTypes.Geometry = multiGeoJsonMultiLineString2D;
export const geometry6: GeoJSONTypes.Geometry = singleGeoJsonMultiPolygon3D;
export const geometry7: GeoJSONTypes.Geometry = singleGeoJsonGeometryCollection2D;
export const geometry8: GeoJSONTypes.Geometry = singleGeoJsonGeometryCollection2D as GeoJSONGeometryCollection;
