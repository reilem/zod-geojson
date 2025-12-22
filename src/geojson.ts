import * as z from "zod";
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
    R extends GeoJSONProperties | null,
    G extends GeoJSONGeometryGeneric<P> | null,
> = z.ZodDiscriminatedUnion<
    [
        DiscriminableGeometrySchema<P, G>,
        GeoJSONFeatureGenericSchemaType<P, R, G>,
        GeoJSONFeatureCollectionGenericSchemaType<P, R, G>,
    ],
    "type"
>;

export const GeoJSONGenericSchema = <
    P extends GeoJSONAnyPosition,
    R extends GeoJSONProperties | null,
    G extends GeoJSONGeometryGeneric<P> | null,
>(
    positionSchema: z.ZodType<P>,
    propertiesSchema: z.ZodType<R>,
    geometrySchema: z.ZodType<G>,
): GeoJSONGenericSchemaType<P, R, G> =>
    z.discriminatedUnion("type", [
        getDiscriminableGeometrySchema(geometrySchema),
        GeoJSONFeatureGenericSchema(positionSchema, propertiesSchema, geometrySchema),
        GeoJSONFeatureCollectionGenericSchema(positionSchema, propertiesSchema, geometrySchema),
    ]);
export type GeoJSONGeneric<
    P extends GeoJSONAnyPosition,
    R extends GeoJSONProperties | null,
    G extends GeoJSONGeometryGeneric<P> | null,
> = z.infer<ReturnType<typeof GeoJSONGenericSchema<P, R, G>>>;

export const GeoJSONSchema = GeoJSONGenericSchema(
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema.nullable(),
    GeoJSONGeometrySchema,
);
export type GeoJSON = z.infer<typeof GeoJSONSchema>;

export const GeoJSON2DSchema = GeoJSONGenericSchema(
    GeoJSON2DPositionSchema,
    GeoJSONPropertiesSchema.nullable(),
    GeoJSON2DGeometrySchema,
);
export type GeoJSON2D = z.infer<typeof GeoJSON2DSchema>;

export const GeoJSON3DSchema = GeoJSONGenericSchema(
    GeoJSON3DPositionSchema,
    GeoJSONPropertiesSchema.nullable(),
    GeoJSON3DGeometrySchema,
);
export type GeoJSON3D = z.infer<typeof GeoJSON3DSchema>;

/**
 * Ensure geometrySchema is discriminable. If it's nullable, unwrap it first.
 * We know if the schema is a Zod object or discriminated union, it's discriminable because of the typing
 * constraints on G. We forbid all other schemas for simplicity.
 */
function getDiscriminableGeometrySchema<P extends GeoJSONAnyPosition, G extends GeoJSONGeometryGeneric<P> | null>(
    geometrySchema: z.ZodType<G>,
): DiscriminableGeometrySchema<P, G> {
    const schema = geometrySchema instanceof z.ZodNullable ? geometrySchema.unwrap() : geometrySchema;
    if (schema instanceof z.ZodObject || schema instanceof z.ZodDiscriminatedUnion) {
        return schema as DiscriminableGeometrySchema<P, G>;
    }
    throw new Error(
        "GeoJSONGenericSchema received invalid geometry schema. Schema must be either a ZodObject or " +
            `ZodDiscriminatedUnion, or a ZodNullable wrapping one of those. Received: ${schema._zod.def.type}.`,
    );
}
