import { z } from "zod";
import { INVALID_BBOX_ISSUE, validBboxForPositionGrid } from "./_bbox_helpers";
import { INVALID_DIMENSIONS_ISSUE, validDimensionsForPositionGrid } from "./_dimension_helpers";
import { GeoJSONBaseSchema, INVALID_KEYS_ISSUE, validGeometryKeys } from "./_helper";
import { GeoJSONLineStringCoordinatesSchema } from "./line_string";

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

        if (!validDimensionsForPositionGrid(val)) {
            ctx.addIssue(INVALID_DIMENSIONS_ISSUE);
            return;
        }
        if (!validBboxForPositionGrid(val)) {
            ctx.addIssue(INVALID_BBOX_ISSUE);
            return;
        }
    });

export type GeoJSONMultiLineString = z.infer<typeof GeoJSONMultiLineStringSchema>;
