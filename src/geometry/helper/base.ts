import * as z from "zod/v4";
import { GeoJSONBaseSchema } from "../../base";
import { GeoJSONAnyPosition } from "../position";

export const GeoJSONGeometryBaseSchema = <P extends GeoJSONAnyPosition>(positionSchema: z.ZodType<P>) =>
    z.looseObject({
        ...GeoJSONBaseSchema(positionSchema).shape,
        geometry: z.never({ error: "GeoJSON geometry cannot have a 'geometry' key" }).optional(),
        properties: z.never({ error: "GeoJSON geometry cannot have a 'properties' key" }).optional(),
        features: z.never({ error: "GeoJSON geometry cannot have a 'features' key" }).optional(),
        geometries: z.never({ error: "GeoJSON geometry cannot have a 'geometries' key" }).optional(),
    });
