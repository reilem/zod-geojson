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

export type ValidatableSimpleGeometry = ValidatableCoordinate | ValidatableList | ValidatableGrid | ValidatableGridList;

export type ValidatableCollection = {
    type: GeoJSONGeometryEnumType["GeometryCollection"];
    geometries: ValidatableSimpleGeometry[];
    bbox?: number[] | null;
};

export type ValidatableGeometry = ValidatableSimpleGeometry | ValidatableCollection;
