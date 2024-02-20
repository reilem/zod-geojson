// TODO: needs to work for multiple dimensions
import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import { GeoJSONBaseSchema, validGeometryKeys } from "./_helper";

export function validPointBbox(geometry: { bbox?: number[]; coordinates: number[] }): boolean {
    if (!geometry.bbox) return true;
    const [minX, minY, maxX, maxY] = geometry.bbox;
    const x = geometry.coordinates[0];
    const y = geometry.coordinates[1];
    return minX === x && minY === y && maxX === x && maxY === y;
}

export const GeoJSONPointSchema = GeoJSONBaseSchema.extend({
    type: z.literal("Point"),
    coordinates: GeoJSONPositionSchema,
})
    .passthrough()
    .refine(validGeometryKeys)
    .refine(validPointBbox);

export type GeoJSONPoint = z.infer<typeof GeoJSONPointSchema>;
