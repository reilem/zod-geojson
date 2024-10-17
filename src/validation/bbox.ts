import { bboxEquals, getBboxForGeometries, getBboxForGeometry } from "../geometry/validation/bbox";
import { getGeometries, ValidatableFeature, ValidatableFeatureCollection } from "./types";

export function validBboxForFeature({ bbox, geometry }: ValidatableFeature): boolean {
    if (!bbox || !geometry) {
        return true;
    }
    const expectedBbox = getBboxForGeometry(geometry);
    return bboxEquals(expectedBbox, bbox);
}

export function validBboxForFeatureCollection({ features, bbox }: ValidatableFeatureCollection) {
    if (!bbox) {
        return true;
    }
    const expectedBbox = getBboxForGeometries(getGeometries({ features }));
    return bboxEquals(expectedBbox, bbox);
}
