import { describe, it } from "vitest";
import { geoJsonPoint2D, geoJsonPoint2DWithBbox, geoJsonPoint3D, geoJsonPoint3DWithBbox } from "../../examples/point";
import { GeoJSONPointSchema } from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONPointTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(GeoJSONPointSchema, value);
}

function failGeoJSONPointTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(GeoJSONPointSchema, value);
}

describe("GeoJSONPoint", () => {
    it("allows a 2d point", () => {
        passGeoJSONPointTest(geoJsonPoint2D);
    });
    it("allows a 3D point", () => {
        passGeoJSONPointTest(geoJsonPoint3D);
    });
    it("allows a 6D point", () => {
        passGeoJSONPointTest({
            ...geoJsonPoint2D,
            coordinates: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0],
        });
    });
    it("allows a 2D point with valid bbox", () => {
        passGeoJSONPointTest(geoJsonPoint2DWithBbox);
    });
    it("allows a 3D point with valid bbox", () => {
        passGeoJSONPointTest(geoJsonPoint3DWithBbox);
    });
    it("allows a point and preserves extra keys", () => {
        const geoJsonPointWithExtraKeys = {
            ...geoJsonPoint2D,
            extraKey: "extra",
        };
        passGeoJSONPointTest(geoJsonPointWithExtraKeys);
    });

    it("does not allow a point without coordinates", () => {
        failGeoJSONPointTest({ type: "Point" });
    });
    it("does not allow a point with the geometry key", () => {
        failGeoJSONPointTest({ ...geoJsonPoint2D, geometry: {} });
    });
    it("does not allow a point with the properties key", () => {
        failGeoJSONPointTest({ ...geoJsonPoint2D, properties: {} });
    });
    it("does not allow a point with the features key", () => {
        failGeoJSONPointTest({ ...geoJsonPoint2D, features: [] });
    });
    it("does not allow a point with the geometries key", () => {
        failGeoJSONPointTest({ ...geoJsonPoint2D, geometries: [] });
    });
    it("does not allow a point with incorrect bbox", () => {
        failGeoJSONPointTest({
            ...geoJsonPoint2D,
            bbox: [30, 10, 20, 100],
        });
    });
    it("does not allow a point with invalid bbox dimensions", () => {
        failGeoJSONPointTest({
            ...geoJsonPoint2D,
            bbox: [1.0, 2.0, 0.0, 1.0, 2.0, 0.0],
        });
    });
    it("does not allow a point with badly formatted bbox", () => {
        failGeoJSONPointTest({
            ...geoJsonPoint2D,
            bbox: ["hello"],
        });
    });
    it("does not allow a point with invalid coordinates", () => {
        failGeoJSONPointTest({
            ...geoJsonPoint2D,
            coordinates: ["3ght45y34", 39284],
        });
    });
    it("does not allow a point with empty coordinates", () => {
        failGeoJSONPointTest({
            ...geoJsonPoint2D,
            coordinates: [],
        });
    });
});
