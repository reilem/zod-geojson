import { z } from "zod";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "../position";
import { GeoJSONGeometryBaseSchema } from "./base";
import { INVALID_BBOX_ISSUE, validBboxForPositionList } from "./validation/bbox";
import { INVALID_DIMENSIONS_ISSUE, validDimensionsForPositionList } from "./validation/dimension";

export const GeoJSONMultiPointGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    GeoJSONGeometryBaseSchema.extend({
        type: z.literal("MultiPoint"),
        coordinates: z.array(positionSchema).min(1),
    })
        .passthrough()
        .superRefine((val, ctx) => {
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

export const GeoJSONMultiPointSchema = GeoJSONMultiPointGenericSchema(GeoJSONPositionSchema);
export type GeoJSONMultiPoint = z.infer<typeof GeoJSONMultiPointSchema>;

export const GeoJSON2DMultiPointSchema = GeoJSONMultiPointGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DMultiPoint = z.infer<typeof GeoJSON2DMultiPointSchema>;

export const GeoJSON3DMultiPointSchema = GeoJSONMultiPointGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DMultiPoint = z.infer<typeof GeoJSON3DMultiPointSchema>;
