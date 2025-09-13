import { z } from "zod/v4";
import { GeoJSONBaseSchema } from "../base";
import { GeoJSONSimpleGeometryGenericSchema } from "./helper/simple";
import { GeoJSON2DPositionSchema, GeoJSON3DPositionSchema, GeoJSONPosition, GeoJSONPositionSchema } from "./position";
import { GeoJSONGeometryTypeSchema } from "./type";
import { getInvalidBBoxIssue, validBboxForCollection } from "./validation/bbox";
import { getInvalidGeometryCollectionDimensionIssue, validDimensionsForCollection } from "./validation/dimension";

export const GeoJSONGeometryCollectionGenericSchema = <P extends GeoJSONPosition>(positionSchema: z.ZodSchema<P>) =>
    z
        .looseObject({
            ...GeoJSONBaseSchema(positionSchema).shape,
            type: z.literal(GeoJSONGeometryTypeSchema.enum.GeometryCollection),
            coordinates: z.never({ error: "GeoJSON geometry collection cannot have a 'coordinates' key" }).optional(),
            geometry: z.never({ error: "GeoJSON geometry collection cannot have a 'geometry' key" }).optional(),
            properties: z.never({ error: "GeoJSON geometry collection cannot have a 'properties' key" }).optional(),
            features: z.never({ error: "GeoJSON geometry collection cannot have a 'features' key" }).optional(),
            // > The value of "geometries" is an array. Each element of this array is a
            //   GeoJSON Geometry object. It is possible for this array to be empty. (RFC 7946, section 3.1.8)
            // > To maximize interoperability, implementations SHOULD avoid nested
            //    GeometryCollections. (RFC 7946, section 3.1.8)
            geometries: GeoJSONSimpleGeometryGenericSchema(positionSchema).array(),
        })
        .check((ctx) => {
            // Skip remaining checks if geometries array is empty
            if (!ctx.value.geometries.length) {
                return;
            }
            if (!validDimensionsForCollection(ctx.value)) {
                ctx.issues.push(getInvalidGeometryCollectionDimensionIssue(ctx));
            }
            if (!validBboxForCollection(ctx.value)) {
                ctx.issues.push(getInvalidBBoxIssue(ctx));
            }
        });

export const GeoJSONGeometryCollectionSchema = GeoJSONGeometryCollectionGenericSchema(GeoJSONPositionSchema);
export type GeoJSONGeometryCollection = z.infer<typeof GeoJSONGeometryCollectionSchema>;

export const GeoJSON2DGeometryCollectionSchema = GeoJSONGeometryCollectionGenericSchema(GeoJSON2DPositionSchema);
export type GeoJSON2DGeometryCollection = z.infer<typeof GeoJSON2DGeometryCollectionSchema>;

export const GeoJSON3DGeometryCollectionSchema = GeoJSONGeometryCollectionGenericSchema(GeoJSON3DPositionSchema);
export type GeoJSON3DGeometryCollection = z.infer<typeof GeoJSON3DGeometryCollectionSchema>;
