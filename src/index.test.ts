import { expect, it, describe } from "vitest";
import { ZodError, ZodSchema } from "zod";
import { geoJsonPoint2D, geoJsonPoint2DWithBbox, geoJsonPoint3D, geoJsonPoint3DWithBbox } from "../examples/point";
import {
    GeoJSONBbox,
    GeoJSONBBoxSchema,
    GeoJSONFeature,
    GeoJSONFeatureCollection,
    GeoJSONFeatureCollectionSchema,
    GeoJSONFeatureSchema,
    GeoJSONGeometryCollection,
    GeoJSONGeometryCollectionSchema,
    GeoJSONGeometrySchema,
    GeoJSONGeometryType,
    GeoJSONGeometryTypeSchema,
    GeoJSONLineString,
    GeoJSONLineStringSchema,
    GeoJSONMultiLineString,
    GeoJSONMultiLineStringSchema,
    GeoJSONMultiPoint,
    GeoJSONMultiPointSchema,
    GeoJSONMultiPolygon,
    GeoJSONMultiPolygonSchema,
    GeoJSONPointSchema,
    GeoJSONPolygon,
    GeoJSONPolygonSchema,
    GeoJSONPosition,
    GeoJSONPositionSchema,
    GeoJSONSchema,
    GeoJSONType,
    GeoJSONTypeSchema,
} from "./index";

function passGeoJSONSchemaTest(specificSchema: ZodSchema, value: unknown): void {
    expect(specificSchema.parse(value)).toEqual(value);
    expect(GeoJSONGeometrySchema.parse(value)).toEqual(value);
    expect(GeoJSONSchema.parse(value)).toEqual(value);
}

function failGeoJSONSchemaTest(specificSchema: ZodSchema, value: unknown): void {
    expect(() => specificSchema.parse(value)).toThrow(ZodError);
    expect(() => GeoJSONGeometrySchema.parse(value)).toThrow(ZodError);
    expect(() => GeoJSONSchema.parse(value)).toThrow(ZodError);
}

// TODO: Consider splitting

