import * as z from "zod/v4";
import { GeoJSONBaseSchema, GeoJSONBaseSchemaShape } from "./base";
import { GeoJSONFeatureGenericSchema, GeoJSONFeatureGenericSchemaType } from "./feature";
import {
    GeoJSON2DPositionSchema,
    GeoJSON3DPositionSchema,
    GeoJSONAnyPosition,
    GeoJSONPositionSchema,
} from "./geometry/position";
import { getInvalidBBoxIssue } from "./geometry/validation/bbox";
import { GeoJSONProperties, GeoJSONPropertiesSchema } from "./properties";
import { GeoJSONType, GeoJSONTypeSchema } from "./type";
import { validBBoxForFeatureCollection } from "./validation/bbox";
import {
    getInvalidFeatureCollectionDimensionsIssue,
    validDimensionsForFeatureCollection,
} from "./validation/dimension";
import {
    GeoJSON2DGeometrySchema,
    GeoJSON3DGeometrySchema,
    GeoJSONGeometryGeneric,
    GeoJSONGeometrySchema,
} from "./geometry/geometry";

export type GeoJSONFeatureCollectionGenericSchemaType<
    P extends GeoJSONAnyPosition,
    R extends GeoJSONProperties | null,
    G extends GeoJSONGeometryGeneric<P> | null,
> = z.ZodObject<
    GeoJSONBaseSchemaShape<P> & {
        type: z.ZodLiteral<typeof GeoJSONType.FeatureCollection>;
        features: z.ZodArray<GeoJSONFeatureGenericSchemaType<P, R, G>>;
        coordinates: z.ZodOptional<z.ZodNever>;
        geometry: z.ZodOptional<z.ZodNever>;
        properties: z.ZodOptional<z.ZodNever>;
        geometries: z.ZodOptional<z.ZodNever>;
    }
>;

export const GeoJSONFeatureCollectionGenericSchema = <
    P extends GeoJSONAnyPosition,
    R extends GeoJSONProperties | null,
    G extends GeoJSONGeometryGeneric<P> | null,
>(
    positionSchema: z.ZodType<P>,
    propertiesSchema: z.ZodType<R>,
    geometrySchema: z.ZodType<G>,
): GeoJSONFeatureCollectionGenericSchemaType<P, R, G> =>
    z
        .looseObject({
            ...GeoJSONBaseSchema(positionSchema).shape,
            type: z.literal(GeoJSONTypeSchema.enum.FeatureCollection),
            features: z.array(GeoJSONFeatureGenericSchema(positionSchema, propertiesSchema, geometrySchema)),
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
            if (!validBBoxForFeatureCollection(ctx.value)) {
                ctx.issues.push(getInvalidBBoxIssue(ctx));
                return;
            }
        });
export type GeoJSONFeatureCollectionGeneric<
    P extends GeoJSONAnyPosition,
    R extends GeoJSONProperties | null,
    G extends GeoJSONGeometryGeneric<P> | null,
> = z.infer<ReturnType<typeof GeoJSONFeatureCollectionGenericSchema<P, R, G>>>;

export const GeoJSONFeatureCollectionSchema = GeoJSONFeatureCollectionGenericSchema(
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema.nullable(),
    GeoJSONGeometrySchema,
);
export type GeoJSONFeatureCollection = z.infer<typeof GeoJSONFeatureCollectionSchema>;

export const GeoJSON2DFeatureCollectionSchema = GeoJSONFeatureCollectionGenericSchema(
    GeoJSON2DPositionSchema,
    GeoJSONPropertiesSchema.nullable(),
    GeoJSON2DGeometrySchema,
);
export type GeoJSON2DFeatureCollection = z.infer<typeof GeoJSON2DFeatureCollectionSchema>;

export const GeoJSON3DFeatureCollectionSchema = GeoJSONFeatureCollectionGenericSchema(
    GeoJSON3DPositionSchema,
    GeoJSONPropertiesSchema.nullable(),
    GeoJSON3DGeometrySchema,
);
export type GeoJSON3DFeatureCollection = z.infer<typeof GeoJSON3DFeatureCollectionSchema>;
