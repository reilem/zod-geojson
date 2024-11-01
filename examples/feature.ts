import { GeoJSONFeature } from "../src";
import { multiGeoJsonGeometryCollection2D, multiGeoJsonGeometryCollection3D } from "./geometry/geometry_collection";
import { geoJsonPoint2D, geoJsonPoint3D } from "./geometry/point";
import { geoJsonPolygon2D, geoJsonPolygon3D, geoJsonPolygon3DWithBbox } from "./geometry/polygon";

export const geoJsonFeaturePoint2D: GeoJSONFeature = {
    type: "Feature",
    properties: {},
    geometry: geoJsonPoint2D,
};

export const geoJsonFeaturePoint3D: GeoJSONFeature = {
    type: "Feature",
    properties: {},
    geometry: geoJsonPoint3D,
};

export const geoJsonFeaturePolygon2D: GeoJSONFeature = {
    type: "Feature",
    properties: {},
    geometry: geoJsonPolygon2D,
};

export const geoJsonFeaturePolygon3DWithBbox: GeoJSONFeature = {
    type: "Feature",
    properties: {},
    geometry: geoJsonPolygon3D,
    bbox: geoJsonPolygon3DWithBbox.bbox,
};

export const geoJsonFeatureGeometryCollection2D: GeoJSONFeature = {
    type: "Feature",
    properties: {},
    geometry: multiGeoJsonGeometryCollection2D,
};

export const geoJsonFeatureGeometryCollection3D: GeoJSONFeature = {
    type: "Feature",
    properties: {},
    geometry: multiGeoJsonGeometryCollection3D,
};
