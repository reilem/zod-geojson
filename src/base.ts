import * as z from "zod/v4";
import { GeoJSONBBoxGenericSchema, GeoJSONBBoxGenericSchemaType } from "./bbox";
import { GeoJSONAnyPosition } from "./geometry/position";

export type GeoJSONBaseSchemaShape<P extends GeoJSONAnyPosition> = {
    bbox: z.ZodOptional<GeoJSONBBoxGenericSchemaType<P>>;
};

export type GeoJSONBaseSchemaType<P extends GeoJSONAnyPosition> = z.ZodObject<GeoJSONBaseSchemaShape<P>>;

export const GeoJSONBaseSchema = <P extends GeoJSONAnyPosition>(
    positionSchema: z.ZodType<P>,
): GeoJSONBaseSchemaType<P> =>
    z.object({
        bbox: GeoJSONBBoxGenericSchema(positionSchema).optional(),
    });
