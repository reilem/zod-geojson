import { GeoJSONBbox } from "../../bbox";
import { GeoJSONPosition } from "../../position";
import { GeoJSONGeometryEnumType } from "../helper/type";

/**
 * The bare essential types required to validate geometries
 * Mainly used to prevent circular dependencies between geometry type definitions and validation functions
 */

export type ValidatableCoordinate = {
    type: GeoJSONGeometryEnumType["Point"];
    bbox?: GeoJSONBbox | null;
    coordinates?: GeoJSONPosition | null;
};
export type ValidatableList = {
    type: GeoJSONGeometryEnumType["MultiPoint"] | GeoJSONGeometryEnumType["LineString"];
    bbox?: GeoJSONBbox | null;
    coordinates?: GeoJSONPosition[] | null;
};
export type ValidatableGrid = {
    type: GeoJSONGeometryEnumType["MultiLineString"] | GeoJSONGeometryEnumType["Polygon"];
    bbox?: GeoJSONBbox | null;
    coordinates?: GeoJSONPosition[][] | null;
};
export type ValidatableGridList = {
    type: GeoJSONGeometryEnumType["MultiPolygon"];
    bbox?: GeoJSONBbox | null;
    coordinates?: GeoJSONPosition[][][] | null;
};

export type ValidatableSimpleGeometry = ValidatableCoordinate | ValidatableList | ValidatableGrid | ValidatableGridList;

export type ValidatableCollection = {
    type: GeoJSONGeometryEnumType["GeometryCollection"];
    geometries: ValidatableSimpleGeometry[];
    bbox?: GeoJSONBbox | null;
};

export type ValidatableGeometry = ValidatableSimpleGeometry | ValidatableCollection;
