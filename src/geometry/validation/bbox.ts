import * as z from "zod";
import {
    ValidatableCollection,
    ValidatableCoordinate,
    ValidatableGeometry,
    ValidatableGrid,
    ValidatableGridList,
    ValidatableList,
} from "./types";

export const getInvalidBBoxIssue = (ctx: z.core.ParsePayload): z.core.$ZodRawIssue => ({
    code: "custom" as const,
    message:
        "Invalid bbox. BBox length must be 2 * n, where n is the dimension of the geometry. BBox must be a valid extent for the geometry.",
    input: ctx.value,
    continue: true,
});

/**
 * Checks if given bbox is valid for the given position.
 * @param bbox The bbox to validate
 * @param coordinates Contains the position
 */
export function validBBoxForPosition({ bbox, coordinates }: ValidatableCoordinate): boolean {
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
export function validBBoxForPositionList({ bbox, coordinates }: ValidatableList): boolean {
    if (bbox == null) return true;
    if (coordinates == null) return false;

    const dimension = coordinates[0].length;
    if (bbox.length !== dimension * 2) {
        return false;
    }

    return bboxEquals(bbox, updateBBoxForPositionList([], coordinates));
}

/**
 * Checks if given bbox is valid for the given positions grid.
 * @param bbox The bbox to validate
 * @param coordinates Contains the grid of positions
 */
export function validBBoxForPositionGrid({ bbox, coordinates }: ValidatableGrid): boolean {
    if (bbox == null) return true;
    if (coordinates == null) return false;

    const dimension = coordinates[0][0].length;
    if (bbox.length !== 2 * dimension) {
        return false;
    }
    return bboxEquals(bbox, updateBBoxForPositionGrid([], coordinates));
}

/**
 * Checks if given bbox is valid for the given positions grid.
 * @param bbox The bbox to validate
 * @param coordinates Contains the grid of positions
 */
export function validBBoxForPositionGridList({ bbox, coordinates }: ValidatableGridList): boolean {
    if (bbox == null) return true;
    if (coordinates == null) return false;

    const dimension = coordinates[0][0][0].length;
    if (bbox.length !== 2 * dimension) {
        return false;
    }

    return bboxEquals(bbox, updateBBoxForPositionGridList([], coordinates));
}

export function validBBoxForCollection({ bbox, geometries }: ValidatableCollection): boolean {
    if (!bbox) {
        return true;
    }
    const expectedBBox = getBBoxForGeometries(geometries);
    return bboxEquals(bbox, expectedBBox);
}

export function getBBoxForGeometry(geometry: ValidatableGeometry): number[] {
    switch (geometry.type) {
        case "Point":
            return updateBBoxForPosition([], geometry.coordinates);
        case "MultiPoint":
        case "LineString":
            return updateBBoxForPositionList([], geometry.coordinates);
        case "MultiLineString":
        case "Polygon":
            return updateBBoxForPositionGrid([], geometry.coordinates);
        case "MultiPolygon":
            return updateBBoxForPositionGridList([], geometry.coordinates);
        case "GeometryCollection":
            return getBBoxForGeometries(geometry.geometries);
    }
}

export function getBBoxForGeometries(geometries: ValidatableGeometry[]): number[] {
    return mergeBBoxs(geometries.map(getBBoxForGeometry));
}

export function bboxEquals(bbox1: number[], bbox2: number[]): boolean {
    if (bbox1.length !== bbox2.length) {
        return false;
    }
    return bbox1.every((value, index) => value === bbox2[index]);
}

/**
 * NOTE: Mutates the given bbox. Performance optimisation to avoid unnecessary copies.
 */
function updateBBoxForPositionGridList(currentBBox: number[], positions?: number[][][][] | null): number[] {
    positions?.forEach((positionGrid) => updateBBoxForPositionGrid(currentBBox, positionGrid));
    return currentBBox;
}

/**
 * NOTE: Mutates the given bbox. Performance optimisation to avoid unnecessary copies.
 */
function updateBBoxForPositionGrid(currentBBox: number[], positions?: number[][][] | null): number[] {
    positions?.forEach((positionList) => updateBBoxForPositionList(currentBBox, positionList));
    return currentBBox;
}

/**
 * NOTE: Mutates the given bbox. Performance optimisation to avoid unnecessary copies.
 */
function updateBBoxForPositionList(currentBBox: number[], positions?: number[][] | null): number[] {
    positions?.forEach((position) => updateBBoxForPosition(currentBBox, position));
    return currentBBox;
}

/**
 * NOTE: Mutates the given bbox. Performance optimisation to avoid unnecessary copies.
 */
function updateBBoxForPosition(currentBBox: number[], position?: number[] | null): number[] {
    const dimension = position?.length ?? 0;
    position?.forEach((value, index) => {
        const iMin = currentBBox[index];
        const iMax = currentBBox[index + dimension];
        if (iMin === undefined || value < iMin) {
            currentBBox[index] = value;
        }
        if (iMax === undefined || value > iMax) {
            currentBBox[index + dimension] = value;
        }
    });
    return currentBBox;
}

function mergeBBoxs(bboxs: number[][]): number[] {
    const dimension = bboxs[0].length / 2;
    const mergedBBox = [];
    for (let i = 0; i < dimension; i++) {
        mergedBBox[i] = Math.min(...bboxs.map((bbox) => bbox[i]));
        mergedBBox[i + dimension] = Math.max(...bboxs.map((bbox) => bbox[i + dimension]));
    }
    return mergedBBox;
}
