import { z, ZodType } from "zod";
import { bboxEquals, getBboxForGeometries, INVALID_BBOX_ISSUE } from "./validation/bbox";
import { getDimensionForGeometry } from "./validation/dimension";
import { GeoJSONBaseSchema } from "../base";
import { GeoJSONGeometry, GeoJSONGeometrySchema } from "./index";

const INVALID_GEOMETRY_COLLECTION_KEYS_ISSUE = {
    code: "custom" as const,
    message:
        'GeoJSON geometry collection object cannot have "geometry", "coordinates", "properties", or "features" keys',
};

const INVALID_GEOMETRY_COLLECTION_DIMENSION_ISSUE = {
    code: "custom" as const,
    message: "Invalid geometry collection dimensions. All geometries must have the same dimension.",
};

function validGeometryCollectionKeys(collection: Record<string, unknown>): boolean {
    return (
        !("coordinates" in collection) &&
        !("geometry" in collection) &&
        !("properties" in collection) &&
        !("features" in collection)
    );
}

function validGeometryCollectionDimension({ geometries }: { geometries: GeoJSONGeometry[] }): boolean {
    let dimension = getDimensionForGeometry(geometries[0]);
    return geometries.slice(1).every((geometry) => getDimensionForGeometry(geometry) === dimension);
}

function validGeometryCollectionBbox({
    bbox,
    geometries,
}: {
    bbox?: number[];
    geometries: GeoJSONGeometry[];
}): boolean {
    if (!bbox) {
        return true;
    }
    const expectedBbox = getBboxForGeometries(geometries);
    return bboxEquals(bbox, expectedBbox);
}

const _GeoJSONGeometryCollectionBaseSchema = GeoJSONBaseSchema.extend({
    type: z.literal("GeometryCollection"),
});

export const GeoJSONGeometryCollectionSchema: ZodType<GeoJSONGeometryCollection> = _GeoJSONGeometryCollectionBaseSchema
    .extend({
        geometries: z.lazy(() => z.array(GeoJSONGeometrySchema)),
    })
    .passthrough()
    .superRefine((val, ctx) => {
        if (!validGeometryCollectionKeys(val)) {
            ctx.addIssue(INVALID_GEOMETRY_COLLECTION_KEYS_ISSUE);
            return;
        }
        if (!val.geometries.length) {
            return;
        }

        if (!validGeometryCollectionDimension(val)) {
            ctx.addIssue(INVALID_GEOMETRY_COLLECTION_DIMENSION_ISSUE);
            return;
        }

        if (!validGeometryCollectionBbox(val)) {
            ctx.addIssue(INVALID_BBOX_ISSUE);
            return;
        }
    });

export type GeoJSONGeometryCollection = z.infer<typeof _GeoJSONGeometryCollectionBaseSchema> & {
    geometries: GeoJSONGeometry[];
};
