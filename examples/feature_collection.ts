import { GeoJSONFeatureCollection } from "../src";

export const singleGeoJsonFeatureCollection: GeoJSONFeatureCollection = {
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

export const multiGeoJsonFeatureCollection: GeoJSONFeatureCollection = {
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

export const multiGeoJsonFeatureCollectionWithBbox: GeoJSONFeatureCollection = {
    ...multiGeoJsonFeatureCollection,
    bbox: [0.0, 0.0, 10.0, 10.0],
};
