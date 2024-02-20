import { describe, expect, it } from "vitest";
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
});
