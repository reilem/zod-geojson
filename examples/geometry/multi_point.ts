import { GeoJSON2DMultiPoint, GeoJSON3DMultiPoint, GeoJSONMultiPoint } from "../../src";
import { geoJsonPoint6D } from "./point";

export const geoJsonMultiPoint2D: GeoJSON2DMultiPoint = {
    type: "MultiPoint",
    coordinates: [
        [0.0, 0.0],
        [-3.0, 4.0],
        [8.0, -2.0],
    ],
};

export const geoJsonMultiPoint3D: GeoJSON3DMultiPoint = {
    type: "MultiPoint",
    coordinates: [
        [0.0, 0.0, 0.0],
        [-3.0, 4.0, 5.0],
        [8.0, -2.0, 1.0],
    ],
};

export const geoJsonMultiPoint2DWithBbox: GeoJSON2DMultiPoint = {
    ...geoJsonMultiPoint2D,
    bbox: [-3.0, -2.0, 8.0, 4.0],
};

export const geoJsonMultiPoint3DWithBbox: GeoJSON3DMultiPoint = {
    ...geoJsonMultiPoint3D,
    bbox: [-3.0, -2.0, 0.0, 8.0, 4.0, 5.0],
};

export const geoJsonMultiPoint6D: GeoJSONMultiPoint = {
    type: "MultiPoint",
    coordinates: [geoJsonPoint6D.coordinates],
};
