import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import {
    geoJsonFeaturePoint2D,
    geoJsonFeaturePoint3D,
    geoJsonFeaturePolygon2D,
    geoJsonFeaturePolygon3DWithBbox,
} from "../examples/feature";
import { GeoJSONFeatureSchema } from "../src";

function passGeoJSONFeatureSchemaTest(object: unknown) {
    expect(GeoJSONFeatureSchema.parse(object)).toEqual(object);
}
function failGeoJSONFeatureSchemaTest(object: unknown) {
    expect(() => GeoJSONFeatureSchema.parse(object)).toThrow(ZodError);
}

describe("GeoJSONFeature", () => {
    it("allows a feature with a 2D point geometry", () => {
        passGeoJSONFeatureSchemaTest(geoJsonFeaturePoint2D);
    });
    it("allows a feature with a 3D point geometry", () => {
        passGeoJSONFeatureSchemaTest(geoJsonFeaturePoint3D);
    });
    it("allows a feature with a 2D polygon geometry", () => {
        passGeoJSONFeatureSchemaTest(geoJsonFeaturePolygon2D);
    });
    it("allows a feature with a 3D polygon geometry and valid bbox", () => {
        passGeoJSONFeatureSchemaTest(geoJsonFeaturePolygon3DWithBbox);
    });
    it("allows a feature with a string id", () => {
        passGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            id: "unique-id",
        });
    });
    it("allows a feature with a number id", () => {
        passGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            id: 98765,
        });
    });
    it("allows a feature and preserves extra keys", () => {
        passGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            color: "#FF00FF",
        });
    });
    it("allows a feature with null geometry", () => {
        passGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometry: null,
        });
    });
    it("allows a feature with null properties", () => {
        passGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            properties: null,
        });
    });

    it("does not allow a feature without properties", () => {
        failGeoJSONFeatureSchemaTest({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [0.0, 2.0],
            },
        });
    });
    it("does not allow a feature without geometry", () => {
        failGeoJSONFeatureSchemaTest({
            type: "Feature",
            properties: {},
        });
    });
    it("does not allow a feature with the coordinates key", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            coordinates: [],
        });
    });
    it("does not allow a feature with the features key", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            features: [],
        });
    });
    it("does not allow a feature with the geometries key", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometries: [],
        });
    });
    it("does not allow a feature with a geometry with invalid type", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometry: {
                type: "BadType",
                coordinates: [0.0, 2.0],
            },
        });
    });
    it("does not allow a feature with a geometry with inconsistent position dimensions", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometry: {
                type: "MultiPoint",
                coordinates: [
                    [50.0, 10.0],
                    [0.0, 2.0, 3.0],
                ],
            },
        });
    });
    it("does not allow a feature with a geometry with invalid coordinates", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometry: {
                type: "Polygon",
                coordinates: [[[[[0.0, 10.0]]]]],
            },
        });
    });
    it("does not allow a feature with a geometry with incorrect bbox", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometry: {
                ...geoJsonFeaturePoint2D.geometry,
                bbox: [0.0, 0.0, 10.0, 10.0],
            },
        });
    });
    it("does not allow a feature with a geometry with invalid bbox dimensions", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometry: {
                ...geoJsonFeaturePoint2D.geometry,
                bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 0.0],
            },
        });
    });
    it("does not allow a feature with a geometry with badly formatted bbox", () => {
        failGeoJSONFeatureSchemaTest({
            ...geoJsonFeaturePoint2D,
            geometry: {
                ...geoJsonFeaturePoint2D.geometry,
                bbox: ["bbox must not contain strings"],
            },
        });
    });
});
