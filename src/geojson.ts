import { z } from "zod/v4";
import { GeoJSONFeatureGenericSchema } from "./feature";
import { GeoJSONFeatureCollectionGenericSchema } from "./feature_collection";
import { GeoJSONGeometryGenericSchema } from "./geometry/geometry";
import {
    GeoJSON2DPositionSchema,
    GeoJSON3DPositionSchema,
    GeoJSONPosition,
    GeoJSONPositionSchema,
} from "./geometry/position";
import { GeoJSONProperties, GeoJSONPropertiesSchema } from "./properties";

export const GeoJSONGenericSchema = <P extends GeoJSONPosition, R extends GeoJSONProperties>(
    positionSchema: z.ZodType<P>,
    propertiesSchema: z.ZodType<R>,
) =>
    z.discriminatedUnion("type", [
        GeoJSONGeometryGenericSchema(positionSchema),
        GeoJSONFeatureGenericSchema(positionSchema, propertiesSchema),
        GeoJSONFeatureCollectionGenericSchema(positionSchema, propertiesSchema),
    ]);

export const GeoJSONSchema = GeoJSONGenericSchema(GeoJSONPositionSchema, GeoJSONPropertiesSchema);
export type GeoJSON = z.infer<typeof GeoJSONSchema>;

export const GeoJSON2DSchema = GeoJSONGenericSchema(GeoJSON2DPositionSchema, GeoJSONPropertiesSchema);
export type GeoJSON2D = z.infer<typeof GeoJSON2DSchema>;

export const GeoJSON3DSchema = GeoJSONGenericSchema(GeoJSON3DPositionSchema, GeoJSONPropertiesSchema);
export type GeoJSON3D = z.infer<typeof GeoJSON3DSchema>;
