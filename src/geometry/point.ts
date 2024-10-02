import { z } from "zod";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "../position";
import { INVALID_BBOX_ISSUE, validBboxForPosition } from "./validation/bbox";
import { INVALID_KEYS_ISSUE, validGeometryKeys } from "./validation/keys";
import { GeoJSONBaseSchema } from "../base";

export const GeoJSONPointGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    GeoJSONBaseSchema.extend({
        type: z.literal("Point"),
        coordinates: positionSchema,
    })
        .passthrough()
        .superRefine((val, ctx) => {
            if (!validGeometryKeys(val)) {
                ctx.addIssue(INVALID_KEYS_ISSUE);
            }
            if (!validBboxForPosition(val)) {
                ctx.addIssue(INVALID_BBOX_ISSUE);
            }
        });

export const GeoJSONPointSchema = GeoJSONPointGenericSchema(GeoJSONPositionSchema);
export type GeoJSONPoint = z.infer<typeof GeoJSONPointSchema>;

export const GeoJSON2DPointSchema = GeoJSONPointGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DPoint = z.infer<typeof GeoJSON2DPointSchema>;

export const GeoJSON3DPointSchema = GeoJSONPointGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DPoint = z.infer<typeof GeoJSON3DPointSchema>;
