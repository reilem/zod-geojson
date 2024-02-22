import { z } from "zod";
import { validBboxForPositionGrid } from "./_bbox_helpers";
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
        if (!validBboxForPositionGrid(val)) {
            ctx.addIssue(INVALID_BBOX_ISSUE);
            return;
        }
    });

export type GeoJSONMultiLineString = z.infer<typeof GeoJSONMultiLineStringSchema>;
