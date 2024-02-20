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
