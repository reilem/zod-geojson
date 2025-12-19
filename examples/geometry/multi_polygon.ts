import { GeoJSON2DMultiPolygon, GeoJSON3DMultiPolygon } from "../../src";
import {
    geoJsonPolygon2D,
    geoJsonPolygon2DWithBBox,
    geoJsonPolygon2DWithHole,
    geoJsonPolygon2DWithHoleAndBBox,
    geoJsonPolygon3D,
    geoJsonPolygon3DWithBBox,
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

export const singleGeoJsonMultiPolygon2DWithBBox = {
    ...singleGeoJsonMultiPolygon2D,
    bbox: geoJsonPolygon2DWithBBox.bbox,
} satisfies GeoJSON2DMultiPolygon;

export const multiGeoJsonMultiPolygon2DWithBBox = {
    ...multiGeoJsonMultiPolygon2D,
    bbox: geoJsonPolygon2DWithHoleAndBBox.bbox,
} satisfies GeoJSON2DMultiPolygon;

export const singleGeoJsonMultiPolygon3DWithBBox = {
    ...singleGeoJsonMultiPolygon3D,
    bbox: geoJsonPolygon3DWithBBox.bbox,
} satisfies GeoJSON3DMultiPolygon;
