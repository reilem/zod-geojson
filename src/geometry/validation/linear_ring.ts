import { GeoJSONPosition } from "../position";

export const INVALID_POLYGON_LINEAR_RING_MESSAGE = {
    code: "custom" as const,
    message: "Invalid polygon. Each ring inside a polygon must form a linear ring.",
};

export const INVALID_MULTI_POLYGON_LINEAR_RING_MESSAGE = {
    code: "custom" as const,
    message: "Invalid multi polygon. Each polygon inside the multi polygon must be made out of linear rings.",
};

function validLinearRing(linearRing: GeoJSONPosition[]): boolean {
    const firstPosition = linearRing[0];
    const lastPosition = linearRing[linearRing.length - 1];
    return firstPosition.every((value, index) => value === lastPosition[index]);
}

export function validPolygonRings({ coordinates: rings }: { coordinates: GeoJSONPosition[][] }): boolean {
    return rings.every(validLinearRing);
}

export function validMultiPolygonLinearRings({ coordinates }: { coordinates: GeoJSONPosition[][][] }) {
    return coordinates.every((polygon) => validPolygonRings({ coordinates: polygon }));
}
