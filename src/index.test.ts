import { expect, it, describe } from "vitest";
import { ZodError, ZodSchema } from "zod";
import {
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
        const basicGeoJsonPoint: GeoJSONPoint = {
            type: "Point",
            coordinates: [1.0, 2.0],
        };

        it("allows a 2d point", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, basicGeoJsonPoint);
        });

        it("allows a 3D point", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...basicGeoJsonPoint,
                coordinates: [1.0, 2.0, 3.0],
            });
        });

        it("allows a 6D point", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...basicGeoJsonPoint,
                coordinates: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0],
            });
        });

        it("allows a 2D point with valid bbox", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...basicGeoJsonPoint,
                bbox: [1.0, 2.0, 1.0, 2.0],
            });
        });

        it("allows a 3D point with valid bbox", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...basicGeoJsonPoint,
                bbox: [1.0, 2.0, 1.0, 2.0],
            });
        });

        it("does not allow a point with incorrect bbox", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...basicGeoJsonPoint,
                bbox: [30, 10, 20, 100],
            });
        });

        it("does not allow a point with invalid bbox dimensions", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...basicGeoJsonPoint,
                bbox: [1.0, 2.0, 0.0, 1.0, 2.0, 0.0],
            });
        });

        it("does not allow a point with badly formatted bbox", () => {
            failGeoJSONSchemaTest(GeoJSONPointSchema, {
                ...basicGeoJsonPoint,
                bbox: ["hello"],
            });
        });

        it("does not allow a point with invalid coordinates", () => {
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

        it.skip("allows 3D line string with valid bbox", () => {});

        it("does not allow line string with invalid coordinates", () => {
            failGeoJSONSchemaTest(GeoJSONLineStringSchema, {
                ...basicGeoJsonLineString,
                coordinates: [2.0],
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
        const basicGeoJsonMultiPoint: GeoJSONMultiPoint = {
            type: "MultiPoint",
            coordinates: [
                [0.0, 0.0],
                [-3.0, 4.0],
                [8.0, -2.0],
            ],
        };

        it("allows a 2D multi point", () => {
            passGeoJSONSchemaTest(GeoJSONMultiPointSchema, basicGeoJsonMultiPoint);
        });

        it.skip("allows a 3D multi point", () => {});

        it("allows a 2D multi point with a valid bbox", () => {
            const geoJsonMultiPointWithBbox = {
                ...basicGeoJsonMultiPoint,
                bbox: [],
            };
            passGeoJSONSchemaTest(GeoJSONMultiPointSchema, geoJsonMultiPointWithBbox);
        });

        it.skip("allows a 3D multi point with valid bbox", () => {});

        it("does not allow a multi point with invalid coordinates", () => {
            const geoJsonMultiPointWithInvalidCoordinates = {
                ...basicGeoJsonMultiPoint,
                coordinates: [
                    [
                        [1.0, 2.0],
                        [3.0, 4.0],
                    ],
                ],
            };
            failGeoJSONSchemaTest(GeoJSONMultiPointSchema, geoJsonMultiPointWithInvalidCoordinates);
        });

        it.skip("does not allow multi point with inconsistent position dimensions", () => {});

        it.skip("does not allow a multi point with incorrect bbox", () => {});

        it.skip("does not allow a multi point with invalid bbox dimensions", () => {});

        it.skip("does not allow a multi point with badly formatted bbox", () => {});
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

        it("allows a 2D polygon", () => {
            passGeoJSONSchemaTest(GeoJSONPolygonSchema, basicGeoJsonPolygon);
        });

        it.skip("allows a 3D polygon", () => {});

        it("allows a 2D polygon with bbox", () => {
            const geoJsonPolygonWithBbox = {
                ...basicGeoJsonPolygon,
                bbox: bbox2D,
            };
            passGeoJSONSchemaTest(GeoJSONPolygonSchema, geoJsonPolygonWithBbox);
        });

        it.skip("allows a 3D polygon with bbox", () => {});

        it.skip("allows a 2D polygon with a hole", () => {});

        it.skip("allows a 2D polygon with a hole and bbox", () => {});

        it.skip("does not allow a polygon which is not linear ring", () => {});

        it.skip("does not allow a polygon with invalid coordinates", () => {});

        it.skip("does not allow a polygon with inconsistent position dimensions", () => {});

        it.skip("does not allow a polygon with incorrect bbox", () => {});

        it.skip("does not allow a polygon with invalid bbox dimensions", () => {});

        it.skip("does not allow a polygon with badly formatted bbox", () => {});
    });

    describe("GeoJSONMultiLineString", () => {
        it.skip("allows a 2D multi line string with one line", () => {});
        it.skip("allows a 2D multi line string with multiple lines", () => {});
        it.skip("allows a 3D multi line string", () => {});
        it.skip("allows a 2D multi line string with one line and bbox", () => {});
        it.skip("allows a 2D multi line string with multiples and with bbox", () => {});
        it.skip("allows a 3D multi line string with bbox", () => {});
        it.skip("does not allow a multi line string with invalid coordinates", () => {});
        it.skip("does not allow a multi line string with inconsistent position dimensions", () => {});
        it.skip("does not allow a multi line string with inconsistent position dimensions across lines", () => {});
        it.skip("does not allow a multi line string with incorrect bbox", () => {});
    });

    describe("GeoJSONMultiPolygon", () => {
        it.skip("allows a 2D multi-polygon with one polygon", () => {});
        it.skip("allows a 2D multi-polygon with multiple polygons", () => {});
        it.skip("allows a 3D multi-polygon with one polygon", () => {});
        it.skip("allows a 2D multi-polygon with one polygon and bbox", () => {});
        it.skip("allows a 2D multi-polygon with multiple polygons and bbox", () => {});
        it.skip("allows a 3D multi-polygon with one polygon and bbox", () => {});

        it.skip("does not allow a multi-polygon with a polygon that is not linear ring", () => {});
        it.skip("does not allow a multi-polygon with invalid coordinates", () => {});
        it.skip("does not allow a multi-polygon with inconsistent position dimensions", () => {});
        it.skip("does not allow a multi-polygon with inconsistent position dimensions across polygons", () => {});
        it.skip("does not allow a multi-polygon with incorrect bbox", () => {});
        it.skip("does not allow a multi-polygon with invalid bbox dimensions", () => {});
        it.skip("does not allow a multi-polygon with badly formatted bbox", () => {});
    });

    describe("GeoJSONGeometryCollection", () => {});

    describe("GeoJSONFeature", () => {});

    describe("GeoJSONFeatureCollection", () => {});
});
