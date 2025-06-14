import { z } from "zod/v4";
import { GeoJSONBboxGenericSchema, GeoJSONBboxSchemaType } from "./bbox";
import { GeoJSONPosition } from "./geometry/position";

export type GeoJSONBaseSchemaInnerType<P extends GeoJSONPosition> = {
    bbox: z.ZodOptional<GeoJSONBboxSchemaType<P>>;
};

export type GeoJSONBaseSchemaType<P extends GeoJSONPosition> = z.ZodObject<GeoJSONBaseSchemaInnerType<P>>;

export const GeoJSONBaseSchema = <P extends GeoJSONPosition>(
    positionSchema: z.ZodSchema<P>,
): GeoJSONBaseSchemaType<P> =>
    z.looseObject({
        bbox: GeoJSONBboxGenericSchema(positionSchema).optional(),
    });
