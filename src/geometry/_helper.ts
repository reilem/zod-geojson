import { z } from "zod";
import { GeoJSONBBoxSchema } from "../bbox";

export const GeoJSONBaseSchema = z.object({
    bbox: GeoJSONBBoxSchema.optional(),
});

export function validGeometryKeys(geometry: Record<string, unknown>): boolean {
    return (
        !("geometry" in geometry) &&
        !("properties" in geometry) &&
        !("features" in geometry) &&
        !("geometries" in geometry)
    );
}

export function bboxEquals(bbox1: number[], bbox2: number[]): boolean {
    if (bbox1.length !== bbox2.length) {
        return false;
    }
    return bbox1.every((value, index) => value === bbox2[index]);
}

/**
 * NOTE: Mutates the given bbox. Performance optimisation to avoid unnecessary copies.
 */
export function updateBboxForPositions(currentBbox: number[], positions: number[][]): void {
    for (let i = 0; i < positions.length; i++) {
        updateBboxForPosition(currentBbox, positions[i]);
    }
}

/**
 * NOTE: Mutates the given bbox. Performance optimisation to avoid unnecessary copies.
 */
export function updateBboxForPosition(currentBbox: number[], position: number[]): void {
    const dimension = position.length;
    for (let i = 0; i < dimension; i++) {
        const value = position[i];
        const iMin = currentBbox[i];
        const iMax = currentBbox[i + dimension];
        if (iMin === undefined || value < iMin) {
            currentBbox[i] = value;
        }
        if (iMax === undefined || value > iMax) {
            currentBbox[i + dimension] = value;
        }
    }
}

export const INVALID_KEYS_ISSUE = {
    code: "custom" as const,
    message: 'GeoJSON geometry object cannot have "geometry", "properties", "features", or "geometries" keys',
};

export const INVALID_DIMENSIONS_ISSUE = {
    code: "custom" as const,
    message: "Invalid dimensions. All positions in the geometry must have the same dimension.",
};

export const INVALID_BBOX_ISSUE = {
    code: "custom" as const,
    message:
        "Invalid bbox. Bbox length must be 2 * n, where n is the dimension of the geometry. Bbox must be a valid extent for the geometry.",
};
