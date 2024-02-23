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

This library also exposes schemas for the individual GeoJSON types:

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

## Contributing

If you find any issues with the schemas or want to add new features, feel free to open an issue or a pull request.
