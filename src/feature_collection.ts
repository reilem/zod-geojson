import { z } from "zod/v4";
import { GeoJSONBaseSchema } from "./base";
import { GeoJSONFeatureGenericSchema } from "./feature";
import {
    GeoJSON2DPositionSchema,
    GeoJSON3DPositionSchema,
    GeoJSONPosition,
    GeoJSONPositionSchema,
} from "./geometry/position";
import { getInvalidBBoxIssue } from "./geometry/validation/bbox";
import { GeoJSONProperties, GeoJSONPropertiesSchema } from "./properties";
import { GeoJSONTypeSchema } from "./type";
import { validBboxForFeatureCollection } from "./validation/bbox";
import {
    getInvalidFeatureCollectionDimensionsIssue,
    validDimensionsForFeatureCollection,
} from "./validation/dimension";

export const GeoJSONFeatureCollectionGenericSchema = <P extends GeoJSONPosition, R extends GeoJSONProperties>(
    positionSchema: z.ZodType<P>,
    propertiesSchema: z.ZodType<R>,
) =>
    z
        .looseObject({
            ...GeoJSONBaseSchema(positionSchema).shape,
            type: z.literal(GeoJSONTypeSchema.enum.FeatureCollection),
            features: z.array(GeoJSONFeatureGenericSchema(positionSchema, propertiesSchema)),
            coordinates: z.never({ error: "GeoJSON feature collection cannot have a 'coordinates' key" }).optional(),
            geometry: z.never({ error: "GeoJSON feature collection cannot have a 'geometry' key" }).optional(),
            properties: z.never({ error: "GeoJSON feature collection cannot have a 'properties' key" }).optional(),
            geometries: z.never({ error: "GeoJSON feature collection cannot have a 'geometries' key" }).optional(),
        })
        .check((ctx) => {
            if (!ctx.value.features.length) {
                return;
            }
            if (!validDimensionsForFeatureCollection(ctx.value)) {
                ctx.issues.push(getInvalidFeatureCollectionDimensionsIssue(ctx));
                return;
            }
            if (!validBboxForFeatureCollection(ctx.value)) {
                ctx.issues.push(getInvalidBBoxIssue(ctx));
                return;
            }
        });

export const GeoJSONFeatureCollectionSchema = GeoJSONFeatureCollectionGenericSchema(
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema,
);
export type GeoJSONFeatureCollection = z.infer<typeof GeoJSONFeatureCollectionSchema>;

export const GeoJSON2DFeatureCollectionSchema = GeoJSONFeatureCollectionGenericSchema(
    GeoJSON2DPositionSchema,
    GeoJSONPropertiesSchema,
);
export type GeoJSON2DFeatureCollection = z.infer<typeof GeoJSON2DFeatureCollectionSchema>;

export const GeoJSON3DFeatureCollectionSchema = GeoJSONFeatureCollectionGenericSchema(
    GeoJSON3DPositionSchema,
    GeoJSONPropertiesSchema,
);
export type GeoJSON3DFeatureCollection = z.infer<typeof GeoJSON3DFeatureCollectionSchema>;
