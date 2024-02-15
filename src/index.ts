// Derived from the GeoJSON spec: https://datatracker.ietf.org/doc/html/rfc7946
import { z, ZodType } from "zod";

// TODO: Specify the allowed values for the positions, must use WGS 84
// GeoJSON positions and coordinates (see 3.1.1)
// Array: [longitude/easting, latitude/northing, altitude (optional), ...extra elements are unspecified and ambiguous]
export const GeoJSONPositionSchema = z.array(z.number()).min(2);
export type GeoJSONPosition = z.infer<typeof GeoJSONPositionSchema>;

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
export type GeoJSONGeometryType = z.infer<typeof GeoJSONGeometryTypeSchema>;

export const GeoJSONTypeSchema = z.enum(["Feature", "FeatureCollection"]).or(GeoJSONGeometryTypeSchema);
export type GeoJSONType = z.infer<typeof GeoJSONTypeSchema>;

export const GeoJSONBBoxSchema = z
    .array(z.number())
    .refine((bbox) => bbox.length % 2 === 0, "Bounding box must have an even number of elements");
export type GeoJSONBbox = z.infer<typeof GeoJSONBBoxSchema>;

const GeoJSONBaseSchema = z.object({
    bbox: GeoJSONBBoxSchema.optional(),
});

// TODO: Refine that all positions have the same dimension
// TODO: Refine that bbox length matches the dimension of the position
// TODO: Refine that the bbox is valid for the given positions & geometry

export const GeoJSONPointSchema = GeoJSONBaseSchema.extend({
    type: z.literal("Point"),
    coordinates: GeoJSONPositionSchema,
}).passthrough();
export type GeoJSONPoint = z.infer<typeof GeoJSONPointSchema>;

export const GeoJSONLineStringSchema = GeoJSONBaseSchema.extend({
    type: z.literal("LineString"),
    coordinates: z.array(GeoJSONPositionSchema).min(2),
}).passthrough();
export type GeoJSONLineString = z.infer<typeof GeoJSONLineStringSchema>;

export const GeoJSONMultiPointSchema = GeoJSONBaseSchema.extend({
    type: z.literal("MultiPoint"),
    coordinates: z.array(GeoJSONPositionSchema),
}).passthrough();
export type GeoJSONMultiPoint = z.infer<typeof GeoJSONMultiPointSchema>;

// TODO: Refine that all line strings are linear rings (first and last position are the same)
export const GeoJSONPolygonSchema = GeoJSONBaseSchema.extend({
    type: z.literal("Polygon"),
    coordinates: z.array(z.array(GeoJSONPositionSchema).min(4)),
}).passthrough();
export type GeoJSONPolygon = z.infer<typeof GeoJSONPolygonSchema>;

export const GeoJSONMultiLineStringSchema = GeoJSONBaseSchema.extend({
    type: z.literal("MultiLineString"),
    coordinates: z.array(GeoJSONLineStringSchema.shape.coordinates),
}).passthrough();
export type GeoJSONMultiLineString = z.infer<typeof GeoJSONMultiLineStringSchema>;

// TODO: Refine that all line strings are linear rings (first and last position are the same)
export const GeoJSONMultiPolygonSchema = GeoJSONBaseSchema.extend({
    type: z.literal("MultiPolygon"),
    coordinates: z.array(GeoJSONPolygonSchema.shape.coordinates),
}).passthrough();
export type GeoJSONMultiPolygon = z.infer<typeof GeoJSONMultiPolygonSchema>;

const _GeoJSONSimpleGeometrySchema = GeoJSONPointSchema.or(GeoJSONLineStringSchema)
    .or(GeoJSONMultiPointSchema)
    .or(GeoJSONPolygonSchema)
    .or(GeoJSONMultiLineStringSchema)
    .or(GeoJSONMultiPolygonSchema);

const _GeoJSONGeometryCollectionBaseSchema = GeoJSONBaseSchema.extend({
    type: z.literal("GeometryCollection"),
});

export const GeoJSONGeometryCollectionSchema: ZodType<GeoJSONGeometryCollection> =
    _GeoJSONGeometryCollectionBaseSchema.extend({
        geometries: z.lazy(() => z.array(GeoJSONGeometrySchema)),
    }); // For some reason the recursion causes incorrect types, but it does work

export type GeoJSONGeometryCollection = z.infer<typeof _GeoJSONGeometryCollectionBaseSchema> & {
    geometries: GeoJSONGeometry[];
};

// TODO: Refine "GeoJSON Types Are Not Extensible" section 7 of the spec

export const GeoJSONGeometrySchema = _GeoJSONSimpleGeometrySchema.or(GeoJSONGeometryCollectionSchema);

export type GeoJSONGeometry = z.infer<typeof GeoJSONGeometrySchema>;

export const GeoJSONFeatureSchema = z.object({
    id: z.string().or(z.number()).optional(),
    type: z.literal("Feature"),
    geometry: GeoJSONGeometrySchema.nullable(),
    properties: z.object({}).passthrough().nullable(),
});

export type GeoJSONFeature = z.infer<typeof GeoJSONFeatureSchema>;

export const GeoJSONFeatureCollectionSchema = z.object({
    type: z.literal("FeatureCollection"),
    features: z.array(GeoJSONFeatureSchema),
});

export type GeoJSONFeatureCollection = z.infer<typeof GeoJSONFeatureCollectionSchema>;

export const GeoJSONSchema = GeoJSONGeometrySchema.or(GeoJSONFeatureSchema).or(GeoJSONFeatureCollectionSchema);

export type GeoJSON = z.infer<typeof GeoJSONSchema>;
