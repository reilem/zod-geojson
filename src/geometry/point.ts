import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import { validBboxForPosition } from "./_bbox_helpers";
import { GeoJSONBaseSchema, INVALID_BBOX_ISSUE, INVALID_KEYS_ISSUE, validGeometryKeys } from "./_helper";

export const GeoJSONPointSchema = GeoJSONBaseSchema.extend({
    type: z.literal("Point"),
    coordinates: GeoJSONPositionSchema,
})
    .passthrough()
    .superRefine((val, ctx) => {
        if (!validGeometryKeys(val)) {
            ctx.addIssue(INVALID_KEYS_ISSUE);
        }
        // Skip remaining checks if coordinates empty
        if (!val.coordinates.length) return;

        if (!validBboxForPosition(val)) {
            ctx.addIssue(INVALID_BBOX_ISSUE);
        }
    });

export type GeoJSONPoint = z.infer<typeof GeoJSONPointSchema>;
