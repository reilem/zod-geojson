import { GeoJSONGeometry } from "../index";

type BboxPositionOptions = { bbox?: number[]; coordinates?: number[] };
type BboxPositionListOptions = { bbox?: number[]; coordinates?: number[][] };
type BboxPositionGridOptions = { bbox?: number[]; coordinates?: number[][][] };
type BboxPositionGridListOptions = { bbox?: number[]; coordinates?: number[][][][] };

/**
 * Checks if given bbox is valid for the given position.
 * @param bbox The bbox to validate
 * @param coordinates Contains the position
 */
export function validBboxForPosition({ bbox, coordinates }: BboxPositionOptions): boolean {
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
export function validBboxForPositionList({ bbox, coordinates }: BboxPositionListOptions): boolean {
    if (bbox == null) return true;
    if (coordinates == null) return false;

    const dimension = coordinates[0].length;
    if (bbox.length !== dimension * 2) {
        return false;
    }

    const expectedBbox: number[] = [];
    updateBboxForPositionList(expectedBbox, coordinates);
    return bboxEquals(bbox, expectedBbox);
}

/**
 * Checks if given bbox is valid for the given positions grid.
 * @param bbox The bbox to validate
 * @param coordinates Contains the grid of positions
 */
export function validBboxForPositionGrid({ bbox, coordinates }: BboxPositionGridOptions): boolean {
    if (bbox == null) return true;
    if (coordinates == null) return false;

    const dimension = coordinates[0][0].length;
    if (bbox.length !== 2 * dimension) {
        return false;
    }

    const expectedBbox: number[] = [];
    updateBboxForPositionGrid(expectedBbox, coordinates);
    return bboxEquals(bbox, expectedBbox);
}

/**
 * Checks if given bbox is valid for the given positions grid.
 * @param bbox The bbox to validate
 * @param coordinates Contains the grid of positions
 */
export function validBboxForPositionGridList({ bbox, coordinates }: BboxPositionGridListOptions): boolean {
    if (bbox == null) return true;
    if (coordinates == null) return false;

    const dimension = coordinates[0][0][0].length;
    if (bbox.length !== 2 * dimension) {
        return false;
    }

    const expectedBbox: number[] = [];
    updateBboxForPositionGridList(expectedBbox, coordinates);
    return bboxEquals(bbox, expectedBbox);
}

export function getBboxForGeometry(geometry: GeoJSONGeometry): number[] {
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

export function getBboxForGeometries(geometries: GeoJSONGeometry[]): number[] {
    return mergeBboxs(geometries.map(getBboxForGeometry));
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
function updateBboxForPositionGridList(currentBbox: number[], positions: number[][][][]): number[] {
    positions.forEach((positionGrid) => updateBboxForPositionGrid(currentBbox, positionGrid));
    return currentBbox;
}

/**
 * NOTE: Mutates the given bbox. Performance optimisation to avoid unnecessary copies.
 */
function updateBboxForPositionGrid(currentBbox: number[], positions: number[][][]): number[] {
    positions.forEach((positionList) => updateBboxForPositionList(currentBbox, positionList));
    return currentBbox;
}

/**
 * NOTE: Mutates the given bbox. Performance optimisation to avoid unnecessary copies.
 */
function updateBboxForPositionList(currentBbox: number[], positions: number[][]): number[] {
    positions.forEach((position) => updateBboxForPosition(currentBbox, position));
    return currentBbox;
}

/**
 * NOTE: Mutates the given bbox. Performance optimisation to avoid unnecessary copies.
 */
function updateBboxForPosition(currentBbox: number[], position: number[]): number[] {
    const dimension = position.length;
    position.forEach((value, index) => {
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

function mergeBboxs(bboxs: number[][]): number[] {
    const dimension = bboxs[0].length / 2;
    const mergedBbox: number[] = [];
    for (let i = 0; i < dimension; i++) {
        mergedBbox[i] = Math.min(...bboxs.map((bbox) => bbox[i]));
        mergedBbox[i + dimension] = Math.max(...bboxs.map((bbox) => bbox[i + dimension]));
    }
    return mergedBbox;
}

export const INVALID_BBOX_ISSUE = {
    code: "custom" as const,
    message:
        "Invalid bbox. Bbox length must be 2 * n, where n is the dimension of the geometry. Bbox must be a valid extent for the geometry.",
};
