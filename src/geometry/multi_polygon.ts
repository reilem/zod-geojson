import { z } from "zod";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "../position";
import { GeoJSONGeometryBaseSchema } from "./helper/base";
import { GeoJSONPolygonGenericSchema } from "./polygon";
import { INVALID_BBOX_ISSUE, validBboxForPositionGridList } from "./validation/bbox";
import { INVALID_DIMENSIONS_ISSUE, validDimensionsForPositionGridList } from "./validation/dimension";
import { INVALID_MULTI_POLYGON_LINEAR_RING_MESSAGE, validMultiPolygonLinearRings } from "./validation/linear_ring";

export const GeoJSONMultiPolygonGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    GeoJSONGeometryBaseSchema.extend({
        type: z.literal("MultiPolygon"),
        // We allow an empty coordinates array:
        // > GeoJSON processors MAY interpret Geometry objects with empty "coordinates"
        //   arrays as null objects. (RFC 7946, section 3.1)
        coordinates: z.array(GeoJSONPolygonGenericSchema(positionSchema).innerType().shape.coordinates),
    })
        .passthrough()
        .superRefine((val, ctx) => {
            // Skip remaining checks if coordinates array is empty
            if (!val.coordinates.length) {
                return;
            }

            if (!validDimensionsForPositionGridList(val)) {
                ctx.addIssue(INVALID_DIMENSIONS_ISSUE);
                return;
            }

            if (!validMultiPolygonLinearRings(val)) {
                ctx.addIssue(INVALID_MULTI_POLYGON_LINEAR_RING_MESSAGE);
                return;
            }

            if (!validBboxForPositionGridList(val)) {
                ctx.addIssue(INVALID_BBOX_ISSUE);
                return;
            }
        });

export const GeoJSONMultiPolygonSchema = GeoJSONMultiPolygonGenericSchema(GeoJSONPositionSchema);
export type GeoJSONMultiPolygon = z.infer<typeof GeoJSONMultiPolygonSchema>;

export const GeoJSON2DMultiPolygonSchema = GeoJSONMultiPolygonGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DMultiPolygon = z.infer<typeof GeoJSON2DMultiPolygonSchema>;

export const GeoJSON3DMultiPolygonSchema = GeoJSONMultiPolygonGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DMultiPolygon = z.infer<typeof GeoJSON3DMultiPolygonSchema>;
