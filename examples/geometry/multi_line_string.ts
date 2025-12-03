import { GeoJSON2DMultiLineString, GeoJSON3DMultiLineString } from "../../src";
import {
    geoJsonLineString2D,
    geoJsonLineString2DWithBbox,
    geoJsonLineString3D,
    geoJsonLineString3DWithBbox,
} from "./line_string";

export const singleGeoJsonMultiLineString2D = {
    type: "MultiLineString",
    coordinates: [geoJsonLineString2D.coordinates],
} satisfies GeoJSON2DMultiLineString;

export const multiGeoJsonMultiLineString2D = {
    type: "MultiLineString",
    coordinates: [
        geoJsonLineString2D.coordinates,
        [
            [20.0, 20.0],
            [30.0, 30.0],
        ],
    ],
} satisfies GeoJSON2DMultiLineString;

export const singleGeoJsonMultiLineString3D = {
    type: "MultiLineString",
    coordinates: [geoJsonLineString3D.coordinates],
} satisfies GeoJSON3DMultiLineString;

export const singleGeoJsonMultiLineString2DWithBbox = {
    ...singleGeoJsonMultiLineString2D,
    bbox: geoJsonLineString2DWithBbox.bbox,
} satisfies GeoJSON2DMultiLineString;

export const multiGeoJsonMultiLineString2DWithBbox = {
    ...multiGeoJsonMultiLineString2D,
    bbox: [1.0, 2.0, 30.0, 30.0],
} satisfies GeoJSON2DMultiLineString;

export const singleGeoJsonMultiLineString3DWithBbox = {
    ...singleGeoJsonMultiLineString3D,
    bbox: geoJsonLineString3DWithBbox.bbox,
} satisfies GeoJSON3DMultiLineString;
