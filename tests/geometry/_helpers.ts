import { expect } from "@jest/globals";
import * as z from "zod";
import { GeoJSONGeometrySchema, GeoJSONSchema } from "../../src";

export function passGeoJSONGeometrySchemaTest(schemas: z.ZodType[], value: unknown): void {
    schemas.forEach((schema) => expect(schema.parse(value)).toEqual(value));
    expect(GeoJSONGeometrySchema.parse(value)).toEqual(value);
    expect(GeoJSONSchema.parse(value)).toEqual(value);
}

export function failGeoJSONGeometrySchemaTest(schemas: z.ZodType[], value: unknown): void {
    schemas.forEach((schema) => expect(() => schema.parse(value)).toThrow(z.ZodError));
    expect(() => GeoJSONGeometrySchema.parse(value)).toThrow(z.ZodError);
    expect(() => GeoJSONSchema.parse(value)).toThrow(z.ZodError);
}
