import { bboxEquals, getBBoxForGeometries, getBBoxForGeometry } from "../geometry/validation/bbox";
import { getGeometries, ValidatableFeature, ValidatableFeatureCollection } from "./types";

export function validBBoxForFeature({ bbox, geometry }: ValidatableFeature): boolean {
    if (bbox == null || geometry == null) {
        return true;
    }
    const expectedBBox = getBBoxForGeometry(geometry);
    return bboxEquals(expectedBBox, bbox);
}

export function validBBoxForFeatureCollection({ features, bbox }: ValidatableFeatureCollection) {
    if (!bbox) {
        return true;
    }
    const expectedBBox = getBBoxForGeometries(getGeometries({ features }));
    return bboxEquals(expectedBBox, bbox);
}
