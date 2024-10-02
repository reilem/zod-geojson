// Derived from the GeoJSON spec: https://datatracker.ietf.org/doc/html/rfc7946
import { z } from "zod";
import { GeoJSONFeatureSchema } from "./feature";
import { GeoJSONFeatureCollectionSchema } from "./feature_collection";
import { GeoJSONGeometrySchema } from "./geometry";

export * from "./feature";
export * from "./feature_collection";
export * from "./geometry";
export * from "./bbox";
export * from "./position";
export * from "./type";

export const GeoJSONSchema = GeoJSONGeometrySchema.or(GeoJSONFeatureSchema).or(GeoJSONFeatureCollectionSchema);

export type GeoJSON = z.infer<typeof GeoJSONSchema>;

// TODO: Improve error messages
