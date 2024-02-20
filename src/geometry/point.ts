// TODO: needs to work for multiple dimensions
import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import { GeoJSONBaseSchema, validGeometryKeys } from "./_helper";

export function validPointBbox({ bbox, coordinates }: { bbox?: number[]; coordinates: number[] }): boolean {
    if (!bbox) return true;
    const dimension = coordinates.length;
    if (bbox.length !== dimension * 2) return false;
    for (let i = 0; i < bbox.length; i++) {
        if (bbox[i] !== coordinates[i % dimension]) return false;
    }
    return true;
}

export const GeoJSONPointSchema = GeoJSONBaseSchema.extend({
    type: z.literal("Point"),
    coordinates: GeoJSONPositionSchema,
})
    .passthrough()
    .refine(validGeometryKeys)
    .refine(validPointBbox);

export type GeoJSONPoint = z.infer<typeof GeoJSONPointSchema>;
