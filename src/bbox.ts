import { z } from "zod";

export type GeoJSONBbox = [number, number, number, number, ...number[]];

export type GeoJSONBBoxSchemaInnerType = z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], z.ZodNumber>;

export type GeoJSONBboxSchemaType = z.ZodEffects<GeoJSONBBoxSchemaInnerType, GeoJSONBbox, GeoJSONBbox>;

export const GeoJSONBBoxSchema: GeoJSONBboxSchemaType = z
    .tuple([z.number(), z.number(), z.number(), z.number()])
    .rest(z.number())
    .refine((bbox) => bbox.length % 2 === 0, "Bounding box must have an even number of elements");
