import * as z from "zod/v4";
import {
    GeoJSON2DPosition,
    GeoJSON2DPositionSchema,
    GeoJSON3DPosition,
    GeoJSON3DPositionSchema,
    GeoJSONAnyPosition,
    GeoJSONPositionSchema,
} from "./geometry/position";

export type GeoJSONBboxGeneric<P extends GeoJSONAnyPosition> = P extends GeoJSON3DPosition
    ? [number, number, number, number, number, number]
    : P extends GeoJSON2DPosition
      ? [number, number, number, number]
      : [number, number, number, number] | [number, number, number, number, number, number];

const _2DBboxSchema = z.tuple([z.number(), z.number(), z.number(), z.number()]);
const _3DBboxSchema = z.tuple([z.number(), z.number(), z.number(), z.number(), z.number(), z.number()]);

/**
 * Creates a Zod schema for a GeoJSON bounding box based on the provided position schema.
 * Zod tuples with 2 or 3 items are used to represent 2D and 3D bounding boxes respectively.
 * If the position schema is not a tuple with 2 or 3 items, it returns a union of both 2D and 3D bounding box schemas.
 */
export const GeoJSONBboxGenericSchema = <P extends GeoJSONAnyPosition>(
    positionSchema: z.ZodType<P>,
): z.ZodType<GeoJSONBboxGeneric<P>> => {
    // Because zod cannot do conditional typing we need to do some hacky type casts to make this work
    if (positionSchema instanceof z.ZodTuple) {
        const itemCount = positionSchema.def.items.length;
        if (itemCount === 2) {
            return _2DBboxSchema as unknown as z.ZodType<GeoJSONBboxGeneric<P>>;
        }
        if (itemCount === 3) {
            return _3DBboxSchema as unknown as z.ZodType<GeoJSONBboxGeneric<P>>;
        }
    }
    // If the position is not a tuple, we can't infer the dimension, and we return a union of 2D and 3D bbox
    return z.union([_2DBboxSchema, _3DBboxSchema]) as unknown as z.ZodType<GeoJSONBboxGeneric<P>>;
};

export const GeoJSON2DBboxSchema = GeoJSONBboxGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DBbox = z.infer<typeof GeoJSON2DBboxSchema>;

export const GeoJSON3DBboxSchema = GeoJSONBboxGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DBbox = z.infer<typeof GeoJSON3DBboxSchema>;

export const GeoJSONBboxSchema = GeoJSONBboxGenericSchema(GeoJSONPositionSchema);
export type GeoJSONBbox = z.infer<typeof GeoJSONBboxSchema>;
