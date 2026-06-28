import { Grid, IndexedGrid, RGB } from "./types";

function distSq(a: RGB, b: RGB): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

/** Simple k-means clustering over the grid's cell colors. */
export function quantize(grid: Grid, colorCount: number, contrast: number): IndexedGrid {
  const samples: RGB[] = [];
  for (const row of grid.colors) {
    for (const c of row) samples.push(applyContrast(c, contrast));
  }

  const k = Math.min(colorCount, samples.length);
  let centroids = pickInitialCentroids(samples, k);

  for (let iter = 0; iter < 8; iter++) {
    const sums = centroids.map(() => [0, 0, 0, 0]);
    for (const s of samples) {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < centroids.length; i++) {
        const d = distSq(s, centroids[i]);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      sums[best][0] += s[0];
      sums[best][1] += s[1];
      sums[best][2] += s[2];
      sums[best][3] += 1;
    }
    centroids = centroids.map((c, i) =>
      sums[i][3] > 0
        ? ([
            Math.round(sums[i][0] / sums[i][3]),
            Math.round(sums[i][1] / sums[i][3]),
            Math.round(sums[i][2] / sums[i][3]),
          ] as RGB)
        : c,
    );
  }

  const indices: number[][] = grid.colors.map((row) =>
    row.map((c) => {
      const adjusted = applyContrast(c, contrast);
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < centroids.length; i++) {
        const d = distSq(adjusted, centroids[i]);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      return best;
    }),
  );

  return {
    cols: grid.cols,
    rows: grid.rows,
    cellW: grid.cellW,
    cellH: grid.cellH,
    palette: centroids,
    indices,
  };
}

function applyContrast(c: RGB, contrast: number): RGB {
  // contrast in [0, 100], 50 = neutral
  const factor = (contrast - 50) / 50; // -1 .. 1
  const adjust = (v: number) => {
    const centered = v - 128;
    return clamp(centered * (1 + factor) + 128);
  };
  return [adjust(c[0]), adjust(c[1]), adjust(c[2])];
}

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function pickInitialCentroids(samples: RGB[], k: number): RGB[] {
  // Deterministic spread: pick evenly spaced samples after sorting by luminance.
  const sorted = [...samples].sort((a, b) => luminance(a) - luminance(b));
  const centroids: RGB[] = [];
  for (let i = 0; i < k; i++) {
    const idx = Math.floor((i / Math.max(1, k - 1)) * (sorted.length - 1));
    centroids.push(sorted[idx]);
  }
  return centroids;
}

function luminance(c: RGB): number {
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/** Reassign every cell whose current palette color is replaced by a custom hex edit. */
export function withPaletteOverride(grid: IndexedGrid, paletteIndex: number, color: RGB): IndexedGrid {
  const palette = grid.palette.slice();
  palette[paletteIndex] = color;
  return { ...grid, palette };
}
