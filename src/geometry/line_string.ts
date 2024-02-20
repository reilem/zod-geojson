import { z } from "zod";
import { GeoJSONPositionSchema } from "../position";
import {
    GeoJSONBaseSchema,
    INVALID_BBOX_MESSAGE,
    INVALID_DIMENSIONS_MESSAGE,
    INVALID_KEYS_MESSAGE,
    validGeometryKeys,
} from "./_helper";

function validLineStringPointDimensions({ coordinates }: { coordinates: number[][] }): boolean {
    const dimension = coordinates[0].length;
    for (let i = 1; i < coordinates.length; i++) {
        if (coordinates[i].length !== dimension) return false;
    }
    return true;
}

function validLineStringBbox({ bbox, coordinates }: { bbox?: number[]; coordinates: number[][] }): boolean {
    if (bbox == null) return true;
    const dimension = coordinates[0].length;
    if (bbox.length !== dimension * 2) return false;
    for (let position of coordinates) {
        for (let i = 0; i < dimension; i++) {
            if (position[i] < bbox[i] || position[i] > bbox[i + dimension]) return false;
        }
    }
    return true;
}

export const GeoJSONLineStringSchema = GeoJSONBaseSchema.extend({
    type: z.literal("LineString"),
    coordinates: z.array(GeoJSONPositionSchema).min(2),
})
    .passthrough()
    .refine(validGeometryKeys, INVALID_KEYS_MESSAGE)
    .refine(validLineStringPointDimensions, INVALID_DIMENSIONS_MESSAGE)
    .refine(validLineStringBbox, INVALID_BBOX_MESSAGE);

export const GeoJSONLineStringCoordinatesSchema = GeoJSONLineStringSchema.innerType().innerType().innerType()
    .shape.coordinates;

export type GeoJSONLineString = z.infer<typeof GeoJSONLineStringSchema>;
