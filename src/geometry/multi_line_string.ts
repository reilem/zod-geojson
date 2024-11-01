import { z } from "zod";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "./position";
import { GeoJSONGeometryBaseGenericSchemaType, GeoJSONGeometryBaseSchema } from "./helper/base";
import { GeoJSONGeometryTypeSchema } from "./type";
import { INVALID_BBOX_ISSUE, validBboxForPositionGrid } from "./validation/bbox";
import { INVALID_DIMENSIONS_ISSUE, validDimensionsForPositionGrid } from "./validation/dimension";
import { GeoJSONLineStringGenericSchema, GeoJSONLineStringGenericSchemaInnerType } from "./line_string";

type GeoJSONMultiLineStringGenericSchemaInnerType<P extends GeoJSONPosition> = {
    type: z.ZodLiteral<typeof GeoJSONGeometryTypeSchema.enum.MultiLineString>;
    coordinates: z.ZodArray<GeoJSONLineStringGenericSchemaInnerType<P>["coordinates"]>;
};

export type GeoJSONMultiLineStringGenericSchemaType<P extends GeoJSONPosition> = GeoJSONGeometryBaseGenericSchemaType<
    GeoJSONMultiLineStringGenericSchemaInnerType<P>,
    P
>;

export const GeoJSONMultiLineStringGenericSchema = <P extends GeoJSONPosition>(
    positionSchema: z.ZodSchema<P>,
): GeoJSONMultiLineStringGenericSchemaType<P> =>
    GeoJSONGeometryBaseSchema(positionSchema)
        .extend({
            type: z.literal(GeoJSONGeometryTypeSchema.enum.MultiLineString),
            // We allow an empty coordinates array
            // > GeoJSON processors MAY interpret Geometry objects with empty "coordinates"
            //   arrays as null objects. (RFC 7946, section 3.1)
            coordinates: z.array(GeoJSONLineStringGenericSchema(positionSchema).innerType().shape.coordinates),
        })
        .passthrough()
        .superRefine((val, ctx) => {
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
