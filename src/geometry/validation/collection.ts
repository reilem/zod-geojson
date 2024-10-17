import { GeoJSONGeometry } from "../index";
import { bboxEquals, getBboxForGeometries } from "./bbox";
import { getDimensionForGeometry } from "./dimension";

export type ValidatableGeometryCollection = { geometries: GeoJSONGeometry[]; bbox?: number[] };

export const INVALID_GEOMETRY_COLLECTION_DIMENSION_ISSUE = {
    code: "custom" as const,
    message: "Invalid geometry collection dimensions. All geometries must have the same dimension.",
};

export function validGeometryCollectionDimension({ geometries }: ValidatableGeometryCollection): boolean {
    if (geometries == null) return false;
    let dimension = getDimensionForGeometry(geometries[0]);
    return geometries.slice(1).every((geometry) => getDimensionForGeometry(geometry) === dimension);
}

export function validGeometryCollectionBbox({ bbox, geometries }: ValidatableGeometryCollection): boolean {
    if (!bbox) {
        return true;
    }
    const expectedBbox = getBboxForGeometries(geometries);
    return bboxEquals(bbox, expectedBbox);
}
