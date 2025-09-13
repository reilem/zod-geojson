import { z } from "zod/v4";
import { GeoJSONGeometryBaseSchema } from "./helper/base";
import { GeoJSONPolygonGenericSchema } from "./polygon";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "./position";
import { GeoJSONGeometryTypeSchema } from "./type";
import { getInvalidBBoxIssue, validBboxForPositionGridList } from "./validation/bbox";
import { getInvalidDimensionIssue, validDimensionsForPositionGridList } from "./validation/dimension";
import { getInvalidMultiPolygonLinearRingIssue, validMultiPolygonLinearRings } from "./validation/linear_ring";

export const GeoJSONMultiPolygonGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    z
        .looseObject({
            ...GeoJSONGeometryBaseSchema(positionSchema).shape,
            type: z.literal(GeoJSONGeometryTypeSchema.enum.MultiPolygon),
            // We allow an empty coordinates array:
            // > GeoJSON processors MAY interpret Geometry objects with empty "coordinates"
            //   arrays as null objects. (RFC 7946, section 3.1)
            coordinates: GeoJSONPolygonGenericSchema(positionSchema).shape.coordinates.array(),
        })
        .check((ctx) => {
            // Skip remaining checks if coordinates array is empty
            if (!ctx.value.coordinates.length) {
                return;
            }

            if (!validDimensionsForPositionGridList(ctx.value)) {
                ctx.issues.push(getInvalidDimensionIssue(ctx));
                return;
            }

            if (!validMultiPolygonLinearRings(ctx.value)) {
                ctx.issues.push(getInvalidMultiPolygonLinearRingIssue(ctx));
                return;
            }

            if (!validBboxForPositionGridList(ctx.value)) {
                ctx.issues.push(getInvalidBBoxIssue(ctx));
                return;
            }
        });

export const GeoJSONMultiPolygonSchema = GeoJSONMultiPolygonGenericSchema(GeoJSONPositionSchema);
export type GeoJSONMultiPolygon = z.infer<typeof GeoJSONMultiPolygonSchema>;

export const GeoJSON2DMultiPolygonSchema = GeoJSONMultiPolygonGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DMultiPolygon = z.infer<typeof GeoJSON2DMultiPolygonSchema>;

export const GeoJSON3DMultiPolygonSchema = GeoJSONMultiPolygonGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DMultiPolygon = z.infer<typeof GeoJSON3DMultiPolygonSchema>;
