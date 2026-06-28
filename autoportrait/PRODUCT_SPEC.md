# AutoPortrait — Product Spec (v1)

Photo-to-mosaic vectorizer. Upload a portrait, get a generative dot/shape-based
vector artwork driven by a small set of orthogonal controls, with manual
control over local detail and non-destructive parameter editing.

## Core workflow

1. **Upload** — drag-drop or file picker. Image is resized client-side to a
   working resolution; original is kept for re-sampling when params change.
2. **Auto-generate** — sensible defaults render immediately: uniform grid,
   auto-extracted palette, circle primitive.
3. **Tune** — sliders/toggles re-render live (debounced): grid density, color
   count, contrast, shape primitive, merge rules, background color.
4. **Mark detail regions (optional)** — brush over areas of the *original*
   image that should render at higher local grid density (e.g. eyes, face).
   Stored as a paint mask, not baked into the image.
5. **Refine palette** — edit individual swatch hex values, revert to
   auto-extracted palette.
6. **Export** — SVG (vector, scalable) or PNG (raster snapshot). Session
   (image + all params + region mask) can be saved/loaded as JSON.

## Functional scope (v1)

- **Image input**: drag-drop/file picker, client-side resize/normalize.
- **Grid sampler**: uniform cols×rows derived from a cell-size control,
  aspect-locked to source image.
- **Color quantization**: reduce to N colors (slider, e.g. median-cut or
  k-means), editable swatch list with hex input, "revert to auto palette."
- **Shape renderer**: pluggable primitive — circle, capsule, square/chess,
  line — pure function of (grid, palette), swappable without recomputing the
  grid.
- **Merge/blob logic**: adjacent same-color cells stretch into rounded shapes
  along selectable axes (rows / columns / diagonal ↘ / diagonal ↙).
- **Manual detail regions**: brush tool on the original image; painted areas
  get a finer local grid, composited into the single render. Stored as a
  mask (not a separate vector path) for v1.
- **Background control**: pick/lock a flat background color independent of
  the subject palette.
- **Export**: SVG and PNG. JSON session save/load as a secondary format.
- **Non-destructive editing**: every control re-renders from
  (source image, params, region mask) — no irreversible baked-in steps.

## Explicitly out of scope for v1

- Automatic face/region detection (replaced by manual brush tool).
- Physical-craft exports (bead/tile shopping lists, cross-stitch charts).
- Multi-image projects, undo history, accounts/persistence beyond local
  session JSON.

## Architecture sketch

- **Stack**: Next.js (App Router) + TypeScript, client-side only (no backend
  needed — all processing happens in-browser via Canvas/WebGL).
- **Pipeline** (pure functions, each step replays from the previous):
  1. `sampleGrid(image, cellSize, regionMask) -> Cell[][]` (color per cell,
     finer spacing inside masked regions)
  2. `quantize(cells, colorCount) -> { palette: Color[], indexed: Cell[][] }`
  3. `mergeAdjacent(indexed, axes) -> Shape[]` (collapses same-index
     neighbors into stretched shapes)
  4. `render(shapes, primitive, background) -> SVG | Canvas`
- State lives in a single params object (cell size, color count, contrast,
  primitive, merge axes, background, palette overrides, region mask) so any
  change cleanly re-runs the pipeline from the right stage.
- Region mask: a low-res alpha canvas painted by the brush tool, sampled
  during step 1 to decide per-area cell size.

## Open questions for later iterations

- Region tool: brush only in v1; polygon/lasso precision tool deferred.
- Performance ceiling for high grid densities (80×112 shown in reference) —
  may need to render via Canvas instead of live SVG DOM nodes for large grids,
  then convert to SVG only on export.
