import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import {
    bboxEquals,
    GeoJSONBaseSchema,
    INVALID_BBOX_ISSUE,
    INVALID_DIMENSIONS_ISSUE,
    INVALID_KEYS_ISSUE,
    updateBboxForPositions,
    validGeometryKeys,
} from "./_helper";

function validMultiPointDimensions({ coordinates }: { coordinates: number[][] }): boolean {
    const coordinatesLen = coordinates.length;
    const dimension = coordinates[0].length;
    for (let i = 1; i < coordinatesLen; i++) {
        if (coordinates[i].length !== dimension) return false;
    }
    return true;
}

function validMultiPointBbox({ bbox, coordinates }: { bbox?: number[]; coordinates: number[][] }): boolean {
    if (!bbox) return true;

    const dimension = coordinates[0].length;
    if (bbox.length !== dimension * 2) return false;

    const expectedBbox: number[] = [];
    updateBboxForPositions(expectedBbox, coordinates);
    return bboxEquals(bbox, expectedBbox);
}

export const GeoJSONMultiPointSchema = GeoJSONBaseSchema.extend({
    type: z.literal("MultiPoint"),
    coordinates: z.array(GeoJSONPositionSchema).min(1),
})
    .passthrough()
    .superRefine((val, ctx) => {
        if (!validGeometryKeys(val)) {
            ctx.addIssue(INVALID_KEYS_ISSUE);
            return;
        }
        // Skip remaining checks if coordinates empty
        if (!val.coordinates.length) return;

        if (!validMultiPointDimensions(val)) {
            ctx.addIssue(INVALID_DIMENSIONS_ISSUE);
            return;
        }
        if (!validMultiPointBbox(val)) {
            ctx.addIssue(INVALID_BBOX_ISSUE);
            return;
        }
    });

export type GeoJSONMultiPoint = z.infer<typeof GeoJSONMultiPointSchema>;
