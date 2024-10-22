import { getDimensionForGeometry } from "../geometry/validation/dimension";
import { getGeometries, ValidatableFeatureCollection } from "./types";

export const INVALID_FEATURE_COLLECTION_DIMENSIONS_ISSUE = {
    code: "custom" as const,
    message: "Invalid dimensions. All features in feature collection must have the same dimension.",
};

export function validDimensionsForFeatureCollection(collection: ValidatableFeatureCollection): boolean {
    const geometries = getGeometries(collection);
    const dimension = getDimensionForGeometry(geometries[0]);
    return geometries.slice(1).every((geometry) => getDimensionForGeometry(geometry) === dimension);
}
