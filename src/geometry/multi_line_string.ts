import { z } from "zod";
import { GeoJSONBaseSchema, validGeometryKeys } from "./_helper";
import { GeoJSONLineStringSchema } from "./line_string";

export const GeoJSONMultiLineStringSchema = GeoJSONBaseSchema.extend({
    type: z.literal("MultiLineString"),
    coordinates: z.array(GeoJSONLineStringSchema.innerType().shape.coordinates),
})
    .passthrough()
    .refine(validGeometryKeys);

export type GeoJSONMultiLineString = z.infer<typeof GeoJSONMultiLineStringSchema>;
