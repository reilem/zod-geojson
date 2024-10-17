import { z } from "zod";
import { GeoJSONBaseSchema } from "./base";
import { GeoJSONGeometry, GeoJSONGeometryGenericSchema } from "./geometry";
import { bboxEquals, getBboxForGeometry, INVALID_BBOX_ISSUE } from "./geometry/validation/bbox";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "./position";
import { GeoJSONTypeSchema } from "./type";

export type ValidatableGeoJSONFeature = { bbox?: number[]; geometry: GeoJSONGeometry | null };

const INVALID_FEATURE_KEYS_ISSUE = {
    code: "custom" as const,
    message: 'GeoJSON feature cannot have "coordinates", "features", or "geometries" keys',
};

function validFeatureKeys(feature: Record<string, unknown>): boolean {
    return !("coordinates" in feature) && !("features" in feature) && !("geometries" in feature);
}

function validFeatureBbox({ bbox, geometry }: ValidatableGeoJSONFeature): boolean {
    if (!bbox || !geometry) {
        return true;
    }
    const expectedBbox = getBboxForGeometry(geometry);
    return bboxEquals(expectedBbox, bbox);
}

export const GeoJSONFeatureGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    GeoJSONBaseSchema.extend({
        id: z.string().or(z.number()).optional(),
        type: z.literal(GeoJSONTypeSchema.enum.Feature),
        geometry: GeoJSONGeometryGenericSchema(positionSchema).nullable(),
        properties: z.object({}).passthrough().nullable(),
    })
        .passthrough()
        .superRefine((val, ctx) => {
            if (!validFeatureKeys(val)) {
                ctx.addIssue(INVALID_FEATURE_KEYS_ISSUE);
            }

            // Type-cast is safe, but necessary because the type of val is not inferred correctly due to the generics
            if (!validFeatureBbox(val as ValidatableGeoJSONFeature)) {
                ctx.addIssue(INVALID_BBOX_ISSUE);
            }
        });

export const GeoJSONFeatureSchema = GeoJSONFeatureGenericSchema(GeoJSONPositionSchema);
export type GeoJSONFeature = z.infer<typeof GeoJSONFeatureSchema>;

export const GeoJSON2DFeatureSchema = GeoJSONFeatureGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DFeature = z.infer<typeof GeoJSON2DFeatureSchema>;

export const GeoJSON3DFeatureSchema = GeoJSONFeatureGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DFeature = z.infer<typeof GeoJSON3DFeatureSchema>;
