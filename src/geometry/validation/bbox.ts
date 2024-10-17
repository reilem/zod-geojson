import { GeoJSONPosition } from "../../position";
import {
    ValidatableCollection,
    ValidatableCoordinate,
    ValidatableGeometry,
    ValidatableGrid,
    ValidatableGridList,
    ValidatableList,
} from "./types";

export const INVALID_BBOX_ISSUE = {
    code: "custom" as const,
    message:
        "Invalid bbox. Bbox length must be 2 * n, where n is the dimension of the geometry. Bbox must be a valid extent for the geometry.",
};

// Easier to work with a simple array than a GeoJSONBbox object
type ValidatableBbox = number[];

/**
 * Checks if given bbox is valid for the given position.
 * @param bbox The bbox to validate
 * @param coordinates Contains the position
 */
export function validBboxForPosition({ bbox, coordinates }: ValidatableCoordinate): boolean {
    if (bbox == null) return true;
    if (coordinates == null) return false;

    const dimension = coordinates.length;
    if (bbox.length !== dimension * 2) {
        return false;
    }
    return bbox.every((value, index) => value === coordinates[index % dimension]);
}

/**
 * Checks if given bbox is valid for the given positions.
 * @param bbox The bbox to validate
 * @param coordinates Contains the list of positions
 */
export function validBboxForPositionList({ bbox, coordinates }: ValidatableList): boolean {
    if (bbox == null) return true;
    if (coordinates == null) return false;

    const dimension = coordinates[0].length;
    if (bbox.length !== dimension * 2) {
        return false;
    }

    return bboxEquals(bbox, updateBboxForPositionList([], coordinates));
}

/**
 * Checks if given bbox is valid for the given positions grid.
 * @param bbox The bbox to validate
 * @param coordinates Contains the grid of positions
 */
export function validBboxForPositionGrid({ bbox, coordinates }: ValidatableGrid): boolean {
    if (bbox == null) return true;
    if (coordinates == null) return false;

    const dimension = coordinates[0][0].length;
    if (bbox.length !== 2 * dimension) {
        return false;
    }
    return bboxEquals(bbox, updateBboxForPositionGrid([], coordinates));
}

/**
 * Checks if given bbox is valid for the given positions grid.
 * @param bbox The bbox to validate
 * @param coordinates Contains the grid of positions
 */
export function validBboxForPositionGridList({ bbox, coordinates }: ValidatableGridList): boolean {
    if (bbox == null) return true;
    if (coordinates == null) return false;

    const dimension = coordinates[0][0][0].length;
    if (bbox.length !== 2 * dimension) {
        return false;
    }

    return bboxEquals(bbox, updateBboxForPositionGridList([], coordinates));
}

export function validBboxForCollection({ bbox, geometries }: ValidatableCollection): boolean {
    if (!bbox) {
        return true;
    }
    const expectedBbox = getBboxForGeometries(geometries);
    return bboxEquals(bbox, expectedBbox);
}

export function getBboxForGeometry(geometry: ValidatableGeometry): ValidatableBbox {
    switch (geometry.type) {
        case "Point":
            return updateBboxForPosition([], geometry.coordinates);
        case "MultiPoint":
        case "LineString":
            return updateBboxForPositionList([], geometry.coordinates);
        case "MultiLineString":
        case "Polygon":
            return updateBboxForPositionGrid([], geometry.coordinates);
        case "MultiPolygon":
            return updateBboxForPositionGridList([], geometry.coordinates);
        case "GeometryCollection":
            return getBboxForGeometries(geometry.geometries);
    }
}

export function getBboxForGeometries(geometries: ValidatableGeometry[]): ValidatableBbox {
    return mergeBboxs(geometries.map(getBboxForGeometry));
}

export function bboxEquals(bbox1: ValidatableBbox, bbox2: ValidatableBbox): boolean {
    if (bbox1.length !== bbox2.length) {
        return false;
    }
    return bbox1.every((value, index) => value === bbox2[index]);
}

/**
 * NOTE: Mutates the given bbox. Performance optimisation to avoid unnecessary copies.
 */
function updateBboxForPositionGridList(
    currentBbox: ValidatableBbox,
    positions?: GeoJSONPosition[][][] | null,
): ValidatableBbox {
    positions?.forEach((positionGrid) => updateBboxForPositionGrid(currentBbox, positionGrid));
    return currentBbox;
}

/**
 * NOTE: Mutates the given bbox. Performance optimisation to avoid unnecessary copies.
 */
function updateBboxForPositionGrid(
    currentBbox: ValidatableBbox,
    positions?: GeoJSONPosition[][] | null,
): ValidatableBbox {
    positions?.forEach((positionList) => updateBboxForPositionList(currentBbox, positionList));
    return currentBbox;
}

/**
 * NOTE: Mutates the given bbox. Performance optimisation to avoid unnecessary copies.
 */
function updateBboxForPositionList(
    currentBbox: ValidatableBbox,
    positions?: GeoJSONPosition[] | null,
): ValidatableBbox {
    positions?.forEach((position) => updateBboxForPosition(currentBbox, position));
    return currentBbox;
}

/**
 * NOTE: Mutates the given bbox. Performance optimisation to avoid unnecessary copies.
 */
function updateBboxForPosition(currentBbox: ValidatableBbox, position?: GeoJSONPosition | null): ValidatableBbox {
    const dimension = position?.length ?? 0;
    position?.forEach((value, index) => {
        const iMin = currentBbox[index];
        const iMax = currentBbox[index + dimension];
        if (iMin === undefined || value < iMin) {
            currentBbox[index] = value;
        }
        if (iMax === undefined || value > iMax) {
            currentBbox[index + dimension] = value;
        }
    });
    return currentBbox;
}

function mergeBboxs(bboxs: ValidatableBbox[]): ValidatableBbox {
    const dimension = bboxs[0].length / 2;
    const mergedBbox = [];
    for (let i = 0; i < dimension; i++) {
        mergedBbox[i] = Math.min(...bboxs.map((bbox) => bbox[i]));
        mergedBbox[i + dimension] = Math.max(...bboxs.map((bbox) => bbox[i + dimension]));
    }
    return mergedBbox;
}
