import { expect } from "@jest/globals";
import { ZodError, ZodSchema } from "zod";
import { GeoJSONGeometrySchema, GeoJSONSchema } from "../../src";

export function passGeoJSONGeometrySchemaTest(schemas: ZodSchema[], value: unknown): void {
    schemas.forEach((schema) => expect(schema.parse(value)).toEqual(value));
    expect(GeoJSONGeometrySchema.parse(value)).toEqual(value);
    expect(GeoJSONSchema.parse(value)).toEqual(value);
}

export function failGeoJSONGeometrySchemaTest(schemas: ZodSchema[], value: unknown): void {
    schemas.forEach((schema) => expect(() => schema.parse(value)).toThrow(ZodError));
    expect(() => GeoJSONGeometrySchema.parse(value)).toThrow(ZodError);
    expect(() => GeoJSONSchema.parse(value)).toThrow(ZodError);
}
