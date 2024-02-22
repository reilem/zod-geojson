import { GeoJSONGeometry } from "./index";

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

export function getDimensionForGeometry(geometry: GeoJSONGeometry): number {
    switch (geometry.type) {
        case "Point":
            return geometry.coordinates.length;
        case "MultiPoint":
        case "LineString":
            return geometry.coordinates[0].length;
        case "MultiLineString":
        case "Polygon":
            return geometry.coordinates[0][0].length;
        case "MultiPolygon":
            return geometry.coordinates[0][0][0].length;
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

export const INVALID_DIMENSIONS_ISSUE = {
    code: "custom" as const,
    message: "Invalid dimensions. All positions in the geometry must have the same dimension.",
};
