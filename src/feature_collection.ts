import { z } from "zod";
import { GeoJSONBaseSchema } from "./base";
import { GeoJSONBbox } from "./bbox";
import { GeoJSONFeature, GeoJSONFeatureSchema } from "./feature";
import { GeoJSONGeometry } from "./geometry";
import { bboxEquals, getBboxForGeometries, INVALID_BBOX_ISSUE } from "./geometry/validation/bbox";
import { getDimensionForGeometry } from "./geometry/validation/dimension";

const INVALID_FEATURE_COLLECTION_KEYS_ISSUE = {
    code: "custom" as const,
    message: 'GeoJSON feature cannot have "coordinates", "geometry", "properties", or "geometries" keys',
};

const INVALID_FEATURE_COLLECTION_DIMENSIONS_ISSUE = {
    code: "custom" as const,
    message: "Invalid dimensions. All features in feature collection must have the same dimension.",
};

function getGeometries({ features }: { features: GeoJSONFeature[] }): GeoJSONGeometry[] {
    return features.map((feature) => feature.geometry).filter((x): x is GeoJSONGeometry => x != null);
}

function validFeatureCollection(collection: Record<string, unknown>): boolean {
    return (
        !("coordinates" in collection) &&
        !("geometry" in collection) &&
        !("properties" in collection) &&
        !("geometries" in collection)
    );
}

function validFeatureCollectionDimensions(collection: { features: GeoJSONFeature[] }): boolean {
    const geometries = getGeometries(collection);
    if (geometries.length < 2) return true;
    const dimension = getDimensionForGeometry(geometries[0]);
    for (let i = 1; i < geometries.length; i++) {
        if (getDimensionForGeometry(geometries[i]) !== dimension) return false;
    }
    return true;
}

function validFeatureCollectionBbox({ features, bbox }: { features: GeoJSONFeature[]; bbox?: GeoJSONBbox }) {
    if (!bbox) return true;
    const expectedBbox = getBboxForGeometries(getGeometries({ features }));
    return bboxEquals(expectedBbox, bbox);
}

export const GeoJSONFeatureCollectionSchema = GeoJSONBaseSchema.extend({
    type: z.literal("FeatureCollection"),
    features: z.array(GeoJSONFeatureSchema),
})
    .passthrough()
    .superRefine((val, ctx) => {
        if (!validFeatureCollection(val)) {
            ctx.addIssue(INVALID_FEATURE_COLLECTION_KEYS_ISSUE);
            return;
        }

        if (!val.features.length) return;

        if (!validFeatureCollectionDimensions(val)) {
            ctx.addIssue(INVALID_FEATURE_COLLECTION_DIMENSIONS_ISSUE);
            return;
        }

        if (!validFeatureCollectionBbox(val)) {
            ctx.addIssue(INVALID_BBOX_ISSUE);
            return;
        }
    });

export type GeoJSONFeatureCollection = z.infer<typeof GeoJSONFeatureCollectionSchema>;
