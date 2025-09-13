import { z } from "zod/v4";
import { GeoJSONBboxGenericSchema } from "./bbox";
import { GeoJSONPosition } from "./geometry/position";

export const GeoJSONBaseSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    z.looseObject({
        bbox: GeoJSONBboxGenericSchema(positionSchema).optional(),
    });
