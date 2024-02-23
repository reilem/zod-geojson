import { z } from "zod";
import { INVALID_BBOX_ISSUE, validBboxForPositionGridList } from "./validation/bbox";
import { INVALID_DIMENSIONS_ISSUE, validDimensionsForPositionGridList } from "./validation/dimension";
import { INVALID_KEYS_ISSUE, validGeometryKeys } from "./validation/keys";
import { GeoJSONPolygonCoordinatesSchema, validPolygonRings } from "./polygon";
import { GeoJSONBaseSchema } from "../base";

const INVALID_LINEAR_RING_MESSAGE = {
    code: "custom" as const,
    message: "Invalid multi polygon. Each polygon inside the multi polygon must be made out of linear rings.",
};

function validMultiPolygonLinearRings({ coordinates }: { coordinates: number[][][][] }) {
    return coordinates.every((polygon) => validPolygonRings({ coordinates: polygon }));
}

export const GeoJSONMultiPolygonSchema = GeoJSONBaseSchema.extend({
    type: z.literal("MultiPolygon"),
    coordinates: z.array(GeoJSONPolygonCoordinatesSchema).min(1),
})
    .passthrough()
    .superRefine((val, ctx) => {
        if (!validGeometryKeys(val)) {
            ctx.addIssue(INVALID_KEYS_ISSUE);
            return;
        }
        // Skip remaining checks if coordinates array is empty
        if (!val.coordinates.length) {
            return;
        }

        if (!validDimensionsForPositionGridList(val)) {
            ctx.addIssue(INVALID_DIMENSIONS_ISSUE);
            return;
        }

        if (!validMultiPolygonLinearRings(val)) {
            ctx.addIssue(INVALID_LINEAR_RING_MESSAGE);
            return;
        }

        if (!validBboxForPositionGridList(val)) {
            ctx.addIssue(INVALID_BBOX_ISSUE);
            return;
        }
    });

export type GeoJSONMultiPolygon = z.infer<typeof GeoJSONMultiPolygonSchema>;
