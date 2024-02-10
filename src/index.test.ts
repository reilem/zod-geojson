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
    GeoJSONPoint,
    GeoJSONPointSchema,
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
        const baseGeoJsonPoint: GeoJSONPoint = {
            type: "Point",
            coordinates: [1.0, 2.0],
        };

        it("allows a basic geojson point", () => {
            passGeoJSONSchemaTest(GeoJSONPointSchema, baseGeoJsonPoint);
        });

        it("allow a geojson point with bbox", () => {
            const geoJsonPointWithBbox: GeoJSONPoint = {
                ...baseGeoJsonPoint,
                bbox: bbox2D,
            };
            passGeoJSONSchemaTest(GeoJSONPointSchema, geoJsonPointWithBbox);
        });

        it("does not allow a geojson point with invalid bbox", () => {
            const geoJsonPointWithInvalidBbox: GeoJSONPoint = {
                ...baseGeoJsonPoint,
                bbox: [],
            };
            failGeoJSONSchemaTest(GeoJSONPointSchema, geoJsonPointWithInvalidBbox);
        });

        it("does not allow a geojson point with invalid coordinates", () => {
            const geoJsonPointWithInvalidCoordinates = {
                ...baseGeoJsonPoint,
                coordinates: ["3ght45y34", 39284],
            };
            failGeoJSONSchemaTest(GeoJSONPointSchema, geoJsonPointWithInvalidCoordinates);
        });
    });

    describe("GeoJSONLineString", () => {});

    describe("GeoJSONMultiPoint", () => {});

    describe("GeoJSONPolygon", () => {});

    describe("GeoJSONMultiLineString", () => {});

    describe("GeoJSONMultiPolygon", () => {});

    describe("GeoJSONGeometryCollection", () => {});

    describe("GeoJSONGeometry", () => {});

    describe("GeoJSONFeature", () => {});

    describe("GeoJSONFeatureCollection", () => {});

    describe("GeoJSON", () => {});
});