describe("zod-geojson", () => {
    const bbox2D: GeoJSONBbox = [0, 0, 1, 1];
    const bbox3D: GeoJSONBbox = [0, 0, 1, 1, 2, 2];

    describe("GeoJSONPosition", () => {
        it("allows 2D positions", () => {
            const position2D: GeoJSONPosition = [0, 0];
            expect(GeoJSONPositionSchema.parse(position2D)).toEqual(position2D);
        });
        it("allows 3D positions", () => {
            const position3D: GeoJSONPosition = [1, 2, 3];
            expect(GeoJSONPositionSchema.parse(position3D)).toEqual(position3D);
        });
        it("allows unknown 4D positions", () => {
            const position4D: GeoJSONPosition = [1, 2, 3, 4];
            expect(GeoJSONPositionSchema.parse(position4D)).toEqual(position4D);
        });

        it("does not allow 1D positions", () => {
            expect(() => GeoJSONPositionSchema.parse([1])).toThrow(ZodError);
        });
    });

    describe("GeoJSONGeometryType", () => {
        const geoJsonGeometryTypes: GeoJSONGeometryType[] = [
            "Point",
            "MultiPoint",
            "LineString",
            "MultiLineString",
            "Polygon",
            "MultiPolygon",
            "GeometryCollection",
        ];

        geoJsonGeometryTypes.forEach((type) =>
            it(`allows ${type} geojson geometry type`, () => {
                expect(GeoJSONGeometryTypeSchema.parse(type)).toEqual(type);
                expect(GeoJSONTypeSchema.parse(type)).toEqual(type);
            }),
        );

        it("does not allow an invalid geojson geometry type", () => {
            expect(() => GeoJSONGeometryTypeSchema.parse("InvalidType")).toThrow(ZodError);
        });
    });

    describe("GeoJSONType", () => {
        const geoJsonTypes: GeoJSONType[] = ["Feature", "FeatureCollection"];
        geoJsonTypes.forEach((type) =>
            it(`allows ${type} geojson type`, () => expect(GeoJSONTypeSchema.parse(type)).toEqual(type)),
        );

        it("does not allow an invalid geojson type", () => {
            expect(() => GeoJSONTypeSchema.parse("InvalidType")).toThrow(ZodError);
        });
    });

    describe("GeoJSONBBox", () => {
        it("allows 2D bbox", () => {
            expect(GeoJSONBBoxSchema.parse(bbox2D)).toEqual(bbox2D);
        });

        it("allows 3D bbox", () => {
            expect(GeoJSONBBoxSchema.parse(bbox3D)).toEqual(bbox3D);
        });

        it("allows 4D bbox", () => {
            const bbox4D = [1, 2, 3, 4, 5, 6, 7, 8];
            expect(GeoJSONBBoxSchema.parse(bbox4D)).toEqual(bbox4D);
        });

        it("does not allow an invalid bbox", () => {
            expect(() => GeoJSONBBoxSchema.parse([0])).toThrow(ZodError);
        });

        it("does not allow a badly formatted bbox", () => {
            expect(() => GeoJSONBBoxSchema.parse("something else")).toThrow(ZodError);
        });
    });

    describe("GeoJSONPoint", () => {
        it("allows a 2d point", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, geoJsonPoint2D);
        });
        it("allows a 3D point", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, geoJsonPoint3D);
        });
        it("allows a 6D point", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...geoJsonPoint2D,
                coordinates: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0],
            });
        });
        it("allows a 2D point with valid bbox", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, geoJsonPoint2DWithBbox);
        });
        it("allows a 3D point with valid bbox", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, geoJsonPoint3DWithBbox);
        });
        it("allows a point and preserves extra keys", () => {
            const geoJsonPointWithExtraKeys = {
                ...geoJsonPoint2D,
                extraKey: "extra",
            };
            passGeoJSONSchemaTest(GeoJSONPointSchema, geoJsonPointWithExtraKeys);
        });

        it("does not allow a point without coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, { type: "Point" });
        });
        it("does not allow a point with the geometry key", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, { ...geoJsonPoint2D, geometry: {} });
        });
        it("does not allow a point with the properties key", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, { ...geoJsonPoint2D, properties: {} });
        });
        it("does not allow a point with the features key", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, { ...geoJsonPoint2D, features: [] });
        });
        it("does not allow a point with the geometries key", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, { ...geoJsonPoint2D, geometries: [] });
        });
        it("does not allow a point with incorrect bbox", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...geoJsonPoint2D,
                bbox: [30, 10, 20, 100],
            });
        });
        it("does not allow a point with invalid bbox dimensions", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...geoJsonPoint2D,
                bbox: [1.0, 2.0, 0.0, 1.0, 2.0, 0.0],
            });
        });
        it("does not allow a point with badly formatted bbox", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...geoJsonPoint2D,
                bbox: ["hello"],
            });
        });
        it("does not allow a point with invalid coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...geoJsonPoint2D,
                coordinates: ["3ght45y34", 39284],
            });
        });
        it("does not allow a point with empty coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...geoJsonPoint2D,
                coordinates: [],
            });
        });
    });

    describe("GeoJSONLineString", () => {
        const basicGeoJsonLineString: GeoJSONLineString = {
            type: "LineString",
            coordinates: [
                [1.0, 2.0],
                [3.0, 4.0],
            ],
        };

        it("allows a 2D line string", () => {
            passGeoJSONSchemaTest(GeoJSONLineStringSchema, basicGeoJsonLineString);
        });
        it("allows a 3D line string", () => {
            passGeoJSONSchemaTest(GeoJSONLineStringSchema, {
                ...basicGeoJsonLineString,
                coordinates: [
                    [0.0, 0.0, 0.0],
                    [1.0, 1.0, 1.0],
                    [2.0, 2.0, 2.0],
                    [3.0, 3.0, 3.0],
                    [4.0, 4.0, 4.0],
                    [5.0, 5.0, 5.0],
                ],
            });
        });
        it("allows 2D line string with valid bbox", () => {
            passGeoJSONSchemaTest(GeoJSONLineStringSchema, {
                ...basicGeoJsonLineString,
                bbox: [1.0, 2.0, 3.0, 4.0],
            });
        });
        it("allows 3D line string with valid bbox", () => {
            passGeoJSONSchemaTest(GeoJSONLineStringSchema, {
                ...basicGeoJsonLineString,
                coordinates: [
                    [0.0, 0.0, 0.0],
                    [1.0, 3.0, 2.0],
                    [10.0, 9.0, 8.0],
                ],
                bbox: [0.0, 0.0, 0.0, 10.0, 9.0, 8.0],
            });
        });
        it("allows a line string and preserves extra keys", () => {
            const geoJsonLineStringWithExtraKeys = {
                ...basicGeoJsonLineString,
                extraKey: "extra",
            };
            passGeoJSONSchemaTest(GeoJSONLineStringSchema, geoJsonLineStringWithExtraKeys);
        });

        it("does not allow a line string without coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONLineStringSchema, { type: "LineString" });
        });
        it("does not allow a line string with the geometry key", () => {
            failGeoJSONSchemaTest(GeoJSONLineStringSchema, { ...basicGeoJsonLineString, geometry: {} });
        });
        it("does not allow a line string with the properties key", () => {
            failGeoJSONSchemaTest(GeoJSONLineStringSchema, { ...basicGeoJsonLineString, properties: {} });
        });
        it("does not allow a line string with the features key", () => {
            failGeoJSONSchemaTest(GeoJSONLineStringSchema, { ...basicGeoJsonLineString, features: [] });
        });
        it("does not allow a line string with the geometries key", () => {
            failGeoJSONSchemaTest(GeoJSONLineStringSchema, { ...basicGeoJsonLineString, geometries: [] });
        });
        it("does not allow line string with invalid coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONLineStringSchema, {
                ...basicGeoJsonLineString,
                coordinates: [2.0],
            });
        });
        it("does not allow line string with insufficient coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONLineStringSchema, {
                ...basicGeoJsonLineString,
                coordinates: [[1.0, 2.0, 3.0]],
            });
        });
        it("does not allow line string with inconsistent position dimensions", () => {
            failGeoJSONSchemaTest(GeoJSONLineStringSchema, {
                ...basicGeoJsonLineString,
                coordinates: [
                    [0, 0],
                    [1, 2, 3],
                    [4, 5, 6, 7],
                ],
            });
        });
        it("does not allow line string with incorrect bbox", () => {
            failGeoJSONSchemaTest(GeoJSONLineStringSchema, {
                ...basicGeoJsonLineString,
                bbox: [30, 10, 20, 100],
            });
        });
        it("does not allow line string with invalid bbox dimensions", () => {
            failGeoJSONSchemaTest(GeoJSONLineStringSchema, {
                ...basicGeoJsonLineString,
                bbox: [1.0, 2.0, 0.0, 3.0, 4.0, 0.0],
            });
        });
        it("does not allow line string with badly formatted bbox", () => {
            failGeoJSONSchemaTest(GeoJSONLineStringSchema, {
                ...basicGeoJsonLineString,
                bbox: ["badformat"],
            });
        });
    });

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
            passGeoJSONSchemaTest(GeoJSONMultiPointSchema, basic2DGeoJsonMultiPoint);
        });
        it("allows a 3D multi-point", () => {
            passGeoJSONSchemaTest(GeoJSONMultiPointSchema, basic3DGeoJsonMultiPoint);
        });
        it("allows a 2D multi-point with a valid bbox", () => {
            passGeoJSONSchemaTest(GeoJSONMultiPointSchema, {
                ...basic2DGeoJsonMultiPoint,
                bbox: [-3.0, -2.0, 8.0, 4.0],
            });
        });
        it("allows a 3D multi-point with valid bbox", () => {
            passGeoJSONSchemaTest(GeoJSONMultiPointSchema, {
                ...basic3DGeoJsonMultiPoint,
                bbox: [-3.0, -2.0, 0.0, 8.0, 4.0, 5.0],
            });
        });
        it("allows a multi point and preserves extra keys", () => {
            passGeoJSONSchemaTest(GeoJSONMultiPointSchema, {
                ...basic2DGeoJsonMultiPoint,
                extraKey: "extra",
            });
        });

        it("does not allow a multi-point without coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPointSchema, { type: "MultiPoint" });
        });
        it("does not allow a multi-point with the geometry key", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPointSchema, { ...basic2DGeoJsonMultiPoint, geometry: {} });
        });
        it("does not allow a multi-point with the properties key", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPointSchema, { ...basic2DGeoJsonMultiPoint, properties: {} });
        });
        it("does not allow a multi-point with the features key", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPointSchema, { ...basic2DGeoJsonMultiPoint, features: [] });
        });
        it("does not allow a multi-point with the geometries key", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPointSchema, { ...basic2DGeoJsonMultiPoint, geometries: [] });
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
            failGeoJSONSchemaTest(GeoJSONMultiPointSchema, geoJsonMultiPointWithInvalidCoordinates);
        });
        it("does not allow multi-point with inconsistent position dimensions", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPointSchema, {
                ...basic2DGeoJsonMultiPoint,
                coordinates: [
                    [0.0, 1.0],
                    [2.0, 3.0, 4.0],
                    [5.0, 6.0, 7.0, 8.0],
                ],
            });
        });
        it("does not allow a multi-point with incorrect bbox", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPointSchema, {
                ...basic2DGeoJsonMultiPoint,
                bbox: [30, 10, 20, 100],
            });
        });
        it("does not allow a multi-point with invalid bbox dimensions", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPointSchema, {
                ...basic2DGeoJsonMultiPoint,
                bbox: [1.0, 2.0, 0.0, 1.0, 2.0, 0.0],
            });
        });
        it("does not allow a multi-point with badly formatted bbox", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPointSchema, {
                ...basic2DGeoJsonMultiPoint,
                bbox: ["hello"],
            });
        });
    });

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
            passGeoJSONSchemaTest(GeoJSONPolygonSchema, basic2DGeoJsonPolygon);
        });
        it("allows a 3D polygon", () => {
            passGeoJSONSchemaTest(GeoJSONPolygonSchema, basic3DGeoJsonPolygon);
        });
        it("allows a 2D polygon with bbox", () => {
            passGeoJSONSchemaTest(GeoJSONPolygonSchema, {
                ...basic2DGeoJsonPolygon,
                bbox: [0.0, 0.0, 1.0, 1.0],
            });
        });
        it("allows a 3D polygon with bbox", () => {
            passGeoJSONSchemaTest(GeoJSONPolygonSchema, {
                ...basic3DGeoJsonPolygon,
                bbox: [0.0, 0.0, 0.0, 1.0, 2.0, 2.0],
            });
        });
        it("allows a 2D polygon with a hole", () => {
            passGeoJSONSchemaTest(GeoJSONPolygonSchema, geoJsonPolygonWithHole);
        });
        it("allows a 2D polygon with a hole and bbox", () => {
            passGeoJSONSchemaTest(GeoJSONPolygonSchema, {
                ...geoJsonPolygonWithHole,
                bbox: [0.0, 0.0, 10.0, 10.0],
            });
        });
        it("allows a polygon and preserves extra keys", () => {
            passGeoJSONSchemaTest(GeoJSONPolygonSchema, {
                ...basic2DGeoJsonPolygon,
                extraKey: "extra",
            });
        });

        it("does not allow a polygon without coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONPolygonSchema, { type: "Polygon" });
        });
        it("does not allow a polygon with the geometry key", () => {
            failGeoJSONSchemaTest(GeoJSONPolygonSchema, { ...basic2DGeoJsonPolygon, geometry: {} });
        });
        it("does not allow a polygon with the properties key", () => {
            failGeoJSONSchemaTest(GeoJSONPolygonSchema, { ...basic2DGeoJsonPolygon, properties: {} });
        });
        it("does not allow a polygon with the features key", () => {
            failGeoJSONSchemaTest(GeoJSONPolygonSchema, { ...basic2DGeoJsonPolygon, features: [] });
        });
        it("does not allow a polygon with the geometries key", () => {
            failGeoJSONSchemaTest(GeoJSONPolygonSchema, { ...basic2DGeoJsonPolygon, geometries: [] });
        });
        it("does not allow a polygon which is not linear ring", () => {
            failGeoJSONSchemaTest(GeoJSONPolygonSchema, {
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
            failGeoJSONSchemaTest(GeoJSONPolygonSchema, {
                ...basic2DGeoJsonPolygon,
                coordinates: [
                    [0.0, 0.0],
                    [1.0, 0.0],
                    [0.0, 0.0],
                ],
            });
        });
        it("does not allow a polygon with less than 4 positions", () => {
            failGeoJSONSchemaTest(GeoJSONPolygonSchema, {
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
            failGeoJSONSchemaTest(GeoJSONPolygonSchema, {
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
            failGeoJSONSchemaTest(GeoJSONPolygonSchema, {
                ...basic2DGeoJsonPolygon,
                bbox: [30, 10, 20, 100],
            });
        });
        it("does not allow a polygon with invalid bbox dimensions", () => {
            failGeoJSONSchemaTest(GeoJSONPolygonSchema, {
                ...basic2DGeoJsonPolygon,
                bbox: [0.0, 0.0, 0.0, 1.0, 1.0, 0.0],
            });
        });
        it("does not allow a polygon with badly formatted bbox", () => {
            failGeoJSONSchemaTest(GeoJSONPolygonSchema, {
                ...basic2DGeoJsonPolygon,
                bbox: ["hello"],
            });
        });
    });

    describe("GeoJSONMultiLineString", () => {
        const singleMultiLineString2D: GeoJSONMultiLineString = {
            type: "MultiLineString",
            coordinates: [
                [
                    [0.0, 0.0],
                    [10.0, 10.0],
                ],
            ],
        };
        const multiMultiLineString2D: GeoJSONMultiLineString = {
            type: "MultiLineString",
            coordinates: [
                [
                    [5.0, 5.0],
                    [10.0, 10.0],
                ],
                [
                    [20.0, 20.0],
                    [30.0, 30.0],
                ],
            ],
        };
        const singleMultiLineString3D: GeoJSONMultiLineString = {
            type: "MultiLineString",
            coordinates: [
                [
                    [0.0, 0.0, 0.0],
                    [10.0, 10.0, 10.0],
                ],
            ],
        };

        it("allows a 2D multi-line string with one line", () => {
            passGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, singleMultiLineString2D);
        });
        it("allows a 2D multi-line string with multiple lines", () => {
            passGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, multiMultiLineString2D);
        });
        it("allows a 3D multi-line string", () => {
            passGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, singleMultiLineString3D);
        });
        it("allows a 2D multi-line string with one line and bbox", () => {
            passGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, {
                ...singleMultiLineString2D,
                bbox: [0.0, 0.0, 10.0, 10.0],
            });
        });
        it("allows a 2D multi-line string with multiples and with bbox", () => {
            passGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, {
                ...multiMultiLineString2D,
                bbox: [5.0, 5.0, 30.0, 30.0],
            });
        });
        it("allows a 3D multi-line string with bbox", () => {
            passGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, {
                ...singleMultiLineString3D,
                bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 10.0],
            });
        });
        it("allows a multi-line string and preserves extra keys", () => {
            passGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, {
                ...singleMultiLineString2D,
                extraKey: "extra",
            });
        });

        it("does not allow a multi-line string without coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, { type: "MultiLineString" });
        });
        it("does not allow a multi-line string with the geometry key", () => {
            failGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, { ...singleMultiLineString2D, geometry: {} });
        });
        it("does not allow a multi-line string with the properties key", () => {
            failGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, { ...singleMultiLineString2D, properties: {} });
        });
        it("does not allow a multi-line string with the features key", () => {
            failGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, { ...singleMultiLineString2D, features: [] });
        });
        it("does not allow a multi-line string with the geometries key", () => {
            failGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, { ...singleMultiLineString2D, geometries: [] });
        });
        it("does not allow a multi-line string with invalid coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, {
                type: "MultiLineString",
                coordinates: [
                    // Not nested deep enough
                    [0.0, 0.0],
                    [10.0, 10.0],
                ],
            });
        });
        it("does not allow a multi-line string with inconsistent position dimensions", () => {
            failGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, {
                ...singleMultiLineString2D,
                coordinates: [
                    [
                        [0.0, 0.0],
                        [10.0, 10.0, 0.0],
                    ],
                ],
            });
        });
        it("does not allow a multi-line string with inconsistent position dimensions across lines", () => {
            failGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, {
                ...singleMultiLineString2D,
                coordinates: [
                    [
                        [0.0, 0.0],
                        [10.0, 10.0],
                    ],
                    [
                        [-5.0, 10.0, 2.0],
                        [10.0, -2.0, 3.0],
                    ],
                ],
            });
        });
        it("does not allow a multi-line string with incorrect bbox", () => {
            failGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, {
                ...singleMultiLineString2D,
                bbox: [30, 10, 20, 100],
            });
        });
        it("does not allow a multi-line string with invalid bbox dimensions", () => {
            failGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, {
                ...singleMultiLineString2D,
                bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 0.0],
            });
        });
        it("does not allow a multi-line string with badly formatted bbox", () => {
            failGeoJSONSchemaTest(GeoJSONMultiLineStringSchema, {
                ...singleMultiLineString2D,
                bbox: ["hello"],
            });
        });
    });

    describe("GeoJSONMultiPolygon", () => {
        const singleGeoJsonMultiPolygon2D: GeoJSONMultiPolygon = {
            type: "MultiPolygon",
            coordinates: [
                [
                    [
                        [0.0, 1.0],
                        [2.0, 2.0],
                        [0.0, 2.0],
                        [0.0, 1.0],
                    ],
                ],
            ],
        };
        const multiGeoJsonMultiPolygon2D: GeoJSONMultiPolygon = {
            type: "MultiPolygon",
            coordinates: [
                [
                    [
                        [0.0, 1.0],
                        [2.0, 2.0],
                        [0.0, 2.0],
                        [0.0, 1.0],
                    ],
                ],
                [
                    [
                        [5.0, 5.0],
                        [7.5, 7.5],
                        [5.0, 7.5],
                        [5.0, 5.0],
                    ],
                ],
            ],
        };
        const singleGeoJsonMultiPolygon3D: GeoJSONMultiPolygon = {
            type: "MultiPolygon",
            coordinates: [
                [
                    [
                        [0.0, 1.0, 0.0],
                        [2.0, 2.0, 1.0],
                        [0.0, 2.0, 1.0],
                        [0.0, 1.0, 0.0],
                    ],
                ],
            ],
        };

        it("allows a 2D multi-polygon with one polygon", () => {
            passGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, singleGeoJsonMultiPolygon2D);
        });
        it("allows a 2D multi-polygon with multiple polygons", () => {
            passGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, multiGeoJsonMultiPolygon2D);
        });
        it("allows a 3D multi-polygon with one polygon", () => {
            passGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, singleGeoJsonMultiPolygon3D);
        });
        it("allows a 2D multi-polygon with one polygon and bbox", () => {
            passGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, {
                ...singleGeoJsonMultiPolygon2D,
                bbox: [0.0, 1.0, 2.0, 2.0],
            });
        });
        it("allows a 2D multi-polygon with multiple polygons and bbox", () => {
            passGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, {
                ...multiGeoJsonMultiPolygon2D,
                bbox: [0.0, 1.0, 7.5, 7.5],
            });
        });
        it("allows a 3D multi-polygon with one polygon and bbox", () => {
            passGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, {
                ...singleGeoJsonMultiPolygon3D,
                bbox: [0.0, 1.0, 0.0, 2.0, 2.0, 1.0],
            });
        });
        it("allows a multi-polygon and preserves extra keys", () => {
            passGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, {
                ...singleGeoJsonMultiPolygon2D,
                extraKey: "extra",
            });
        });

        it("does not allow a multi-polygon without coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, { type: "MultiPolygon" });
        });
        it("does not allow a multi-polygon with the geometry key", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, { ...singleGeoJsonMultiPolygon2D, geometry: {} });
        });
        it("does not allow a multi-polygon with the properties key", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, { ...singleGeoJsonMultiPolygon2D, properties: {} });
        });
        it("does not allow a multi-polygon with the features key", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, { ...singleGeoJsonMultiPolygon2D, features: [] });
        });
        it("does not allow a multi-polygon with the geometries key", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, { ...singleGeoJsonMultiPolygon2D, geometries: [] });
        });
        it("does not allow a multi-polygon with a polygon that is not linear ring", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, {
                ...singleGeoJsonMultiPolygon2D,
                coordinates: [
                    [
                        [
                            [0.0, 1.0],
                            [2.0, 2.0],
                            [0.0, 2.0],
                            [-1.0, 1.0],
                        ],
                    ],
                ],
            });
        });
        it("does not allow a multi-polygon with a polygon with less than 4 positions", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, {
                ...singleGeoJsonMultiPolygon2D,
                coordinates: [
                    [
                        [
                            [0.0, 1.0],
                            [2.0, 2.0],
                            [0.0, 1.0],
                        ],
                    ],
                ],
            });
        });
        it("does not allow a multi-polygon with invalid coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, {
                ...singleGeoJsonMultiPolygon2D,
                coordinates: [
                    // Not nested deep enough
                    [
                        [0.0, 1.0],
                        [2.0, 2.0],
                        [0.0, 2.0],
                        [0.0, 1.0],
                    ],
                ],
            });
        });
        it("does not allow a multi-polygon with inconsistent position dimensions", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, {
                ...singleGeoJsonMultiPolygon2D,
                coordinates: [
                    [
                        [
                            [0.0, 1.0],
                            [2.0, 2.0],
                            [0.0, 2.0, 0.0],
                            [0.0, 1.0],
                        ],
                    ],
                ],
            });
        });
        it("does not allow a multi-polygon with inconsistent position dimensions across polygons", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, {
                ...singleGeoJsonMultiPolygon2D,
                coordinates: [
                    [
                        [
                            [0.0, 1.0],
                            [2.0, 2.0],
                            [0.0, 2.0],
                            [0.0, 1.0],
                        ],
                    ],
                    [
                        [
                            [5.0, 5.0],
                            [7.5, 7.5, 0.0],
                            [5.0, 7.5],
                            [5.0, 5.0],
                        ],
                    ],
                ],
            });
        });
        it("does not allow a multi-polygon with incorrect bbox", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, {
                ...singleGeoJsonMultiPolygon2D,
                bbox: [30, 10, 20, 100],
            });
        });
        it("does not allow a multi-polygon with invalid bbox dimensions", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, {
                ...singleGeoJsonMultiPolygon2D,
                bbox: [0.0, 1.0, 0.0, 2.0, 2.0, 0.0],
            });
        });
        it("does not allow a multi-polygon with badly formatted bbox", () => {
            failGeoJSONSchemaTest(GeoJSONMultiPolygonSchema, {
                ...singleGeoJsonMultiPolygon2D,
                bbox: ["hello"],
            });
        });
    });

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
            passGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, singleGeometryCollection2D);
        });
        it("allows a geometry collection with multiple 2D geometries", () => {
            passGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, multiGeometryCollection2D);
        });
        it("allows a geometry collection with multiple 3D geometries", () => {
            passGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, multiGeometryCollection3D);
        });
        it("allows a geometry collection with nested geometry collection", () => {
            passGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
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
            passGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
                ...multiGeometryCollection2D,
                bbox: [0.0, 0.0, 10.0, 10.0],
            });
        });
        it("allows a geometry collection and preserves extra keys", () => {
            passGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
                ...singleGeometryCollection2D,
                extraKey: "extra",
            });
        });

        it("does not allow a geometry collection without geometries", () => {
            failGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, { type: "GeometryCollection" });
        });
        it("does not allow a geometry collection with the coordinates key", () => {
            failGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
                ...singleGeometryCollection2D,
                coordinates: [],
            });
        });
        it("does not allow a geometry collection with the features key", () => {
            failGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
                ...singleGeometryCollection2D,
                features: [],
            });
        });
        it("does not allow a geometry collection with the geometry key", () => {
            failGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
                ...singleGeometryCollection2D,
                geometry: {},
            });
        });
        it("does not allow a geometry collection with the properties key", () => {
            failGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
                ...singleGeometryCollection2D,
                properties: {},
            });
        });
        it("does not allow a geometry collection with geometries with invalid types", () => {
            failGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
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
            failGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
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
            failGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
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
            failGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
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
            failGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
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
            failGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
                ...singleGeometryCollection2D,
                bbox: [-30, 10, -20, 100],
            });
        });
        it("does not allow a geometry collection with geometries with invalid bbox dimensions", () => {
            failGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
                ...multiGeometryCollection2D,
                bbox: [0.0, 0.0, 0.0, 10.0, 10.0, 0.0],
            });
        });
        it("does not allow a geometry collection with geometries with badly formatted bbox", () => {
            failGeoJSONSchemaTest(GeoJSONGeometryCollectionSchema, {
                ...singleGeometryCollection2D,
                bbox: ["bbox cannot contain strings"],
            });
        });
    });

    describe("GeoJSONFeature", () => {
        function passGeoJSONFeatureSchemaTest(object: unknown) {
            expect(GeoJSONFeatureSchema.parse(object)).toEqual(object);
        }
        function failGeoJSONFeatureSchemaTest(object: unknown) {
            expect(() => GeoJSONFeatureSchema.parse(object)).toThrow(ZodError);
        }

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

    describe("GeoJSONFeatureCollection", () => {
        function passGeoJSONFeatureCollectionSchemaTest(object: unknown) {
            expect(GeoJSONFeatureCollectionSchema.parse(object)).toEqual(object);
        }
        function failGeoJSONFeatureCollectionSchemaTest(object: unknown) {
            expect(() => GeoJSONFeatureCollectionSchema.parse(object)).toThrow(ZodError);
        }

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

    describe("GeoJSONSchema", () => {
        const feature: GeoJSONFeature = {
            type: "Feature",
            properties: {},
            geometry: geoJsonPoint3D,
        };
        const featureCollection: GeoJSONFeatureCollection = {
            type: "FeatureCollection",
            features: [feature],
        };

        it("allows a basic geometry", () => {
            expect(GeoJSONSchema.parse(geoJsonPoint3D)).toEqual(geoJsonPoint3D);
        });
        it("allows a basic feature", () => {
            expect(GeoJSONSchema.parse(feature)).toEqual(feature);
        });
        it("allows a basic feature collection", () => {
            expect(GeoJSONSchema.parse(featureCollection)).toEqual(featureCollection);
        });

        it("does not allow a geojson with invalid type", () => {
            expect(() => GeoJSONSchema.parse({ type: "SkippityBoop" })).toThrow(ZodError);
        });
    });
});
