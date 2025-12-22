import * as z from "zod";
import { getDimensionForGeometry } from "../geometry/validation/dimension";
import { getGeometries, ValidatableFeatureCollection } from "./types";

export const getInvalidFeatureCollectionDimensionsIssue = (ctx: z.core.ParsePayload): z.core.$ZodRawIssue => ({
    code: "custom" as const,
    message: "Invalid dimensions. All features in feature collection must have the same dimension.",
    input: ctx.value,
    continue: true,
});

export function validDimensionsForFeatureCollection(collection: ValidatableFeatureCollection): boolean {
    const geometries = getGeometries(collection);
    if (geometries.length === 0) return true;
    const dimension = getDimensionForGeometry(geometries[0]);
    return geometries.slice(1).every((geometry) => getDimensionForGeometry(geometry) === dimension);
}
