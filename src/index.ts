// Derived from the GeoJSON spec: https://datatracker.ietf.org/doc/html/rfc7946

export {
    GeoJSON2DGeometrySchema,
    GeoJSON3DGeometrySchema,
    GeoJSONGeometryGenericSchema,
    type GeoJSONGeometryGenericSchemaType,
    type GeoJSONGeometryGeneric,
    GeoJSONGeometrySchema,
    type GeoJSON2DGeometry,
    type GeoJSON3DGeometry,
    type GeoJSONGeometry,
    type DiscriminableGeometrySchema,
} from "./geometry/geometry";

export {
    GeoJSON2DGeometryCollectionSchema,
    GeoJSON3DGeometryCollectionSchema,
    GeoJSONGeometryCollectionGenericSchema,
    type GeoJSONGeometryCollectionGenericSchemaType,
    GeoJSONGeometryCollectionSchema,
    type GeoJSON2DGeometryCollection,
    type GeoJSON3DGeometryCollection,
    type GeoJSONGeometryCollection,
} from "./geometry/geometry_collection";

export {
    GeoJSON2DLineStringSchema,
    GeoJSON3DLineStringSchema,
    GeoJSONLineStringGenericSchema,
    type GeoJSONLineStringGenericSchemaType,
    GeoJSONLineStringSchema,
    type GeoJSON2DLineString,
    type GeoJSON3DLineString,
    type GeoJSONLineString,
} from "./geometry/line_string";

export {
    GeoJSON2DMultiLineStringSchema,
    GeoJSON3DMultiLineStringSchema,
    GeoJSONMultiLineStringGenericSchema,
    type GeoJSONMultiLineStringGenericSchemaType,
    GeoJSONMultiLineStringSchema,
    type GeoJSON2DMultiLineString,
    type GeoJSON3DMultiLineString,
    type GeoJSONMultiLineString,
} from "./geometry/multi_line_string";

export {
    GeoJSON2DMultiPointSchema,
    GeoJSON3DMultiPointSchema,
    GeoJSONMultiPointGenericSchema,
    type GeoJSONMultiPointGenericSchemaType,
    GeoJSONMultiPointSchema,
    type GeoJSON2DMultiPoint,
    type GeoJSON3DMultiPoint,
    type GeoJSONMultiPoint,
} from "./geometry/multi_point";

export {
    GeoJSON2DMultiPolygonSchema,
    GeoJSON3DMultiPolygonSchema,
    GeoJSONMultiPolygonGenericSchema,
    type GeoJSONMultiPolygonGenericSchemaType,
    GeoJSONMultiPolygonSchema,
    type GeoJSON2DMultiPolygon,
    type GeoJSON3DMultiPolygon,
    type GeoJSONMultiPolygon,
} from "./geometry/multi_polygon";

export {
    GeoJSON2DPointSchema,
    GeoJSON3DPointSchema,
    GeoJSONPointGenericSchema,
    type GeoJSONPointGenericSchemaType,
    GeoJSONPointSchema,
    type GeoJSON2DPoint,
    type GeoJSON3DPoint,
    type GeoJSONPoint,
} from "./geometry/point";

export {
    GeoJSON2DPolygonSchema,
    GeoJSON3DPolygonSchema,
    GeoJSONPolygonGenericSchema,
    type GeoJSONPolygonGenericSchemaType,
    GeoJSONPolygonSchema,
    type GeoJSON2DPolygon,
    type GeoJSON3DPolygon,
    type GeoJSONPolygon,
} from "./geometry/polygon";

export {
    GeoJSON2DPositionSchema,
    GeoJSON3DPositionSchema,
    GeoJSONPositionSchema,
    type GeoJSON2DPosition,
    type GeoJSON3DPosition,
    type GeoJSONPosition,
} from "./geometry/position";

export { GeoJSONGeometryTypeSchema, GeoJSONGeometryType } from "./geometry/type";

export {
    GeoJSON2DBBoxSchema,
    GeoJSON3DBBoxSchema,
    GeoJSONBBoxSchema,
    type GeoJSON2DBBox,
    type GeoJSON3DBBox,
    type GeoJSONBBox,
} from "./bbox";

export {
    GeoJSON2DFeatureSchema,
    GeoJSON3DFeatureSchema,
    GeoJSONFeatureGenericSchema,
    type GeoJSONFeatureGenericSchemaType,
    type GeoJSONFeatureGeneric,
    GeoJSONFeatureSchema,
    type GeoJSON2DFeature,
    type GeoJSON3DFeature,
    type GeoJSONFeature,
} from "./feature";

export {
    GeoJSON2DFeatureCollectionSchema,
    GeoJSON3DFeatureCollectionSchema,
    GeoJSONFeatureCollectionGenericSchema,
    type GeoJSONFeatureCollectionGenericSchemaType,
    type GeoJSONFeatureCollectionGeneric,
    GeoJSONFeatureCollectionSchema,
    type GeoJSON2DFeatureCollection,
    type GeoJSON3DFeatureCollection,
    type GeoJSONFeatureCollection,
} from "./feature_collection";

export {
    GeoJSON2DSchema,
    GeoJSON3DSchema,
    GeoJSONGenericSchema,
    type GeoJSONGenericSchemaType,
    type GeoJSONGeneric,
    GeoJSONSchema,
    type GeoJSON,
    type GeoJSON2D,
    type GeoJSON3D,
} from "./geojson";

export { GeoJSONPropertiesSchema, type GeoJSONProperties } from "./properties";

export { GeoJSONTypeSchema, GeoJSONType } from "./type";
