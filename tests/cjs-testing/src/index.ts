import { GeoJSONSchema } from "zod-geojson";

function main() {
    const badResult = GeoJSONSchema.safeParse({
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: [[0, 0], [1, 0], [1, 2], []],
        },
        properties: null,
    });
    if (badResult.error != null) {
        console.log("[PASS] Detects bad GeoJSON");
    } else {
        console.error("[FAIL] Failed to detect bad GeoJSON");
        process.exit(1);
    }

    const goodResult = GeoJSONSchema.safeParse({
        type: "Point",
        coordinates: [0.0, 1.0],
    });
    if (goodResult.error == null) {
        console.log("[PASS] Parses good GeoJSON");
    } else {
        console.error("[FAIL] Failed to parse good GeoJSON");
        process.exit(1);
    }
}

main();

// TYPES TESTING

// @ts-expect-error -- SHOULD FAIL
if ("anything" in GeoJSONSchema) GeoJSONSchema.anything();

const goodResult = GeoJSONSchema.parse({
    type: "Point",
    coordinates: [0.0, 1.0],
});

if (goodResult.type === "Point") {
    // @ts-expect-error -- SHOULD FAIL
    goodResult.geometries = [4, 5];
}
