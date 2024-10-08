import { z } from "zod";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "../position";
import { INVALID_DIMENSIONS_ISSUE, validDimensionsForPositionList } from "./validation/dimension";
import { INVALID_KEYS_ISSUE, validGeometryKeys } from "./validation/keys";
import { INVALID_BBOX_ISSUE, validBboxForPositionList } from "./validation/bbox";
import { GeoJSONBaseSchema } from "../base";

export const GeoJSONLineStringGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    GeoJSONBaseSchema.extend({
        type: z.literal("LineString"),
        coordinates: z.array(positionSchema).min(2),
    })
        .passthrough()
        .superRefine((val, ctx) => {
            if (!validGeometryKeys(val)) {
                ctx.addIssue(INVALID_KEYS_ISSUE);
                return;
            }

            // Skip remaining checks if coordinates empty
            if (!val.coordinates.length) {
                return;
            }

            if (!validDimensionsForPositionList(val)) {
                ctx.addIssue(INVALID_DIMENSIONS_ISSUE);
                return;
            }
            if (!validBboxForPositionList(val)) {
                ctx.addIssue(INVALID_BBOX_ISSUE);
                return;
            }
        });

export const GeoJSONLineStringSchema = GeoJSONLineStringGenericSchema(GeoJSONPositionSchema);
export type GeoJSONLineString = z.infer<typeof GeoJSONLineStringSchema>;

export const GeoJSON2DLineStringSchema = GeoJSONLineStringGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DLineString = z.infer<typeof GeoJSON2DLineStringSchema>;

export const GeoJSON3DLineStringSchema = GeoJSONLineStringGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DLineString = z.infer<typeof GeoJSON3DLineStringSchema>;
