import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import { validBboxForPositionGrid } from "./_bbox_helpers";
import {
    GeoJSONBaseSchema,
    INVALID_BBOX_ISSUE,
    INVALID_DIMENSIONS_ISSUE,
    INVALID_KEYS_ISSUE,
    validGeometryKeys,
} from "./_helper";

const INVALID_LINEAR_RING_MESSAGE = {
    code: "custom" as const,
    message: "Invalid polygon. Each ring inside a polygon must form a linear ring.",
};

function validPolygonDimensions({ coordinates }: { coordinates: number[][][] }): boolean {
    if (coordinates.length === 0) return true;
    let dimension = coordinates[0][0].length;
    return coordinates.every((ring) => ring.every((position) => position.length === dimension));
}

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

function validPolygonRings({ coordinates: rings }: { coordinates: number[][][] }): boolean {
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
        if (!val.coordinates.length) return;

        if (!validPolygonDimensions(val)) {
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
