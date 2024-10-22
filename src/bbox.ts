import { z } from "zod";

export type GeoJSONBbox = [number, number, number, number, ...number[]];

export type GeoJSONBboxSchemaInnerType = z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], z.ZodNumber>;

export type GeoJSONBboxSchemaType = z.ZodEffects<GeoJSONBboxSchemaInnerType, GeoJSONBbox, GeoJSONBbox>;

export const GeoJSONBboxSchema: GeoJSONBboxSchemaType = z
    .tuple([z.number(), z.number(), z.number(), z.number()])
    .rest(z.number())
    .refine((bbox) => bbox.length % 2 === 0, "Bounding box must have an even number of elements");
