/**
 * The bare essential types required to validate features & feature collections
 * This is split off to prevent circular dependencies between feature type definitions and validation functions
 */

import { ValidatableCollection, ValidatableGeometry } from "../geometry/validation/types";

export type ValidatableFeature = {
    bbox?: number[] | null;
    geometry?: ValidatableGeometry | ValidatableCollection | null;
};

export type ValidatableFeatureCollection = {
    bbox?: number[] | null;
    features?: ValidatableFeature[] | null;
};

export function getGeometries({ features }: Pick<ValidatableFeatureCollection, "features">): ValidatableGeometry[] {
    return features?.map((feature) => feature.geometry).filter((x): x is ValidatableGeometry => x != null) ?? [];
}
