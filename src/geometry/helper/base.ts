import { z } from "zod";
import { GeoJSONBase, GeoJSONBaseSchema, GeoJSONBaseSchemaInnerType } from "../../base";

export type GeoJSONGeometryBase = GeoJSONBase & {
    geometry?: never;
    properties?: never;
    features?: never;
    geometries?: never;
};

export type GeoJSONGeometryBaseSchemaInnerType = GeoJSONBaseSchemaInnerType & {
    geometry: z.ZodOptional<z.ZodNever>;
    properties: z.ZodOptional<z.ZodNever>;
    features: z.ZodOptional<z.ZodNever>;
    geometries: z.ZodOptional<z.ZodNever>;
};

export type GeoJSONGeometryBaseSchemaType = z.ZodObject<
    GeoJSONGeometryBaseSchemaInnerType,
    "strip",
    z.ZodTypeAny,
    GeoJSONGeometryBase,
    GeoJSONGeometryBase
>;

export const GeoJSONGeometryBaseSchema: GeoJSONGeometryBaseSchemaType = GeoJSONBaseSchema.extend({
    geometry: z.never({ message: "GeoJSON geometry object cannot have a 'geometry' key" }).optional(),
    properties: z.never({ message: "GeoJSON geometry object cannot have a 'properties' key" }).optional(),
    features: z.never({ message: "GeoJSON geometry object cannot have a 'features' key" }).optional(),
    geometries: z.never({ message: "GeoJSON geometry object cannot have a 'geometries' key" }).optional(),
});
