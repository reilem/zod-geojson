// TODO: Refine that all line strings are linear rings (first and last position are the same)
import { z } from "zod";
import { GeoJSONBaseSchema } from "./_helper";
import { GeoJSONPolygonCoordinatesSchema } from "./polygon";

export const GeoJSONMultiPolygonSchema = GeoJSONBaseSchema.extend({
    type: z.literal("MultiPolygon"),
    coordinates: z.array(GeoJSONPolygonCoordinatesSchema),
}).passthrough();

export type GeoJSONMultiPolygon = z.infer<typeof GeoJSONMultiPolygonSchema>;
