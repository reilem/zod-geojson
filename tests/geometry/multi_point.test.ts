import { describe, it } from "vitest";
import { GeoJSONMultiPoint, GeoJSONMultiPointSchema } from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONMultiPointTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(GeoJSONMultiPointSchema, value);
}

function failGeoJSONMultiPointTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(GeoJSONMultiPointSchema, value);
}

describe("GeoJSONMultiPoint", () => {
    const basic2DGeoJsonMultiPoint: GeoJSONMultiPoint = {
        type: "MultiPoint",
        coordinates: [
            [0.0, 0.0],
            [-3.0, 4.0],
            [8.0, -2.0],
        ],
    };
    const basic3DGeoJsonMultiPoint: GeoJSONMultiPoint = {
        type: "MultiPoint",
        coordinates: [
            [0.0, 0.0, 0.0],
            [-3.0, 4.0, 5.0],
            [8.0, -2.0, 1.0],
        ],
    };

    it("allows a 2D multi-point", () => {
        passGeoJSONMultiPointTest(basic2DGeoJsonMultiPoint);
    });
    it("allows a 3D multi-point", () => {
        passGeoJSONMultiPointTest(basic3DGeoJsonMultiPoint);
    });
    it("allows a 2D multi-point with a valid bbox", () => {
        passGeoJSONMultiPointTest({
            ...basic2DGeoJsonMultiPoint,
            bbox: [-3.0, -2.0, 8.0, 4.0],
        });
    });
    it("allows a 3D multi-point with valid bbox", () => {
        passGeoJSONMultiPointTest({
            ...basic3DGeoJsonMultiPoint,
            bbox: [-3.0, -2.0, 0.0, 8.0, 4.0, 5.0],
        });
    });
    it("allows a multi point and preserves extra keys", () => {
        passGeoJSONMultiPointTest({
            ...basic2DGeoJsonMultiPoint,
            extraKey: "extra",
        });
    });

    it("does not allow a multi-point without coordinates", () => {
        failGeoJSONMultiPointTest({ type: "MultiPoint" });
    });
    it("does not allow a multi-point with the geometry key", () => {
        failGeoJSONMultiPointTest({ ...basic2DGeoJsonMultiPoint, geometry: {} });
    });
    it("does not allow a multi-point with the properties key", () => {
        failGeoJSONMultiPointTest({ ...basic2DGeoJsonMultiPoint, properties: {} });
    });
    it("does not allow a multi-point with the features key", () => {
        failGeoJSONMultiPointTest({ ...basic2DGeoJsonMultiPoint, features: [] });
    });
    it("does not allow a multi-point with the geometries key", () => {
        failGeoJSONMultiPointTest({ ...basic2DGeoJsonMultiPoint, geometries: [] });
    });
    it("does not allow a multi-point with invalid coordinates", () => {
        const geoJsonMultiPointWithInvalidCoordinates = {
            ...basic2DGeoJsonMultiPoint,
            coordinates: [
                // Too deeply nested
                [
                    [1.0, 2.0],
                    [3.0, 4.0],
                ],
            ],
        };
        failGeoJSONMultiPointTest(geoJsonMultiPointWithInvalidCoordinates);
    });
    it("does not allow multi-point with inconsistent position dimensions", () => {
        failGeoJSONMultiPointTest({
            ...basic2DGeoJsonMultiPoint,
            coordinates: [
                [0.0, 1.0],
                [2.0, 3.0, 4.0],
                [5.0, 6.0, 7.0, 8.0],
            ],
        });
    });
    it("does not allow a multi-point with incorrect bbox", () => {
        failGeoJSONMultiPointTest({
            ...basic2DGeoJsonMultiPoint,
            bbox: [30, 10, 20, 100],
        });
    });
    it("does not allow a multi-point with invalid bbox dimensions", () => {
        failGeoJSONMultiPointTest({
            ...basic2DGeoJsonMultiPoint,
            bbox: [1.0, 2.0, 0.0, 1.0, 2.0, 0.0],
        });
    });
    it("does not allow a multi-point with badly formatted bbox", () => {
        failGeoJSONMultiPointTest({
            ...basic2DGeoJsonMultiPoint,
            bbox: ["hello"],
        });
    });
});
