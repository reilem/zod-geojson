import { z } from "zod";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "../position";
import { GeoJSONGeometryBaseSchema } from "./base";
import { INVALID_BBOX_ISSUE, validBboxForPositionGrid } from "./validation/bbox";
import { INVALID_DIMENSIONS_ISSUE, validDimensionsForPositionGrid } from "./validation/dimension";

const INVALID_LINEAR_RING_MESSAGE = {
    code: "custom" as const,
    message: "Invalid polygon. Each ring inside a polygon must form a linear ring.",
};

export const GeoJSONPolygonGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    GeoJSONGeometryBaseSchema.extend({
        type: z.literal("Polygon"),
        // We allow an empty coordinates array
        // > GeoJSON processors MAY interpret Geometry objects with empty "coordinates"
        //   arrays as null objects. (RFC 7946, section 3.1)
        coordinates: z.array(
            // > A linear ring is a closed LineString with four or more positions (RFC 7946, section 3.1.6)
            z.tuple([positionSchema, positionSchema, positionSchema, positionSchema]).rest(positionSchema),
        ),
    })
        .passthrough()
        .superRefine((val, ctx) => {
            // Skip remaining checks if coordinates array is empty
            if (!val.coordinates.length) {
                return;
            }

            if (!validDimensionsForPositionGrid(val)) {
                ctx.addIssue(INVALID_DIMENSIONS_ISSUE);
                return;
            }
            if (!validPolygonRings(val)) {
                ctx.addIssue(INVALID_LINEAR_RING_MESSAGE);
                return;
            }
            if (!validBboxForPositionGrid(val)) {
                ctx.addIssue(INVALID_BBOX_ISSUE);
                return;
            }
        });

export const GeoJSONPolygonSchema = GeoJSONPolygonGenericSchema(GeoJSONPositionSchema);
export type GeoJSONPolygon = z.infer<typeof GeoJSONPolygonSchema>;

export const GeoJSON2DPolygonSchema = GeoJSONPolygonGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DPolygon = z.infer<typeof GeoJSON2DPolygonSchema>;

export const GeoJSON3DPolygonSchema = GeoJSONPolygonGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DPolygon = z.infer<typeof GeoJSON3DPolygonSchema>;

function validLinearRing(linearRing: number[][]): boolean {
    const firstPosition = linearRing[0];
    const lastPosition = linearRing[linearRing.length - 1];
    return firstPosition.every((value, index) => value === lastPosition[index]);
}

export function validPolygonRings({ coordinates: rings }: { coordinates: number[][][] }): boolean {
    return rings.every(validLinearRing);
}
