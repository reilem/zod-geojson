import { z } from "zod";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "../position";
import { INVALID_BBOX_ISSUE, validBboxForPositionGrid } from "./validation/bbox";
import { INVALID_DIMENSIONS_ISSUE, validDimensionsForPositionGrid } from "./validation/dimension";
import { INVALID_KEYS_ISSUE, validGeometryKeys } from "./validation/keys";
import { GeoJSONLineStringGenericSchema } from "./line_string";
import { GeoJSONBaseSchema } from "../base";

export const GeoJSONMultiLineStringGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    GeoJSONBaseSchema.extend({
        type: z.literal("MultiLineString"),
        coordinates: z.array(GeoJSONLineStringGenericSchema(positionSchema).innerType().shape.coordinates).min(1),
    })
        .passthrough()
        .superRefine((val, ctx) => {
            if (!validGeometryKeys(val)) {
                ctx.addIssue(INVALID_KEYS_ISSUE);
                return;
            }
            // Skip remaining checks if coordinates array is empty
            if (!val.coordinates.length) {
                return;
            }

            if (!validDimensionsForPositionGrid(val)) {
                ctx.addIssue(INVALID_DIMENSIONS_ISSUE);
                return;
            }
            if (!validBboxForPositionGrid(val)) {
                ctx.addIssue(INVALID_BBOX_ISSUE);
                return;
            }
        });

export const GeoJSONMultiLineStringSchema = GeoJSONMultiLineStringGenericSchema(GeoJSONPositionSchema);
export type GeoJSONMultiLineString = z.infer<typeof GeoJSONMultiLineStringSchema>;

export const GeoJSON2DMultiLineStringSchema = GeoJSONMultiLineStringGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DMultiLineString = z.infer<typeof GeoJSON2DMultiLineStringSchema>;

export const GeoJSON3DMultiLineStringSchema = GeoJSONMultiLineStringGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DMultiLineString = z.infer<typeof GeoJSON3DMultiLineStringSchema>;
