// Derived from the GeoJSON spec: https://datatracker.ietf.org/doc/html/rfc7946
// TODO: Add negative typing examples for all types (like in point tests)
// TODO: Make sure each exposed type & schema is tested

export {
    GeoJSONGeometryGenericSchema,
    GeoJSONGeometrySchema,
    type GeoJSONGeometry,
    GeoJSON2DGeometrySchema,
    type GeoJSON2DGeometry,
    GeoJSON3DGeometrySchema,
    type GeoJSON3DGeometry,
} from "./geometry/geometry";

export {
    GeoJSONGeometryCollectionGenericSchema,
    GeoJSONGeometryCollectionSchema,
    type GeoJSONGeometryCollection,
    GeoJSON2DGeometryCollectionSchema,
    type GeoJSON2DGeometryCollection,
    GeoJSON3DGeometryCollectionSchema,
    type GeoJSON3DGeometryCollection,
} from "./geometry/geometry_collection";

export {
    GeoJSONLineStringGenericSchema,
    GeoJSONLineStringSchema,
    type GeoJSONLineString,
    GeoJSON2DLineStringSchema,
    type GeoJSON2DLineString,
    GeoJSON3DLineStringSchema,
    type GeoJSON3DLineString,
} from "./geometry/line_string";

export {
    GeoJSONMultiLineStringGenericSchema,
    GeoJSONMultiLineStringSchema,
    type GeoJSONMultiLineString,
    GeoJSON2DMultiLineStringSchema,
    type GeoJSON2DMultiLineString,
    GeoJSON3DMultiLineStringSchema,
    type GeoJSON3DMultiLineString,
} from "./geometry/multi_line_string";

export {
    GeoJSONMultiPointGenericSchema,
    GeoJSONMultiPointSchema,
    type GeoJSONMultiPoint,
    GeoJSON2DMultiPointSchema,
    type GeoJSON2DMultiPoint,
    GeoJSON3DMultiPointSchema,
    type GeoJSON3DMultiPoint,
} from "./geometry/multi_point";

export {
    GeoJSONMultiPolygonGenericSchema,
    GeoJSONMultiPolygonSchema,
    type GeoJSONMultiPolygon,
    GeoJSON2DMultiPolygonSchema,
    type GeoJSON2DMultiPolygon,
    GeoJSON3DMultiPolygonSchema,
    type GeoJSON3DMultiPolygon,
} from "./geometry/multi_polygon";

export {
    GeoJSONPointGenericSchema,
    GeoJSONPointSchema,
    type GeoJSONPoint,
    GeoJSON2DPointSchema,
    type GeoJSON2DPoint,
    GeoJSON3DPointSchema,
    type GeoJSON3DPoint,
} from "./geometry/point";

export {
    GeoJSONPolygonGenericSchema,
    GeoJSONPolygonSchema,
    type GeoJSONPolygon,
    GeoJSON2DPolygonSchema,
    type GeoJSON2DPolygon,
    GeoJSON3DPolygonSchema,
    type GeoJSON3DPolygon,
} from "./geometry/polygon";

export {
    GeoJSONPositionSchema,
    type GeoJSONPosition,
    GeoJSON2DPositionSchema,
    type GeoJSON2DPosition,
    GeoJSON3DPositionSchema,
    type GeoJSON3DPosition,
} from "./geometry/position";

export { GeoJSONGeometryTypeSchema, type GeoJSONGeometryEnumType, type GeoJSONGeometryType } from "./geometry/type";

export { GeoJSONBboxSchema, type GeoJSONBbox } from "./bbox";

export {
    GeoJSONFeatureGenericSchema,
    GeoJSONFeatureSchema,
    type GeoJSONFeature,
    GeoJSON2DFeatureSchema,
    type GeoJSON2DFeature,
    GeoJSON3DFeatureSchema,
    type GeoJSON3DFeature,
} from "./feature";

export {
    GeoJSONFeatureCollectionGenericSchema,
    GeoJSONFeatureCollectionSchema,
    type GeoJSONFeatureCollection,
    GeoJSON2DFeatureCollectionSchema,
    type GeoJSON2DFeatureCollection,
    GeoJSON3DFeatureCollectionSchema,
    type GeoJSON3DFeatureCollection,
} from "./feature_collection";

export {
    GeoJSONGenericSchema,
    GeoJSONSchema,
    type GeoJSON,
    GeoJSON2DSchema,
    type GeoJSON2D,
    GeoJSON3DSchema,
    type GeoJSON3D,
} from "./geojson";

export { GeoJSONTypeSchema, type GeoJSONType } from "./type";
