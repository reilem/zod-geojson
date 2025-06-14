import { z } from "zod/v4";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "./position";
import { GeoJSONGeometryBaseSchema } from "./helper/base";
import { GeoJSONGeometryTypeSchema } from "./type";
import { getInvalidBBoxIssue, validBboxForPositionList } from "./validation/bbox";
import { getInvalidDimensionIssue, validDimensionsForPositionList } from "./validation/dimension";

export const GeoJSONMultiPointGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    GeoJSONGeometryBaseSchema(positionSchema)
        .extend({
            type: z.literal(GeoJSONGeometryTypeSchema.enum.MultiPoint),
            // We allow an empty coordinates array
            // > GeoJSON processors MAY interpret Geometry objects with empty "coordinates"
            //   arrays as null objects. (RFC 7946, section 3.1)
            coordinates: z.array(positionSchema),
        })
        .check((ctx) => {
            // Skip remaining checks if coordinates empty
            if (!ctx.value.coordinates.length) {
                return;
            }
            if (!validDimensionsForPositionList(ctx.value)) {
                ctx.issues.push(getInvalidDimensionIssue(ctx));
                return;
            }
            if (!validBboxForPositionList(ctx.value)) {
                ctx.issues.push(getInvalidBBoxIssue(ctx));
                return;
            }
        });

export const GeoJSONMultiPointSchema = GeoJSONMultiPointGenericSchema(GeoJSONPositionSchema);
export type GeoJSONMultiPoint = z.infer<typeof GeoJSONMultiPointSchema>;

export const GeoJSON2DMultiPointSchema = GeoJSONMultiPointGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DMultiPoint = z.infer<typeof GeoJSON2DMultiPointSchema>;

export const GeoJSON3DMultiPointSchema = GeoJSONMultiPointGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DMultiPoint = z.infer<typeof GeoJSON3DMultiPointSchema>;
