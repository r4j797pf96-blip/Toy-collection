"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sampleGrid } from "@/lib/sampleGrid";
import { quantize } from "@/lib/quantize";
import { mergeAdjacent } from "@/lib/mergeAdjacent";
import { renderToCanvas, renderToSvg } from "@/lib/render";
import { IndexedGrid, Params, RGB, ShapePrimitive } from "@/lib/types";

const DEFAULT_PARAMS: Params = {
  cols: 32,
  colorCount: 12,
  contrast: 50,
  shape: "circle",
  mergeAxes: { rows: false, columns: false },
  background: [245, 239, 230],
};

function hexToRgb(hex: string): RGB {
  const v = hex.replace("#", "");
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

function rgbToHexInput([r, g, b]: RGB): string {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

export default function Editor() {
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);
  const [paletteOverride, setPaletteOverride] = useState<RGB[] | null>(null);
  const [autoGrid, setAutoGrid] = useState<IndexedGrid | null>(null);

  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageEl(img);
      setPaletteOverride(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  // Recompute the full pipeline whenever the image or grid/quantize params change.
  useEffect(() => {
    if (!imageEl || !sourceCanvasRef.current) return;
    const canvas = sourceCanvasRef.current;
    canvas.width = imageEl.naturalWidth;
    canvas.height = imageEl.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(imageEl, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const grid = sampleGrid(imageData, params.cols);
    const indexed = quantize(grid, params.colorCount, params.contrast);
    setAutoGrid(indexed);
  }, [imageEl, params.cols, params.colorCount, params.contrast]);

  const activeGrid: IndexedGrid | null = useMemo(() => {
    if (!autoGrid) return null;
    if (!paletteOverride) return autoGrid;
    return { ...autoGrid, palette: paletteOverride };
  }, [autoGrid, paletteOverride]);

  // Re-render shapes whenever the quantized grid, merge rules, shape, or background change.
  useEffect(() => {
    if (!activeGrid || !outputCanvasRef.current || !imageEl) return;
    const shapes = mergeAdjacent(activeGrid, params.mergeAxes);
    const canvas = outputCanvasRef.current;
    canvas.width = imageEl.naturalWidth;
    canvas.height = imageEl.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderToCanvas(ctx, canvas.width, canvas.height, shapes, activeGrid.palette, params.background, params.shape);
  }, [activeGrid, params.mergeAxes, params.shape, params.background, imageEl]);

  const updateParam = <K extends keyof Params>(key: K, value: Params[K]) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const updateSwatch = (index: number, hex: string) => {
    if (!autoGrid) return;
    const base = paletteOverride ?? autoGrid.palette;
    const next = base.slice();
    next[index] = hexToRgb(hex);
    setPaletteOverride(next);
  };

  const resetPalette = () => setPaletteOverride(null);

  const exportPng = () => {
    const canvas = outputCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "autoportrait.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const exportSvg = () => {
    if (!activeGrid || !imageEl) return;
    const shapes = mergeAdjacent(activeGrid, params.mergeAxes);
    const svg = renderToSvg(
      imageEl.naturalWidth,
      imageEl.naturalHeight,
      shapes,
      activeGrid.palette,
      params.background,
      params.shape,
    );
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "autoportrait.svg";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold">AutoPortrait</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-dashed rounded-lg p-2 flex items-center justify-center min-h-[300px] bg-neutral-50">
          {imageEl ? (
            <canvas ref={sourceCanvasRef} className="max-w-full max-h-[500px] object-contain" />
          ) : (
            <button
              className="text-sm text-neutral-500 underline"
              onClick={() => fileInputRef.current?.click()}
            >
              Click to upload a portrait
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
        <div className="border rounded-lg p-2 flex items-center justify-center min-h-[300px] bg-neutral-50">
          <canvas ref={outputCanvasRef} className="max-w-full max-h-[500px] object-contain" />
        </div>
      </div>

      {imageEl && (
        <div
          className="border rounded-lg p-2 text-center text-sm text-neutral-500 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          Click either panel to upload a different image
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Control label="Grid columns" value={params.cols}>
          <input
            type="range"
            min={8}
            max={100}
            value={params.cols}
            onChange={(e) => updateParam("cols", Number(e.target.value))}
            className="w-full"
          />
        </Control>

        <Control label="Colors" value={params.colorCount}>
          <input
            type="range"
            min={2}
            max={24}
            value={params.colorCount}
            onChange={(e) => updateParam("colorCount", Number(e.target.value))}
            className="w-full"
          />
        </Control>

        <Control label="Contrast" value={params.contrast}>
          <input
            type="range"
            min={0}
            max={100}
            value={params.contrast}
            onChange={(e) => updateParam("contrast", Number(e.target.value))}
            className="w-full"
          />
        </Control>

        <Control label="Background">
          <input
            type="color"
            value={rgbToHexInput(params.background)}
            onChange={(e) => updateParam("background", hexToRgb(e.target.value))}
            className="w-full h-9"
          />
        </Control>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <fieldset className="flex gap-2">
          <legend className="text-xs text-neutral-500 mb-1">Shape</legend>
          {(["circle", "capsule", "square", "line"] as ShapePrimitive[]).map((s) => (
            <button
              key={s}
              onClick={() => updateParam("shape", s)}
              className={`px-3 py-1.5 rounded text-sm border ${
                params.shape === s ? "bg-black text-white" : "bg-white"
              }`}
            >
              {s}
            </button>
          ))}
        </fieldset>

        <fieldset className="flex gap-3 items-center">
          <legend className="text-xs text-neutral-500 mb-1">Merge same colors</legend>
          <label className="text-sm flex items-center gap-1">
            <input
              type="checkbox"
              checked={params.mergeAxes.columns}
              onChange={(e) =>
                updateParam("mergeAxes", { ...params.mergeAxes, columns: e.target.checked })
              }
            />
            Columns
          </label>
          <label className="text-sm flex items-center gap-1">
            <input
              type="checkbox"
              checked={params.mergeAxes.rows}
              onChange={(e) => updateParam("mergeAxes", { ...params.mergeAxes, rows: e.target.checked })}
            />
            Rows
          </label>
        </fieldset>

        <div className="flex gap-2">
          <button onClick={exportPng} className="px-3 py-1.5 rounded text-sm border bg-white" disabled={!imageEl}>
            Download PNG
          </button>
          <button onClick={exportSvg} className="px-3 py-1.5 rounded text-sm border bg-white" disabled={!imageEl}>
            Download SVG
          </button>
        </div>
      </div>

      {activeGrid && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium">Palette</h2>
            <button onClick={resetPalette} className="text-xs underline text-neutral-500">
              Revert to auto palette
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {activeGrid.palette.map((color, i) => (
              <label key={i} className="flex items-center gap-2 border rounded px-2 py-1 text-xs">
                <input
                  type="color"
                  value={rgbToHexInput(color)}
                  onChange={(e) => updateSwatch(i, e.target.value)}
                  className="w-6 h-6 shrink-0"
                />
                {rgbToHexInput(color)}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Control({
  label,
  value,
  children,
}: {
  label: string;
  value?: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs text-neutral-500 mb-1">
        <span>{label}</span>
        {value !== undefined && <span>{value}</span>}
      </div>
      {children}
    </div>
  );
}
