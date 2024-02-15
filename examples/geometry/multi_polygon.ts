import { GeoJSONMultiPolygon } from "../../src";
import {
    geoJsonPolygon2D,
    geoJsonPolygon2DWithBbox,
    geoJsonPolygon2DWithHole,
    geoJsonPolygon2DWithHoleAndBbox,
    geoJsonPolygon3D,
    geoJsonPolygon3DWithBbox,
} from "./polygon";

export const singleGeoJsonMultiPolygon2D: GeoJSONMultiPolygon = {
    type: "MultiPolygon",
    coordinates: [geoJsonPolygon2D.coordinates],
};

export const multiGeoJsonMultiPolygon2D: GeoJSONMultiPolygon = {
    type: "MultiPolygon",
    coordinates: [geoJsonPolygon2D.coordinates, geoJsonPolygon2DWithHole.coordinates],
};

export const singleGeoJsonMultiPolygon3D: GeoJSONMultiPolygon = {
    type: "MultiPolygon",
    coordinates: [geoJsonPolygon3D.coordinates],
};

export const singleGeoJsonMultiPolygon2DWithBbox: GeoJSONMultiPolygon = {
    ...singleGeoJsonMultiPolygon2D,
    bbox: geoJsonPolygon2DWithBbox.bbox,
};

export const multiGeoJsonMultiPolygon2DWithBbox: GeoJSONMultiPolygon = {
    ...multiGeoJsonMultiPolygon2D,
    bbox: geoJsonPolygon2DWithHoleAndBbox.bbox,
};

export const singleGeoJsonMultiPolygon3DWithBbox: GeoJSONMultiPolygon = {
    ...singleGeoJsonMultiPolygon3D,
    bbox: geoJsonPolygon3DWithBbox.bbox,
};
