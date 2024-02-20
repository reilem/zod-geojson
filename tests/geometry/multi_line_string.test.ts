import { describe, it } from "@jest/globals";
import { geoJsonLineString2D, geoJsonLineString3D } from "../../examples/geometry/line_string";
import {
    multiGeoJsonMultiLineString2D,
    multiGeoJsonMultiLineString2DWithBbox,
    singleGeoJsonMultiLineString2D,
    singleGeoJsonMultiLineString2DWithBbox,
    singleGeoJsonMultiLineString3D,
    singleGeoJsonMultiLineString3DWithBbox,
} from "../../examples/geometry/multi_line_string";
import { GeoJSONMultiLineStringSchema } from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONMultiLineStringTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(GeoJSONMultiLineStringSchema, value);
}

function failGeoJSONMultiLineStringTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(GeoJSONMultiLineStringSchema, value);
}

describe("GeoJSONMultiLineString", () => {
    it("allows a 2D multi-line string with one line", () => {
        passGeoJSONMultiLineStringTest(singleGeoJsonMultiLineString2D);
    });
    it("allows a 2D multi-line string with multiple lines", () => {
        passGeoJSONMultiLineStringTest(multiGeoJsonMultiLineString2D);
    });
    it("allows a 3D multi-line string", () => {
        passGeoJSONMultiLineStringTest(singleGeoJsonMultiLineString3D);
    });
    it("allows a 2D multi-line string with one line and bbox", () => {
        passGeoJSONMultiLineStringTest(singleGeoJsonMultiLineString2DWithBbox);
    });
    it("allows a 2D multi-line string with multiples and with bbox", () => {
        passGeoJSONMultiLineStringTest(multiGeoJsonMultiLineString2DWithBbox);
    });
    it("allows a 3D multi-line string with bbox", () => {
        passGeoJSONMultiLineStringTest(singleGeoJsonMultiLineString3DWithBbox);
    });
    it("allows a multi-line string and preserves extra keys", () => {
        passGeoJSONMultiLineStringTest({
            ...singleGeoJsonMultiLineString2D,
            extraKey: "extra",
        });
    });

    it("does not allow a multi-line string without coordinates", () => {
        failGeoJSONMultiLineStringTest({ type: "MultiLineString" });
    });
    it("does not allow a multi-line string with the geometry key", () => {
        failGeoJSONMultiLineStringTest({ ...singleGeoJsonMultiLineString2D, geometry: {} });
    });
    it("does not allow a multi-line string with the properties key", () => {
        failGeoJSONMultiLineStringTest({ ...singleGeoJsonMultiLineString2D, properties: {} });
    });
    it("does not allow a multi-line string with the features key", () => {
        failGeoJSONMultiLineStringTest({ ...singleGeoJsonMultiLineString2D, features: [] });
    });
    it("does not allow a multi-line string with the geometries key", () => {
        failGeoJSONMultiLineStringTest({ ...singleGeoJsonMultiLineString2D, geometries: [] });
    });
    it("does not allow a multi-line string with invalid coordinates", () => {
        failGeoJSONMultiLineStringTest({
            type: "MultiLineString",
            coordinates: [
                // Not nested deep enough
                [0.0, 0.0],
                [10.0, 10.0],
            ],
        });
    });
    it("does not allow a multi-line string with inconsistent position dimensions", () => {
        failGeoJSONMultiLineStringTest({
            ...singleGeoJsonMultiLineString2D,
            coordinates: [
                [
                    [0.0, 0.0],
                    [10.0, 10.0, 0.0],
                ],
            ],
        });
    });
    it("does not allow a multi-line string with inconsistent position dimensions across lines", () => {
        failGeoJSONMultiLineStringTest({
            ...singleGeoJsonMultiLineString2D,
            coordinates: [geoJsonLineString2D, geoJsonLineString3D],
        });
    });
    it("does not allow a multi-line string with incorrect bbox", () => {
        failGeoJSONMultiLineStringTest({
            ...singleGeoJsonMultiLineString2D,
            bbox: [30, 10, 20, 100],
        });
    });
    it("does not allow a multi-line string with invalid bbox dimensions", () => {
        failGeoJSONMultiLineStringTest({
            ...singleGeoJsonMultiLineString2D,
            bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 0.0],
        });
    });
    it("does not allow a multi-line string with badly formatted bbox", () => {
        failGeoJSONMultiLineStringTest({
            ...singleGeoJsonMultiLineString2D,
            bbox: ["hello"],
        });
    });
});
