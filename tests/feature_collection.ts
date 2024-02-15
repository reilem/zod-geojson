import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { GeoJSONFeatureCollection, GeoJSONFeatureCollectionSchema } from "../src";

function passGeoJSONFeatureCollectionSchemaTest(object: unknown) {
    expect(GeoJSONFeatureCollectionSchema.parse(object)).toEqual(object);
}
function failGeoJSONFeatureCollectionSchemaTest(object: unknown) {
    expect(() => GeoJSONFeatureCollectionSchema.parse(object)).toThrow(ZodError);
}

describe("GeoJSONFeatureCollection", () => {
    const singleFeatureCollection: GeoJSONFeatureCollection = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Point",
                    coordinates: [0.0, 0.0],
                },
            },
        ],
    };
    const multiFeatureCollection: GeoJSONFeatureCollection = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Point",
                    coordinates: [0.0, 0.0],
                },
            },
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [5.0, 5.0],
                        [10.0, 10.0],
                    ],
                },
            },
        ],
    };

    it("allows a feature collection with one feature", () => {
        passGeoJSONFeatureCollectionSchemaTest(singleFeatureCollection);
    });
    it("allows a feature collection with multiple features", () => {
        passGeoJSONFeatureCollectionSchemaTest(multiFeatureCollection);
    });
    it("allows a feature collection and preserves extra keys", () => {
        passGeoJSONFeatureCollectionSchemaTest({
            ...singleFeatureCollection,
            color: "#00FF00",
        });
    });
    it("allows a feature collection with empty features array", () => {
        passGeoJSONFeatureCollectionSchemaTest({ ...singleFeatureCollection, features: [] });
    });

    it("does not allow a feature collection without features key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ type: "FeatureCollection" });
    });
    it.skip("does not allow a feature collection with the coordinates key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ ...singleFeatureCollection, coordinates: [] });
    });
    it("does not allow a feature collection with the geometry key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ ...singleFeatureCollection, geometry: {} });
    });
    it("does not allow a feature collection with the properties key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ ...singleFeatureCollection, properties: {} });
    });
    it("does not allow a feature collection with the geometries key", () => {
        failGeoJSONFeatureCollectionSchemaTest({ ...singleFeatureCollection, geometries: [] });
    });
});
