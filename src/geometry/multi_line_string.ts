import { z } from "zod";
import { GeoJSONBaseSchema, validGeometryKeys } from "./_helper";
import { GeoJSONLineStringCoordinatesSchema } from "./line_string";

export const GeoJSONMultiLineStringSchema = GeoJSONBaseSchema.extend({
    type: z.literal("MultiLineString"),
    coordinates: z.array(GeoJSONLineStringCoordinatesSchema),
})
    .passthrough()
    .refine(validGeometryKeys);

export type GeoJSONMultiLineString = z.infer<typeof GeoJSONMultiLineStringSchema>;
