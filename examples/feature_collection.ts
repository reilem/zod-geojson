import { GeoJSON2DFeatureCollection, GeoJSON3DFeatureCollection, GeoJSONFeatureCollection } from "../src";

export const singleGeoJsonFeatureCollection2D: GeoJSON2DFeatureCollection = {
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
};

export const singleGeoJsonFeatureCollection3D: GeoJSON3DFeatureCollection = {
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
};

export const multiGeoJsonFeatureCollection2D: GeoJSON2DFeatureCollection = {
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
};

export const multiGeoJsonFeatureCollectionWithBbox2D: GeoJSONFeatureCollection = {
    ...multiGeoJsonFeatureCollection2D,
    bbox: [0.0, 0.0, 10.0, 10.0],
};
