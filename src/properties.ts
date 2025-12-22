import * as z from "zod";

export const GeoJSONPropertiesSchema = z.record(z.string(), z.json());

export type GeoJSONProperties = z.infer<typeof GeoJSONPropertiesSchema>;
