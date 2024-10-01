import { z } from "zod";

// GeoJSON positions and coordinates (see 3.1.1)
// Array: [longitude/easting, latitude/northing, altitude (optional), ...extra elements are unspecified and ambiguous]
export const GeoJSONPositionSchema = z.tuple([z.number(), z.number()]).rest(z.number());
export type GeoJSONPosition = z.infer<typeof GeoJSONPositionSchema>;

// Specific GeoJSON positions for 2 dimensions
// These are used to define the 2D geometries, features, and collections
export const GeoJSON2DPositionSchema = z.tuple([z.number(), z.number()]);
export type GeoJSON2DPosition = z.infer<typeof GeoJSON2DPositionSchema>;

// Specific GeoJSON positions for 3 dimensions
// These are used to define the 3D geometries, features, and collections
export const GeoJSON3DPositionSchema = z.tuple([z.number(), z.number(), z.number()]);
export type GeoJSON3DPosition = z.infer<typeof GeoJSON3DPositionSchema>;
