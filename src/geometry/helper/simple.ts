import { z } from "zod";
import { GeoJSONPosition } from "../position";
import { GeoJSONLineStringGenericSchema, GeoJSONLineStringGenericSchemaType } from "../line_string";
import { GeoJSONMultiLineStringGenericSchema, GeoJSONMultiLineStringGenericSchemaType } from "../multi_line_string";
import { GeoJSONMultiPointGenericSchema, GeoJSONMultiPointGenericSchemaType } from "../multi_point";
import { GeoJSONMultiPolygonGenericSchema, GeoJSONMultiPolygonGenericSchemaType } from "../multi_polygon";
import { GeoJSONPointGenericSchema, GeoJSONPointGenericSchemaType } from "../point";
import { GeoJSONPolygonGenericSchema, GeoJSONPolygonGenericSchemaType } from "../polygon";

export type GeoJSONSimpleGeometryGenericSchemaType<P extends GeoJSONPosition> = z.ZodUnion<
    [
        GeoJSONPointGenericSchemaType<P>,
        GeoJSONLineStringGenericSchemaType<P>,
        GeoJSONMultiPointGenericSchemaType<P>,
        GeoJSONPolygonGenericSchemaType<P>,
        GeoJSONMultiLineStringGenericSchemaType<P>,
        GeoJSONMultiPolygonGenericSchemaType<P>,
    ]
>;

export const GeoJSONSimpleGeometryGenericSchema = <P extends GeoJSONPosition>(
    positionSchema: z.ZodSchema<P>,
): GeoJSONSimpleGeometryGenericSchemaType<P> =>
    z.union([
        GeoJSONPointGenericSchema(positionSchema),
        GeoJSONLineStringGenericSchema(positionSchema),
        GeoJSONMultiPointGenericSchema(positionSchema),
        GeoJSONPolygonGenericSchema(positionSchema),
        GeoJSONMultiLineStringGenericSchema(positionSchema),
        GeoJSONMultiPolygonGenericSchema(positionSchema),
    ]);
