import { describe, expect, it } from "@jest/globals";
import { feature as turfFeature, point as turfPoint } from "@turf/helpers";
import type GeoJSONTypes from "geojson";
import * as z from "zod";

import {
    geoJsonFeatureGeometryCollection2D,
    geoJsonFeatureGeometryCollection3D,
    geoJsonFeatureLineString2D,
    geoJsonFeaturePoint2D,
    geoJsonFeaturePoint3D,
    geoJsonFeaturePolygon2D,
    geoJsonFeaturePolygon3DWithBBox,
} from "../examples/feature";
import { geoJsonLineString2D } from "../examples/geometry/line_string";
import { geoJsonPoint3D } from "../examples/geometry/point";
import {
    GeoJSON2DFeature,
    GeoJSON2DFeatureSchema,
    GeoJSON2DGeometry,
    GeoJSON2DPointSchema,
    GeoJSON2DPolygonSchema,
    GeoJSON2DPositionSchema,
    GeoJSON3DFeature,
    GeoJSON3DFeatureSchema,
    GeoJSON3DGeometry,
    GeoJSON3DPointSchema,
    GeoJSON3DPolygonSchema,
    GeoJSON3DPositionSchema,
    GeoJSONFeature,
    GeoJSONFeatureGenericSchema,
    GeoJSONFeatureSchema,
    GeoJSONGeometry,
    GeoJSONGeometryGenericSchema,
    GeoJSONGeometrySchema,
    GeoJSONPoint,
    GeoJSONPointSchema,
    GeoJSONPosition,
    GeoJSONPositionSchema,
    GeoJSONProperties,
    GeoJSONPropertiesSchema,
} from "../src";
import { GeoJSONFeatureGeneric } from "../src/feature";
import { Equals, failGeoJSONSchemaTest, passGeoJSONSchemaTest } from "./_helpers";
import { geoJsonPoint4D } from "./geometry/point.test";

export const geoJsonFeaturePoint4D = {
    ...geoJsonFeaturePoint2D,
    geometry: geoJsonPoint4D,
};

function passGeoJSON2DFeatureSchemaTest(object: unknown) {
    passGeoJSONSchemaTest([GeoJSONFeatureSchema, GeoJSON2DFeatureSchema], object);
}

function passGeoJSON3DFeatureSchemaTest(object: unknown) {
    passGeoJSONSchemaTest([GeoJSONFeatureSchema, GeoJSON3DFeatureSchema], object);
}

function failGeoJSONFeatureSchemaTest(object: unknown) {
    failGeoJSONSchemaTest([GeoJSONFeatureSchema, GeoJSON2DFeatureSchema, GeoJSON3DFeatureSchema], object);
}

