import { describe, it } from "vitest";
import { GeoJSONPolygonSchema, GeoJSONPolygon } from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONPolygonTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(GeoJSONPolygonSchema, value);
}

function failGeoJSONPolygonTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(GeoJSONPolygonSchema, value);
}

describe("GeoJSONPolygon", () => {
    const basic2DGeoJsonPolygon: GeoJSONPolygon = {
        type: "Polygon",
        coordinates: [
            [
                [0.0, 0.0],
                [1.0, 0.0],
                [1.0, 1.0],
                [0.0, 1.0],
                [0.0, 0.0],
            ],
        ],
    };
    const basic3DGeoJsonPolygon: GeoJSONPolygon = {
        type: "Polygon",
        coordinates: [
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [1.0, 1.0, 2.0],
                [0.0, 2.0, 2.0],
                [0.0, 0.0, 0.0],
            ],
        ],
    };
    const geoJsonPolygonWithHole: GeoJSONPolygon = {
        ...basic2DGeoJsonPolygon,
        coordinates: [
            [
                [0.0, 0.0],
                [10.0, 0.0],
                [10.0, 10.0],
                [0.0, 10.0],
                [0.0, 0.0],
            ],
            [
                [4.0, 4.0],
                [6.0, 4.0],
                [6.0, 6.0],
                [4.0, 6.0],
                [4.0, 4.0],
            ],
        ],
    };

    it("allows a 2D polygon", () => {
        passGeoJSONPolygonTest(basic2DGeoJsonPolygon);
    });
    it("allows a 3D polygon", () => {
        passGeoJSONPolygonTest(basic3DGeoJsonPolygon);
    });
    it("allows a 2D polygon with bbox", () => {
        passGeoJSONPolygonTest({
            ...basic2DGeoJsonPolygon,
            bbox: [0.0, 0.0, 1.0, 1.0],
        });
    });
    it("allows a 3D polygon with bbox", () => {
        passGeoJSONPolygonTest({
            ...basic3DGeoJsonPolygon,
            bbox: [0.0, 0.0, 0.0, 1.0, 2.0, 2.0],
        });
    });
    it("allows a 2D polygon with a hole", () => {
        passGeoJSONPolygonTest(geoJsonPolygonWithHole);
    });
    it("allows a 2D polygon with a hole and bbox", () => {
        passGeoJSONPolygonTest({
            ...geoJsonPolygonWithHole,
            bbox: [0.0, 0.0, 10.0, 10.0],
        });
    });
    it("allows a polygon and preserves extra keys", () => {
        passGeoJSONPolygonTest({
            ...basic2DGeoJsonPolygon,
            extraKey: "extra",
        });
    });

    it("does not allow a polygon without coordinates", () => {
        failGeoJSONPolygonTest({ type: "Polygon" });
    });
    it("does not allow a polygon with the geometry key", () => {
        failGeoJSONPolygonTest({ ...basic2DGeoJsonPolygon, geometry: {} });
    });
    it("does not allow a polygon with the properties key", () => {
        failGeoJSONPolygonTest({ ...basic2DGeoJsonPolygon, properties: {} });
    });
    it("does not allow a polygon with the features key", () => {
        failGeoJSONPolygonTest({ ...basic2DGeoJsonPolygon, features: [] });
    });
    it("does not allow a polygon with the geometries key", () => {
        failGeoJSONPolygonTest({ ...basic2DGeoJsonPolygon, geometries: [] });
    });
    it("does not allow a polygon which is not linear ring", () => {
        failGeoJSONPolygonTest({
            ...basic2DGeoJsonPolygon,
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
            ...basic2DGeoJsonPolygon,
            coordinates: [
                [0.0, 0.0],
                [1.0, 0.0],
                [0.0, 0.0],
            ],
        });
    });
    it("does not allow a polygon with less than 4 positions", () => {
        failGeoJSONPolygonTest({
            ...basic2DGeoJsonPolygon,
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
            ...basic2DGeoJsonPolygon,
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
            ...basic2DGeoJsonPolygon,
            bbox: [30, 10, 20, 100],
        });
    });
    it("does not allow a polygon with invalid bbox dimensions", () => {
        failGeoJSONPolygonTest({
            ...basic2DGeoJsonPolygon,
            bbox: [0.0, 0.0, 0.0, 1.0, 1.0, 0.0],
        });
    });
    it("does not allow a polygon with badly formatted bbox", () => {
        failGeoJSONPolygonTest({
            ...basic2DGeoJsonPolygon,
            bbox: ["hello"],
        });
    });
});
