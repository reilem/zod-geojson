import { z } from "zod";
import { GeoJSONGeometrySchema } from "./geometry";

export const GeoJSONFeatureSchema = z.object({
    id: z.string().or(z.number()).optional(),
    type: z.literal("Feature"),
    geometry: GeoJSONGeometrySchema.nullable(),
    properties: z.object({}).passthrough().nullable(),
});

export type GeoJSONFeature = z.infer<typeof GeoJSONFeatureSchema>;
