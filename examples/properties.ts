import { GeoJSONProperties } from "../src/properties";

export const geoJsonPropertiesEmpty = {} satisfies GeoJSONProperties;

export const geoJsonPropertiesSimple = { name: "item1", size: 234 } satisfies GeoJSONProperties;

export const geoJsonPropertiesComplex = {
    openField: "disputed",
    rating: 4.5,
    tags: ["a", "b", "c"],
    metadata: { createdBy: "user123", verified: true },
    optionalField: null,
} satisfies GeoJSONProperties;
