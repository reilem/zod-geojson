import { GeoJSONGeometryCollection } from "../../src";
import { geoJsonLineString3D } from "./line_string";
import { multiGeoJsonMultiLineString2D } from "./multi_line_string";
import { geoJsonMultiPoint2D } from "./multi_point";
import { singleGeoJsonMultiPolygon3D } from "./multi_polygon";
import { geoJsonPoint2D, geoJsonPoint2DWithBbox, geoJsonPoint3D } from "./point";
import { geoJsonPolygon2D } from "./polygon";

export const singleGeoJsonGeometryCollection2D: GeoJSONGeometryCollection = {
    type: "GeometryCollection",
    geometries: [geoJsonPoint2D],
};

export const multiGeoJsonGeometryCollection2D: GeoJSONGeometryCollection = {
    type: "GeometryCollection",
    geometries: [geoJsonPoint2D, geoJsonMultiPoint2D, geoJsonPolygon2D, multiGeoJsonMultiLineString2D],
};

export const multiGeoJsonGeometryCollection3D: GeoJSONGeometryCollection = {
    type: "GeometryCollection",
    geometries: [geoJsonPoint3D, geoJsonLineString3D, singleGeoJsonMultiPolygon3D],
};

export const nestedGeoJsonGeometryCollection: GeoJSONGeometryCollection = {
    type: "GeometryCollection",
    geometries: [geoJsonPoint2D, multiGeoJsonGeometryCollection2D],
};

export const singleGeoJsonGeometryCollection2DWithBbox: GeoJSONGeometryCollection = {
    ...singleGeoJsonGeometryCollection2D,
    bbox: geoJsonPoint2DWithBbox.bbox,
};

export const multiGeoJsonGeometryCollection2DWithBbox: GeoJSONGeometryCollection = {
    ...multiGeoJsonGeometryCollection2D,
    bbox: [0.0, 0.0, 30.0, 30.0],
};

export const multiGeoJsonGeometryCollection3DWithBbox: GeoJSONGeometryCollection = {
    ...multiGeoJsonGeometryCollection3D,
    bbox: [0.0, 0.0, 0.0, 20.0, 10.0, 10.0],
};

export const nestedGeoJsonGeometryCollectionWithBbox: GeoJSONGeometryCollection = {
    ...nestedGeoJsonGeometryCollection,
    bbox: [0.0, 0.0, 30.0, 30.0],
};
