import { z } from "zod";
import { GeoJSONBBoxSchema } from "./bbox";

export const GeoJSONBaseSchema = z.object({
    bbox: GeoJSONBBoxSchema.optional(),
});
