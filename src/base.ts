import { z } from "zod";
import { GeoJSONBbox, GeoJSONBBoxSchema, GeoJSONBboxSchemaType } from "./bbox";

export type GeoJSONBase = {
    bbox?: GeoJSONBbox;
};

export type GeoJSONBaseSchemaInnerType = {
    bbox: z.ZodOptional<GeoJSONBboxSchemaType>;
};

export type GeoJSONBaseSchemaType = z.ZodObject<
    GeoJSONBaseSchemaInnerType,
    "strip",
    z.ZodTypeAny,
    GeoJSONBase,
    GeoJSONBase
>;

export const GeoJSONBaseSchema: GeoJSONBaseSchemaType = z.object({
    bbox: GeoJSONBBoxSchema.optional(),
});
