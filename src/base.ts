import * as z from "zod/v4";
import { GeoJSONBboxGenericSchema } from "./bbox";
import { GeoJSONAnyPosition } from "./geometry/position";

export const GeoJSONBaseSchema = <P extends GeoJSONAnyPosition>(positionSchema: z.ZodType<P>) =>
    z.looseObject({
        bbox: GeoJSONBboxGenericSchema(positionSchema).optional(),
    });
