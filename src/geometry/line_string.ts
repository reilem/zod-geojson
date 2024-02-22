import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import { INVALID_DIMENSIONS_ISSUE, validDimensionsForPositionList } from "./_dimension_helpers";
import { GeoJSONBaseSchema, INVALID_KEYS_ISSUE, validGeometryKeys } from "./_helper";
import { INVALID_BBOX_ISSUE, validBboxForPositionList } from "./_bbox_helpers";

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

        if (!validDimensionsForPositionList(val)) {
            ctx.addIssue(INVALID_DIMENSIONS_ISSUE);
            return;
        }
        if (!validBboxForPositionList(val)) {
            ctx.addIssue(INVALID_BBOX_ISSUE);
            return;
        }
    });

export const GeoJSONLineStringCoordinatesSchema = GeoJSONLineStringSchema.innerType().shape.coordinates;

export type GeoJSONLineString = z.infer<typeof GeoJSONLineStringSchema>;
