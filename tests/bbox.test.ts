import { describe, expect, it } from "@jest/globals";
import { point as turfPoint } from "@turf/helpers";
import type GeoJSONTypes from "geojson";
import { ZodError } from "zod/v4";
import { bbox2D, bbox3D } from "../examples/bbox";
import { GeoJSONBBox, GeoJSONBBoxSchema } from "../src";
import { GeoJSON2DBBox, GeoJSON2DBBoxSchema, GeoJSON3DBBox, GeoJSON3DBBoxSchema } from "../src/bbox";

const bbox4D = [0, 0, 0, 0, 0, 0, 0, 0];

describe("GeoJSONBBox", () => {
    it("allows 2D bbox", () => {
        expect(GeoJSONBBoxSchema.parse(bbox2D)).toEqual(bbox2D);
    });

    it("allows 3D bbox", () => {
        expect(GeoJSONBBoxSchema.parse(bbox3D)).toEqual(bbox3D);
    });

    it("does not allow an empty bbox", () => {
        expect(() => GeoJSONBBoxSchema.parse([])).toThrow(ZodError);
    });

    it("does not allow a 4D bbox", () => {
        expect(() => GeoJSONBBoxSchema.parse(bbox4D)).toThrow(ZodError);
    });

    it("does not allow a bbox with 1 position", () => {
        expect(() => GeoJSONBBoxSchema.parse([0])).toThrow(ZodError);
    });

    it("does not allow a bbox with 2 positions", () => {
        expect(() => GeoJSONBBoxSchema.parse([0, 0])).toThrow(ZodError);
    });

    it("does not allow a bbox with 3 positions", () => {
        expect(() => GeoJSONBBoxSchema.parse([0, 0, 0])).toThrow(ZodError);
    });

    it("does not allow an uneven bbox", () => {
        expect(() => GeoJSONBBoxSchema.parse([0.0, 3.0, -1.0, 2.0, 5.0])).toThrow(ZodError);
    });

    it("does not allow a badly formatted bbox", () => {
        expect(() => GeoJSONBBoxSchema.parse("bbox cannot be a string")).toThrow(ZodError);
    });

    describe("2D", () => {
        it("allows a 2D bbox", () => {
            expect(GeoJSON2DBBoxSchema.parse(bbox2D)).toEqual(bbox2D);
        });
        it("does not allow a 3D bbox", () => {
            expect(() => GeoJSON2DBBoxSchema.parse(bbox3D)).toThrow(ZodError);
        });
        it("does not allow a 4D bbox", () => {
            expect(() => GeoJSON2DBBoxSchema.parse(bbox4D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D bbox", () => {
            expect(GeoJSON3DBBoxSchema.parse(bbox3D)).toEqual(bbox3D);
        });
        it("does not allow a 2D bbox", () => {
            expect(() => GeoJSON3DBBoxSchema.parse(bbox2D)).toThrow(ZodError);
        });
        it("does not allow a 4D bbox", () => {
            expect(() => GeoJSON3DBBoxSchema.parse(bbox4D)).toThrow(ZodError);
        });
    });

    describe("turf.js", () => {
        it("validates bbox from turf.js", () => {
            const bbox = turfPoint([0, 0, 0], {}, { bbox: [0, 0, 0, 1, 1, 1] }).bbox;
            expect(GeoJSON3DBBoxSchema.parse(bbox)).toEqual(bbox);
        });
    });
});

/**
 * Invalid bbox's to test types
 */
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBBoxEmpty: GeoJSONBBox = [];
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBBox1: GeoJSONBBox = [0.0];
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBBox2: GeoJSONBBox = [0.0, 0.0];
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBBox3: GeoJSONBBox = [0.0, 0.0, 0.0];

/**
 * Invalid 2D bbox's to test types
 */
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBBox2D3: GeoJSON2DBBox = [0.0, 0.0, 0.0];
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBBox2D5: GeoJSON2DBBox = [0.0, 0.0, 0.0, 0.0, 0.0];

/**
 * Invalid 3D bbox's to test types
 */
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBBox3D5: GeoJSON3DBBox = [0.0, 0.0, 0.0, 0.0, 0.0];
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBBox3D7: GeoJSON3DBBox = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

/**
 * Test that types match with @types/geojson
 */
export const bbox1: GeoJSONTypes.BBox = bbox2D;
export const bbox2: GeoJSONTypes.BBox = bbox2D as GeoJSONBBox;
export const bbox3: GeoJSONTypes.BBox = bbox3D;

/**
 * Test that @types/geojson matches our types
 */
export const bbox4: GeoJSONBBox = bbox1;

/**
 * Test that turf.js matches our types
 */
export const bbox5: GeoJSONBBox | undefined = turfPoint([0, 0, 0], {}, { bbox: [0, 0, 0, 0, 0, 0] }).bbox;
