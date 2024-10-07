import { z } from "zod";
import { GeoJSONPosition } from "../position";
import { GeoJSONLineStringGenericSchema } from "./line_string";
import { GeoJSONMultiLineStringGenericSchema } from "./multi_line_string";
import { GeoJSONMultiPointGenericSchema } from "./multi_point";
import { GeoJSONMultiPolygonGenericSchema } from "./multi_polygon";
import { GeoJSONPointGenericSchema } from "./point";
import { GeoJSONPolygonGenericSchema } from "./polygon";

export const _GeoJSONSimpleGeometryGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    z.union([
        GeoJSONPointGenericSchema(positionSchema),
        GeoJSONLineStringGenericSchema(positionSchema),
        GeoJSONMultiPointGenericSchema(positionSchema),
        GeoJSONPolygonGenericSchema(positionSchema),
        GeoJSONMultiLineStringGenericSchema(positionSchema),
        GeoJSONMultiPolygonGenericSchema(positionSchema),
    ]);
