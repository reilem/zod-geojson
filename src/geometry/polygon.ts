import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import { GeoJSONBaseSchema, validGeometryKeys } from "./_helper";

// TODO: Refine that all line strings are linear rings (first and last position are the same)
export const GeoJSONPolygonSchema = GeoJSONBaseSchema.extend({
    type: z.literal("Polygon"),
    coordinates: z.array(z.array(GeoJSONPositionSchema).min(4)),
})
    .passthrough()
    .refine(validGeometryKeys);

export type GeoJSONPolygon = z.infer<typeof GeoJSONPolygonSchema>;