describe("GeoJSONFeature", () => {
    it("allows a feature with a 2D point geometry", () => {
        passGeoJSON2DFeatureSchemaTest(geoJsonFeaturePoint2D);
    });
    it("allows a feature with a 3D point geometry", () => {
        passGeoJSON3DFeatureSchemaTest(geoJsonFeaturePoint3D);
    });
    it("allows a feature with a 2D polygon geometry", () => {
        passGeoJSON2DFeatureSchemaTest(geoJsonFeaturePolygon2D);
    });
    it("allows a feature with a 3D polygon geometry and valid bbox", () => {
        passGeoJSON3DFeatureSchemaTest(geoJsonFeaturePolygon3DWithBBox);
    });
    it("allows a feature with a 2D geometry collection", () => {
        passGeoJSON2DFeatureSchemaTest(geoJsonFeatureGeometryCollection2D);
    });
    it("allows a feature with a 3D geometry collection", () => {
        passGeoJSON3DFeatureSchemaTest(geoJsonFeatureGeometryCollection3D);
    });
    it("allows a feature with a string id", () => {
        passGeoJSON2DFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            id: "unique-id",
        });
    });
    it("allows a feature with a number id", () => {
        passGeoJSON2DFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            id: 98765,
        });
    });
    it("allows a feature with a string id", () => {
        passGeoJSON2DFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            id: "98765",
        });
    });
    it("allows a feature and preserves extra keys", () => {
        passGeoJSON2DFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            color: "#FF00FF",
        });
    });
    it("allows a feature with null properties", () => {
        passGeoJSON2DFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            properties: null,
        });
    });

    it("does not allow a feature with null geometry", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometry: null,
        });
    });
    it("does not allow a feature with a 1D geometry", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometry: {
                type: "Point",
                coordinates: [0.0],
            },
        });
    });
    it("does not allow a feature with a 4D geometry", () => {
        failGeoJSONFeatureSchemaTest(geoJsonFeaturePoint4D);
    });
    it("does not allow a feature without properties", () => {
        failGeoJSONFeatureSchemaTest({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [0.0, 2.0],
            },
        });
    });
    it("does not allow a feature without geometry", () => {
        failGeoJSONFeatureSchemaTest({
            type: "Feature",
            properties: {},
        });
    });
    it("does not allow a feature with the coordinates key", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            coordinates: [],
        });
    });
    it("does not allow a feature with the features key", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            features: [],
        });
    });
    it("does not allow a feature with the geometries key", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometries: [],
        });
    });
    it("does not allow a feature with a geometry with invalid type", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometry: {
                type: "BadType",
                coordinates: [0.0, 2.0],
            },
        });
    });
    it("does not allow a feature with a geometry with inconsistent position dimensions", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometry: {
                type: "MultiPoint",
                coordinates: [
                    [50.0, 10.0],
                    [0.0, 2.0, 3.0],
                ],
            },
        });
    });
    it("does not allow a feature with a geometry with invalid coordinates", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometry: {
                type: "Polygon",
                coordinates: [[[[[0.0, 10.0]]]]],
            },
        });
    });
    it("does not allow a feature with a geometry with incorrect bbox", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            bbox: [0.0, 0.0, 10.0, 10.0],
        });
    });
    it("does not allow a feature with a geometry with invalid bbox dimensions", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 0.0],
        });
    });
    it("does not allow a feature with a geometry with badly formatted bbox", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            bbox: ["bbox must not contain strings"],
        });
    });

    describe("2D", () => {
        it("allows a 2D feature", () => {
            expect(GeoJSON2DFeatureSchema.parse(geoJsonFeaturePolygon2D)).toEqual(geoJsonFeaturePolygon2D);
        });
        it("does not allow a 3D feature", () => {
            expect(() => GeoJSON2DFeatureSchema.parse(geoJsonFeaturePoint3D)).toThrow(z.ZodError);
        });
        it("does not allow a 4D feature", () => {
            expect(() => GeoJSON2DFeatureSchema.parse(geoJsonFeaturePoint4D)).toThrow(z.ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D feature", () => {
            expect(GeoJSON3DFeatureSchema.parse(geoJsonFeaturePoint3D)).toEqual(geoJsonFeaturePoint3D);
        });
        it("does not allow a 2D feature", () => {
            expect(() => GeoJSON3DFeatureSchema.parse(geoJsonFeaturePolygon2D)).toThrow(z.ZodError);
        });
        it("does not allow a 4D feature", () => {
            expect(() => GeoJSON3DFeatureSchema.parse(geoJsonFeaturePoint4D)).toThrow(z.ZodError);
        });
    });

    describe("Custom 4D position", () => {
        const GeoJSON4DPositionSchema = z.tuple([z.number(), z.number(), z.number(), z.number()]);

        const GeoJSON4DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON4DPositionSchema);

        const GeoJSON4DFeatureSchema = GeoJSONFeatureGenericSchema(
            GeoJSON4DPositionSchema,
            GeoJSONPropertiesSchema,
            GeoJSON4DGeometrySchema,
        );

        const feature = {
            ...geoJsonFeaturePoint2D,
            geometry: {
                type: "Point",
                coordinates: [1.0, 2.0, 3.0, 4.0],
            },
        };

        it("allows feature with 4D positions", () => {
            expect(GeoJSON4DFeatureSchema.parse(feature)).toEqual(feature);
        });

        it("allows a feature with 4D position and valid bbox", () => {
            const featureWithBBox = {
                ...feature,
                bbox: [1.0, 2.0, 3.0, 4.0, 1.0, 2.0, 3.0, 4.0],
            };
            expect(GeoJSON4DFeatureSchema.parse(featureWithBBox)).toEqual(featureWithBBox);
        });

        it("does not allow feature with 3D positions", () => {
            expect(() => GeoJSON4DFeatureSchema.parse(geoJsonFeaturePoint3D)).toThrow(z.ZodError);
        });

        it("does not allow feature with 5D positions", () => {
            const feature = {
                ...geoJsonFeaturePoint2D,
                geometry: {
                    type: "Point",
                    coordinates: [1.0, 2.0, 3.0, 4.0, 5.0],
                },
            };
            expect(() => GeoJSON4DFeatureSchema.parse(feature)).toThrow(z.ZodError);
        });

        it("does not allow a feature with 4D positions and invalid bbox", () => {
            const featureWithInvalidBBox = {
                ...feature,
                bbox: [1.0, 2.0, 3.0, 4.0], // Invalid bbox for 4D position
            };
            expect(() => GeoJSON4DFeatureSchema.parse(featureWithInvalidBBox)).toThrow(z.ZodError);
        });
    });

    describe("Custom properties", () => {
        const GeoJSONFeatureWithCustomProperties = GeoJSONFeatureGenericSchema(
            GeoJSONPositionSchema,
            z.object({ name: z.string(), age: z.number(), meta: z.object({ firstLogin: z.boolean() }) }),
            GeoJSONGeometrySchema,
        );

        it("allows feature with custom properties", () => {
            const feature = {
                ...geoJsonFeaturePoint2D,
                properties: {
                    name: "John Doe",
                    age: 30,
                    meta: {
                        firstLogin: true,
                    },
                },
            };
            expect(GeoJSONFeatureWithCustomProperties.parse(feature)).toEqual(feature);
        });

        it("does not allow feature with missing properties", () => {
            const feature = {
                ...geoJsonFeaturePoint2D,
                properties: {
                    name: "John Doe",
                    age: 30,
                },
            };
            expect(() => GeoJSONFeatureWithCustomProperties.parse(feature)).toThrow(z.ZodError);
        });
    });

    describe("Custom geometry", () => {
        const GeoJSONPointFeatureSchema = GeoJSONFeatureGenericSchema(
            GeoJSONPositionSchema,
            GeoJSONPropertiesSchema,
            GeoJSONPointSchema,
        );

        const GeoJSON3DPolygonFeatureSchema = GeoJSONFeatureGenericSchema(
            GeoJSON3DPositionSchema,
            GeoJSONPropertiesSchema,
            GeoJSON3DPolygonSchema,
        );

        const GeoJSON2DPointOrPolygonFeatureSchema = GeoJSONFeatureGenericSchema(
            GeoJSON2DPositionSchema,
            GeoJSONPropertiesSchema,
            z.discriminatedUnion("type", [GeoJSON2DPointSchema, GeoJSON2DPolygonSchema]),
        );

        const GeoJSONNullableGeometryFeatureSchema = GeoJSONFeatureGenericSchema(
            GeoJSONPositionSchema,
            GeoJSONPropertiesSchema,
            GeoJSONGeometrySchema.nullable(),
        );

        it("allows any point feature to be parsed by a point feature schema", () => {
            expect(GeoJSONPointFeatureSchema.parse(geoJsonFeaturePoint2D)).toEqual(geoJsonFeaturePoint2D);
            expect(GeoJSONPointFeatureSchema.parse(geoJsonFeaturePoint3D)).toEqual(geoJsonFeaturePoint3D);
        });

        it("allows a 3D polygon feature to be parsed by a 3D polygon feature schema ", () => {
            expect(GeoJSON3DPolygonFeatureSchema.parse(geoJsonFeaturePolygon3DWithBBox)).toEqual(
                geoJsonFeaturePolygon3DWithBBox,
            );
        });

        it("allows either a 2D point or 2D polygon feature to be parsed by a 2D point or polygon feature schema", () => {
            expect(GeoJSON2DPointOrPolygonFeatureSchema.parse(geoJsonFeaturePoint2D)).toEqual(geoJsonFeaturePoint2D);
            expect(GeoJSON2DPointOrPolygonFeatureSchema.parse(geoJsonFeaturePolygon2D)).toEqual(
                geoJsonFeaturePolygon2D,
            );
        });

        it("allows a feature to be parsed by a nullable geometry feature schema", () => {
            expect(GeoJSONNullableGeometryFeatureSchema.parse(geoJsonFeaturePoint2D)).toEqual(geoJsonFeaturePoint2D);
        });

        it("allows a feature with nullable geometry to be parsed by a nullable geometry feature schema", () => {
            const nullGeometryFeature = {
                ...geoJsonFeaturePoint2D,
                geometry: null,
            };
            expect(GeoJSONNullableGeometryFeatureSchema.parse(nullGeometryFeature)).toEqual(nullGeometryFeature);
            expect(GeoJSONNullableGeometryFeatureSchema.parse(geoJsonFeaturePoint2D)).toEqual(geoJsonFeaturePoint2D);
        });

        it("does not allow a polygon feature to be parsed by a point feature schema", () => {
            expect(() => GeoJSONPointFeatureSchema.parse(geoJsonFeaturePolygon2D)).toThrow(z.ZodError);
        });

        it("does not allow a 2D polygon feature to be parsed by a 3D polygon feature schema", () => {
            expect(() => GeoJSON3DPolygonFeatureSchema.parse(geoJsonFeaturePolygon2D)).toThrow(z.ZodError);
        });

        it("does not allow a 2D line string feature to be parsed by a 2D point or polygon feature schema", () => {
            expect(() =>
                GeoJSON2DPointOrPolygonFeatureSchema.parse({
                    type: "Feature",
                    properties: {},
                    geometry: geoJsonLineString2D,
                }),
            ).toThrow(z.ZodError);
        });

        it("does not allow a 3D point feature to be parsed by a 2D point or polygon feature schema", () => {
            expect(() => GeoJSON2DPointOrPolygonFeatureSchema.parse(geoJsonFeaturePoint3D)).toThrow(z.ZodError);
        });
    });

    describe("turf.js", () => {
        it("validates feature from turf.js", () => {
            const feature = turfFeature(geoJsonPoint3D);
            expect(GeoJSONFeatureSchema.parse(feature)).toEqual(feature);
        });

        it("validates feature with properties from turf.js", () => {
            const feature = turfPoint([0, 0, 0], { name: "test" });
            expect(GeoJSONFeatureSchema.parse(feature)).toEqual(feature);
        });
    });
});

