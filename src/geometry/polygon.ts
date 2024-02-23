import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import { INVALID_BBOX_ISSUE, validBboxForPositionGrid } from "./validation/bbox";
import { INVALID_DIMENSIONS_ISSUE, validDimensionsForPositionGrid } from "./validation/dimension";
import { INVALID_KEYS_ISSUE, validGeometryKeys } from "./validation/keys";
import { GeoJSONBaseSchema } from "../base";

const INVALID_LINEAR_RING_MESSAGE = {
    code: "custom" as const,
    message: "Invalid polygon. Each ring inside a polygon must form a linear ring.",
};

function validLinearRing(linearRing: number[][]): boolean {
    const firstPosition = linearRing[0];
    const lastPosition = linearRing[linearRing.length - 1];
    const dimension = firstPosition.length;
    for (let i = 0; i < dimension; i++) {
        if (firstPosition[i] !== lastPosition[i]) {
            return false;
        }
    }
    return true;
}

export function validPolygonRings({ coordinates: rings }: { coordinates: number[][][] }): boolean {
    return rings.every(validLinearRing);
}

export const GeoJSONPolygonSchema = GeoJSONBaseSchema.extend({
    type: z.literal("Polygon"),
    coordinates: z.array(z.array(GeoJSONPositionSchema).min(4)),
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

        if (!validDimensionsForPositionGrid(val)) {
            ctx.addIssue(INVALID_DIMENSIONS_ISSUE);
            return;
        }
        if (!validPolygonRings(val)) {
            ctx.addIssue(INVALID_LINEAR_RING_MESSAGE);
            return;
        }
        if (!validBboxForPositionGrid(val)) {
            ctx.addIssue(INVALID_BBOX_ISSUE);
            return;
        }
    });

export const GeoJSONPolygonCoordinatesSchema = GeoJSONPolygonSchema.innerType().shape.coordinates;

export type GeoJSONPolygon = z.infer<typeof GeoJSONPolygonSchema>;
