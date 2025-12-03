import { GeoJSON2DFeatureCollection, GeoJSON3DFeatureCollection, GeoJSONFeatureCollection } from "../src";

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

export const multiGeoJsonFeatureCollectionWithBbox2D = {
    ...multiGeoJsonFeatureCollection2D,
    bbox: [0.0, 0.0, 10.0, 10.0],
} satisfies GeoJSONFeatureCollection;
