import * as z from "zod/v4";

export const GeoJSONGeometryTypeSchema = z.enum([
    "Point",
    "MultiPoint",
    "LineString",
    "MultiLineString",
    "Polygon",
    "MultiPolygon",
    "GeometryCollection",
]);

// The enum of the type values
export const GeoJSONGeometryType = GeoJSONGeometryTypeSchema.enum;

// The string literal type of the values in the enum
export type GeoJSONGeometryType = z.infer<typeof GeoJSONGeometryTypeSchema>;
