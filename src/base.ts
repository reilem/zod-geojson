import { z } from "zod";
import { GeoJSONBboxGenericSchema, GeoJSONBboxSchemaType, GeoJSONBboxGeneric } from "./bbox";
import { GeoJSONPosition } from "./geometry/position";

export type GeoJSONBase<P extends GeoJSONPosition> = {
    bbox?: GeoJSONBboxGeneric<P>;
};

export type GeoJSONBaseSchemaInnerType<P extends GeoJSONPosition> = {
    bbox: z.ZodOptional<GeoJSONBboxSchemaType<P>>;
};

export type GeoJSONBaseSchemaType<P extends GeoJSONPosition> = z.ZodObject<
    GeoJSONBaseSchemaInnerType<P>,
    "strip",
    z.ZodTypeAny,
    GeoJSONBase<P>,
    GeoJSONBase<P>
>;

export const GeoJSONBaseSchema = <P extends GeoJSONPosition>(
    positionSchema: z.ZodSchema<P>,
): GeoJSONBaseSchemaType<P> =>
    z.object({
        bbox: GeoJSONBboxGenericSchema(positionSchema).optional(),
    });
