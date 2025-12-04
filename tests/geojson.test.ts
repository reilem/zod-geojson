import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import z, { ZodError } from "zod/v4";
import {
    geoJsonFeatureGeometryCollection3D,
    geoJsonFeatureLineString2D,
    geoJsonFeaturePoint2D,
    geoJsonFeaturePoint3D,
    geoJsonFeaturePolygon2D,
    geoJsonFeaturePolygon3DWithBbox,
} from "../examples/feature";
import {
    multiGeoJsonFeatureCollection2D,
    multiGeoJsonFeatureCollectionPolygon3D,
    singleGeoJsonFeatureCollection2D,
    singleGeoJsonFeatureCollection3D,
    singleGeoJsonFeatureCollectionPolygon2D,
} from "../examples/feature_collection";
import { geoJsonLineString2D } from "../examples/geometry/line_string";
import { geoJsonPoint2D, geoJsonPoint3D } from "../examples/geometry/point";
import { geoJsonPolygon2D, geoJsonPolygon3D } from "../examples/geometry/polygon";
import {
    GeoJSON,
    GeoJSON2D,
    GeoJSON2DGeometry,
    GeoJSON2DPointSchema,
    GeoJSON2DPolygonSchema,
    GeoJSON2DPositionSchema,
    GeoJSON2DSchema,
    GeoJSON3D,
    GeoJSON3DGeometry,
    GeoJSON3DPolygonSchema,
    GeoJSON3DPositionSchema,
    GeoJSON3DSchema,
    GeoJSONGenericSchema,
    GeoJSONGeometry,
    GeoJSONGeometrySchema,
    GeoJSONPointSchema,
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema,
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

    describe("Custom properties", () => {
        const GeoJSONWithCustomProperties = GeoJSONGenericSchema(
            GeoJSONPositionSchema,
            z.object({ foo: z.string() }),
            GeoJSONGeometrySchema,
        );

        it("allows geojson with custom properties", () => {
            const geojson: GeoJSON = {
                ...geoJsonFeaturePolygon2D,
                properties: { foo: "bar" },
            };
            expect(GeoJSONWithCustomProperties.parse(geojson)).toEqual(geojson);
        });

        it("does not allow geojson with invalid custom properties", () => {
            const geojson: GeoJSON = {
                ...geoJsonFeaturePolygon2D,
                properties: { invalid: "bar" },
            };
            expect(() => GeoJSONWithCustomProperties.parse(geojson)).toThrow(ZodError);
        });
    });

    describe("Custom geometries", () => {
        const GeoJSONPointGeoJSONSchema = GeoJSONGenericSchema(
            GeoJSONPositionSchema,
            GeoJSONPropertiesSchema,
            GeoJSONPointSchema,
        );

        const GeoJSON3DPolygonGeoJSONSchema = GeoJSONGenericSchema(
            GeoJSON3DPositionSchema,
            GeoJSONPropertiesSchema,
            GeoJSON3DPolygonSchema,
        );

        const GeoJSON2DPointOrPolygonGeoJSONSchema = GeoJSONGenericSchema(
            GeoJSON2DPositionSchema,
            GeoJSONPropertiesSchema,
            z.discriminatedUnion("type", [GeoJSON2DPointSchema, GeoJSON2DPolygonSchema]),
        );

        it("allows any point containing geojson to be parsed by a point geojson schema", () => {
            expect(GeoJSONPointGeoJSONSchema.parse(geoJsonPoint2D)).toEqual(geoJsonPoint2D);
            expect(GeoJSONPointGeoJSONSchema.parse(geoJsonFeaturePoint2D)).toEqual(geoJsonFeaturePoint2D);
            expect(GeoJSONPointGeoJSONSchema.parse(singleGeoJsonFeatureCollection2D)).toEqual(
                singleGeoJsonFeatureCollection2D,
            );
        });

        it("allows any 3D polygon containing geojson to be parsed by a 3D polygon geojson schema", () => {
            expect(GeoJSON3DPolygonGeoJSONSchema.parse(geoJsonPolygon3D)).toEqual(geoJsonPolygon3D);
            expect(GeoJSON3DPolygonGeoJSONSchema.parse(geoJsonFeaturePolygon3DWithBbox)).toEqual(
                geoJsonFeaturePolygon3DWithBbox,
            );
            expect(GeoJSON3DPolygonGeoJSONSchema.parse(multiGeoJsonFeatureCollectionPolygon3D)).toEqual(
                multiGeoJsonFeatureCollectionPolygon3D,
            );
        });

        it("allows any 2D point or polygon containing geojson to be parsed by a 2D point or polygon geojson schema", () => {
            expect(GeoJSON2DPointOrPolygonGeoJSONSchema.parse(geoJsonPoint2D)).toEqual(geoJsonPoint2D);
            expect(GeoJSON2DPointOrPolygonGeoJSONSchema.parse(geoJsonPolygon2D)).toEqual(geoJsonPolygon2D);

            expect(GeoJSON2DPointOrPolygonGeoJSONSchema.parse(geoJsonFeaturePoint2D)).toEqual(geoJsonFeaturePoint2D);
            expect(GeoJSON2DPointOrPolygonGeoJSONSchema.parse(geoJsonFeaturePolygon2D)).toEqual(
                geoJsonFeaturePolygon2D,
            );

            expect(GeoJSON2DPointOrPolygonGeoJSONSchema.parse(singleGeoJsonFeatureCollection2D)).toEqual(
                singleGeoJsonFeatureCollection2D,
            );
            expect(GeoJSON2DPointOrPolygonGeoJSONSchema.parse(singleGeoJsonFeatureCollectionPolygon2D)).toEqual(
                singleGeoJsonFeatureCollectionPolygon2D,
            );
        });

        it("does not allow a polygon containing geojson to be parsed by a point geojson schema", () => {
            expect(() => GeoJSONPointGeoJSONSchema.parse(geoJsonPolygon2D)).toThrow(ZodError);
            expect(() => GeoJSONPointGeoJSONSchema.parse(geoJsonFeaturePolygon2D)).toThrow(ZodError);
            expect(() => GeoJSONPointGeoJSONSchema.parse(singleGeoJsonFeatureCollectionPolygon2D)).toThrow(ZodError);
        });

        it("does not allow a 2D polygon containing geojson to be parsed by a 3D polygon geojson schema", () => {
            expect(() => GeoJSON3DPolygonGeoJSONSchema.parse(geoJsonPolygon2D)).toThrow(ZodError);
            expect(() => GeoJSON3DPolygonGeoJSONSchema.parse(geoJsonFeaturePolygon2D)).toThrow(ZodError);
            expect(() => GeoJSON3DPolygonGeoJSONSchema.parse(singleGeoJsonFeatureCollectionPolygon2D)).toThrow(
                ZodError,
            );
        });

        it("does not allow a 2D line string containing geojson to be parsed by a 2D point or polygon geojson schema", () => {
            expect(() => GeoJSON2DPointOrPolygonGeoJSONSchema.parse(geoJsonLineString2D)).toThrow(ZodError);
            expect(() => GeoJSON2DPointOrPolygonGeoJSONSchema.parse(geoJsonFeatureLineString2D)).toThrow(ZodError);
            expect(() => GeoJSON2DPointOrPolygonGeoJSONSchema.parse(multiGeoJsonFeatureCollection2D)).toThrow(ZodError);
        });

        it("does not allow a 3D point containing geojson to be parsed by a 2D point or polygon geojson schema", () => {
            expect(() => GeoJSON2DPointOrPolygonGeoJSONSchema.parse(geoJsonPoint3D)).toThrow(ZodError);
            expect(() => GeoJSON2DPointOrPolygonGeoJSONSchema.parse(geoJsonFeaturePoint3D)).toThrow(ZodError);
            expect(() => GeoJSON2DPointOrPolygonGeoJSONSchema.parse(singleGeoJsonFeatureCollection3D)).toThrow(
                ZodError,
            );
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
export const geoJson1: GeoJSONTypes.GeoJSON<GeoJSONTypes.Geometry | null> = geoJsonPoint3D as GeoJSON;
export const geoJson2: GeoJSONTypes.Point = geoJsonPoint3D;
export const geoJson3: GeoJSONTypes.GeoJSON<GeoJSONTypes.Polygon | null> = geoJsonFeaturePolygon2D;
export const geoJson4: GeoJSONTypes.GeoJSON<GeoJSONTypes.GeometryCollection | null> =
    geoJsonFeatureGeometryCollection3D;
