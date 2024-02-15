import { describe, it } from "vitest";
import {
    geoJsonPolygon2D,
    geoJsonPolygon2DWithHole,
    geoJsonPolygon2DWithHoleAndBbox,
    geoJsonPolygon3D,
} from "../../examples/geometry/polygon";
import { GeoJSONPolygonSchema } from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONPolygonTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(GeoJSONPolygonSchema, value);
}

function failGeoJSONPolygonTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(GeoJSONPolygonSchema, value);
}

describe("GeoJSONPolygon", () => {
    it("allows a 2D polygon", () => {
        passGeoJSONPolygonTest(geoJsonPolygon2D);
    });
    it("allows a 3D polygon", () => {
        passGeoJSONPolygonTest(geoJsonPolygon3D);
    });
    it("allows a 2D polygon with a hole", () => {
        passGeoJSONPolygonTest(geoJsonPolygon2DWithHole);
    });
    it("allows a 2D polygon with bbox", () => {
        passGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            bbox: [0.0, 0.0, 1.0, 1.0],
        });
    });
    it("allows a 3D polygon with bbox", () => {
        passGeoJSONPolygonTest({
            ...geoJsonPolygon3D,
            bbox: [0.0, 0.0, 0.0, 1.0, 2.0, 2.0],
        });
    });
    it("allows a 2D polygon with a hole and bbox", () => {
        passGeoJSONPolygonTest(geoJsonPolygon2DWithHoleAndBbox);
    });
    it("allows a polygon and preserves extra keys", () => {
        passGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            extraKey: "extra",
        });
    });

    it("does not allow a polygon without coordinates", () => {
        failGeoJSONPolygonTest({ type: "Polygon" });
    });
    it("does not allow a polygon with the geometry key", () => {
        failGeoJSONPolygonTest({ ...geoJsonPolygon2D, geometry: {} });
    });
    it("does not allow a polygon with the properties key", () => {
        failGeoJSONPolygonTest({ ...geoJsonPolygon2D, properties: {} });
    });
    it("does not allow a polygon with the features key", () => {
        failGeoJSONPolygonTest({ ...geoJsonPolygon2D, features: [] });
    });
    it("does not allow a polygon with the geometries key", () => {
        failGeoJSONPolygonTest({ ...geoJsonPolygon2D, geometries: [] });
    });
    it("does not allow a polygon which is not linear ring", () => {
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            coordinates: [
                [
                    [0.0, 0.0],
                    [1.0, 0.0],
                    [1.0, 1.0],
                    [0.0, 1.0],
                ],
            ],
        });
    });
    it("does not allow a polygon with invalid coordinates", () => {
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            coordinates: [
                [0.0, 0.0],
                [1.0, 0.0],
                [0.0, 0.0],
            ],
        });
    });
    it("does not allow a polygon with less than 4 positions", () => {
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            coordinates: [
                [
                    [0.0, 0.0],
                    [1.0, 0.0],
                    [0.0, 0.0],
                ],
            ],
        });
    });
    it("does not allow a polygon with inconsistent position dimensions", () => {
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            coordinates: [
                [
                    [0.0, 0.0],
                    [1.0, 0.0],
                    [1.0, 1.0],
                    [0.0, 0.0],
                ],
                [
                    [0.0, 0.0, 0.0],
                    [1.0, 0.0, 0.0],
                    [1.0, 1.0, 0.0],
                    [0.0, 0.0, 0.0],
                ],
            ],
        });
    });
    it("does not allow a polygon with incorrect bbox", () => {
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            bbox: [30, 10, 20, 100],
        });
    });
    it("does not allow a polygon with invalid bbox dimensions", () => {
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            bbox: [0.0, 0.0, 0.0, 1.0, 1.0, 0.0],
        });
    });
    it("does not allow a polygon with badly formatted bbox", () => {
        failGeoJSONPolygonTest({
            ...geoJsonPolygon2D,
            bbox: ["hello"],
        });
    });
});
