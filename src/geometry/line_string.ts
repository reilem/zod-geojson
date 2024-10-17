import { z } from "zod";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "../position";
import { GeoJSONGeometryBaseGenericSchemaType, GeoJSONGeometryBaseSchema } from "./helper/base";
import { GeoJSONGeometryTypeSchema } from "./helper/type";
import { INVALID_BBOX_ISSUE, validBboxForPositionList } from "./validation/bbox";
import { INVALID_DIMENSIONS_ISSUE, validDimensionsForPositionList } from "./validation/dimension";

export type GeoJSONLineStringGenericSchemaInnerType<P extends GeoJSONPosition> = {
    type: z.ZodLiteral<typeof GeoJSONGeometryTypeSchema.enum.LineString>;
    coordinates: z.ZodTuple<[z.ZodSchema<P>, z.ZodSchema<P>], z.ZodSchema<P>>;
};

export type GeoJSONLineStringGenericSchemaType<P extends GeoJSONPosition> = GeoJSONGeometryBaseGenericSchemaType<
    GeoJSONLineStringGenericSchemaInnerType<P>
>;

export const GeoJSONLineStringGenericSchema = <P extends GeoJSONPosition>(
    positionSchema: z.ZodSchema<P>,
): GeoJSONLineStringGenericSchemaType<P> =>
    GeoJSONGeometryBaseSchema.extend({
        type: z.literal(GeoJSONGeometryTypeSchema.enum.LineString),
        // > For type "LineString", the "coordinates" member is an array of two or
        //   more positions. (RFC 7946, section 3.1.4)
        coordinates: z.tuple([positionSchema, positionSchema]).rest(positionSchema),
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

export const GeoJSONLineStringSchema = GeoJSONLineStringGenericSchema(GeoJSONPositionSchema);
export type GeoJSONLineString = z.infer<typeof GeoJSONLineStringSchema>;

export const GeoJSON2DLineStringSchema = GeoJSONLineStringGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DLineString = z.infer<typeof GeoJSON2DLineStringSchema>;

export const GeoJSON3DLineStringSchema = GeoJSONLineStringGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DLineString = z.infer<typeof GeoJSON3DLineStringSchema>;
