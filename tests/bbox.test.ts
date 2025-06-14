import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import { ZodError } from "zod/v4";
import { bbox2D, bbox3D } from "../examples/bbox";
import { GeoJSONBboxSchema, GeoJSONBbox } from "../src";
import { GeoJSON2DBbox, GeoJSON2DBboxSchema, GeoJSON3DBbox, GeoJSON3DBboxSchema } from "../src/bbox";

const bbox4D = [0, 0, 0, 0, 0, 0, 0, 0];

describe("GeoJSONBbox", () => {
    it("allows 2D bbox", () => {
        expect(GeoJSONBboxSchema.parse(bbox2D)).toEqual(bbox2D);
    });

    it("allows 3D bbox", () => {
        expect(GeoJSONBboxSchema.parse(bbox3D)).toEqual(bbox3D);
    });

    it("does not allow an empty bbox", () => {
        expect(() => GeoJSONBboxSchema.parse([])).toThrow(ZodError);
    });

    it("does not allow a 4D bbox", () => {
        expect(() => GeoJSONBboxSchema.parse(bbox4D)).toThrow(ZodError);
    });

    it("does not allow a bbox with 1 position", () => {
        expect(() => GeoJSONBboxSchema.parse([0])).toThrow(ZodError);
    });

    it("does not allow a bbox with 2 positions", () => {
        expect(() => GeoJSONBboxSchema.parse([0, 0])).toThrow(ZodError);
    });

    it("does not allow a bbox with 3 positions", () => {
        expect(() => GeoJSONBboxSchema.parse([0, 0, 0])).toThrow(ZodError);
    });

    it("does not allow an uneven bbox", () => {
        expect(() => GeoJSONBboxSchema.parse([0.0, 3.0, -1.0, 2.0, 5.0])).toThrow(ZodError);
    });

    it("does not allow a badly formatted bbox", () => {
        expect(() => GeoJSONBboxSchema.parse("bbox cannot be a string")).toThrow(ZodError);
    });

    describe("2D", () => {
        it("allows a 2D bbox", () => {
            expect(GeoJSON2DBboxSchema.parse(bbox2D)).toEqual(bbox2D);
        });
        it("does not allow a 3D bbox", () => {
            expect(() => GeoJSON2DBboxSchema.parse(bbox3D)).toThrow(ZodError);
        });
        it("does not allow a 4D bbox", () => {
            expect(() => GeoJSON2DBboxSchema.parse(bbox4D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D bbox", () => {
            expect(GeoJSON3DBboxSchema.parse(bbox3D)).toEqual(bbox3D);
        });
        it("does not allow a 2D bbox", () => {
            expect(() => GeoJSON3DBboxSchema.parse(bbox2D)).toThrow(ZodError);
        });
        it("does not allow a 4D bbox", () => {
            expect(() => GeoJSON3DBboxSchema.parse(bbox4D)).toThrow(ZodError);
        });
    });
});

/**
 * Invalid bbox's to test types
 */
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBboxEmpty: GeoJSONBbox = [];
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBbox1: GeoJSONBbox = [0.0];
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBbox2: GeoJSONBbox = [0.0, 0.0];
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBbox3: GeoJSONBbox = [0.0, 0.0, 0.0];

/**
 * Invalid 2D bbox's to test types
 */
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBbox2D3: GeoJSON2DBbox = [0.0, 0.0, 0.0];
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBbox2D5: GeoJSON2DBbox = [0.0, 0.0, 0.0, 0.0, 0.0];

/**
 * Invalid 3D bbox's to test types
 */
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBbox3D5: GeoJSON3DBbox = [0.0, 0.0, 0.0, 0.0, 0.0];
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidBbox3D7: GeoJSON3DBbox = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

/**
 * Test that types match with @types/geojson
 */
export const bbox1: GeoJSONTypes.BBox = bbox2D as GeoJSONBbox;
export const bbox2: GeoJSONTypes.BBox = bbox2D;
export const bbox3: GeoJSONTypes.BBox = bbox3D;
