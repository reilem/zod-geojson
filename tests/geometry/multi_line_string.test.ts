import { describe, it } from "vitest";
import { GeoJSONMultiLineString, GeoJSONMultiLineStringSchema } from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONMultiLineStringTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(GeoJSONMultiLineStringSchema, value);
}

function failGeoJSONMultiLineStringTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(GeoJSONMultiLineStringSchema, value);
}

describe("GeoJSONMultiLineString", () => {
    const singleMultiLineString2D: GeoJSONMultiLineString = {
        type: "MultiLineString",
        coordinates: [
            [
                [0.0, 0.0],
                [10.0, 10.0],
            ],
        ],
    };
    const multiMultiLineString2D: GeoJSONMultiLineString = {
        type: "MultiLineString",
        coordinates: [
            [
                [5.0, 5.0],
                [10.0, 10.0],
            ],
            [
                [20.0, 20.0],
                [30.0, 30.0],
            ],
        ],
    };
    const singleMultiLineString3D: GeoJSONMultiLineString = {
        type: "MultiLineString",
        coordinates: [
            [
                [0.0, 0.0, 0.0],
                [10.0, 10.0, 10.0],
            ],
        ],
    };

    it("allows a 2D multi-line string with one line", () => {
        passGeoJSONMultiLineStringTest(singleMultiLineString2D);
    });
    it("allows a 2D multi-line string with multiple lines", () => {
        passGeoJSONMultiLineStringTest(multiMultiLineString2D);
    });
    it("allows a 3D multi-line string", () => {
        passGeoJSONMultiLineStringTest(singleMultiLineString3D);
    });
    it("allows a 2D multi-line string with one line and bbox", () => {
        passGeoJSONMultiLineStringTest({
            ...singleMultiLineString2D,
            bbox: [0.0, 0.0, 10.0, 10.0],
        });
    });
    it("allows a 2D multi-line string with multiples and with bbox", () => {
        passGeoJSONMultiLineStringTest({
            ...multiMultiLineString2D,
            bbox: [5.0, 5.0, 30.0, 30.0],
        });
    });
    it("allows a 3D multi-line string with bbox", () => {
        passGeoJSONMultiLineStringTest({
            ...singleMultiLineString3D,
            bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 10.0],
        });
    });
    it("allows a multi-line string and preserves extra keys", () => {
        passGeoJSONMultiLineStringTest({
            ...singleMultiLineString2D,
            extraKey: "extra",
        });
    });

    it("does not allow a multi-line string without coordinates", () => {
        failGeoJSONMultiLineStringTest({ type: "MultiLineString" });
    });
    it("does not allow a multi-line string with the geometry key", () => {
        failGeoJSONMultiLineStringTest({ ...singleMultiLineString2D, geometry: {} });
    });
    it("does not allow a multi-line string with the properties key", () => {
        failGeoJSONMultiLineStringTest({ ...singleMultiLineString2D, properties: {} });
    });
    it("does not allow a multi-line string with the features key", () => {
        failGeoJSONMultiLineStringTest({ ...singleMultiLineString2D, features: [] });
    });
    it("does not allow a multi-line string with the geometries key", () => {
        failGeoJSONMultiLineStringTest({ ...singleMultiLineString2D, geometries: [] });
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
            ...singleMultiLineString2D,
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
            ...singleMultiLineString2D,
            coordinates: [
                [
                    [0.0, 0.0],
                    [10.0, 10.0],
                ],
                [
                    [-5.0, 10.0, 2.0],
                    [10.0, -2.0, 3.0],
                ],
            ],
        });
    });
    it("does not allow a multi-line string with incorrect bbox", () => {
        failGeoJSONMultiLineStringTest({
            ...singleMultiLineString2D,
            bbox: [30, 10, 20, 100],
        });
    });
    it("does not allow a multi-line string with invalid bbox dimensions", () => {
        failGeoJSONMultiLineStringTest({
            ...singleMultiLineString2D,
            bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 0.0],
        });
    });
    it("does not allow a multi-line string with badly formatted bbox", () => {
        failGeoJSONMultiLineStringTest({
            ...singleMultiLineString2D,
            bbox: ["hello"],
        });
    });
});
