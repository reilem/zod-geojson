import { GeoJSONPoint } from "../../src";

export const geoJsonPoint2D: GeoJSONPoint = {
    type: "Point",
    coordinates: [1.0, 2.0],
};

export const geoJsonPoint3D: GeoJSONPoint = {
    type: "Point",
    coordinates: [1.0, 2.0, 10.0],
};

export const geoJsonPoint2DWithBbox: GeoJSONPoint = {
    ...geoJsonPoint2D,
    bbox: [1.0, 2.0, 1.0, 2.0],
};

export const geoJsonPoint3DWithBbox: GeoJSONPoint = {
    ...geoJsonPoint3D,
    bbox: [1.0, 2.0, 10.0, 1.0, 2.0, 10.0],
};
