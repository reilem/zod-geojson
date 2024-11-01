import { GeoJSON2DPoint, GeoJSON3DPoint } from "../../src";

export const geoJsonPoint2D: GeoJSON2DPoint = {
    type: "Point",
    coordinates: [1.0, 2.0],
};

export const geoJsonPoint3D: GeoJSON3DPoint = {
    type: "Point",
    coordinates: [1.0, 2.0, 10.0],
};

export const geoJsonPoint2DWithBbox: GeoJSON2DPoint = {
    ...geoJsonPoint2D,
    bbox: [1.0, 2.0, 1.0, 2.0],
};

export const geoJsonPoint3DWithBbox: GeoJSON3DPoint = {
    ...geoJsonPoint3D,
    bbox: [1.0, 2.0, 10.0, 1.0, 2.0, 10.0],
};
