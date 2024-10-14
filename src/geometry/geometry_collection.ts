import { z } from "zod";
import { _GeoJSONSimpleGeometryGenericSchema } from "./_simple";
import { bboxEquals, getBboxForGeometries, INVALID_BBOX_ISSUE } from "./validation/bbox";
import { getDimensionForGeometry } from "./validation/dimension";
import { GeoJSONGeometry } from "./index";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "../position";
import { GeoJSONBaseSchema } from "../base";

type ValidatableGeometryCollection = { geometries: GeoJSONGeometry[]; bbox?: number[] };

const INVALID_GEOMETRY_COLLECTION_DIMENSION_ISSUE = {
    code: "custom" as const,
    message: "Invalid geometry collection dimensions. All geometries must have the same dimension.",
};

function validGeometryCollectionDimension({ geometries }: ValidatableGeometryCollection): boolean {
    if (geometries == null) return false;
    let dimension = getDimensionForGeometry(geometries[0]);
    return geometries.slice(1).every((geometry) => getDimensionForGeometry(geometry) === dimension);
}

function validGeometryCollectionBbox({ bbox, geometries }: ValidatableGeometryCollection): boolean {
    if (!bbox) {
        return true;
    }
    const expectedBbox = getBboxForGeometries(geometries);
    return bboxEquals(bbox, expectedBbox);
}

const _GeoJSONGeometryCollectionBaseSchema = GeoJSONBaseSchema.extend({
    type: z.literal("GeometryCollection"),
    coordinates: z.never({ message: "GeoJSON geometry collection cannot have a 'coordinates' key" }).optional(),
    geometry: z.never({ message: "GeoJSON geometry collection cannot have a 'geometry' key" }).optional(),
    properties: z.never({ message: "GeoJSON geometry collection cannot have a 'properties' key" }).optional(),
    features: z.never({ message: "GeoJSON geometry collection cannot have a 'features' key" }).optional(),
});

export const GeoJSONGeometryCollectionGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    _GeoJSONGeometryCollectionBaseSchema
        .extend({
            geometries: _GeoJSONSimpleGeometryGenericSchema(positionSchema).array(),
        })
        .passthrough()
        .superRefine((val, ctx) => {
            if (!val.geometries.length) {
                return;
            }

            // Type-cast is safe, but necessary because the type of val is not inferred correctly due to the generics
            if (!validGeometryCollectionDimension(val as ValidatableGeometryCollection)) {
                ctx.addIssue(INVALID_GEOMETRY_COLLECTION_DIMENSION_ISSUE);
                return;
            }

            // Type-cast is safe, but necessary because the type of val is not inferred correctly due to the generics
            if (!validGeometryCollectionBbox(val as ValidatableGeometryCollection)) {
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
