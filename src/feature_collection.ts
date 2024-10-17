import { z } from "zod";
import { GeoJSONBaseSchema } from "./base";
import { GeoJSONBbox } from "./bbox";
import { GeoJSONFeature, GeoJSONFeatureGenericSchema } from "./feature";
import { GeoJSONGeometry } from "./geometry";
import { bboxEquals, getBboxForGeometries, INVALID_BBOX_ISSUE } from "./geometry/validation/bbox";
import { getDimensionForGeometry } from "./geometry/validation/dimension";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "./position";
import { GeoJSONTypeSchema } from "./type";

type ValidatableGeoJSONFeatureCollection = { features: GeoJSONFeature[]; bbox?: GeoJSONBbox };

const INVALID_FEATURE_COLLECTION_KEYS_ISSUE = {
    code: "custom" as const,
    message: 'GeoJSON feature cannot have "coordinates", "geometry", "properties", or "geometries" keys',
};

const INVALID_FEATURE_COLLECTION_DIMENSIONS_ISSUE = {
    code: "custom" as const,
    message: "Invalid dimensions. All features in feature collection must have the same dimension.",
};

function getGeometries({ features }: ValidatableGeoJSONFeatureCollection): GeoJSONGeometry[] {
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

function validFeatureCollectionDimensions(collection: ValidatableGeoJSONFeatureCollection): boolean {
    const geometries = getGeometries(collection);
    const dimension = getDimensionForGeometry(geometries[0]);
    return geometries.slice(1).every((geometry) => getDimensionForGeometry(geometry) === dimension);
}

function validFeatureCollectionBbox({ features, bbox }: ValidatableGeoJSONFeatureCollection) {
    if (!bbox) {
        return true;
    }
    const expectedBbox = getBboxForGeometries(getGeometries({ features }));
    return bboxEquals(expectedBbox, bbox);
}

export const GeoJSONFeatureCollectionGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    GeoJSONBaseSchema.extend({
        type: z.literal(GeoJSONTypeSchema.enum.FeatureCollection),
        features: z.array(GeoJSONFeatureGenericSchema(positionSchema)),
    })
        .passthrough()
        .superRefine((val, ctx) => {
            if (!validFeatureCollection(val)) {
                ctx.addIssue(INVALID_FEATURE_COLLECTION_KEYS_ISSUE);
                return;
            }

            if (!val.features.length) {
                return;
            }

            // Type-cast is safe, but necessary because the type of val is not inferred correctly due to the generics
            if (!validFeatureCollectionDimensions(val as ValidatableGeoJSONFeatureCollection)) {
                ctx.addIssue(INVALID_FEATURE_COLLECTION_DIMENSIONS_ISSUE);
                return;
            }

            // Type-cast is safe, but necessary because the type of val is not inferred correctly due to the generics
            if (!validFeatureCollectionBbox(val as ValidatableGeoJSONFeatureCollection)) {
                ctx.addIssue(INVALID_BBOX_ISSUE);
                return;
            }
        });

export const GeoJSONFeatureCollectionSchema = GeoJSONFeatureCollectionGenericSchema(GeoJSONPositionSchema);
export type GeoJSONFeatureCollection = z.infer<typeof GeoJSONFeatureCollectionSchema>;

export const GeoJSON2DFeatureCollectionSchema = GeoJSONFeatureCollectionGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DFeatureCollection = z.infer<typeof GeoJSON2DFeatureCollectionSchema>;

export const GeoJSON3DFeatureCollectionSchema = GeoJSONFeatureCollectionGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DFeatureCollection = z.infer<typeof GeoJSON3DFeatureCollectionSchema>;
