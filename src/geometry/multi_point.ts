import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import { INVALID_BBOX_ISSUE, validBboxForPositionList } from "./_bbox_helpers";
import { INVALID_DIMENSIONS_ISSUE, validDimensionsForPositionList } from "./_dimension_helpers";
import { GeoJSONBaseSchema, INVALID_KEYS_ISSUE, validGeometryKeys } from "./_helper";

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

        if (!validDimensionsForPositionList(val)) {
            ctx.addIssue(INVALID_DIMENSIONS_ISSUE);
            return;
        }
        if (!validBboxForPositionList(val)) {
            ctx.addIssue(INVALID_BBOX_ISSUE);
            return;
        }
    });

export type GeoJSONMultiPoint = z.infer<typeof GeoJSONMultiPointSchema>;
