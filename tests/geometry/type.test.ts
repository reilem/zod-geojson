import { describe, expect, it } from "@jest/globals";
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
