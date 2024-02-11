import { expect, it, describe } from "vitest";
import { ZodError, ZodSchema } from "zod";
import {
    GeoJSON2DBBoxSchema,
    GeoJSON3DBBoxSchema,
    GeoJSONBbox,
    GeoJSONBBoxSchema,
    GeoJSONGeometrySchema,
    GeoJSONGeometryType,
    GeoJSONGeometryTypeSchema,
    GeoJSONLineString,
    GeoJSONLineStringSchema,
    GeoJSONMultiPoint,
    GeoJSONMultiPointSchema,
    GeoJSONPoint,
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
    });

    describe("GeoJSONType", () => {
        const geoJsonTypes: GeoJSONType[] = ["Feature", "FeatureCollection"];
        geoJsonTypes.forEach((type) =>
            it(`allows ${type} geojson type`, () => expect(GeoJSONTypeSchema.parse(type)).toEqual(type)),
        );
    });

    describe("GeoJSON2DBBox", () => {
        it("allows 2D bbox", () => {
            expect(GeoJSON2DBBoxSchema.parse(bbox2D)).toEqual(bbox2D);
            expect(GeoJSONBBoxSchema.parse(bbox2D)).toEqual(bbox2D);
        });

        it("does not allow 3D bbox", () => {
            expect(() => GeoJSON2DBBoxSchema.parse(bbox3D)).toThrow(ZodError);
        });
    });

    describe("GeoJSON3DBBox", () => {
        it("allows 3D bbox", () => {
            expect(GeoJSON3DBBoxSchema.parse(bbox3D)).toEqual(bbox3D);
            expect(GeoJSONBBoxSchema.parse(bbox3D)).toEqual(bbox3D);
        });

        it("does not allow 2D bbox", () => {
            expect(() => GeoJSON3DBBoxSchema.parse(bbox2D)).toThrow(ZodError);
        });
    });

    describe("GeoJSONBBox", () => {
        it("does not allow 1D bbox", () => {
            expect(() => GeoJSONBBoxSchema.parse([0])).toThrow(ZodError);
        });

        it("does not allow 4D bbox", () => {
            expect(() => GeoJSONBBoxSchema.parse([1, 2, 3, 4, 5, 6, 7, 8])).toThrow(ZodError);
        });
    });

    describe("GeoJSONPoint", () => {
        const basicGeoJsonPoint: GeoJSONPoint = {
            type: "Point",
            coordinates: [1.0, 2.0],
        };

        it("allows a basic geojson point", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, basicGeoJsonPoint);
        });

        it("allows a 3D geojson point", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...basicGeoJsonPoint,
                coordinates: [1.0, 2.0, 3.0],
            });
        });

        it("allows a 6D geojson point", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...basicGeoJsonPoint,
                coordinates: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0],
            });
        });

        it("allows a geojson point with valid bbox", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...basicGeoJsonPoint,
                bbox: [1.0, 2.0, 1.0, 2.0],
            });
        });

        it("does not allow a geojson point with incorrect bbox", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...basicGeoJsonPoint,
                bbox: [30, 10, 20, 100],
            });
        });

        it("does not allow a geojson point with invalid bbox dimensions", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...basicGeoJsonPoint,
                bbox: [1.0, 2.0, 0.0, 1.0, 2.0, 0.0],
            });
        });

        it("does not allow a geojson point with badly formatted bbox", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...basicGeoJsonPoint,
                bbox: ["hello"],
            });
        });

        it("does not allow a geojson point with invalid coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...basicGeoJsonPoint,
                coordinates: ["3ght45y34", 39284],
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

        it("allows a basic geojson line string", () => {
            passGeoJSONSchemaTest(GeoJSONLineStringSchema, basicGeoJsonLineString);
        });

        it("allows a long 3D geojson line string", () => {
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

        it("allows line string with valid bbox", () => {
            passGeoJSONSchemaTest(GeoJSONLineStringSchema, {
                ...basicGeoJsonLineString,
                bbox: [1.0, 2.0, 3.0, 4.0],
            });
        });

        it("does not allow line string with bad position dimensions", () => {
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

        it("does not allow line string with invalid coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONLineStringSchema, {
                ...basicGeoJsonLineString,
                coordinates: [2.0],
            });
        });
    });

    // TODO: Fail tests for bad dimensions, incorrect bbox, invalid bbox dimensions, badly formatted bbox
    describe("GeoJSONMultiPoint", () => {
        const basicGeoJsonMultiPoint: GeoJSONMultiPoint = {
            type: "MultiPoint",
            coordinates: [
                [0.0, 0.0],
                [-3.0, 4.0],
                [8.0, -2.0],
            ],
        };

        it("allows a basic geojson multi point", () => {
            passGeoJSONSchemaTest(GeoJSONMultiPointSchema, basicGeoJsonMultiPoint);
        });

        it("allows a geojson multi point with bbox", () => {
            const geoJsonMultiPointWithBbox = {
                ...basicGeoJsonMultiPoint,
                bbox: bbox2D,
            };
            passGeoJSONSchemaTest(GeoJSONMultiPointSchema, geoJsonMultiPointWithBbox);
        });

        it("does not allow a geojson multi point with invalid bbox", () => {
            const geoJsonMultiPointWithInvalidBbox = {
                ...basicGeoJsonMultiPoint,
                bbox: [],
            };
            failGeoJSONSchemaTest(GeoJSONMultiPointSchema, geoJsonMultiPointWithInvalidBbox);
        });

        it("does not allow a geojson multi point with invalid coordinates", () => {
            const geoJsonMultiPointWithInvalidCoordinates = {
                ...basicGeoJsonMultiPoint,
                coordinates: [[[2.0]]],
            };
            failGeoJSONSchemaTest(GeoJSONMultiPointSchema, geoJsonMultiPointWithInvalidCoordinates);
        });
    });

    // TODO: Fail tests for bad dimensions, no linear rings, incorrect bbox, invalid bbox dimensions, badly formatted bbox
    describe("GeoJSONPolygon", () => {
        const basicGeoJsonPolygon: GeoJSONPolygon = {
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

        it("allows a basic geojson polygon", () => {
            passGeoJSONSchemaTest(GeoJSONPolygonSchema, basicGeoJsonPolygon);
        });

        it("allows a geojson polygon with bbox", () => {
            const geoJsonPolygonWithBbox = {
                ...basicGeoJsonPolygon,
                bbox: bbox2D,
            };
            passGeoJSONSchemaTest(GeoJSONPolygonSchema, geoJsonPolygonWithBbox);
        });

        it("allows a geojson polygon with a hole", () => {});

        it("does not allow a geojson polygon with invalid bbox", () => {});
        it("does not allow a geojson polygon with invalid coordinates", () => {});
    });

    describe("GeoJSONMultiLineString", () => {
        it("allows a basic geojson multi line string", () => {});
        it("allows a geojson multi line string with bbox", () => {});
        it("does not allow a geojson multi line string with invalid bbox", () => {});
        it("does not allow a geojson multi line string with invalid coordinates", () => {});
    });

    describe("GeoJSONMultiPolygon", () => {
        it("allows a basic geojson multi-polygon", () => {});
        it("allows a geojson multi-polygon with bbox", () => {});
        it("does not allow a geojson multi-polygon with invalid bbox", () => {});
        it("does not allow a geojson multi-polygon with invalid coordinates", () => {});
    });

    describe("GeoJSONGeometryCollection", () => {});

    describe("GeoJSONFeature", () => {});

    describe("GeoJSONFeatureCollection", () => {});
});