/**
 * Invalid GeoJSON Feature to test types
 */
export const invalidGeoJsonFeature: GeoJSONFeature = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
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
    bbox: [1.0, 0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometries: {},
    otherKey: "allowed",
};
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonFeaturePositionsTooBig: GeoJSONFeature2D = geoJsonFeaturePoint4D;

/**
 * Invalid 2D GeoJSON Feature to test types
 */
export const invalidGeoJsonFeature2DPositionTooSmall: GeoJSON2DFeature = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
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
    bbox: [1.0, 0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometries: {},
    otherKey: "allowed",
};
export const invalidGeoJsonFeature2DPositionTooBig: GeoJSON2DFeature = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    geometry: {
        // @ts-expect-error -- THIS SHOULD FAIL
        type: "Foo",
        // @ts-expect-error -- THIS SHOULD FAIL
        coordinates: [1.0, 0.0, 0.0],
    },
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 0.0, 0.0],
};

/**
 * Invalid 3D GeoJSON Feature to test types
 */
export const invalidGeoJsonFeature3DPositionTooSmall: GeoJSON3DFeature = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
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
    bbox: [1.0, 0.0],
    // @ts-expect-error -- THIS SHOULD FAIL
    features: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    coordinates: [],
    // @ts-expect-error -- THIS SHOULD FAIL
    geometries: {},
    otherKey: "allowed",
};
export const invalidGeoJsonFeature3DPositionTooBig: GeoJSON3DFeature = {
    // @ts-expect-error -- THIS SHOULD FAIL
    type: "Hello",
    geometry: {
        // @ts-expect-error -- THIS SHOULD FAIL
        type: "Foo",
        // @ts-expect-error -- THIS SHOULD FAIL
        coordinates: [1.0, 0.0, 0.0, 0.0],
    },
    // @ts-expect-error -- THIS SHOULD FAIL
    bbox: [1.0, 0.0, 0.0],
};

