import { GeoJSON2DLineString, GeoJSON3DLineString } from "../../src";

export const geoJsonLineString2D = {
    type: "LineString",
    coordinates: [
        [1.0, 2.0],
        [3.0, 4.0],
    ],
} satisfies GeoJSON2DLineString;

export const geoJsonLineString3D = {
    type: "LineString",
    coordinates: [
        [0.0, 0.0, 0.0],
        [10.0, 10.0, 2.0],
        [20.0, 5.0, 1.0],
    ],
} satisfies GeoJSON3DLineString;

export const geoJsonLineString2DWithBbox = {
    ...geoJsonLineString2D,
    bbox: [1.0, 2.0, 3.0, 4.0],
} satisfies GeoJSON2DLineString;

export const geoJsonLineString3DWithBbox = {
    ...geoJsonLineString3D,
    bbox: [0.0, 0.0, 0.0, 20.0, 10.0, 2.0],
} satisfies GeoJSON3DLineString;
