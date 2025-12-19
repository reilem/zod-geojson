import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import z, { ZodError } from "zod/v4";
import { featureCollection as turfFeatureCollection, feature as turfFeature, point as turfPoint } from "@turf/helpers";

import {
    geoJsonFeatureGeometryCollection3D,
    geoJsonFeatureLineString2D,
    geoJsonFeatureNullGeometry,
    geoJsonFeaturePoint2D,
    geoJsonFeaturePoint3D,
    geoJsonFeaturePolygon2D,
    geoJsonFeaturePolygon3DWithBBox,
} from "../examples/feature";
import {
    geoJsonFeatureCollectionNullGeometry,
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
    GeoJSONGeometryGenericSchema,
    GeoJSONGeometrySchema,
    GeoJSONPointSchema,
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSONSchema,
} from "../src";
import { singleGeoJsonFeatureCollection4D } from "./feature_collection.test";
import { singleGeoJsonGeometryCollection4D } from "./geometry/geometry_collection.test";

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

    describe("Custom 4D position", () => {
        const GeoJSON4DPositionSchema = z.tuple([z.number(), z.number(), z.number(), z.number()]);

        const GeoJSON4DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON4DPositionSchema);

        const GeoJSON4DSchema = GeoJSONGenericSchema(
            GeoJSON4DPositionSchema,
            GeoJSONPropertiesSchema,
            GeoJSON4DGeometrySchema,
        );

        it("allows geojson with 4D positions", () => {
            const geoJsonPolygon4D = {
                type: "Polygon",
                coordinates: [
                    [
                        [0.0, 0.0, 0.0, 0.0],
                        [1.0, 0.0, 0.0, 0.0],
                        [1.0, 1.0, 2.0, 0.0],
                        [0.0, 2.0, 2.0, 0.0],
                        [0.0, 0.0, 0.0, 0.0],
                    ],
                ],
            };
            expect(GeoJSON4DSchema.parse(geoJsonPolygon4D)).toEqual(geoJsonPolygon4D);
        });

        it("does not allow geojson with 3D positions", () => {
            expect(() => GeoJSON4DSchema.parse(geoJsonFeaturePoint3D)).toThrow(ZodError);
        });

        it("does not allow geojson with 5D positions", () => {
            const feature = {
                ...geoJsonFeaturePoint2D,
                geometry: {
                    type: "Point",
                    coordinates: [1.0, 2.0, 3.0, 4.0, 5.0],
                },
            };
            expect(() => GeoJSON4DSchema.parse(feature)).toThrow(ZodError);
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

        const GeoJSONNullableSchema = GeoJSONGenericSchema(
            GeoJSONPositionSchema,
            GeoJSONPropertiesSchema,
            GeoJSONGeometrySchema.nullable(),
        );

        const GeoJSONNullablePointSchema = GeoJSONGenericSchema(
            GeoJSONPositionSchema,
            GeoJSONPropertiesSchema,
            GeoJSONPointSchema.nullable(),
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
            expect(GeoJSON3DPolygonGeoJSONSchema.parse(geoJsonFeaturePolygon3DWithBBox)).toEqual(
                geoJsonFeaturePolygon3DWithBBox,
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

        it("allows valid geojson to be parsed by a geojson schema with nullable geometry", () => {
            expect(GeoJSONNullableSchema.parse(geoJsonFeaturePolygon2D)).toEqual(geoJsonFeaturePolygon2D);
            expect(GeoJSONNullableSchema.parse(multiGeoJsonFeatureCollection2D)).toEqual(
                multiGeoJsonFeatureCollection2D,
            );

            expect(GeoJSONNullablePointSchema.parse(geoJsonFeaturePoint2D)).toEqual(geoJsonFeaturePoint2D);
            expect(GeoJSONNullablePointSchema.parse(singleGeoJsonFeatureCollection3D)).toEqual(
                singleGeoJsonFeatureCollection3D,
            );
        });

        it("allows null geometry to be parsed by a geojson schema with nullable geometry", () => {
            expect(GeoJSONNullableSchema.parse(geoJsonFeatureNullGeometry)).toEqual(geoJsonFeatureNullGeometry);
            expect(GeoJSONNullableSchema.parse(geoJsonFeatureCollectionNullGeometry)).toEqual(
                geoJsonFeatureCollectionNullGeometry,
            );

            expect(GeoJSONNullablePointSchema.parse(geoJsonFeatureNullGeometry)).toEqual(geoJsonFeatureNullGeometry);
            expect(GeoJSONNullablePointSchema.parse(geoJsonFeatureCollectionNullGeometry)).toEqual(
                geoJsonFeatureCollectionNullGeometry,
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

        it("throws error when trying to make a geojson schema with an invalid geometry schema", () => {
            expect(() =>
                GeoJSONGenericSchema(
                    GeoJSONPositionSchema,
                    GeoJSONPropertiesSchema,
                    GeoJSONGeometrySchema.or(z.null()),
                ),
            ).toThrow(Error);

            expect(() =>
                GeoJSONGenericSchema(
                    GeoJSONPositionSchema,
                    GeoJSONPropertiesSchema,
                    GeoJSONGeometrySchema.or(z.null()).nullable(),
                ),
            ).toThrow(Error);

            expect(() =>
                GeoJSONGenericSchema(
                    GeoJSONPositionSchema,
                    GeoJSONPropertiesSchema,
                    GeoJSONGeometrySchema.nullable().or(z.null()),
                ),
            ).toThrow(Error);

            expect(() =>
                GeoJSONGenericSchema(
                    GeoJSONPositionSchema,
                    GeoJSONPropertiesSchema,
                    // @ts-expect-error -- THIS SHOULD FAIL
                    GeoJSONGeometrySchema.optional(),
                ),
            ).toThrow(Error);

            expect(() =>
                GeoJSONGenericSchema(
                    GeoJSONPositionSchema,
                    GeoJSONPropertiesSchema,
                    // @ts-expect-error -- THIS SHOULD FAIL
                    GeoJSONGeometrySchema.or(z.undefined()),
                ),
            ).toThrow(Error);

            // These do not throw, but we need to make sure typescript forbids it
            GeoJSONGenericSchema(
                GeoJSONPositionSchema,
                GeoJSONPropertiesSchema,
                // @ts-expect-error -- THIS SHOULD FAIL
                z.object({ something: "without a type field" }),
            );
            GeoJSONGenericSchema(
                GeoJSONPositionSchema,
                GeoJSONPropertiesSchema,
                // @ts-expect-error -- THIS SHOULD FAIL
                z.object({ type: "not a geometry" }),
            );
            GeoJSONGenericSchema(
                GeoJSONPositionSchema,
                GeoJSONPropertiesSchema,
                // @ts-expect-error -- THIS SHOULD FAIL
                z.discriminatedUnion("something", [z.object({ something: "without a type field" })]),
            );
        });
    });

    describe("turf.js", () => {
        it("validates feature from turf.js", () => {
            const feature = turfFeature(geoJsonPolygon3D, { more: { data: 1123 } });
            expect(GeoJSONSchema.parse(feature)).toEqual(feature);
        });

        it("validates geometry from turf.js feature", () => {
            const geometry = turfFeature(geoJsonPolygon3D, { more: { data: 1123 } }).geometry;
            expect(GeoJSONSchema.parse(geometry)).toEqual(geometry);
        });

        it("validates feature collection from turf.js", () => {
            const featureCollection = turfFeatureCollection([
                turfPoint([1, 1], { extra: "word" }),
                turfPoint([1, 2], { extra: "hello" }),
            ]);
            expect(GeoJSONSchema.parse(featureCollection)).toEqual(featureCollection);
        });

        it("validates point from turf.js", () => {
            const point = turfPoint([1, 2], { extra: "word" });
            expect(GeoJSONSchema.parse(point)).toEqual(point);
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
    coordinates: "[0.0]",
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
            coordinates: "[1.0]",
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
        coordinates: "[1.0]",
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
                coordinates: "[1.0]",
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
 * Test custom strict position typing
 */
const GeoJSON2DStrictPositionSchema = z.tuple([z.number(), z.number()]);

const GeoJSON2DStrictGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON2DStrictPositionSchema);

const GeoJSON2DStrictSchema = GeoJSONGenericSchema(
    GeoJSON2DStrictPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSON2DStrictGeometrySchema,
);
type GeoJSON2DStrict = z.infer<typeof GeoJSON2DStrictSchema>;

export const strict2DPositionGeoJsonPoint: GeoJSON2DStrict = {
    type: "Point",
    coordinates: [1.0, 2.0],
    bbox: [0.0, 0.0, 3.0, 4.0],
};

export const invalid2DPositionGeoJsonPoint: GeoJSON2DStrict = {
    type: "Point",
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [1.0, 2.0, 3.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [0.0, 0.0, 3.0, 4.0, 0.0, 0.0],
};

/**
 * Test that types match with @types/geojson
 */
export const geoJson1: GeoJSONTypes.GeoJSON = geoJsonPoint3D as GeoJSON;
export const geoJson2: GeoJSONTypes.Point = geoJsonPoint3D;
export const geoJson3: GeoJSONTypes.GeoJSON<GeoJSONTypes.Polygon> = geoJsonFeaturePolygon2D;
export const geoJson4: GeoJSONTypes.GeoJSON<GeoJSONTypes.GeometryCollection> = geoJsonFeatureGeometryCollection3D;

/**
 * Test that @types/geojson matches our types
 */
export const geoJson5: GeoJSON = geoJson1;
export const geoJson6: GeoJSON = geoJson2;
export const geoJson7: GeoJSON = geoJson3;
export const geoJson8: GeoJSON = geoJson4;

/**
 * Test that turf.js matches our types
 */
export const geojson9: GeoJSON = turfFeature(geoJsonPolygon3D, { more: { data: 1123 } });
export const geojson10: GeoJSON = turfFeature(geoJsonPolygon3D, { more: { data: 1123 } }).geometry;
export const geojson11: GeoJSON = turfFeatureCollection([
    turfPoint([1, 1], { extra: "word" }),
    turfPoint([1, 2], { extra: "hello" }),
]);
export const geojson12: GeoJSON = turfFeatureCollection([turfPoint([1, 1], { extra: "word" })]).features[0];
export const geojson13: GeoJSON = turfFeatureCollection([turfPoint([1, 1], { extra: "word" })]).features[0].geometry;
export const geojson14: GeoJSON = turfPoint([1, 2], { extra: "word" });
