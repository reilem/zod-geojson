import { GeoJSON2DFeature, GeoJSON3DFeature, GeoJSONFeature } from "../src";
import { multiGeoJsonGeometryCollection2D, multiGeoJsonGeometryCollection3D } from "./geometry/geometry_collection";
import { geoJsonPoint2D, geoJsonPoint3D } from "./geometry/point";
import { geoJsonPolygon2D, geoJsonPolygon3D, geoJsonPolygon3DWithBbox } from "./geometry/polygon";
import { geoJsonPropertiesComplex, geoJsonPropertiesEmpty, geoJsonPropertiesSimple } from "./properties";

export const geoJsonFeaturePoint2D = {
    type: "Feature",
    properties: geoJsonPropertiesEmpty,
    geometry: geoJsonPoint2D,
} satisfies GeoJSON2DFeature;

export const geoJsonFeaturePoint3D = {
    type: "Feature",
    properties: geoJsonPropertiesSimple,
    geometry: geoJsonPoint3D,
} satisfies GeoJSON3DFeature;

export const geoJsonFeaturePolygon2D = {
    type: "Feature",
    properties: geoJsonPropertiesComplex,
    geometry: geoJsonPolygon2D,
} satisfies GeoJSONFeature;

export const geoJsonFeaturePolygon3DWithBbox = {
    type: "Feature",
    properties: geoJsonPropertiesEmpty,
    geometry: geoJsonPolygon3D,
    bbox: geoJsonPolygon3DWithBbox.bbox,
} satisfies GeoJSONFeature;

export const geoJsonFeatureGeometryCollection2D = {
    type: "Feature",
    properties: geoJsonPropertiesSimple,
    geometry: multiGeoJsonGeometryCollection2D,
} satisfies GeoJSONFeature;

export const geoJsonFeatureGeometryCollection3D = {
    type: "Feature",
    properties: geoJsonPropertiesComplex,
    geometry: multiGeoJsonGeometryCollection3D,
} satisfies GeoJSONFeature;
