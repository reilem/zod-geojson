import { GeoJSON2DPolygon, GeoJSON3DPolygon } from "../../src";

export const geoJsonPolygon2D = {
    type: "Polygon",
    coordinates: [
        [
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
            [0.0, 0.0],
        ],
    ],
} satisfies GeoJSON2DPolygon;

export const geoJsonPolygon3D = {
    type: "Polygon",
    coordinates: [
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [1.0, 1.0, 2.0],
            [0.0, 2.0, 2.0],
            [0.0, 0.0, 0.0],
        ],
    ],
} satisfies GeoJSON3DPolygon;

export const geoJsonPolygon2DWithHole = {
    ...geoJsonPolygon2D,
    coordinates: [
        [
            [0.0, 0.0],
            [10.0, 0.0],
            [10.0, 10.0],
            [0.0, 10.0],
            [0.0, 0.0],
        ],
        [
            [4.0, 4.0],
            [6.0, 4.0],
            [6.0, 6.0],
            [4.0, 6.0],
            [4.0, 4.0],
        ],
    ],
} satisfies GeoJSON2DPolygon;

export const geoJsonPolygon2DWithBbox = {
    ...geoJsonPolygon2D,
    bbox: [0.0, 0.0, 1.0, 1.0],
} satisfies GeoJSON2DPolygon;

export const geoJsonPolygon3DWithBbox = {
    ...geoJsonPolygon3D,
    bbox: [0.0, 0.0, 0.0, 1.0, 2.0, 2.0],
} satisfies GeoJSON3DPolygon;

export const geoJsonPolygon2DWithHoleAndBbox = {
    ...geoJsonPolygon2DWithHole,
    bbox: [0.0, 0.0, 10.0, 10.0],
} satisfies GeoJSON2DPolygon;
