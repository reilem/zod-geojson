import { z } from "zod";
import { _GeoJSONSimpleGeometryGenericSchema } from "./_simple";
import { bboxEquals, getBboxForGeometries, INVALID_BBOX_ISSUE } from "./validation/bbox";
import { getDimensionForGeometry } from "./validation/dimension";
import { GeoJSONBaseSchema } from "../base";
import { GeoJSONGeometry } from "./index";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "../position";

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

function validGeometryCollectionDimension({ geometries }: { geometries?: GeoJSONGeometry[] }): boolean {
    if (geometries == null) return false;
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

export const GeoJSONGeometryCollectionGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    _GeoJSONGeometryCollectionBaseSchema
        .extend({
            geometries: _GeoJSONSimpleGeometryGenericSchema(positionSchema).array(),
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

            // This type cast is necessary because the type of val.geometries is not inferred correctly
            if (!validGeometryCollectionDimension(val as { geometries: GeoJSONGeometry[] })) {
                ctx.addIssue(INVALID_GEOMETRY_COLLECTION_DIMENSION_ISSUE);
                return;
            }

            // This type cast is necessary because the type of val.geometries is not inferred correctly
            if (!validGeometryCollectionBbox(val as { geometries: GeoJSONGeometry[] })) {
                ctx.addIssue(INVALID_BBOX_ISSUE);
                return;
            }
        });

export const GeoJSONGeometryCollectionSchema = GeoJSONGeometryCollectionGenericSchema(GeoJSONPositionSchema);
export type GeoJSONGeometryCollection = z.infer<typeof GeoJSONGeometryCollectionSchema>;

export const GeoJSON2DGeometryCollectionSchema = GeoJSONGeometryCollectionGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DGeometryCollection = z.infer<typeof GeoJSON2DGeometryCollectionSchema>;

export const GeoJSON3DGeometryCollectionSchema = GeoJSONGeometryCollectionGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DGeometryCollection = z.infer<typeof GeoJSON3DGeometryCollectionSchema>;
