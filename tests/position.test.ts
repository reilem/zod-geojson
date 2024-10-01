import { describe, expect, it } from "@jest/globals";
import { ZodError } from "zod";
import { GeoJSONPosition, GeoJSONPositionSchema } from "../src";

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

    it("does not allow empty positions", () => {
        expect(() => GeoJSONPositionSchema.parse([])).toThrow(ZodError);
    });

    describe("inference", () => {
        function testPositionType0D(_position: []): void {}
        function testPositionType1D(_position: [number]): void {}
        function testPositionType2D(_position: [number, number]): void {}
        function testPositionType3D(_position: [number, number, number]): void {}
        function testPositionType7D(_position: [number, number, number, number, number, number, number]): void {}

        it("should correctly infer 2D position", () => {
            const position: GeoJSONPosition = [1, 1];

            testPositionType2D(position);
        });

        it("should correctly infer 3D position", () => {
            const position: GeoJSONPosition = [1, 1, 1];

            testPositionType3D(position);
        });

        it("should correctly infer 7D position", () => {
            const position: GeoJSONPosition = [1, 1, 1, 1, 1, 1, 1];

            testPositionType7D(position);
        });

        it("should not infer 1D position", () => {
            // @ts-expect-error -- This should fail
            const position: GeoJSONPosition = [1];

            // @ts-expect-error -- This should fail
            testPositionType1D(position);
        });

        it("should not infer 0D position", () => {
            // @ts-expect-error -- This should fail
            const position: GeoJSONPosition = [];

            // @ts-expect-error -- This should fail
            testPositionType0D(position);
        });
    });
});
