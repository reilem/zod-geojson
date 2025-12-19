import { GeoJSON2DMultiLineString, GeoJSON3DMultiLineString } from "../../src";
import {
    geoJsonLineString2D,
    geoJsonLineString2DWithBBox,
    geoJsonLineString3D,
    geoJsonLineString3DWithBBox,
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

export const singleGeoJsonMultiLineString2DWithBBox = {
    ...singleGeoJsonMultiLineString2D,
    bbox: geoJsonLineString2DWithBBox.bbox,
} satisfies GeoJSON2DMultiLineString;

export const multiGeoJsonMultiLineString2DWithBBox = {
    ...multiGeoJsonMultiLineString2D,
    bbox: [1.0, 2.0, 30.0, 30.0],
} satisfies GeoJSON2DMultiLineString;

export const singleGeoJsonMultiLineString3DWithBBox = {
    ...singleGeoJsonMultiLineString3D,
    bbox: geoJsonLineString3DWithBBox.bbox,
} satisfies GeoJSON3DMultiLineString;
