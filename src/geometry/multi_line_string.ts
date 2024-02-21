import { z } from "zod";
import {
    bboxEquals,
    GeoJSONBaseSchema,
    INVALID_BBOX_ISSUE,
    INVALID_DIMENSIONS_ISSUE,
    INVALID_KEYS_ISSUE,
    updateBboxForPositions,
    validGeometryKeys,
} from "./_helper";
import { GeoJSONLineStringCoordinatesSchema } from "./line_string";

function validMultiLineStringDimensions({ coordinates }: { coordinates: number[][][] }): boolean {
    if (coordinates.length === 0) return true;
    let dimension = coordinates[0][0].length;
    return coordinates.every((ring) => ring.every((position) => position.length === dimension));
}

function validMultiLineStringBbox({ bbox, coordinates }: { bbox?: number[]; coordinates: number[][][] }): boolean {
    if (bbox == null) {
        return true;
    }
    const dimension = coordinates[0][0].length;
    if (bbox.length !== 2 * dimension) {
        return false;
    }
    const expectedBbox: number[] = [];
    const coordinatesLen = coordinates.length;
    for (let i = 0; i < coordinatesLen; i++) {
        updateBboxForPositions(expectedBbox, coordinates[i]);
    }
    return bboxEquals(bbox, expectedBbox);
}

export const GeoJSONMultiLineStringSchema = GeoJSONBaseSchema.extend({
    type: z.literal("MultiLineString"),
    coordinates: z.array(GeoJSONLineStringCoordinatesSchema),
})
    .passthrough()
    .superRefine((val, ctx) => {
        if (!validGeometryKeys(val)) {
            ctx.addIssue(INVALID_KEYS_ISSUE);
            return;
        }
        // Skip remaining checks if coordinates array is empty
        if (!val.coordinates.length) return;

        if (!validMultiLineStringDimensions(val)) {
            ctx.addIssue(INVALID_DIMENSIONS_ISSUE);
            return;
        }
        if (!validMultiLineStringBbox(val)) {
            ctx.addIssue(INVALID_BBOX_ISSUE);
            return;
        }
    });

export type GeoJSONMultiLineString = z.infer<typeof GeoJSONMultiLineStringSchema>;
