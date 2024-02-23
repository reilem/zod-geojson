import { z } from "zod";
import { GeoJSONBaseSchema } from "./base";
import { GeoJSONGeometry, GeoJSONGeometrySchema } from "./geometry";
import { bboxEquals, getBboxForGeometry, INVALID_BBOX_ISSUE } from "./geometry/validation/bbox";

const INVALID_FEATURE_KEYS_ISSUE = {
    code: "custom" as const,
    message: 'GeoJSON feature cannot have "coordinates", "features", or "geometries" keys',
};

function validFeatureKeys(feature: Record<string, unknown>): boolean {
    return !("coordinates" in feature) && !("features" in feature) && !("geometries" in feature);
}

function validFeatureBbox({ bbox, geometry }: { bbox?: number[]; geometry: GeoJSONGeometry | null }): boolean {
    if (!bbox || !geometry) return true;
    const expectedBbox = getBboxForGeometry(geometry);
    return bboxEquals(expectedBbox, bbox);
}

export const GeoJSONFeatureSchema = GeoJSONBaseSchema.extend({
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

        if (!validFeatureBbox(val)) {
            ctx.addIssue(INVALID_BBOX_ISSUE);
        }
    });

export type GeoJSONFeature = z.infer<typeof GeoJSONFeatureSchema>;
