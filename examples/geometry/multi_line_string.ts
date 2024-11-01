import { GeoJSON2DMultiLineString, GeoJSON3DMultiLineString } from "../../src";
import {
    geoJsonLineString2D,
    geoJsonLineString2DWithBbox,
    geoJsonLineString3D,
    geoJsonLineString3DWithBbox,
} from "./line_string";

export const singleGeoJsonMultiLineString2D: GeoJSON2DMultiLineString = {
    type: "MultiLineString",
    coordinates: [geoJsonLineString2D.coordinates],
};
export const multiGeoJsonMultiLineString2D: GeoJSON2DMultiLineString = {
    type: "MultiLineString",
    coordinates: [
        geoJsonLineString2D.coordinates,
        [
            [20.0, 20.0],
            [30.0, 30.0],
        ],
    ],
};

export const singleGeoJsonMultiLineString3D: GeoJSON3DMultiLineString = {
    type: "MultiLineString",
    coordinates: [geoJsonLineString3D.coordinates],
};

export const singleGeoJsonMultiLineString2DWithBbox: GeoJSON2DMultiLineString = {
    ...singleGeoJsonMultiLineString2D,
    bbox: geoJsonLineString2DWithBbox.bbox,
};

export const multiGeoJsonMultiLineString2DWithBbox: GeoJSON2DMultiLineString = {
    ...multiGeoJsonMultiLineString2D,
    bbox: [1.0, 2.0, 30.0, 30.0],
};

export const singleGeoJsonMultiLineString3DWithBbox: GeoJSON3DMultiLineString = {
    ...singleGeoJsonMultiLineString3D,
    bbox: geoJsonLineString3DWithBbox.bbox,
};
