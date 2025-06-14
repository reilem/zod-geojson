// GeoJSON types and Geometry type (see 1.4)
import { z } from "zod/v4";
import { GeoJSONGeometryTypeSchema } from "./geometry/type";

export const GeoJSONTypeSchema = z.enum(["Feature", "FeatureCollection", ...GeoJSONGeometryTypeSchema.options]);

export type GeoJSONType = z.infer<typeof GeoJSONTypeSchema>;
