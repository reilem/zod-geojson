import { expect } from "@jest/globals";
import { ZodError, ZodSchema } from "zod";
import { GeoJSONSchema } from "../src";

export function passGeoJSONSchemaTest(schemas: ZodSchema[], value: unknown): void {
    schemas.forEach((schema) => expect(schema.parse(value)).toEqual(value));
    expect(GeoJSONSchema.parse(value)).toEqual(value);
}

export function failGeoJSONSchemaTest(schemas: ZodSchema[], value: unknown): void {
    schemas.forEach((schema) => expect(() => schema.parse(value)).toThrow(ZodError));
    expect(() => GeoJSONSchema.parse(value)).toThrow(ZodError);
}
