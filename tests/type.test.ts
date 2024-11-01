import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import { ZodError } from "zod";
import { GeoJSONType, GeoJSONTypeSchema } from "../src";

describe("GeoJSONType", () => {
    const geoJsonTypes: GeoJSONType[] = ["Feature", "FeatureCollection"];
    geoJsonTypes.forEach((type) =>
        it(`allows ${type} geojson type`, () => expect(GeoJSONTypeSchema.parse(type)).toEqual(type)),
    );

    it("does not allow an invalid geojson type", () => {
        expect(() => GeoJSONTypeSchema.parse("InvalidType")).toThrow(ZodError);
    });
});

/**
 * Invalid GeoJSON type to test types
 */
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonType: GeoJSONType = "Foo";

/**
 * Test that types match with @types/geojson
 */
export const type1: GeoJSONTypes.GeoJsonTypes = GeoJSONTypeSchema.enum.Feature;
export const type2: GeoJSONTypes.GeoJsonTypes = GeoJSONTypeSchema.enum.FeatureCollection;
export const type3: GeoJSONTypes.GeoJsonTypes = GeoJSONTypeSchema.enum.Polygon;
