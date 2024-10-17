import { z } from "zod";
import { GeoJSONBaseSchema } from "./base";
import { GeoJSONGeometry, GeoJSONGeometryGenericSchema } from "./geometry";
import { INVALID_BBOX_ISSUE } from "./geometry/validation/bbox";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "./position";
import { GeoJSONTypeSchema } from "./type";
import { validFeatureBbox } from "./validation/bbox";

export type ValidatableGeoJSONFeature = { bbox?: number[]; geometry: GeoJSONGeometry | null };

export const GeoJSONFeatureGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    GeoJSONBaseSchema.extend({
        id: z.string().or(z.number()).optional(),
        type: z.literal(GeoJSONTypeSchema.enum.Feature),
        geometry: GeoJSONGeometryGenericSchema(positionSchema).nullable(),
        properties: z.object({}).passthrough().nullable(),
        coordinates: z.never({ message: "GeoJSON Feature cannot have a 'coordinates' key" }).optional(),
        features: z.never({ message: "GeoJSON Feature cannot have a 'features' key" }).optional(),
        geometries: z.never({ message: "GeoJSON Feature cannot have a 'geometries' key" }).optional(),
    })
        .passthrough()
        .superRefine((val, ctx) => {
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
