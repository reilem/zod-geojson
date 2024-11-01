import { objectInputType, objectOutputType, objectUtil, z } from "zod";
import { GeoJSONBase, GeoJSONBaseSchema, GeoJSONBaseSchemaInnerType } from "../../base";
import { GeoJSONPosition } from "../position";

export type GeoJSONGeometryBase<P extends GeoJSONPosition> = GeoJSONBase<P> & {
    geometry?: never;
    properties?: never;
    features?: never;
    geometries?: never;
};

export type GeoJSONGeometryBaseSchemaInnerType<P extends GeoJSONPosition> = GeoJSONBaseSchemaInnerType<P> & {
    geometry: z.ZodOptional<z.ZodNever>;
    properties: z.ZodOptional<z.ZodNever>;
    features: z.ZodOptional<z.ZodNever>;
    geometries: z.ZodOptional<z.ZodNever>;
};

export type GeoJSONGeometryBaseSchemaType<P extends GeoJSONPosition> = z.ZodObject<
    GeoJSONGeometryBaseSchemaInnerType<P>,
    "strip",
    z.ZodTypeAny,
    GeoJSONGeometryBase<P>,
    GeoJSONGeometryBase<P>
>;

export const GeoJSONGeometryBaseSchema = <P extends GeoJSONPosition>(
    positionSchema: z.ZodSchema<P>,
): GeoJSONGeometryBaseSchemaType<P> =>
    GeoJSONBaseSchema(positionSchema).extend({
        geometry: z.never({ message: "GeoJSON geometry cannot have a 'geometry' key" }).optional(),
        properties: z.never({ message: "GeoJSON geometry cannot have a 'properties' key" }).optional(),
        features: z.never({ message: "GeoJSON geometry cannot have a 'features' key" }).optional(),
        geometries: z.never({ message: "GeoJSON geometry cannot have a 'geometries' key" }).optional(),
    });

type ExtendGeoJSONGeometryBaseSchemaInnerType<
    InnerType extends z.ZodRawShape,
    P extends GeoJSONPosition,
> = objectUtil.extendShape<GeoJSONGeometryBaseSchemaInnerType<P>, InnerType>;

export type GeoJSONGeometryBaseGenericSchemaType<
    InnerType extends z.ZodRawShape,
    P extends GeoJSONPosition,
> = z.ZodEffects<
    z.ZodObject<ExtendGeoJSONGeometryBaseSchemaInnerType<InnerType, P>, "passthrough", z.ZodTypeAny>,
    objectOutputType<ExtendGeoJSONGeometryBaseSchemaInnerType<InnerType, P>, z.ZodTypeAny, "passthrough">,
    objectInputType<ExtendGeoJSONGeometryBaseSchemaInnerType<InnerType, P>, z.ZodTypeAny, "passthrough">
>;
