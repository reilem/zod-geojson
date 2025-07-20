/**
 * This file tests that the GeoJSONGeometry schema is correctly typed and that the types returned after
 * parsing match the expected GeoJSONGeometry types.
 */

import { GeoJSONGeometrySchema } from "../../src";

/**
 * Tests that the GeoJSON schema is correctly typed
 */
// @ts-expect-error -- THIS SHOULD FAIL: anything does not exist on GeoJSONGeometrySchema
GeoJSONGeometrySchema.anything();
// @ts-expect-error -- THIS SHOULD FAIL: GeoJSONGeometrySchema.parse needs a parameter
GeoJSONGeometrySchema.parse();

/**
 * Test that types are correct after parsing
 */
export const parsedGeoJson = GeoJSONGeometrySchema.parse({ type: "Point", coordinates: [1.0, 2.0] });

if (parsedGeoJson.type === "Point") {
    // @ts-expect-error -- THIS SHOULD FAIL: single geometries do not have a properties field
    parsedGeoJson.properties = { foo: "bar" };
    // @ts-expect-error -- THIS SHOULD FAIL: single geometries do not have a geometries field
    parsedGeoJson.geometries = [];
    // @ts-expect-error -- THIS SHOULD FAIL: single geometries do not have a features field
    parsedGeoJson.features = [];
    // @ts-expect-error -- THIS SHOULD FAIL: single geometries do not have a geometry field
    parsedGeoJson.geometry = { type: "Point", coordinates: [1.0, 2.0] };

    // This should succeed
    parsedGeoJson.coordinates = [5.0, 4.0];
} else if (parsedGeoJson.type === "GeometryCollection") {
    // @ts-expect-error -- THIS SHOULD FAIL: geometry collections do not have a properties field
    parsedGeoJson.properties = { foo: "bar" };
    // @ts-expect-error -- THIS SHOULD FAIL: geometry collections do not have a coordinates field
    parsedGeoJson.coordinates = [];
    // @ts-expect-error -- THIS SHOULD FAIL: geometry collections do not have a features field
    parsedGeoJson.features = [];
    // @ts-expect-error -- THIS SHOULD FAIL: single geometries do not have a geometry field
    parsedGeoJson.geometry = { type: "Point", coordinates: [1.0, 2.0] };

    // This should succeed
    parsedGeoJson.geometries = [];
}
