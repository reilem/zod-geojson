import { z } from "zod";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "./position";
import { GeoJSONGeometryBaseGenericSchemaType, GeoJSONGeometryBaseSchema } from "./helper/base";
import { GeoJSONGeometryTypeSchema } from "./type";
import { GeoJSONPointGenericSchemaInnerType } from "./point";
import { INVALID_BBOX_ISSUE, validBboxForPositionList } from "./validation/bbox";
import { INVALID_DIMENSIONS_ISSUE, validDimensionsForPositionList } from "./validation/dimension";

type GeoJSONMultiPointGenericSchemaInnerType<P extends GeoJSONPosition> = {
    type: z.ZodLiteral<typeof GeoJSONGeometryTypeSchema.enum.MultiPoint>;
    coordinates: z.ZodArray<GeoJSONPointGenericSchemaInnerType<P>["coordinates"]>;
};

export type GeoJSONMultiPointGenericSchemaType<P extends GeoJSONPosition> = GeoJSONGeometryBaseGenericSchemaType<
    GeoJSONMultiPointGenericSchemaInnerType<P>
>;

export const GeoJSONMultiPointGenericSchema = <P extends GeoJSONPosition>(
    positionSchema: z.ZodSchema<P>,
): GeoJSONMultiPointGenericSchemaType<P> =>
    GeoJSONGeometryBaseSchema.extend({
        type: z.literal(GeoJSONGeometryTypeSchema.enum.MultiPoint),
        // We allow an empty coordinates array
        // > GeoJSON processors MAY interpret Geometry objects with empty "coordinates"
        //   arrays as null objects. (RFC 7946, section 3.1)
        coordinates: z.array(positionSchema),
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
