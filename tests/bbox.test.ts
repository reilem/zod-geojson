import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { bbox2D, bbox3D, bbox4D } from "../examples/bbox";
import { GeoJSONBBoxSchema } from "../src";

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

    it("does not allow an invalid bbox", () => {
        expect(() => GeoJSONBBoxSchema.parse([0])).toThrow(ZodError);
    });

    it("does not allow an uneven bbox", () => {
        expect(() => GeoJSONBBoxSchema.parse([0.0, 3.0, -1.0])).toThrow(ZodError);
    });

    it("does not allow a badly formatted bbox", () => {
        expect(() => GeoJSONBBoxSchema.parse("bbox cannot be a string")).toThrow(ZodError);
    });
});
