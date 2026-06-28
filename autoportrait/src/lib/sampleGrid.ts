import { Grid, RGB } from "./types";

/**
 * Averages pixel colors inside each grid cell of the source image.
 * Grid is sized to keep cells roughly square, derived from `cols`.
 */
export function sampleGrid(imageData: ImageData, cols: number): Grid {
  const { width, height, data } = imageData;
  const cellW = width / cols;
  const rows = Math.max(1, Math.round(height / cellW));
  const actualCellH = height / rows;

  const colors: RGB[][] = [];
  for (let row = 0; row < rows; row++) {
    const rowColors: RGB[] = [];
    const y0 = Math.floor(row * actualCellH);
    const y1 = Math.min(height, Math.floor((row + 1) * actualCellH));
    for (let col = 0; col < cols; col++) {
      const x0 = Math.floor(col * cellW);
      const x1 = Math.min(width, Math.floor((col + 1) * cellW));
      rowColors.push(averageColor(data, width, x0, y0, x1, y1));
    }
    colors.push(rowColors);
  }

  return { cols, rows, cellW, cellH: actualCellH, colors };
}

function averageColor(
  data: Uint8ClampedArray,
  width: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): RGB {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * 4;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
  }
  if (count === 0) return [255, 255, 255];
  return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
}
