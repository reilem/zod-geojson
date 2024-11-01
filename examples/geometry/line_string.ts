import { GeoJSON2DLineString, GeoJSON3DLineString } from "../../src";

export const geoJsonLineString2D: GeoJSON2DLineString = {
    type: "LineString",
    coordinates: [
        [1.0, 2.0],
        [3.0, 4.0],
    ],
};

export const geoJsonLineString3D: GeoJSON3DLineString = {
    type: "LineString",
    coordinates: [
        [0.0, 0.0, 0.0],
        [10.0, 10.0, 2.0],
        [20.0, 5.0, 1.0],
    ],
};

export const geoJsonLineString2DWithBbox: GeoJSON2DLineString = {
    ...geoJsonLineString2D,
    bbox: [1.0, 2.0, 3.0, 4.0],
};

export const geoJsonLineString3DWithBbox: GeoJSON3DLineString = {
    ...geoJsonLineString3D,
    bbox: [0.0, 0.0, 0.0, 20.0, 10.0, 2.0],
};
