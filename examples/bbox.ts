import { GeoJSON2DBbox, GeoJSON3DBbox } from "../src/bbox";

export const bbox2D = [0.0, 0.0, 1.0, 1.0] satisfies GeoJSON2DBbox;

export const bbox3D = [0.0, 0.0, 1.0, 1.0, 2.0, 2.0] satisfies GeoJSON3DBbox;
