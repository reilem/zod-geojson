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

export const GeoJSONGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodType<P>) =>
    z.discriminatedUnion("type", [
        GeoJSONGeometryGenericSchema(positionSchema),
        GeoJSONFeatureGenericSchema(positionSchema),
        GeoJSONFeatureCollectionGenericSchema(positionSchema),
    ]);

export const GeoJSONSchema = GeoJSONGenericSchema(GeoJSONPositionSchema);
export type GeoJSON = z.infer<typeof GeoJSONSchema>;

export const GeoJSON2DSchema = GeoJSONGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2D = z.infer<typeof GeoJSON2DSchema>;

export const GeoJSON3DSchema = GeoJSONGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3D = z.infer<typeof GeoJSON3DSchema>;
