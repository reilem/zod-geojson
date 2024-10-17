import { z } from "zod";
import { _GeoJSONSimpleGeometryGenericSchema } from "./_simple";
import { INVALID_BBOX_ISSUE } from "./validation/bbox";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "../position";
import { GeoJSONBaseSchema } from "../base";
import {
    INVALID_GEOMETRY_COLLECTION_DIMENSION_ISSUE,
    ValidatableGeometryCollection,
    validGeometryCollectionBbox,
    validGeometryCollectionDimension,
} from "./validation/collection";

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
            // > The value of "geometries" is an array. Each element of this array is a
            //   GeoJSON Geometry object. It is possible for this array to be empty. (RFC 7946, section 3.1.8)
            // > To maximize interoperability, implementations SHOULD avoid nested
            //    GeometryCollections. (RFC 7946, section 3.1.8)
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
