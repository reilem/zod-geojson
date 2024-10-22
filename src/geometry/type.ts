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

// The type of the enum object
export type GeoJSONGeometryEnumType = typeof GeoJSONGeometryTypeSchema.enum;
// The string literal type of the values in the enum
export type GeoJSONGeometryType = z.infer<typeof GeoJSONGeometryTypeSchema>;
