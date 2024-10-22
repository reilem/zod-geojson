import { z } from "zod";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "./position";
import { GeoJSONSimpleGeometryGenericSchema, GeoJSONSimpleGeometryGenericSchemaType } from "./helper/simple";
import {
    GeoJSONGeometryCollectionGenericSchema,
    GeoJSONGeometryCollectionGenericSchemaType,
} from "./geometry_collection";

export type GeoJSONGeometryGenericSchemaType<P extends GeoJSONPosition> = z.ZodUnion<
    [GeoJSONSimpleGeometryGenericSchemaType<P>, GeoJSONGeometryCollectionGenericSchemaType<P>]
>;

export const GeoJSONGeometryGenericSchema = <P extends GeoJSONPosition>(
    positionSchema: z.ZodSchema<P>,
): GeoJSONGeometryGenericSchemaType<P> =>
    z.union([
        GeoJSONSimpleGeometryGenericSchema(positionSchema),
        GeoJSONGeometryCollectionGenericSchema(positionSchema),
    ]);
export type GeoJSONGenericGeometry<P extends GeoJSONPosition> = z.infer<
    ReturnType<typeof GeoJSONGeometryGenericSchema<P>>
>;

export const GeoJSONGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSONPositionSchema);
export type GeoJSONGeometry = z.infer<typeof GeoJSONGeometrySchema>;

export const GeoJSON2DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DGeometry = z.infer<typeof GeoJSON2DGeometrySchema>;

export const GeoJSON3DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DGeometry = z.infer<typeof GeoJSON3DGeometrySchema>;
