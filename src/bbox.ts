import { z } from "zod";

export const GeoJSONBBoxSchema = z
    .tuple([z.number(), z.number(), z.number(), z.number()])
    .rest(z.number())
    .refine((bbox) => bbox.length % 2 === 0, "Bounding box must have an even number of elements");
export type GeoJSONBbox = z.infer<typeof GeoJSONBBoxSchema>;
