import { ValidatableGeoJSONFeature } from "../feature";
import { bboxEquals, getBboxForGeometry } from "../geometry/validation/bbox";

export function validFeatureBbox({ bbox, geometry }: ValidatableGeoJSONFeature): boolean {
    if (!bbox || !geometry) {
        return true;
    }
    const expectedBbox = getBboxForGeometry(geometry);
    return bboxEquals(expectedBbox, bbox);
}
