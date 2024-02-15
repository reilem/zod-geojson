import { describe, it } from "vitest";
import { GeoJSONGeometryCollection, GeoJSONGeometryCollectionSchema } from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONGeometryCollectionTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(GeoJSONGeometryCollectionSchema, value);
}

function failGeoJSONGeometryCollectionTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(GeoJSONGeometryCollectionSchema, value);
}

describe("GeoJSONGeometryCollection", () => {
    const singleGeometryCollection2D: GeoJSONGeometryCollection = {
        type: "GeometryCollection",
        geometries: [
            {
                type: "Point",
                coordinates: [0.0, 0.0],
            },
        ],
    };
    const multiGeometryCollection2D: GeoJSONGeometryCollection = {
        type: "GeometryCollection",
        geometries: [
            {
                type: "Point",
                coordinates: [0.0, 0.0],
            },
            {
                type: "LineString",
                coordinates: [
                    [0.0, 0.0],
                    [10.0, 10.0],
                ],
            },
        ],
    };
    const multiGeometryCollection3D: GeoJSONGeometryCollection = {
        type: "GeometryCollection",
        geometries: [
            {
                type: "Point",
                coordinates: [-3.0, 2.0, 0.0],
            },
            {
                type: "LineString",
                coordinates: [
                    [-2.0, 5.0, 0.0],
                    [2.0, 8.0, 10.0],
                ],
            },
        ],
    };

    it("allows a geometry collection with one 2D geometry", () => {
        passGeoJSONGeometryCollectionTest(singleGeometryCollection2D);
    });
    it("allows a geometry collection with multiple 2D geometries", () => {
        passGeoJSONGeometryCollectionTest(multiGeometryCollection2D);
    });
    it("allows a geometry collection with multiple 3D geometries", () => {
        passGeoJSONGeometryCollectionTest(multiGeometryCollection3D);
    });
    it("allows a geometry collection with nested geometry collection", () => {
        passGeoJSONGeometryCollectionTest({
            ...multiGeometryCollection2D,
            geometries: [
                ...multiGeometryCollection2D.geometries,
                {
                    type: "GeometryCollection",
                    geometries: [
                        {
                            type: "Point",
                            coordinates: [0.0, 0.0],
                        },
                    ],
                },
            ],
        });
    });
    it("allows a geometry collection with valid bbox", () => {
        passGeoJSONGeometryCollectionTest({
            ...multiGeometryCollection2D,
            bbox: [0.0, 0.0, 10.0, 10.0],
        });
    });
    it("allows a geometry collection and preserves extra keys", () => {
        passGeoJSONGeometryCollectionTest({
            ...singleGeometryCollection2D,
            extraKey: "extra",
        });
    });

    it("does not allow a geometry collection without geometries", () => {
        failGeoJSONGeometryCollectionTest({ type: "GeometryCollection" });
    });
    it("does not allow a geometry collection with the coordinates key", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeometryCollection2D,
            coordinates: [],
        });
    });
    it("does not allow a geometry collection with the features key", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeometryCollection2D,
            features: [],
        });
    });
    it("does not allow a geometry collection with the geometry key", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeometryCollection2D,
            geometry: {},
        });
    });
    it("does not allow a geometry collection with the properties key", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeometryCollection2D,
            properties: {},
        });
    });
    it("does not allow a geometry collection with geometries with invalid types", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeometryCollection2D,
            geometries: [
                {
                    type: "Point",
                    coordinates: [0.0, 0.0],
                },
                {
                    type: "BadType",
                    coordinates: [0.0, 0.0],
                },
            ],
        });
    });
    it("does not allow a geometry collection with geometries with inconsistent position dimensions", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeometryCollection2D,
            geometries: [
                {
                    type: "MultiPoint",
                    coordinates: [
                        [0.0, 5.0],
                        [2.0, -2.0, 0.0],
                    ],
                },
            ],
        });
    });
    it("does not allow a geometry collection with geometries with inconsistent position dimensions across geometries", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeometryCollection2D,
            geometries: [
                {
                    type: "MultiPoint",
                    coordinates: [
                        [0.0, 5.0],
                        [2.0, -2.0],
                    ],
                },
                {
                    type: "LineString",
                    coordinates: [
                        [0.0, 0.0, 0.0],
                        [10.0, 10.0, 0.0],
                    ],
                },
            ],
        });
    });
    it("does not allow a geometry collection with geometries with inconsistent position dimensions across geometry collections", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeometryCollection2D,
            geometries: [
                {
                    type: "GeometryCollection",
                    geometries: [
                        {
                            type: "Point",
                            coordinates: [0.0, 0.0],
                        },
                    ],
                },
                {
                    type: "GeometryCollection",
                    geometries: [
                        {
                            type: "LineString",
                            coordinates: [
                                [0.0, 0.0, 0.0],
                                [10.0, 10.0, 0.0],
                            ],
                        },
                    ],
                },
            ],
        });
    });
    it("does not allow a geometry collection with geometries with invalid coordinates", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeometryCollection2D,
            geometries: [
                {
                    type: "LineString",
                    coordinates: [0.0, 10.0, -2.0],
                },
            ],
        });
    });
    it("does not allow a geometry collection with geometries with incorrect bbox", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeometryCollection2D,
            bbox: [-30, 10, -20, 100],
        });
    });
    it("does not allow a geometry collection with geometries with invalid bbox dimensions", () => {
        failGeoJSONGeometryCollectionTest({
            ...multiGeometryCollection2D,
            bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 0.0],
        });
    });
    it("does not allow a geometry collection with geometries with badly formatted bbox", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeometryCollection2D,
            bbox: ["bbox cannot contain strings"],
        });
    });
});
