import { describe, expect, it } from "@jest/globals";
import type GeoJSONTypes from "geojson";
import { ZodError } from "zod/v4";
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

const position4D = [1, 2, 3, 4];

describe("GeoJSONPosition", () => {
    it("allows 2D positions", () => {
        expect(GeoJSONPositionSchema.parse(position2D)).toEqual(position2D);
    });
    it("allows 3D positions", () => {
        expect(GeoJSONPositionSchema.parse(position3D)).toEqual(position3D);
    });

    it("does not allow 1D positions", () => {
        expect(() => GeoJSONPositionSchema.parse([1])).toThrow(ZodError);
    });
    it("does not allow 4D positions", () => {
        expect(() => GeoJSONPositionSchema.parse(position4D)).toThrow(ZodError);
    });

    it("does not allow empty positions", () => {
        expect(() => GeoJSONPositionSchema.parse([])).toThrow(ZodError);
    });

    describe("2D", () => {
        it("allows a 2D position", () => {
            expect(GeoJSON2DPositionSchema.parse(position2D)).toEqual(position2D);
        });
        it("does not allow a 3D position", () => {
            expect(() => GeoJSON2DPositionSchema.parse(position3D)).toThrow(ZodError);
        });
        it("does not allow a 4D position", () => {
            expect(() => GeoJSON2DPositionSchema.parse(position4D)).toThrow(ZodError);
        });
    });

    describe("3D", () => {
        it("allows a 3D position", () => {
            expect(GeoJSON3DPositionSchema.parse(position3D)).toEqual(position3D);
        });
        it("does not allow a 2D position", () => {
            expect(() => GeoJSON3DPositionSchema.parse(position2D)).toThrow(ZodError);
        });
        it("does not allow a 4D position", () => {
            expect(() => GeoJSON3DPositionSchema.parse(position4D)).toThrow(ZodError);
        });
    });
});

/**
 * Invalid GeoJSON position to test types
 */
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonPositionTooSmall: GeoJSONPosition = [1];
// @ts-expect-error -- THIS SHOULD FAIL
export const invalidGeoJsonPositionTooBig: GeoJSONPosition = [1, 2, 3, 4];

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
