import { z } from "zod";
import { _GeoJSONSimpleGeometrySchema } from "./_simple";
import { GeoJSONGeometryCollectionSchema } from "./geometry_collection";

export * from "./geometry_collection";
export * from "./line_string";
export * from "./multi_line_string";
export * from "./multi_point";
export * from "./multi_polygon";
export * from "./point";
export * from "./polygon";

export const GeoJSONGeometrySchema = _GeoJSONSimpleGeometrySchema.or(GeoJSONGeometryCollectionSchema);

export type GeoJSONGeometry = z.infer<typeof GeoJSONGeometrySchema>;
