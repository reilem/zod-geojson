import { GeoJSON2DPoint, GeoJSON3DPoint } from "../../src";

export const geoJsonPoint2D = {
    type: "Point",
    coordinates: [1.0, 2.0],
} satisfies GeoJSON2DPoint;

export const geoJsonPoint3D = {
    type: "Point",
    coordinates: [1.0, 2.0, 10.0],
} satisfies GeoJSON3DPoint;

export const geoJsonPoint2DWithBbox = {
    ...geoJsonPoint2D,
    bbox: [1.0, 2.0, 1.0, 2.0],
} satisfies GeoJSON2DPoint;

export const geoJsonPoint3DWithBbox = {
    ...geoJsonPoint3D,
    bbox: [1.0, 2.0, 10.0, 1.0, 2.0, 10.0],
} satisfies GeoJSON3DPoint;
