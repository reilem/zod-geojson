import { GeoJSON2DPolygon, GeoJSON3DPolygon, GeoJSONPolygon } from "../../src";

export const geoJsonPolygon2D: GeoJSON2DPolygon = {
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
};

export const geoJsonPolygon3D: GeoJSON3DPolygon = {
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
};

export const geoJsonPolygon2DWithHole: GeoJSON2DPolygon = {
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
};

export const geoJsonPolygon2DWithBbox: GeoJSON2DPolygon = {
    ...geoJsonPolygon2D,
    bbox: [0.0, 0.0, 1.0, 1.0],
};

export const geoJsonPolygon3DWithBbox: GeoJSON3DPolygon = {
    ...geoJsonPolygon3D,
    bbox: [0.0, 0.0, 0.0, 1.0, 2.0, 2.0],
};

export const geoJsonPolygon2DWithHoleAndBbox: GeoJSON2DPolygon = {
    ...geoJsonPolygon2DWithHole,
    bbox: [0.0, 0.0, 10.0, 10.0],
};

export const geoJsonPolygon4D: GeoJSONPolygon = {
    type: "Polygon",
    coordinates: [
        [
            [0.0, 0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0, 0.0],
            [1.0, 1.0, 2.0, 0.0],
            [0.0, 2.0, 2.0, 0.0],
            [0.0, 0.0, 0.0, 0.0],
        ],
    ],
};
