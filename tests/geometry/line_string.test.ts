import { describe, it } from "@jest/globals";
import {
    geoJsonLineString2D,
    geoJsonLineString2DWithBbox,
    geoJsonLineString3D,
    geoJsonLineString3DWithBbox,
} from "../../examples/geometry/line_string";
import { GeoJSONLineStringSchema } from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONLineStringTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(GeoJSONLineStringSchema, value);
}

function failGeoJSONLineStringTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(GeoJSONLineStringSchema, value);
}

describe("GeoJSONLineString", () => {
    it("allows a 2D line string", () => {
        passGeoJSONLineStringTest(geoJsonLineString2D);
    });
    it("allows a 3D line string", () => {
        passGeoJSONLineStringTest(geoJsonLineString3D);
    });
    it("allows 2D line string with valid bbox", () => {
        passGeoJSONLineStringTest(geoJsonLineString2DWithBbox);
    });
    it("allows 3D line string with valid bbox", () => {
        passGeoJSONLineStringTest(geoJsonLineString3DWithBbox);
    });
    it("allows a line string and preserves extra keys", () => {
        const geoJsonLineStringWithExtraKeys = {
            ...geoJsonLineString2D,
            extraKey: "extra",
        };
        passGeoJSONLineStringTest(geoJsonLineStringWithExtraKeys);
    });

    it("does not allow a line string without coordinates key", () => {
        failGeoJSONLineStringTest({ type: "LineString" });
    });
    it("does not allow a line string with the geometry key", () => {
        failGeoJSONLineStringTest({ ...geoJsonLineString2D, geometry: {} });
    });
    it("does not allow a line string with the properties key", () => {
        failGeoJSONLineStringTest({ ...geoJsonLineString2D, properties: {} });
    });
    it("does not allow a line string with the features key", () => {
        failGeoJSONLineStringTest({ ...geoJsonLineString2D, features: [] });
    });
    it("does not allow a line string with the geometries key", () => {
        failGeoJSONLineStringTest({ ...geoJsonLineString2D, geometries: [] });
    });
    it("does not allow line string with invalid coordinates", () => {
        failGeoJSONLineStringTest({
            ...geoJsonLineString2D,
            coordinates: [2.0],
        });
    });
    it("does not allow line string with insufficient coordinates", () => {
        failGeoJSONLineStringTest({
            ...geoJsonLineString2D,
            coordinates: [[1.0, 2.0, 3.0]],
        });
    });
    it("does not allow line string with inconsistent position dimensions", () => {
        failGeoJSONLineStringTest({
            ...geoJsonLineString2D,
            coordinates: [
                [0, 0],
                [1, 2, 3],
                [4, 5, 6, 7],
            ],
        });
    });
    it("does not allow line string with incorrect bbox", () => {
        failGeoJSONLineStringTest({
            ...geoJsonLineString2D,
            bbox: [30, 10, 20, 100],
        });
    });
    it("does not allow line string with invalid bbox dimensions", () => {
        failGeoJSONLineStringTest({
            ...geoJsonLineString2D,
            bbox: [1.0, 2.0, 0.0, 3.0, 4.0, 0.0],
        });
    });
    it("does not allow line string with badly formatted bbox", () => {
        failGeoJSONLineStringTest({
            ...geoJsonLineString2D,
            bbox: ["badformat"],
        });
    });
});
