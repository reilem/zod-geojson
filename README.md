# Zod GeoJSON

<a href="https://github.com/reilem/zod-geojson/actions/workflows/checks.yaml"><img src="https://github.com/reilem/zod-geojson/actions/workflows/checks.yaml/badge.svg?branch=main"/></a>
<a href="https://www.npmjs.com/package/zod-geojson"><img src="https://img.shields.io/npm/dm/zod-geojson" alt="License"/></a>
<a href="https://github.com/reilem/zod-geojson/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/zod-geojson" alt="License"/></a>
<a href="https://github.com/reilem/zod-geojson"><img src="https://img.shields.io/github/stars/reilem/zod-geojson" alt="License"/></a>

This repository contains GeoJSON schemas for the [Zod](https://github.com/colinhacks/zod) validation library by [@colinhacks](https://x.com/colinhacks). Now compatible with Zod v4!

The schemas are based on the GeoJSON specification [RFC 7946](https://datatracker.ietf.org/doc/html/rfc7946). The
schemas validate the structure of the GeoJSON objects, types, and the validity of the dimensions, geometries and
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
    GeoJSONSchema,
    GeoJSONFeatureSchema,
    GeoJSONFeatureCollectionSchema,
    // Geometries
    GeoJSONGeometrySchema,
    GeoJSONGeometryCollectionSchema,
    GeoJSONMultiPolygonSchema,
    GeoJSONMultiLineStringSchema,
    GeoJSONMultiPointSchema,
    GeoJSONPolygonSchema,
    GeoJSONLineStringSchema,
    GeoJSONPointSchema,
    // Utilities
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema,
} from "zod-geojson";
```

It also exposes the resulting types from the schemas:

```typescript
import type {
    GeoJSON,
    GeoJSONFeature,
    GeoJSONFeatureCollection,
    // Geometries
    GeoJSONGeometry,
    GeoJSONGeometryCollection,
    GeoJSONMultiPolygon,
    GeoJSONMultiLineString,
    GeoJSONMultiPoint,
    GeoJSONPolygon,
    GeoJSONLineString,
    GeoJSONPoint,
    // Utilities
    GeoJSONPosition,
    GeoJSONProperties,
} from "zod-geojson";
```

### Dimensionality

This library exports specific schemas for 2D and 3D GeoJSONs, and their accompanying types:

```typescript
import type {
    // 2D GeoJSON Schemas
    GeoJSON2DFeatureSchema,
    GeoJSON2DFeature,
    // ...
    // 2D GeoJSON Types
    GeoJSON2DPointSchema,
    GeoJSON2DPoint,
    // ...
    // 3D GeoJSON Schemas
    GeoJSON3DFeatureSchema,
    GeoJSON3DFeature,
    // ...
    // 3D GeoJSON Types
    GeoJSON3DPointSchema,
    GeoJSON3DPoint,
} from "zod-geojson";
```

## Customizing Schemas

Each GeoJSON schemas in this library has a generic version that allows you to customize certain aspects
of the GeoJSON validation.

```typescript
import {
    GeoJSONGenericSchema,
    GeoJSONFeatureGenericSchema,
    GeoJSONFeatureCollectionGenericSchema,
    // Geometries
    GeoJSONGeometryGenericSchema,
    GeoJSONGeometryCollectionGenericSchema,
    GeoJSONMultiPolygonGenericSchema,
    GeoJSONMultiLineStringGenericSchema,
    GeoJSONMultiPointGenericSchema,
    GeoJSONPolygonGenericSchema,
    GeoJSONLineStringGenericSchema,
    GeoJSONPointGenericSchema,
    // Utilities
    GeoJSONPositionGenericSchema,
    GeoJSONPropertiesGenericSchema,
} from "zod-geojson";
```

At geometry level you can customize:

- The dimension of the coordinates (e.g. 4D geometries)

At geojson, feature & feature collection level you can customize:

- The dimension of the coordinates (e.g. 4D geometries)
- The structure of the `properties` field
- The type of geometries allowed in the features

For example, to customize the main GeoJSON schema you would use the `GeoJSONGenericSchema` function.
This function takes three parameters:

1. A Zod schema defining the structure of the positions (coordinates)
2. A Zod schema defining the structure of the properties field
3. A Zod schema defining the structure of the geometries allowed in the GeoJSON

Even if you wish to only customize one of these aspects, you will still need to pass all three parameters to the
schema function. For convenience, this library exposes the default schemas which you can use as a base for your
custom schemas. There are the following "default" main schemas that you can use if you do not wish to customize
a certain aspect of the schema:

- `GeoJSONPositionSchema` - The main GeoJSON position schema which allows both 2D and 3D positions
- `GeoJSONPropertiesSchema` - The main GeoJSON properties schema which allows any valid JSON object or `null`
- `GeoJSONGeometrySchema` - The main GeoJSON geometry schema which allows all valid GeoJSON geometries with 2D or 3D coordinates

### Custom Dimensions

If you wish to use a different dimension (e.g. 4D geometries), you can pass a custom `position` schema
as the first parameter to the generic schema functions.

As discussed above, if you only wish to customize the `position` field, you will still need to pass valid schemas for
the `properties` and `geometries`. You can use the default schema `GeoJSONPropertiesSchema` exposed by this library for
this purpose, and you will need to create a custom geometry schema that uses your custom position schema and then
use this custom geometry schema as the third parameter.

```typescript
import { GeoJSONGeometryGenericSchema, GeoJSONPropertiesSchema } from "zod-geojson";

const GeoJSON4DPositionSchema = z.tuple([z.number(), z.number(), z.number(), z.number()]);
type GeoJSON4DPosition = z.infer<typeof GeoJSON4DPositionSchema>;

const GeoJSON4DGeometrySchema = GeoJSONGeometryGenericSchema(GeoJSON4DPositionSchema);
type GeoJSON4DGeometry = z.infer<typeof GeoJSON4DGeometrySchema>;

const GeoJSON4DSchema = GeoJSONGenericSchema(GeoJSON4DPositionSchema, GeoJSONPropertiesSchema, GeoJSON4DGeometrySchema);
type GeoJSON4D = z.infer<typeof GeoJSON4DSchema>;
```

### Custom Properties

By default, the `properties` field of a GeoJSON Feature is defined as any valid JSON object or `null`. If you want to
enforce a specific structure for the `properties` field, you can pass a custom `properties` Zod schema as the second parameter to the
`GeoJSONFeatureGenericSchema`, `GeoJSONFeatureCollectionGenericSchema`, or `GeoJSONGenericSchema` functions.

As discussed above, if you only wish to customize the properties field, you will still need to pass valid schemas for the
positions and geometries. You can use the default schemas `GeoJSONPositionSchema` and `GeoJSONGeometrySchema` exposed
by this library for this purpose.

```typescript
import { GeoJSONFeatureGenericSchema, GeoJSONPositionSchema, GeoJSONGeometrySchema } from "zod-geojson";

const CustomPropertiesSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
});
type CustomProperties = z.infer<typeof CustomPropertiesSchema>;

