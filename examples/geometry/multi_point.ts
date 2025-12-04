import { GeoJSON2DMultiPoint, GeoJSON3DMultiPoint } from "../../src";

export const geoJsonMultiPoint2D = {
    type: "MultiPoint",
    coordinates: [
        [0.0, 0.0],
        [-3.0, 4.0],
        [8.0, -2.0],
    ],
} satisfies GeoJSON2DMultiPoint;

export const geoJsonMultiPoint3D = {
    type: "MultiPoint",
    coordinates: [
        [0.0, 0.0, 0.0],
        [-3.0, 4.0, 5.0],
        [8.0, -2.0, 1.0],
    ],
} satisfies GeoJSON3DMultiPoint;

export const geoJsonMultiPoint2DWithBbox = {
    ...geoJsonMultiPoint2D,
    bbox: [-3.0, -2.0, 8.0, 4.0],
} satisfies GeoJSON2DMultiPoint;

export const geoJsonMultiPoint3DWithBbox = {
    ...geoJsonMultiPoint3D,
    bbox: [-3.0, -2.0, 0.0, 8.0, 4.0, 5.0],
} satisfies GeoJSON3DMultiPoint;
