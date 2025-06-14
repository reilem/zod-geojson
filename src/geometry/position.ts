import { z } from "zod/v4";

// Specific 2D GeoJSON position
export const GeoJSON2DPositionSchema = z.tuple([z.number(), z.number()]);
export type GeoJSON2DPosition = z.infer<typeof GeoJSON2DPositionSchema>;

// Specific 3D GeoJSON position
export const GeoJSON3DPositionSchema = z.tuple([z.number(), z.number(), z.number()]);
export type GeoJSON3DPosition = z.infer<typeof GeoJSON3DPositionSchema>;

// General GeoJSON position
// > A position is an array of numbers. There MUST be two or more
//   elements. The first two elements are longitude and latitude, or
//   easting and northing, precisely in that order and using decimal
//   numbers. Altitude or elevation MAY be included as an optional third
//   element (RFC 7946, Section 3.1.1)
// > Implementations SHOULD NOT extend positions beyond three elements
//   because the semantics of extra elements are unspecified and
//   ambiguous. (RFC 7946, Section 3.1.1)
export const GeoJSONPositionSchema = z.union([GeoJSON2DPositionSchema, GeoJSON3DPositionSchema]);
export type GeoJSONPosition = z.infer<typeof GeoJSONPositionSchema>;
