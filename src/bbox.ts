import { z } from "zod";
import { MIN_POSITION } from "./position";

export const GeoJSONBBoxSchema = z
    .array(z.number())
    .min(MIN_POSITION * 2)
    .refine((bbox) => bbox.length % 2 === 0, "Bounding box must have an even number of elements");
export type GeoJSONBbox = z.infer<typeof GeoJSONBBoxSchema>;
