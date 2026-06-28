import { IndexedGrid, MergeAxes, Shape } from "./types";

/**
 * Collapses runs of same-color cells into single elongated shapes.
 * Columns take priority when both axes are enabled (cells already
 * consumed by a column run are skipped for row merging).
 */
export function mergeAdjacent(grid: IndexedGrid, axes: MergeAxes): Shape[] {
  const { cols, rows, indices, cellW, cellH } = grid;
  const consumed: boolean[][] = indices.map((row) => row.map(() => false));
  const shapes: Shape[] = [];

  if (axes.columns) {
    for (let col = 0; col < cols; col++) {
      let row = 0;
      while (row < rows) {
        const colorIndex = indices[row][col];
        let runEnd = row + 1;
        while (runEnd < rows && indices[runEnd][col] === colorIndex) runEnd++;
        const runLength = runEnd - row;
        if (runLength > 1) {
          for (let r = row; r < runEnd; r++) consumed[r][col] = true;
          shapes.push({
            cx: (col + 0.5) * cellW,
            cy: (row + runLength / 2) * cellH,
            w: cellW,
            h: cellH * runLength,
            colorIndex,
          });
        }
        row = runEnd;
      }
    }
  }

  if (axes.rows) {
    for (let row = 0; row < rows; row++) {
      let col = 0;
      while (col < cols) {
        if (consumed[row][col]) {
          col++;
          continue;
        }
        const colorIndex = indices[row][col];
        let runEnd = col + 1;
        while (runEnd < cols && !consumed[row][runEnd] && indices[row][runEnd] === colorIndex) runEnd++;
        const runLength = runEnd - col;
        if (runLength > 1) {
          for (let c = col; c < runEnd; c++) consumed[row][c] = true;
          shapes.push({
            cx: (col + runLength / 2) * cellW,
            cy: (row + 0.5) * cellH,
            w: cellW * runLength,
            h: cellH,
            colorIndex,
          });
        }
        col = runEnd;
      }
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (consumed[row][col]) continue;
      shapes.push({
        cx: (col + 0.5) * cellW,
        cy: (row + 0.5) * cellH,
        w: cellW,
        h: cellH,
        colorIndex: indices[row][col],
      });
    }
  }

  return shapes;
}
