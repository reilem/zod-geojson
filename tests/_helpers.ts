import { expect } from "@jest/globals";
import * as z from "zod";
import { GeoJSONSchema } from "../src";

export type Equals<Expected, Actual> = Expected extends Actual ? (Actual extends Expected ? true : false) : false;

export function passGeoJSONSchemaTest(schemas: z.ZodType[], value: unknown): void {
    schemas.forEach((schema) => expect(schema.parse(value)).toEqual(value));
    expect(GeoJSONSchema.parse(value)).toEqual(value);
}

export function failGeoJSONSchemaTest(schemas: z.ZodType[], value: unknown): void {
    schemas.forEach((schema) => expect(() => schema.parse(value)).toThrow(z.ZodError));
    expect(() => GeoJSONSchema.parse(value)).toThrow(z.ZodError);
}
