import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import { ZodError } from "zod";
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
});

/**
 * Invalid GeoJSON geometry type to test types
 */
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonGeometryType: GeoJSONGeometryType = "Foo";

/**
 * Test that types match with @types/geojson
 */
export const type1: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.Point as GeoJSONGeometryType;
export const type2: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.Point;
export const type3: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.GeometryCollection;
export const type4: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.MultiLineString;
export const type5: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.MultiPoint;
export const type6: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.MultiPolygon;
export const type7: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.LineString;
export const type8: GeoJSONTypes.GeoJsonGeometryTypes = GeoJSONGeometryTypeSchema.enum.Polygon;
