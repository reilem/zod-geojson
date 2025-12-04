import { z } from "zod/v4";
import { GeoJSONBaseSchema } from "./base";
import {
    DiscriminableGeometrySchema,
    GeoJSON2DGeometrySchema,
    GeoJSON3DGeometrySchema,
    GeoJSONGeometryGeneric,
    GeoJSONGeometrySchema,
} from "./geometry/geometry";
import {
    GeoJSON2DPositionSchema,
    GeoJSON3DPositionSchema,
    GeoJSONPosition,
    GeoJSONPositionSchema,
} from "./geometry/position";
import { getInvalidBBoxIssue } from "./geometry/validation/bbox";
import { GeoJSONProperties, GeoJSONPropertiesSchema } from "./properties";
import { GeoJSONTypeSchema } from "./type";
import { validBboxForFeature } from "./validation/bbox";

export const GeoJSONFeatureGenericSchema = <
    P extends GeoJSONPosition,
    R extends GeoJSONProperties,
    G extends GeoJSONGeometryGeneric<P>,
>(
    positionSchema: z.ZodType<P>,
    propertiesSchema: z.ZodType<R>,
    geometrySchema: DiscriminableGeometrySchema<P, G>,
) =>
    z
        .looseObject({
            ...GeoJSONBaseSchema(positionSchema).shape,
            id: z.string().or(z.number()).optional(),
            type: z.literal(GeoJSONTypeSchema.enum.Feature),
            geometry: geometrySchema.nullable(),
            properties: propertiesSchema.nullable(),
            coordinates: z.never({ error: "GeoJSON Feature cannot have a 'coordinates' key" }).optional(),
            features: z.never({ error: "GeoJSON Feature cannot have a 'features' key" }).optional(),
            geometries: z.never({ error: "GeoJSON Feature cannot have a 'geometries' key" }).optional(),
        })
        .check((ctx) => {
            if (!validBboxForFeature(ctx.value)) {
                ctx.issues.push(getInvalidBBoxIssue(ctx));
            }
        });
export type GeoJSONFeatureGeneric<
    P extends GeoJSONPosition,
    R extends GeoJSONProperties,
    G extends GeoJSONGeometryGeneric<P>,
> = z.infer<ReturnType<typeof GeoJSONFeatureGenericSchema<P, R, G>>>;

export const GeoJSONFeatureSchema = GeoJSONFeatureGenericSchema(
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSONGeometrySchema,
);
export type GeoJSONFeature = z.infer<typeof GeoJSONFeatureSchema>;

export const GeoJSON2DFeatureSchema = GeoJSONFeatureGenericSchema(
    GeoJSON2DPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSON2DGeometrySchema,
);
export type GeoJSON2DFeature = z.infer<typeof GeoJSON2DFeatureSchema>;

export const GeoJSON3DFeatureSchema = GeoJSONFeatureGenericSchema(
    GeoJSON3DPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSON3DGeometrySchema,
);
export type GeoJSON3DFeature = z.infer<typeof GeoJSON3DFeatureSchema>;