/**
 * Test the ability to make properties non-nullable
 */
export type FeatureWithNonNullableProperties = GeoJSONFeatureGeneric<
    GeoJSONPosition,
    GeoJSONProperties,
    GeoJSONGeometry
>;

export const validFeatureWithNonNullableProperties: FeatureWithNonNullableProperties = {
    ...geoJsonFeaturePoint2D,
    properties: {
        key: "value",
    },
};

export const invalidFeatureWithNonNullableProperties: FeatureWithNonNullableProperties = {
    type: "Feature",
    // @ts-expect-error -- THIS SHOULD FAIL
    properties: null,
};

/**
 * Test the ability to make geometry nullable
 */
export type FeatureWithNullableGeometry = GeoJSONFeatureGeneric<
    GeoJSONPosition,
    GeoJSONProperties,
    GeoJSONGeometry | null
>;

export const validFeatureWithNullableGeometry2: FeatureWithNullableGeometry = {
    type: "Feature",
    properties: {},
    geometry: null,
};

/**
 * Test inferred types of feature schema with custom properties
 */
export const FeatureWithCustomPropertiesSchema = GeoJSONFeatureGenericSchema(
    GeoJSONPositionSchema,
    z.object({ name: z.string(), age: z.number() }),
    GeoJSONGeometrySchema,
);
export type FeatureWithCustomProperties = z.infer<typeof FeatureWithCustomPropertiesSchema>;

