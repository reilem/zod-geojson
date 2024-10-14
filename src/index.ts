// Derived from the GeoJSON spec: https://datatracker.ietf.org/doc/html/rfc7946
import { z } from "zod";
import { GeoJSONFeatureGenericSchema } from "./feature";
import { GeoJSONFeatureCollectionGenericSchema } from "./feature_collection";
import { GeoJSONGeometryGenericSchema } from "./geometry";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "./position";

export * from "./feature";
export * from "./feature_collection";
export * from "./geometry";
export * from "./bbox";
export * from "./position";
export * from "./type";

export const GeoJSONGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    z.union([
        GeoJSONGeometryGenericSchema(positionSchema),
        GeoJSONFeatureGenericSchema(positionSchema),
        GeoJSONFeatureCollectionGenericSchema(positionSchema),
    ]);

export const GeoJSONSchema = GeoJSONGenericSchema(GeoJSONPositionSchema);
export type GeoJSON = z.infer<typeof GeoJSONSchema>;

export const GeoJSON2DSchema = GeoJSONGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2D = z.infer<typeof GeoJSON2DSchema>;

export const GeoJSON3DSchema = GeoJSONGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3D = z.infer<typeof GeoJSON3DSchema>;

// TODO: Experiment with no passthrough & super refine, any way to make this RFC compliant without them at each level?
// TODO: Make type aliases for each level, all simple geometries, the simple geometries type, the geometry collection,
//       the geometry type, the feature type, feature collection type & geojson type (like bbox has now)
