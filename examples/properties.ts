import { GeoJSONProperties } from "../src/properties";

export const geoJsonPropertiesEmpty: GeoJSONProperties = {};

export const geoJsonPropertiesSimple: GeoJSONProperties = { name: "item1", size: 234 };

export const geoJsonPropertiesComplex: GeoJSONProperties = {
    openField: "disputed",
    rating: 4.5,
    tags: ["a", "b", "c"],
    metadata: { createdBy: "user123", verified: true },
    optionalField: null,
};