export const testPropertiesEquals: Equals<
    FeatureWithCustomProperties["properties"],
    {
        name: string;
        age: number;
    }
> = true;

export const testPropertiesDoesNotEqual: Equals<
    FeatureWithCustomProperties["properties"],
    {
        name: string;
        age: string;
    }
> = false;

/**
 * Test inferred types of feature schema with custom geometry
 */
export const FeatureWithCustomGeometrySchema = GeoJSONFeatureGenericSchema(
    GeoJSON3DPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSON3DPointSchema,
);
export type FeatureWithCustomGeometry = z.infer<typeof FeatureWithCustomGeometrySchema>;

export const testGeometryEquals: Equals<
    FeatureWithCustomGeometry["geometry"],
    { type: "Point"; coordinates: [number, number, number] }
> = true;

export const testGeometryDoesNotEqual1: Equals<
    FeatureWithCustomGeometry["geometry"],
    { type: "Point"; coordinates: [number, number] }
> = false;

export const testGeometryDoesNotEqual2: Equals<
    FeatureWithCustomGeometry["geometry"],
    { type: "LineString"; coordinates: [number, number, number][] }
> = false;

/**
 * Test that types match with @types/geojson
 */
export const feature1: GeoJSONTypes.Feature = geoJsonFeaturePoint2D;
export const feature2: GeoJSONTypes.Feature<GeoJSONTypes.Point> = geoJsonFeaturePoint2D;
export const feature3: GeoJSONTypes.Feature<GeoJSONTypes.Polygon> = geoJsonFeaturePolygon3DWithBBox;

export const feature4: GeoJSONTypes.Feature<GeoJSONTypes.Point> = geoJsonFeaturePoint2D;
export const feature5: GeoJSONTypes.Feature<GeoJSONTypes.Point> = geoJsonFeaturePoint2D as GeoJSONFeatureGeneric<
    GeoJSONPosition,
    GeoJSONProperties,
    GeoJSONPoint
>;

export const feature6: GeoJSONTypes.Feature = geoJsonFeatureLineString2D as GeoJSONFeature;

export const feature7: GeoJSONTypes.Feature<GeoJSON3DGeometry> = geoJsonFeaturePoint3D;
export const feature8: GeoJSONTypes.Feature<GeoJSON2DGeometry> = geoJsonFeaturePolygon2D;

/**
 * Test that @types/geojson matches our types
 */
export const feature11: GeoJSONFeature = feature1;
export const feature12: GeoJSONFeature = feature2;
export const feature13: GeoJSONFeature = feature3;
export const feature14: GeoJSONFeature = feature4;
export const feature15: GeoJSONFeature = feature5;
export const feature16: GeoJSONFeature = feature6;

export const feature17: GeoJSON3DFeature = feature7;
export const feature18: GeoJSON2DFeature = feature8;

/**
 * Test that turf.js matches our types
 */
export const feature21: GeoJSONFeature = turfFeature(geoJsonPoint3D);
export const feature22: GeoJSONFeature = turfFeature(geoJsonPoint3D, { name: "hello" });
export const feature23: GeoJSONFeature = turfPoint([0, 0, 0]);
export const feature24: GeoJSONFeature = turfPoint([0, 0, 0], { extra: "field" });
