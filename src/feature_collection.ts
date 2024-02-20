import { z } from "zod";
import { GeoJSONFeatureSchema } from "./feature";

export const GeoJSONFeatureCollectionSchema = z.object({
    type: z.literal("FeatureCollection"),
    features: z.array(GeoJSONFeatureSchema),
});

export type GeoJSONFeatureCollection = z.infer<typeof GeoJSONFeatureCollectionSchema>;
