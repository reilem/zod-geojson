# Zod GeoJSON

<a href="https://github.com/reilem/zod-geojson/actions/workflows/checks.yaml"><img src="https://github.com/reilem/zod-geojson/actions/workflows/checks.yaml/badge.svg?branch=main"/></a>
<a href="https://www.npmjs.com/package/zod-geojson"><img src="https://img.shields.io/npm/dm/zod-geojson" alt="License"/></a>
<a href="https://github.com/reilem/zod-geojson/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/zod-geojson" alt="License"/></a>
<a href="https://github.com/reilem/zod-geojson"><img src="https://img.shields.io/github/stars/reilem/zod-geojson" alt="License"/></a>

This repository contains GeoJSON schemas for the [Zod](https://github.com/colinhacks/zod) validation library by [@colinhacks](https://x.com/colinhacks).

The schemas are based on the GeoJSON specification RFC 7946. They validate the structure of the GeoJSON objects and types, as well as the validity of the dimensions, geometries, and bounding boxes.

The schemas and inferred types are designed to be fully compatible with the
[@types/geojson](https://www.npmjs.com/package/@types/geojson) TypeScript types.

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

### Strict Position Typing

To maintain "out of the box" compatibility with [@types/geojson](https://www.npmjs.com/package/@types/geojson) the
general schemas allow any position dimensionality.

```typescript
import { GeoJSONPoint } from "zod-geojson";

// These are all valid
const point3D: GeoJSONPoint = { type: "Point", coordinates: [0, 0, 0] };
const point1D: GeoJSONPoint = { type: "Point", coordinates: [0] };
const point0D: GeoJSONPoint = { type: "Point", coordinates: [] };
const point4D: GeoJSONPoint = { type: "Point", coordinates: [0, 0, 0, 0] };
```

If you want strict position checking at compile time then you can use the provided 2D and 3D schemas/types.

```typescript
import type {
    // 2D GeoJSON
    GeoJSON2DFeatureSchema,
    GeoJSON2DFeature,
    // ...
    // 2D GeoJSON Geometries
    GeoJSON2DPointSchema,
    GeoJSON2DPoint,
    // ...
    // 3D GeoJSON
    GeoJSON3DFeatureSchema,
    GeoJSON3DFeature,
    // ...
    // 3D GeoJSON Geometries
    GeoJSON3DPointSchema,
    GeoJSON3DPoint,
    // ...
} from "zod-geojson";
```

These use zod tuples to ensure positions are checked at compile time. However, to maintain interoperability
with `@types/geojson`, bounding box dimensionality is not enforced at the type level, only during runtime validation.

```typescript
import { GeoJSON2DPoint } from "zod-geojson";

const point3D: GeoJSON2DPoint = {
    type: "Point",
    // This is a 3D position, and so errors during compilation!
    coordinates: [0, 0, 0],
};

const point2DWith3DBBox: GeoJSON2DPoint = {
    type: "Point",
    coordinates: [1.0, 2.0],
    bbox: [0.0, 0.0, 3.0, 4.0, 0.0, 0.0], // This is allowed at type level, but will error during validation!
};
```

## Customizing Schemas

Each GeoJSON schema in this library has a generic version that allows you to customize certain aspects
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
custom schemas. These are the following "default" main schemas that you can use if you do not wish to customize
a certain aspect of the schema:

- `GeoJSONPositionSchema` - The main GeoJSON position schema which allows both 2D and 3D positions
- `GeoJSONPropertiesSchema` - The main GeoJSON properties schema which allows any valid JSON object or `null`
- `GeoJSONGeometrySchema` - The main GeoJSON geometry schema which allows all valid GeoJSON geometries with 2D or 3D coordinates

### Custom Dimensions

If you wish to use a different dimension (e.g. 4D geometries), you can pass a custom `position` schema
as the first parameter to the generic schema functions.

As discussed above, if you only wish to customize the `position` field, you will still need to pass valid schemas for
the `properties` and `geometries` fields. You can use the default `GeoJSONPropertiesSchema` properties schema and you will need to
create & pass a custom geometry schema that uses your custom position schema.

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

As discussed above, if you only wish to customize the `properties` field, you will still need to pass valid schemas for the
`positions` and `geometries` fields. You can use the default schemas `GeoJSONPositionSchema` and `GeoJSONGeometrySchema` exposed
by this library for this purpose.

```typescript
import {
    GeoJSONFeatureGenericSchema,
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSONGeometrySchema,
} from "zod-geojson";

const NonNullPropertiesGeoJSONFeatureSchema = GeoJSONFeatureGenericSchema(
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema.unwrap(),
    GeoJSONGeometrySchema,
);
type NonNullPropertiesGeoJSONFeature = z.infer<typeof NonNullPropertiesGeoJSONFeatureSchema>;

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

As discussed above, if you only wish to customize the `geometries` field, you will still need to pass valid schemas for the
`positions` and `properties`. You can use the default schemas `GeoJSONPositionSchema` and `GeoJSONPropertiesSchema` exposed
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

### Nullable Geometries

By default, the `geometry` field of a GeoJSON Feature is defined as a non-nullable GeoJSON geometry object. This
decision was made to improve interoperability with [@types/geojson](https://www.npmjs.com/package/@types/geojson) which
defines the `geometry` field as non-nullable in the main `GeoJSON` type.

If you want to allow `null` values in feature `geometry` fields you can create a custom nullable geometry schema and
pass this schema as the third parameter to the `GeoJSONFeatureGenericSchema`, `GeoJSONFeatureCollectionGenericSchema`
or `GeoJSONGenericSchema` functions.

```typescript
import {
    GeoJSONFeatureGenericSchema,
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSONGeometrySchema,
} from "zod-geojson";

const GeoJSONFeatureWithNullableGeometrySchema = GeoJSONFeatureGenericSchema(
    GeoJSONPositionSchema,
    GeoJSONPropertiesSchema,
    GeoJSONGeometrySchema.nullable(),
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

### Large Inferred Types

The inferred types from the main schemas (e.g. `GeoJSON`) are quite large due to the nested unions and the recursive
nature of the geometry collections. Since the inferred zod types only see
the full union of all possible types, without knowing the names of the intermediate schemas, the resulting types show
every single possible combination of the subtypes. This can lead to very large types that can be hard to read. Unfortunately,
I have not found a way to reduce the size of the inferred types while still maintaining the full validation. If
you know of a way to improve this, please open an issue or a pull request.

In the meantime, if you really need a smaller type you can always create a custom schema that only contains the
geometry types that you need. See "Custom Geometries" section for more details.

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
