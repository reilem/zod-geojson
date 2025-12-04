import { expect } from "@jest/globals";
import { ZodError, ZodSchema } from "zod/v4";
import { GeoJSONSchema } from "../src";

export type Equals<Expected, Actual> = Expected extends Actual ? (Actual extends Expected ? true : false) : false;

export function passGeoJSONSchemaTest(schemas: ZodSchema[], value: unknown): void {
    schemas.forEach((schema) => expect(schema.parse(value)).toEqual(value));
    expect(GeoJSONSchema.parse(value)).toEqual(value);
}

export function failGeoJSONSchemaTest(schemas: ZodSchema[], value: unknown): void {
    schemas.forEach((schema) => expect(() => schema.parse(value)).toThrow(ZodError));
    expect(() => GeoJSONSchema.parse(value)).toThrow(ZodError);
}
