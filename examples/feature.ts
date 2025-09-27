import { GeoJSONFeature } from "../src";
import { multiGeoJsonGeometryCollection2D, multiGeoJsonGeometryCollection3D } from "./geometry/geometry_collection";
import { geoJsonPoint2D, geoJsonPoint3D } from "./geometry/point";
import { geoJsonPolygon2D, geoJsonPolygon3D, geoJsonPolygon3DWithBbox } from "./geometry/polygon";
import { geoJsonPropertiesComplex, geoJsonPropertiesEmpty, geoJsonPropertiesSimple } from "./properties";

export const geoJsonFeaturePoint2D: GeoJSONFeature = {
    type: "Feature",
    properties: geoJsonPropertiesEmpty,
    geometry: geoJsonPoint2D,
};

export const geoJsonFeaturePoint3D: GeoJSONFeature = {
    type: "Feature",
    properties: geoJsonPropertiesSimple,
    geometry: geoJsonPoint3D,
};

export const geoJsonFeaturePolygon2D: GeoJSONFeature = {
    type: "Feature",
    properties: geoJsonPropertiesComplex,
    geometry: geoJsonPolygon2D,
};

export const geoJsonFeaturePolygon3DWithBbox: GeoJSONFeature = {
    type: "Feature",
    properties: geoJsonPropertiesEmpty,
    geometry: geoJsonPolygon3D,
    bbox: geoJsonPolygon3DWithBbox.bbox,
};

export const geoJsonFeatureGeometryCollection2D: GeoJSONFeature = {
    type: "Feature",
    properties: geoJsonPropertiesSimple,
    geometry: multiGeoJsonGeometryCollection2D,
};

export const geoJsonFeatureGeometryCollection3D: GeoJSONFeature = {
    type: "Feature",
    properties: geoJsonPropertiesComplex,
    geometry: multiGeoJsonGeometryCollection3D,
};
