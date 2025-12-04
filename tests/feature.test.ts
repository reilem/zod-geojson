import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import z, { ZodError } from "zod/v4";
import {
    geoJsonFeatureGeometryCollection2D,
    geoJsonFeatureGeometryCollection3D,
    geoJsonFeaturePoint2D,
    geoJsonFeaturePoint3D,
    geoJsonFeaturePolygon2D,
    geoJsonFeaturePolygon3DWithBbox,
} from "../examples/feature";
import { geoJsonLineString2D } from "../examples/geometry/line_string";
import {
    GeoJSON2DFeature,
    GeoJSON2DFeatureSchema,
    GeoJSON2DPointSchema,
    GeoJSON2DPolygonSchema,
    GeoJSON2DPositionSchema,
    GeoJSON3DFeature,
    GeoJSON3DFeatureSchema,
    GeoJSON3DPointSchema,
    GeoJSON3DPolygonSchema,
    GeoJSON3DPositionSchema,
    GeoJSONFeature,
    GeoJSONFeatureGenericSchema,
    GeoJSONFeatureSchema,
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

function passGeoJSONFeatureSchemaTest(object: unknown) {
    passGeoJSONSchemaTest([GeoJSONFeatureSchema, GeoJSON2DFeatureSchema, GeoJSON3DFeatureSchema], object);
}

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
        passGeoJSON3DFeatureSchemaTest(geoJsonFeaturePolygon3DWithBbox);
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
    it("allows a feature with null geometry", () => {
        passGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometry: null,
        });
    });
    it("allows a feature with null properties", () => {
        passGeoJSON2DFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            properties: null,
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
            expect(() => GeoJSON2DFeatureSchema.parse(geoJsonFeaturePoint3D)).toThrow(ZodError);
        });
        it("does not allow a 4D feature", () => {
            expect(() => GeoJSON2DFeatureSchema.parse(geoJsonFeaturePoint4D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D feature", () => {
            expect(GeoJSON3DFeatureSchema.parse(geoJsonFeaturePoint3D)).toEqual(geoJsonFeaturePoint3D);
        });
        it("does not allow a 2D feature", () => {
            expect(() => GeoJSON3DFeatureSchema.parse(geoJsonFeaturePolygon2D)).toThrow(ZodError);
        });
        it("does not allow a 4D feature", () => {
            expect(() => GeoJSON3DFeatureSchema.parse(geoJsonFeaturePoint4D)).toThrow(ZodError);
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
            expect(() => GeoJSONFeatureWithCustomProperties.parse(feature)).toThrow(ZodError);
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

        it("allows any point feature to be parsed by a point feature schema", () => {
            expect(GeoJSONPointFeatureSchema.parse(geoJsonFeaturePoint2D)).toEqual(geoJsonFeaturePoint2D);
            expect(GeoJSONPointFeatureSchema.parse(geoJsonFeaturePoint3D)).toEqual(geoJsonFeaturePoint3D);
        });

        it("allows a 3D polygon feature to be parsed by a 3D polygon feature schema ", () => {
            expect(GeoJSON3DPolygonFeatureSchema.parse(geoJsonFeaturePolygon3DWithBbox)).toEqual(
                geoJsonFeaturePolygon3DWithBbox,
            );
        });

        it("allows either a 2D point or 2D polygon feature to be parsed by a 2D point or polygon feature schema", () => {
            expect(GeoJSON2DPointOrPolygonFeatureSchema.parse(geoJsonFeaturePoint2D)).toEqual(geoJsonFeaturePoint2D);
            expect(GeoJSON2DPointOrPolygonFeatureSchema.parse(geoJsonFeaturePolygon2D)).toEqual(
                geoJsonFeaturePolygon2D,
            );
        });

        it("does not allow a polygon feature to be parsed by a point feature schema", () => {
            expect(() => GeoJSONPointFeatureSchema.parse(geoJsonFeaturePolygon2D)).toThrow(ZodError);
        });

        it("does not allow a 2D polygon feature to be parsed by a 3D polygon feature schema", () => {
            expect(() => GeoJSON3DPolygonFeatureSchema.parse(geoJsonFeaturePolygon2D)).toThrow(ZodError);
        });

        it("does not allow a 2D line string feature to be parsed by a 2D point or polygon feature schema", () => {
            expect(() =>
                GeoJSON2DPointOrPolygonFeatureSchema.parse({
                    type: "Feature",
                    properties: {},
                    geometry: geoJsonLineString2D,
                }),
            ).toThrow(ZodError);
        });

        it("does not allow a 3D point feature to be parsed by a 2D point or polygon feature schema", () => {
            expect(() => GeoJSON2DPointOrPolygonFeatureSchema.parse(geoJsonFeaturePoint3D)).toThrow(ZodError);
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
export const invalidGeoJsonFeaturePositionsTooBig: GeoJSONFeature = geoJsonFeaturePoint4D;

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
export const feature1: GeoJSONTypes.Feature<GeoJSONTypes.Geometry | null> = geoJsonFeaturePoint2D as GeoJSONFeature;
export const feature2: GeoJSONTypes.Feature<GeoJSONTypes.Point | null> = geoJsonFeaturePoint2D;
export const feature3: GeoJSONTypes.Feature<GeoJSONTypes.Polygon | null> = geoJsonFeaturePolygon3DWithBbox;

export const feature4: GeoJSONTypes.Feature<GeoJSONTypes.Point | null> = geoJsonFeaturePoint2D;
export const feature5: GeoJSONTypes.Feature<GeoJSONTypes.Point | null> = geoJsonFeaturePoint2D as GeoJSONFeatureGeneric<
    GeoJSONPosition,
    GeoJSONProperties,
    GeoJSONPoint
>;
