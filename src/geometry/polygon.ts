import { z } from "zod";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "../position";
import { GeoJSONGeometryBaseSchema } from "./helper/base";
import { INVALID_BBOX_ISSUE, validBboxForPositionGrid } from "./validation/bbox";
import { INVALID_DIMENSIONS_ISSUE, validDimensionsForPositionGrid } from "./validation/dimension";
import { INVALID_POLYGON_LINEAR_RING_MESSAGE, validPolygonRings } from "./validation/linear_ring";

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
                ctx.addIssue(INVALID_POLYGON_LINEAR_RING_MESSAGE);
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
