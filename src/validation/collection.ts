import { GeoJSONBbox } from "../bbox";
import { GeoJSONFeature } from "../feature";
import { GeoJSONGeometry } from "../geometry";
import { bboxEquals, getBboxForGeometries } from "../geometry/validation/bbox";
import { getDimensionForGeometry } from "../geometry/validation/dimension";

export type ValidatableGeoJSONFeatureCollection = { features: GeoJSONFeature[]; bbox?: GeoJSONBbox };

export const INVALID_FEATURE_COLLECTION_DIMENSIONS_ISSUE = {
    code: "custom" as const,
    message: "Invalid dimensions. All features in feature collection must have the same dimension.",
};

export function validFeatureCollectionBbox({ features, bbox }: ValidatableGeoJSONFeatureCollection) {
    if (!bbox) {
        return true;
    }
    const expectedBbox = getBboxForGeometries(getGeometries({ features }));
    return bboxEquals(expectedBbox, bbox);
}

function getGeometries({ features }: ValidatableGeoJSONFeatureCollection): GeoJSONGeometry[] {
    return features.map((feature) => feature.geometry).filter((x): x is GeoJSONGeometry => x != null);
}

export function validFeatureCollectionDimensions(collection: ValidatableGeoJSONFeatureCollection): boolean {
    const geometries = getGeometries(collection);
    const dimension = getDimensionForGeometry(geometries[0]);
    return geometries.slice(1).every((geometry) => getDimensionForGeometry(geometry) === dimension);
}
