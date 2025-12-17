// GeoJSON types and Geometry type (see 1.4)
import * as z from "zod/v4";
import { GeoJSONGeometryTypeSchema } from "./geometry/type";

export const GeoJSONTypeSchema = z.enum(["Feature", "FeatureCollection", ...GeoJSONGeometryTypeSchema.options]);

// The enum of the type values
export const GeoJSONType = GeoJSONTypeSchema.enum;

// The string literal type of the values in the enum
export type GeoJSONType = z.infer<typeof GeoJSONTypeSchema>;
