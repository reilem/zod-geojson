import * as z from "zod";
import { GeoJSONBaseSchema, GeoJSONBaseSchemaShape } from "../../base";
import { GeoJSONAnyPosition } from "../position";

export type GeoJSONGeometryBaseSchemaShape<P extends GeoJSONAnyPosition> = GeoJSONBaseSchemaShape<P> & {
    geometry: z.ZodOptional<z.ZodNever>;
    properties: z.ZodOptional<z.ZodNever>;
    features: z.ZodOptional<z.ZodNever>;
    geometries: z.ZodOptional<z.ZodNever>;
};

export type GeoJSONGeometryBaseSchemaType<P extends GeoJSONAnyPosition> = z.ZodObject<
    GeoJSONGeometryBaseSchemaShape<P>
>;

export const GeoJSONGeometryBaseSchema = <P extends GeoJSONAnyPosition>(
    positionSchema: z.ZodType<P>,
): GeoJSONGeometryBaseSchemaType<P> =>
    z.object({
        ...GeoJSONBaseSchema(positionSchema).shape,
        geometry: z.never({ error: "GeoJSON geometry cannot have a 'geometry' key" }).optional(),
        properties: z.never({ error: "GeoJSON geometry cannot have a 'properties' key" }).optional(),
        features: z.never({ error: "GeoJSON geometry cannot have a 'features' key" }).optional(),
        geometries: z.never({ error: "GeoJSON geometry cannot have a 'geometries' key" }).optional(),
    });
