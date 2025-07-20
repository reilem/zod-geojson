/**
 * This file tests that the GeoJSONFeatureCollection schema is correctly typed and that the types returned after
 * parsing match the expected GeoJSONFeatureCollection types.
 */

import { GeoJSONFeatureCollectionSchema } from "../../src";

/**
 * Tests that the GeoJSON schema is correctly typed
 */
// @ts-expect-error -- THIS SHOULD FAIL: anything does not exist on GeoJSONFeatureCollectionSchema
GeoJSONFeatureCollectionSchema.anything();
// @ts-expect-error -- THIS SHOULD FAIL: GeoJSONFeatureCollectionSchema.parse needs a parameter
GeoJSONFeatureCollectionSchema.parse();

/**
 * Test that types are correct after parsing
 */
export const parsedGeoJson = GeoJSONFeatureCollectionSchema.parse({
    type: "FeatureCollection",
    features: [],
});
// @ts-expect-error -- THIS SHOULD FAIL: feature collections do not have a coordinates field
parsedGeoJson.coordinates = [];
// @ts-expect-error -- THIS SHOULD FAIL: feature collections do not have a geometry field
parsedGeoJson.geometry = { type: "Point", coordinates: [1.0, 2.0] };
// @ts-expect-error -- THIS SHOULD FAIL: feature collections do not have a properties field
parsedGeoJson.properties = { foo: "bar" };
// This should succeed
parsedGeoJson.features = [{ type: "Feature", geometry: { type: "Point", coordinates: [1.0, 2.0] }, properties: {} }];
