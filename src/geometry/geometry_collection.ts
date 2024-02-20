import { z, ZodType } from "zod";
import { GeoJSONBaseSchema } from "./_helper";
import { _GeoJSONSimpleGeometrySchema } from "./_simple";

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
