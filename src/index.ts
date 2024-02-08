// Derived from the GeoJSON spec: https://datatracker.ietf.org/doc/html/rfc7946
import { z, ZodType } from "zod";

// GeoJSON positions and coordinates (see 3.1.1)
// Array: [longitude/easting, latitude/northing, altitude (optional), ...extra elements are unspecified and ambiguous]
export const GeoJSONPositionSchema = z.array(z.number()).min(2);

// GeoJSON types and Geometry type (see 1.4)
export const GeoJSONGeometryTypeSchema = z.enum([
    "Point",
    "MultiPoint",
    "LineString",
    "MultiLineString",
    "Polygon",
    "MultiPolygon",
    "GeometryCollection",
]);

export const GeoJSONTypeSchema = z.enum(["Feature", "FeatureCollection"]).or(GeoJSONGeometryTypeSchema);

export const GeoJSON2DBBoxSchema = z.array(z.number()).min(4).max(4);
export const GeoJSON3DBBoxSchema = z.array(z.number()).min(6).max(6);
export const GeoJSONBBoxSchema = GeoJSON2DBBoxSchema.or(GeoJSON3DBBoxSchema);

const GeoJSONBaseSchema = z.object({
    bbox: GeoJSONBBoxSchema.optional(),
});

export const GeoJSONPointSchema = GeoJSONBaseSchema.extend({
    type: z.literal("Point"),
    coordinates: GeoJSONPositionSchema,
}).passthrough();

export const GeoJSONLineStringSchema = GeoJSONBaseSchema.extend({
    type: z.literal("LineString"),
    coordinates: z.array(GeoJSONPositionSchema).min(2),
}).passthrough();

export const GeoJSONMultiPointSchema = GeoJSONBaseSchema.extend({
    type: z.literal("MultiPoint"),
    coordinates: z.array(GeoJSONPositionSchema),
}).passthrough();

export const GeoJSONPolygonSchema = GeoJSONBaseSchema.extend({
    type: z.literal("Polygon"),
    coordinates: z.array(z.array(GeoJSONPositionSchema).min(4)),
}).passthrough();

export const GeoJSONMultiLineStringSchema = GeoJSONBaseSchema.extend({
    type: z.literal("MultiLineString"),
    coordinates: z.array(GeoJSONLineStringSchema.shape.coordinates),
}).passthrough();

export const GeoJSONMultiPolygonSchema = GeoJSONBaseSchema.extend({
    type: z.literal("MultiPolygon"),
    coordinates: z.array(GeoJSONPolygonSchema.shape.coordinates),
}).passthrough();

const _GeoJSONSimpleGeometrySchema = GeoJSONPointSchema.or(GeoJSONLineStringSchema)
    .or(GeoJSONMultiPointSchema)
    .or(GeoJSONPolygonSchema)
    .or(GeoJSONMultiLineStringSchema)
    .or(GeoJSONMultiPolygonSchema);

const _GeoJSONGeometryCollectionBaseSchema = z.object({
    type: z.literal("GeometryCollection"),
});

export type GeoJSONGeometry =
    | z.infer<typeof _GeoJSONSimpleGeometrySchema>
    | (z.infer<typeof _GeoJSONGeometryCollectionBaseSchema> & {
          geometries: GeoJSONGeometry[];
      });

export const GeoJSONGeometryCollectionSchema = _GeoJSONGeometryCollectionBaseSchema.extend({
    geometry: z.lazy(() => z.array(GeoJSONGeometrySchema)),
}) as unknown as ZodType<GeoJSONGeometry>; // For some reason the recursion causes incorrect types, but it does work

export const GeoJSONGeometrySchema = _GeoJSONSimpleGeometrySchema.or(GeoJSONGeometryCollectionSchema);

export const GeoJSONFeatureSchema = z.object({
    id: z.string().or(z.number()).nullable(),
    type: z.literal("Feature"),
    geometry: GeoJSONGeometrySchema.nullable(),
    properties: z.object({}).passthrough().nullable(),
});

export const GeoJSONFeatureCollectionSchema = z.object({
    type: z.literal("FeatureCollection"),
    features: z.array(GeoJSONFeatureSchema),
});

export const GeoJSONSchema = GeoJSONGeometrySchema.or(GeoJSONFeatureSchema).or(GeoJSONFeatureCollectionSchema);

export type GeoJSON = z.infer<typeof GeoJSONSchema>;
