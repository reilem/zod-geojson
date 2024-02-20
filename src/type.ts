// GeoJSON types and Geometry type (see 1.4)
import { z } from "zod";

export const GeoJSONGeometryTypeSchema = z.enum([
    "Point",
    "MultiPoint",
    "LineString",
    "MultiLineString",
    "Polygon",
    "MultiPolygon",
    "GeometryCollection",
]);

export type GeoJSONGeometryType = z.infer<typeof GeoJSONGeometryTypeSchema>;

export const GeoJSONTypeSchema = z.enum(["Feature", "FeatureCollection"]).or(GeoJSONGeometryTypeSchema);

export type GeoJSONType = z.infer<typeof GeoJSONTypeSchema>;
