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
