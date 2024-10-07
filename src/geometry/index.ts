import { z } from "zod";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "../position";
import { _GeoJSONSimpleGeometryGenericSchema } from "./_simple";
import { GeoJSONGeometryCollectionSchema } from "./geometry_collection";

export * from "./geometry_collection";
export * from "./line_string";
export * from "./multi_line_string";
export * from "./multi_point";
export * from "./multi_polygon";
export * from "./point";
export * from "./polygon";

export const GeoJSONGeometryGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    _GeoJSONSimpleGeometryGenericSchema(positionSchema).or(GeoJSONGeometryCollectionSchema);
export type GeoJSONGenericGeometry<P extends GeoJSONPosition> = z.infer<
    ReturnType<typeof GeoJSONGeometryGenericSchema<P>>
>;

export const GeoJSONGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSONPositionSchema);
export type GeoJSONGeometry = z.infer<typeof GeoJSONGeometrySchema>;

export const GeoJSON2DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DGeometry = z.infer<typeof GeoJSON2DGeometrySchema>;

export const GeoJSON3DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DGeometry = z.infer<typeof GeoJSON3DGeometrySchema>;
