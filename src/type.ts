// GeoJSON types and Geometry type (see 1.4)
import { z } from "zod";
import { GeoJSONGeometryTypeSchema } from "./geometry";

export const GeoJSONTypeSchema = z.enum(["Feature", "FeatureCollection", ...GeoJSONGeometryTypeSchema.options]);

export type GeoJSONType = z.infer<typeof GeoJSONTypeSchema>;
