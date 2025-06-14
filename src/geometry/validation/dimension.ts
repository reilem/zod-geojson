import type { z } from "zod/v4";
import { ValidatableCollection, ValidatableGeometry } from "./types";

export const getInvalidDimensionIssue = (ctx: z.core.ParsePayload): z.core.$ZodRawIssue => ({
    code: "custom" as const,
    message: "Invalid dimensions. All positions in the geometry must have the same dimension.",
    input: ctx.value,
    continue: true,
});

export const getInvalidGeometryCollectionDimensionIssue = (ctx: z.core.ParsePayload): z.core.$ZodRawIssue => ({
    code: "custom" as const,
    message: "Invalid geometry collection dimensions. All geometries must have the same dimension.",
    input: ctx.value,
    continue: true,
});

export function validDimensionsForPositionList({ coordinates }: { coordinates: number[][] }): boolean {
    const dimension = coordinates[0].length;
    return sameDimensionsForPositions(dimension)(coordinates);
}

export function validDimensionsForPositionGrid({ coordinates }: { coordinates: number[][][] }): boolean {
    let dimension = coordinates[0][0].length;
    return sameDimensionsForPositionGrid(dimension)(coordinates);
}

export function validDimensionsForPositionGridList({ coordinates }: { coordinates: number[][][][] }): boolean {
    let dimension = coordinates[0][0][0].length;
    return sameDimensionsForPositionGrids(dimension)(coordinates);
}

export function validDimensionsForCollection({ geometries }: ValidatableCollection): boolean {
    if (geometries == null) return false;
    let dimension = getDimensionForGeometry(geometries[0]);
    return geometries.slice(1).every((geometry) => getDimensionForGeometry(geometry) === dimension);
}

export function getDimensionForGeometry(geometry: ValidatableGeometry): number {
    switch (geometry.type) {
        case "Point":
            return geometry.coordinates?.length ?? 0;
        case "MultiPoint":
        case "LineString":
            return geometry.coordinates?.[0].length ?? 0;
        case "MultiLineString":
        case "Polygon":
            return geometry.coordinates?.[0][0].length ?? 0;
        case "MultiPolygon":
            return geometry.coordinates?.[0][0][0].length ?? 0;
        case "GeometryCollection":
            return getDimensionForGeometry(geometry.geometries[0]);
    }
}

function sameDimensionsForPosition(dimension: number): (position: number[]) => boolean {
    return (position) => position.length === dimension;
}

function sameDimensionsForPositions(dimension: number): (positions: number[][]) => boolean {
    return (positions) => positions.every(sameDimensionsForPosition(dimension));
}

function sameDimensionsForPositionGrid(dimension: number): (positionGrid: number[][][]) => boolean {
    return (positionGrid) => positionGrid.every(sameDimensionsForPositions(dimension));
}

function sameDimensionsForPositionGrids(dimension: number): (positionGrids: number[][][][]) => boolean {
    return (positionGrids) => positionGrids.every(sameDimensionsForPositionGrid(dimension));
}
