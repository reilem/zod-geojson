import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import { INVALID_BBOX_ISSUE, validBboxForPosition } from "./validation/bbox";
import { INVALID_KEYS_ISSUE, validGeometryKeys } from "./validation/keys";
import { GeoJSONBaseSchema } from "../base";

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