const CustomGeoJSONFeatureSchema = GeoJSONFeatureGenericSchema(
    GeoJSONPositionSchema,
    CustomPropertiesSchema,
    GeoJSONGeometrySchema,
);
type CustomGeoJSONFeature = z.infer<typeof CustomGeoJSONFeatureSchema>;
```

### Custom Geometries

If you want to restrict the types of geometries allowed in a GeoJSON Feature, Feature Collection or GeoJSON object,
you can pass a custom `geometry` Zod schema as the third parameter to the `GeoJSONFeatureGenericSchema`,
`GeoJSONFeatureCollectionGenericSchema`, or `GeoJSONGenericSchema` functions.

If you wish to restrict the geometry to a collection of possible geometries, you can use Zod's
[`discriminatedUnion`](https://zod.dev/?id=discriminated-unions) function to create a union of the allowed
geometry schemas and pass this union schema as the third parameter.

As discussed above, if you only wish to customize the geometries field, you will still need to pass valid schemas for the
positions and properties. You can use the default schemas `GeoJSONPositionSchema` and `GeoJSONPropertiesSchema` exposed
by this library for this purpose.

```typescript
import {
    GeoJSONFeatureGenericSchema,
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSONPointSchema,
} from "zod-geojson";

// A GeoJSON Feature that only allows Point geometries
const PointGeoJSONFeatureSchema = GeoJSONFeatureGenericSchema(
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSONPointSchema,
);
type PointGeoJSONFeature = z.infer<typeof PointGeoJSONFeatureSchema>;

const PointOrPolygonGeoJSONFeatureSchema = GeoJSONFeatureGenericSchema(
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema,
    z.discriminatedUnion("type", [GeoJSONPointSchema, GeoJSONPolygonSchema]),
);
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

### Error messages

The error messages are currently very big and not user-friendly due to the default handling of failures in
nested zod unions. If you're not using it already, I recommend using
[zod-validation-error](https://www.npmjs.com/package/zod-validation-error) to simplify the error messages.

### Nested Geometry Collections

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

### Installing

It is recommended to use [pnpm](https://pnpm.io/) to install the dependencies using the `-r` flag to install
the root and the test package dependencies.

```bash
pnpm install -r
```

### Running checks

A convenience script is provided to run all checks so you don't have to run them separately. Please ensure all tests pass if you open a pull request.

```bash
pnpm checks
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
