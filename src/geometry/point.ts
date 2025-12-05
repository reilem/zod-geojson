import * as z from "zod/v4";
import { GeoJSONGeometryBaseSchema } from "./helper/base";
import {
    GeoJSON2DPositionSchema,
    GeoJSON3DPositionSchema,
    GeoJSONAnyPosition,
    GeoJSONPositionSchema,
} from "./position";
import { GeoJSONGeometryTypeSchema } from "./type";
import { getInvalidBBoxIssue, validBboxForPosition } from "./validation/bbox";

export const GeoJSONPointGenericSchema = <P extends GeoJSONAnyPosition>(positionSchema: z.ZodType<P>) =>
    z
        .looseObject({
            ...GeoJSONGeometryBaseSchema(positionSchema).shape,
            type: z.literal(GeoJSONGeometryTypeSchema.enum.Point),
            coordinates: positionSchema,
        })
        .check((ctx) => {
            if (!validBboxForPosition(ctx.value)) {
                ctx.issues.push(getInvalidBBoxIssue(ctx));
            }
        });

export const GeoJSONPointSchema = GeoJSONPointGenericSchema(GeoJSONPositionSchema);
export type GeoJSONPoint = z.infer<typeof GeoJSONPointSchema>;

export const GeoJSON2DPointSchema = GeoJSONPointGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DPoint = z.infer<typeof GeoJSON2DPointSchema>;

export const GeoJSON3DPointSchema = GeoJSONPointGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DPoint = z.infer<typeof GeoJSON3DPointSchema>;
