import { describe, it } from "vitest";
import { GeoJSONLineString, GeoJSONLineStringSchema } from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONLineStringTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(GeoJSONLineStringSchema, value);
}

function failGeoJSONLineStringTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(GeoJSONLineStringSchema, value);
}

describe("GeoJSONLineString", () => {
    const basicGeoJsonLineString: GeoJSONLineString = {
        type: "LineString",
        coordinates: [
            [1.0, 2.0],
            [3.0, 4.0],
        ],
    };

    it("allows a 2D line string", () => {
        passGeoJSONLineStringTest(basicGeoJsonLineString);
    });
    it("allows a 3D line string", () => {
        passGeoJSONLineStringTest({
            ...basicGeoJsonLineString,
            coordinates: [
                [0.0, 0.0, 0.0],
                [1.0, 1.0, 1.0],
                [2.0, 2.0, 2.0],
                [3.0, 3.0, 3.0],
                [4.0, 4.0, 4.0],
                [5.0, 5.0, 5.0],
            ],
        });
    });
    it("allows 2D line string with valid bbox", () => {
        passGeoJSONLineStringTest({
            ...basicGeoJsonLineString,
            bbox: [1.0, 2.0, 3.0, 4.0],
        });
    });
    it("allows 3D line string with valid bbox", () => {
        passGeoJSONLineStringTest({
            ...basicGeoJsonLineString,
            coordinates: [
                [0.0, 0.0, 0.0],
                [1.0, 3.0, 2.0],
                [10.0, 9.0, 8.0],
            ],
            bbox: [0.0, 0.0, 0.0, 10.0, 9.0, 8.0],
        });
    });
    it("allows a line string and preserves extra keys", () => {
        const geoJsonLineStringWithExtraKeys = {
            ...basicGeoJsonLineString,
            extraKey: "extra",
        };
        passGeoJSONLineStringTest(geoJsonLineStringWithExtraKeys);
    });

    it("does not allow a line string without coordinates", () => {
        failGeoJSONLineStringTest({ type: "LineString" });
    });
    it("does not allow a line string with the geometry key", () => {
        failGeoJSONLineStringTest({ ...basicGeoJsonLineString, geometry: {} });
    });
    it("does not allow a line string with the properties key", () => {
        failGeoJSONLineStringTest({ ...basicGeoJsonLineString, properties: {} });
    });
    it("does not allow a line string with the features key", () => {
        failGeoJSONLineStringTest({ ...basicGeoJsonLineString, features: [] });
    });
    it("does not allow a line string with the geometries key", () => {
        failGeoJSONLineStringTest({ ...basicGeoJsonLineString, geometries: [] });
    });
    it("does not allow line string with invalid coordinates", () => {
        failGeoJSONLineStringTest({
            ...basicGeoJsonLineString,
            coordinates: [2.0],
        });
    });
    it("does not allow line string with insufficient coordinates", () => {
        failGeoJSONLineStringTest({
            ...basicGeoJsonLineString,
            coordinates: [[1.0, 2.0, 3.0]],
        });
    });
    it("does not allow line string with inconsistent position dimensions", () => {
        failGeoJSONLineStringTest({
            ...basicGeoJsonLineString,
            coordinates: [
                [0, 0],
                [1, 2, 3],
                [4, 5, 6, 7],
            ],
        });
    });
    it("does not allow line string with incorrect bbox", () => {
        failGeoJSONLineStringTest({
            ...basicGeoJsonLineString,
            bbox: [30, 10, 20, 100],
        });
    });
    it("does not allow line string with invalid bbox dimensions", () => {
        failGeoJSONLineStringTest({
            ...basicGeoJsonLineString,
            bbox: [1.0, 2.0, 0.0, 3.0, 4.0, 0.0],
        });
    });
    it("does not allow line string with badly formatted bbox", () => {
        failGeoJSONLineStringTest({
            ...basicGeoJsonLineString,
            bbox: ["badformat"],
        });
    });
});
