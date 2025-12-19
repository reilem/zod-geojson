import * as z from "zod/v4";
import {
    GeoJSON2DPosition,
    GeoJSON2DPositionSchema,
    GeoJSON3DPosition,
    GeoJSON3DPositionSchema,
    GeoJSONAnyPosition,
    GeoJSONPositionSchema,
} from "./geometry/position";

export type _GeoJSONBBoxGeneric<P extends GeoJSONAnyPosition> = P extends GeoJSON3DPosition
    ? [number, number, number, number, number, number]
    : P extends GeoJSON2DPosition
      ? [number, number, number, number]
      : [number, number, number, number] | [number, number, number, number, number, number];

const _2DBBoxSchema = z.tuple([z.number(), z.number(), z.number(), z.number()]);
const _3DBBoxSchema = z.tuple([z.number(), z.number(), z.number(), z.number(), z.number(), z.number()]);

export type GeoJSONBBoxGenericSchemaType<P extends GeoJSONAnyPosition> = z.ZodType<_GeoJSONBBoxGeneric<P>>;

/**
 * Creates a Zod schema for a GeoJSON bounding box based on the provided position schema.
 * Zod tuples with 2 or 3 items are used to represent 2D and 3D bounding boxes respectively.
 * If the position schema is not a tuple with 2 or 3 items, it returns a union of both 2D and 3D bounding box schemas.
 */
export const GeoJSONBBoxGenericSchema = <P extends GeoJSONAnyPosition>(
    positionSchema: z.ZodType<P>,
): GeoJSONBBoxGenericSchemaType<P> => {
    // Because zod cannot do conditional typing we need to do some hacky type casts to make this work
    if (positionSchema instanceof z.ZodTuple) {
        const itemCount = positionSchema.def.items.length;
        if (itemCount === 2) {
            return _2DBBoxSchema as unknown as z.ZodType<GeoJSONBBoxGeneric<P>>;
        }
        if (itemCount === 3) {
            return _3DBBoxSchema as unknown as z.ZodType<GeoJSONBBoxGeneric<P>>;
        }
    }
    // If the position is not a tuple, we can't infer the dimension, and we return a union of 2D and 3D bbox
    return z.union([_2DBBoxSchema, _3DBBoxSchema]) as unknown as z.ZodType<GeoJSONBBoxGeneric<P>>;
};
export type GeoJSONBBoxGeneric<P extends GeoJSONAnyPosition> = z.infer<ReturnType<typeof GeoJSONBBoxGenericSchema<P>>>;

export const GeoJSON2DBBoxSchema = GeoJSONBBoxGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DBBox = z.infer<typeof GeoJSON2DBBoxSchema>;

export const GeoJSON3DBBoxSchema = GeoJSONBBoxGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DBBox = z.infer<typeof GeoJSON3DBBoxSchema>;

export const GeoJSONBBoxSchema = GeoJSONBBoxGenericSchema(GeoJSONPositionSchema);
export type GeoJSONBBox = z.infer<typeof GeoJSONBBoxSchema>;
