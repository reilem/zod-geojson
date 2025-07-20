/**
 * This file tests that the GeoJSONFeature schema is correctly typed and that the types returned after
 * parsing match the expected GeoJSONFeature types.
 */

import { GeoJSONFeatureSchema } from "../../src";

/**
 * Tests that the GeoJSON schema is correctly typed
 */
// @ts-expect-error -- THIS SHOULD FAIL: anything does not exist on GeoJSONFeatureSchema
GeoJSONFeatureSchema.anything();
// @ts-expect-error -- THIS SHOULD FAIL: GeoJSONFeatureSchema.parse needs a parameter
GeoJSONFeatureSchema.parse();

/**
 * Test that types are correct after parsing
 */
export const parsedGeoJsonFeature = GeoJSONFeatureSchema.parse({
    type: "Feature",
    geometry: { type: "Point", coordinates: [1.0, 2.0] },
});
// @ts-expect-error -- THIS SHOULD FAIL: features do not have a coordinates field
parsedGeoJsonFeature.coordinates = [];
// @ts-expect-error -- THIS SHOULD FAIL: features do not have a geometries field
parsedGeoJsonFeature.geometries = [];
// @ts-expect-error -- THIS SHOULD FAIL: features do not have a features field
parsedGeoJsonFeature.features = [];
// This should succeed
parsedGeoJsonFeature.geometry = { type: "Point", coordinates: [1.0, 2.0] };
// This should succeed
parsedGeoJsonFeature.properties = { foo: "bar" };
