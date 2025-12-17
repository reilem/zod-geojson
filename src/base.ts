import * as z from "zod/v4";
import { GeoJSONBboxGenericSchema, GeoJSONBboxGenericSchemaType } from "./bbox";
import { GeoJSONAnyPosition } from "./geometry/position";

export type GeoJSONBaseSchemaShape<P extends GeoJSONAnyPosition> = {
    bbox: z.ZodOptional<GeoJSONBboxGenericSchemaType<P>>;
};

export type GeoJSONBaseSchemaType<P extends GeoJSONAnyPosition> = z.ZodObject<GeoJSONBaseSchemaShape<P>>;

export const GeoJSONBaseSchema = <P extends GeoJSONAnyPosition>(
    positionSchema: z.ZodType<P>,
): GeoJSONBaseSchemaType<P> =>
    z.object({
        bbox: GeoJSONBboxGenericSchema(positionSchema).optional(),
    });
