import { z } from "zod/v4";
import { GeoJSONGeometryBaseSchema } from "./helper/base";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "./position";
import { GeoJSONGeometryTypeSchema } from "./type";
import { getInvalidBBoxIssue, validBboxForPositionList } from "./validation/bbox";
import { getInvalidDimensionIssue, validDimensionsForPositionList } from "./validation/dimension";

export const GeoJSONLineStringGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    z
        .looseObject({
            ...GeoJSONGeometryBaseSchema(positionSchema).shape,
            type: z.literal(GeoJSONGeometryTypeSchema.enum.LineString),
            // > For type "LineString", the "coordinates" member is an array of two or
            //   more positions. (RFC 7946, section 3.1.4)
            coordinates: z.tuple([positionSchema, positionSchema]).rest(positionSchema),
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

export const GeoJSONLineStringSchema = GeoJSONLineStringGenericSchema(GeoJSONPositionSchema);
export type GeoJSONLineString = z.infer<typeof GeoJSONLineStringSchema>;

export const GeoJSON2DLineStringSchema = GeoJSONLineStringGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DLineString = z.infer<typeof GeoJSON2DLineStringSchema>;

export const GeoJSON3DLineStringSchema = GeoJSONLineStringGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DLineString = z.infer<typeof GeoJSON3DLineStringSchema>;
