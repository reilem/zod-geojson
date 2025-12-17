import { GeoJSONGeometryEnumType } from "../type";

/**
 * The bare essential types required to validate geometries
 * Mainly used to prevent circular dependencies between geometry type definitions and validation functions
 */

export type ValidatableCoordinate = {
    type: GeoJSONGeometryEnumType["Point"];
    bbox?: number[] | null;
    coordinates?: number[] | null;
};
export type ValidatableList = {
    type: GeoJSONGeometryEnumType["MultiPoint"] | GeoJSONGeometryEnumType["LineString"];
    bbox?: number[] | null;
    coordinates?: number[][] | null;
};
export type ValidatableGrid = {
    type: GeoJSONGeometryEnumType["MultiLineString"] | GeoJSONGeometryEnumType["Polygon"];
    bbox?: number[] | null;
    coordinates?: number[][][] | null;
};
export type ValidatableGridList = {
    type: GeoJSONGeometryEnumType["MultiPolygon"];
    bbox?: number[] | null;
    coordinates?: number[][][][] | null;
};

export type ValidatableCollection = {
    type: GeoJSONGeometryEnumType["GeometryCollection"];
    geometries: ValidatableGeometry[];
    bbox?: number[] | null;
};

export type ValidatableGeometry =
    | ValidatableCoordinate
    | ValidatableList
    | ValidatableGrid
    | ValidatableGridList
    | ValidatableCollection;
