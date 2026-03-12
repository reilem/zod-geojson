import * as z from "zod";
import { GeoJSONBaseSchema, GeoJSONBaseSchemaShape } from "../base";
import { GeoJSONLineStringGenericSchema, GeoJSONLineStringGenericSchemaType } from "./line_string";
import { GeoJSONMultiLineStringGenericSchema, GeoJSONMultiLineStringGenericSchemaType } from "./multi_line_string";
import { GeoJSONMultiPointGenericSchema, GeoJSONMultiPointGenericSchemaType } from "./multi_point";
import { GeoJSONMultiPolygonGenericSchema, GeoJSONMultiPolygonGenericSchemaType } from "./multi_polygon";
import { GeoJSONPointGenericSchema, GeoJSONPointGenericSchemaType } from "./point";
import { GeoJSONPolygonGenericSchema, GeoJSONPolygonGenericSchemaType } from "./polygon";
import {
    GeoJSON2DPositionSchema,
    GeoJSON3DPositionSchema,
    GeoJSONAnyPosition,
    GeoJSONPositionSchema,
} from "./position";
import { GeoJSONGeometryType, GeoJSONGeometryTypeSchema } from "./type";
import { getInvalidBBoxIssue, validBBoxForCollection } from "./validation/bbox";
import { getInvalidGeometryCollectionDimensionIssue, validDimensionsForCollection } from "./validation/dimension";

export type GeoJSONGeometryCollectionGenericSchemaType<P extends GeoJSONAnyPosition> = z.ZodObject<
    GeoJSONBaseSchemaShape<P> & {
        type: z.ZodLiteral<typeof GeoJSONGeometryType.GeometryCollection>;
        coordinates: z.ZodOptional<z.ZodNever>;
        geometry: z.ZodOptional<z.ZodNever>;
        properties: z.ZodOptional<z.ZodNever>;
        features: z.ZodOptional<z.ZodNever>;
        geometries: z.ZodArray<GeoJSONGeometryGenericSchemaType<P>>;
    }
>;

export const GeoJSONGeometryCollectionGenericSchema = <P extends GeoJSONAnyPosition>(
    positionSchema: z.ZodType<P>,
): GeoJSONGeometryCollectionGenericSchemaType<P> =>
    z
        .looseObject({
            ...GeoJSONBaseSchema(positionSchema).shape,
            type: z.literal(GeoJSONGeometryTypeSchema.enum.GeometryCollection),
            coordinates: z.never({ error: "GeoJSON geometry collection cannot have a 'coordinates' key" }).optional(),
            geometry: z.never({ error: "GeoJSON geometry collection cannot have a 'geometry' key" }).optional(),
            properties: z.never({ error: "GeoJSON geometry collection cannot have a 'properties' key" }).optional(),
            features: z.never({ error: "GeoJSON geometry collection cannot have a 'features' key" }).optional(),
            // > The value of "geometries" is an array. Each element of this array is a
            //   GeoJSON Geometry object. It is possible for this array to be empty. (RFC 7946, section 3.1.8)
            // > To maximize interoperability, implementations SHOULD avoid nested
            //    GeometryCollections. (RFC 7946, section 3.1.8)
            get geometries(): z.ZodArray<GeoJSONGeometryGenericSchemaType<P>> {
                return z.array(GeoJSONGeometryGenericSchema(positionSchema));
            },
        })
        .check((ctx) => {
            // Skip remaining checks if geometries array is empty
            if (!ctx.value.geometries.length) {
                return;
            }
            if (!validDimensionsForCollection(ctx.value)) {
                ctx.issues.push(getInvalidGeometryCollectionDimensionIssue(ctx));
            }
            if (!validBBoxForCollection(ctx.value)) {
                ctx.issues.push(getInvalidBBoxIssue(ctx));
            }
        });

export type GeoJSONGeometryGenericSchemaType<P extends GeoJSONAnyPosition> = z.ZodDiscriminatedUnion<
    [
        GeoJSONPointGenericSchemaType<P>,
        GeoJSONLineStringGenericSchemaType<P>,
        GeoJSONMultiPointGenericSchemaType<P>,
        GeoJSONPolygonGenericSchemaType<P>,
        GeoJSONMultiLineStringGenericSchemaType<P>,
        GeoJSONMultiPolygonGenericSchemaType<P>,
        GeoJSONGeometryCollectionGenericSchemaType<P>,
    ],
    "type"
>;

export const GeoJSONGeometryGenericSchema = <P extends GeoJSONAnyPosition>(positionSchema: z.ZodType<P>) =>
    z.discriminatedUnion("type", [
        GeoJSONPointGenericSchema(positionSchema),
        GeoJSONLineStringGenericSchema(positionSchema),
        GeoJSONMultiPointGenericSchema(positionSchema),
        GeoJSONPolygonGenericSchema(positionSchema),
        GeoJSONMultiLineStringGenericSchema(positionSchema),
        GeoJSONMultiPolygonGenericSchema(positionSchema),
        GeoJSONGeometryCollectionGenericSchema(positionSchema),
    ]);
export type GeoJSONGeometryGeneric<P extends GeoJSONAnyPosition> = z.infer<
    ReturnType<typeof GeoJSONGeometryGenericSchema<P>>
>;

export type DiscriminableGeometrySchema<
    P extends GeoJSONAnyPosition,
    G extends GeoJSONGeometryGeneric<P> | null,
> = z.ZodType<G, unknown, z.core.$ZodTypeInternals<G> & z.core.$ZodTypeDiscriminableInternals>;

export const GeoJSONGeometryCollectionSchema = GeoJSONGeometryCollectionGenericSchema(GeoJSONPositionSchema);
export type GeoJSONGeometryCollection = z.infer<typeof GeoJSONGeometryCollectionSchema>;

export const GeoJSON2DGeometryCollectionSchema = GeoJSONGeometryCollectionGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DGeometryCollection = z.infer<typeof GeoJSON2DGeometryCollectionSchema>;

export const GeoJSON3DGeometryCollectionSchema = GeoJSONGeometryCollectionGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DGeometryCollection = z.infer<typeof GeoJSON3DGeometryCollectionSchema>;

export const GeoJSONGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSONPositionSchema);
export type GeoJSONGeometry = z.infer<typeof GeoJSONGeometrySchema>;

export const GeoJSON2DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DGeometry = z.infer<typeof GeoJSON2DGeometrySchema>;

export const GeoJSON3DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DGeometry = z.infer<typeof GeoJSON3DGeometrySchema>;
