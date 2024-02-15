import { describe, it } from "vitest";
import {
    multiGeoJsonGeometryCollection2D,
    multiGeoJsonGeometryCollection2DWithBbox,
    multiGeoJsonGeometryCollection3D,
    multiGeoJsonGeometryCollection3DWithBbox,
    nestedGeoJsonGeometryCollection,
    nestedGeoJsonGeometryCollectionWithBbox,
    singleGeoJsonGeometryCollection2D,
    singleGeoJsonGeometryCollection2DWithBbox,
} from "../../examples/geometry/geometry_collection";
import { geoJsonLineString3D } from "../../examples/geometry/line_string";
import { geoJsonMultiPoint2D } from "../../examples/geometry/multi_point";
import { geoJsonPoint2D } from "../../examples/geometry/point";
import { GeoJSONGeometryCollectionSchema } from "../../src";
import { failGeoJSONGeometrySchemaTest, passGeoJSONGeometrySchemaTest } from "./_helpers";

function passGeoJSONGeometryCollectionTest(value: unknown): void {
    passGeoJSONGeometrySchemaTest(GeoJSONGeometryCollectionSchema, value);
}

function failGeoJSONGeometryCollectionTest(value: unknown): void {
    failGeoJSONGeometrySchemaTest(GeoJSONGeometryCollectionSchema, value);
}

describe("GeoJSONGeometryCollection", () => {
    it("allows a geometry collection with one 2D geometry", () => {
        passGeoJSONGeometryCollectionTest(singleGeoJsonGeometryCollection2D);
    });
    it("allows a geometry collection with multiple 2D geometries", () => {
        passGeoJSONGeometryCollectionTest(multiGeoJsonGeometryCollection2D);
    });
    it("allows a geometry collection with multiple 3D geometries", () => {
        passGeoJSONGeometryCollectionTest(multiGeoJsonGeometryCollection3D);
    });
    it("allows a geometry collection with nested geometry collection", () => {
        passGeoJSONGeometryCollectionTest(nestedGeoJsonGeometryCollection);
    });
    it("allows a geometry collection with one 2D geometry and valid bbox", () => {
        passGeoJSONGeometryCollectionTest(singleGeoJsonGeometryCollection2DWithBbox);
    });
    it("allows a geometry collection with multiple 2D geometries and valid bbox", () => {
        passGeoJSONGeometryCollectionTest(multiGeoJsonGeometryCollection2DWithBbox);
    });
    it("allows a geometry collection with multiple 3D geometries and valid bbox", () => {
        passGeoJSONGeometryCollectionTest(multiGeoJsonGeometryCollection3DWithBbox);
    });
    it("allows a geometry collection with nested geometry collection and valid bbox", () => {
        passGeoJSONGeometryCollectionTest(nestedGeoJsonGeometryCollectionWithBbox);
    });
    it("allows a geometry collection and preserves extra keys", () => {
        passGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            extraKey: "extra",
        });
    });

    it("does not allow a geometry collection without geometries", () => {
        failGeoJSONGeometryCollectionTest({ type: "GeometryCollection" });
    });
    it("does not allow a geometry collection with the coordinates key", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            coordinates: [],
        });
    });
    it("does not allow a geometry collection with the features key", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            features: [],
        });
    });
    it("does not allow a geometry collection with the geometry key", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            geometry: {},
        });
    });
    it("does not allow a geometry collection with the properties key", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            properties: {},
        });
    });
    it("does not allow a geometry collection with geometries with invalid types", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            geometries: [
                geoJsonPoint2D,
                {
                    type: "BadType",
                    coordinates: [0.0, 0.0],
                },
            ],
        });
    });
    it("does not allow a geometry collection with geometries with inconsistent position dimensions", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
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
            ...singleGeoJsonGeometryCollection2D,
            geometries: [geoJsonMultiPoint2D, geoJsonLineString3D],
        });
    });
    it("does not allow a geometry collection with geometries with inconsistent position dimensions across geometry collections", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            geometries: [singleGeoJsonGeometryCollection2D, multiGeoJsonGeometryCollection3D],
        });
    });
    it("does not allow a geometry collection with geometries with invalid coordinates", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
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
            ...singleGeoJsonGeometryCollection2D,
            bbox: [-30, 10, -20, 100],
        });
    });
    it("does not allow a geometry collection with geometries with invalid bbox dimensions", () => {
        failGeoJSONGeometryCollectionTest({
            ...multiGeoJsonGeometryCollection2D,
            bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 0.0],
        });
    });
    it("does not allow a geometry collection with geometries with badly formatted bbox", () => {
        failGeoJSONGeometryCollectionTest({
            ...singleGeoJsonGeometryCollection2D,
            bbox: ["bbox cannot contain strings"],
        });
    });
});
