import { GeoJSONGeometryType } from "../type";

/**
 * The bare essential types required to validate geometries
 * Mainly used to prevent circular dependencies between geometry type definitions and validation functions
 */

export type ValidatableCoordinate = {
    type: typeof GeoJSONGeometryType.Point;
    bbox?: number[] | null;
    coordinates?: number[] | null;
};
export type ValidatableList = {
    type: typeof GeoJSONGeometryType.MultiPoint | typeof GeoJSONGeometryType.LineString;
    bbox?: number[] | null;
    coordinates?: number[][] | null;
};
export type ValidatableGrid = {
    type: typeof GeoJSONGeometryType.MultiLineString | typeof GeoJSONGeometryType.Polygon;
    bbox?: number[] | null;
    coordinates?: number[][][] | null;
};
export type ValidatableGridList = {
    type: typeof GeoJSONGeometryType.MultiPolygon;
    bbox?: number[] | null;
    coordinates?: number[][][][] | null;
};

export type ValidatableCollection = {
    type: typeof GeoJSONGeometryType.GeometryCollection;
    geometries: ValidatableGeometry[];
    bbox?: number[] | null;
};

export type ValidatableGeometry =
    | ValidatableCoordinate
    | ValidatableList
    | ValidatableGrid
    | ValidatableGridList
    | ValidatableCollection;
