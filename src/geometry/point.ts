// TODO: needs to work for multiple dimensions
import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import { GeoJSONBaseSchema, INVALID_BBOX_MESSAGE, INVALID_KEYS_MESSAGE, validGeometryKeys } from "./_helper";

function validPointBbox({ bbox, coordinates }: { bbox?: number[]; coordinates: number[] }): boolean {
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
    .refine(validGeometryKeys, INVALID_KEYS_MESSAGE)
    .refine(validPointBbox, INVALID_BBOX_MESSAGE);

export type GeoJSONPoint = z.infer<typeof GeoJSONPointSchema>;
