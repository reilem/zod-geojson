import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import { geoJsonPropertiesComplex, geoJsonPropertiesEmpty, geoJsonPropertiesSimple } from "../examples/properties";
import { GeoJSONProperties, GeoJSONPropertiesSchema } from "../src/properties";

describe("GeoJSONProperties", () => {
    it("allows valid properties", () => {
        const properties = {
            a: 4,
            b: "str",
            c: null,
            d: true,
            e: { nested: true },
            f: [1, 2, 3],
        };
        expect(GeoJSONPropertiesSchema.parse(properties)).toEqual(properties);
    });

    it("allows null properties", () => {
        expect(GeoJSONPropertiesSchema.parse(null)).toBeNull();
    });

    it("rejects undefined & objects with undefined", () => {
        expect(() => GeoJSONPropertiesSchema.parse(undefined)).toThrow();
        expect(() => GeoJSONPropertiesSchema.parse({ a: undefined })).toThrow();
    });

    it("rejects functions & objects with functions", () => {
        expect(() => GeoJSONPropertiesSchema.parse(() => {})).toThrow();
        expect(() => GeoJSONPropertiesSchema.parse({ a: () => {} })).toThrow();
    });

    it("rejects symbols & objects with symbols", () => {
        expect(() => GeoJSONPropertiesSchema.parse(Symbol("sym"))).toThrow();
        expect(() => GeoJSONPropertiesSchema.parse({ a: Symbol("sym") })).toThrow();
    });

    it("rejects BigInt & objects with BigInt", () => {
        expect(() => GeoJSONPropertiesSchema.parse(BigInt(10))).toThrow();
        expect(() => GeoJSONPropertiesSchema.parse({ a: BigInt(10) })).toThrow();
    });
});

/**
 * Invalid GeoJSON type to test types
 */
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidProperties1: GeoJSONProperties = "Foo";
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidProperties2: GeoJSONProperties = { aWithFunc: () => {} };

/**
 * Test that types match with @types/geojson
 */
export const type1: GeoJSONTypes.GeoJsonProperties = geoJsonPropertiesEmpty as GeoJSONProperties;
export const type2: GeoJSONTypes.GeoJsonProperties = geoJsonPropertiesEmpty;
export const type3: GeoJSONTypes.GeoJsonProperties = geoJsonPropertiesSimple;
export const type4: GeoJSONTypes.GeoJsonProperties = geoJsonPropertiesComplex;
