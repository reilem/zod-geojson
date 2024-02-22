import { z } from "zod";
import { GeoJSONGeometrySchema } from "./geometry";

const INVALID_FEATURE_KEYS_ISSUE = {
    code: "custom" as const,
    message: 'GeoJSON feature cannot have "coordinates", "features", or "geometries" keys',
};

function validFeatureKeys(feature: Record<string, unknown>): boolean {
    return !("coordinates" in feature) && !("features" in feature) && !("geometries" in feature);
}

export const GeoJSONFeatureSchema = z
    .object({
        id: z.string().or(z.number()).optional(),
        type: z.literal("Feature"),
        geometry: GeoJSONGeometrySchema.nullable(),
        properties: z.object({}).passthrough().nullable(),
    })
    .passthrough()
    .superRefine((val, ctx) => {
        if (!validFeatureKeys(val)) {
            ctx.addIssue(INVALID_FEATURE_KEYS_ISSUE);
        }
    });

export type GeoJSONFeature = z.infer<typeof GeoJSONFeatureSchema>;
