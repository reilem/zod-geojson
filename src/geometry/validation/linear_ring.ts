import { z } from "zod/dist/types/v4";

export const getInvalidPolygonLinearRingIssue = (ctx: z.core.ParsePayload): z.core.$ZodRawIssue => ({
    code: "custom" as const,
    message: "Invalid polygon. Each ring inside a polygon must form a linear ring.",
    input: ctx.value,
    continue: true,
});

export const getInvalidMultiPolygonLinearRingIssue = (ctx: z.core.ParsePayload): z.core.$ZodRawIssue => ({
    code: "custom" as const,
    message: "Invalid multi polygon. Each polygon inside the multi polygon must be made out of linear rings.",
    input: ctx.value,
    continue: true,
});

function validLinearRing(linearRing: number[][]): boolean {
    const firstPosition = linearRing[0];
    const lastPosition = linearRing[linearRing.length - 1];
    return firstPosition.every((value, index) => value === lastPosition[index]);
}

export function validPolygonRings({ coordinates: rings }: { coordinates: number[][][] }): boolean {
    return rings.every(validLinearRing);
}

export function validMultiPolygonLinearRings({ coordinates }: { coordinates: number[][][][] }) {
    return coordinates.every((polygon) => validPolygonRings({ coordinates: polygon }));
}
