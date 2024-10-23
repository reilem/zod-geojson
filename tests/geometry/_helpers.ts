import { expect } from "@jest/globals";
import { ZodError, ZodSchema } from "zod";
import { GeoJSONGeometrySchema, GeoJSONSchema } from "../../src";

export type ExpectType<T, Expected> = T extends Expected ? true : false;

export function passGeoJSONGeometrySchemaTest(specificSchema: ZodSchema, value: unknown): void {
    expect(specificSchema.parse(value)).toEqual(value);
    expect(GeoJSONGeometrySchema.parse(value)).toEqual(value);
    expect(GeoJSONSchema.parse(value)).toEqual(value);
}

export function failGeoJSONGeometrySchemaTest(specificSchema: ZodSchema, value: unknown): void {
    expect(() => specificSchema.parse(value)).toThrow(ZodError);
    expect(() => GeoJSONGeometrySchema.parse(value)).toThrow(ZodError);
    expect(() => GeoJSONSchema.parse(value)).toThrow(ZodError);
}
