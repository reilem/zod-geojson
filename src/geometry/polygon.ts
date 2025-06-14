import { z } from "zod/v4";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "./position";
import { GeoJSONGeometryBaseSchema } from "./helper/base";
import { GeoJSONGeometryTypeSchema } from "./type";
import { getInvalidBBoxIssue, validBboxForPositionGrid } from "./validation/bbox";
import { getInvalidDimensionIssue, validDimensionsForPositionGrid } from "./validation/dimension";
import { getInvalidPolygonLinearRingIssue, validPolygonRings } from "./validation/linear_ring";

export const GeoJSONPolygonGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    GeoJSONGeometryBaseSchema(positionSchema)
        .extend({
            type: z.literal(GeoJSONGeometryTypeSchema.enum.Polygon),
            // We allow an empty coordinates array
            // > GeoJSON processors MAY interpret Geometry objects with empty "coordinates"
            //   arrays as null objects. (RFC 7946, section 3.1)
            coordinates: z.array(
                // > A linear ring is a closed LineString with four or more positions (RFC 7946, section 3.1.6)
                z.tuple([positionSchema, positionSchema, positionSchema, positionSchema]).rest(positionSchema),
            ),
        })
        .check((ctx) => {
            // Skip remaining checks if coordinates array is empty
            if (!ctx.value.coordinates.length) {
                return;
            }

            if (!validDimensionsForPositionGrid(ctx.value)) {
                ctx.issues.push(getInvalidDimensionIssue(ctx));
                return;
            }
            if (!validPolygonRings(ctx.value)) {
                ctx.issues.push(getInvalidPolygonLinearRingIssue(ctx));
                return;
            }
            if (!validBboxForPositionGrid(ctx.value)) {
                ctx.issues.push(getInvalidBBoxIssue(ctx));
                return;
            }
        });

export const GeoJSONPolygonSchema = GeoJSONPolygonGenericSchema(GeoJSONPositionSchema);
export type GeoJSONPolygon = z.infer<typeof GeoJSONPolygonSchema>;

export const GeoJSON2DPolygonSchema = GeoJSONPolygonGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DPolygon = z.infer<typeof GeoJSON2DPolygonSchema>;

export const GeoJSON3DPolygonSchema = GeoJSONPolygonGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DPolygon = z.infer<typeof GeoJSON3DPolygonSchema>;
