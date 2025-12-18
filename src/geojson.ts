import * as z from "zod/v4";
import { GeoJSONFeatureGenericSchema, GeoJSONFeatureGenericSchemaType } from "./feature";
import { GeoJSONFeatureCollectionGenericSchema, GeoJSONFeatureCollectionGenericSchemaType } from "./feature_collection";
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
    GeoJSONAnyPosition,
    GeoJSONPositionSchema,
} from "./geometry/position";
import { GeoJSONProperties, GeoJSONPropertiesSchema } from "./properties";

export type GeoJSONGenericSchemaType<
    P extends GeoJSONAnyPosition,
    R extends GeoJSONProperties,
    G extends GeoJSONGeometryGeneric<P> | null,
> = z.ZodDiscriminatedUnion<
    [z.ZodType<G>, GeoJSONFeatureGenericSchemaType<P, R, G>, GeoJSONFeatureCollectionGenericSchemaType<P, R, G>],
    "type"
>;

export const GeoJSONGenericSchema = <
    P extends GeoJSONAnyPosition,
    R extends GeoJSONProperties,
    G extends GeoJSONGeometryGeneric<P> | null,
>(
    positionSchema: z.ZodType<P>,
    propertiesSchema: z.ZodType<R>,
    geometrySchema: z.ZodType<G>,
): GeoJSONGenericSchemaType<P, R, G> =>
    z.discriminatedUnion("type", [
        // Ensure geometrySchema is discriminable. If it's nullable, unwrap it first.
        // The type cast is necessary to tell discriminatedUnion that this type is discriminable.
        // We know this will always be the case because the types restrict G to a geometry which will
        // always have a "type" field.
        (geometrySchema instanceof z.ZodNullable
            ? geometrySchema.unwrap()
            : geometrySchema) as DiscriminableGeometrySchema<P, G>,
        GeoJSONFeatureGenericSchema(positionSchema, propertiesSchema, geometrySchema),
        GeoJSONFeatureCollectionGenericSchema(positionSchema, propertiesSchema, geometrySchema),
    ]);
export type GeoJSONGeneric<
    P extends GeoJSONAnyPosition,
    R extends GeoJSONProperties,
    G extends GeoJSONGeometryGeneric<P>,
> = z.infer<ReturnType<typeof GeoJSONGenericSchema<P, R, G>>>;

export const GeoJSONSchema = GeoJSONGenericSchema(
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSONGeometrySchema,
);
export type GeoJSON = z.infer<typeof GeoJSONSchema>;

export const GeoJSON2DSchema = GeoJSONGenericSchema(
    GeoJSON2DPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSON2DGeometrySchema,
);
export type GeoJSON2D = z.infer<typeof GeoJSON2DSchema>;

export const GeoJSON3DSchema = GeoJSONGenericSchema(
    GeoJSON3DPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSON3DGeometrySchema,
);
export type GeoJSON3D = z.infer<typeof GeoJSON3DSchema>;
