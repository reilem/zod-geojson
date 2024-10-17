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

export type GeoJSONGeometryEnumType = typeof GeoJSONGeometryTypeSchema.enum;
export type GeoJSONGeometryType = z.infer<typeof GeoJSONGeometryTypeSchema>;
