import { GeoJSONPosition } from "../position";
import { ValidatableCollection, ValidatableGeometry } from "./types";

export const INVALID_DIMENSIONS_ISSUE = {
    code: "custom" as const,
    message: "Invalid dimensions. All positions in the geometry must have the same dimension.",
};

export const INVALID_GEOMETRY_COLLECTION_DIMENSION_ISSUE = {
    code: "custom" as const,
    message: "Invalid geometry collection dimensions. All geometries must have the same dimension.",
};

export function validDimensionsForPositionList({ coordinates }: { coordinates: GeoJSONPosition[] }): boolean {
    const dimension = coordinates[0].length;
    return sameDimensionsForPositions(dimension)(coordinates);
}

export function validDimensionsForPositionGrid({ coordinates }: { coordinates: GeoJSONPosition[][] }): boolean {
    let dimension = coordinates[0][0].length;
    return sameDimensionsForPositionGrid(dimension)(coordinates);
}

export function validDimensionsForPositionGridList({ coordinates }: { coordinates: GeoJSONPosition[][][] }): boolean {
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

function sameDimensionsForPosition(dimension: number): (position: GeoJSONPosition) => boolean {
    return (position) => position.length === dimension;
}

function sameDimensionsForPositions(dimension: number): (positions: GeoJSONPosition[]) => boolean {
    return (positions) => positions.every(sameDimensionsForPosition(dimension));
}

function sameDimensionsForPositionGrid(dimension: number): (positionGrid: GeoJSONPosition[][]) => boolean {
    return (positionGrid) => positionGrid.every(sameDimensionsForPositions(dimension));
}

function sameDimensionsForPositionGrids(dimension: number): (positionGrids: GeoJSONPosition[][][]) => boolean {
    return (positionGrids) => positionGrids.every(sameDimensionsForPositionGrid(dimension));
}
