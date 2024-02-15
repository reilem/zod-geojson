import { GeoJSONMultiPoint } from "../../src";

export const geoJsonMultiPoint2D: GeoJSONMultiPoint = {
    type: "MultiPoint",
    coordinates: [
        [0.0, 0.0],
        [-3.0, 4.0],
        [8.0, -2.0],
    ],
};

export const geoJsonMultiPoint3D: GeoJSONMultiPoint = {
    type: "MultiPoint",
    coordinates: [
        [0.0, 0.0, 0.0],
        [-3.0, 4.0, 5.0],
        [8.0, -2.0, 1.0],
    ],
};

export const geoJsonMultiPoint2DWithBbox: GeoJSONMultiPoint = {
    ...geoJsonMultiPoint2D,
    bbox: [-3.0, -2.0, 8.0, 4.0],
};

export const geoJsonMultiPoint3DWithBbox: GeoJSONMultiPoint = {
    ...geoJsonMultiPoint3D,
    bbox: [-3.0, -2.0, 0.0, 8.0, 4.0, 5.0],
};
