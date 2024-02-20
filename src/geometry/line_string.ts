import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import { GeoJSONBaseSchema, validGeometryKeys } from "./_helper";

export const GeoJSONLineStringSchema = GeoJSONBaseSchema.extend({
    type: z.literal("LineString"),
    coordinates: z.array(GeoJSONPositionSchema).min(2),
})
    .passthrough()
    .refine(validGeometryKeys);

export type GeoJSONLineString = z.infer<typeof GeoJSONLineStringSchema>;
