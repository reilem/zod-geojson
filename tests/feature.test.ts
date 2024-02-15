import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { GeoJSONFeature, GeoJSONFeatureSchema } from "../src";

function passGeoJSONFeatureSchemaTest(object: unknown) {
    expect(GeoJSONFeatureSchema.parse(object)).toEqual(object);
}
function failGeoJSONFeatureSchemaTest(object: unknown) {
    expect(() => GeoJSONFeatureSchema.parse(object)).toThrow(ZodError);
}

describe("GeoJSONFeature", () => {
    const point2DFeature: GeoJSONFeature = {
        type: "Feature",
        properties: {},
        geometry: {
            type: "Point",
            coordinates: [0.0, 2.0],
        },
    };
    const point3DFeature: GeoJSONFeature = {
        type: "Feature",
        properties: {},
        geometry: {
            type: "Point",
            coordinates: [0.0, 2.0, 3.0],
        },
    };
    const polygon2DFeature: GeoJSONFeature = {
        type: "Feature",
        properties: {},
        geometry: {
            type: "Polygon",
            coordinates: [
                [
                    [0.0, 0.0],
                    [0.0, 10.0],
                    [10.0, 10.0],
                    [0.0, 0.0],
                ],
            ],
        },
    };
    const polygon3DFeature: GeoJSONFeature = {
        type: "Feature",
        properties: {},
        geometry: {
            type: "Polygon",
            coordinates: [
                [
                    [0.0, 0.0, 0.0],
                    [0.0, 10.0, 5.0],
                    [10.0, 10.0, 8.0],
                    [0.0, 0.0, 0.0],
                ],
            ],
        },
    };

    it("allows a feature with a 2D point geometry", () => {
        passGeoJSONFeatureSchemaTest(point2DFeature);
    });
    it("allows a feature with a 3D point geometry", () => {
        passGeoJSONFeatureSchemaTest(point3DFeature);
    });
    it("allows a feature with a 2D polygon geometry", () => {
        passGeoJSONFeatureSchemaTest(polygon2DFeature);
    });
    it("allows a feature with a 3D polygon geometry and valid bbox", () => {
        passGeoJSONFeatureSchemaTest(polygon3DFeature);
    });
    it("allows a feature with a string id", () => {
        passGeoJSONFeatureSchemaTest({
            ...point2DFeature,
            id: "unique-id",
        });
    });
    it("allows a feature with a number id", () => {
        passGeoJSONFeatureSchemaTest({
            ...point2DFeature,
            id: 98765,
        });
    });
    it("allows a feature and preserves extra keys", () => {
        passGeoJSONFeatureSchemaTest({
            ...point2DFeature,
            color: "#FF00FF",
        });
    });
    it("allows a feature with null geometry", () => {
        passGeoJSONFeatureSchemaTest({
            ...point2DFeature,
            geometry: null,
        });
    });
    it("allows a feature with null properties", () => {
        passGeoJSONFeatureSchemaTest({
            ...point2DFeature,
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
            ...point2DFeature,
            coordinates: [],
        });
    });
    it("does not allow a feature with the features key", () => {
        failGeoJSONFeatureSchemaTest({
            ...point2DFeature,
            features: [],
        });
    });
    it("does not allow a feature with the geometries key", () => {
        failGeoJSONFeatureSchemaTest({
            ...point2DFeature,
            geometries: [],
        });
    });
    it("does not allow a feature with a geometry with invalid type", () => {
        failGeoJSONFeatureSchemaTest({
            ...point2DFeature,
            geometry: {
                type: "BadType",
                coordinates: [0.0, 2.0],
            },
        });
    });
    it("does not allow a feature with a geometry with inconsistent position dimensions", () => {
        failGeoJSONFeatureSchemaTest({
            ...point2DFeature,
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
            ...point2DFeature,
            geometry: {
                type: "Polygon",
                coordinates: [[[[[0.0, 10.0]]]]],
            },
        });
    });
    it("does not allow a feature with a geometry with incorrect bbox", () => {
        failGeoJSONFeatureSchemaTest({
            ...polygon2DFeature,
            geometry: {
                ...point2DFeature.geometry,
                bbox: [0.0, 0.0, 10.0, 10.0],
            },
        });
    });
    it("does not allow a feature with a geometry with invalid bbox dimensions", () => {
        failGeoJSONFeatureSchemaTest({
            ...polygon2DFeature,
            geometry: {
                ...point2DFeature.geometry,
                bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 0.0],
            },
        });
    });
    it("does not allow a feature with a geometry with badly formatted bbox", () => {
        failGeoJSONFeatureSchemaTest({
            ...polygon2DFeature,
            geometry: {
                ...point2DFeature.geometry,
                bbox: ["bbox must not contain strings"],
            },
        });
    });
});
