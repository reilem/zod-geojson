import { GeoJSON2DMultiPolygon, GeoJSON3DMultiPolygon } from "../../src";
import {
    geoJsonPolygon2D,
    geoJsonPolygon2DWithBbox,
    geoJsonPolygon2DWithHole,
    geoJsonPolygon2DWithHoleAndBbox,
    geoJsonPolygon3D,
    geoJsonPolygon3DWithBbox,
} from "./polygon";

export const singleGeoJsonMultiPolygon2D = {
    type: "MultiPolygon",
    coordinates: [geoJsonPolygon2D.coordinates],
} satisfies GeoJSON2DMultiPolygon;

export const multiGeoJsonMultiPolygon2D = {
    type: "MultiPolygon",
    coordinates: [geoJsonPolygon2D.coordinates, geoJsonPolygon2DWithHole.coordinates],
} satisfies GeoJSON2DMultiPolygon;

export const singleGeoJsonMultiPolygon3D = {
    type: "MultiPolygon",
    coordinates: [geoJsonPolygon3D.coordinates],
} satisfies GeoJSON3DMultiPolygon;

export const singleGeoJsonMultiPolygon2DWithBbox = {
    ...singleGeoJsonMultiPolygon2D,
    bbox: geoJsonPolygon2DWithBbox.bbox,
} satisfies GeoJSON2DMultiPolygon;

export const multiGeoJsonMultiPolygon2DWithBbox = {
    ...multiGeoJsonMultiPolygon2D,
    bbox: geoJsonPolygon2DWithHoleAndBbox.bbox,
} satisfies GeoJSON2DMultiPolygon;

export const singleGeoJsonMultiPolygon3DWithBbox = {
    ...singleGeoJsonMultiPolygon3D,
    bbox: geoJsonPolygon3DWithBbox.bbox,
} satisfies GeoJSON3DMultiPolygon;
