import { z } from "zod";
import { GeoJSONGeometryBaseGenericSchemaType } from "./helper/base";
import { GeoJSONSimpleGeometryGenericSchema, GeoJSONSimpleGeometryGenericSchemaType } from "./helper/simple";
import { GeoJSONGeometryTypeSchema } from "./helper/type";
import { INVALID_BBOX_ISSUE, validBboxForCollection } from "./validation/bbox";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "../position";
import { GeoJSONBaseSchema, GeoJSONBaseSchemaInnerType } from "../base";
import { INVALID_GEOMETRY_COLLECTION_DIMENSION_ISSUE, validDimensionsForCollection } from "./validation/dimension";

type GeoJSONGeometryCollectionGenericSchemaInnerType<P extends GeoJSONPosition> = GeoJSONBaseSchemaInnerType & {
    type: z.ZodLiteral<typeof GeoJSONGeometryTypeSchema.enum.GeometryCollection>;
    coordinates: z.ZodOptional<z.ZodNever>;
    geometry: z.ZodOptional<z.ZodNever>;
    properties: z.ZodOptional<z.ZodNever>;
    features: z.ZodOptional<z.ZodNever>;
    geometries: z.ZodArray<GeoJSONSimpleGeometryGenericSchemaType<P>>;
};

export type GeoJSONGeometryCollectionGenericSchemaType<P extends GeoJSONPosition> =
    GeoJSONGeometryBaseGenericSchemaType<GeoJSONGeometryCollectionGenericSchemaInnerType<P>>;

export const GeoJSONGeometryCollectionGenericSchema = <P extends GeoJSONPosition>(
    positionSchema: z.ZodSchema<P>,
): GeoJSONGeometryCollectionGenericSchemaType<P> =>
    GeoJSONBaseSchema.extend({
        type: z.literal(GeoJSONGeometryTypeSchema.enum.GeometryCollection),
        coordinates: z.never({ message: "GeoJSON geometry collection cannot have a 'coordinates' key" }).optional(),
        geometry: z.never({ message: "GeoJSON geometry collection cannot have a 'geometry' key" }).optional(),
        properties: z.never({ message: "GeoJSON geometry collection cannot have a 'properties' key" }).optional(),
        features: z.never({ message: "GeoJSON geometry collection cannot have a 'features' key" }).optional(),
        // > The value of "geometries" is an array. Each element of this array is a
        //   GeoJSON Geometry object. It is possible for this array to be empty. (RFC 7946, section 3.1.8)
        // > To maximize interoperability, implementations SHOULD avoid nested
        //    GeometryCollections. (RFC 7946, section 3.1.8)
        geometries: GeoJSONSimpleGeometryGenericSchema(positionSchema).array(),
    })
        .passthrough()
        .superRefine((val, ctx) => {
            if (!val.geometries.length) {
                return;
            }
            if (!validDimensionsForCollection(val)) {
                ctx.addIssue(INVALID_GEOMETRY_COLLECTION_DIMENSION_ISSUE);
                return;
            }
            if (!validBboxForCollection(val)) {
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
