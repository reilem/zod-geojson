import * as z from "zod/v4";
import { core as zCore } from "zod/v4";
import {
    GeoJSONGeometryCollectionGenericSchema,
    GeoJSONGeometryCollectionGenericSchemaType,
} from "./geometry_collection";
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
> = z.ZodType<G, unknown, zCore.$ZodTypeInternals<G> & zCore.$ZodTypeDiscriminableInternals>;

export const GeoJSONGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSONPositionSchema);
export type GeoJSONGeometry = z.infer<typeof GeoJSONGeometrySchema>;

export const GeoJSON2DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DGeometry = z.infer<typeof GeoJSON2DGeometrySchema>;

export const GeoJSON3DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DGeometry = z.infer<typeof GeoJSON3DGeometrySchema>;
