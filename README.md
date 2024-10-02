# Zod GeoJSON

This repository contains GeoJSON schemas for the [Zod](https://github.com/colinhacks/zod) validation library.

The schemas are based on the GeoJSON specification found in this RFC: https://datatracker.ietf.org/doc/html/rfc7946. The
schemas do not only validate the basic structure of the GeoJSON objects but also the validity of the geometries and
bounding boxes.

## Getting Started

To use these schemas, you can install the package from npm:

```bash
# With NPM
npm install zod-geojson
# With Yarn
yarn add zod-geojson
# With PNPM
pnpm add zod-geojson
```

## Usage Example

Then you can use the schemas in your code:

```typescript
import { GeoJSONSchema } from "zod-geojson";

const schema = GeoJSONSchema.parse({
    type: "Feature",
    geometry: {
        type: "Point",
        coordinates: [0, 0],
    },
    properties: {
        name: "Null Island",
    },
});
```

This library exposes schemas for the individual GeoJSON types:

```typescript
import {
    GeoJSONFeatureSchema,
    GeoJSONFeatureCollectionSchema,
    GeoJSONGeometrySchema,
    GeoJSONGeometryCollectionSchema,
    GeoJSONMultiPolygonSchema,
    GeoJSONMultiLineStringSchema,
    GeoJSONMultiPointSchema,
    GeoJSONPolygonSchema,
    GeoJSONLineStringSchema,
    GeoJSONPointSchema,
} from "zod-geojson";
```

It also exposes the resulting types from the schemas:

```typescript
import type {
    GeoJSONFeature,
    GeoJSONFeatureCollection,
    GeoJSONGeometry,
    GeoJSONGeometryCollection,
    GeoJSONMultiPolygon,
    GeoJSONMultiLineString,
    GeoJSONMultiPoint,
    GeoJSONPolygon,
    GeoJSONLineString,
    GeoJSONPoint,
} from "zod-geojson";
```

### Dimensionality

This library exports specific schemas for 2D and 3D geometries, and their accompanying types:

```typescript
import type {
    GeoJSON2DFeatureSchema,
    GeoJSON2DFeature,
    // ...
    GeoJSON2DPointSchema,
    GeoJSON2DPoint,
} from "zod-geojson";
```

If you wish the use a different dimension, the generic schemas are also exposed and you can
use them to create your own schemas and types:

```typescript
import { GeoJSONGeometryGenericSchema } from "zod-geojson";

const GeoJSON4DPositionSchema = z.tuple([z.number(), z.number(), z.number(), z.number()]);
type GeoJSON4DPosition = z.infer<typeof GeoJSON4DPositionSchema>;

const GeoJSON4DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON4DPositionSchema);
type GeoJSON4DGeometry = z.infer<typeof GeoJSON4DGeometrySchema>;
```

## Error Cases

This library will throw an error if the GeoJSON object is not valid. For example, where the coordinates type does
not match the geometry type:

```typescript
import { GeoJSONSchema } from "zod-geojson";

const schema = GeoJSONSchema.parse({
    type: "Point",
    coordinates: [[0, 0]],
});
```

It will also throw an error if the bounding box does not match the geometry:

```typescript
import { GeoJSONSchema } from "zod-geojson";

const schema = GeoJSONSchema.parse({
    type: "MultiPoint",
    coordinates: [
        [-2, 0],
        [3, 4],
        [2, -1],
    ],
    bbox: [0, 0, 1, 1],
});
```

## Shortcomings

This library does not support the validation of nested geometry collections. E.g.

```typescript
// This will fail
const schema = GeoJSONSchema.parse({
    type: "GeometryCollection",
    geometries: [
        {
            type: "GeometryCollection",
            geometries: [
                {
                    type: "Point",
                    coordinates: [0, 0],
                },
            ],
        },
    ],
    bbox: [0, 0, 1, 1],
});
```

This is per the GeoJSON RFC [recommendation](https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.8):

> To maximize interoperability, implementations SHOULD avoid nested GeometryCollections.

and also because the implementation of recursive zod schemas together with generics is quite cumbersome and would
needlessy complicate both the implementation and usage of this library. If you need to validate nested geometry
collections feel free to open an issue and we can discuss possible solutions.

## Contributing

If you find any issues with the schemas or want to add new features, feel free to open an issue or a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
