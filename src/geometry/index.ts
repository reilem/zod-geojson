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

// TODO: Refine that all positions have the same dimension
// TODO: Refine that bbox length matches the dimension of the position
// TODO: Refine that the bbox is valid for the given positions & geometry

// TODO: Refine "GeoJSON Types Are Not Extensible" section 7 of the spec

export const GeoJSONGeometrySchema = _GeoJSONSimpleGeometrySchema.or(GeoJSONGeometryCollectionSchema);

export type GeoJSONGeometry = z.infer<typeof GeoJSONGeometrySchema>;
