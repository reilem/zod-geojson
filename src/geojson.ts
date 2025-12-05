import * as z from "zod/v4";
import { GeoJSONFeatureGenericSchema } from "./feature";
import { GeoJSONFeatureCollectionGenericSchema } from "./feature_collection";
import {
    DiscriminableGeometrySchema,
    GeoJSON2DGeometrySchema,
    GeoJSON3DGeometrySchema,
    GeoJSONGeometryGeneric,
    GeoJSONGeometrySchema,
} from "./geometry/geometry";
import {
    GeoJSON2DPositionSchema,
    GeoJSON3DPositionSchema,
    GeoJSONAnyPosition,
    GeoJSONPositionSchema,
} from "./geometry/position";
import { GeoJSONProperties, GeoJSONPropertiesSchema } from "./properties";

export const GeoJSONGenericSchema = <
    P extends GeoJSONAnyPosition,
    R extends GeoJSONProperties,
    G extends GeoJSONGeometryGeneric<P>,
>(
    positionSchema: z.ZodType<P>,
    propertiesSchema: z.ZodType<R>,
    geometrySchema: DiscriminableGeometrySchema<P, G>,
) =>
    z.discriminatedUnion("type", [
        geometrySchema,
        GeoJSONFeatureGenericSchema(positionSchema, propertiesSchema, geometrySchema),
        GeoJSONFeatureCollectionGenericSchema(positionSchema, propertiesSchema, geometrySchema),
    ]);
export type GeoJSONGeneric<
    P extends GeoJSONAnyPosition,
    R extends GeoJSONProperties,
    G extends GeoJSONGeometryGeneric<P>,
> = z.infer<ReturnType<typeof GeoJSONGenericSchema<P, R, G>>>;

export const GeoJSONSchema = GeoJSONGenericSchema(
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSONGeometrySchema,
);
export type GeoJSON = z.infer<typeof GeoJSONSchema>;

export const GeoJSON2DSchema = GeoJSONGenericSchema(
    GeoJSON2DPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSON2DGeometrySchema,
);
export type GeoJSON2D = z.infer<typeof GeoJSON2DSchema>;

export const GeoJSON3DSchema = GeoJSONGenericSchema(
    GeoJSON3DPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSON3DGeometrySchema,
);
export type GeoJSON3D = z.infer<typeof GeoJSON3DSchema>;
