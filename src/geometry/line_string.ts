import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import {
    bboxEquals,
    GeoJSONBaseSchema,
    INVALID_BBOX_ISSUE,
    INVALID_DIMENSIONS_ISSUE,
    INVALID_KEYS_ISSUE,
    validGeometryKeys,
} from "./_helper";

function validLineStringDimensions({ coordinates }: { coordinates: number[][] }): boolean {
    const coordinatesLen = coordinates.length;
    const dimension = coordinates[0].length;
    for (let i = 1; i < coordinatesLen; i++) {
        if (coordinates[i].length !== dimension) return false;
    }
    return true;
}

function validLineStringBbox({ bbox, coordinates }: { bbox?: number[]; coordinates: number[][] }): boolean {
    if (!bbox) return true;

    const dimension = coordinates[0].length;
    if (bbox.length !== dimension * 2) return false;

    const expectedBbox: number[] = [];
    const coordinatesLen = coordinates.length;
    for (let j = 0; j < coordinatesLen; j++) {
        const position = coordinates[j];
        for (let i = 0; i < dimension; i++) {
            const value = position[i];
            const iMin = expectedBbox[i];
            const iMax = expectedBbox[i + dimension];
            if (iMin === undefined || value < iMin) {
                expectedBbox[i] = value;
            }
            if (iMax === undefined || value > iMax) {
                expectedBbox[i + dimension] = value;
            }
        }
    }
    return bboxEquals(bbox, expectedBbox);
}

export const GeoJSONLineStringSchema = GeoJSONBaseSchema.extend({
    type: z.literal("LineString"),
    coordinates: z.array(GeoJSONPositionSchema).min(2),
})
    .passthrough()
    .superRefine((val, ctx) => {
        if (!validGeometryKeys(val)) {
            ctx.addIssue(INVALID_KEYS_ISSUE);
            return;
        }

        // Skip remaining checks if coordinates empty
        if (!val.coordinates.length) return;

        if (!validLineStringDimensions(val)) {
            ctx.addIssue(INVALID_DIMENSIONS_ISSUE);
            return;
        }
        if (!validLineStringBbox(val)) {
            ctx.addIssue(INVALID_BBOX_ISSUE);
            return;
        }
    });

export const GeoJSONLineStringCoordinatesSchema = GeoJSONLineStringSchema.innerType().shape.coordinates;

export type GeoJSONLineString = z.infer<typeof GeoJSONLineStringSchema>;