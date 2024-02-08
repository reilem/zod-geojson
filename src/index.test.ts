import { expect, test, describe } from "vitest";
import { ZodError } from "zod";
import {
    GeoJSON2DBBoxSchema,
    GeoJSON3DBBoxSchema,
    GeoJSONBBoxSchema,
    GeoJSONGeometryTypeSchema,
    GeoJSONPositionSchema,
    GeoJSONTypeSchema,
} from "./index";

describe("zod-geojson", () => {
    describe("GeoJSONPositionSchema", () => {
        test("allows 2D positions", () => {
            expect(GeoJSONPositionSchema.parse([0, 0])).toEqual([0, 0]);
        });
        test("allows 3D positions", () => {
            expect(GeoJSONPositionSchema.parse([1, 2, 3])).toEqual([1, 2, 3]);
        });
        test("allows unknown 4D positions", () => {
            expect(GeoJSONPositionSchema.parse([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
        });

        test("does not allow 1D positions", () => {
            expectThrow(() => GeoJSONPositionSchema.parse([1]));
        });
    });

    describe("GeoJSONGeometryTypeSchema", () => {
        [
            "Point",
            "MultiPoint",
            "LineString",
            "MultiLineString",
            "Polygon",
            "MultiPolygon",
            "GeometryCollection",
        ].forEach((type) =>
            test(`allows ${type} geojson geometry type`, () =>
                expect(GeoJSONGeometryTypeSchema.parse(type)).toEqual(type)),
        );
    });

    describe("GeoJSONTypeSchema", () => {
        [
            "Point",
            "MultiPoint",
            "LineString",
            "MultiLineString",
            "Polygon",
            "MultiPolygon",
            "GeometryCollection",
            "Feature",
            "FeatureCollection",
        ].forEach((type) =>
            test(`allows ${type} geojson type`, () => expect(GeoJSONTypeSchema.parse(type)).toEqual(type)),
        );
    });

    describe("GeoJSON2DBBoxSchema", () => {
        test("allows 2D bbox", () => {
            expect(GeoJSON2DBBoxSchema.parse([0, 0, 1, 1])).toEqual([0, 0, 1, 1]);
        });

        test("does not allow 3D bbox", () => {
            expectThrow(() => GeoJSON2DBBoxSchema.parse([0, 0, 1, 1, 2, 2]));
        });
    });

    describe("GeoJSON3DBBoxSchema", () => {
        test("allows 3D bbox", () => {
            expect(GeoJSON3DBBoxSchema.parse([0, 0, 1, 1, 2, 2])).toEqual([0, 0, 1, 1, 2, 2]);
        });

        test("does not allow 2D bbox", () => {
            expectThrow(() => GeoJSON3DBBoxSchema.parse([0, 0, 1, 1]));
        });
    });

    describe("GeoJSONBBoxSchema", () => {
        test("allows 2D bbox", () => {
            expect(GeoJSONBBoxSchema.parse([0, 0, 1, 1])).toEqual([0, 0, 1, 1]);
        });

        test("allows 3D bbox", () => {
            expect(GeoJSONBBoxSchema.parse([0, 0, 1, 1, 2, 2])).toEqual([0, 0, 1, 1, 2, 2]);
        });

        test("does not allow 1D bbox", () => {
            expectThrow(() => GeoJSONBBoxSchema.parse([0]));
        });

        test("does not allow 4D bbox", () => {
            expectThrow(() => GeoJSONBBoxSchema.parse([1, 2, 3, 4, 5, 6, 7, 8]));
        });
    });

    // TODO: Remaining tests

    describe("GeoJSONPointSchema", () => {});

    describe("GeoJSONLineStringSchema", () => {});

    describe("GeoJSONMultiPointSchema", () => {});

    describe("GeoJSONPolygonSchema", () => {});

    describe("GeoJSONMultiLineStringSchema", () => {});

    describe("GeoJSONMultiPolygonSchema", () => {});

    describe("GeoJSONGeometryCollectionSchema", () => {});

    describe("GeoJSONGeometrySchema", () => {});

    describe("GeoJSONGeometry type", () => {});

    describe("GeoJSONFeatureSchema", () => {});

    describe("GeoJSONFeatureCollectionSchema", () => {});

    describe("GeoJSONSchema", () => {});

    describe("GeoJSON type", () => {});
});

function expectThrow(func: () => unknown) {
    try {
        const result = func();
        expect.unreachable(`Should have thrown an error, but got: ${result}`);
    } catch (e) {
        expect(e).toBeInstanceOf(ZodError);
    }
}
