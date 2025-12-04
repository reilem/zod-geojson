import * as z from "zod/v4";
import { GeoJSONGeometryBaseSchema } from "./helper/base";
import { GeoJSONLineStringGenericSchema } from "./line_string";
import {
    GeoJSON2DPositionSchema,
    GeoJSON3DPositionSchema,
    GeoJSONAnyPosition,
    GeoJSONPositionSchema,
} from "./position";
import { GeoJSONGeometryTypeSchema } from "./type";
import { getInvalidBBoxIssue, validBboxForPositionGrid } from "./validation/bbox";
import { getInvalidDimensionIssue, validDimensionsForPositionGrid } from "./validation/dimension";

export const GeoJSONMultiLineStringGenericSchema = <P extends GeoJSONAnyPosition>(positionSchema: z.ZodType<P>) =>
    z
        .looseObject({
            ...GeoJSONGeometryBaseSchema(positionSchema).shape,
            type: z.literal(GeoJSONGeometryTypeSchema.enum.MultiLineString),
            // We allow an empty coordinates array
            // > GeoJSON processors MAY interpret Geometry objects with empty "coordinates"
            //   arrays as null objects. (RFC 7946, section 3.1)
            coordinates: GeoJSONLineStringGenericSchema(positionSchema).shape.coordinates.array(),
        })
        .check((ctx) => {
            // Skip remaining checks if coordinates array is empty
            if (!ctx.value.coordinates.length) {
                return;
            }

            if (!validDimensionsForPositionGrid(ctx.value)) {
                ctx.issues.push(getInvalidDimensionIssue(ctx));
                return;
            }
            if (!validBboxForPositionGrid(ctx.value)) {
                ctx.issues.push(getInvalidBBoxIssue(ctx));
                return;
            }
        });

export const GeoJSONMultiLineStringSchema = GeoJSONMultiLineStringGenericSchema(GeoJSONPositionSchema);
export type GeoJSONMultiLineString = z.infer<typeof GeoJSONMultiLineStringSchema>;

export const GeoJSON2DMultiLineStringSchema = GeoJSONMultiLineStringGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DMultiLineString = z.infer<typeof GeoJSON2DMultiLineStringSchema>;

export const GeoJSON3DMultiLineStringSchema = GeoJSONMultiLineStringGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DMultiLineString = z.infer<typeof GeoJSON3DMultiLineStringSchema>;
