import { z } from "zod/v4";
import { GeoJSONGeometryCollectionGenericSchema } from "./geometry_collection";
import { GeoJSONSimpleGeometryGenericSchema } from "./helper/simple";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "./position";

export const GeoJSONGeometryGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodType<P>) =>
    z.discriminatedUnion("type", [
        GeoJSONSimpleGeometryGenericSchema(positionSchema),
        GeoJSONGeometryCollectionGenericSchema(positionSchema),
    ]);

export const GeoJSONGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSONPositionSchema);
export type GeoJSONGeometry = z.infer<typeof GeoJSONGeometrySchema>;

export const GeoJSON2DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DGeometry = z.infer<typeof GeoJSON2DGeometrySchema>;

export const GeoJSON3DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DGeometry = z.infer<typeof GeoJSON3DGeometrySchema>;
