import { z } from "zod";
import { GeoJSONBaseSchema } from "./base";
import { GeoJSONFeatureSchema } from "./feature";

const INVALID_FEATURE_COLLECTION_KEYS_ISSUE = {
    code: "custom" as const,
    message: 'GeoJSON feature cannot have "coordinates", "geometry", "properties", or "geometries" keys',
};

function validFeatureCollection(feature: Record<string, unknown>): boolean {
    return (
        !("coordinates" in feature) &&
        !("geometry" in feature) &&
        !("properties" in feature) &&
        !("geometries" in feature)
    );
}

export const GeoJSONFeatureCollectionSchema = GeoJSONBaseSchema.extend({
    type: z.literal("FeatureCollection"),
    features: z.array(GeoJSONFeatureSchema),
})
    .passthrough()
    .superRefine((val, ctx) => {
        if (!validFeatureCollection(val)) {
            ctx.addIssue(INVALID_FEATURE_COLLECTION_KEYS_ISSUE);
            return;
        }

        if (!val.features.length) return;

        // TODO: Dimension across features & BBox validation
    });

export type GeoJSONFeatureCollection = z.infer<typeof GeoJSONFeatureCollectionSchema>;
