import * as z from "zod/v4";
import {
    GeoJSON2DPosition,
    GeoJSON2DPositionSchema,
    GeoJSON3DPosition,
    GeoJSON3DPositionSchema,
    GeoJSONAnyPosition,
    GeoJSONPositionSchema,
} from "./geometry/position";

const _2DBBoxSchema = z.tuple([z.number(), z.number(), z.number(), z.number()]);
const _3DBBoxSchema = z.tuple([z.number(), z.number(), z.number(), z.number(), z.number(), z.number()]);
const _2DOr3DBBoxSchema = z.union([_2DBBoxSchema, _3DBBoxSchema]);
type _2DOr3DBBox = z.infer<typeof _2DOr3DBBoxSchema>;

/**
 * Type representing a GeoJSON bounding box based on the provided position type.
 * - When the position is not specifically 2D or 3D, the bounding box can be either 2D or 3D.
 * - When the position is specifically 3D, the bounding box can be either 2D or 3D.
 * - When the position is specifically 2D, the bounding box can be either 2D or 3D.
 * - For other cases, it defaults to a number array.
 *
 * This rather strange approach is for compatibility with the @types/geojson definitions.
 */
export type _GeoJSONBBoxGeneric<P extends GeoJSONAnyPosition> = number extends P["length"]
    ? _2DOr3DBBox
    : P extends GeoJSON3DPosition
      ? _2DOr3DBBox
      : P extends GeoJSON2DPosition
        ? _2DOr3DBBox
        : number[];

export type GeoJSONBBoxGenericSchemaType<P extends GeoJSONAnyPosition> = z.ZodType<_GeoJSONBBoxGeneric<P>>;

/**
 * Creates a Zod schema for a GeoJSON bounding box roughly based on the provided position schema.
 * The typing is thrown completely out of the window here, and we reply on our automated tests
 * to ensure the runtime behavior is correct. The real bbox validation is implemented in the
 * schema `.check` methods for each specific GeoJSON schema, so this is just here for some
 * initial filtering of obviously invalid bbox values.
 */
export const GeoJSONBBoxGenericSchema = <P extends GeoJSONAnyPosition>(
    positionSchema: z.ZodType<P>,
): GeoJSONBBoxGenericSchemaType<P> => {
    // If the position is relaxed we assume either 2D or 3D bbox
    if (positionSchema instanceof z.ZodArray) {
        return _2DOr3DBBoxSchema as unknown as z.ZodType<GeoJSONBBoxGeneric<P>>;
    }
    // If the position is a tuple, we can infer the dimension from its length
    if (positionSchema instanceof z.ZodTuple) {
        const itemCount = positionSchema.def.items.length;
        return z
            .number()
            .array()
            .length(itemCount * 2) as unknown as z.ZodType<GeoJSONBBoxGeneric<P>>;
    }
    // If the position is not a tuple, we can't infer the dimension, so we return a simple number array
    return z.number().array() as unknown as z.ZodType<GeoJSONBBoxGeneric<P>>;
};
export type GeoJSONBBoxGeneric<P extends GeoJSONAnyPosition> = z.infer<ReturnType<typeof GeoJSONBBoxGenericSchema<P>>>;

export const GeoJSON2DBBoxSchema = GeoJSONBBoxGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DBBox = z.infer<typeof GeoJSON2DBBoxSchema>;

export const GeoJSON3DBBoxSchema = GeoJSONBBoxGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DBBox = z.infer<typeof GeoJSON3DBBoxSchema>;

export const GeoJSONBBoxSchema = GeoJSONBBoxGenericSchema(GeoJSONPositionSchema);
export type GeoJSONBBox = z.infer<typeof GeoJSONBBoxSchema>;
