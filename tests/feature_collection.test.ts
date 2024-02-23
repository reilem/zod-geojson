import { describe, expect, it } from "@jest/globals";
import { ZodError } from "zod";
import { geoJsonFeaturePoint2D, geoJsonFeaturePoint3D } from "../examples/feature";
import {
    multiGeoJsonFeatureCollection,
    multiGeoJsonFeatureCollectionWithBbox,
    singleGeoJsonFeatureCollection,
} from "../examples/feature_collection";
import { GeoJSONFeatureCollectionSchema } from "../src";

function passGeoJSONFeatureCollectionSchemaTest(object: unknown) {
    expect(GeoJSONFeatureCollectionSchema.parse(object)).toEqual(object);
}
function failGeoJSONFeatureCollectionSchemaTest(object: unknown) {
    expect(() => GeoJSONFeatureCollectionSchema.parse(object)).toThrow(ZodError);
}

describe("GeoJSONFeatureCollection", () => {
    it("allows a feature collection with one feature", () => {
        passGeoJSONFeatureCollectionSchemaTest(singleGeoJsonFeatureCollection);
    });
    it("allows a feature collection with multiple features", () => {
        passGeoJSONFeatureCollectionSchemaTest(multiGeoJsonFeatureCollection);
    });
    it("allows a feature collection and preserves extra keys", () => {
        passGeoJSONFeatureCollectionSchemaTest({
            ...singleGeoJsonFeatureCollection,
            color: "#00FF00",
        });
    });
    it("allows a feature collection with multiple features and bbox", () => {
        passGeoJSONFeatureCollectionSchemaTest(multiGeoJsonFeatureCollectionWithBbox);
    });
    it("allows a feature collection with empty features array", () => {
        passGeoJSONFeatureCollectionSchemaTest({ ...singleGeoJsonFeatureCollection, features: [] });
    });

    it("does not allow a feature collection without features key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ type: "FeatureCollection" });
    });
    it("does not allow a feature collection with the coordinates key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ ...singleGeoJsonFeatureCollection, coordinates: [] });
    });
    it("does not allow a feature collection with the geometry key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ ...singleGeoJsonFeatureCollection, geometry: {} });
    });
    it("does not allow a feature collection with the properties key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ ...singleGeoJsonFeatureCollection, properties: {} });
    });
    it("does not allow a feature collection with the geometries key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ ...singleGeoJsonFeatureCollection, geometries: [] });
    });
    it("does not allow a feature collection with inconsistent position dimensions across features", () => {
        failGeoJSONFeatureCollectionSchemaTest({
            ...multiGeoJsonFeatureCollection,
            features: [geoJsonFeaturePoint2D, geoJsonFeaturePoint3D],
        });
    });
    it("does not allow a feature with a geometry with incorrect bbox", () => {
        failGeoJSONFeatureCollectionSchemaTest({
            ...multiGeoJsonFeatureCollection,
            bbox: [40, 40, 80, 80],
        });
    });
    it("does not allow a feature with a geometry with invalid bbox dimensions", () => {
        failGeoJSONFeatureCollectionSchemaTest({
            ...multiGeoJsonFeatureCollection,
            bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 0.0],
        });
    });
    it("does not allow a feature with a geometry with badly formatted bbox", () => {
        failGeoJSONFeatureCollectionSchemaTest({
            ...multiGeoJsonFeatureCollection,
            bbox: ["bbox must not contain strings"],
        });
    });
});
