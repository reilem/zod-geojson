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
