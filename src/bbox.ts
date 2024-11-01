import { z, ZodSchema } from "zod";
import {
    GeoJSON2DPosition,
    GeoJSON2DPositionSchema,
    GeoJSON3DPosition,
    GeoJSON3DPositionSchema,
    GeoJSONPosition,
    GeoJSONPositionSchema,
} from "./geometry/position";

export type GeoJSONBboxGeneric<P extends GeoJSONPosition> = P extends GeoJSON3DPosition
    ? [number, number, number, number, number, number]
    : P extends GeoJSON2DPosition
      ? [number, number, number, number]
      : [number, number, number, number] | [number, number, number, number, number, number];

export type GeoJSONBboxSchemaType<P extends GeoJSONPosition> = ZodSchema<GeoJSONBboxGeneric<P>>;

const _2DBboxSchema = z.tuple([z.number(), z.number(), z.number(), z.number()]);
const _3DBboxSchema = z.tuple([z.number(), z.number(), z.number(), z.number(), z.number(), z.number()]);

/**
 * Because zod cannot do conditional typing we need to do some hacky type casts to make this work
 */
export const GeoJSONBboxGenericSchema = <P extends GeoJSONPosition>(
    positionSchema: z.ZodSchema<P>,
): GeoJSONBboxSchemaType<P> => {
    // If the position is not a tuple, we can't infer the dimension, and we return a union of 2D and 3D bbox
    if (!(positionSchema instanceof z.ZodTuple)) {
        return z.union([_2DBboxSchema, _3DBboxSchema]) as unknown as ZodSchema<GeoJSONBboxGeneric<P>>;
    }
    if (positionSchema.items.length === 2) {
        return _2DBboxSchema as unknown as ZodSchema<GeoJSONBboxGeneric<P>>;
    }
    return _3DBboxSchema as unknown as ZodSchema<GeoJSONBboxGeneric<P>>;
};

export const GeoJSON2DBboxSchema = GeoJSONBboxGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DBbox = z.infer<typeof GeoJSON2DBboxSchema>;

export const GeoJSON3DBboxSchema = GeoJSONBboxGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DBbox = z.infer<typeof GeoJSON3DBboxSchema>;

export const GeoJSONBboxSchema = GeoJSONBboxGenericSchema(GeoJSONPositionSchema);
export type GeoJSONBbox = z.infer<typeof GeoJSONBboxSchema>;
