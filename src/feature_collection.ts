import { z } from "zod";
import { GeoJSONBaseSchema } from "./base";
import { GeoJSONFeatureGenericSchema } from "./feature";
import {
    GeoJSON2DPositionSchema,
    GeoJSON3DPositionSchema,
    GeoJSONPosition,
    GeoJSONPositionSchema,
} from "./geometry/position";
import { INVALID_BBOX_ISSUE } from "./geometry/validation/bbox";
import { GeoJSONTypeSchema } from "./type";
import { validBboxForFeatureCollection } from "./validation/bbox";
import {
    INVALID_FEATURE_COLLECTION_DIMENSIONS_ISSUE,
    validDimensionsForFeatureCollection,
} from "./validation/dimension";
import { ValidatableFeatureCollection } from "./validation/types";

export const GeoJSONFeatureCollectionGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    GeoJSONBaseSchema(positionSchema)
        .extend({
            type: z.literal(GeoJSONTypeSchema.enum.FeatureCollection),
            features: z.array(GeoJSONFeatureGenericSchema(positionSchema)),
            coordinates: z.never({ error: "GeoJSON feature collection cannot have a 'coordinates' key" }).optional(),
            geometry: z.never({ error: "GeoJSON feature collection cannot have a 'geometry' key" }).optional(),
            properties: z.never({ error: "GeoJSON feature collection cannot have a 'properties' key" }).optional(),
            geometries: z.never({ error: "GeoJSON feature collection cannot have a 'geometries' key" }).optional(),
        })
        .passthrough()
        .superRefine((val, ctx) => {
            if (!val.features.length) {
                return;
            }
            if (!validDimensionsForFeatureCollection(val as ValidatableFeatureCollection)) {
                ctx.addIssue(INVALID_FEATURE_COLLECTION_DIMENSIONS_ISSUE);
                return;
            }
            if (!validBboxForFeatureCollection(val as ValidatableFeatureCollection)) {
                ctx.addIssue(INVALID_BBOX_ISSUE);
                return;
            }
        });

export const GeoJSONFeatureCollectionSchema = GeoJSONFeatureCollectionGenericSchema(GeoJSONPositionSchema);
export type GeoJSONFeatureCollection = z.infer<typeof GeoJSONFeatureCollectionSchema>;

export const GeoJSON2DFeatureCollectionSchema = GeoJSONFeatureCollectionGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DFeatureCollection = z.infer<typeof GeoJSON2DFeatureCollectionSchema>;

export const GeoJSON3DFeatureCollectionSchema = GeoJSONFeatureCollectionGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DFeatureCollection = z.infer<typeof GeoJSON3DFeatureCollectionSchema>;
