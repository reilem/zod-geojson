import { GeoJSONLineStringSchema } from "./line_string";
import { GeoJSONMultiLineStringSchema } from "./multi_line_string";
import { GeoJSONMultiPointSchema } from "./multi_point";
import { GeoJSONMultiPolygonSchema } from "./multi_polygon";
import { GeoJSONPointSchema } from "./point";
import { GeoJSONPolygonSchema } from "./polygon";

export const _GeoJSONSimpleGeometrySchema = GeoJSONPointSchema.or(GeoJSONLineStringSchema)
    .or(GeoJSONMultiPointSchema)
    .or(GeoJSONPolygonSchema)
    .or(GeoJSONMultiLineStringSchema)
    .or(GeoJSONMultiPolygonSchema);
