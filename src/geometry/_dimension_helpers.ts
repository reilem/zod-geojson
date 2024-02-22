export function validDimensionsForPositionList({ coordinates }: { coordinates: number[][] }): boolean {
    const coordinatesLen = coordinates.length;
    const dimension = coordinates[0].length;
    for (let i = 1; i < coordinatesLen; i++) {
        if (coordinates[i].length !== dimension) return false;
    }
    return true;
}

export function validDimensionsForPositionGrid({ coordinates }: { coordinates: number[][][] }): boolean {
    let dimension = coordinates[0][0].length;
    return coordinates.every((ring) => ring.every((position) => position.length === dimension));
}

export const INVALID_DIMENSIONS_ISSUE = {
    code: "custom" as const,
    message: "Invalid dimensions. All positions in the geometry must have the same dimension.",
};
