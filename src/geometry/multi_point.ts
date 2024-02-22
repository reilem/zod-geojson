import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import { validBboxForPositionList } from "./_bbox_helpers";
import {
    GeoJSONBaseSchema,
    INVALID_BBOX_ISSUE,
    INVALID_DIMENSIONS_ISSUE,
    INVALID_KEYS_ISSUE,
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
        if (!validBboxForPositionList(val)) {
            ctx.addIssue(INVALID_BBOX_ISSUE);
            return;
        }
    });

export type GeoJSONMultiPoint = z.infer<typeof GeoJSONMultiPointSchema>;
