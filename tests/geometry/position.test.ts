import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import { point as turfPoint } from "@turf/helpers";
import * as z from "zod";
import {
    GeoJSON2DPosition,
    GeoJSON2DPositionSchema,
    GeoJSON3DPosition,
    GeoJSON3DPositionSchema,
    GeoJSONPosition,
    GeoJSONPositionSchema,
} from "../../src";

const position2D: GeoJSONPosition = [0, 0];

const position3D: GeoJSONPosition = [1, 2, 3];

const position4D = [1, 2, 3, 4] as const;

describe("GeoJSONPosition", () => {
    it("allows 2D positions", () => {
        expect(GeoJSONPositionSchema.parse(position2D)).toEqual(position2D);
    });
    it("allows 3D positions", () => {
        expect(GeoJSONPositionSchema.parse(position3D)).toEqual(position3D);
    });

    it("does not allow 1D positions", () => {
        expect(() => GeoJSONPositionSchema.parse([1])).toThrow(z.ZodError);
    });
    it("does not allow 4D positions", () => {
        expect(() => GeoJSONPositionSchema.parse(position4D)).toThrow(z.ZodError);
    });

    it("does not allow empty positions", () => {
        expect(() => GeoJSONPositionSchema.parse([])).toThrow(z.ZodError);
    });

    describe("2D", () => {
        it("allows a 2D position", () => {
            expect(GeoJSON2DPositionSchema.parse(position2D)).toEqual(position2D);
        });
        it("does not allow a 3D position", () => {
            expect(() => GeoJSON2DPositionSchema.parse(position3D)).toThrow(z.ZodError);
        });
        it("does not allow a 4D position", () => {
            expect(() => GeoJSON2DPositionSchema.parse(position4D)).toThrow(z.ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D position", () => {
            expect(GeoJSON3DPositionSchema.parse(position3D)).toEqual(position3D);
        });
        it("does not allow a 2D position", () => {
            expect(() => GeoJSON3DPositionSchema.parse(position2D)).toThrow(z.ZodError);
        });
        it("does not allow a 4D position", () => {
            expect(() => GeoJSON3DPositionSchema.parse(position4D)).toThrow(z.ZodError);
        });
    });

    describe("turf.js", () => {
        it("validates 2D position from turf.js", () => {
            const position = turfPoint([1, 2]).geometry.coordinates;
            expect(GeoJSONPositionSchema.parse(position)).toEqual(position);
        });

        it("validates 3D position from turf.js", () => {
            const position = turfPoint([1, 2, 3]).geometry.coordinates;
            expect(GeoJSONPositionSchema.parse(position)).toEqual(position);
        });
    });
});

/**
 * Invalid GeoJSON position to test types
 */
/**
 * Invalid 2D GeoJSON positions to test types
 */
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonPosition2DTooBig: GeoJSON2DPosition = [1, 2, 3];
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonPosition2DTooSmall: GeoJSON2DPosition = [1];

/**
 * Invalid 3D GeoJSON positions to test types
 */
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonPosition3DTooBig: GeoJSON3DPosition = [1, 2, 3, 4];
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonPosition3DTooSmall: GeoJSON3DPosition = [1, 2];

/**
 * Test that types match with @types/geojson
 */
export const position1: GeoJSONTypes.Position = position2D;
export const position2: GeoJSONTypes.Position = position3D;
export const position3: GeoJSONTypes.Position = position3D as GeoJSONPosition;

/**
 * Test that @types/geojson match with our types
 */
export const position4: GeoJSONPosition = position1;

/**
 * Test that turf.js matches our types
 */
export const position5: GeoJSONPosition = turfPoint([0, 0]).geometry.coordinates;
export const position6: GeoJSONPosition = turfPoint([0, 0, 0]).geometry.coordinates;
