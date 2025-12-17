import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import { ZodError } from "zod/v4";
import { GeoJSONType, GeoJSONTypeSchema } from "../src";
import { point as turfPoint } from "@turf/helpers";

describe("GeoJSONType", () => {
    const geoJsonTypes: GeoJSONType[] = ["Feature", "FeatureCollection"];
    geoJsonTypes.forEach((type) =>
        it(`allows ${type} geojson type`, () => expect(GeoJSONTypeSchema.parse(type)).toEqual(type)),
    );

    it("does not allow an invalid geojson type", () => {
        expect(() => GeoJSONTypeSchema.parse("InvalidType")).toThrow(ZodError);
    });

    describe("turf.js", () => {
        it("validates feature type from turf.js", () => {
            const type = turfPoint([0, 0]).type;
            expect(GeoJSONTypeSchema.parse(type)).toEqual(type);
        });

        it("validates geometry type from turf.js", () => {
            const type = turfPoint([0, 0]).geometry.type;
            expect(GeoJSONTypeSchema.parse(type)).toEqual(type);
        });
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

/**
 * Test that @types/geojson matches our types
 */
export const type4: GeoJSONType = type1;

/**
 * Test that turf.js matches our types
 */
export const type5: GeoJSONType = turfPoint([0, 0]).type;
export const type6: GeoJSONType = turfPoint([0, 0]).geometry.type;
