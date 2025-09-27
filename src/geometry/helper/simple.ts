import { z } from "zod/v4";
import { GeoJSONLineStringGenericSchema } from "../line_string";
import { GeoJSONMultiLineStringGenericSchema } from "../multi_line_string";
import { GeoJSONMultiPointGenericSchema } from "../multi_point";
import { GeoJSONMultiPolygonGenericSchema } from "../multi_polygon";
import { GeoJSONPointGenericSchema } from "../point";
import { GeoJSONPolygonGenericSchema } from "../polygon";
import { GeoJSONPosition } from "../position";

export const GeoJSONSimpleGeometryGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodType<P>) =>
    z.discriminatedUnion("type", [
        GeoJSONPointGenericSchema(positionSchema),
        GeoJSONLineStringGenericSchema(positionSchema),
        GeoJSONMultiPointGenericSchema(positionSchema),
        GeoJSONPolygonGenericSchema(positionSchema),
        GeoJSONMultiLineStringGenericSchema(positionSchema),
        GeoJSONMultiPolygonGenericSchema(positionSchema),
    ]);
