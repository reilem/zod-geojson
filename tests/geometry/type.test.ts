import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import { point as turfPoint, lineString as turfLineString, polygon as turfPolygon } from "@turf/helpers";
import { ZodError } from "zod/v4";
import { GeoJSONGeometryType, GeoJSONGeometryTypeSchema, GeoJSONTypeSchema } from "../../src";

describe("GeoJSONGeometryType", () => {
    const geoJsonGeometryTypes: GeoJSONGeometryType[] = [
        "Point",
        "MultiPoint",
        "LineString",
        "MultiLineString",
        "Polygon",
        "MultiPolygon",
        "GeometryCollection",
    ];

    geoJsonGeometryTypes.forEach((type) =>
        it(`allows ${type} geojson geometry type`, () => {
            expect(GeoJSONGeometryTypeSchema.parse(type)).toEqual(type);
            expect(GeoJSONTypeSchema.parse(type)).toEqual(type);
        }),
    );

    it("does not allow an invalid geojson geometry type", () => {
        expect(() => GeoJSONGeometryTypeSchema.parse("InvalidType")).toThrow(ZodError);
    });

    describe("turf.js", () => {
        it("validates point type from turf.js", () => {
            const type = turfPoint([0, 0]).geometry.type;
            expect(GeoJSONGeometryTypeSchema.parse(type)).toEqual(type);
        });

        it("validates line string type from turf.js", () => {
            const type = turfLineString([
                [0, 0],
                [1, 1],
            ]).geometry.type;
            expect(GeoJSONGeometryTypeSchema.parse(type)).toEqual(type);
        });

        it("validates polygon type from turf.js", () => {
            const type = turfPolygon([
                [
                    [0, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1],
                    [0, 0],
                ],
            ]).geometry.type;
            expect(GeoJSONGeometryTypeSchema.parse(type)).toEqual(type);
        });
    });
});

/**
 * Invalid GeoJSON geometry type to test types
 */
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonGeometryType: GeoJSONGeometryType = "Foo";

/**
 * Test that types match with @types/geojson
 */
export const type1: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.Point;
export const type2: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.Point as GeoJSONGeometryType;
export const type3: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.GeometryCollection;
export const type4: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.MultiLineString;
export const type5: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.MultiPoint;
export const type6: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.MultiPolygon;
export const type7: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.LineString;
export const type8: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.Polygon;

/**
 * Test that @types/geojson match with our types
 */
export const type9: GeoJSONGeometryType = type1;

/**
 * Test that turf.js matches our types
 */
export const type10: GeoJSONGeometryType = turfPoint([0, 0]).geometry.type;
export const type11: GeoJSONGeometryType = turfLineString([
    [0, 0],
    [1, 1],
]).geometry.type;
export const type12: GeoJSONGeometryType = turfPolygon([
    [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
    ],
]).geometry.type;
