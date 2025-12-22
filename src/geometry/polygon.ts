import * as z from "zod";
import { GeoJSONGeometryBaseSchema, GeoJSONGeometryBaseSchemaShape } from "./helper/base";
import {
    GeoJSON2DPositionSchema,
    GeoJSON3DPositionSchema,
    GeoJSONAnyPosition,
    GeoJSONPositionSchema,
} from "./position";
import { GeoJSONGeometryType, GeoJSONGeometryTypeSchema } from "./type";
import { getInvalidBBoxIssue, validBBoxForPositionGrid } from "./validation/bbox";
import { getInvalidDimensionIssue, validDimensionsForPositionGrid } from "./validation/dimension";
import { getInvalidPolygonLinearRingIssue, validPolygonRings } from "./validation/linear_ring";

export type GeoJSONPolygonGenericSchemaType<P extends GeoJSONAnyPosition> = z.ZodObject<
    GeoJSONGeometryBaseSchemaShape<P> & {
        type: z.ZodLiteral<typeof GeoJSONGeometryType.Polygon>;
        coordinates: z.ZodArray<z.ZodArray<z.ZodType<P>>>;
    }
>;

export const GeoJSONPolygonGenericSchema = <P extends GeoJSONAnyPosition>(
    positionSchema: z.ZodType<P>,
): GeoJSONPolygonGenericSchemaType<P> =>
    z
        .looseObject({
            ...GeoJSONGeometryBaseSchema(positionSchema).shape,
            type: z.literal(GeoJSONGeometryTypeSchema.enum.Polygon),
            // We allow an empty coordinates array
            // > GeoJSON processors MAY interpret Geometry objects with empty "coordinates"
            //   arrays as null objects. (RFC 7946, section 3.1)
            // > A linear ring is a closed LineString with four or more positions (RFC 7946, section 3.1.6)
            coordinates: z.array(positionSchema.array().min(4)),
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
            if (!validBBoxForPositionGrid(ctx.value)) {
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
