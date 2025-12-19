import { GeoJSON2DFeatureCollection, GeoJSON3DFeatureCollection, GeoJSONFeatureCollection } from "../src";
import { geoJsonFeatureNullGeometry, geoJsonFeaturePolygon2D, geoJsonFeaturePolygon3DWithBBox } from "./feature";

export const singleGeoJsonFeatureCollection2D = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {},
            geometry: {
                type: "Point",
                coordinates: [0.0, 0.0],
            },
        },
    ],
} satisfies GeoJSON2DFeatureCollection;

export const singleGeoJsonFeatureCollection3D = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {},
            geometry: {
                type: "Point",
                coordinates: [0.0, 0.0, 1.0],
            },
        },
    ],
} satisfies GeoJSON3DFeatureCollection;

export const multiGeoJsonFeatureCollection2D = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {},
            geometry: {
                type: "Point",
                coordinates: [0.0, 0.0],
            },
        },
        {
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: [
                    [5.0, 5.0],
                    [10.0, 10.0],
                ],
            },
        },
    ],
} satisfies GeoJSON2DFeatureCollection;

export const multiGeoJsonFeatureCollectionWithBBox2D = {
    ...multiGeoJsonFeatureCollection2D,
    bbox: [0.0, 0.0, 10.0, 10.0],
} satisfies GeoJSONFeatureCollection;

export const singleGeoJsonFeatureCollectionPolygon2D = {
    type: "FeatureCollection",
    features: [geoJsonFeaturePolygon2D],
} satisfies GeoJSON2DFeatureCollection;

export const multiGeoJsonFeatureCollectionPolygon3D = {
    type: "FeatureCollection",
    features: [geoJsonFeaturePolygon3DWithBBox, geoJsonFeaturePolygon3DWithBBox],
} satisfies GeoJSON3DFeatureCollection;

export const geoJsonFeatureCollectionNullGeometry = {
    type: "FeatureCollection",
    features: [geoJsonFeatureNullGeometry],
};
