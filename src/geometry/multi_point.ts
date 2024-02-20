import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import { GeoJSONBaseSchema, validGeometryKeys } from "./_helper";

export const GeoJSONMultiPointSchema = GeoJSONBaseSchema.extend({
    type: z.literal("MultiPoint"),
    coordinates: z.array(GeoJSONPositionSchema),
})
    .passthrough()
    .refine(validGeometryKeys);

export type GeoJSONMultiPoint = z.infer<typeof GeoJSONMultiPointSchema>;
