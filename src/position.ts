import { z } from "zod";

export const MIN_POSITION = 2 as const;

// TODO: Specify the allowed values for the positions, must use WGS 84
// GeoJSON positions and coordinates (see 3.1.1)
// Array: [longitude/easting, latitude/northing, altitude (optional), ...extra elements are unspecified and ambiguous]
export const GeoJSONPositionSchema = z.array(z.number()).min(MIN_POSITION);
export type GeoJSONPosition = z.infer<typeof GeoJSONPositionSchema>;
