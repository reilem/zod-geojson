import { describe, expect, it } from "@jest/globals";
import { ZodError } from "zod";
import { bbox2D, bbox3D, bbox4D } from "../examples/bbox";
import { GeoJSONBBoxSchema, GeoJSONBbox } from "../src";

describe("GeoJSONBBox", () => {
    it("allows 2D bbox", () => {
        expect(GeoJSONBBoxSchema.parse(bbox2D)).toEqual(bbox2D);
    });

    it("allows 3D bbox", () => {
        expect(GeoJSONBBoxSchema.parse(bbox3D)).toEqual(bbox3D);
    });

    it("allows 4D bbox", () => {
        expect(GeoJSONBBoxSchema.parse(bbox4D)).toEqual(bbox4D);
    });

    it("does not allow an empty bbox", () => {
        expect(() => GeoJSONBBoxSchema.parse([])).toThrow(ZodError);
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

    describe("inference", () => {
        function testBboxType0D(_position: []): void {}
        function testBboxType1D(_position: [number]): void {}
        function testBboxType2D(_position: [number, number]): void {}
        function testBboxType3D(_position: [number, number, number]): void {}
        function testBboxTypeCorrect(_position: [number, number, number, number, ...number[]]): void {}

        it("should correctly infer 4D bbox", () => {
            const bbox: GeoJSONBbox = [1, 1, 1, 1];

            testBboxTypeCorrect(bbox);
        });

        it("should correctly infer 6D bbox", () => {
            const bbox: GeoJSONBbox = [1, 1, 1, 1, 1, 1];

            testBboxTypeCorrect(bbox);
        });

        it("should correctly infer 10D bbox", () => {
            const bbox: GeoJSONBbox = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

            testBboxTypeCorrect(bbox);
        });

        it("should not infer 3D bbox", () => {
            // @ts-expect-error -- This should fail
            const bbox: GeoJSONBbox = [1, 1, 1];

            // @ts-expect-error -- This should fail
            testBboxType3D(bbox);
        });

        it("should not infer 2D bbox", () => {
            // @ts-expect-error -- This should fail
            const bbox: GeoJSONBbox = [1, 1];

            // @ts-expect-error -- This should fail
            testBboxType2D(bbox);
        });

        it("should not infer 1D bbox", () => {
            // @ts-expect-error -- This should fail
            const bbox: GeoJSONBbox = [1];

            // @ts-expect-error -- This should fail
            testBboxType1D(bbox);
        });

        it("should not infer 0D bbox", () => {
            // @ts-expect-error -- This should fail
            const bbox: GeoJSONBbox = [];

            // @ts-expect-error -- This should fail
            testBboxType0D(bbox);
        });
    });
});
