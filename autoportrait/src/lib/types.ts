export type RGB = [number, number, number];

export type ShapePrimitive = "circle" | "capsule" | "square" | "line";

export interface MergeAxes {
  rows: boolean;
  columns: boolean;
}

export interface Params {
  cols: number;
  colorCount: number;
  contrast: number;
  shape: ShapePrimitive;
  mergeAxes: MergeAxes;
  background: RGB;
}

export interface Grid {
  cols: number;
  rows: number;
  cellW: number;
  cellH: number;
  /** raw averaged color per cell, row-major */
  colors: RGB[][];
}

export interface IndexedGrid {
  cols: number;
  rows: number;
  cellW: number;
  cellH: number;
  palette: RGB[];
  /** palette index per cell, row-major; -1 means transparent/background */
  indices: number[][];
}

export interface Shape {
  /** center x, y in source-image pixel space */
  cx: number;
  cy: number;
  /** bounding box width/height in pixel space */
  w: number;
  h: number;
  colorIndex: number;
}
