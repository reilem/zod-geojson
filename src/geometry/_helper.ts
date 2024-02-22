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
