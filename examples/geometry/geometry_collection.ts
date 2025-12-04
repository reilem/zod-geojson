import { GeoJSON2DGeometryCollection, GeoJSON3DGeometryCollection, GeoJSONGeometryCollection } from "../../src";
import { geoJsonLineString3D } from "./line_string";
import { multiGeoJsonMultiLineString2D } from "./multi_line_string";
import { geoJsonMultiPoint2D } from "./multi_point";
import { singleGeoJsonMultiPolygon3D } from "./multi_polygon";
import { geoJsonPoint2D, geoJsonPoint2DWithBbox, geoJsonPoint3D } from "./point";
import { geoJsonPolygon2D } from "./polygon";

export const singleGeoJsonGeometryCollection2D = {
    type: "GeometryCollection",
    geometries: [geoJsonPoint2D],
} satisfies GeoJSON2DGeometryCollection;

export const multiGeoJsonGeometryCollection2D = {
    type: "GeometryCollection",
    geometries: [geoJsonPoint2D, geoJsonMultiPoint2D, geoJsonPolygon2D, multiGeoJsonMultiLineString2D],
} satisfies GeoJSON2DGeometryCollection;

export const multiGeoJsonGeometryCollection3D = {
    type: "GeometryCollection",
    geometries: [geoJsonPoint3D, geoJsonLineString3D, singleGeoJsonMultiPolygon3D],
} satisfies GeoJSON3DGeometryCollection;

export const singleGeoJsonGeometryCollection2DWithBbox = {
    ...singleGeoJsonGeometryCollection2D,
    bbox: geoJsonPoint2DWithBbox.bbox,
} satisfies GeoJSON2DGeometryCollection;

export const multiGeoJsonGeometryCollection2DWithBbox = {
    ...multiGeoJsonGeometryCollection2D,
    bbox: [-3.0, -2.0, 30.0, 30.0],
} satisfies GeoJSON2DGeometryCollection;

export const multiGeoJsonGeometryCollection3DWithBbox = {
    ...multiGeoJsonGeometryCollection3D,
    bbox: [0.0, 0.0, 0.0, 20.0, 10.0, 10.0],
} satisfies GeoJSONGeometryCollection;
