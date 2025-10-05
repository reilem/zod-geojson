import z from "zod";

export const GeoJSONPropertiesSchema = z.record(z.string(), z.json()).nullable();

export type GeoJSONProperties = z.infer<typeof GeoJSONPropertiesSchema>;
